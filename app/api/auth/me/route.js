import { getAuthUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authData = getAuthUser(request);
    if (!authData || !authData.id) {
      return apiSuccess({ user: null }, 'Not authenticated');
    }

    const user = await queryOne(
      `SELECT u.id, u.name, u.email, u.mobile, u.city, u.profile_image, u.wallet_balance, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? AND u.status = 'active'
       LIMIT 1`,
      [authData.id]
    );

    if (!user) {
      return apiSuccess({ user: null }, 'User not found or inactive');
    }

    return apiSuccess({ user });
  } catch (error) {
    console.error('Auth Me Error:', error);
    return apiError('Failed to fetch user state', 500);
  }
}
