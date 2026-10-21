import { queryOne } from '@/lib/db';
import { verifyPassword, signJwtToken, setAuthCookie } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const cleanInput = (body.emailOrMobile || body.email || body.mobile || '').trim().toLowerCase();
    const password = body.password;

    if (!cleanInput || !password) {
      return apiError('Please provide your email/mobile and password', 422);
    }

    // Find user by email or mobile
    const user = await queryOne(
      `SELECT u.id, u.name, u.email, u.mobile, u.password, u.city, u.status, u.profile_image, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ? OR u.mobile = ?
       LIMIT 1`,
      [cleanInput, cleanInput]
    );

    if (!user) {
      return apiError('Invalid email/mobile or password', 401);
    }

    if (user.status === 'blocked') {
      return apiError('Your account has been suspended. Please contact customer support.', 403);
    }

    // Verify bcrypt password
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return apiError('Invalid email/mobile or password', 401);
    }

    // Build JWT payload
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role_name,
      city: user.city,
      profile_image: user.profile_image,
    };

    const token = signJwtToken(tokenPayload);

    // Determine redirect URL
    let redirectUrl = '/user/dashboard';
    if (user.role_name === 'admin') redirectUrl = '/admin/dashboard';
    else if (user.role_name === 'subadmin') redirectUrl = '/subadmin/dashboard';
    else if (user.role_name === 'provider') redirectUrl = '/provider/dashboard';

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: {
        user: tokenPayload,
        token,
        redirectUrl,
      },
    });

    response.headers.set('Set-Cookie', setAuthCookie(token));
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return apiError('Internal server error during login', 500);
  }
}
