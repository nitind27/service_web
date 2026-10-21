import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      return apiError('Unauthorized', 403);
    }

    const coupons = await query('SELECT * FROM coupons ORDER BY id DESC');
    return apiSuccess({ coupons });
  } catch (error) {
    console.error('Fetch coupons error:', error);
    return apiError('Failed to fetch coupons', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      return apiError('Unauthorized', 403);
    }

    const {
      code,
      title,
      discount_type = 'percentage',
      discount_value,
      min_booking_amount = 0,
      max_discount,
      usage_limit = 1000,
      valid_until = '2027-12-31',
    } = await request.json();

    if (!code || !title || !discount_value) {
      return apiError('Code, Title, and Discount Value are required', 422);
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await queryOne('SELECT id FROM coupons WHERE code = ?', [cleanCode]);
    if (existing) return apiError('Coupon code already exists', 409);

    const result = await query(
      `INSERT INTO coupons (code, title, discount_type, discount_value, min_booking_amount, max_discount, usage_limit, valid_until, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        cleanCode,
        title,
        discount_type,
        parseFloat(discount_value),
        parseFloat(min_booking_amount || 0),
        max_discount ? parseFloat(max_discount) : null,
        parseInt(usage_limit || 1000, 10),
        valid_until,
      ]
    );

    return apiSuccess({ id: result.insertId, code: cleanCode }, 'Coupon created successfully', 201);
  } catch (error) {
    console.error('Create coupon error:', error);
    return apiError('Failed to create coupon', 500);
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
    if (!id) return apiError('Coupon ID required', 422);

    await query('DELETE FROM coupons WHERE id = ?', [id]);
    return apiSuccess({}, 'Coupon deleted successfully');
  } catch (error) {
    console.error('Delete coupon error:', error);
    return apiError('Failed to delete coupon', 500);
  }
}
