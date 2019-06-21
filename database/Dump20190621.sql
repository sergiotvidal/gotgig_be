-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: 35.230.139.70    Database: gotgig
-- ------------------------------------------------------
-- Server version	5.7.14-google-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED='00a5a7ac-9366-11e9-8f46-42010a9a0041:1-91509';

--
-- Table structure for table `band_photos`
--

DROP TABLE IF EXISTS `band_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `band_photos` (
  `id_photos` int(11) NOT NULL AUTO_INCREMENT,
  `id_band` int(11) DEFAULT NULL,
  `band_photo` varchar(20000) DEFAULT NULL,
  PRIMARY KEY (`id_photos`),
  KEY `fk_band_photos_1_idx` (`id_band`),
  CONSTRAINT `fk_band_photos_1` FOREIGN KEY (`id_band`) REFERENCES `bands` (`id_band`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `band_photos`
--

LOCK TABLES `band_photos` WRITE;
/*!40000 ALTER TABLE `band_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `band_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bands`
--

DROP TABLE IF EXISTS `bands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bands` (
  `id_band` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `style` varchar(45) DEFAULT NULL,
  `description` longtext,
  `website` varchar(20000) DEFAULT NULL,
  PRIMARY KEY (`id_band`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bands`
--

LOCK TABLES `bands` WRITE;
/*!40000 ALTER TABLE `bands` DISABLE KEYS */;
INSERT INTO `bands` VALUES (16,'Festa de Presentación Galicia Molona','2% rumba 98% rock\'n\'roll','Fiesta de presentación de la Asociación Cultural Musical Galicia Molona. Actuaciones de Cloaca, Terror Erótico Adolescente y la sesión de electrónica de Le Petit Dj',NULL),(17,'Twice y Beluga','Rock',NULL,NULL),(18,'GarufaBlueDevilsBigBand','Blues / Rock / Bluegrass',NULL,NULL),(19,'The Flamin’ Groovies','Blues / Rock / Bluegrass','Originarios de San Francisco, nacidos en 1965 y reunidos para la gira australiana en 2013, los Flamin’ Groovies han girado y actuado los últimos 6 años superando todas las expectativas. Ahora se han reunido con el miembro fundador Roy Loney ara tocar una serie de temas clásicos, incluyendo su álbum de referencia, Teenage Head. Quienes acudan el 18 de junio al Garufa Club de A Coruña podrán vivir esta reunión en primera persona.',NULL),(20,'Bikini Fest VOL. 1','Varios','Celebramos la llegada del verano por todo lo alto, con un fiestón del millón en la Sala Mardi Gras. La peñita de Fast Fuzz y Playa Desmayo nos organizamos para montar el Bikini Fest, la primera edición de (quizás) muchas.','http://salamardigras.com/viernes-21-2200-bikini-fest-vol-1/'),(21,'Maldito Murphy','Country / Blues / Rock / Pop','El suyo es un sonido de raigambre americana, con abundancia de ritmos country y algún que otro patrón de blues, aunque todo ello incrustado en estructuras de pop.',NULL),(22,'COLD SWEAT JAZZ QUINTET','Jazz',NULL,NULL),(23,'GABRIEL RUFFINI TRIO','Jazz',NULL,NULL),(24,'LG CONECTION','Jazz',NULL,NULL),(25,'Il Divo','Lírico / Pop',NULL,NULL),(26,'Aitana','Pop','Con 18 años recién cumplidos fue una de las ganadoras del programa líder de la Televisión Española, Operación Triunfo. Su manera de transmitir emociones y su carisma le granjearon el cariño del público, y su voz, un auténtico instrumento único en el mundo, le ha hecho ganar millones de fans en España y en el mundo.',NULL),(27,'Pixies','Alternativo / Indie','Tras sus recientes shows en USA compartiendo cartel con Weezer, la mítica formación americana anuncia tour europeo para presentar su nuevo disco y repasar un repertorio plagado de hits. Llegarán en Octubre a España, donde actuarán únicamente en 3 ciudades: Madrid, Barcelona y A Coruña, en el que será el 1ER concierto que realiza el legendario grupo en Galicia.',NULL),(28,'Cupido','Trap / Indie',NULL,NULL);
/*!40000 ALTER TABLE `bands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concerts`
--

DROP TABLE IF EXISTS `concerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concerts` (
  `id_concert` int(11) NOT NULL AUTO_INCREMENT,
  `id_localhall` int(11) DEFAULT NULL,
  `id_band` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `tickets` varchar(20000) DEFAULT NULL,
  PRIMARY KEY (`id_concert`),
  KEY `fk_concerts_1_idx` (`id_localhall`),
  KEY `fk_concerts_2_idx` (`id_band`),
  CONSTRAINT `fk_concerts_1` FOREIGN KEY (`id_localhall`) REFERENCES `localhalls` (`id_localhall`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_concerts_2` FOREIGN KEY (`id_band`) REFERENCES `bands` (`id_band`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concerts`
--

LOCK TABLES `concerts` WRITE;
/*!40000 ALTER TABLE `concerts` DISABLE KEYS */;
INSERT INTO `concerts` VALUES (7,9,16,'2019-06-28 22:00:00','7 €'),(8,9,17,'2019-06-29 19:00:00','12 €'),(9,7,18,'2019-06-20 22:00:00','Gratis'),(10,7,19,'2019-06-18 21:00:00','Anticipada 16 €. Taquilla 20 €'),(11,8,20,'2019-06-21 20:00:00','Anticipada 6 €. Taquilla 8 €'),(12,8,21,'2019-06-28 19:30:00','Anticipada 5 €. Taquilla 7 €'),(13,4,22,'2019-07-05 22:00:00','7 €'),(14,4,23,'2019-07-10 22:00:00','5 €'),(15,4,24,'2019-07-19 22:00:00','10 €'),(16,5,25,'2019-07-05 22:30:00','A partir de 40 €'),(17,5,26,'2019-07-13 21:00:00','A partir de 28 €'),(18,5,27,'2019-10-26 21:00:00','28,00 / 32,00 € ');
/*!40000 ALTER TABLE `concerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localhall_photos`
--

DROP TABLE IF EXISTS `localhall_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `localhall_photos` (
  `id_photos` int(11) NOT NULL AUTO_INCREMENT,
  `localhall_photo` varchar(20000) DEFAULT NULL,
  `id_localhall` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_photos`),
  KEY `fk_localhall_photos_1_idx` (`id_localhall`),
  CONSTRAINT `fk_localhall_photos_1` FOREIGN KEY (`id_localhall`) REFERENCES `localhalls` (`id_localhall`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localhall_photos`
--

LOCK TABLES `localhall_photos` WRITE;
/*!40000 ALTER TABLE `localhall_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `localhall_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localhalls`
--

DROP TABLE IF EXISTS `localhalls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `localhalls` (
  `id_localhall` int(11) NOT NULL AUTO_INCREMENT,
  `id_organization` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` longtext,
  `website` varchar(20000) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `lat` float(10,7) DEFAULT NULL,
  `lng` float(10,7) DEFAULT NULL,
  PRIMARY KEY (`id_localhall`),
  KEY `fk_localhalls_1_idx` (`id_organization`),
  CONSTRAINT `fk_localhalls_1` FOREIGN KEY (`id_organization`) REFERENCES `organizations` (`id_organization`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localhalls`
--

LOCK TABLES `localhalls` WRITE;
/*!40000 ALTER TABLE `localhalls` DISABLE KEYS */;
INSERT INTO `localhalls` VALUES (4,11,'Rua Cega , A Coruña','Jazz Filloa','https://www.jazzfilloa.com/','Jazz Filloa','699888727',43.3714371,-8.4008951),(5,11,'Rúa Francisco Pérez Carballo, 2, 15008 A Coruña','Este emblemático edificio, situado en el acceso principal de la ciudad y con diseño vanguardista, acoge todo tipo de espectáculos musicales, eventos deportivos, de ocio, asambleas y ferias sectoriales, y es en temporada la Plaza de Toros de la ciudad. El Coliseum fue inaugurado el 19 de mayo de 1991 y desde entonces se ha convertido en la sede de los grandes espectáculos que se celebran en Galicia, y pionera en España como recinto multiusos.','http://www.coruna.gal','Coliseum','981 134 450',43.3386688,-8.4094238),(6,11,'Plaza Cormelana, 6, 15003 La Coruña',NULL,'https://www.facebook.com/bunkerclub/?fref=ts','El Bunker','981 134 450',43.3685608,-8.4059372),(7,11,'Rúa Riazor, 5, 15004 A Coruña','Conciertos y Actuaciones en Vivo / Live Concerts and Live performances. + de 20 Años de Música en Vivo','https://www.facebook.com/SalaGarufaClub/','Sala Garufa','981 134 450',43.3674316,-8.4105625),(8,12,'Travesía Torre, 8, 15002 La Coruña','Eventos culturales y música en directo en sala de ocio nocturno con bar y paredes forradas de pósteres.','http://salamardigras.com/','Mardi Gras','677 42 81 50',43.3746490,-8.3981352),(9,13,'15002 a, Rúa San José, 21, 15002 A Coruña',NULL,'https://www.facebook.com/salafilomatic/','Filomatic','626 71 63 07',43.3744278,-8.3958178),(14,14,'nicaragua 8 15005 coruña','','','prueba','',43.3623047,-8.4087849);
/*!40000 ALTER TABLE `localhalls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organizations` (
  `id_organization` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `avatar` varchar(20000) DEFAULT NULL,
  `verification_code` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_organization`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (11,'48204039-fc91-4c69-bf9e-275d5c55ac29','gotgigprueba1@yopmail.com','$2b$10$WJjrxlnErBB04Ju/U0VCl.qhtFH5X1OF2ojqn9K3BmHsioGhiE/Wm','organización de prueba 1',NULL,'05b78daf-1b9c-4238-a259-5a3e8e45fcd9','2019-06-21 01:15:38','2019-06-21 01:15:48'),(12,'cd235070-1f2a-4341-a72c-2e844e2bc47b','gotgigprueba2@yopmail.com','$2b$10$WUypMvslRYNzXoggqnJ94ekDBtSG8rUUlavKpyRCpUYnWXJozHtNe','organización de prueba 2',NULL,'93311a40-b1f9-4892-9b59-4c395c25bcc2','2019-06-21 01:29:35','2019-06-21 01:29:57'),(13,'eb51da4d-35e5-4bf4-ad18-6262941b30c4','gotgigprueba3@yopmail.com','$2b$10$w2cKa7AWWAd5KOsJA39hGe3QH/lK4I.hCZmYW/ax.Ykd2mnkO24IS','organización de prueba 3',NULL,'b6caa3b6-9bf1-4d6a-8a8b-428b4e1bae17','2019-06-21 01:35:15','2019-06-21 01:35:26'),(14,'7222b01b-2ac4-49c7-9600-785a65ac64b4','gotgigprueba99@yopmail.com','$2b$10$aa3J43rskwIuYj0ON7cux.vcN0NzixER1dWTU3WW7KVbDIBzjAarW','prueba 99',NULL,'cad1552c-cc64-400e-8958-a692f0177e55','2019-06-21 05:17:32','2019-06-21 05:17:49'),(15,'861f4101-623c-494a-9735-28bb07bc533c','gotgigprueba98@yopmail.com','$2b$10$H86SFhSC/JCUc7NjPdqIwu.v/w1SnRLSJTXBa6ZxXpn5yc3WEsNS2','prueba 98',NULL,'62bcf3e3-01c6-4a2e-b62b-0446bb47192e','2019-06-21 06:01:44','2019-06-21 06:02:03'),(16,'e2e16ce4-e626-4597-9621-27393561d7ca','zas@gmail.com','$2b$10$TbaM3p1JB/4KkpKZ/NMswOJoF5K1jb2XR59PMu9qrzN8H8aVLyt.u','zas',NULL,'d1148606-55ad-4443-8450-cb0f9b9ac056','2019-06-21 07:47:04',NULL);
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-21 17:51:02
