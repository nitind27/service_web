import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      return apiError('Unauthorized', 403);
    }

    // Counts
    const userCount = await queryOne("SELECT COUNT(*) as count FROM users WHERE role_id = 4");
    const providerCount = await queryOne("SELECT COUNT(*) as count FROM providers");
    const bookingCount = await queryOne("SELECT COUNT(*) as count FROM bookings");
    const revenueSum = await queryOne("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = 'paid'");

    const pendingCount = await queryOne("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'pending'");
    const completedCount = await queryOne("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'completed'");

    // Top categories
    const topCategories = await query(
      `SELECT c.id, c.name, c.icon, COUNT(b.id) as total_bookings, COALESCE(SUM(b.total_amount), 0) as total_revenue
       FROM categories c
       LEFT JOIN services s ON s.category_id = c.id
       LEFT JOIN bookings b ON b.service_id = s.id
       GROUP BY c.id
       ORDER BY total_bookings DESC
       LIMIT 5`
    );

    // Recent 5 bookings
    const recentBookings = await query(
      `SELECT b.*, s.title as service_title, u.name as customer_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.id DESC
       LIMIT 6`
    );

    return apiSuccess({
      totalUsers: userCount?.count || 0,
      totalProviders: providerCount?.count || 0,
      totalBookings: bookingCount?.count || 0,
      totalRevenue: revenueSum?.total || 0,
      pendingBookings: pendingCount?.count || 0,
      completedBookings: completedCount?.count || 0,
      topCategories,
      recentBookings,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return apiError('Failed to fetch admin stats', 500);
  }
}
