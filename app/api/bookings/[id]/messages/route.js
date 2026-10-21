import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    const { id } = params;

    const booking = await queryOne(
      `SELECT b.id, b.user_id, b.provider_id, b.booking_number, p.user_id as provider_user_id 
       FROM bookings b
       LEFT JOIN providers p ON b.provider_id = p.id
       WHERE b.id = ? OR b.booking_number = ?`,
      [id, id]
    );

    if (!booking) {
      return apiError('Booking not found', 404);
    }

    // Role check: customer, assigned provider, or admin/subadmin
    const isCustomer = user.id === booking.user_id;
    const isProvider = user.id === booking.provider_user_id;
    const isAdmin = ['admin', 'sub_admin'].includes(user.role);

    if (!isCustomer && !isProvider && !isAdmin) {
      return apiError('Unauthorized to view this conversation', 403);
    }

    const messages = await query(
      `SELECT bm.id, bm.booking_id, bm.sender_id, bm.sender_role, bm.message, bm.created_at,
              u.name as sender_name, u.profile_image as sender_avatar
       FROM booking_messages bm
       JOIN users u ON bm.sender_id = u.id
       WHERE bm.booking_id = ?
       ORDER BY bm.created_at ASC`,
      [booking.id]
    );

    return apiSuccess({
      messages,
      booking: {
        id: booking.id,
        booking_number: booking.booking_number,
      },
    }, 'Messages retrieved successfully');
  } catch (error) {
    console.error('Fetch booking messages error:', error);
    return apiError('Failed to fetch messages', 500);
  }
}

export async function POST(request, { params }) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    const { id } = params;
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return apiError('Message text cannot be empty', 422);
    }

    const booking = await queryOne(
      `SELECT b.id, b.user_id, b.provider_id, b.booking_number, p.user_id as provider_user_id, s.title as service_title
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN providers p ON b.provider_id = p.id
       WHERE b.id = ? OR b.booking_number = ?`,
      [id, id]
    );

    if (!booking) {
      return apiError('Booking not found', 404);
    }

    const isCustomer = user.id === booking.user_id;
    const isProvider = user.id === booking.provider_user_id;
    const isAdmin = ['admin', 'sub_admin'].includes(user.role);

    if (!isCustomer && !isProvider && !isAdmin) {
      return apiError('Unauthorized to send messages for this booking', 403);
    }

    const insertResult = await query(
      `INSERT INTO booking_messages (booking_id, sender_id, sender_role, message)
       VALUES (?, ?, ?, ?)`,
      [booking.id, user.id, user.role, message.trim()]
    );

    const newMessageId = insertResult.insertId;

    // Send in-app notification to the counterpart
    let recipientUserId = null;
    if (isCustomer && booking.provider_user_id) {
      recipientUserId = booking.provider_user_id;
    } else if (isProvider) {
      recipientUserId = booking.user_id;
    }

    if (recipientUserId) {
      await query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, ?, ?, 'chat')`,
        [
          recipientUserId,
          `New message on #${booking.booking_number}`,
          `${user.name}: "${message.trim().substring(0, 70)}${message.length > 70 ? '...' : ''}"`,
        ]
      );
    }

    const createdMsg = await queryOne(
      `SELECT bm.*, u.name as sender_name, u.profile_image as sender_avatar
       FROM booking_messages bm
       JOIN users u ON bm.sender_id = u.id
       WHERE bm.id = ?`,
      [newMessageId]
    );

    return apiSuccess({ message: createdMsg }, 'Message sent successfully', 201);
  } catch (error) {
    console.error('Send booking message error:', error);
    return apiError('Failed to send message', 500);
  }
}
