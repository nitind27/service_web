import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const { id } = params;
    const { status, provider_id, notes, completion_photos, otp } = await request.json();

    const booking = await queryOne('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!booking) return apiError('Booking not found', 404);

    // Valid statuses: 'pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refund_requested'
    const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refund_requested'];
    if (status && !validStatuses.includes(status)) {
      return apiError('Invalid status', 400);
    }

    // Doorstep Service Start OTP Verification
    if (status === 'in_progress') {
      if (user.role === 'provider') {
        if (!otp || String(otp).trim() !== String(booking.service_otp).trim()) {
          return apiError('Invalid Doorstep Service OTP! Please ask the customer for their 4-digit security code before starting the job.', 400);
        }
      }
    }

    const updates = [];
    const updateParams = [];

    if (status) {
      updates.push('booking_status = ?');
      updateParams.push(status);
    }

    if (provider_id !== undefined) {
      updates.push('provider_id = ?');
      updateParams.push(provider_id);
    }

    if (notes && status === 'completed') {
      updates.push('completion_notes = ?');
      updateParams.push(notes);
    }

    if (completion_photos) {
      updates.push('completion_photos = ?');
      updateParams.push(completion_photos);
    }

    // If cancelled, handle instant wallet refund if paid
    if (status === 'cancelled' && booking.payment_status === 'paid') {
      const refundAmt = parseFloat(booking.total_amount);
      if (refundAmt > 0) {
        updates.push("payment_status = 'refunded'");
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

    // If completed, add provider earnings
    if (status === 'completed' && booking.provider_id) {
      // 85% payout to provider, 15% platform commission
      const providerEarnings = Math.round(parseFloat(booking.base_amount) * 0.85 * 100) / 100;
      await query('UPDATE providers SET total_earnings = total_earnings + ? WHERE id = ?', [providerEarnings, booking.provider_id]);

      await query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, ?, ?, 'booking')`,
        [
          booking.user_id,
          'Service Completed! ⭐ Rate Your Experience',
          `Your service for booking #${booking.booking_number} is completed. Please share your rating and review.`
        ]
      );
    }

    if (updates.length > 0) {
      updateParams.push(id);
      await query(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`, updateParams);

      // Record timeline change
      await query(
        `INSERT INTO booking_status_history (booking_id, status, notes, changed_by_user_id)
         VALUES (?, ?, ?, ?)`,
        [id, status || booking.booking_status, notes || `Status changed to ${status || 'updated'} by ${user.role}`, user.id]
      );
    }

    return apiSuccess({}, 'Booking status updated successfully');
  } catch (error) {
    console.error('Update booking status error:', error);
    return apiError('Failed to update status', 500);
  }
}
