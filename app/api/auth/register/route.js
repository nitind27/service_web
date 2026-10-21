import { query, queryOne } from '@/lib/db';
import { hashPassword, signJwtToken, setAuthCookie } from '@/lib/auth';
import { apiSuccess, apiError, validateEmail, validateIndianMobile } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, mobile, password, city = 'New Delhi', role = 'customer', businessName, experienceYears, about } = body;

    // Validations
    if (!name || name.trim().length < 2) {
      return apiError('Full Name must be at least 2 characters', 422);
    }
    if (!email || !validateEmail(email)) {
      return apiError('Valid email address is required', 422);
    }
    if (!mobile || !validateIndianMobile(mobile)) {
      return apiError('Valid 10-digit Indian mobile number is required', 422);
    }
    if (!password || password.length < 6) {
      return apiError('Password must be at least 6 characters long', 422);
    }

    // Check duplicate email or mobile
    const existing = await queryOne(
      'SELECT id, email, mobile FROM users WHERE email = ? OR mobile = ? LIMIT 1',
      [email.toLowerCase().trim(), mobile.trim()]
    );
    if (existing) {
      if (existing.email === email.toLowerCase().trim()) {
        return apiError('An account with this email already exists', 409);
      }
      return apiError('An account with this mobile number already exists', 409);
    }

    // Role mapping: customer (4), provider (3)
    const targetRoleId = role === 'provider' ? 3 : 4;
    const hashedPassword = await hashPassword(password);

    const userResult = await query(
      `INSERT INTO users (role_id, name, email, mobile, password, city, status, wallet_balance)
       VALUES (?, ?, ?, ?, ?, ?, 'active', 0.00)`,
      [targetRoleId, name.trim(), email.toLowerCase().trim(), mobile.trim(), hashedPassword, city]
    );

    const newUserId = userResult.insertId;

    // If registering as provider, insert provider profile
    if (role === 'provider') {
      await query(
        `INSERT INTO providers (user_id, business_name, experience_years, about, city, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [newUserId, businessName || name, parseInt(experienceYears || '3', 10), about || 'Service provider', city]
      );
    }

    // Generate JWT token
    const tokenPayload = {
      id: newUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      role: role === 'provider' ? 'provider' : 'customer',
      city,
    };

    const token = signJwtToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      message: role === 'provider' 
        ? 'Provider registration submitted for verification!' 
        : 'Registration successful! Welcome to JeevanSeva.',
      data: {
        user: tokenPayload,
        token,
        redirectUrl: role === 'provider' ? '/provider/dashboard' : '/user/dashboard',
      },
    });

    response.headers.set('Set-Cookie', setAuthCookie(token));
    return response;
  } catch (error) {
    console.error('Registration API Error:', error);
    return apiError('Internal server error during registration', 500);
  }
}
