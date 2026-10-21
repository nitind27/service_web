import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const profile = await queryOne(
      `SELECT u.id, u.name, u.email, u.mobile, u.city, u.profile_image, u.wallet_balance, u.created_at, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [user.id]
    );

    return apiSuccess({ profile });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return apiError('Failed to fetch profile', 500);
  }
}

export async function PUT(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const { name, city, mobile, profile_image } = await request.json();

    await query(
      `UPDATE users 
       SET name = COALESCE(?, name),
           city = COALESCE(?, city),
           mobile = COALESCE(?, mobile),
           profile_image = COALESCE(?, profile_image)
       WHERE id = ?`,
      [name, city, mobile, profile_image, user.id]
    );

    return apiSuccess({}, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return apiError('Failed to update profile', 500);
  }
}
