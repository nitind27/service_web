import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // 1. Try Reverse Geocoding with GPS Coordinates if provided
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
          { next: { revalidate: 60 } }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const city = geoData.city || geoData.locality || geoData.principalSubdivision || 'New Delhi';
          const state = geoData.principalSubdivision || 'Delhi';
          const pincode = geoData.postcode || '';

          return apiSuccess({
            source: 'gps',
            city,
            state,
            pincode,
            formatted: state ? `${city}, ${state}` : city,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          }, 'GPS Location successfully detected');
        }
      } catch (geoErr) {
        console.warn('GPS reverse geocode error:', geoErr);
      }
    }

    // 2. Fallback to IP Geolocation
    try {
      const ipRes = await fetch('http://ip-api.com/json/?fields=status,country,regionName,city,zip,lat,lon', {
        next: { revalidate: 300 },
      });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.status === 'success' && ipData.country === 'India') {
          const city = ipData.city || 'New Delhi';
          const state = ipData.regionName || 'Delhi';
          const pincode = ipData.zip || '';

          return apiSuccess({
            source: 'ip',
            city,
            state,
            pincode,
            formatted: state ? `${city}, ${state}` : city,
            lat: ipData.lat,
            lng: ipData.lon,
          }, 'Location detected via Network IP');
        }
      }
    } catch (ipErr) {
      console.warn('IP geocode error:', ipErr);
    }

    // 3. Standard Fallback to National Capital
    return apiSuccess({
      source: 'default',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      formatted: 'New Delhi, Delhi',
      lat: 28.6139,
      lng: 77.2090,
    }, 'Default location loaded');
  } catch (error) {
    console.error('Location detection fatal error:', error);
    return apiError('Unable to detect location', 500);
  }
}
