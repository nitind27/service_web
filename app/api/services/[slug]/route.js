import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const service = await queryOne(
      `SELECT s.*, 
        c.name as category_name, c.slug as category_slug,
        sc.name as subcategory_name,
        p.id as provider_table_id, p.business_name, p.experience_years, p.rating as provider_rating, p.total_reviews as provider_reviews, p.about as provider_about,
        u.mobile as provider_mobile
       FROM services s
       JOIN categories c ON s.category_id = c.id
       LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
       LEFT JOIN providers p ON s.provider_id = p.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE s.slug = ?
       LIMIT 1`,
      [slug]
    );

    if (!service) {
      return apiError('Service not found', 404);
    }

    // Fetch package variants
    const variants = await query(
      `SELECT * FROM service_variants WHERE service_id = ? ORDER BY sort_order ASC, price ASC`,
      [service.id]
    );

    // Fetch reviews
    const reviews = await query(
      `SELECT r.*, u.name as customer_name, u.city as customer_city, u.profile_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.service_id = ? AND r.status = 'approved'
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [service.id]
    );

    // Fetch related services in same category
    const related = await query(
      `SELECT id, title, slug, thumbnail, base_price, discount_price, rating, total_reviews
       FROM services
       WHERE category_id = ? AND id != ? AND status = 'active'
       LIMIT 4`,
      [service.category_id, service.id]
    );

    return apiSuccess({
      service,
      variants,
      reviews,
      related,
    });
  } catch (error) {
    console.error('Fetch service detail error:', error);
    return apiError('Failed to fetch service details', 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getAuthUser(request);
    if (!user || !['admin', 'subadmin', 'provider'].includes(user.role)) {
      return apiError('Unauthorized', 403);
    }

    const { slug } = params;
    const body = await request.json();

    const existing = await queryOne('SELECT id FROM services WHERE slug = ?', [slug]);
    if (!existing) return apiError('Service not found', 404);

    const {
      title,
      short_description,
      description,
      base_price,
      discount_price,
      duration_minutes,
      thumbnail,
      is_featured,
      status,
    } = body;

    await query(
      `UPDATE services 
       SET title = COALESCE(?, title),
           short_description = COALESCE(?, short_description),
           description = COALESCE(?, description),
           base_price = COALESCE(?, base_price),
           discount_price = ?,
           duration_minutes = COALESCE(?, duration_minutes),
           thumbnail = COALESCE(?, thumbnail),
           is_featured = COALESCE(?, is_featured),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        title,
        short_description,
        description,
        base_price,
        discount_price !== undefined ? discount_price : null,
        duration_minutes,
        thumbnail,
        is_featured !== undefined ? is_featured : null,
        status,
        existing.id,
      ]
    );

    return apiSuccess({}, 'Service updated successfully');
  } catch (error) {
    console.error('Update service error:', error);
    return apiError('Failed to update service', 500);
  }
}
