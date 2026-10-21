import { NextResponse } from 'next/server';

/**
 * Standard API JSON Success Response
 */
export function apiSuccess(data = {}, message = 'Success', status = 200, meta = null) {
  const body = {
    success: true,
    message,
    data,
  };
  if (meta) {
    body.meta = meta;
  }
  return NextResponse.json(body, { status });
}

/**
 * Standard API JSON Error Response
 */
export function apiError(message = 'An error occurred', status = 400, errors = null) {
  const body = {
    success: false,
    message,
  };
  if (errors) {
    body.errors = errors;
  }
  return NextResponse.json(body, { status });
}

/**
 * Indian Rupee formatter
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Friendly Date Formatter
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Friendly Time Formatter
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Slug generator
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Indian Mobile number validation (10 digits starting with 6,7,8,9)
 */
export function validateIndianMobile(mobile) {
  const cleaned = String(mobile).replace(/\D/g, '').slice(-10);
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Email validation
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

/**
 * Generate unique booking ID (e.g. JSB-20261021-9876)
 */
export function generateBookingNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `JSB-${dateStr}-${randomDigits}`;
}
