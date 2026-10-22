import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError, generateBookingNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    const paramsObj = await Promise.resolve(params);
    const id = paramsObj?.id;
    const body = await request.json();
    const issue_description = body.issue_description;

    const booking = await queryOne(
      `SELECT b.*, s.title as service_title 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE (b.id = ? OR b.booking_number = ?) AND b.user_id = ?`,
      [id, id, user.id]
    );

    if (!booking) return apiError('Booking not found', 404);

    if (booking.booking_status !== 'completed') {
      return apiError('Warranty claims can only be raised for completed services', 400);
    }

    // Check if within 30 days
    const bookingDate = new Date(booking.created_at);
    const now = new Date();
    const diffDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return apiError('The 30-day free rework warranty period has expired for this booking', 400);
    }

    const newBookingNumber = generateBookingNumber();
    const newServiceOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create free warranty inspection booking
    const result = await query(
      `INSERT INTO bookings 
       (booking_number, service_otp, user_id, provider_id, service_id, variant_id, customer_name, customer_email, customer_mobile, address_snapshot, booking_date, time_slot, special_instructions, base_amount, tax_amount, discount_amount, convenience_fee, wallet_amount_used, total_amount, payment_mode, payment_status, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE() + INTERVAL 1 DAY, '10:00 AM - 12:00 PM', ?, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'warranty_guarantee', 'paid', 'confirmed')`,
      [
        newBookingNumber,
        newServiceOtp,
        booking.user_id,
        booking.provider_id,
        booking.service_id,
        booking.variant_id,
        booking.customer_name,
        booking.customer_email,
        booking.customer_mobile,
        booking.address_snapshot,
        `[30-Day Free Warranty Claim for #${booking.booking_number}]: ${issue_description || 'Customer requested free follow-up inspection'}`,
      ]
    );

    const newBookingId = result.insertId;

    // Send notification
    await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, 'booking')`,
      [
        user.id,
        '30-Day Free Warranty Claim Approved 🛡️',
        `Your free follow-up inspection has been scheduled under #${newBookingNumber} with 0 charges. Doorstep OTP: ${newServiceOtp}.`,
      ]
    );

    return apiSuccess({
      newBookingId,
      bookingNumber: newBookingNumber,
      serviceOtp: newServiceOtp,
      message: '30-Day Free Rework Claim approved! A technician will inspect at zero cost.',
    }, 'Warranty inspection scheduled', 201);
  } catch (error) {
    console.error('Warranty claim error:', error);
    return apiError('Failed to process warranty claim', 500);
  }
}
