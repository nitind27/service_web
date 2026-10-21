-- ========================================================
-- JeevanSeva - All-in-One Life Services Marketplace
-- Advanced Production Database Schema & Real Seed Data
-- ========================================================

CREATE DATABASE IF NOT EXISTS `allservice_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `allservice_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Table: roles
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: permissions
-- --------------------------------------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: role_permissions
-- --------------------------------------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` INT UNSIGNED NOT NULL DEFAULT 4,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mobile` VARCHAR(20) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'New Delhi',
  `status` ENUM('active', 'blocked', 'pending') NOT NULL DEFAULT 'active',
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `wallet_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_status` (`status`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: user_addresses
-- --------------------------------------------------------
DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE `user_addresses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(50) NOT NULL DEFAULT 'Home',
  `recipient_name` VARCHAR(100) DEFAULT NULL,
  `recipient_phone` VARCHAR(20) DEFAULT NULL,
  `address_line` VARCHAR(255) NOT NULL,
  `landmark` VARCHAR(150) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Delhi',
  `pincode` VARCHAR(10) NOT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_address_user` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: providers
-- --------------------------------------------------------
DROP TABLE IF EXISTS `providers`;
CREATE TABLE `providers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `business_name` VARCHAR(150) NOT NULL,
  `service_category_id` INT UNSIGNED DEFAULT NULL,
  `gst_number` VARCHAR(30) DEFAULT NULL,
  `experience_years` INT UNSIGNED DEFAULT 5,
  `about` TEXT,
  `city` VARCHAR(100) NOT NULL,
  `service_area` VARCHAR(255) DEFAULT 'Entire City & NCR',
  `status` ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'approved',
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 4.90,
  `total_reviews` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_jobs_done` INT UNSIGNED NOT NULL DEFAULT 0,
  `commission_rate` DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  `aadhaar_number` VARCHAR(20) DEFAULT 'XXXX-XXXX-8921',
  `pan_number` VARCHAR(20) DEFAULT 'ABCDE1234F',
  `bank_account_holder` VARCHAR(100) DEFAULT NULL,
  `bank_account_number` VARCHAR(50) DEFAULT NULL,
  `bank_ifsc` VARCHAR(20) DEFAULT NULL,
  `upi_id` VARCHAR(100) DEFAULT NULL,
  `id_proof` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_providers_status` (`status`),
  KEY `idx_providers_city` (`city`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: provider_documents
-- --------------------------------------------------------
DROP TABLE IF EXISTS `provider_documents`;
CREATE TABLE `provider_documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `provider_id` INT UNSIGNED NOT NULL,
  `document_name` VARCHAR(100) NOT NULL,
  `document_type` VARCHAR(50) NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'verified',
  `verified_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: provider_payouts
-- --------------------------------------------------------
DROP TABLE IF EXISTS `provider_payouts`;
CREATE TABLE `provider_payouts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `provider_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `bank_name` VARCHAR(100) DEFAULT 'HDFC Bank',
  `account_number` VARCHAR(50) DEFAULT '5010029381920',
  `ifsc_code` VARCHAR(20) DEFAULT 'HDFC0001234',
  `upi_id` VARCHAR(100) DEFAULT 'partner@upi',
  `status` ENUM('pending', 'processed', 'rejected') NOT NULL DEFAULT 'processed',
  `transaction_reference` VARCHAR(100) DEFAULT NULL,
  `processed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `icon` VARCHAR(100) NOT NULL DEFAULT 'Sparkles',
  `image` VARCHAR(255) DEFAULT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cat_slug` (`slug`),
  KEY `idx_cat_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: subcategories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cat_subcat_slug` (`category_id`, `slug`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: services
-- --------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `subcategory_id` INT UNSIGNED DEFAULT NULL,
  `provider_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `short_description` VARCHAR(300) NOT NULL,
  `description` TEXT NOT NULL,
  `base_price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2) DEFAULT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 60,
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 4.90,
  `total_reviews` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `service_guarantee` VARCHAR(255) DEFAULT '30-Day Happiness Guarantee',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_category` (`category_id`),
  KEY `idx_services_provider` (`provider_id`),
  KEY `idx_services_featured` (`is_featured`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: service_variants
-- --------------------------------------------------------
DROP TABLE IF EXISTS `service_variants`;
CREATE TABLE `service_variants` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2) DEFAULT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 60,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: coupons
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_booking_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `max_discount` DECIMAL(10,2) DEFAULT NULL,
  `usage_limit` INT NOT NULL DEFAULT 1000,
  `times_used` INT NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `valid_until` DATE DEFAULT '2027-12-31',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: bookings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_number` VARCHAR(30) NOT NULL UNIQUE,
  `service_otp` VARCHAR(6) NOT NULL DEFAULT '4821',
  `user_id` INT UNSIGNED NOT NULL,
  `provider_id` INT UNSIGNED DEFAULT NULL,
  `service_id` INT UNSIGNED NOT NULL,
  `variant_id` INT UNSIGNED DEFAULT NULL,
  `address_id` INT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(120) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_mobile` VARCHAR(20) NOT NULL,
  `address_snapshot` TEXT NOT NULL,
  `booking_date` DATE NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `special_instructions` TEXT DEFAULT NULL,
  `base_amount` DECIMAL(10,2) NOT NULL,
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `convenience_fee` DECIMAL(10,2) NOT NULL DEFAULT 49.00,
  `wallet_amount_used` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `coupon_code` VARCHAR(50) DEFAULT NULL,
  `payment_mode` ENUM('cashfree', 'cod', 'wallet') NOT NULL DEFAULT 'cashfree',
  `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `booking_status` ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refund_requested') NOT NULL DEFAULT 'pending',
  `completion_notes` TEXT DEFAULT NULL,
  `completion_photos` TEXT DEFAULT NULL,
  `cancellation_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_user` (`user_id`),
  KEY `idx_bookings_provider` (`provider_id`),
  KEY `idx_bookings_status` (`booking_status`),
  KEY `idx_bookings_number` (`booking_number`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: booking_messages (In-App Live Chat)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `booking_messages`;
CREATE TABLE `booking_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `sender_id` INT UNSIGNED NOT NULL,
  `sender_role` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bm_booking` (`booking_id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: wallet_transactions
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wallet_transactions`;
CREATE TABLE `wallet_transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('credit', 'debit') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `balance_after` DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: booking_status_history
-- --------------------------------------------------------
DROP TABLE IF EXISTS `booking_status_history`;
CREATE TABLE `booking_status_history` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `notes` VARCHAR(255) DEFAULT NULL,
  `changed_by_user_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: payments
-- --------------------------------------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `payment_gateway` VARCHAR(50) NOT NULL DEFAULT 'cashfree',
  `cf_order_id` VARCHAR(100) DEFAULT NULL,
  `payment_session_id` VARCHAR(255) DEFAULT NULL,
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `status` ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `payment_method` VARCHAR(50) DEFAULT 'ONLINE',
  `raw_response` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_order` (`cf_order_id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: refunds
-- --------------------------------------------------------
DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `payment_id` INT UNSIGNED DEFAULT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'processed', 'rejected') NOT NULL DEFAULT 'pending',
  `processed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: reviews
-- --------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL UNIQUE,
  `service_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `provider_id` INT UNSIGNED DEFAULT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `review_text` TEXT,
  `provider_reply` TEXT DEFAULT NULL,
  `status` ENUM('approved', 'pending', 'hidden') NOT NULL DEFAULT 'approved',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: notifications
-- --------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `type` ENUM('booking', 'payment', 'system', 'promo') NOT NULL DEFAULT 'system',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`, `is_read`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: support_tickets
-- --------------------------------------------------------
DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE `support_tickets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_number` VARCHAR(30) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED NOT NULL,
  `booking_id` INT UNSIGNED DEFAULT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `status` ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: ticket_messages
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ticket_messages`;
CREATE TABLE `ticket_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` INT UNSIGNED NOT NULL,
  `sender_id` INT UNSIGNED NOT NULL,
  `sender_role` VARCHAR(50) NOT NULL DEFAULT 'customer',
  `message` TEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: banners
-- --------------------------------------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `cta_link` VARCHAR(255) DEFAULT '/services',
  `cta_text` VARCHAR(50) DEFAULT 'Book Now',
  `badge_text` VARCHAR(50) DEFAULT 'Festive Special',
  `sort_order` INT NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: testimonials
-- --------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(100) NOT NULL,
  `user_city` VARCHAR(80) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `service_name` VARCHAR(120) NOT NULL,
  `feedback` TEXT NOT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: faqs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(80) NOT NULL DEFAULT 'General',
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: pages
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `content` LONGTEXT NOT NULL,
  `meta_title` VARCHAR(200) DEFAULT NULL,
  `meta_description` VARCHAR(300) DEFAULT NULL,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(80) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `group_name` VARCHAR(50) NOT NULL DEFAULT 'general',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: activity_logs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- COMPREHENSIVE PRODUCTION SEED DATA
-- ========================================================

-- Roles
INSERT INTO `roles` (`id`, `name`, `display_name`, `description`) VALUES
(1, 'admin', 'Super Administrator', 'Full system access and root management'),
(2, 'subadmin', 'Operations Sub-Admin', 'Assigned modules, category, service, and booking management'),
(3, 'provider', 'Service Partner / Vendor', 'Can offer services, manage bookings, and view earnings'),
(4, 'customer', 'Customer', 'Can search, book services, pay, and review');

-- Permissions
INSERT INTO `permissions` (`id`, `code`, `name`, `module`) VALUES
(1, 'manage_categories', 'Manage Categories', 'Catalog'),
(2, 'manage_services', 'Manage Services', 'Catalog'),
(3, 'manage_bookings', 'Manage Bookings', 'Operations'),
(4, 'manage_providers', 'Manage Providers', 'Operations'),
(5, 'manage_customers', 'Manage Customers', 'Operations'),
(6, 'manage_coupons', 'Manage Coupons', 'Marketing'),
(7, 'manage_support', 'Manage Support Tickets', 'Support'),
(8, 'manage_pages', 'Manage CMS Pages', 'Content'),
(9, 'view_reports', 'View Business Reports', 'Reports'),
(10, 'manage_settings', 'System Settings', 'System'),
(11, 'manage_admins', 'Manage Admin Users', 'System');

-- Sub-Admin Permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9);

-- Users (Bcrypt Hashes: Admin@123, Subadmin@123, Provider@123, Customer@123)
INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `mobile`, `password`, `city`, `status`, `wallet_balance`) VALUES
(1, 1, 'Super Admin', 'admin@jeevanseva.in', '9811000001', '$2a$10$c0/MDPOxSS0ZLv36fd3MseghZNmCOrHRNhKvFp/ZKtlgfyIYMLWx.', 'New Delhi', 'active', 5000.00),
(2, 2, 'Neha Sharma (Operations Manager)', 'subadmin@jeevanseva.in', '9811000002', '$2a$10$9rObvdNF5xJegWurjYPWnuUZkdq8ZHZcKDbGPspnMaI3G9Sh504IG', 'Gurugram', 'active', 1000.00),
(3, 3, 'Rajesh Sharma (Electro & AC Care)', 'rajesh.provider@jeevanseva.in', '9811000003', '$2a$10$JSgedxW2wNRKK6IhPVJawOCMDqwSt0QQbhkxxn0dIm/K2yr33nuSy', 'New Delhi', 'active', 8500.00),
(4, 3, 'Priya Verma (Glow Luxury Salon & Spa)', 'priya.salon@jeevanseva.in', '9811000004', '$2a$10$JSgedxW2wNRKK6IhPVJawOCMDqwSt0QQbhkxxn0dIm/K2yr33nuSy', 'Mumbai', 'active', 12400.00),
(5, 3, 'Dr. Anand Joshi (ElderCare & Nursing)', 'dr.anand@jeevanseva.in', '9811000005', '$2a$10$JSgedxW2wNRKK6IhPVJawOCMDqwSt0QQbhkxxn0dIm/K2yr33nuSy', 'Bengaluru', 'active', 15200.00),
(6, 3, 'Moksha Seva Trust (Last Rites & Hearse)', 'moksha.seva@jeevanseva.in', '9811000006', '$2a$10$JSgedxW2wNRKK6IhPVJawOCMDqwSt0QQbhkxxn0dIm/K2yr33nuSy', 'New Delhi', 'active', 22000.00),
(7, 4, 'Amitabh Roy', 'customer@jeevanseva.in', '9811000007', '$2a$10$.G26EjABesv3nzOIQdN1yeg.vgBEJayHcv4tTlZtVbIFmUKZpQ5gS', 'New Delhi', 'active', 750.00),
(8, 4, 'Sunita Kapoor', 'sunita.k@gmail.com', '9811000008', '$2a$10$.G26EjABesv3nzOIQdN1yeg.vgBEJayHcv4tTlZtVbIFmUKZpQ5gS', 'Mumbai', 'active', 350.00),
(9, 4, 'Vikramaditya Rathore', 'vikram.rathore@gmail.com', '9811000009', '$2a$10$.G26EjABesv3nzOIQdN1yeg.vgBEJayHcv4tTlZtVbIFmUKZpQ5gS', 'Jaipur', 'active', 500.00);

-- User Addresses
INSERT INTO `user_addresses` (`id`, `user_id`, `title`, `recipient_name`, `recipient_phone`, `address_line`, `landmark`, `city`, `state`, `pincode`, `is_default`) VALUES
(1, 7, 'Home', 'Amitabh Roy', '9811000007', 'Flat 402, Tower B, Royal Palms Society, Sector 62', 'Near City Centre Metro Station', 'Noida', 'Uttar Pradesh', '201301', 1),
(2, 7, 'Office', 'Amitabh Roy', '9811000007', 'Tower 3, 5th Floor, Cyber City, DLF Phase 2', 'Opposite Cyber Hub', 'Gurugram', 'Haryana', '122002', 0),
(3, 8, 'Home', 'Sunita Kapoor', '9811000008', 'B-12, Sagar Darshan Apartments, Worli Sea Face', 'Near Worli Dairy', 'Mumbai', 'Maharashtra', '400018', 1),
(4, 9, 'Villa', 'Vikramaditya Rathore', '9811000009', '44, Civil Lines, Near Raj Mandir', 'Behind High Court', 'Jaipur', 'Rajasthan', '302006', 1);

-- Providers
INSERT INTO `providers` (`id`, `user_id`, `business_name`, `gst_number`, `experience_years`, `about`, `city`, `service_area`, `status`, `rating`, `total_reviews`, `total_jobs_done`, `commission_rate`, `bank_account_holder`, `bank_account_number`, `bank_ifsc`, `upi_id`) VALUES
(1, 3, 'Sharma Electro & AC Care Solutions', '07AAAAA0000A1Z5', 9, 'Certified master technician with 9+ years experience in heavy appliance repairs, Split AC foam jet wash, and residential electrical security.', 'New Delhi', 'Delhi NCR, Noida, Gurugram, Ghaziabad', 'approved', 4.92, 54, 138, 15.00, 'Rajesh Sharma', '5010029381920', 'HDFC0001234', 'rajesh.sharma@okhdfcbank'),
(2, 4, 'Glow Luxury Doorstep Salon & Wellness', '27BBBBB1111B1Z2', 8, 'Premium bridal cosmetologists providing sterile organic facials, de-tan scrubs, relaxing Swedish therapy, and manicures at home.', 'Mumbai', 'South Mumbai, Bandra, Andheri, Powai', 'approved', 4.96, 78, 182, 15.00, 'Priya Verma', '919811000004', 'PYTM0123456', 'priya.verma@paytm'),
(3, 5, 'JeevanSparsh Healthcare & Elderly Care', '29CCCCC2222C1Z8', 14, 'Licensed hospital-grade nurses, physiotherapists, compassionate live-in senior caretakers, and emergency ICU setups at home.', 'Bengaluru', 'Bengaluru Urban, Indiranagar, Whitefield, Koramangala', 'approved', 4.90, 42, 105, 12.00, 'Dr Anand Joshi', '10293847561', 'SBIN0004321', 'jeevansparsh@icici'),
(4, 6, 'Moksha Seva Cremation & Sacred Rituals Trust', '07DDDDD3333D1Z4', 16, 'Empathetic 24x7 sacred transition support: hearse vans, freezer boxes, antim sanskar samagri, Vedic pandits, and Asthi Visarjan escort.', 'New Delhi', 'Delhi NCR, Haridwar, Varanasi, Prayagraj', 'approved', 5.00, 96, 240, 10.00, 'Moksha Seva Trust', '0029104000129', 'IBKL0000029', 'mokshaseva@upi');

-- Provider Documents
INSERT INTO `provider_documents` (`provider_id`, `document_name`, `document_type`, `file_url`, `status`) VALUES
(1, 'Aadhaar Card (Front & Back)', 'identity_proof', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', 'verified'),
(1, 'Electrical Contractor License', 'skill_certificate', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', 'verified'),
(2, 'CIDESCO Cosmetology Diploma', 'skill_certificate', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600', 'verified'),
(3, 'Indian Nursing Council Registration', 'medical_council', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600', 'verified'),
(4, 'Trust Registration & Municipal NOC', 'trust_deed', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600', 'verified');

-- Provider Payouts Log
INSERT INTO `provider_payouts` (`provider_id`, `amount`, `bank_name`, `account_number`, `ifsc_code`, `upi_id`, `status`, `transaction_reference`, `processed_at`) VALUES
(1, 15400.00, 'HDFC Bank', '5010029381920', 'HDFC0001234', 'rajesh.sharma@okhdfcbank', 'processed', 'UTR_HDFC_99281923847', '2026-10-18 14:30:00'),
(2, 21800.00, 'Paytm Payments Bank', '919811000004', 'PYTM0123456', 'priya.verma@paytm', 'processed', 'UTR_PYTM_88273619203', '2026-10-19 11:20:00'),
(3, 28500.00, 'State Bank of India', '10293847561', 'SBIN0004321', 'jeevansparsh@icici', 'processed', 'UTR_SBIN_77182930194', '2026-10-20 16:45:00');

-- 10 Core Life Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `image`, `tagline`, `description`, `sort_order`, `is_featured`, `status`) VALUES
(1, 'Home Services', 'home-services', 'Wrench', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80', 'Clean, repair & maintain your sanctuary', 'Mechanized deep cleaning, master AC service, certified electrician, plumbing, appliance repair, water purifier service, and pest control.', 1, 1, 'active'),
(2, 'Furniture & Interiors', 'furniture-services', 'Sofa', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', 'Crafting comfort, carpentry & elegant spaces', 'Bespoke woodwork, modular kitchen installation, sofa shampooing, hydraulic bed repair, and wardrobe sliding channel fixes.', 2, 1, 'active'),
(3, 'Personal & Family Care', 'personal-family', 'HeartPulse', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80', 'Compassionate care for every loved one', '24x7 elder care attendants, post-surgery home nurses, pediatric babysitters, home physiotherapy, teleconsultation, and emergency ambulances.', 3, 1, 'active'),
(4, 'Education & Tutoring', 'education-tutoring', 'GraduationCap', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80', 'Guiding brilliant minds to achieve greatness', 'Verified home tutors for Class 1-12 (CBSE/ICSE), IIT-JEE & NEET private faculty, spoken English, piano/guitar lessons, and kids coding.', 4, 1, 'active'),
(5, 'Wedding & Events', 'wedding-events', 'PartyPopper', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', 'Unforgettable milestones celebrated seamlessly', 'Candid pre-wedding photography, gourmet catering, mandap decor, learned Vedic pandits for vivah, mehndi artists, and sound DJs.', 5, 1, 'active'),
(6, 'Travel & Vehicle', 'travel-vehicle', 'Car', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80', 'Smooth journeys, reliable rides & maintenance', 'Waterless doorstep foam car detailing, two-wheeler service, on-demand verified drivers per hour, outstation cabs, and packers & movers.', 6, 1, 'active'),
(7, 'Legal, Finance & Govt', 'legal-finance-govt', 'Scale', 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80', 'Your trusted advisory & compliance partners', 'CA ITR income tax filing, GST registration, property title verification, will drafting, Tatkal passport assistance, and insurance guidance.', 7, 1, 'active'),
(8, 'Beauty & Wellness', 'beauty-wellness', 'Sparkles', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&auto=format&fit=crop&q=80', 'Rejuvenating glow, relaxing spas & holistic health', 'Doorstep salon for women, organic facial & de-tan, Swedish therapeutic massage, certified gym trainer, and yoga instructor at home.', 8, 1, 'active'),
(9, 'Agriculture & Business', 'agriculture-business', 'Briefcase', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80', 'Empowering farms, trades & modern ventures', 'Tractor on hourly rent with rotavator, skilled farm hands, business website development, Google Ads marketing, and commercial banner printing.', 9, 1, 'active'),
(10, 'Death & Last Rites', 'death-after-death', 'ShieldAlert', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80', 'Dignified sacred transitions with reverence', '24x7 mortuary freezer hearse van, complete 32-item antim sanskar samagri, Vedic pandit for last rites, cremation slot booking & Asthi Visarjan escort.', 10, 1, 'active');

-- Subcategories
INSERT INTO `subcategories` (`id`, `category_id`, `name`, `slug`, `icon`, `description`, `sort_order`) VALUES
(1, 1, 'Deep Home Cleaning', 'deep-home-cleaning', 'Sparkles', 'Mechanized scrubbing, kitchen de-greasing, bathroom tile descaling', 1),
(2, 1, 'AC & Appliance Care', 'ac-appliance-repair', 'Airplay', 'High-pressure foam jet servicing, gas check, washing machine & fridge fix', 2),
(3, 1, 'Electrician & Plumbing', 'electrician-plumbing', 'Zap', 'Emergency switches, MCB tripping, geyser repair, water leakage', 3),
(4, 1, 'RO Water Purifier Service', 'ro-water-purifier', 'Droplets', 'Membrane change, sediment filter replacement, TDS calibration', 4),
(5, 2, 'Carpentry & Furniture Repair', 'carpentry-furniture-repair', 'Hammer', 'Hinges, drawer channels, bed lift, wardrobe sliding tracks', 1),
(6, 2, 'Modular Kitchen & Interiors', 'modular-kitchen-interiors', 'LayoutGrid', 'Turnkey modular kitchen, custom woodwork, and chimney installation', 2),
(7, 3, 'Elder Care & Attendants', 'elder-care-attendants', 'Heart', 'Gentle 12/24 hour police-verified attendants for senior mobility & medicine', 1),
(8, 3, 'Home Nursing & Physio', 'home-nursing-physio', 'Activity', 'Registered B.Sc nurses for IV, injections, post-surgery recovery, physio', 2),
(9, 3, 'Emergency Ambulance Service', 'emergency-ambulance-service', 'Ambulance', '24x7 Oxygen, Basic Life Support (BLS) & ICU ACLS Ventilator Ambulances', 3),
(10, 4, 'Home Tutors (Class 1-12)', 'home-tutors-k12', 'BookOpen', 'Maths, Physics, Chemistry, Biology & English personalized teaching', 1),
(11, 4, 'IIT-JEE & NEET Coaching', 'iit-jee-neet-coaching', 'GraduationCap', 'Subject matter experts for top entrance exam rank preparation', 2),
(12, 5, 'Photography & Cinematography', 'photography-cinematography', 'Camera', '4K candid matrimonial shoot, drone aerial, teaser videos, photobooks', 1),
(13, 5, 'Catering & Mandap Decor', 'catering-mandap-decor', 'PartyPopper', 'Gourmet live counters, North/South Indian menu, floral stage decoration', 2),
(14, 5, 'Pandit for Sacred Rituals', 'pandit-sacred-rituals', 'Flame', 'Learned Vedic pandits for Vivah, Griha Pravesh, Satyanarayan, Havan', 3),
(15, 6, 'Doorstep Car Detailing', 'doorstep-car-detailing', 'Gauge', 'Waterless polymer wash, carnauba waxing, interior steam disinfection', 1),
(16, 6, 'On-Demand Driver Hire', 'on-demand-driver-hire', 'UserCheck', 'Police-verified experienced chauffeurs per hour or outstation trips', 2),
(17, 7, 'CA Income Tax & GST Filing', 'ca-tax-gst-filing', 'FileText', 'Salary, capital gains, freelance ITR filing, GST return & incorporation', 1),
(18, 8, 'Salon at Home for Women', 'salon-at-home-women', 'Flower', 'Roll-on waxing, O3+ bridal facial, honey mani-pedi, haircut & blowdry', 1),
(19, 8, 'Swedish & Ayurvedic Spa', 'swedish-ayurvedic-spa', 'Sparkles', 'Therapeutic pain relief massage, warm herbal oils, aroma relaxation', 2),
(20, 9, 'Tractor & Farm Equipment', 'tractor-farm-equipment', 'Tractor', 'Hourly tractor rental with driver, rotavator, cultivators, farm hands', 1),
(21, 9, 'Digital Marketing & Web', 'digital-marketing-web', 'Globe', 'Business website development, Google Ads lead generation, SEO', 2),
(22, 10, 'Funeral & Last Rites Assistance', 'funeral-last-rites-assistance', 'ShieldAlert', '24x7 hearse van, mortuary freezer box, samagri, Vedic pandit, slot booking', 1),
(23, 10, 'Asthi Visarjan Escort', 'asthi-visarjan-escort', 'Anchor', 'Sacred journey arrangements to Haridwar, Varanasi, or Prayagraj Sangam', 2);

-- Real Services Catalog
INSERT INTO `services` (`id`, `category_id`, `subcategory_id`, `provider_id`, `title`, `slug`, `short_description`, `description`, `base_price`, `discount_price`, `duration_minutes`, `thumbnail`, `rating`, `total_reviews`, `is_featured`, `service_guarantee`, `status`) VALUES
(1, 1, 1, 1, 'Full Home Deep Cleaning (1 to 4 BHK)', 'full-home-deep-cleaning', 'Intensive motorized scrubbing, kitchen de-greasing, bathroom tile descaling, sofa & mattress vacuuming.', 'Experience 5-star cleanliness! Includes heavy-duty motorized floor scrubbers, eco-friendly Taski divergent chemicals, high-temperature steam sterilization of bathrooms, degreasing of chimney and gas stoves, and vacuuming of all fabric furniture. Zero chemical smell, 100% spotless finish guaranteed.', 2499.00, 1999.00, 240, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80', 4.92, 142, 1, '30-Day Happiness Guarantee', 'active'),
(2, 1, 2, 1, 'Split AC Master Power Jet Foam Servicing', 'split-ac-foam-jet-servicing', 'Deep indoor and outdoor pressure wash with specialized coil foam cleaner and gas pressure diagnostics.', 'Slash power consumption and boost cooling speed. Utilizing high-pressure 120-bar water pumps and anti-bacterial active foam to dislodge sticky dust from inner fins. No wall spills using our patented waterproof jacket harness. Comprehensive check of compressor ampere load and refrigerant leakages.', 699.00, 499.00, 60, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', 4.89, 210, 1, '30-Day Cooling Warranty', 'active'),
(3, 1, 3, 1, 'Emergency Electrician On-Demand (60 Mins)', 'emergency-electrician-on-demand', 'Quick doorstep response for short circuits, MCB tripping, ceiling fan noise, chandelier or geyser wiring.', 'Certified master electricians with calibrated digital multimeters, insulated safety gear, and standard OEM replacement switches. Transparent pricing with pre-fixed rate cards and no hidden charges.', 299.00, 199.00, 45, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80', 4.86, 96, 1, '100% Safety Certified', 'active'),
(4, 1, 4, 1, 'RO Water Purifier Complete Filter & Membrane Service', 'ro-water-purifier-service', 'Complete replacement of sediment, carbon filter, and RO membrane with digital TDS calibration.', 'Ensure your family drinks 100% pure water. Includes full system descaling, UV lamp inspection, new 80 GPD high-rejection membrane installation, and multi-point pressure check.', 1499.00, 1199.00, 60, 'https://images.unsplash.com/photo-1584771107524-74c76067b445?w=800&auto=format&fit=crop&q=80', 4.88, 74, 0, '1-Year Membrane Warranty', 'active'),
(5, 2, 5, 1, 'Custom Carpentry & Furniture Repair (Doors, Bed, Wardrobe)', 'custom-carpentry-furniture-repair', 'Fix hydraulic bed lifts, squeaky doors, sliding wardrobe channels, or assemble flat-pack furniture.', 'Equipped with precision German power tools. Our carpenters resolve stuck drawer runners, replace worn hydraulic gas springs on storage beds, re-align modular cabinets, and fit heavy security locks.', 499.00, 399.00, 90, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', 4.87, 85, 0, 'Zero-Damage Work Guarantee', 'active'),
(6, 2, 6, 1, 'Turnkey Modular Kitchen Design & Woodwork Execution', 'turnkey-modular-kitchen-interiors', 'Bespoke acrylic, PU or laminate modular kitchen installation with soft-close tandem boxes and quartz tops.', 'Transform your cooking space! Includes in-home 3D design consultation, high-density water-resistant HDHMR boards, soft-close Blum/Hettich hinges, pantry units, and chimney ducting execution.', 45000.00, 38999.00, 720, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80', 4.95, 38, 1, '10-Year Hardware Warranty', 'active'),
(7, 3, 7, 3, '24/7 Compassionate Elder Care Attendant', 'elder-care-attendant-24-7', 'Gentle, police-verified caretaker for senior citizens: mobility, sponge bath, medicines, companion walk.', 'Respectful, experienced senior care assistants. Daily routine support including bed-to-wheelchair transfers, timely prescription dispensing, vitals monitoring (BP/Sugar/Pulse), meal assistance, and empathetic conversational companionship. Includes weekly supervisor home audits.', 1200.00, 999.00, 720, 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80', 4.96, 114, 1, 'Police Verified Caregiver', 'active'),
(8, 3, 8, 3, 'Registered B.Sc Nurse At Home (Injections, IV, Dressing, Catheter)', 'certified-nurse-at-home', 'Certified clinical nurse visits for post-operative recovery, IV cannulation, surgical wound dressing.', 'Skip long hospital waiting rooms. Our certified nursing staff administers prescribed intravenous medicines, manages Ryle’s tube and Foley catheter changes, bed-sore wound care, and oxygen therapy under sterile clinical protocol.', 599.00, 449.00, 45, 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80', 4.91, 62, 1, 'Clinical Sterile Standards', 'active'),
(9, 3, 9, 3, '24x7 Emergency Ambulance Service (BLS & ICU Ventilator)', 'emergency-ambulance-service-24x7', 'Rapid dispatch ambulance with paramedic, oxygen cylinder, multipara monitor, or advanced ventilator.', 'Urgent hospital transfer or inter-city patient shifting. Fully sanitized ambulances equipped with spine board, suction machine, emergency drugs, and trained EMT crew on board. Instant dispatch coordination within 15 minutes.', 2499.00, 1999.00, 60, 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop&q=80', 4.98, 89, 1, '15-Min Rapid Dispatch', 'active'),
(10, 4, 10, NULL, 'Personalized 1-on-1 Home Tutors (CBSE / ICSE Class 1-12)', 'personalized-home-tutors-k12', 'Experienced tutors for Mathematics, Physics, Chemistry, Biology & English with free 1-hour demo.', 'Accelerate your child’s academic confidence. Background-checked educators who tailor lessons to the student’s learning pace, conduct weekly mock tests, track school curriculum, and provide solved past year board papers.', 1500.00, 1199.00, 60, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', 4.94, 126, 1, 'Free 1-Hour Demo Session', 'active'),
(11, 4, 11, NULL, 'IIT-JEE & NEET Advanced Private Faculty Coaching', 'iit-jee-neet-coaching-faculty', 'Former top coaching institute faculty for Advanced Mechanics, Organic Chemistry, and Calculus.', 'Comprehensive conceptual rigor for engineering and medical aspirants. Problem solving sessions on 10+ years JEE Advanced/NEET question banks, test analysis, and doubt elimination classes.', 2500.00, 1999.00, 90, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80', 4.97, 72, 0, 'Top Percentile Faculty', 'active'),
(12, 5, 12, NULL, 'Candid Wedding & Matrimonial Photography Package', 'candid-wedding-event-photography', 'Full-day 4K coverage, cinematic teaser video, drone aerial shots, and luxury hardbound photobook.', 'Cherish sacred wedding memories forever. Award-winning team of 2 candid photographers and 1 master cinematographer using Sony FX prime lenses, motorized gimbals, color grading, and delivering 400+ high-res edited stills.', 24999.00, 19999.00, 480, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80', 4.98, 54, 1, 'Includes Drone & Raw Footage', 'active'),
(13, 5, 13, NULL, 'Gourmet Wedding & Event Catering Service (Live Counters)', 'gourmet-wedding-event-catering', 'Exquisite North & South Indian buffet with live chaat, pasta, tandoor counters, and desserts.', 'Delight your guests with culinary perfection. Certified chefs, hygienic food preparation, elegant silver chafing dishes, trained stewards, and customized dietary menus (Jain / Vegan available). Minimum 50 plates.', 850.00, 699.00, 240, 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80', 4.93, 44, 0, 'FSSAI Certified Kitchen', 'active'),
(14, 5, 14, 4, 'Learned Vedic Pandit Ji for Vivah / Griha Pravesh / Havan', 'vedic-pandit-sacred-rituals', 'Experienced Brahmin pandits reciting authentic Vedic shlokas with complete pooja samagri guidance.', 'Perform sacred rituals with pure devotion and vidhi-vidhaan. We arrange learned Acharyas for Vivah Sanskar, Griha Pravesh Vastu Pooja, Satyanarayan Katha, Mahamrityunjaya Jaap, and Navgrah Shanti Havan.', 3500.00, 2799.00, 180, 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80', 4.99, 138, 1, 'Complete Samagri Checklist', 'active'),
(15, 6, 15, NULL, 'Waterless Doorstep Eco-Car Foam Detailing & Wax', 'doorstep-car-detailing-foam-wash', 'High-gloss exterior carnauba waxing, interior vacuuming, dashboard UV coat, and AC steam sanitization.', 'Showroom shine right in your parking bay. No dirty puddle water mess. Utilizing German polymer lift sprays that suspend dirt safely without paint scratches, followed by deep vacuuming of carpets and upholstery.', 899.00, 649.00, 90, 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80', 4.88, 142, 1, 'Showroom Gloss Guarantee', 'active'),
(16, 6, 16, NULL, 'On-Demand Chauffeur & Driver Hire (Hourly / Daily)', 'on-demand-driver-hire-hourly', 'Police-verified, uniform-clad professional drivers for manual and automatic cars in city or outstation.', 'Enjoy a relaxing drive in your own car. Our background-checked drivers have 5+ years accident-free driving record. Ideal for party nights, elderly hospital visits, heavy traffic commutes, or weekend road trips.', 499.00, 399.00, 240, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80', 4.87, 88, 0, 'Police Verified Driver', 'active'),
(17, 7, 17, NULL, 'Income Tax Return (ITR) Filing by Senior Chartered Accountant', 'income-tax-return-filing-ca', 'Complete tax planning, salary, capital gains, freelance, or business return filing with e-verification.', 'Maximize tax refunds under Old vs New Tax Regime. Direct WhatsApp consultation with an assigned CA, deduction optimization (80C, 80D, 24b, HRA), and instant income tax department acknowledgement.', 999.00, 749.00, 60, 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80', 4.92, 184, 1, '100% Notice-Free Guarantee', 'active'),
(18, 8, 18, 2, 'Luxury Glow Bridal Facial & Honey Spa Mani-Pedi at Home', 'luxury-glow-bridal-facial-mani-pedi', 'Diamond glow facial, crystal de-tan, soothing honey & milk pedicure, and relaxing neck massage.', 'Pamper yourself in privacy. Disposable sheets, sanitized sealed tool pouches, organic O3+ formulations, and relaxing aromatherapy inside your living room. No parlor rush or traffic stress.', 1999.00, 1499.00, 120, 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80', 4.97, 218, 1, 'O3+ & VLCC Sealed Kits', 'active'),
(19, 8, 19, 2, 'Full Body Swedish Stress-Relief Therapeutic Massage', 'swedish-stress-relief-massage', '60-minute relaxing muscular pain relief massage using warm essential oils by certified therapists.', 'Dissolve work fatigue and body aches. Certified therapists use long flowing strokes to enhance blood circulation, release myofascial tension, and promote deep restful sleep. Disposables and massage oils provided.', 1799.00, 1399.00, 60, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80', 4.94, 95, 0, 'Certified Female Therapists', 'active'),
(20, 9, 20, NULL, 'Tractor on Hourly Rent with Rotavator & Driver', 'tractor-rental-rotavator-hourly', '50 HP modern Mahindra/Swaraj tractor for soil tilling, seed bed preparation, and farm leveling.', 'Boost crop yields with mechanized field preparation. Includes tractor fuel, experienced farm driver, and 7-feet rotavator attachment. Available across rural and semi-urban belts.', 1200.00, 999.00, 60, 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80', 4.85, 48, 1, 'Fuel & Driver Included', 'active'),
(21, 9, 21, NULL, 'Custom Business Website Development & Google Setup', 'business-website-development', 'Mobile-responsive modern company website, domain setup, Google Business Profile, and contact forms.', 'Take your business online with credibility! Includes 5 high-converting pages, fast loading Next.js framework, WhatsApp click-to-chat integration, SEO tags, and Google Maps listing verification.', 9999.00, 7999.00, 480, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', 4.93, 36, 0, '1-Year Free Hosting', 'active'),
(22, 10, 22, 4, 'Complete Dignified Funeral & Last Rites Assistance', 'complete-funeral-last-rites-assistance', '24x7 hearse van, antim sanskar samagri, Vedic pandit, cremation slot booking & death certificate help.', 'In moments of profound loss, we stand beside your family with utmost reverence, dignity, and empathy. Arranging AC hearse transport, freezer box at home, complete 32-item pure sacred samagri, learned pandit ji, and coordination with local crematoriums.', 8500.00, 6999.00, 360, 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80', 5.00, 112, 1, '24x7 Immediate Response', 'active'),
(23, 10, 23, 4, 'Asthi Visarjan Sacred Escort Service (Haridwar / Varanasi)', 'asthi-visarjan-sacred-escort', 'Respectful escort and complete Vedic rituals for immersion of ashes at sacred Ganga Ghats.', 'Fulfill holy obligations with peace of mind. Experienced pilgrimage guides and Tirth Purohits arrange boat transfers at Har-ki-Pauri Haridwar or Manikarnika Ghat Varanasi, Pind Daan rituals, and priest dakshina.', 6500.00, 5499.00, 240, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80', 4.98, 47, 0, 'Tirth Purohit Guided', 'active');

-- Service Variants
INSERT INTO `service_variants` (`id`, `service_id`, `title`, `description`, `price`, `discount_price`, `duration_minutes`, `sort_order`) VALUES
(1, 1, '1 BHK Apartment Intensive Scrub', 'Kitchen, 1 bathroom, living hall, 1 bedroom, balcony', 2499.00, 1999.00, 180, 1),
(2, 1, '2 BHK Apartment Intensive Scrub', 'Kitchen, 2 bathrooms, living hall, 2 bedrooms, balconies', 3499.00, 2799.00, 240, 2),
(3, 1, '3 BHK Apartment Intensive Scrub', 'Kitchen, 3 bathrooms, living hall, 3 bedrooms, balconies', 4599.00, 3699.00, 300, 3),
(4, 1, '4 BHK / Luxury Villa Deep Clean', 'Heavy motorized scrubbers for entire duplex / large villa', 6299.00, 4999.00, 360, 4),
(5, 2, 'Single Split AC Power Jet Wash', '1 Indoor & 1 outdoor unit master deep cleaning', 699.00, 499.00, 60, 1),
(6, 2, 'Twin ACs Combo Saver Package', '2 ACs full pressure wash with free outdoor coil check', 1299.00, 899.00, 100, 2),
(7, 2, '3 ACs Full Home Super Saver', '3 ACs comprehensive servicing + gas leakage test', 1899.00, 1299.00, 150, 3),
(8, 7, '12-Hour Day Shift Senior Caretaker', 'Day shift mobility, sponge bath, meals & medicine support', 999.00, 799.00, 720, 1),
(9, 7, '24-Hour Live-in Compassionate Attendant', 'Round-the-clock stay with senior citizen for safety & hygiene', 1600.00, 1299.00, 1440, 2),
(10, 14, 'Griha Pravesh & Vastu Havan Package', 'Complete pooja, havan samagri, and 2 learned pandits', 4500.00, 3699.00, 180, 1),
(11, 14, 'Satyanarayan Katha & Aarti', 'Pooja recitation, prasad preparation guidance, shankh naad', 2500.00, 1999.00, 120, 2),
(12, 18, 'Essential Glow Facial + Waxing Combo', 'O3+ facial, arms & legs honey wax, upper lip threading', 1599.00, 1199.00, 90, 1),
(13, 18, 'Royal Bridal Crystal Radiance Makeover', 'Diamond facial, lotus pedicure, full body bleach & hair spa', 2999.00, 2299.00, 150, 2),
(14, 22, 'Basic Respectful Antim Sanskar Kit & Hearse', 'Hearse transport, antim sanskar samagri, and pandit', 6500.00, 5499.00, 240, 1),
(15, 22, 'Full Dignified Ritual & Cremation Reservation', 'Hearse, samagri, pandit, cremation slot, and Asthi Visarjan guide', 11500.00, 9999.00, 360, 2);

-- Coupons
INSERT INTO `coupons` (`id`, `code`, `title`, `discount_type`, `discount_value`, `min_booking_amount`, `max_discount`, `usage_limit`, `times_used`, `status`) VALUES
(1, 'WELCOME500', 'New User Welcome Flat Rs 500 Off', 'fixed', 500.00, 1500.00, 500.00, 5000, 84, 'active'),
(2, 'FESTIVE20', 'Festive Season 20% Off', 'percentage', 20.00, 800.00, 600.00, 10000, 128, 'active'),
(3, 'LIFECARE100', 'Flat Rs 100 Off on any Care Service', 'fixed', 100.00, 400.00, 100.00, 2000, 52, 'active'),
(4, 'HOMECLEAN15', '15% Off on Home Deep Cleaning', 'percentage', 15.00, 1200.00, 450.00, 3000, 65, 'active');

-- Bookings with Security Service OTP
INSERT INTO `bookings` (`id`, `booking_number`, `service_otp`, `user_id`, `provider_id`, `service_id`, `variant_id`, `address_id`, `customer_name`, `customer_email`, `customer_mobile`, `address_snapshot`, `booking_date`, `time_slot`, `base_amount`, `tax_amount`, `discount_amount`, `convenience_fee`, `wallet_amount_used`, `total_amount`, `coupon_code`, `payment_mode`, `payment_status`, `booking_status`) VALUES
(1, 'JSB-20261021-001', '4821', 7, 1, 1, 2, 1, 'Amitabh Roy', 'customer@jeevanseva.in', '9811000007', 'Flat 402, Tower B, Royal Palms Society, Sector 62, Noida, UP - 201301', '2026-10-23', '10:00 AM - 12:00 PM', 2799.00, 140.00, 500.00, 49.00, 0.00, 2488.00, 'WELCOME500', 'cashfree', 'paid', 'confirmed'),
(2, 'JSB-20261021-002', '7192', 7, 1, 2, 6, 1, 'Amitabh Roy', 'customer@jeevanseva.in', '9811000007', 'Flat 402, Tower B, Royal Palms Society, Sector 62, Noida, UP - 201301', '2026-10-22', '02:00 PM - 04:00 PM', 899.00, 45.00, 100.00, 49.00, 0.00, 893.00, 'LIFECARE100', 'cod', 'pending', 'assigned'),
(3, 'JSB-20261020-003', '3381', 8, 2, 18, 13, 3, 'Sunita Kapoor', 'sunita.k@gmail.com', '9811000008', 'B-12, Sagar Darshan Apartments, Worli Sea Face, Mumbai - 400018', '2026-10-20', '11:00 AM - 01:00 PM', 2299.00, 115.00, 0.00, 49.00, 0.00, 2463.00, NULL, 'cashfree', 'paid', 'completed');

-- Booking In-App Messages
INSERT INTO `booking_messages` (`booking_id`, `sender_id`, `sender_role`, `message`) VALUES
(1, 7, 'customer', 'Hello! Please bring ladder for ceiling fan cleaning as our ceiling is 10.5 ft high.'),
(1, 3, 'provider', 'Namaste Amitabh ji! Yes, we have added a lightweight aluminum 8-step ladder to our technician van. We will reach at 10:15 AM sharp.'),
(2, 1, 'admin', 'Technician Rajesh Sharma has been dispatched to your Sector 62 Noida address.');

-- Wallet Transactions
INSERT INTO `wallet_transactions` (`user_id`, `type`, `amount`, `balance_after`, `description`) VALUES
(7, 'credit', 500.00, 500.00, 'Welcome Signup Credit Bonus'),
(7, 'credit', 250.00, 750.00, 'Friend Referral Cashback');

-- Booking Status History
INSERT INTO `booking_status_history` (`booking_id`, `status`, `notes`, `changed_by_user_id`) VALUES
(1, 'pending', 'Order placed by customer via Cashfree Checkout', 7),
(1, 'confirmed', 'Payment verified successfully via Cashfree Gateway', 1),
(2, 'pending', 'COD order placed by customer', 7),
(2, 'assigned', 'Assigned to verified partner Sharma Electro Care', 2),
(3, 'pending', 'Order placed by customer', 8),
(3, 'confirmed', 'Paid online via Cashfree UPI', 8),
(3, 'in_progress', 'Beautician Priya reached doorstep and verified OTP', 4),
(3, 'completed', 'Job completed with 5-star customer review', 4);

-- Notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `link`, `type`, `is_read`) VALUES
(7, 'Booking Confirmed!', 'Your booking #JSB-20261021-001 has been confirmed. Technician will arrive on Oct 23.', '/user/bookings', 'booking', 0),
(7, 'Wallet Credit Added', '₹250 cashback credited to your JeevanSeva Wallet!', '/user/wallet', 'system', 1),
(3, 'New Job Request Assigned', 'You have been assigned booking #JSB-20261021-002 in Sector 62 Noida.', '/provider/bookings', 'booking', 0);

-- Reviews
INSERT INTO `reviews` (`booking_id`, `service_id`, `user_id`, `provider_id`, `rating`, `review_text`, `provider_reply`) VALUES
(3, 18, 8, 2, 5, 'Absolutely delightful bridal salon experience at home! Priya arrived punctually with hygienic sealed kits. The diamond facial gave an instant festive radiance.', 'Thank you so much Sunita ji! It was our pleasure to serve you.');

-- Testimonials
INSERT INTO `testimonials` (`user_name`, `user_city`, `rating`, `service_name`, `feedback`, `avatar`) VALUES
('Vikas Mehra', 'Delhi NCR', 5, 'AC Power Jet Servicing', 'Booked AC repair when cooling completely tripped in 43°C heat. The technician arrived within 40 mins and cleared the blocked coils with zero mess. Brilliant service!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('Ananya Deshmukh', 'Mumbai', 5, '24x7 Elder Care Attendant', 'We needed round-the-clock support for our 82-year-old grandmother. JeevanSeva connected us to an angel of an attendant who took care of her medicines, walking, and food with so much love.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('Karthik Subbaraman', 'Bengaluru', 5, 'Home Deep Cleaning', '100% value for money! Their team brought industrial scrubbers and eliminated tough grease marks that had been on our kitchen tiles for 3 years. Booking again every Diwali!', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');

-- Banners
INSERT INTO `banners` (`title`, `subtitle`, `image_url`, `cta_link`, `cta_text`, `badge_text`, `sort_order`, `status`) VALUES
('India\'s Most Trusted Multi-Service Marketplace', 'From newborn care to home deep cleaning & sacred ceremonies, book top verified experts at transparent prices.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80', '/services', 'Explore All Services', 'Verified & Insured', 1, 'active'),
('Celebrate Life\'s Grand Occasions Stress-Free', 'Book wedding planners, catering, decor, and photographers with guaranteed milestone delivery.', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80', '/services?category=wedding-events', 'Book Event Services', 'Up to 20% Off', 2, 'active');

-- FAQs
INSERT INTO `faqs` (`category_name`, `question`, `answer`, `sort_order`) VALUES
('Booking & Pricing', 'How does pricing work on JeevanSeva?', 'All service charges are transparently listed upfront. There are no hidden costs. You can select package variants (e.g. 1 BHK vs 2 BHK) and view complete price breakdowns including taxes and discounts before paying.', 1),
('Safety & Quality', 'Are your service professionals verified?', 'Yes. Every service partner undergoes background identity verification (Aadhaar/PAN/Police check), skills assessment, and service quality training before joining the platform.', 2),
('Security OTP', 'What is the 4-digit Service Security OTP?', 'To prevent unauthorized work or fake completions, every booking generates a unique 4-digit code in your app. Please share it with the partner only after they arrive at your doorstep.', 3),
('Payment & Refunds', 'What payment methods are supported?', 'We support secure online payments via Cashfree (UPI, Google Pay, PhonePe, Credit/Debit Cards, Net Banking) as well as Cash on Delivery (Pay After Service) for eligible services.', 4),
('Support & Warranty', 'What if I am not satisfied with the service?', 'We provide a 30-Day Service Guarantee on home repairs and cleaning. If something was not done right, our team will revisit and resolve the issue free of charge or process a refund.', 5);

-- Settings
INSERT INTO `settings` (`setting_key`, `setting_value`, `group_name`) VALUES
('site_name', 'JeevanSeva - All-in-One Life Services', 'general'),
('site_tagline', 'Every Service You Need — From Birth to Beyond', 'general'),
('support_phone', '+91 98765 43210', 'contact'),
('support_email', 'care@jeevanseva.in', 'contact'),
('platform_commission', '15', 'finance'),
('gst_percentage', '5', 'finance'),
('convenience_fee', '49', 'finance'),
('cashfree_mode', 'TEST', 'payment'),
('cashfree_app_id', 'TEST103432924fa69fa1eb6832db73b29234301', 'payment');

-- CMS Pages
INSERT INTO `pages` (`title`, `slug`, `content`, `meta_title`, `meta_description`) VALUES
('About Us', 'about-us', 'JeevanSeva was founded with a singular, compassionate vision: to accompany Indian families across every stage of human life. From celebrating a newborn with naming ceremony pandits, nurturing toddlers with verified babysitters, maintaining a sparkling home, to honoring departures with sacred last rites, we bring dignity, trust, and professional excellence to your doorstep.', 'About JeevanSeva - Life Services Platform', 'Learn about India\'s all-in-one life services marketplace bridging families with trusted local experts.'),
('Terms & Conditions', 'terms', 'By accessing or booking services through JeevanSeva, you agree to our standard terms of service. All bookings are subject to partner availability and safety protocols.', 'Terms & Conditions - JeevanSeva', 'Terms and conditions governing use of JeevanSeva website and services.'),
('Privacy Policy', 'privacy-policy', 'Your privacy is paramount. We do not sell personal information. All payment details are processed under PCI-DSS compliance via our verified gateway partners.', 'Privacy Policy - JeevanSeva', 'Privacy policy explaining how customer and vendor data is secured.');

-- Support Tickets
INSERT INTO `support_tickets` (`id`, `ticket_number`, `user_id`, `booking_id`, `subject`, `priority`, `status`) VALUES
(1, 'TKT-20261021-001', 7, 1, 'Query regarding arrival time of cleaning team', 'medium', 'open');

INSERT INTO `ticket_messages` (`ticket_id`, `sender_id`, `sender_role`, `message`) VALUES
(1, 7, 'customer', 'Hello, can the cleaning team arrive precisely at 10:30 AM instead of 10:00 AM?');
