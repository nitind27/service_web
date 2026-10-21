import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    const notifications = await query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 30`,
      [user.id]
    );

    const unreadRes = await query(
      `SELECT COUNT(*) as unread_count 
       FROM notifications 
       WHERE user_id = ? AND is_read = 0`,
      [user.id]
    );

    return apiSuccess({
      notifications,
      unreadCount: unreadRes[0]?.unread_count || 0,
    }, 'Notifications fetched successfully');
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return apiError('Failed to fetch notifications', 500);
  }
}

export async function PATCH(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [user.id]);

    return apiSuccess({}, 'All notifications marked as read');
  } catch (error) {
    console.error('Mark notifications read error:', error);
    return apiError('Failed to update notifications', 500);
  }
}
