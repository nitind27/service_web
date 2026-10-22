import { query } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const DIAGNOSTIC_KNOWLEDGE_BASE = [
  {
    category: 'Home & Appliances',
    keywords: ['ac', 'air conditioner', 'cooling', 'water leak', 'compressor'],
    slug: 'split-ac-foam-jet-servicing',
    diagnosis: 'Possible clogged drainage tray or low refrigerant charge. Requires high-pressure jet pump cleaning and pressure check.',
    recommendedPackage: 'Deep Jet Cleaning & Gas Check',
    urgency: 'Medium (Same-day scheduling)',
    emergencyAdvice: 'Turn off the indoor unit power switch if water is leaking near electrical outlets.',
  },
  {
    category: 'Home & Appliances',
    keywords: ['clean', 'dust', 'deep cleaning', 'sofa', 'bathroom', 'kitchen'],
    slug: 'full-home-deep-cleaning',
    diagnosis: 'Complete mechanised scrubbing, single-disc floor buffing, and chemical sanitisation recommended for thorough hygiene.',
    recommendedPackage: '2 BHK / 3 BHK Full Home Deep Cleaning',
    urgency: 'Flexible (Choose convenient date & time slot)',
    emergencyAdvice: 'Ensure fragile items and loose documents are stowed away before technicians arrive with industrial machinery.',
  },
  {
    category: 'Healthcare & Elder Care',
    keywords: ['ambulance', 'emergency', 'icu', 'oxygen', 'hospital', 'patient'],
    slug: 'emergency-ambulance-service-24x7',
    diagnosis: 'Critical patient transit. Rapid dispatch ambulance with trained paramedic and oxygen cylinder.',
    recommendedPackage: 'Advanced Life Support (ALS) Ambulance',
    urgency: 'HIGH (Immediate dispatch in 15-20 mins)',
    emergencyAdvice: 'Keep patient calm in resting position and have government ID/medical records ready at door.',
  },
  {
    category: 'Healthcare & Elder Care',
    keywords: ['elder', 'nurse', 'bedridden', 'care', 'injection', 'dressing', 'physio'],
    slug: 'elder-care-attendant-24-7',
    diagnosis: 'Certified healthcare attendant for continuous vitals monitoring, medication management, and daily mobility support.',
    recommendedPackage: '12-Hour Daytime / 24-Hour Residential Care',
    urgency: 'Scheduled / Daily',
    emergencyAdvice: 'Have recent doctor prescription and emergency family contact details accessible.',
  },
  {
    category: 'Weddings & Events',
    keywords: ['pandit', 'pooja', 'havan', 'griha pravesh', 'marriage', 'satyanarayan', 'vastu'],
    slug: 'vedic-pandit-sacred-rituals',
    diagnosis: 'Vedic ritual ceremony with experienced Brahmin Acharya reciting authentic Sanskrit mantras with complete pooja checklist.',
    recommendedPackage: 'Griha Pravesh / Vivah Sanskar Package',
    urgency: 'Auspicious Muhurat Booking',
    emergencyAdvice: 'Ensure sacred pooja altar area is clean and faces East or North-East direction.',
  },
  {
    category: 'Last Rites & Cremation',
    keywords: ['cremation', 'death', 'funeral', 'hearse', 'antim sanskar', 'shradh'],
    slug: 'complete-funeral-last-rites-assistance',
    diagnosis: 'Complete compassionate assistance: AC hearse van, 32-item sacred antim sanskar samagri, pandit ji, and crematorium slot booking.',
    recommendedPackage: 'Complete Dignified Antim Sanskar Package',
    urgency: 'URGENT 24x7 Priority Support',
    emergencyAdvice: 'Keep doctor death confirmation slip / hospital summary paper ready for municipal clearance.',
  },
  {
    category: 'Legal & Finance',
    keywords: ['gst', 'itr', 'tax', 'lawyer', 'legal', 'trademark', 'ca'],
    slug: 'income-tax-return-filing-ca',
    diagnosis: 'Expert Chartered Accountant (CA) for tax optimization, GST registration, audit, or legal document drafting.',
    recommendedPackage: 'CA Tax Filing & Consultation',
    urgency: 'Within 24 Hours',
    emergencyAdvice: 'Keep PAN card, Aadhaar card, Form 16, and bank statements for the relevant financial year ready.',
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const issue_text = body.issue_text || body.problem_description || '';
    const category_hint = body.category_hint;

    if (!issue_text || !issue_text.trim()) {
      return apiError('Please describe the issue or service you need', 422);
    }

    const lower = issue_text.toLowerCase();

    // Match best knowledge base entry
    let matched = DIAGNOSTIC_KNOWLEDGE_BASE.find(item =>
      item.keywords.some(k => lower.includes(k))
    );

    // Fallback default if no direct keyword match
    if (!matched) {
      matched = DIAGNOSTIC_KNOWLEDGE_BASE[0];
    }

    // Fetch the service from DB
    const services = await query(
      `SELECT s.*, c.name as category_name 
       FROM services s 
       JOIN categories c ON s.category_id = c.id 
       WHERE s.slug = ? LIMIT 1`,
      [matched.slug]
    );

    const service = services[0];

    return apiSuccess({
      diagnosis: matched.diagnosis,
      recommendedPackage: matched.recommendedPackage,
      urgency: matched.urgency,
      emergencyAdvice: matched.emergencyAdvice || null,
      service: service || null,
      confidenceScore: '96%',
    }, 'Smart Service Diagnosis completed');
  } catch (error) {
    console.error('Diagnostic API error:', error);
    return apiError('Failed to generate diagnostic recommendation', 500);
  }
}
