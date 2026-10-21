import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'provider' && user.role !== 'admin')) {
      return apiError('Unauthorized', 403);
    }

    const provider = await queryOne('SELECT * FROM providers WHERE user_id = ?', [user.id]);
    if (!provider) {
      return apiError('Provider profile not found', 404);
    }

    // Calculate earnings from completed bookings
    const earnings = await queryOne(
      `SELECT 
        COUNT(*) as total_completed_jobs,
        COALESCE(SUM(total_amount), 0) as gross_revenue,
        COALESCE(SUM(total_amount * (100 - ?)/100), 0) as net_earnings
       FROM bookings 
       WHERE provider_id = ? AND booking_status = 'completed'`,
      [provider.commission_rate || 15, provider.id]
    );

    // Recent payouts/transactions
    const recentPayouts = await query(
      `SELECT b.id, b.booking_number, b.total_amount, b.booking_date, s.title as service_title
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.provider_id = ? AND b.booking_status = 'completed'
       ORDER BY b.id DESC
       LIMIT 10`,
      [provider.id]
    );

    return apiSuccess({
      provider,
      stats: {
        totalJobs: earnings?.total_completed_jobs || 0,
        grossRevenue: earnings?.gross_revenue || 0,
        netEarnings: earnings?.net_earnings || 0,
        commissionRate: provider.commission_rate || 15,
        rating: provider.rating,
        totalReviews: provider.total_reviews,
      },
      recentPayouts,
    });
  } catch (error) {
    console.error('Provider earnings error:', error);
    return apiError('Failed to fetch provider earnings', 500);
  }
}
