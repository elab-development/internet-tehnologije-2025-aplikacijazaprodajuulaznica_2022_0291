-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Feb 25, 2026 at 11:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prodaja_ulaznica`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `izvodjenja`
--

CREATE TABLE `izvodjenja` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sala_id` bigint(20) UNSIGNED NOT NULL,
  `predstava_id` bigint(20) UNSIGNED NOT NULL,
  `datum_izvodjenja` date NOT NULL,
  `vreme_pocetka` time NOT NULL,
  `osnovna_cena` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `izvodjenja`
--

INSERT INTO `izvodjenja` (`id`, `sala_id`, `predstava_id`, `datum_izvodjenja`, `vreme_pocetka`, `osnovna_cena`, `created_at`, `updated_at`) VALUES
(8, 2, 7, '2026-02-16', '20:00:00', 1000.00, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(9, 3, 4, '2026-02-14', '19:30:00', 1200.00, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(10, 1, 5, '2026-02-20', '19:00:00', 1500.00, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(11, 1, 3, '2026-02-25', '19:00:00', 1500.00, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(13, 3, 9, '2026-03-01', '19:30:00', 1100.00, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(14, 2, 10, '2026-03-03', '20:00:00', 950.00, '2026-02-08 17:59:31', '2026-02-08 17:59:31');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `karte`
--

CREATE TABLE `karte` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `izvodjenje_id` bigint(20) UNSIGNED NOT NULL,
  `broj_sedista` varchar(255) NOT NULL,
  `cena` decimal(8,2) NOT NULL,
  `prodata` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `karte`
--

INSERT INTO `karte` (`id`, `izvodjenje_id`, `broj_sedista`, `cena`, `prodata`, `created_at`, `updated_at`) VALUES
(30, 8, 'A1', 1000.00, 0, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(31, 8, 'A2', 1000.00, 0, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(32, 8, 'A3', 1000.00, 1, '2026-02-06 15:05:45', '2026-02-06 15:06:32'),
(33, 8, 'A4', 1000.00, 0, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(34, 8, 'A5', 1000.00, 0, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(35, 8, 'B1', 1000.00, 0, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(36, 8, 'B2', 1000.00, 1, '2026-02-06 15:05:45', '2026-02-11 12:23:08'),
(37, 8, 'B3', 1000.00, 1, '2026-02-06 15:05:45', '2026-02-11 12:23:08'),
(38, 8, 'B4', 1000.00, 1, '2026-02-06 15:05:45', '2026-02-07 09:46:18'),
(39, 8, 'B5', 1000.00, 0, '2026-02-06 15:05:45', '2026-02-06 15:05:45'),
(40, 9, 'A1', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(41, 9, 'A2', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(42, 9, 'A3', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(43, 9, 'A4', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(44, 9, 'A5', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(45, 9, 'B1', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(46, 9, 'B2', 1200.00, 1, '2026-02-06 15:17:07', '2026-02-08 09:13:21'),
(47, 9, 'B3', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(48, 9, 'B4', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(49, 9, 'B5', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(50, 9, 'C1', 1200.00, 0, '2026-02-06 15:17:07', '2026-02-06 15:17:07'),
(51, 9, 'C2', 1200.00, 1, '2026-02-06 15:17:07', '2026-02-07 09:43:52'),
(52, 10, 'A1', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(53, 10, 'A2', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(54, 10, 'A3', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(55, 10, 'A4', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(56, 10, 'A5', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(57, 10, 'B1', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(58, 10, 'B2', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(59, 10, 'B3', 1500.00, 1, '2026-02-06 15:17:40', '2026-02-06 15:19:45'),
(60, 10, 'B4', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(61, 10, 'B5', 1500.00, 1, '2026-02-06 15:17:40', '2026-02-24 11:39:10'),
(62, 10, 'C1', 1500.00, 1, '2026-02-06 15:17:40', '2026-02-24 11:46:07'),
(63, 10, 'C2', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(64, 10, 'C3', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(65, 10, 'C4', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(66, 10, 'C5', 1500.00, 0, '2026-02-06 15:17:40', '2026-02-06 15:17:40'),
(67, 11, 'A1', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(68, 11, 'A2', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(69, 11, 'A3', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(70, 11, 'A4', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(71, 11, 'A5', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(72, 11, 'B1', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(73, 11, 'B2', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(74, 11, 'B3', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(75, 11, 'B4', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(76, 11, 'B5', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(77, 11, 'C1', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(78, 11, 'C2', 1500.00, 0, '2026-02-06 15:18:15', '2026-02-06 15:18:15'),
(79, 11, 'C3', 1500.00, 1, '2026-02-06 15:18:15', '2026-02-07 09:38:22'),
(80, 11, 'C4', 1500.00, 1, '2026-02-06 15:18:15', '2026-02-07 09:38:22'),
(81, 11, 'C5', 1500.00, 1, '2026-02-06 15:18:15', '2026-02-08 17:47:53'),
(94, 13, 'A1', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(95, 13, 'A2', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(96, 13, 'A3', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(97, 13, 'A4', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(98, 13, 'A5', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(99, 13, 'B1', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(100, 13, 'B2', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(101, 13, 'B3', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(102, 13, 'B4', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(103, 13, 'B5', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(104, 13, 'C1', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(105, 13, 'C2', 1100.00, 0, '2026-02-08 17:58:56', '2026-02-08 17:58:56'),
(106, 14, 'A1', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(107, 14, 'A2', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(108, 14, 'A3', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(109, 14, 'A4', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(110, 14, 'A5', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(111, 14, 'B1', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(112, 14, 'B2', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(113, 14, 'B3', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(114, 14, 'B4', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31'),
(115, 14, 'B5', 950.00, 0, '2026-02-08 17:59:31', '2026-02-08 17:59:31');

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

CREATE TABLE `korisnici` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `korisnicko_ime` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `lozinka` varchar(255) NOT NULL,
  `uloga` enum('admin','klijent') NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `telefon` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `korisnici` (`id`, `korisnicko_ime`, `email`, `email_verified_at`, `lozinka`, `uloga`, `remember_token`, `created_at`, `updated_at`, `telefon`) VALUES
(6, 'unailic_test', 'test@primer.com', NULL, '$2y$12$QTj3oX0C8k8VE2mpXFNdSuXK3wVw6WHMz9mPTS4lAf84lBgC/6hye', 'klijent', NULL, '2026-01-29 19:23:41', '2026-01-29 19:23:41', NULL),
(13, 'petra_klijent', 'petra@gmail.com', '2026-01-29 20:56:07', '$2y$12$S8W8QH3MQC7pDPDKSuvvYe9KiLQVEVHgzgOVYP6ls4Q3hsyU6JsVW', 'klijent', NULL, '2026-01-29 20:55:01', '2026-01-29 21:38:01', NULL),
(14, 'marko@gmail.com', 'marko@gmail.com', NULL, '$2y$12$Gfu6JkfEg4YYuustJXIwUOUwqYoZxkamFzQkGQlIHjtNT4VhLxsii', 'klijent', NULL, '2026-01-29 21:15:58', '2026-01-29 21:15:58', NULL),
(18, 'katarina_klijent', 'katarina@gmail.com', '2026-02-06 01:25:46', '$2y$12$DWK3HGK6aGLXESEpdEY9Tuyv/2Uj4CIj2v0cOTPO.8Ka4gQF8BhD.', 'klijent', NULL, '2026-02-06 01:24:53', '2026-02-06 01:25:46', NULL),
(19, 'una_admin', 'una@gmail.com', '2026-02-06 01:29:29', '$2y$12$n8NX.pREnktXBY.gGbcQyu9t0eVg1j.N5Z/DRHKUQS6SppWOqh7Ze', 'admin', NULL, '2026-02-06 01:29:18', '2026-02-06 01:29:29', NULL),
(20, 'elena_klijent', 'elena@gmail.com', NULL, '$2y$12$o/psIDTt1pVHL7wYlY/Zv.QAxYDibpSd/UTwgTUtIdOrK2CDMcVWa', 'klijent', NULL, '2026-02-06 12:16:23', '2026-02-06 12:16:23', NULL),
(21, 'marija_klijent', 'marija@gmail.com', '2026-02-06 12:23:15', '$2y$12$2FEEIswECfQSnGtIgoF0c.oTfk2mpEcN4ZNk3lf3v.ZuBn2/5iA/K', 'klijent', NULL, '2026-02-06 12:22:23', '2026-02-06 12:23:15', NULL),
(23, 'milan_klijent', 'milan@gmail.com', '2026-02-07 09:36:11', '$2y$12$Q71XlyrxW8iSdPVWcvFwy.WBUqBCpfmZko/PAiy0JSRBf3bbAQWMW', 'klijent', NULL, '2026-02-07 09:35:49', '2026-02-07 09:36:11', NULL),
(24, 'anja_admin', 'anja@gmail.com', NULL, '$2y$12$NketdG.fRa8lBL.2tFdnL.DJKStlVb6Z8mNEVUAGystL3h9Z4Dxiq', 'klijent', NULL, '2026-02-07 09:50:14', '2026-02-07 09:50:14', NULL),
(25, 'anjap_admin', 'anjap@gmail.com', '2026-02-07 09:53:17', '$2y$12$P4UFZAgk/9vYOx6rugBJxezEx1J5P8/9ucuMsWskmjxW3rF9HFgLC', 'admin', NULL, '2026-02-07 09:52:44', '2026-02-07 09:53:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_01_24_100000_create_sale_table', 1),
(2, '2026_01_24_100100_create_korisnici_table', 1),
(3, '2026_01_24_100200_create_predstave_table', 1),
(4, '2026_01_24_100300_create_izvodjenja_table', 1),
(5, '2026_01_24_100400_create_karte_table', 1),
(6, '2026_01_24_100500_create_rezervacije_table', 1),
(7, '2026_01_24_100600_create_stavke_rezervacije_table', 1),
(8, '2026_01_24_100700_create_sessions_table', 1),
(9, '2026_01_24_100800_create_cache_table', 1),
(10, '2026_01_24_100900_create_jobs_table', 1),
(11, '2026_01_24_101000_create_job_batches_table', 1),
(12, '2026_01_25_100000_add_telefon_to_korisnici_table', 1),
(13, '2026_01_25_100100_remove_img_url_from_predstave_table', 1),
(14, '2026_01_25_100200_add_img_url_to_predstave_table', 1),
(17, '2026_01_25_155359_create_personal_access_tokens_table', 2),
(20, '2026_01_28_132623_change_column_opis', 3),
(21, '2026_01_25_100300_rename_column_opis', 1),
(22, '2026_01_29_133707_rename_columns_in_korisnici_table', 4),
(23, '2026_02_02_100700_change_column_korisnicko_ime', 5);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Korisnik', 3, 'auth_token', 'f43485fc43ceed864e2313f46cc6274fe3939ff1d4c0c588440a2dfe2b89a8a8', '[\"*\"]', NULL, NULL, '2026-01-29 13:06:45', '2026-01-29 13:06:45'),
(2, 'App\\Models\\Korisnik', 3, 'auth_token', 'd3793466bd5eccdab4644d7743789a8e80e3895b716a6f85d9ca2420825c17c7', '[\"*\"]', NULL, NULL, '2026-01-29 13:10:10', '2026-01-29 13:10:10'),
(3, 'App\\Models\\Korisnik', 4, 'auth_token', '5770668c835cce86edee71ab7486e0e2b3f462e3370d23b2a964f65a7a383eab', '[\"*\"]', NULL, NULL, '2026-01-29 13:13:41', '2026-01-29 13:13:41'),
(7, 'App\\Models\\Korisnik', 5, 'auth_token', '3f7f9c54d93c6c838887427d003be3f9bc55ca476d7189944b973247f3273db4', '[\"*\"]', NULL, NULL, '2026-01-29 16:26:56', '2026-01-29 16:26:56'),
(9, 'App\\Models\\Korisnik', 3, 'auth_token', 'de455b87e346c4989a73a2b6bbe44d70575e7da494ecef2f919cc804a94cbabf', '[\"*\"]', '2026-01-29 18:46:33', NULL, '2026-01-29 17:38:44', '2026-01-29 18:46:33'),
(10, 'App\\Models\\Korisnik', 6, 'auth_token', 'c034860be812c0fb310209fc1511f4237dd2a3258f298e2e28c5f60562975d59', '[\"*\"]', NULL, NULL, '2026-01-29 19:23:41', '2026-01-29 19:23:41'),
(11, 'App\\Models\\Korisnik', 7, 'auth_token', 'd163c3fbc4e79ec125fc9d9ae01881353e6f0bdef888474da82b2b61672c57e0', '[\"*\"]', NULL, NULL, '2026-01-29 19:31:15', '2026-01-29 19:31:15'),
(12, 'App\\Models\\Korisnik', 8, 'auth_token', '9264af2c8207b941b585288bddd7c040c3555dce85ab3c7bf4364fcd565f29f0', '[\"*\"]', NULL, NULL, '2026-01-29 19:39:57', '2026-01-29 19:39:57'),
(13, 'App\\Models\\Korisnik', 9, 'auth_token', 'a894b41825ef352c02ade46dc90648a2565e8b276e8ac9029e52f5a62b73bf81', '[\"*\"]', NULL, NULL, '2026-01-29 19:45:51', '2026-01-29 19:45:51'),
(14, 'App\\Models\\Korisnik', 13, 'auth_token', '208c4eca88adacedb47918a0706439559416a69fe1901f551a391490373c73b6', '[\"*\"]', NULL, NULL, '2026-01-29 20:55:12', '2026-01-29 20:55:12'),
(15, 'App\\Models\\Korisnik', 13, 'auth_token', 'f284cd2948203bf8349828f3fd4b206f537abd67d033fd31b64cfa9d9181edf9', '[\"*\"]', NULL, NULL, '2026-01-29 21:15:08', '2026-01-29 21:15:08'),
(16, 'App\\Models\\Korisnik', 14, 'auth_token', 'b822d43f4d51e7ab1a67117ded20eb5683d688e505ef79a7316beeb1b8725ea8', '[\"*\"]', NULL, NULL, '2026-01-29 21:16:01', '2026-01-29 21:16:01'),
(18, 'App\\Models\\Korisnik', 15, 'auth_token', '355e702fcbfd0e2357252beb9c7a451de34c99ecfc38b8b8d9eac5172b84dcd2', '[\"*\"]', NULL, NULL, '2026-01-29 22:29:46', '2026-01-29 22:29:46'),
(20, 'App\\Models\\Korisnik', 13, 'auth_token', '65c310c43d4fee79528db85532657650b21b7f6513e3d83fcdd0eefd1314835f', '[\"*\"]', NULL, NULL, '2026-02-02 22:44:01', '2026-02-02 22:44:01'),
(23, 'App\\Models\\Korisnik', 16, 'auth_token', '8c162a884616c842a3dca8f5e35817193351c2c61f67baa369df28a70a650e01', '[\"*\"]', NULL, NULL, '2026-02-06 01:09:39', '2026-02-06 01:09:39'),
(24, 'App\\Models\\Korisnik', 17, 'auth_token', 'b70f2e4da3c4c84ef87fbdd19cc45c9717a2f1800b5b0b35492cf13dabc53566', '[\"*\"]', NULL, NULL, '2026-02-06 01:20:13', '2026-02-06 01:20:13'),
(25, 'App\\Models\\Korisnik', 18, 'auth_token', '642e10e796142ff68acefe472e3cf10ade973cf1c83ceb9096ad16f4fad2e0aa', '[\"*\"]', NULL, NULL, '2026-02-06 01:24:56', '2026-02-06 01:24:56'),
(27, 'App\\Models\\Korisnik', 19, 'auth_token', '8b27c4940a867d715ef58e9d174825decb3c65b5881e4d1b25c88c445064329c', '[\"*\"]', NULL, NULL, '2026-02-06 01:29:21', '2026-02-06 01:29:21'),
(28, 'App\\Models\\Korisnik', 19, 'auth_token', '8d9590f8fff7b9e5d341f786dfb387b2dd795e6ddb78b81752e83e18cb04ac0b', '[\"*\"]', '2026-02-06 11:25:26', NULL, '2026-02-06 01:30:04', '2026-02-06 11:25:26'),
(29, 'App\\Models\\Korisnik', 20, 'auth_token', 'ec0124f645d5f405ad7fe8106528a5d512c6adbc070ec09e6ae949bbe563027f', '[\"*\"]', NULL, NULL, '2026-02-06 12:16:45', '2026-02-06 12:16:45'),
(30, 'App\\Models\\Korisnik', 21, 'auth_token', 'f884b7fee5cfd8fe0c7b8fd3720a249dd8d9b22ee7ea3abda5d796d1904b0928', '[\"*\"]', NULL, NULL, '2026-02-06 12:22:28', '2026-02-06 12:22:28'),
(38, 'App\\Models\\Korisnik', 22, 'auth_token', '5bb959f6f622f39a6878ab5bbbc99c91c951e15d9f9a53733f8ae6683cf9a27c', '[\"*\"]', NULL, NULL, '2026-02-07 09:29:56', '2026-02-07 09:29:56'),
(39, 'App\\Models\\Korisnik', 23, 'auth_token', '76e40465be322dfa17bdb3cdb212c41c523afbb237a04780a4aff785e4dc1f5c', '[\"*\"]', NULL, NULL, '2026-02-07 09:35:55', '2026-02-07 09:35:55'),
(40, 'App\\Models\\Korisnik', 23, 'auth_token', '877bed43f0cc69459273f3ce09df9a424452efffa5d0ddc8de525e1a19805b5b', '[\"*\"]', '2026-02-07 09:38:22', NULL, '2026-02-07 09:36:35', '2026-02-07 09:38:22'),
(42, 'App\\Models\\Korisnik', 24, 'auth_token', '0d7d5d3bf35ecfa10f9d7a280d0cb6a2d4b15eeb97703a7934dbcbd10945bab4', '[\"*\"]', NULL, NULL, '2026-02-07 09:50:40', '2026-02-07 09:50:40'),
(43, 'App\\Models\\Korisnik', 25, 'auth_token', '130d8094ee8b33d7e13df17e8739c81776f218f69a30f2df3920a229f4066562', '[\"*\"]', NULL, NULL, '2026-02-07 09:52:49', '2026-02-07 09:52:49'),
(48, 'App\\Models\\Korisnik', 23, 'auth_token', '97916c1254990111041ed18c570cd16db31b0be8bbdcea8caafe2da42de0c20f', '[\"*\"]', NULL, NULL, '2026-02-07 10:44:15', '2026-02-07 10:44:15'),
(73, 'App\\Models\\Korisnik', 23, 'auth_token', 'b22baa5b90479bbd285efc96feb98514aa27fa5df7c77bdbb362e91079d6c6c3', '[\"*\"]', '2026-02-24 11:46:10', NULL, '2026-02-24 11:45:09', '2026-02-24 11:46:10'),
(74, 'App\\Models\\Korisnik', 13, 'auth_token', 'f501d34448a2da66e9d0b7e95d9e80acd713190382b8b6fdf5afeeab46853cb9', '[\"*\"]', NULL, NULL, '2026-02-25 14:40:44', '2026-02-25 14:40:44'),
(75, 'App\\Models\\Korisnik', 13, 'auth_token', '5f73327bd2de0a34697178ed53df7cef3398fdd44e3926207c94e8cfa009e837', '[\"*\"]', '2026-02-25 14:44:40', NULL, '2026-02-25 14:41:46', '2026-02-25 14:44:40'),
(76, 'App\\Models\\Korisnik', 23, 'auth_token', '880b4638fa52adc51233301007ef6c5b77892dc26e4e9d0c23729fa16f799d2d', '[\"*\"]', '2026-02-25 14:44:25', NULL, '2026-02-25 14:42:31', '2026-02-25 14:44:25');

-- --------------------------------------------------------

--
-- Table structure for table `predstave`
--

CREATE TABLE `predstave` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `naziv` varchar(255) NOT NULL,
  `opis` varchar(255) DEFAULT NULL,
  `reditelj` varchar(255) NOT NULL,
  `trajanje_min` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `img_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `predstave`
--

INSERT INTO `predstave` (`id`, `naziv`, `opis`, `reditelj`, `trajanje_min`, `created_at`, `updated_at`, `img_url`) VALUES
(1, 'Hasanaginica', 'Tragedija zasnovana na narodnoj baladi, koja prikazuje sudbinu Hasanaginice, žene proterane iz doma zbog patrijarhalnih običaja i muževljeve sujete.', 'Jagoš Marković', 120, '2026-01-26 17:31:45', '2026-01-26 17:31:45', '/slike/hasanaginica.jpg'),
(2, 'Gospođa Ministarka', 'Komedija zasnovana na delu Branislava Nušića, koja prikazuje uspon i moralni pad Živke Popović, žene zaslepljene željom za statusom i moći kada postane ministarka.', 'Jagoš Marković', 110, '2026-01-26 17:31:45', '2026-01-28 19:21:56', '/slike/gospodja_ministarka.jpg'),
(3, 'Labudovo jezero', 'Balet ruskog kompozitora Petra Iljiča Čajkovskog koji prikazuje tragičnu ljubav princa Zigmunda i princeze Odete, pretvorene u labuda zlom čarolijom.', 'Konstantin Kostjukov', 150, '2026-01-28 19:13:07', '2026-01-28 19:13:07', '/slike/labudovo_jezero.jpg'),
(4, 'Cigani lete u nebo', 'Mjuzikl zasnovan na motivima priče Maksima Gorkog, koji prikazuje ljubav romske devojke Rade i hrabrog konjokradice Zobara.', 'Vladimir Lazić', 150, NULL, '2026-02-08 18:04:43', '/slike/cigani.jpg'),
(5, 'Krcko Oraščić', 'Balet Petra Iljiča Čajkovskog koji govori o devojčici Klari i njenom magičnom putovanju u svet igračaka koje ožive tokom božićne noći.', 'Konstantin Kostjukov', 170, NULL, NULL, '/slike/krcko_orascic.jpg'),
(6, 'Mamma Mia!', 'Mjuzikl zasnovan na pesmama grupe ABBA, koji prati priču mlade Sofi dok pokušava da otkrije ko je njen otac pred svoje venčanje.', 'Jug Radivojević', 95, NULL, NULL, '/slike/mamma_mia.jpg'),
(7, 'Rat i mir', 'Drama po motivima romana Lava Tolstoja koja prikazuje sudbinu ljudi tokom Napoleonovih ratova i njihove unutrašnje borbe.', 'Boris Liješević', 120, NULL, NULL, '/slike/rat_i_mir.jpg'),
(9, 'Fantom iz Opere', 'Mjuzikl Endrua Lojda Vebera o misterioznom muzičkom geniju koji se zaljubljuje u pevačicu Kristinu.', 'Jug Radivojević', 140, '2026-02-08 17:53:55', '2026-02-08 17:53:55', '/slike/fantom.jpg'),
(10, 'San letnje noći', 'Komedija po motivima priče Vilijama Šekspira. Radnja je prebačena u fantastičan svet vila i magičnih stvorenja.', 'Kokan Mladenović', 110, '2026-02-08 17:55:40', '2026-02-08 17:55:40', '/slike/san_letnje_noci.jpg'),
(11, 'Majstor i Margarita', 'Drama zasnovana na romanu Mihaila Bulgakova koja spaja fantastiku, filozofiju i istoriju. U središtu je snažna ljubavna priča Majstora i Margarite, isprepletena borbom za istinu i slobodu.', 'Andraš Urban', 95, '2026-02-08 17:57:48', '2026-02-08 17:57:48', '/slike/majstor.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `rezervacije`
--

CREATE TABLE `rezervacije` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `korisnik_id` bigint(20) UNSIGNED NOT NULL,
  `ukupna_cena` decimal(8,2) NOT NULL,
  `nacin_placanja` enum('kartica','na_blagajni','vaucer') NOT NULL DEFAULT 'kartica',
  `status` enum('kreirana','potvrdjena','otkazana','istekla') NOT NULL DEFAULT 'kreirana',
  `datum_kreiranja` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rezervacije`
--

INSERT INTO `rezervacije` (`id`, `korisnik_id`, `ukupna_cena`, `nacin_placanja`, `status`, `datum_kreiranja`, `created_at`, `updated_at`) VALUES
(10, 21, 2400.00, 'kartica', 'kreirana', '2026-02-06', '2026-02-06 14:02:05', '2026-02-06 14:02:05'),
(11, 21, 1200.00, 'kartica', 'kreirana', '2026-02-06', '2026-02-06 14:03:07', '2026-02-06 14:03:07'),
(12, 21, 1000.00, 'kartica', 'kreirana', '2026-02-06', '2026-02-06 15:06:32', '2026-02-06 15:06:32'),
(13, 21, 1500.00, 'kartica', 'kreirana', '2026-02-06', '2026-02-06 15:19:45', '2026-02-06 15:19:45'),
(14, 23, 3000.00, 'kartica', 'kreirana', '2026-02-07', '2026-02-07 09:38:22', '2026-02-07 09:38:22'),
(15, 23, 1200.00, 'kartica', 'kreirana', '2026-02-07', '2026-02-07 09:43:51', '2026-02-07 09:43:52'),
(16, 23, 1000.00, 'kartica', 'potvrdjena', '2026-02-07', '2026-02-07 09:46:18', '2026-02-07 10:40:36'),
(17, 13, 1200.00, 'kartica', 'kreirana', '2026-02-08', '2026-02-08 09:13:20', '2026-02-08 09:13:21'),
(18, 13, 1500.00, 'kartica', 'kreirana', '2026-02-08', '2026-02-08 17:47:53', '2026-02-08 17:47:53'),
(19, 23, 2000.00, 'kartica', 'potvrdjena', '2026-02-11', '2026-02-11 12:23:08', '2026-02-24 11:37:48'),
(20, 13, 1500.00, 'kartica', 'kreirana', '2026-02-24', '2026-02-24 11:39:10', '2026-02-24 11:39:10'),
(21, 23, 1500.00, 'kartica', 'kreirana', '2026-02-24', '2026-02-24 11:46:07', '2026-02-24 11:46:07');

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `naziv` varchar(255) NOT NULL,
  `kapacitet` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`id`, `naziv`, `kapacitet`, `created_at`, `updated_at`) VALUES
(1, 'Velika sala', 15, '2026-01-26 17:31:45', '2026-01-26 17:31:45'),
(2, 'Mala sala', 10, '2026-01-26 17:31:45', '2026-01-26 17:31:45'),
(3, 'Srednja Sala', 12, '2026-01-29 15:48:09', '2026-01-29 15:48:09');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('42mSK1eB1kmIbYYr6vyZ2mYlycdbeDUUxJxuR8tp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmpWUmUwYjAydTEwWTI1Qk9vRXVHd3VNZGNLVTc0MlozSzI3U1RtUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770332779),
('8YMJ0zmhWqYRFaVh3SjDE9ybf5X7qSyZ0vbDFbgo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUhxYVlMbkJUaXA1bG9zd3RTV3BFZVhaWER2ZDlsTjZaSUpQd2xrSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769718186),
('ED5HatEqsa3DixH3eJfpOXISiJDUtVNUiD0brfhV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRmNvRzJ2M2NoOG9WR0ExWVBCdmJWRmMzNmdsMVhYNm9TWUdwbmtCZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770344267),
('epEUtMmXo4gT5AonAzmoRnZ7TwUSEWwGZ01ouUkY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUllMHU0THlLeXd4NndKd25RdURka0NhVUk2U1VaSkxLRnp4cHZGSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769695305),
('es9crjhnb15hsi9pQThRtp6TOIvGggFVicROiw4x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWI5eXk4RUdTUXRwRXpzRkttaUFIa2N4c0hDSklMdWkzQlE5a0NXZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769609963),
('Hs8hncQyfe2pIpWo8tAmEhtS92t249tnoOpVXhIL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVXNsaThscktUR3kzNHFOMHJQQmpqOEttM2RQQzdRcWE2SmF1Ymp4cSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770333905),
('Hy88SigEOJEJgMOHGHiHE22HrY9TXJgp3hvIiAnF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGVyazg2MERIUkR3SEVGb1lVUEV6R2c3aXRKYnZaWVp4dWFSZktaTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770459809),
('i8CM6LaCnTFb4RZlkwplyM9vwviAAwGlQb64kDuR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0h2RmFQdmlydktydUtOVUxGdmVtOXlMc1pEVUtsNHZ3VmxEanRWQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770332780),
('lL6NgmlegXMJ0vPV5JY2FtxlW8EtEwP8ItTuBKew', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTjRlNHh5czlMWE1pS25WU1dpYWVNcHVTN1BpT1QzM1pIUkFtU0JCTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770332780),
('puFo2yUFIB3mSTmQSnyLmpZruZVFUEIuS9KJnjZn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2xsQ2labEkyemZ6UkV3OXBaZXExc2FBOWxpeHd3QmZORWxDc0NOdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769723413),
('QWDDdlarxAMC6seFTUNlFSOY7Z44Jvn4txmeeITv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQnB1MFQ5M01WSDZsQUFqNkhMVkhGWTZyOWo1MnlVb3czUWE1TkxVMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769707593),
('TY2x8lOoeMZODJBxZrz8VL7tW7gqEfBkPswisUGi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNUJ1VUlyNmpyN29HUk5rTDNGdnVNNUh4cDN1WDdmNDV1dHFjT1BrVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770393875),
('USJ6isZXjzzffI8AZQvj6tJbplmkiwy84Bu4rcYy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2xQcVlqb2ZOb3hIY0FvczRJYWRsUUI0NlVXMlY0TVRqUjZIRGZaUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770075503),
('vaJ7qLbgp7hewQshRSK6q3y2lpZNH0ocIFpXiAEl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUW1NZFNNUTdxek40TnJzR2hmZ3lndk1tWE5aMG1HOVVlWUN2U3NaNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770066586),
('y4CaTONa5RY2bDUMMIIcPEqzuNAN8CoXHpbSkLQ9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2lpR2xuZFVtdWhYMkg1Q0RCaE9KN0dmamdjR1ZOOVRSbkVTZ0VzTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769609962);

-- --------------------------------------------------------

--
-- Table structure for table `stavke_rezervacije`
--

CREATE TABLE `stavke_rezervacije` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rezervacija_id` bigint(20) UNSIGNED NOT NULL,
  `karta_id` bigint(20) UNSIGNED NOT NULL,
  `cena_stavke` decimal(8,2) NOT NULL,
  `kolicina` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stavke_rezervacije`
--

INSERT INTO `stavke_rezervacije` (`id`, `rezervacija_id`, `karta_id`, `cena_stavke`, `kolicina`, `created_at`, `updated_at`) VALUES
(12, 12, 32, 1000.00, 1, '2026-02-06 15:06:32', '2026-02-06 15:06:32'),
(13, 13, 59, 1500.00, 1, '2026-02-06 15:19:45', '2026-02-06 15:19:45'),
(14, 14, 80, 1500.00, 1, '2026-02-07 09:38:22', '2026-02-07 09:38:22'),
(15, 14, 79, 1500.00, 1, '2026-02-07 09:38:22', '2026-02-07 09:38:22'),
(16, 15, 51, 1200.00, 1, '2026-02-07 09:43:52', '2026-02-07 09:43:52'),
(17, 16, 38, 1000.00, 1, '2026-02-07 09:46:18', '2026-02-07 09:46:18'),
(18, 17, 46, 1200.00, 1, '2026-02-08 09:13:21', '2026-02-08 09:13:21'),
(19, 18, 81, 1500.00, 1, '2026-02-08 17:47:53', '2026-02-08 17:47:53'),
(20, 19, 37, 1000.00, 1, '2026-02-11 12:23:08', '2026-02-11 12:23:08'),
(21, 19, 36, 1000.00, 1, '2026-02-11 12:23:08', '2026-02-11 12:23:08'),
(22, 20, 61, 1500.00, 1, '2026-02-24 11:39:10', '2026-02-24 11:39:10'),
(23, 21, 62, 1500.00, 1, '2026-02-24 11:46:07', '2026-02-24 11:46:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `izvodjenja`
--
ALTER TABLE `izvodjenja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `izvodjenja_sala_id_foreign` (`sala_id`),
  ADD KEY `izvodjenja_predstava_id_foreign` (`predstava_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `karte`
--
ALTER TABLE `karte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `karte_izvodjenje_id_foreign` (`izvodjenje_id`);

--
-- Indexes for table `korisnici`
--
ALTER TABLE `korisnici`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `korisnici_email_unique` (`email`),
  ADD UNIQUE KEY `korisnici_korisnicko_ime_unique` (`korisnicko_ime`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `predstave`
--
ALTER TABLE `predstave`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rezervacije`
--
ALTER TABLE `rezervacije`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rezervacije_user_id_foreign` (`korisnik_id`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_foreign` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stavke_rezervacije`
--
ALTER TABLE `stavke_rezervacije`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stavke_rezervacije_rezervacija_id_foreign` (`rezervacija_id`),
  ADD KEY `stavke_rezervacije_karta_id_foreign` (`karta_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `izvodjenja`
--
ALTER TABLE `izvodjenja`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `karte`
--
ALTER TABLE `karte`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `korisnici`
--
ALTER TABLE `korisnici`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `predstave`
--
ALTER TABLE `predstave`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `rezervacije`
--
ALTER TABLE `rezervacije`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stavke_rezervacije`
--
ALTER TABLE `stavke_rezervacije`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `izvodjenja`
--
ALTER TABLE `izvodjenja`
  ADD CONSTRAINT `izvodjenja_predstava_id_foreign` FOREIGN KEY (`predstava_id`) REFERENCES `predstave` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `izvodjenja_sala_id_foreign` FOREIGN KEY (`sala_id`) REFERENCES `sale` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `karte`
--
ALTER TABLE `karte`
  ADD CONSTRAINT `karte_izvodjenje_id_foreign` FOREIGN KEY (`izvodjenje_id`) REFERENCES `izvodjenja` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rezervacije`
--
ALTER TABLE `rezervacije`
  ADD CONSTRAINT `rezervacije_user_id_foreign` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnici` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `korisnici` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `stavke_rezervacije`
--
ALTER TABLE `stavke_rezervacije`
  ADD CONSTRAINT `stavke_rezervacije_karta_id_foreign` FOREIGN KEY (`karta_id`) REFERENCES `karte` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stavke_rezervacije_rezervacija_id_foreign` FOREIGN KEY (`rezervacija_id`) REFERENCES `rezervacije` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
