import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user || !['admin', 'sub_admin'].includes(user.role)) {
      return apiError('Unauthorized. Admin access required.', 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    let sql = `
      SELECT po.*, p.business_name, p.user_id as provider_user_id, u.name as provider_owner_name, u.mobile as provider_phone
      FROM provider_payouts po
      JOIN providers p ON po.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND po.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY po.id DESC';

    const payouts = await query(sql, params);
    return apiSuccess({ payouts }, 'Payouts retrieved successfully');
  } catch (error) {
    console.error('Admin fetch payouts error:', error);
    return apiError('Failed to fetch payouts', 500);
  }
}

export async function PATCH(request) {
  try {
    const user = getAuthUser(request);
    if (!user || !['admin', 'sub_admin'].includes(user.role)) {
      return apiError('Unauthorized. Admin access required.', 401);
    }

    const { payout_id, status, transaction_reference } = await request.json();

    if (!payout_id || !['processed', 'rejected'].includes(status)) {
      return apiError('Invalid payout id or status (processed/rejected required)', 422);
    }

    const payout = await queryOne('SELECT * FROM provider_payouts WHERE id = ?', [payout_id]);
    if (!payout) return apiError('Payout record not found', 404);

    const ref = transaction_reference || `TXN${Date.now()}`;
    await query(
      `UPDATE provider_payouts 
       SET status = ?, transaction_reference = ?, processed_at = NOW() 
       WHERE id = ?`,
      [status, ref, payout_id]
    );

    // Notify provider
    const provider = await queryOne('SELECT user_id FROM providers WHERE id = ?', [payout.provider_id]);
    if (provider?.user_id) {
      await query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, ?, ?, 'wallet')`,
        [
          provider.user_id,
          status === 'processed' ? 'Payout Disbursed 💸' : 'Payout Request Rejected',
          status === 'processed'
            ? `Your payout request of ₹${payout.amount} has been successfully credited (Ref: ${ref}).`
            : `Your payout request of ₹${payout.amount} was rejected. The amount is returned to your withdrawable balance.`
        ]
      );
    }

    return apiSuccess({}, `Payout marked as ${status}`);
  } catch (error) {
    console.error('Admin update payout error:', error);
    return apiError('Failed to update payout', 500);
  }
}
