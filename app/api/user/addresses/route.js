import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const addresses = await query(
      `SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC`,
      [user.id]
    );

    return apiSuccess({ addresses });
  } catch (error) {
    console.error('Fetch addresses error:', error);
    return apiError('Failed to fetch addresses', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const { title = 'Home', recipient_name, recipient_phone, address_line, landmark, city, state = 'Delhi', pincode, is_default = 0 } = await request.json();

    if (!address_line || !city || !pincode) {
      return apiError('Address line, City, and Pincode are required', 422);
    }

    if (is_default) {
      await query('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [user.id]);
    }

    const result = await query(
      `INSERT INTO user_addresses (user_id, title, recipient_name, recipient_phone, address_line, landmark, city, state, pincode, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, title, recipient_name || user.name, recipient_phone || user.mobile, address_line, landmark, city, state, pincode, is_default ? 1 : 0]
    );

    return apiSuccess({ id: result.insertId }, 'Address added successfully', 201);
  } catch (error) {
    console.error('Add address error:', error);
    return apiError('Failed to add address', 500);
  }
}

export async function DELETE(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return apiError('Address ID is required', 422);

    await query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [id, user.id]);

    return apiSuccess({}, 'Address deleted successfully');
  } catch (error) {
    console.error('Delete address error:', error);
    return apiError('Failed to delete address', 500);
  }
}
