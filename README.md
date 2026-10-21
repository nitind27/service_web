# JeevanSeva - India's All-in-One Life Services Marketplace

A modern, production-ready, mobile-first marketplace web application built with **Next.js (App Router)**, **JavaScript**, **Tailwind CSS**, and **MySQL** (managed through phpMyAdmin). 

Offering end-to-end life services from birth celebrations to home repairs, healthcare, education, wedding planning, and dignified sacred last rites under a single roof.

---

## 🌟 Key Highlights & Features

- **10 Core Life Stages Categories**:
  1. *Home Services*: Deep cleaning, electrician, plumbing, carpenter, AC servicing, appliance repair.
  2. *Furniture & Interiors*: Carpentry, modular kitchen, sofa cleaning, wardrobe woodwork.
  3. *Personal & Family Care*: Babysitting, 24x7 elder care attendants, certified nurses at home, physiotherapy, emergency ambulance.
  4. *Education & Tutoring*: Verified home tutors (Class 1-12), competitive exam coaching, language & hobby classes.
  5. *Wedding & Events*: Candid photographers, wedding planners, caterers, decorators, mehndi artists, DJs, pandits.
  6. *Travel & Vehicle*: Doorstep waterless car detailing, bike repair, driver hire, outstation cabs, packers & movers.
  7. *Legal, Finance & Govt*: CA ITR tax filing, GST registration, property dispute lawyers, passport/visa help.
  8. *Beauty & Wellness*: Doorstep salon for women, relaxing spa, gym coaches, yoga teachers, dietitians.
  9. *Agriculture & Business*: Tractor rentals, farm hands, courier services, website design, printing.
  10. *Death & Last Rites*: 24x7 mortuary ambulance, hearse van, antim sanskar samagri, learned Vedic pandit, asthi visarjan escort, death certificate assistance.

- **Role-Based Access Control (4 Roles)**:
  - **Super Administrator**: Full system control, revenue analytics, user management, provider commission rates, payment refunds, coupon campaigns, site configuration.
  - **Operations Sub-Admin**: Service provider approvals, technician assignment to bookings, customer support tickets, catalog management (restricted from payment gateway credentials and super admin accounts).
  - **Service Partner / Vendor**: Real-time job notifications, start jobs, mark jobs completed with notes, net earnings tracking (after 15% marketplace commission), payout requests, business profile.
  - **Customer / User**: Browse catalog, multi-criteria filters (category, city, price range, ratings, sort), package variant selection (e.g. 1 BHK vs 2 BHK), multi-address book, coupon discount code application, online payment via Cashfree or Pay After Service (COD), live timeline tracking, invoice printing, review & rating.

- **Cashfree Payment Gateway Integration**:
  - Test mode / Sandbox support using environment variables (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV=TEST`).
  - Automated session creation (`/api/payments/create-order`) and order status verification (`/api/payments/verify`).
  - Offline test mode simulation fallback for instant local testing without live internet keys.

- **Authentication & Security**:
  - Secure JWT authentication stored in HTTP-only cookies (`allservice_auth_token`).
  - Bcrypt password hashing.
  - Indian 10-digit mobile number and email format validations.
  - Next.js middleware protection across `/user/*`, `/provider/*`, `/subadmin/*`, and `/admin/*`.

---

## 🗄️ Database Setup (phpMyAdmin / MySQL)

The database schema is fully normalized into 32 tables with foreign keys, indexes, and comprehensive Indian market seed data.

### Method 1: Automatic Node CLI Import (Recommended)
Make sure your MySQL server is running (e.g. in XAMPP or standalone MySQL service), then run:
```bash
npm run db:seed
```
This executes `scripts/seed-db.js`, automatically creating the database `allservice_db` and seeding all tables.

### Method 2: Manual Import in phpMyAdmin
1. Open your browser and go to `http://localhost/phpmyadmin`.
2. Click **New** in the left sidebar to create a database named `allservice_db` with collation `utf8mb4_unicode_ci`.
3. Select `allservice_db` and click on the **Import** tab in the top navigation.
4. Click **Choose File** and select `database.sql` from the root of this project.
5. Click **Import** at the bottom.

---

## 🔑 Demo Account Credentials

You can test any role instantly using the **1-Click Demo Login** buttons on the `/login` page, or type the credentials manually:

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@jeevanseva.in` | `Admin@123` | `/admin/dashboard` |
| **Operations Sub-Admin** | `subadmin@jeevanseva.in` | `Subadmin@123` | `/subadmin/dashboard` |
| **Service Partner** | `rajesh.provider@jeevanseva.in` | `Provider@123` | `/provider/dashboard` |
| **Customer User** | `customer@jeevanseva.in` | `Customer@123` | `/user/dashboard` |

---

## ⚙️ Environment Variables (`.env.local`)

```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="JeevanSeva - All-in-One Life Services"
NEXT_PUBLIC_SUPPORT_PHONE="+91 98765 43210"
NEXT_PUBLIC_SUPPORT_EMAIL="support@jeevanseva.in"

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=allservice_db

# JWT Secret
JWT_SECRET=super_secret_jeevanseva_all_life_services_jwt_key_2026_secure_token_abc123!@#
JWT_EXPIRES_IN=7d

# Cashfree Payment Gateway
CASHFREE_APP_ID=TEST103432924fa69fa1eb6832db73b29234301
CASHFREE_SECRET_KEY=TESTcfsk_ma_test_019a2b3c4d5e6f7g8h9i0j_98765432
CASHFREE_ENV=TEST
CASHFREE_API_VERSION=2023-08-01

# Uploads
UPLOAD_DIR=public/uploads
```

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Seed MySQL database (if not already done)
npm run db:seed

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Folder Structure

```
/all service
├── app/
│   ├── (public)/                 # Public customer-facing pages
│   │   ├── page.jsx              # Homepage with hero, 10 categories, featured services, FAQ
│   │   ├── layout.jsx            # Public navbar & trust footer
│   │   ├── categories/page.jsx   # 10 life stages catalog browser
│   │   ├── services/page.jsx     # Service search, category & price filters, sorting, pagination
│   │   ├── services/[slug]/page.jsx # Service detail, package variants, reviews, sticky book card
│   │   ├── book/[slug]/page.jsx  # Multi-step checkout with date/time, address, coupon, Cashfree
│   │   ├── booking/confirmation/[bookingNumber]/page.jsx # Live tracking & printable tax invoice
│   │   ├── about/page.jsx        # About Us & vision
│   │   ├── contact/page.jsx      # Contact desk & 24x7 helpline
│   │   ├── terms/page.jsx        # Terms of service
│   │   └── privacy/page.jsx      # Privacy policy
│   ├── (auth)/                   # Authentication flows
│   │   ├── login/page.jsx        # 1-Click demo logins & manual sign-in
│   │   ├── register/page.jsx     # Customer account registration
│   │   ├── register/provider/page.jsx # Service partner registration
│   │   └── forgot-password/page.jsx # Password reset
│   ├── user/                     # Customer dashboard
│   │   ├── dashboard/page.jsx
│   │   ├── bookings/page.jsx     # Active/completed bookings, cancel, rating & review
│   │   ├── addresses/page.jsx    # Saved delivery addresses
│   │   ├── profile/page.jsx      # User profile edit
│   │   ├── wallet/page.jsx       # Wallet balance & add money
│   │   └── support/page.jsx      # Customer support tickets
│   ├── provider/                 # Service Partner panel
│   │   ├── dashboard/page.jsx    # Net revenue, rating, active jobs
│   │   ├── bookings/page.jsx     # Start job, mark completed with notes
│   │   ├── services/page.jsx     # Offered services & add service modal
│   │   ├── earnings/page.jsx     # Payout requests & commissions
│   │   └── profile/page.jsx      # Business profile & verification status
│   ├── subadmin/                 # Operations Sub-Admin panel
│   │   ├── dashboard/page.jsx    # Operations overview
│   │   ├── bookings/page.jsx     # Manual partner assignment & status overrides
│   │   ├── providers/page.jsx    # Partner approvals queue
│   │   ├── services/page.jsx     # Catalog manager
│   │   ├── categories/page.jsx   # Category manager
│   │   └── tickets/page.jsx      # Customer support ticket resolution
│   ├── admin/                    # Super Admin executive panel
│   │   ├── dashboard/page.jsx    # Business metrics, top categories, recent orders
│   │   ├── users/page.jsx        # Customer accounts, block/unblock, delete
│   │   ├── providers/page.jsx    # Partner commissions & verification
│   │   ├── bookings/page.jsx     # Master bookings management
│   │   ├── services/page.jsx     # Catalog publishing & price editor
│   │   ├── categories/page.jsx   # Life category builder
│   │   ├── coupons/page.jsx      # Marketing promo codes
│   │   ├── payments/page.jsx     # Cashfree transactions & refund processing
│   │   ├── subadmins/page.jsx    # Staff management
│   │   ├── banners/page.jsx      # Hero slider banners
│   │   └── settings/page.jsx     # Platform financial & Cashfree keys
│   ├── api/                      # REST API Endpoints
│   │   ├── auth/                 # login, register, logout, me
│   │   ├── categories/           # GET, POST categories
│   │   ├── services/             # GET, POST, [slug] detail & updates
│   │   ├── bookings/             # GET, POST, [id] detail, [id]/status
│   │   ├── coupons/apply/        # POST coupon validation
│   │   ├── payments/             # create-order, verify
│   │   ├── user/                 # profile, addresses
│   │   ├── provider/             # earnings, bookings, services
│   │   ├── admin/                # stats, users, providers, coupons, settings
│   │   └── upload/               # Image & file upload handler
│   ├── layout.jsx                # Global root layout with providers
│   ├── error.jsx                 # Custom error boundary
│   └── not-found.jsx             # Custom 404 page
├── components/
│   ├── ui/                       # Reusable UI primitives (Button, Input, Select, Modal, Card, Badge, Pagination, etc.)
│   └── layout/                   # Navbar, Footer, DashboardLayout
├── lib/
│   ├── db.js                     # MySQL connection pool & prepared statements
│   ├── auth.js                   # JWT token issuance, verification & bcrypt hashing
│   ├── cashfree.js               # Cashfree PG API helper & test simulation
│   ├── utils.js                  # Indian Rupee formatting, dates, slugifier, validation
│   └── context/                  # AuthContext & ToastContext
├── database.sql                  # phpMyAdmin compatible database schema & seed data
└── package.json
```

---

## 💳 Testing Cashfree Payments
1. Open any service (e.g. `Full Home Deep Cleaning` or `Split AC Master Foam Jet Servicing`).
2. Click **Book Now**.
3. Select your desired package variant, date, time slot, and delivery address.
4. Try applying promo code **`WELCOME500`** (saves ₹500) or **`FESTIVE20`** (20% off).
5. Choose **Pay Online via Cashfree** or **Pay After Service (Cash on Delivery)**.
6. Click **Proceed to Pay with Cashfree**. The order session is initiated, verified, and you will receive a confirmed booking receipt with a printable tax invoice!
