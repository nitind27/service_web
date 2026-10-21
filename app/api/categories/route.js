import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError, slugify } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id AND s.status = 'active') as services_count
       FROM categories c
       WHERE c.status = 'active'
       ORDER BY c.sort_order ASC, c.id ASC`
    );

    const subcategories = await query(
      `SELECT * FROM subcategories WHERE status = 'active' ORDER BY sort_order ASC`
    );

    // Group subcategories under their parent category
    const categoriesWithSubs = categories.map((cat) => ({
      ...cat,
      subcategories: subcategories.filter((sub) => sub.category_id === cat.id),
    }));

    return apiSuccess({ categories: categoriesWithSubs });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return apiError('Failed to fetch categories', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      return apiError('Unauthorized', 403);
    }

    const body = await request.json();
    const { name, tagline, description, icon = 'Sparkles', image, is_featured = 1 } = body;

    if (!name) return apiError('Category name is required', 422);

    const slug = slugify(name);

    const result = await query(
      `INSERT INTO categories (name, slug, icon, image, tagline, description, is_featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [name, slug, icon, image, tagline, description, is_featured ? 1 : 0]
    );

    return apiSuccess({ id: result.insertId, name, slug }, 'Category created successfully', 201);
  } catch (error) {
    console.error('Create category error:', error);
    return apiError('Failed to create category', 500);
  }
}
