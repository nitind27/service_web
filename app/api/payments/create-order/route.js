import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { createCashfreeOrder } from '@/lib/cashfree';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request) {
  try {
    const { bookingId } = await request.json();
    if (!bookingId) {
      return apiError('Booking ID is required', 422);
    }

    const booking = await queryOne(
      `SELECT * FROM bookings WHERE id = ? OR booking_number = ? LIMIT 1`,
      [bookingId, bookingId]
    );

    if (!booking) {
      return apiError('Booking not found', 404);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cfOrderId = `CF_${booking.booking_number}_${Date.now().toString().slice(-4)}`;

    // Call Cashfree API / simulation helper
    const cfOrder = await createCashfreeOrder({
      orderId: cfOrderId,
      orderAmount: booking.total_amount,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_mobile,
      returnUrl: `${appUrl}/booking/confirmation/${booking.booking_number}?order_id={order_id}`,
    });

    if (!cfOrder.success) {
      return apiError('Failed to initiate Cashfree payment session', 500);
    }

    // Save or update payments record
    await query(
      `INSERT INTO payments (booking_id, user_id, payment_gateway, cf_order_id, payment_session_id, amount, status)
       VALUES (?, ?, 'cashfree', ?, ?, ?, 'pending')
       ON DUPLICATE KEY UPDATE cf_order_id = VALUES(cf_order_id), payment_session_id = VALUES(payment_session_id)`,
      [booking.id, booking.user_id, cfOrderId, cfOrder.paymentSessionId, booking.total_amount]
    );

    return apiSuccess({
      orderId: cfOrderId,
      paymentSessionId: cfOrder.paymentSessionId,
      bookingNumber: booking.booking_number,
      amount: booking.total_amount,
      environment: cfOrder.environment,
      isSimulated: cfOrder.isSimulated || false,
    }, 'Payment order created');
  } catch (error) {
    console.error('Create payment order error:', error);
    return apiError('Internal error creating payment order', 500);
  }
}
