import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'jeevanseva_default_secret_key_change_in_production_12345';
const TOKEN_COOKIE_NAME = 'allservice_auth_token';

/**
 * Hash password using bcrypt
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare plain password with stored hash
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Sign JWT token for authenticated user
 */
export function signJwtToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Get authenticated user from request cookies or header
 */
export function getAuthUser(request) {
  let token = null;

  // Try extracting from Cookie
  if (request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(^|;\\s*)(${TOKEN_COOKIE_NAME})=([^;]*)`));
    if (match) {
      token = decodeURIComponent(match[3]);
    }

    // Fallback to Authorization: Bearer <token>
    if (!token) {
      const authHeader = request.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  }

  if (!token) return null;
  return verifyJwtToken(token);
}

/**
 * Set HTTP-only auth cookie in API response
 */
export function setAuthCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  return `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; ${
    isProd ? 'Secure; ' : ''
  }SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie() {
  return `${TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`;
}

export { TOKEN_COOKIE_NAME };
