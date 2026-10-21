'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  User,
  MapPin,
  Heart,
  Tag,
  Headphones,
  Settings,
  Users,
  Briefcase,
  Layers,
  Wrench,
  CreditCard,
  Image as ImageIcon,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Bell,
  Home,
  CheckCircle,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Badge from '@/components/ui/Badge';

export default function DashboardLayout({ children, title = 'Dashboard' }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const role = user?.role || 'customer';

  // Navigation items based on role
  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Bookings & Orders', href: '/admin/bookings', icon: Calendar },
        { label: 'Services Catalog', href: '/admin/services', icon: Wrench },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Service Providers', href: '/admin/providers', icon: Briefcase },
        { label: 'Customers', href: '/admin/users', icon: Users },
        { label: 'Sub-Admins', href: '/admin/subadmins', icon: ShieldAlert },
        { label: 'Payments & Gateway', href: '/admin/payments', icon: CreditCard },
        { label: 'Coupons & Offers', href: '/admin/coupons', icon: Tag },
        { label: 'Banners & Sliders', href: '/admin/banners', icon: ImageIcon },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    }

    if (role === 'subadmin') {
      return [
        { label: 'Operations Dashboard', href: '/subadmin/dashboard', icon: LayoutDashboard },
        { label: 'Manage Bookings', href: '/subadmin/bookings', icon: Calendar },
        { label: 'Approve Providers', href: '/subadmin/providers', icon: Briefcase },
        { label: 'Services Catalog', href: '/subadmin/services', icon: Wrench },
        { label: 'Categories', href: '/subadmin/categories', icon: Layers },
        { label: 'Support Tickets', href: '/subadmin/tickets', icon: Headphones },
      ];
    }

    if (role === 'provider') {
      return [
        { label: 'Provider Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
        { label: 'Assigned Bookings', href: '/provider/bookings', icon: Calendar },
        { label: 'My Services', href: '/provider/services', icon: Wrench },
        { label: 'Earnings & Payouts', href: '/provider/earnings', icon: DollarSign },
        { label: 'Business Profile', href: '/provider/profile', icon: User },
      ];
    }

    // Default: Customer
    return [
      { label: 'My Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
      { label: 'My Bookings', href: '/user/bookings', icon: Calendar },
      { label: 'Saved Addresses', href: '/user/addresses', icon: MapPin },
      { label: 'My Profile', href: '/user/profile', icon: User },
      { label: 'Help & Support', href: '/user/support', icon: Headphones },
    ];
  };

  const navItems = getNavItems();

  const getRoleBadgeColor = () => {
    if (role === 'admin') return 'red';
    if (role === 'subadmin') return 'purple';
    if (role === 'provider') return 'orange';
    return 'blue';
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed/Locked in place, will NOT scroll with container content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-royal to-blue-600 flex items-center justify-center text-white font-black text-sm">
              JS
            </div>
            <span className="font-black text-lg text-white tracking-tight">
              Jeevan<span className="text-accent-500">Seva</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <div className="mt-0.5">
                <Badge variant={getRoleBadgeColor()} size="sm">
                  {role.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links - Independently scrollable if nav items exceed sidebar height */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-royal text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-accent-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            Back to Public Website
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - Header is fixed, Main is scrollable */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header - Fixed at top of content */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-royal hover:underline px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200"
            >
              <Home className="w-3.5 h-3.5" /> View Public Site
            </Link>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{user?.name}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">{user?.city || 'India'}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* Content Body - Only this container scrolls up/down */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
