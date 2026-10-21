import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET(request) {
  try {
    const settings = await query('SELECT * FROM settings ORDER BY group_name ASC');
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.setting_key] = s.setting_value;
    });
    return apiSuccess({ settings: settingsMap, raw: settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return apiError('Failed to fetch settings', 500);
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return apiError('Super Admin authorization required', 403);
    }

    const { settings } = await request.json();
    if (!settings || typeof settings !== 'object') {
      return apiError('Settings object is required', 422);
    }

    for (const [key, val] of Object.entries(settings)) {
      await query(
        `INSERT INTO settings (setting_key, setting_value, group_name)
         VALUES (?, ?, 'general')
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(val)]
      );
    }

    return apiSuccess({}, 'Settings updated successfully');
  } catch (error) {
    console.error('Update settings error:', error);
    return apiError('Failed to update settings', 500);
  }
}
