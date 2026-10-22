'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  User,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  LogOut,
  PhoneCall,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import NotificationBell from '@/components/common/NotificationBell';
import LocationSelector from '@/components/layout/LocationSelector';
import EmergencySosModal from '@/components/common/EmergencySosModal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}&city=${encodeURIComponent(selectedCity)}`);
    } else {
      router.push(`/services?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'subadmin') return '/subadmin/dashboard';
    if (user.role === 'provider') return '/provider/dashboard';
    return '/user/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-brand-royal text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Verified Partners & 30-Day Guarantee
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-blue-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Life Services from Birth to Beyond
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-1 text-blue-100 hover:text-white transition">
              <PhoneCall className="w-3 h-3 text-orange-400" /> 24x7 Helpline: +91 98765 43210
            </a>
            {!user && (
              <Link href="/register/provider" className="text-amber-300 hover:underline font-semibold flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" /> Partner With Us
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-royal to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                JS
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-royal block leading-none">
                  Jeevan<span className="text-accent-500">Seva</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  All-in-One Life Services
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="hidden lg:block">
              <LocationSelector
                value={selectedCity}
                onChange={(newCity) => {
                  setSelectedCity(newCity);
                  if (pathname === '/services') {
                    router.push(`/services?city=${encodeURIComponent(newCity)}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search cleaning, AC, elder care, pandit, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-sm pl-10 pr-24 py-2.5 rounded-full border border-slate-200 focus:bg-white focus:border-brand-royal focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all"
              >
                Find
              </button>
            </form>
          </div>

          {/* Nav Links & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/services"
              className={`text-sm font-semibold transition ${
                pathname === '/services' ? 'text-brand-royal' : 'text-slate-600 hover:text-brand-royal'
              }`}
            >
              All Services
            </Link>

            <Link
              href="/categories"
              className={`text-sm font-semibold transition ${
                pathname === '/categories' ? 'text-brand-royal' : 'text-slate-600 hover:text-brand-royal'
              }`}
            >
              Categories
            </Link>

            {/* 24x7 Emergency SOS 1-Tap Trigger */}
            <button
              type="button"
              onClick={() => setSosModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-black hover:bg-red-600 hover:text-white transition shadow-2xs"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>SOS</span>
            </button>

            {/* Auth Dropdown or Login Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] uppercase font-semibold text-accent-600">
                      {user.role}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.name?.[0] || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1">
                        <Badge variant={user.role === 'admin' ? 'red' : user.role === 'provider' ? 'orange' : 'blue'}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-royal transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>

                    {user.role === 'customer' && (
                      <Link
                        href="/user/bookings"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-royal transition"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="accent" size="sm">
                    Book Service
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user ? (
              <Link href={getDashboardLink()}>
                <div className="w-9 h-9 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.name?.[0] || 'U'}
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search all services in your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm pl-10 pr-20 py-2.5 rounded-full border border-slate-200 focus:bg-white focus:border-brand-royal outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Location</span>
            <LocationSelector
              value={selectedCity}
              onChange={(newCity) => {
                setSelectedCity(newCity);
                if (pathname === '/services') {
                  router.push(`/services?city=${encodeURIComponent(newCity)}`);
                }
              }}
              compact={true}
            />
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSosModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black shadow-md mb-2"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>1-Tap Emergency SOS (15-min Dispatch)</span>
            </button>
            <Link
              href="/services"
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
            >
              All Services
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
            >
              All 10 Life Categories
            </Link>
            <Link
              href="/register/provider"
              className="block px-3 py-2 rounded-lg text-base font-semibold text-accent-600 hover:bg-orange-50"
            >
              Partner With Us / Register Provider
            </Link>
            <a
              href="tel:+919876543210"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-blue-800 hover:bg-blue-50"
            >
              Emergency Helpline: +91 98765 43210
            </a>
          </div>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link href={getDashboardLink()}>
                <Button variant="primary" size="md" className="w-full">
                  Go to {user.role.toUpperCase()} Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="w-full text-rose-600">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link href="/login" className="w-full">
                <Button variant="outline" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button variant="accent" size="md" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 24x7 Emergency SOS Dispatch Modal */}
      <EmergencySosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />
    </header>
  );
}
