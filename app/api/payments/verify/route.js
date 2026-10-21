import { query, queryOne } from '@/lib/db';
import { getCashfreeOrderStatus } from '@/lib/cashfree';
import { apiSuccess, apiError } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId, bookingNumber } = await request.json();
    if (!orderId && !bookingNumber) {
      return apiError('Order ID or Booking Number is required', 422);
    }

    // Lookup payment
    let payment = null;
    if (orderId) {
      payment = await queryOne('SELECT * FROM payments WHERE cf_order_id = ? LIMIT 1', [orderId]);
    }
    if (!payment && bookingNumber) {
      const booking = await queryOne('SELECT id FROM bookings WHERE booking_number = ? LIMIT 1', [bookingNumber]);
      if (booking) {
        payment = await queryOne('SELECT * FROM payments WHERE booking_id = ? ORDER BY id DESC LIMIT 1', [booking.id]);
      }
    }

    if (!payment) {
      return apiError('Payment record not found', 404);
    }

    // Check with Cashfree
    const cfStatus = await getCashfreeOrderStatus(payment.cf_order_id || orderId);

    if (cfStatus.success && (cfStatus.orderStatus === 'PAID' || cfStatus.isSimulated)) {
      const txnId = `TXN_CF_${Date.now()}`;

      // Update payment
      await query(
        `UPDATE payments 
         SET status = 'success', transaction_id = ?, raw_response = ? 
         WHERE id = ?`,
        [txnId, JSON.stringify(cfStatus.rawData || { simulated: true }), payment.id]
      );

      // Update booking
      await query(
        `UPDATE bookings 
         SET payment_status = 'paid', booking_status = 'confirmed' 
         WHERE id = ?`,
        [payment.booking_id]
      );

      // Add status history
      await query(
        `INSERT INTO booking_status_history (booking_id, status, notes)
         VALUES (?, 'confirmed', 'Payment verified successfully via Cashfree')`,
        [payment.booking_id]
      );

      return apiSuccess({
        verified: true,
        status: 'PAID',
        transactionId: txnId,
      }, 'Payment verified successfully');
    } else {
      return apiError('Payment not completed or failed', 400);
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    return apiError('Failed to verify payment', 500);
  }
}

export async function GET(request) {
  // Cashfree GET redirect handler
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!orderId) {
    return NextResponse.redirect(`${appUrl}/user/bookings`);
  }

  try {
    const payment = await queryOne('SELECT * FROM payments WHERE cf_order_id = ? LIMIT 1', [orderId]);
    if (payment) {
      const booking = await queryOne('SELECT booking_number FROM bookings WHERE id = ?', [payment.booking_id]);
      if (booking) {
        return NextResponse.redirect(`${appUrl}/booking/confirmation/${booking.booking_number}?verified=true`);
      }
    }
    return NextResponse.redirect(`${appUrl}/user/bookings`);
  } catch (err) {
    return NextResponse.redirect(`${appUrl}/user/bookings`);
  }
}
