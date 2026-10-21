import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const PINCODE_DIRECTORY = [
  // Delhi NCR
  { prefix: '110', city: 'New Delhi', state: 'Delhi', sla: '30-45 mins' },
  { prefix: '2013', city: 'Noida / Greater Noida', state: 'Uttar Pradesh', sla: '45-60 mins' },
  { prefix: '122', city: 'Gurugram', state: 'Haryana', sla: '30-45 mins' },
  { prefix: '121', city: 'Faridabad', state: 'Haryana', sla: '45-60 mins' },
  { prefix: '2010', city: 'Ghaziabad', state: 'Uttar Pradesh', sla: '45-60 mins' },
  // Mumbai MMR
  { prefix: '400', city: 'Mumbai', state: 'Maharashtra', sla: '30-45 mins' },
  { prefix: '401', city: 'Thane / Navi Mumbai', state: 'Maharashtra', sla: '45-60 mins' },
  // Bengaluru
  { prefix: '560', city: 'Bengaluru', state: 'Karnataka', sla: '30-45 mins' },
  // Hyderabad
  { prefix: '500', city: 'Hyderabad', state: 'Telangana', sla: '30-45 mins' },
  // Pune
  { prefix: '411', city: 'Pune', state: 'Maharashtra', sla: '30-45 mins' },
  // Chennai
  { prefix: '600', city: 'Chennai', state: 'Tamil Nadu', sla: '30-45 mins' },
  // Kolkata
  { prefix: '700', city: 'Kolkata', state: 'West Bengal', sla: '45-60 mins' },
  // Ahmedabad
  { prefix: '380', city: 'Ahmedabad', state: 'Gujarat', sla: '45-60 mins' },
  // Jaipur
  { prefix: '302', city: 'Jaipur', state: 'Rajasthan', sla: '45-60 mins' },
  // Lucknow
  { prefix: '226', city: 'Lucknow', state: 'Uttar Pradesh', sla: '45-60 mins' },
  // Chandigarh / Mohali
  { prefix: '160', city: 'Chandigarh / Tricity', state: 'Chandigarh', sla: '30-45 mins' },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = (searchParams.get('pincode') || '').trim();

    if (!code || !/^[1-9][0-9]{5}$/.test(code)) {
      return apiError('Please enter a valid 6-digit Indian PIN code (e.g. 110001, 201301, 400001, 560001)', 422);
    }

    const matched = PINCODE_DIRECTORY.find((item) => code.startsWith(item.prefix));

    if (matched) {
      return apiSuccess({
        pincode: code,
        serviceable: true,
        city: matched.city,
        state: matched.state,
        sla: matched.sla,
        expressAvailable: true,
        message: `Doorstep service actively available in ${matched.city}, ${matched.state} (Technician arrives in ${matched.sla}).`,
      }, 'Pincode serviceable');
    }

    // Default nationwide coverage for tier-2/3
    return apiSuccess({
      pincode: code,
      serviceable: true,
      city: 'Nationwide Network',
      state: 'India',
      sla: 'Same Day / Next Day',
      expressAvailable: false,
      message: `Verified doorstep network available in pincode ${code}. Standard service scheduling available.`,
    }, 'Pincode serviceable');
  } catch (error) {
    console.error('Pincode check error:', error);
    return apiError('Failed to verify pincode', 500);
  }
}
