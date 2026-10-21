import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const { booking_id, rating, review_text } = await request.json();

    if (!booking_id || !rating) {
      return apiError('Booking ID and rating (1-5) are required', 422);
    }

    const booking = await queryOne(
      'SELECT id, service_id, provider_id, user_id, booking_status FROM bookings WHERE id = ?',
      [booking_id]
    );

    if (!booking) return apiError('Booking not found', 404);
    if (booking.user_id !== user.id) return apiError('Unauthorized', 403);
    if (booking.booking_status !== 'completed') {
      return apiError('Reviews can only be submitted for completed services', 400);
    }

    // Insert or update review
    await query(
      `INSERT INTO reviews (booking_id, service_id, user_id, provider_id, rating, review_text, status)
       VALUES (?, ?, ?, ?, ?, ?, 'approved')
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), review_text = VALUES(review_text)`,
      [booking.id, booking.service_id, user.id, booking.provider_id, parseInt(rating, 10), review_text || '']
    );

    // Recalculate average rating on service
    const stats = await queryOne(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE service_id = ? AND status = "approved"',
      [booking.service_id]
    );

    if (stats) {
      await query(
        'UPDATE services SET rating = ?, total_reviews = ? WHERE id = ?',
        [parseFloat(stats.avg_rating || 5).toFixed(2), stats.count, booking.service_id]
      );
    }

    return apiSuccess({}, 'Thank you for your rating and review!', 201);
  } catch (error) {
    console.error('Review submit error:', error);
    return apiError('Failed to submit review', 500);
  }
}
