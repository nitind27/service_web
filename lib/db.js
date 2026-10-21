import mysql from 'mysql2/promise';

let pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'allservice_db',
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      charset: 'utf8mb4',
      dateStrings: true,
    });
  }
  return pool;
}

/**
 * Executes a parameterized SQL query safely
 * @param {string} sql - SQL query with ? placeholders
 * @param {Array} params - Array of parameters
 * @returns {Promise<Array>} Results
 */
export async function query(sql, params = []) {
  try {
    const db = getDbPool();
    const [results] = await db.query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message, 'SQL:', sql);
    throw error;
  }
}

/**
 * Returns single row or null
 */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows && rows.length > 0 ? rows[0] : null;
}
