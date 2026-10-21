import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      return apiError('Unauthorized', 403);
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const roleId = searchParams.get('roleId') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const offset = (page - 1) * limit;

    let whereSql = 'WHERE 1=1';
    const params = [];

    if (roleId) {
      whereSql += ' AND u.role_id = ?';
      params.push(roleId);
    }

    if (q.trim()) {
      whereSql += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    const countRes = await query(`SELECT COUNT(*) as total FROM users u ${whereSql}`, params);
    const total = countRes[0]?.total || 0;

    const users = await query(
      `SELECT u.id, u.name, u.email, u.mobile, u.city, u.status, u.wallet_balance, u.created_at, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ${whereSql}
       ORDER BY u.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return apiSuccess({ users }, 'Users list', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return apiError('Failed to fetch users', 500);
  }
}

export async function PATCH(request) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return apiError('Super Admin authorization required', 403);
    }

    const { id, status } = await request.json();
    if (!id || !status) return apiError('User ID and status are required', 422);

    await query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return apiSuccess({}, `User status changed to ${status}`);
  } catch (error) {
    console.error('Update user error:', error);
    return apiError('Failed to update user', 500);
  }
}

export async function DELETE(request) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return apiError('Super Admin authorization required', 403);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return apiError('User ID required', 422);

    // Prevent deleting self
    if (parseInt(id, 10) === user.id) {
      return apiError('You cannot delete your own admin account', 400);
    }

    await query('DELETE FROM users WHERE id = ?', [id]);
    return apiSuccess({}, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    return apiError('Failed to delete user', 500);
  }
}
