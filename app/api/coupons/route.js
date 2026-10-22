import { query } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coupons = await query(
      `SELECT id, code, title, description, discount_type, discount_value, min_booking_amount, max_discount, valid_until 
       FROM coupons 
       WHERE status = 'active' AND (valid_until IS NULL OR valid_until >= CURDATE())
       ORDER BY id DESC`
    );

    return apiSuccess({ coupons }, 'Active coupons fetched successfully');
  } catch (error) {
    console.error('Fetch coupons error:', error);
    return apiError('Failed to fetch coupons', 500);
  }
}
