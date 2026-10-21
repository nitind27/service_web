import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError, slugify } from '@/lib/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || 0;
    const minRating = parseFloat(searchParams.get('rating')) || 0;
    const sort = searchParams.get('sort') || 'featured';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const offset = (page - 1) * limit;

    let whereSql = "WHERE s.status = 'active'";
    const params = [];

    // Search keyword
    if (q.trim()) {
      whereSql += " AND (s.title LIKE ? OR s.description LIKE ? OR c.name LIKE ?)";
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    // Category filter
    if (categorySlug) {
      whereSql += " AND c.slug = ?";
      params.push(categorySlug);
    }

    // City / State filter
    if (city && city !== 'All Cities' && city !== 'All India (Nationwide)' && city !== 'Pan-India') {
      whereSql += " AND (p.city LIKE ? OR p.service_area LIKE ? OR p.id IS NULL OR p.city = 'All India' OR p.city = 'New Delhi')";
      const cTerm = `%${city.trim()}%`;
      params.push(cTerm, cTerm);
    }

    // Price filters
    if (minPrice > 0) {
      whereSql += " AND COALESCE(s.discount_price, s.base_price) >= ?";
      params.push(minPrice);
    }
    if (maxPrice > 0) {
      whereSql += " AND COALESCE(s.discount_price, s.base_price) <= ?";
      params.push(maxPrice);
    }

    // Rating filter
    if (minRating > 0) {
      whereSql += " AND s.rating >= ?";
      params.push(minRating);
    }

    // Sort order
    let orderSql = 'ORDER BY s.is_featured DESC, s.rating DESC';
    if (sort === 'newest') orderSql = 'ORDER BY s.id DESC';
    else if (sort === 'price_asc') orderSql = 'ORDER BY COALESCE(s.discount_price, s.base_price) ASC';
    else if (sort === 'price_desc') orderSql = 'ORDER BY COALESCE(s.discount_price, s.base_price) DESC';
    else if (sort === 'rating') orderSql = 'ORDER BY s.rating DESC, s.total_reviews DESC';

    // Count query
    const countSql = `
      SELECT COUNT(*) as total
      FROM services s
      JOIN categories c ON s.category_id = c.id
      LEFT JOIN providers p ON s.provider_id = p.id
      ${whereSql}
    `;
    const countRes = await query(countSql, params);
    const total = countRes[0]?.total || 0;

    // Data query
    const dataSql = `
      SELECT s.*, 
        c.name as category_name, c.slug as category_slug,
        sc.name as subcategory_name,
        p.business_name as provider_business_name, p.rating as provider_rating
      FROM services s
      JOIN categories c ON s.category_id = c.id
      LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
      LEFT JOIN providers p ON s.provider_id = p.id
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `;
    const items = await query(dataSql, [...params, limit, offset]);

    return apiSuccess(
      { services: items },
      'Services fetched successfully',
      200,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      }
    );
  } catch (error) {
    console.error('Fetch services error:', error);
    return apiError('Failed to fetch services catalog', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user || !['admin', 'subadmin', 'provider'].includes(user.role)) {
      return apiError('Unauthorized', 403);
    }

    const body = await request.json();
    const {
      category_id,
      subcategory_id,
      title,
      short_description,
      description,
      base_price,
      discount_price,
      duration_minutes = 60,
      thumbnail,
      is_featured = 0,
    } = body;

    if (!title || !category_id || !base_price) {
      return apiError('Title, Category, and Base Price are required', 422);
    }

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    let providerId = null;
    if (user.role === 'provider') {
      const provider = await queryOne('SELECT id FROM providers WHERE user_id = ?', [user.id]);
      providerId = provider?.id || null;
    }

    const result = await query(
      `INSERT INTO services 
       (category_id, subcategory_id, provider_id, title, slug, short_description, description, base_price, discount_price, duration_minutes, thumbnail, is_featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        category_id,
        subcategory_id || null,
        providerId,
        title,
        slug,
        short_description || title,
        description || title,
        base_price,
        discount_price || null,
        duration_minutes,
        thumbnail || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        is_featured ? 1 : 0,
      ]
    );

    return apiSuccess({ id: result.insertId, slug, title }, 'Service created successfully', 201);
  } catch (error) {
    console.error('Create service error:', error);
    return apiError('Failed to create service', 500);
  }
}
