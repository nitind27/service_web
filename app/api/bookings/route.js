import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError, generateBookingNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return apiError('Authentication required', 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const q = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const offset = (page - 1) * limit;

    let whereSql = 'WHERE 1=1';
    const params = [];

    // Role filtering
    if (user.role === 'customer') {
      whereSql += ' AND b.user_id = ?';
      params.push(user.id);
    } else if (user.role === 'provider') {
      // Find provider ID
      const provider = await queryOne('SELECT id FROM providers WHERE user_id = ?', [user.id]);
      if (!provider) {
        return apiSuccess({ bookings: [] }, 'No provider profile found');
      }
      whereSql += ' AND b.provider_id = ?';
      params.push(provider.id);
    }

    // Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        whereSql += " AND b.booking_status IN ('pending', 'confirmed', 'assigned', 'in_progress')";
      } else if (status === 'assigned') {
        whereSql += " AND b.booking_status IN ('pending', 'confirmed', 'assigned')";
      } else {
        whereSql += ' AND b.booking_status = ?';
        params.push(status);
      }
    }

    // Search query
    if (q.trim()) {
      whereSql += ' AND (b.booking_number LIKE ? OR b.customer_name LIKE ? OR s.title LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    // Count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM bookings b 
      JOIN services s ON b.service_id = s.id
      ${whereSql}
    `;
    const countRes = await query(countSql, params);
    const total = countRes[0]?.total || 0;

    // Data query
    const dataSql = `
      SELECT b.*, 
        s.title as service_title, s.thumbnail as service_thumbnail, s.slug as service_slug,
        c.name as category_name,
        p.business_name as provider_name,
        v.title as variant_title
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN categories c ON s.category_id = c.id
      LEFT JOIN providers p ON b.provider_id = p.id
      LEFT JOIN service_variants v ON b.variant_id = v.id
      ${whereSql}
      ORDER BY b.id DESC
      LIMIT ? OFFSET ?
    `;

    const bookings = await query(dataSql, [...params, limit, offset]);

    const meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };

    return apiSuccess({ bookings, ...meta }, 'Bookings retrieved successfully', 200, meta);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return apiError('Failed to fetch bookings', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();

    const {
      service_id,
      variant_id,
      customer_name,
      customer_email,
      customer_mobile,
      address_snapshot,
      address_id,
      booking_date,
      time_slot,
      special_instructions,
      coupon_code,
      use_wallet = false,
      payment_mode = 'cashfree', // 'cashfree', 'cod', or 'wallet'
    } = body;

    if (!service_id || !booking_date || !time_slot || !customer_name || !customer_mobile || !address_snapshot) {
      return apiError('Missing required booking details (service, date, time slot, contact, or address)', 422);
    }

    // Service lookup
    const service = await queryOne('SELECT * FROM services WHERE id = ?', [service_id]);
    if (!service) return apiError('Service not found', 404);

    let baseAmount = parseFloat(service.discount_price || service.base_price);
    let chosenVariantId = null;

    if (variant_id) {
      const variant = await queryOne('SELECT * FROM service_variants WHERE id = ? AND service_id = ?', [variant_id, service_id]);
      if (variant) {
        baseAmount = parseFloat(variant.discount_price || variant.price);
        chosenVariantId = variant.id;
      }
    }

    // Coupon discount logic
    let discountAmount = 0;
    if (coupon_code) {
      const coupon = await queryOne(
        `SELECT * FROM coupons WHERE code = ? AND status = 'active' AND (valid_until IS NULL OR valid_until >= CURDATE())`,
        [coupon_code.trim().toUpperCase()]
      );
      if (coupon && baseAmount >= parseFloat(coupon.min_booking_amount)) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = (baseAmount * parseFloat(coupon.discount_value)) / 100;
          if (coupon.max_discount) discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount));
        } else {
          discountAmount = parseFloat(coupon.discount_value);
        }
        discountAmount = Math.min(discountAmount, baseAmount);
        // Increment coupon count
        await query('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?', [coupon.id]);
      }
    }

    // Tax calculation (5% GST standard)
    const taxAmount = Math.round((baseAmount * 0.05) * 100) / 100;
    const convenienceFee = 49.00;
    let initialTotal = Math.max(0, Math.round((baseAmount + taxAmount + convenienceFee - discountAmount) * 100) / 100);

    const bookingNumber = generateBookingNumber();
    const userId = user?.id || 7; // Fallback to demo user if anonymous checkout allowed

    // Wallet deduction logic
    let walletUsed = 0;
    let finalPayable = initialTotal;
    let effectivePaymentMode = payment_mode;
    let paymentStatus = payment_mode === 'cod' ? 'pending' : 'pending';
    let bookingStatus = payment_mode === 'cod' ? 'confirmed' : 'pending';

    if (use_wallet && user) {
      const dbUser = await queryOne('SELECT wallet_balance FROM users WHERE id = ?', [user.id]);
      const currentWallet = parseFloat(dbUser?.wallet_balance || 0);

      if (currentWallet > 0) {
        walletUsed = Math.min(currentWallet, initialTotal);
        finalPayable = Math.round((initialTotal - walletUsed) * 100) / 100;

        const newWalletBal = Math.round((currentWallet - walletUsed) * 100) / 100;
        await query('UPDATE users SET wallet_balance = ? WHERE id = ?', [newWalletBal, user.id]);

        await query(
          `INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description)
           VALUES (?, 'debit', ?, ?, ?)`,
          [user.id, walletUsed, newWalletBal, `Paid towards booking #${bookingNumber}`]
        );

        if (finalPayable === 0) {
          effectivePaymentMode = 'wallet';
          paymentStatus = 'paid';
          bookingStatus = 'confirmed';
        }
      }
    }

    // Generate random 4-digit Doorstep Service Start OTP
    const serviceOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const insertResult = await query(
      `INSERT INTO bookings 
       (booking_number, service_otp, user_id, provider_id, service_id, variant_id, address_id, customer_name, customer_email, customer_mobile, address_snapshot, booking_date, time_slot, special_instructions, base_amount, tax_amount, discount_amount, convenience_fee, wallet_amount_used, total_amount, coupon_code, payment_mode, payment_status, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingNumber,
        serviceOtp,
        userId,
        service.provider_id || null, // Auto-assign default provider if service has one
        service_id,
        chosenVariantId,
        address_id || null,
        customer_name,
        customer_email || 'customer@jeevanseva.in',
        customer_mobile,
        address_snapshot,
        booking_date,
        time_slot,
        special_instructions || null,
        baseAmount,
        taxAmount,
        discountAmount,
        convenienceFee,
        walletUsed,
        finalPayable,
        coupon_code || null,
        effectivePaymentMode,
        paymentStatus,
        bookingStatus,
      ]
    );

    const bookingId = insertResult.insertId;

    // Log status history
    await query(
      `INSERT INTO booking_status_history (booking_id, status, notes, changed_by_user_id)
       VALUES (?, ?, ?, ?)`,
      [bookingId, bookingStatus, 'Booking created by customer', userId]
    );

    // Create In-App Notification for Customer
    await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, 'booking')`,
      [
        userId,
        `Booking Placed #${bookingNumber}`,
        `Your booking for "${service.title}" is ${bookingStatus}. Your Doorstep Security OTP is ${serviceOtp}. Please share this OTP with the technician only when they arrive at your location.`
      ]
    );

    // Create Notification for Provider if assigned
    if (service.provider_id) {
      const provider = await queryOne('SELECT user_id FROM providers WHERE id = ?', [service.provider_id]);
      if (provider?.user_id) {
        await query(
          `INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, ?, ?, 'booking')`,
          [
            provider.user_id,
            `New Order Assigned #${bookingNumber}`,
            `New job for "${service.title}" scheduled for ${booking_date} at ${time_slot}. Customer: ${customer_name}.`
          ]
        );
      }
    }

    return apiSuccess({
      bookingId,
      bookingNumber,
      serviceOtp,
      walletUsed,
      totalAmount: finalPayable,
      paymentMode: effectivePaymentMode,
      bookingStatus,
    }, 'Booking created successfully', 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return apiError('Failed to process booking', 500);
  }
}
