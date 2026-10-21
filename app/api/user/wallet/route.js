import { query, queryOne } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    const dbUser = await queryOne('SELECT wallet_balance FROM users WHERE id = ?', [user.id]);
    const balance = parseFloat(dbUser?.wallet_balance || 0);

    const transactions = await query(
      `SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 50`,
      [user.id]
    );

    return apiSuccess({
      balance,
      transactions,
    }, 'Wallet details retrieved successfully');
  } catch (error) {
    console.error('Fetch wallet error:', error);
    return apiError('Failed to fetch wallet info', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user) return apiError('Authentication required', 401);

    const { amount } = await request.json();
    const topupAmount = parseFloat(amount);

    if (isNaN(topupAmount) || topupAmount < 100 || topupAmount > 20000) {
      return apiError('Enter a valid top-up amount between ₹100 and ₹20,000', 422);
    }

    await query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [topupAmount, user.id]);
    const updated = await queryOne('SELECT wallet_balance FROM users WHERE id = ?', [user.id]);
    const newBal = parseFloat(updated?.wallet_balance || topupAmount);

    await query(
      `INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description)
       VALUES (?, 'credit', ?, ?, ?)`,
      [user.id, topupAmount, newBal, `Online Wallet Top-up via UPI / Card`]
    );

    await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, 'wallet')`,
      [
        user.id,
        'Wallet Top-Up Successful 💳',
        `₹${topupAmount} has been credited to your JeevanSeva Wallet. New balance: ₹${newBal}.`
      ]
    );

    return apiSuccess({
      newBalance: newBal,
      topupAmount,
    }, 'Wallet top-up completed successfully!');
  } catch (error) {
    console.error('Wallet top-up error:', error);
    return apiError('Failed to process wallet top-up', 500);
  }
}
