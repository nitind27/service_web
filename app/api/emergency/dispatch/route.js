import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError, generateBookingNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    const type = body.type || body.service_type || 'ambulance';
    const contact_name = body.contact_name || body.customer_name || 'Emergency Requester';
    const contact_mobile = body.contact_mobile || body.customer_mobile || '';
    const current_address = body.current_address || body.address_snapshot || body.address || '';
    const city = body.city || 'New Delhi';
    const pincode = body.pincode || '110001';
    const notes = body.notes || body.special_instructions || '';

    if (!contact_mobile || !current_address) {
      return apiError('Mobile number and address are required for emergency dispatch', 422);
    }

    // Find the emergency service
    let serviceSlug = 'emergency-ambulance-service-24x7';
    if (type === 'last_rites') {
      serviceSlug = 'complete-funeral-last-rites-assistance';
    }

    const service = await queryOne('SELECT * FROM services WHERE slug = ? LIMIT 1', [serviceSlug]);
    if (!service) {
      return apiError('Emergency service temporarily unavailable', 503);
    }

    const bookingNumber = generateBookingNumber();
    const serviceOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const userId = user?.id || 7; // Fallback to demo user if anonymous emergency

    const baseAmount = parseFloat(service.discount_price || service.base_price);
    const taxAmount = Math.round(baseAmount * 0.05 * 100) / 100;
    const totalAmount = Math.round((baseAmount + taxAmount) * 100) / 100;

    const insertResult = await query(
      `INSERT INTO bookings 
       (booking_number, service_otp, user_id, provider_id, service_id, customer_name, customer_email, customer_mobile, address_snapshot, booking_date, time_slot, special_instructions, base_amount, tax_amount, discount_amount, convenience_fee, wallet_amount_used, total_amount, payment_mode, payment_status, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'IMMEDIATE SOS (15 Mins)', ?, ?, ?, 0.00, 0.00, 0.00, ?, 'cod', 'pending', 'assigned')`,
      [
        bookingNumber,
        serviceOtp,
        userId,
        service.provider_id || 3,
        service.id,
        contact_name.trim(),
        user?.email || 'emergency@jeevanseva.in',
        contact_mobile.trim(),
        `${current_address.trim()}, ${city} - ${pincode}`,
        `[URGENT 24x7 SOS DISPATCH]: ${notes || 'Priority rapid ambulance / emergency assistance'}`,
        baseAmount,
        taxAmount,
        totalAmount,
      ]
    );

    const bookingId = insertResult.insertId;

    // Send high-priority notification
    await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, 'booking')`,
      [
        userId,
        `EMERGENCY DISPATCH INITIATED 🚨 #${bookingNumber}`,
        `Rapid response team has been alerted for ${service.title}. Estimated arrival within 15-20 minutes. Security OTP: ${serviceOtp}. Helpline: 1800-123-5338.`,
      ]
    );

    return apiSuccess({
      bookingId,
      bookingNumber,
      serviceOtp,
      etaMinutes: 15,
      serviceTitle: service.title,
      totalAmount,
      helpline: '1800-123-5338',
      message: 'Emergency unit dispatched! Crew is en route to your location.',
    }, 'Emergency dispatch triggered', 201);
  } catch (error) {
    console.error('Emergency dispatch API error:', error);
    return apiError('Failed to trigger emergency dispatch', 500);
  }
}
