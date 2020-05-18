-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Lun 18 Mai 2020 à 14:59
-- Version du serveur :  5.7.24-0ubuntu0.16.04.1
-- Version de PHP :  7.2.11-4+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `todolist`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'L''identifiant de notre catégorie',
  `name` varchar(64) NOT NULL COMMENT 'Le nom de la catégorie',
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Le statut de la catégorie (1=active, 2=désactivée)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'La date de création de la catégorie',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'La date de la dernière mise à jour de la catégorie'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Chemin vers O\'clock', 1, '2020-02-13 09:04:47', NULL),
(2, 'Courses', 1, '2020-02-13 09:04:47', NULL),
(3, 'Formation O\'clock', 1, '2020-02-13 09:04:47', NULL),
(4, 'Titre Professionnel', 1, '2020-02-13 09:04:47', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'L''identifiant de notre tâche',
  `title` varchar(128) NOT NULL COMMENT 'Le titre de la tâche',
  `completion` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Le pourcentage de completion de la tâche',
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Le statut de la tâche (1=active, 2=archivée)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'La date de création de la tâche',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'La date de la dernière mise à jour de la tâche',
  `category_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `completion`, `status`, `created_at`, `updated_at`, `category_id`) VALUES
(1, 'Passer les tests du chemin vers O\'clock', 100, 2, '2020-02-13 09:04:47', NULL, 1),
(3, 'Acheter du paing', 0, 1, '2020-02-13 09:04:47', '2020-02-14 12:42:03', 2),
(4, 'Survivre à la première saison', 100, 1, '2020-02-13 09:04:47', NULL, 3),
(5, 'Maitriser les bases de la programmation informatique', 100, 1, '2020-02-13 09:04:47', NULL, 3),
(6, 'Rédiger mes dossiers de Titre Professionnel', 0, 1, '2020-02-13 09:04:47', NULL, 4),
(7, 'Présenter mon projet au jury bienveillant', 0, 2, '2020-02-13 09:04:47', '2020-02-14 14:50:42', 4),
(8, 'Mon premier MCD', 100, 2, '2020-02-13 09:04:47', '2020-02-14 14:30:36', 3),
(9, 'Acheter du paingwwwww', 0, 2, '2020-02-14 16:03:35', '2020-02-17 13:35:45', 2),
(10, 'dssddsds&é\'\'\'', 0, 2, '2020-02-17 13:35:41', '2020-02-19 21:44:31', 4),
(15, 'test final ', 0, 1, '2020-02-17 16:37:06', '2020-02-17 16:37:06', 3),
(16, 'kijderbndg', 0, 1, '2020-02-17 16:39:31', '2020-02-17 17:03:17', 3),
(17, 'wxx<wx<wx<wx<w', 0, 1, '2020-02-17 17:03:50', '2020-05-18 13:56:52', 1),
(18, 'fdsdfsfsfddf', 0, 1, '2020-02-17 20:23:28', '2020-02-19 21:43:16', 2);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tasks_categories_idx` (`category_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'L''identifiant de notre catégorie', AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'L''identifiant de notre tâche', AUTO_INCREMENT=19;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_task_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
