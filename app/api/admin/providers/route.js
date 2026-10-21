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
    const status = searchParams.get('status') || '';
    const q = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const offset = (page - 1) * limit;

    let whereSql = 'WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      whereSql += ' AND p.status = ?';
      params.push(status);
    }

    if (q.trim()) {
      whereSql += ' AND (p.business_name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term, term);
    }

    const countRes = await query(
      `SELECT COUNT(*) as total FROM providers p JOIN users u ON p.user_id = u.id ${whereSql}`,
      params
    );
    const total = countRes[0]?.total || 0;

    const providers = await query(
      `SELECT p.*, u.name as owner_name, u.email as owner_email, u.mobile as owner_mobile, u.city as user_city
       FROM providers p
       JOIN users u ON p.user_id = u.id
       ${whereSql}
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return apiSuccess({ providers }, 'Providers list', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('Admin providers error:', error);
    return apiError('Failed to fetch providers', 500);
  }
}

export async function PATCH(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      return apiError('Unauthorized', 403);
    }

    const { id, status, commission_rate } = await request.json();
    if (!id) return apiError('Provider ID required', 422);

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (commission_rate !== undefined) {
      updates.push('commission_rate = ?');
      params.push(commission_rate);
    }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE providers SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    return apiSuccess({}, `Provider updated successfully`);
  } catch (error) {
    console.error('Update provider error:', error);
    return apiError('Failed to update provider', 500);
  }
}
