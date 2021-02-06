-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: booking_movies
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.16.04.1

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

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `aid` int(8) NOT NULL AUTO_INCREMENT,
  `userid` varchar(254) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'mohanpatel@gmail.com','qwerty7890','mohan patel');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booked_details`
--

DROP TABLE IF EXISTS `booked_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booked_details` (
  `rid` int(9) NOT NULL AUTO_INCREMENT,
  `userid` varchar(254) DEFAULT NULL,
  `mname` varchar(256) DEFAULT NULL,
  `hid` varchar(3) DEFAULT NULL,
  `tid` varchar(3) DEFAULT NULL,
  `amount` int(4) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `mtiming` varchar(20) DEFAULT NULL,
  `mdate` date DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booked_details`
--

LOCK TABLES `booked_details` WRITE;
/*!40000 ALTER TABLE `booked_details` DISABLE KEYS */;
INSERT INTO `booked_details` VALUES (1,'mohanlal@gmail.com','Michael Clarke','h01','t01',200,'bangalore','12:00-15:30','2020-03-01');
/*!40000 ALTER TABLE `booked_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `cid` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `userid` varchar(254) NOT NULL,
  `password` varchar(50) NOT NULL,
  `dob` date DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `aadhar_id` bigint(16) DEFAULT NULL,
  `contact` bigint(10) DEFAULT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `userid` (`userid`),
  UNIQUE KEY `aadhar_id` (`aadhar_id`),
  UNIQUE KEY `aadhar_id_2` (`aadhar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Roy affleck','mohanlal@gmail.com','qwerty7890','1991-01-12','jp nagar,Bangalore',NULL,9934560909),(5,'ramesh chaterjee','ramesh12@gmail.com','987654321A','2020-02-01','somewhere here',NULL,9876543210),(9,'asdfasd','asdfasdf@asdf.com','987654321A','2020-02-02','asdfasdf',9876543211234567,9876543210);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hall`
--

DROP TABLE IF EXISTS `hall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hall` (
  `hid` varchar(3) NOT NULL,
  `_mid` varchar(4) DEFAULT NULL,
  `platinum` int(3) NOT NULL,
  `gold` int(3) NOT NULL,
  `plat_a` int(3) NOT NULL,
  `gold_a` int(3) NOT NULL,
  `tid` varchar(3) NOT NULL,
  `time_id` int(1) NOT NULL,
  `screening_date` date NOT NULL,
  `gold_price` int(3) NOT NULL,
  `plat_price` int(3) NOT NULL,
  PRIMARY KEY (`hid`,`tid`,`time_id`,`screening_date`),
  KEY `tid` (`tid`),
  KEY `time_id` (`time_id`),
  CONSTRAINT `hall_ibfk_1` FOREIGN KEY (`tid`) REFERENCES `theatre` (`tid`),
  CONSTRAINT `hall_ibfk_2` FOREIGN KEY (`time_id`) REFERENCES `timings` (`time_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall`
--

LOCK TABLES `hall` WRITE;
/*!40000 ALTER TABLE `hall` DISABLE KEYS */;
INSERT INTO `hall` VALUES ('h01','m01',20,70,20,70,'t01',2,'2020-03-01',180,250),('h01','m01',20,70,20,70,'t01',3,'2020-03-01',180,250),('h01','m01',20,70,20,70,'t02',1,'2020-03-02',180,250),('h01','m01',20,70,20,70,'t02',2,'2020-03-01',180,250),('h01','m02',20,70,20,70,'t02',3,'2020-03-01',180,250),('h02','m01',20,70,20,70,'t01',1,'2020-03-01',180,250),('h02','m01',20,70,20,70,'t01',4,'2020-03-02',180,250);
/*!40000 ALTER TABLE `hall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movies` (
  `_mid` varchar(5) NOT NULL,
  `title` varchar(256) NOT NULL,
  `release_date` date NOT NULL,
  `link` varchar(500) NOT NULL,
  `image` varchar(300) DEFAULT NULL,
  `lang` varchar(15) NOT NULL,
  `genre` varchar(15) NOT NULL,
  PRIMARY KEY (`_mid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES ('m01','Jumanji: THE NEXT LEVEL','2019-12-09','tt7975244','/img/m1.jpg','English','Adventure'),('m02','Gone Girl','2019-10-03','tt2267998','/img/gone_girl.jpg','English','Thriller'),('m03','Love Aaj Kal','2020-02-14','tt10023024','/img/m03.jpg','hindi','Romance'),('m04','Interstellar','2019-04-04','tt0816692','/img/m04.jpg','English','Sci-fi'),('m05','The Whistlers','2019-02-02','tt7921248','/img/m05.jpg','English','Crime'),('m06','Parasite','2019-01-31','tt6751668','/img/m06.jpg','English','Thriller'),('m07','Joker','2019-10-02','tt7286456','/img/m07.jpg','English','Thriller'),('m08','the invisible man','2020-02-28','tt1051906','/img/m08.jpg','English','Horror'),('m09','1917','2020-01-10','tt8579674','/img/m09.jpg','English','war'),('m10','Ford v Ferrari','2019-11-15','tt1950186','/img/m10.jpg','English','biography'),('m11','Bohemian Rhapsody','2019-11-02','tt1727824','/img/m11.jpg','English','biography'),('m12','Jojo Rabbit ','2019-11-08','tt2584384','/img/m12.jpg','English','comedy'),('m13','Waves','2019-11-15','tt8652728','/img/m13.jpg','English','sport'),('m14','Klaus','2019-11-15','tt4729430','/img/m14.jpg','English','animation'),('m15','john wick 3','2019-05-17','tt6146586','/img/m15.jpg','English','action'),('m16','Booksmart','2019-05-24','tt1489887','/img/m16.jpg','English','comedy'),('m17','Terminator: dark fate','2019-11-01','tt6450804','/img/m17.jpg','English','sci-fi'),('m18','Aquarela','2019-12-12','tt4920360','/img/m18.jpg','English','documentary'),('m19','rocketman','2019-05-31','tt2066051','/img/m19.jpg','English','music'),('m20','Climax','2019-11-19','tt8359848','/img/m20.jpg','English','drama');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rcs`
--

DROP TABLE IF EXISTS `rcs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rcs` (
  `rid` int(9) NOT NULL,
  `sid` varchar(4) NOT NULL,
  PRIMARY KEY (`rid`,`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rcs`
--

LOCK TABLES `rcs` WRITE;
/*!40000 ALTER TABLE `rcs` DISABLE KEYS */;
INSERT INTO `rcs` VALUES (1,'A3'),(1,'F2');
/*!40000 ALTER TABLE `rcs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theatre`
--

DROP TABLE IF EXISTS `theatre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `theatre` (
  `tid` varchar(3) NOT NULL,
  `halls_count` int(2) NOT NULL,
  `tname` varchar(30) NOT NULL,
  `location` varchar(15) NOT NULL,
  `city` varchar(20) NOT NULL,
  PRIMARY KEY (`tid`),
  KEY `ctid` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theatre`
--

LOCK TABLES `theatre` WRITE;
/*!40000 ALTER TABLE `theatre` DISABLE KEYS */;
INSERT INTO `theatre` VALUES ('t01',2,'Abhinay Theatre','Gandhinagar','bangalore'),('t02',2,'Anand Theatre','Maleshwaram','bangalore'),('t03',2,'INOX Yelahanka','Yelahanka','bangalore'),('t04',2,'PVR Indranagar','Indranagar','bangalore'),('t05',2,'Amb Cinemas','Gachibowli','Hyderabad'),('t06',2,'Anjali Theatre','Secunderabad','Hyderabad'),('t07',2,'Arjun cinema','Kukatpally','Hyderabad'),('t08',2,'Asian Multiplex','Hi tech city','Hyderabad'),('t13',2,'Alfred Cinema','Grant Road','Mumbai'),('t14',2,'Aman Theatre','Ullas Nagar','Mumbai'),('t15',2,'PVR Aurora ','Andheri','Mumbai'),('t16',2,'INOX Cinema','Dadar','Mumbai'),('t17',2,'Agastya Theatre','Tondiapet','Chennai'),('t18',2,'AGS cinemas','Navalur','Chennai'),('t19',2,'Arvind theatre','karapakkam','Chennai'),('t20',2,'Devi Cineplex','Triplicane','Chennai');
/*!40000 ALTER TABLE `theatre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timings`
--

DROP TABLE IF EXISTS `timings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timings` (
  `time_id` int(1) NOT NULL AUTO_INCREMENT,
  `timing` varchar(20) NOT NULL,
  PRIMARY KEY (`time_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timings`
--

LOCK TABLES `timings` WRITE;
/*!40000 ALTER TABLE `timings` DISABLE KEYS */;
INSERT INTO `timings` VALUES (1,'08:00-11:30'),(2,'12:00-15:30'),(3,'16:00-19:30'),(4,'20:00-23:30');
/*!40000 ALTER TABLE `timings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-21 18:37:26
