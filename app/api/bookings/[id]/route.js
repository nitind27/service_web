import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const user = getAuthUser(request);
    const { id } = params;

    const booking = await queryOne(
      `SELECT b.*,
        s.title as service_title, s.thumbnail as service_thumbnail, s.slug as service_slug, s.description as service_desc,
        c.name as category_name,
        v.title as variant_title, v.duration_minutes as variant_duration,
        p.business_name as provider_name, p.rating as provider_rating, p.experience_years as provider_exp,
        u.mobile as provider_phone,
        pm.transaction_id, pm.payment_gateway, pm.payment_session_id
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN categories c ON s.category_id = c.id
       LEFT JOIN service_variants v ON b.variant_id = v.id
       LEFT JOIN providers p ON b.provider_id = p.id
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN payments pm ON pm.booking_id = b.id
       WHERE b.id = ? OR b.booking_number = ?
       LIMIT 1`,
      [id, id]
    );

    if (!booking) {
      return apiError('Booking not found', 404);
    }

    // Role check: Customer can only view their own booking
    if (user && user.role === 'customer' && booking.user_id !== user.id) {
      return apiError('Unauthorized to view this booking', 403);
    }

    // Fetch timeline history
    const history = await query(
      `SELECT * FROM booking_status_history WHERE booking_id = ? ORDER BY id ASC`,
      [booking.id]
    );

    // Fetch review if completed
    const review = await queryOne(
      `SELECT * FROM reviews WHERE booking_id = ? LIMIT 1`,
      [booking.id]
    );

    return apiSuccess({
      booking,
      history,
      review,
    });
  } catch (error) {
    console.error('Fetch booking detail error:', error);
    return apiError('Failed to fetch booking details', 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = getAuthUser(request);
    const { id } = params;
    const { action, reason } = await request.json();

    const booking = await queryOne('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!booking) return apiError('Booking not found', 404);

    if (action === 'cancel') {
      if (['completed', 'cancelled'].includes(booking.booking_status)) {
        return apiError('Cannot cancel a completed or already cancelled booking', 400);
      }

      let newPaymentStatus = booking.payment_status;

      // Handle instant wallet refund if paid
      if (booking.payment_status === 'paid') {
        const refundAmt = parseFloat(booking.total_amount);
        if (refundAmt > 0) {
          newPaymentStatus = 'refunded';
          await query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [refundAmt, booking.user_id]);
          
          const customer = await queryOne('SELECT wallet_balance FROM users WHERE id = ?', [booking.user_id]);
          await query(
            `INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description)
             VALUES (?, 'credit', ?, ?, ?)`,
            [booking.user_id, refundAmt, customer?.wallet_balance || refundAmt, `Instant refund for cancelled booking #${booking.booking_number}`]
          );

          await query(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, ?, ?, 'wallet')`,
            [
              booking.user_id,
              `Refund Credited ₹${refundAmt}`,
              `₹${refundAmt} has been refunded to your JeevanSeva Wallet for cancelled booking #${booking.booking_number}.`
            ]
          );
        }
      }

      await query(
        `UPDATE bookings 
         SET booking_status = 'cancelled', payment_status = ?, cancellation_reason = ? 
         WHERE id = ?`,
        [newPaymentStatus, reason || 'Cancelled by customer', id]
      );

      await query(
        `INSERT INTO booking_status_history (booking_id, status, notes, changed_by_user_id)
         VALUES (?, 'cancelled', ?, ?)`,
        [id, reason || 'Cancelled by customer', user?.id || null]
      );

      return apiSuccess({ refunded: newPaymentStatus === 'refunded' }, 'Booking cancelled successfully');
    }

    return apiError('Invalid action', 400);
  } catch (error) {
    console.error('Booking patch error:', error);
    return apiError('Failed to update booking', 500);
  }
}
