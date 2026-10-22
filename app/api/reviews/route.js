import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('service_id');
    const userId = searchParams.get('user_id');

    let sql = `SELECT r.*, u.name as user_name, u.city as user_city, s.title as service_title
               FROM reviews r
               JOIN users u ON r.user_id = u.id
               JOIN services s ON r.service_id = s.id
               WHERE r.status = 'approved'`;
    const params = [];

    if (serviceId) {
      sql += ' AND r.service_id = ?';
      params.push(serviceId);
    }
    if (userId) {
      sql += ' AND r.user_id = ?';
      params.push(userId);
    }
    sql += ' ORDER BY r.id DESC LIMIT 20';

    const reviews = await query(sql, params);
    return apiSuccess({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return apiError('Failed to fetch reviews', 500);
  }
}

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
