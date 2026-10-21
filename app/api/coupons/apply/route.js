import { queryOne } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request) {
  try {
    const { code, amount } = await request.json();
    if (!code || !amount) {
      return apiError('Coupon code and booking amount are required', 422);
    }

    const coupon = await queryOne(
      `SELECT * FROM coupons 
       WHERE code = ? AND status = 'active' AND (valid_until IS NULL OR valid_until >= CURDATE())
       LIMIT 1`,
      [code.trim().toUpperCase()]
    );

    if (!coupon) {
      return apiError('Invalid or expired coupon code', 404);
    }

    const bookingAmount = parseFloat(amount);
    const minAmount = parseFloat(coupon.min_booking_amount);

    if (bookingAmount < minAmount) {
      return apiError(`This coupon requires a minimum booking amount of ₹${minAmount}`, 400);
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return apiError('Coupon usage limit reached', 400);
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (bookingAmount * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount && discount > parseFloat(coupon.max_discount)) {
        discount = parseFloat(coupon.max_discount);
      }
    } else {
      discount = parseFloat(coupon.discount_value);
    }

    discount = Math.min(discount, bookingAmount);

    return apiSuccess({
      code: coupon.code,
      title: coupon.title,
      discount: Math.round(discount),
      finalAmount: Math.max(0, Math.round(bookingAmount - discount)),
    }, `Coupon "${coupon.code}" applied successfully!`);
  } catch (error) {
    console.error('Coupon apply error:', error);
    return apiError('Failed to apply coupon', 500);
  }
}
