import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Clock,
  HeartHandshake,
  PhoneCall,
  Mail,
  MapPin,
  Lock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      {/* Trust Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center flex-shrink-0 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Police-Verified Pros</h4>
              <p className="text-xs text-slate-400 mt-1">Aadhaar verified & skill certified professionals on duty.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Secure Cashfree Payments</h4>
              <p className="text-xs text-slate-400 mt-1">100% PCI-DSS compliant with Pay After Service options.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-900/60 border border-orange-700/50 flex items-center justify-center flex-shrink-0 text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">30-Day Service Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">Free rework or full refund if you are not satisfied.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center flex-shrink-0 text-purple-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">From Birth to Beyond</h4>
              <p className="text-xs text-slate-400 mt-1">Every life moment handled with utmost dignity & care.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-royal to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                JS
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Jeevan<span className="text-accent-500">Seva</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India’s premier all-in-one life services ecosystem. We connect households and businesses with verified experts for home maintenance, healthcare, education, weddings, legal, and dignified last rites.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-accent-500" />
                <span>24x7 Helpline: <strong className="text-white">+91 98765 43210</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-accent-500" />
                <span>support@jeevanseva.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-accent-500" />
                <span>Pan-India Coverage: Delhi NCR, Mumbai, Bengaluru & 40+ Cities</span>
              </div>
            </div>
          </div>

          {/* Life Services Column 1 */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Home & Family
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/services?category=home-services" className="hover:text-white transition">Home Deep Cleaning</Link></li>
              <li><Link href="/services?category=home-services" className="hover:text-white transition">AC & Appliance Repair</Link></li>
              <li><Link href="/services?category=home-services" className="hover:text-white transition">Electrician & Plumber</Link></li>
              <li><Link href="/services?category=furniture-services" className="hover:text-white transition">Carpentry & Modular Kitchen</Link></li>
              <li><Link href="/services?category=personal-family" className="hover:text-white transition">24x7 Elder Care Attendants</Link></li>
              <li><Link href="/services?category=personal-family" className="hover:text-white transition">Home Nursing & Injections</Link></li>
              <li><Link href="/services?category=education-tutoring" className="hover:text-white transition">Personalized Home Tutors</Link></li>
            </ul>
          </div>

          {/* Life Services Column 2 */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Events & Care
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/services?category=wedding-events" className="hover:text-white transition">Wedding & Candid Photo</Link></li>
              <li><Link href="/services?category=travel-vehicle" className="hover:text-white transition">Doorstep Car Detailing</Link></li>
              <li><Link href="/services?category=legal-finance-govt" className="hover:text-white transition">CA & Income Tax Filing</Link></li>
              <li><Link href="/services?category=beauty-wellness" className="hover:text-white transition">Salon & Spa at Home</Link></li>
              <li><Link href="/services?category=agriculture-business" className="hover:text-white transition">Tractor & Business Services</Link></li>
              <li><Link href="/services?category=death-after-death" className="hover:text-white transition">Dignified Last Rites Support</Link></li>
              <li><Link href="/services?category=death-after-death" className="hover:text-white transition">24x7 Mortuary Ambulance</Link></li>
            </ul>
          </div>

          {/* Quick Links & Partners */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Platform & Partners
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/register/provider" className="text-accent-400 font-semibold hover:underline">Register as Service Partner</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Partner / Admin Login</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Our Mission</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Customer Support</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JeevanSeva Marketplace India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Cashfree 256-Bit SSL Protected
            </span>
            <span>•</span>
            <span className="text-slate-400">Made with ❤️ for Indian Families</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
