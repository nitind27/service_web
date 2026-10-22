import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    let sql = 'SELECT * FROM banners WHERE status = "active" ORDER BY sort_order ASC, id DESC';
    if (all) {
      sql = 'SELECT * FROM banners ORDER BY sort_order ASC, id DESC';
    }

    const banners = await query(sql);
    return apiSuccess({ banners });
  } catch (error) {
    console.error('Fetch banners error:', error);
    return apiError('Failed to fetch banners', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return apiError('Admin authorization required', 403);
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      image_url,
      cta_link,
      cta_text,
      badge_text,
      sort_order = 0,
      status = 'active',
    } = body;

    if (!title || !image_url) {
      return apiError('Title and Image URL are required', 422);
    }

    const res = await query(
      `INSERT INTO banners (title, subtitle, image_url, cta_link, cta_text, badge_text, sort_order, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title.trim(),
        subtitle?.trim() || '',
        image_url.trim(),
        cta_link?.trim() || '/services',
        cta_text?.trim() || 'Book Now',
        badge_text?.trim() || 'Special Offer',
        parseInt(sort_order || 0, 10),
        status || 'active',
      ]
    );

    return apiSuccess({ id: res.insertId }, 'Banner created successfully', 201);
  } catch (error) {
    console.error('Create banner error:', error);
    return apiError('Failed to create banner', 500);
  }
}

export async function PATCH(request) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return apiError('Admin authorization required', 403);
    }

    const { id, status, sort_order, title, image_url } = await request.json();
    if (!id) return apiError('Banner ID required', 422);

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (sort_order !== undefined) {
      updates.push('sort_order = ?');
      params.push(parseInt(sort_order, 10));
    }
    if (title) {
      updates.push('title = ?');
      params.push(title.trim());
    }
    if (image_url) {
      updates.push('image_url = ?');
      params.push(image_url.trim());
    }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE banners SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    return apiSuccess({}, 'Banner updated successfully');
  } catch (error) {
    console.error('Update banner error:', error);
    return apiError('Failed to update banner', 500);
  }
}

export async function DELETE(request) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return apiError('Admin authorization required', 403);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return apiError('Banner ID required', 422);

    await query('DELETE FROM banners WHERE id = ?', [id]);
    return apiSuccess({}, 'Banner deleted successfully');
  } catch (error) {
    console.error('Delete banner error:', error);
    return apiError('Failed to delete banner', 500);
  }
}
