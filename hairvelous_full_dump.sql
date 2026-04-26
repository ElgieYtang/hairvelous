? -- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: hairvelous
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assessment_responses`
--

DROP TABLE IF EXISTS `assessment_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assessment_responses` (
  `response_id` int(11) NOT NULL AUTO_INCREMENT,
  `assessment_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`response_id`),
  KEY `idx_assessment_id` (`assessment_id`),
  CONSTRAINT `fk_response_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `hair_assessment` (`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_responses`
--

LOCK TABLES `assessment_responses` WRITE;
/*!40000 ALTER TABLE `assessment_responses` DISABLE KEYS */;
INSERT INTO `assessment_responses` VALUES (1,1,'How oily is your scalp?','oily'),(2,1,'What is your hair texture?','wavy'),(3,2,'Which best describes your natural hair type?','\"Straight\"'),(4,2,'How would you describe your scalp condition?','\"Normal\"'),(5,2,'Which hair concerns or issues are you currently noticing?','[\"Dryness\"]'),(6,2,'How often do you usually wash your hair?','\"Every day\"'),(7,2,'How often do you use heat styling tools (dryer, straightener, curler)?','\"Rarely / never\"'),(8,3,'Which best describes your natural hair type?','\"Straight\"'),(9,3,'How would you describe your scalp condition?','\"Normal\"'),(10,3,'Which hair concerns or issues are you currently noticing?','[\"Dryness\"]'),(11,3,'How often do you usually wash your hair?','\"Every day\"'),(12,3,'How often do you use heat styling tools (dryer, straightener, curler)?','\"Rarely / never\"'),(13,4,'Which best describes your natural hair type?','\"Straight\"'),(14,4,'How would you describe your scalp condition?','\"Normal\"'),(15,4,'Which hair concerns or issues are you currently noticing?','[\"Dryness\"]'),(16,4,'How often do you usually wash your hair?','\"Every day\"'),(17,4,'How often do you use heat styling tools (dryer, straightener, curler)?','\"Rarely / never\"'),(18,5,'Which best describes your natural hair type?','\"Straight\"'),(19,5,'How would you describe your scalp condition?','\"Normal\"'),(20,5,'Which hair concerns or issues are you currently noticing?','[\"Dryness\"]'),(21,5,'How often do you usually wash your hair?','\"Every day\"'),(22,5,'How often do you use heat styling tools (dryer, straightener, curler)?','\"Rarely / never\"'),(23,6,'Which best describes your natural hair type?','\"Coily / Kinky\"'),(24,6,'How would you describe your scalp condition?','\"Severe eczema / dermatitis on scalp\"'),(25,6,'Which hair concerns or issues are you currently noticing?','[\"Breakage or split ends\"]'),(26,6,'How often do you usually wash your hair?','\"Every 2–3 days\"'),(27,6,'How often do you use heat styling tools (dryer, straightener, curler)?','\"Rarely / never\"'),(28,7,'Which best describes your natural hair type?','\"Straight\"'),(29,7,'How would you describe your scalp condition?','\"Dry / Flaky\"'),(30,7,'Which hair concerns or issues are you currently noticing?','[\"Dryness\"]'),(31,7,'How often do you usually wash your hair?','\"Every 2–3 days\"'),(32,7,'How often do you use heat styling tools (dryer, straightener, curler)?','\"A few times a week\"'),(33,8,'Which best describes your natural hair type?','\"Straight\"'),(34,8,'How would you describe your scalp condition?','\"Normal\"'),(35,8,'Which hair concerns or issues are you currently noticing?','[\"Dryness\"]'),(36,8,'How often do you usually wash your hair?','\"Every day\"'),(37,8,'How often do you use heat styling tools (dryer, straightener, curler)?','\"Rarely / never\"');
/*!40000 ALTER TABLE `assessment_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultation_ai_handoffs`
--

DROP TABLE IF EXISTS `consultation_ai_handoffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultation_ai_handoffs` (
  `handoff_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specialist_user_id` int(11) NOT NULL,
  `trigger_message_id` int(11) DEFAULT NULL,
  `summary_text` text NOT NULL,
  `status` varchar(24) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`handoff_id`),
  KEY `idx_handoff_consult_created` (`consultation_id`,`created_at`),
  KEY `idx_handoff_specialist_status` (`specialist_user_id`,`status`),
  KEY `fk_handoff_user` (`user_id`),
  CONSTRAINT `fk_handoff_consult` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_handoff_specialist` FOREIGN KEY (`specialist_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_handoff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultation_ai_handoffs`
--

LOCK TABLES `consultation_ai_handoffs` WRITE;
/*!40000 ALTER TABLE `consultation_ai_handoffs` DISABLE KEYS */;
INSERT INTO `consultation_ai_handoffs` VALUES (1,3,4,5,8,'Offline assistant handoff\nConcern: [DEMO] Completed consultation\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: My scalp still feels itchy after wash, what should I do tonight? | user: offline test message for assistant\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 07:12:27'),(2,4,4,5,11,'Offline assistant handoff\nConcern: [DEMO] Awaiting payment consultation\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: asdasd\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 07:18:50'),(3,3,4,5,15,'Offline assistant handoff\nConcern: [DEMO] Completed consultation\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: offline test message for assistant | assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: How | user: quick follow up, any routine tonight? | assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: also my scalp has burning and bleeding spots\nAssistant reply: Your message may include urgent symptoms. I cannot diagnose conditions in chat. Please seek immediate professional care if symptoms are severe, painful, spreading, or include bleeding/infection signs. I am escalating this to your specialist now and they should follow up as soon as possible.','pending','2026-04-22 07:21:16'),(4,4,4,5,34,'Offline assistant handoff\nConcern: [DEMO] Awaiting payment consultation\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: hey | assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: itchy/flaky | assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: my scalp is oily by evening\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"my scalp is oily by evening\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), use a lightweight cleanse and avoid heavy oils on scalp to reduce buildup. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 07:31:06'),(5,4,4,5,46,'Offline assistant handoff\nConcern: [DEMO] Awaiting payment consultation\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: hey | specialist: hey | user: hey | user: hey | user: hey\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 07:44:05'),(6,4,4,5,50,'Offline assistant handoff\nConcern: [DEMO] Awaiting payment consultation\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: hey | user: hey | assistant: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up. | user: hey | specialist: hey | user: hey\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 07:47:45'),(7,2,4,5,52,'Offline assistant handoff\nConcern: 123\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: hey | specialist: hey | user: hey\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 07:52:49'),(8,6,4,5,62,'Offline assistant handoff\nConcern: Frizz, breakage\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: hey | specialist: hey all good | user: hey\nAssistant reply: It looks like your specialist is away at the moment, so I can assist with immediate general care tips. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will send this context to your specialist for a proper follow-up review.','pending','2026-04-22 08:49:31'),(9,7,4,5,64,'Offline assistant handoff\nConcern: Breakage\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: notif-smoke user-to-specialist\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"notif-smoke user-to-specialist\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-22 08:51:20'),(10,13,13,5,73,'Offline assistant handoff\nConcern: Breakage 111\nProfile: hair_type=Coily / Kinky, scalp=Severe eczema / dermatitis on scalp, issues=Breakage or split ends\nRecent chat: user: hey | specialist: hey | user: hey\nAssistant reply: Your specialist is currently offline, so I will provide safe initial guidance while waiting. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Coily / Kinky, Severe eczema / dermatitis on scalp), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will pass this summary to your specialist so they can continue from here.','pending','2026-04-25 00:09:56'),(11,16,15,16,78,'Offline assistant handoff\nConcern: Breakage\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: hi\nAssistant reply: It looks like your specialist is away at the moment, so I can assist with immediate general care tips. I received your message: \"hi\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will send this context to your specialist for a proper follow-up review.','pending','2026-04-25 08:50:29'),(12,16,15,16,86,'Offline assistant handoff\nConcern: Breakage\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: hey | user: hey | user: hey | specialist: hey | user: hey | user: hey\nAssistant reply: Your specialist is currently offline, so I will provide safe initial guidance while waiting. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will pass this summary to your specialist so they can continue from here.','pending','2026-04-25 08:54:10'),(13,19,18,5,92,'Offline assistant handoff\nConcern: test page\nProfile: hair_type=Straight, scalp=Dry / Flaky, issues=Dryness\nRecent chat: user: hey | specialist: hey | user: hey\nAssistant reply: Your specialist is currently offline, so I will provide safe initial guidance while waiting. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Dry / Flaky), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will pass this summary to your specialist so they can continue from here.','pending','2026-04-25 10:35:48'),(14,19,18,5,99,'Offline assistant handoff\nConcern: test page\nProfile: hair_type=Straight, scalp=Normal, issues=Dryness\nRecent chat: user: hey | specialist: hey | specialist: hey | user: hey | user: hey | user: hey\nAssistant reply: Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.','pending','2026-04-25 12:33:41');
/*!40000 ALTER TABLE `consultation_ai_handoffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultation_feedback`
--

DROP TABLE IF EXISTS `consultation_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultation_feedback` (
  `feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specialist_user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `feedback_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `uq_feedback_consult_user` (`consultation_id`,`user_id`),
  KEY `idx_feedback_specialist` (`specialist_user_id`),
  KEY `fk_feedback_user` (`user_id`),
  CONSTRAINT `fk_feedback_consult` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_feedback_specialist` FOREIGN KEY (`specialist_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultation_feedback`
--

LOCK TABLES `consultation_feedback` WRITE;
/*!40000 ALTER TABLE `consultation_feedback` DISABLE KEYS */;
INSERT INTO `consultation_feedback` VALUES (1,1,4,5,4,'nice11231232','2026-04-22 06:08:00','2026-04-22 06:17:24'),(4,2,4,5,5,'vey buce service','2026-04-22 06:20:33','2026-04-22 06:20:33'),(5,3,4,5,5,'Very clear recommendations and easy to follow routine.','2026-04-22 06:54:31','2026-04-22 06:54:31'),(6,12,15,5,5,'Awesome !','2026-04-23 16:47:46','2026-04-23 16:47:46'),(7,13,13,5,5,NULL,'2026-04-25 00:14:44','2026-04-25 00:14:44'),(8,16,15,16,5,NULL,'2026-04-25 09:14:12','2026-04-25 09:14:12'),(9,17,15,17,5,'bogo','2026-04-25 09:32:31','2026-04-25 09:32:31'),(10,19,18,5,5,'good','2026-04-25 10:36:51','2026-04-25 10:36:51');
/*!40000 ALTER TABLE `consultation_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultation_messages`
--

DROP TABLE IF EXISTS `consultation_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultation_messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation_id` int(11) NOT NULL,
  `sender_user_id` int(11) NOT NULL,
  `sender_role` varchar(20) NOT NULL,
  `message_text` text NOT NULL,
  `image_path` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`message_id`),
  KEY `fk_consult_msg_consult` (`consultation_id`),
  KEY `fk_consult_msg_sender` (`sender_user_id`),
  CONSTRAINT `fk_consult_msg_consult` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_consult_msg_sender` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultation_messages`
--

LOCK TABLES `consultation_messages` WRITE;
/*!40000 ALTER TABLE `consultation_messages` DISABLE KEYS */;
INSERT INTO `consultation_messages` VALUES (1,1,5,'specialist','Hello',NULL,'2026-04-22 06:02:04'),(2,1,4,'user','Hi',NULL,'2026-04-22 06:02:35'),(3,1,4,'user','dasdas',NULL,'2026-04-22 06:05:57'),(4,1,5,'specialist','ddasdas',NULL,'2026-04-22 06:06:00'),(5,2,4,'user','hey',NULL,'2026-04-22 06:19:15'),(6,2,5,'specialist','hey',NULL,'2026-04-22 06:19:20'),(7,3,4,'user','My scalp still feels itchy after wash, what should I do tonight?',NULL,'2026-04-22 07:12:16'),(8,3,4,'user','offline test message for assistant',NULL,'2026-04-22 07:12:26'),(9,3,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:12:27'),(10,3,4,'user','How',NULL,'2026-04-22 07:15:00'),(11,4,4,'user','asdasd',NULL,'2026-04-22 07:18:50'),(12,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:18:50'),(13,3,4,'user','quick follow up, any routine tonight?',NULL,'2026-04-22 07:21:16'),(14,3,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:21:16'),(15,3,4,'user','also my scalp has burning and bleeding spots',NULL,'2026-04-22 07:21:16'),(16,3,5,'assistant','Your message may include urgent symptoms. I cannot diagnose conditions in chat. Please seek immediate professional care if symptoms are severe, painful, spreading, or include bleeding/infection signs. I am escalating this to your specialist now and they should follow up as soon as possible.',NULL,'2026-04-22 07:21:16'),(17,4,4,'user','dsd',NULL,'2026-04-22 07:21:51'),(18,4,4,'user','Hello?',NULL,'2026-04-22 07:21:57'),(19,4,4,'user','test now will assistant respond?',NULL,'2026-04-22 07:23:19'),(20,4,4,'user','hello',NULL,'2026-04-22 07:24:53'),(21,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:24:54'),(22,4,4,'user','okay',NULL,'2026-04-22 07:25:00'),(23,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:25:00'),(24,4,4,'user','My scalp is itchy and flaky tonight',NULL,'2026-04-22 07:26:13'),(25,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"My scalp is itchy and flaky tonight\". Based on your profile (Straight, Normal), use a gentle anti-dandruff or soothing scalp wash, avoid scratching, and rinse thoroughly with lukewarm water. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:26:14'),(26,4,4,'user','Now it feels dry and frizzy too',NULL,'2026-04-22 07:26:14'),(27,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"Now it feels dry and frizzy too\". Based on your profile (Straight, Normal), focus on hydration: use a gentle conditioner or mask on lengths and avoid high heat styling tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:26:14'),(28,4,4,'user','hey',NULL,'2026-04-22 07:26:42'),(29,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:26:43'),(30,4,4,'user','hey',NULL,'2026-04-22 07:26:47'),(31,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:26:47'),(32,4,4,'user','itchy/flaky',NULL,'2026-04-22 07:27:42'),(33,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:27:43'),(34,4,4,'user','my scalp is oily by evening',NULL,'2026-04-22 07:31:06'),(35,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"my scalp is oily by evening\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), use a lightweight cleanse and avoid heavy oils on scalp to reduce buildup. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:31:06'),(36,4,4,'user','also dry on hair ends',NULL,'2026-04-22 07:31:06'),(37,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"also dry on hair ends\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), focus on hydration: use a gentle conditioner or mask on lengths and avoid high heat styling tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:31:06'),(38,4,4,'user','asdasd',NULL,'2026-04-22 07:32:56'),(39,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:32:56'),(40,4,4,'user','specialist is online should not trigger AI',NULL,'2026-04-22 07:35:17'),(41,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. Based on your profile (Straight, Normal), keep your routine gentle and consistent. If symptoms worsen, become painful, or you notice severe irritation, please seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:35:17'),(42,4,4,'user','hey',NULL,'2026-04-22 07:36:43'),(43,4,5,'specialist','hey',NULL,'2026-04-22 07:37:18'),(44,4,4,'user','hey',NULL,'2026-04-22 07:39:23'),(45,4,4,'user','hey',NULL,'2026-04-22 07:39:29'),(46,4,4,'user','hey',NULL,'2026-04-22 07:44:05'),(47,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:44:05'),(48,4,4,'user','hey',NULL,'2026-04-22 07:45:19'),(49,4,5,'specialist','hey',NULL,'2026-04-22 07:45:28'),(50,4,4,'user','hey',NULL,'2026-04-22 07:47:45'),(51,4,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:47:45'),(52,2,4,'user','hey',NULL,'2026-04-22 07:52:49'),(53,2,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:52:49'),(54,2,4,'user','any routine should i take?',NULL,'2026-04-22 07:53:03'),(55,2,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"any routine should i take?\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:53:03'),(56,2,4,'user','how',NULL,'2026-04-22 07:53:07'),(57,2,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"how\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 07:53:07'),(58,5,4,'user','hey',NULL,'2026-04-22 08:03:07'),(59,5,5,'specialist','hey',NULL,'2026-04-22 08:06:57'),(60,6,4,'user','hey',NULL,'2026-04-22 08:11:22'),(61,6,5,'specialist','hey all good',NULL,'2026-04-22 08:12:02'),(62,6,4,'user','hey',NULL,'2026-04-22 08:49:31'),(63,6,5,'assistant','It looks like your specialist is away at the moment, so I can assist with immediate general care tips. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will send this context to your specialist for a proper follow-up review.',NULL,'2026-04-22 08:49:31'),(64,7,4,'user','notif-smoke user-to-specialist',NULL,'2026-04-22 08:51:20'),(65,7,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"notif-smoke user-to-specialist\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-22 08:51:20'),(66,7,5,'specialist','notif-smoke specialist-to-user',NULL,'2026-04-22 08:51:21'),(67,9,3,'user','hey',NULL,'2026-04-22 18:29:25'),(68,9,5,'specialist','hey',NULL,'2026-04-22 18:43:01'),(69,12,5,'specialist','hey',NULL,'2026-04-23 16:45:06'),(70,12,15,'user','hey',NULL,'2026-04-23 16:45:09'),(71,13,13,'user','hey',NULL,'2026-04-25 00:09:01'),(72,13,5,'specialist','hey',NULL,'2026-04-25 00:09:18'),(73,13,13,'user','hey',NULL,'2026-04-25 00:09:56'),(74,13,5,'assistant','Your specialist is currently offline, so I will provide safe initial guidance while waiting. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Coily / Kinky, Severe eczema / dermatitis on scalp), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will pass this summary to your specialist so they can continue from here.',NULL,'2026-04-25 00:09:56'),(75,13,5,'specialist','hello again',NULL,'2026-04-25 00:10:31'),(76,14,5,'specialist','test',NULL,'2026-04-25 00:17:03'),(77,14,13,'user','test',NULL,'2026-04-25 00:17:08'),(78,16,15,'user','hi',NULL,'2026-04-25 08:50:29'),(79,16,16,'assistant','It looks like your specialist is away at the moment, so I can assist with immediate general care tips. I received your message: \"hi\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will send this context to your specialist for a proper follow-up review.',NULL,'2026-04-25 08:50:29'),(80,16,16,'specialist','hey',NULL,'2026-04-25 08:50:36'),(81,16,15,'user','hey',NULL,'2026-04-25 08:50:39'),(82,16,15,'user','hey',NULL,'2026-04-25 08:50:44'),(83,16,15,'user','hey',NULL,'2026-04-25 08:52:42'),(84,16,16,'specialist','hey',NULL,'2026-04-25 08:52:50'),(85,16,15,'user','hey',NULL,'2026-04-25 08:53:06'),(86,16,15,'user','hey',NULL,'2026-04-25 08:54:10'),(87,16,16,'assistant','Your specialist is currently offline, so I will provide safe initial guidance while waiting. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will pass this summary to your specialist so they can continue from here.',NULL,'2026-04-25 08:54:10'),(88,17,15,'user','hey',NULL,'2026-04-25 09:31:12'),(89,17,17,'specialist','hey',NULL,'2026-04-25 09:31:18'),(90,19,18,'user','hey',NULL,'2026-04-25 10:33:31'),(91,19,5,'specialist','hey',NULL,'2026-04-25 10:33:35'),(92,19,18,'user','hey',NULL,'2026-04-25 10:35:48'),(93,19,5,'assistant','Your specialist is currently offline, so I will provide safe initial guidance while waiting. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Dry / Flaky), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will pass this summary to your specialist so they can continue from here.',NULL,'2026-04-25 10:35:48'),(94,19,18,'user','hey',NULL,'2026-04-25 10:36:01'),(95,19,5,'specialist','hey',NULL,'2026-04-25 10:36:06'),(96,19,5,'specialist','hey',NULL,'2026-04-25 12:32:59'),(97,19,18,'user','hey',NULL,'2026-04-25 12:33:11'),(98,19,18,'user','hey',NULL,'2026-04-25 12:33:11'),(99,19,18,'user','hey',NULL,'2026-04-25 12:33:41'),(100,19,5,'assistant','Your specialist appears offline right now, so I can help with general guidance while you wait. I received your message: \"hey\". I reviewed your recent chat context as well. Based on your profile (Straight, Normal), keep your routine gentle and consistent tonight. If symptoms worsen, become painful, or include bleeding/infection signs, seek professional care promptly. I will forward a summary to your specialist for follow-up.',NULL,'2026-04-25 12:33:41'),(101,19,18,'user','hey',NULL,'2026-04-25 12:34:25'),(102,19,5,'specialist','hey',NULL,'2026-04-25 12:34:34');
/*!40000 ALTER TABLE `consultation_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultations`
--

DROP TABLE IF EXISTS `consultations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultations` (
  `consultation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `specialist_user_id` int(11) DEFAULT NULL,
  `concern_title` varchar(150) NOT NULL,
  `concern_message` text NOT NULL,
  `preferred_date` date DEFAULT NULL,
  `status` varchar(40) NOT NULL DEFAULT 'pending',
  `specialist_notes` text DEFAULT NULL,
  `validated_products_text` text DEFAULT NULL,
  `final_recommendation` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount_php` decimal(10,2) DEFAULT NULL,
  `platform_fee_percent` decimal(5,2) DEFAULT NULL,
  `payment_status` varchar(24) NOT NULL DEFAULT 'unpaid',
  `payment_reference` varchar(128) DEFAULT NULL,
  `payment_receipt_path` varchar(512) DEFAULT NULL,
  `payment_submitted_at` timestamp NULL DEFAULT NULL,
  `meeting_url` varchar(512) DEFAULT NULL,
  `decline_reason` text DEFAULT NULL,
  `paid_verified_at` timestamp NULL DEFAULT NULL,
  `verified_by_admin_user_id` int(11) DEFAULT NULL,
  `paymongo_checkout_session_id` varchar(128) DEFAULT NULL,
  `paymongo_payment_intent_id` varchar(128) DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `prescription_summary` text DEFAULT NULL,
  `prescription_products_text` text DEFAULT NULL,
  `prescription_plan_text` text DEFAULT NULL,
  `prescription_issued_at` datetime DEFAULT NULL,
  PRIMARY KEY (`consultation_id`),
  KEY `fk_consult_user` (`user_id`),
  KEY `fk_consult_specialist` (`specialist_user_id`),
  CONSTRAINT `fk_consult_specialist` FOREIGN KEY (`specialist_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_consult_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultations`
--

LOCK TABLES `consultations` WRITE;
/*!40000 ALTER TABLE `consultations` DISABLE KEYS */;
INSERT INTO `consultations` VALUES (1,4,5,'testingi','test','2026-04-27','completed',NULL,NULL,'Findings: test\nPlan: test\nFollow-up: test','2026-04-22 05:59:03','2026-04-22 06:07:11',499.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-b6977c15-fe40-404e-895a-c8eba4bb39cf.jpg','2026-04-22 06:01:46','aaaa-bbbb-cccc',NULL,'2026-04-22 06:01:55',6,NULL,NULL,'2026-04-22 14:01:55','2026-04-22 14:07:11','TEST','TEST','test','2026-04-22 14:03:05'),(2,4,5,'123','123','2026-04-03','completed',NULL,NULL,'Findings: test\nPlan: etst\nFollow-up: test','2026-04-22 06:17:36','2026-04-22 06:20:18',800.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-3ae26376-7c07-49d2-b776-3fdd697483ed.png','2026-04-22 06:18:40','aaaa-bbbb-cccc',NULL,'2026-04-22 06:19:00',6,NULL,NULL,'2026-04-22 14:19:00','2026-04-22 14:20:18','test','Anti-Dandruff Treatment Serum','qwe','2026-04-22 14:19:43'),(3,4,5,'[DEMO] Completed consultation','Demo concern used for defense presentation.','2026-04-22','completed',NULL,NULL,'Findings: mild dryness and frizz. Plan: keep routine consistent and monitor weekly.','2026-04-22 06:54:31','2026-04-22 06:54:31',900.00,10.00,'verified','DEMO-REF-1776840871736',NULL,NULL,NULL,NULL,'2026-04-22 06:54:31',6,NULL,NULL,'2026-04-22 14:54:31','2026-04-22 14:54:31','Hydration + anti-frizz routine','Deep Moisture Hair Mask, Frizz Control Oil','Use mask weekly and oil on damp hair after wash.','2026-04-22 14:54:31'),(4,4,5,'[DEMO] Awaiting payment consultation','Demo pending booking to show progress flow.','2026-04-24','completed',NULL,NULL,'Findings: Tet\nPlan: testte\nFollow-up: test','2026-04-22 06:54:31','2026-04-22 07:37:58',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-c3c69ce0-ee8d-455e-9d55-fc957f510278.jpg','2026-04-22 07:18:15','aaaa-bbbb-cccc',NULL,'2026-04-22 07:18:32',6,NULL,NULL,'2026-04-22 15:18:32','2026-04-22 15:37:58',NULL,NULL,NULL,NULL),(5,4,5,'Dryness','Need proper medication step by step from a specialist','2026-05-07','completed',NULL,NULL,'Findings: 123\nPlan: 123\nFollow-up: 123','2026-04-22 07:58:19','2026-04-22 08:08:46',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-d3c9deff-5858-4c3d-a39d-6e8a1696489e.jpg','2026-04-22 07:58:47','aaaa-bbbb-cccc',NULL,'2026-04-22 07:59:06',6,NULL,NULL,'2026-04-22 15:59:06','2026-04-22 16:08:35','test','test','test','2026-04-22 16:08:46'),(6,4,5,'Frizz, breakage','test etst','2026-05-08','completed',NULL,NULL,'Findings: test\nPlan: test\nFollow-up: test','2026-04-22 08:09:27','2026-04-22 08:12:22',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-33ddc47e-2446-4499-b587-343622ebb6c7.jpg','2026-04-22 08:10:20','aaaa-bbbb-cccc',NULL,'2026-04-22 08:10:42',6,NULL,NULL,'2026-04-22 16:10:42','2026-04-22 16:12:22','gi kspa','123','123','2026-04-22 16:11:52'),(7,4,5,'Breakage','breakage sa o','2026-05-13','completed',NULL,NULL,'Findings: test\nPlan: test\nNext check-in: test','2026-04-22 08:16:02','2026-04-22 18:43:16',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-f8ea69ba-db5e-43b9-83e0-e49c1f92b046.jpg','2026-04-22 08:16:29','aaaa-bbbb-cccc',NULL,'2026-04-22 08:16:37',6,NULL,NULL,'2026-04-22 16:16:37','2026-04-23 02:43:16','test','test','test','2026-04-22 16:17:04'),(8,3,5,'Breakage','test test test','2026-05-16','cancelled',NULL,NULL,NULL,'2026-04-22 18:26:54','2026-04-22 18:27:52',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-3-85b5dd03-7e4b-40b8-aeff-1a6531ddaaaa.jpg','2026-04-22 18:27:42','aaaa-bbbb-cccc',NULL,'2026-04-22 18:27:48',6,NULL,NULL,'2026-04-23 02:27:48',NULL,NULL,NULL,NULL,NULL),(9,3,5,'Frizz','pest s','2026-04-18','completed',NULL,NULL,'Findings: test\nPlan: testt\nNext check-in: test','2026-04-22 18:28:22','2026-04-22 18:43:11',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-3-9bc7b23b-23ca-46e5-a07e-c0dfc95fe896.jpg','2026-04-22 18:28:59','aaaa-bbbb-cccc',NULL,'2026-04-22 18:29:05',6,NULL,NULL,'2026-04-23 02:29:05','2026-04-23 02:43:11',NULL,NULL,NULL,NULL),(10,3,5,'dryness, breakage','tset','2026-05-28','completed',NULL,NULL,'Findings: test\nPlan: test\nNext check-in: test','2026-04-22 18:35:37','2026-04-22 18:42:36',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-3-85042fd6-6f15-4b00-9a5c-8ce110a422c8.jpg','2026-04-22 18:36:14','aaaa-cccc-dddd',NULL,'2026-04-22 18:37:18',6,NULL,NULL,'2026-04-23 02:37:18','2026-04-23 02:42:36',NULL,NULL,NULL,NULL),(11,4,5,'Katol katol sa o','test tes','2026-05-20','completed',NULL,NULL,'Findings: test\nPlan: test\nNext check-in: test','2026-04-22 19:03:21','2026-04-22 19:04:35',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-4-76bb3836-c91a-4ac6-ac5b-bdf6b893b08e.jpeg','2026-04-22 19:03:57','aaaa-bbbb-dddd',NULL,'2026-04-22 19:04:08',6,NULL,NULL,'2026-04-23 03:04:08','2026-04-23 03:04:35',NULL,NULL,NULL,NULL),(12,15,5,'Breakage','test test','2026-04-25','completed',NULL,NULL,'Findings: test\nPlan: test\nNext check-in: Not required','2026-04-23 16:42:38','2026-04-23 16:47:08',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-15-dd876675-fd02-4dca-9182-c3f9471c70df.jpg','2026-04-23 16:44:11','aaaa-bbbb-dddd',NULL,'2026-04-23 16:44:22',6,NULL,NULL,'2026-04-24 00:44:22','2026-04-24 00:47:08','Katol2 sa o','clear shampoo','1. twice\n2. thrice','2026-04-24 00:45:45'),(13,13,5,'Breakage 111','test qwe','2026-04-27','completed',NULL,NULL,'Findings: Severe dandruff\nPlan: test\nNext check-in: Not required','2026-04-25 00:05:16','2026-04-25 00:13:34',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-13-424aba55-4b9c-4ccf-9da2-7f5dc3a41348.jpg','2026-04-25 00:07:18','aaaa-bbbb-dddd',NULL,'2026-04-25 00:07:49',6,NULL,NULL,'2026-04-25 08:07:49','2026-04-25 08:13:34','test','Keratin Smooth Conditioner','1\n2\n3','2026-04-25 08:12:20'),(14,13,5,'Another test','test test','2026-05-27','completed',NULL,NULL,'Findings: TEST TES TEST SETSET TES TES TES\nPlan: bla bla bla bla bla bla bla\nNext check-in: Not required','2026-04-25 00:15:34','2026-04-25 00:21:46',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-13-614d0391-4433-474f-9afe-d0ebd1367161.jpeg','2026-04-25 00:16:14','aaaa-bbbb-dddd',NULL,'2026-04-25 00:16:23',6,NULL,NULL,'2026-04-25 08:16:23','2026-04-25 08:21:46',NULL,NULL,NULL,NULL),(15,15,5,'Eczema','need specialist to help me improve my hair condition','2026-05-30','completed',NULL,NULL,'Findings: test\nPlan: test\nNext check-in: Not required','2026-04-25 01:10:11','2026-04-25 01:14:41',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-15-de31a338-b097-4470-8acc-124721126663.jpg','2026-04-25 01:12:15','aaaa-bbbb-dddd',NULL,'2026-04-25 01:12:36',6,NULL,NULL,'2026-04-25 09:12:36','2026-04-25 09:14:41','wash up daily','Cool Menthol Anti-Dandruff Shampoo','step 1\nstep 2','2026-04-25 09:14:02'),(16,15,16,'Breakage','Need hglep','2026-05-05','completed',NULL,NULL,'Findings: severe hair dandruff\nPlan: wash 3x a day\nNext check-in: Not required','2026-04-25 08:49:16','2026-04-25 09:13:57',800.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-15-48497134-a925-4e57-af23-b444307dad55.jpg','2026-04-25 08:49:50','qqqq-wwww-eeee',NULL,'2026-04-25 08:49:57',6,NULL,NULL,'2026-04-25 16:49:57','2026-04-25 17:13:57','Prescription test','Cuticle Coat Serum','1. test\n2. test\n3. 3x a day','2026-04-25 17:13:23'),(17,15,17,'Frizz','test','2026-05-16','completed',NULL,NULL,'Findings: grabe test\nPlan: test\nNext check-in: Not required','2026-04-25 09:29:53','2026-04-25 09:32:18',499.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-15-733be2e4-ae9a-449b-ae58-6d7c5c05d2a4.jpeg','2026-04-25 09:30:28','aaaa-bbbb-dddd',NULL,'2026-04-25 09:30:38',6,NULL,NULL,'2026-04-25 17:30:38','2026-04-25 17:32:18','Hair conidion','Hairfall Defense Conditioner','test','2026-04-25 17:31:45'),(18,15,5,'test','test','2026-05-09','in_progress',NULL,NULL,NULL,'2026-04-25 10:16:07','2026-04-25 10:17:36',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-15-72b7f033-f38f-47f0-ab54-cc0f44450ee4.jpg','2026-04-25 10:16:57','aaa-bbbb-ddd',NULL,'2026-04-25 10:17:07',6,NULL,NULL,'2026-04-25 18:17:07',NULL,NULL,NULL,NULL,NULL),(19,18,5,'test page','test','2026-04-30','completed',NULL,NULL,'Findings: test\nPlan: test\nNext check-in: Not required','2026-04-25 10:31:01','2026-04-25 10:36:17',900.00,10.00,'verified','123123123123','uploads/consultation-payments/pay-18-4aa4fa99-65ca-4f04-8b89-228ab240c67b.jpeg','2026-04-25 10:31:28','https://meet.google.com/qqqq-bbbb-dddd',NULL,'2026-04-25 10:31:37',6,NULL,NULL,'2026-04-25 18:31:37','2026-04-25 18:36:17','test','Intense Repair Shampoo','test','2026-04-25 18:33:27');
/*!40000 ALTER TABLE `consultations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diy_guides`
--

DROP TABLE IF EXISTS `diy_guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diy_guides` (
  `guide_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` enum('mask','oil','rinse','growth') NOT NULL DEFAULT 'mask',
  `difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'easy',
  `ingredients` text DEFAULT NULL,
  `steps` text NOT NULL,
  `caution` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_pro_only` tinyint(1) NOT NULL DEFAULT 0,
  `summary` text DEFAULT NULL,
  PRIMARY KEY (`guide_id`),
  KEY `idx_category` (`category`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_date_created` (`date_created`),
  CONSTRAINT `fk_guide_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diy_guides`
--

LOCK TABLES `diy_guides` WRITE;
/*!40000 ALTER TABLE `diy_guides` DISABLE KEYS */;
INSERT INTO `diy_guides` VALUES (1,'Coconut Oil Hair Mask','mask','easy','2 tbsp coconut oil, 1 tbsp honey (optional)','1. Warm coconut oil slightly\n2. Apply to hair lengths and ends\n3. Leave for 30 minutes\n4. Wash with mild shampoo','Do not use if allergic to coconut. Patch test first.',NULL,'2026-04-22 05:43:59',0,NULL),(2,'Apple Cider Vinegar Rinse','rinse','easy','1 part ACV, 4 parts water','1. Mix ACV with water\n2. After shampooing, pour over hair\n3. Massage scalp gently\n4. Rinse thoroughly','Do not use if you have open cuts or severe scalp issues. Consult a professional if unsure.',NULL,'2026-04-22 05:43:59',0,NULL),(3,'Argan Oil Treatment','oil','easy','2-3 drops argan oil','1. Apply oil to palms\n2. Work through damp hair\n3. Focus on ends\n4. Style as usual','Use sparingly to avoid greasy look.',NULL,'2026-04-22 05:43:59',0,NULL),(4,'Egg and Olive Oil Mask','mask','medium','1 egg, 2 tbsp olive oil','1. Beat egg and mix with olive oil\n2. Apply to hair\n3. Cover with shower cap\n4. Leave 20 minutes\n5. Rinse with cool water','Use cool water to rinse to avoid cooking the egg. May have strong smell.',NULL,'2026-04-22 05:43:59',0,NULL),(5,'Rice Water Rinse for Growth','rinse','easy','1 cup rice, 2 cups water','1. Soak rice in water for 30 minutes\n2. Strain and collect water\n3. After shampoo, pour rice water over hair\n4. Massage and leave 5 minutes\n5. Rinse','Fermented rice water may have stronger effect but stronger smell. Start with fresh rice water.',NULL,'2026-04-22 05:43:59',0,NULL);
/*!40000 ALTER TABLE `diy_guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hair_assessment`
--

DROP TABLE IF EXISTS `hair_assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hair_assessment` (
  `assessment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date_taken` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`assessment_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date_taken` (`date_taken`),
  CONSTRAINT `fk_assessment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hair_assessment`
--

LOCK TABLES `hair_assessment` WRITE;
/*!40000 ALTER TABLE `hair_assessment` DISABLE KEYS */;
INSERT INTO `hair_assessment` VALUES (1,2,'2026-04-22 05:43:59'),(2,3,'2026-04-22 05:46:29'),(3,1,'2026-04-22 05:51:57'),(4,4,'2026-04-22 05:56:18'),(5,15,'2026-04-23 16:40:36'),(6,13,'2026-04-24 23:59:46'),(7,18,'2026-04-25 10:28:23'),(8,18,'2026-04-25 12:31:40');
/*!40000 ALTER TABLE `hair_assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hair_photos`
--

DROP TABLE IF EXISTS `hair_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hair_photos` (
  `photo_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `ai_result` text DEFAULT NULL,
  `date_uploaded` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`photo_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date_uploaded` (`date_uploaded`),
  CONSTRAINT `fk_photo_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hair_photos`
--

LOCK TABLES `hair_photos` WRITE;
/*!40000 ALTER TABLE `hair_photos` DISABLE KEYS */;
INSERT INTO `hair_photos` VALUES (1,3,'uploads/hair-3-08597117-8c44-4103-b045-1fd5fe848b5c.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-22 05:46:14'),(2,3,'uploads/hair-3-a61a5f67-c438-405c-b9a5-70b3122f3fca.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-22 05:46:29'),(3,1,'uploads/hair-1-073cc17b-69c9-4e08-94b4-d8a02fa33a63.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-22 05:51:57'),(4,4,'uploads/hair-4-23fdc6ea-41d3-401a-b689-e9b86b6d1f51.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-22 05:55:44'),(5,4,'uploads/hair-4-ffbbfb15-99ce-42f2-a7be-bad6fbdcff65.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-22 05:56:18'),(6,15,'uploads/hair-15-f3667154-6097-4400-8a12-2ff8e1d0806f.png','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-23 16:40:37'),(7,13,'uploads/hair-13-ef91d5c8-30c9-4313-ae2d-f775ef7ad4a1.png','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-24 23:58:01'),(8,13,'uploads/hair-13-52115367-e58e-43fd-84be-741e7c3375f9.png','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-24 23:59:34'),(9,13,'uploads/hair-13-427f463a-4e81-45a0-87a6-44b422162598.png','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-24 23:59:46'),(10,18,'uploads/hair-18-05e1881c-d895-4291-a473-26f34c0e0a39.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-25 10:28:04'),(11,18,'uploads/hair-18-469c2a2b-25e3-49f1-9b82-b30a5cc60659.jpg','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-25 10:28:23'),(12,18,'uploads/hair-18-9e2a9a72-7d85-4364-bd53-e3577949d922.png','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-25 12:31:17'),(13,18,'uploads/hair-18-09cd3bad-c971-46b2-98e5-67bf95f6370a.png','AI analysis unavailable. This is for awareness only, not a medical diagnosis.','2026-04-25 12:31:40');
/*!40000 ALTER TABLE `hair_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hair_profiles`
--

DROP TABLE IF EXISTS `hair_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hair_profiles` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `hair_type` varchar(100) DEFAULT NULL,
  `scalp_condition` varchar(100) DEFAULT NULL,
  `issues_detected` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`profile_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_last_updated` (`last_updated`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hair_profiles`
--

LOCK TABLES `hair_profiles` WRITE;
/*!40000 ALTER TABLE `hair_profiles` DISABLE KEYS */;
INSERT INTO `hair_profiles` VALUES (2,2,NULL,NULL,NULL,'2026-04-22 05:43:59'),(6,1,'Straight','Normal','Dryness','2026-04-22 05:52:16'),(9,4,'Straight','Normal','Dryness','2026-04-22 05:56:28'),(10,3,'Straight','Normal','Dryness','2026-04-22 18:25:46'),(13,15,'Straight','Normal','Dryness','2026-04-23 18:09:21'),(15,13,'Coily / Kinky','Severe eczema / dermatitis on scalp','Breakage or split ends','2026-04-25 00:00:04'),(19,18,'Straight','Normal','Dryness','2026-04-25 12:31:53');
/*!40000 ALTER TABLE `hair_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipient_user_id` int(11) NOT NULL,
  `type` varchar(60) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_id`),
  KEY `fk_notification_recipient` (`recipient_user_id`),
  CONSTRAINT `fk_notification_recipient` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,4,'plan_change','Pro plan activated','Your Pro plan is now active.','/pricing.html',1,'2026-04-22 05:55:25'),(2,5,'consultation_request','New consultation request','You have a new request: \"testingi\".','/consultations.html',1,'2026-04-22 05:59:03'),(3,6,'consultation_request','New consultation request','A user submitted \"testingi\".','/consultations.html',1,'2026-04-22 05:59:03'),(4,4,'consultation_status','Consultation update','Your consultation \"testingi\" is now awaiting payment.','/consultations.html',1,'2026-04-22 05:59:52'),(5,6,'payment_pending','Demo payment submitted','Consultation #1 submitted demo payment for verification.','/consultations.html',1,'2026-04-22 06:00:57'),(6,4,'payment_rejected','Payment proof needs resubmission','Admin note: 1213','/consultations.html',1,'2026-04-22 06:01:31'),(7,6,'payment_pending','Payment proof submitted','Consultation #1 needs GCash verification.','/consultations.html',1,'2026-04-22 06:01:46'),(8,4,'payment_verified','Payment confirmed','\"testingi\" is paid. You can message your specialist now.','/consultations.html?chat=1',1,'2026-04-22 06:01:55'),(9,5,'payment_verified','Consultation paid','\"testingi\" is verified paid. Session can proceed.','/consultations.html?chat=1',1,'2026-04-22 06:01:55'),(10,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"testingi\".','/consultations.html?chat=1',1,'2026-04-22 06:02:04'),(11,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"testingi\".','/consultations.html?chat=1',1,'2026-04-22 06:02:35'),(12,4,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"testingi\".','/consultations.html',1,'2026-04-22 06:03:05'),(13,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"testingi\".','/consultations.html?chat=1',1,'2026-04-22 06:05:57'),(14,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"testingi\".','/consultations.html?chat=1',1,'2026-04-22 06:06:00'),(15,4,'consultation_status','Consultation update','Your consultation \"testingi\" is now completed.','/consultations.html',1,'2026-04-22 06:07:11'),(16,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"testingi\".','/consultations.html',1,'2026-04-22 06:07:11'),(17,5,'consultation_feedback','New consultation feedback','Jane Hairvelian left a 5-star rating.','/consultations.html?chat=1',1,'2026-04-22 06:08:00'),(18,5,'consultation_feedback','New consultation feedback','Jane Hairvelian left a 5-star rating.','/consultations.html?chat=1',1,'2026-04-22 06:17:15'),(19,5,'consultation_feedback','New consultation feedback','Jane Hairvelian left a 4-star rating.','/consultations.html?chat=1',1,'2026-04-22 06:17:24'),(20,5,'consultation_request','New consultation request','You have a new request: \"123\".','/consultations.html',1,'2026-04-22 06:17:36'),(21,6,'consultation_request','New consultation request','A user submitted \"123\".','/consultations.html',1,'2026-04-22 06:17:36'),(22,4,'consultation_status','Consultation update','Your consultation \"123\" is now awaiting payment.','/consultations.html',1,'2026-04-22 06:18:01'),(23,6,'payment_pending','Payment proof submitted','Consultation #2 needs GCash verification.','/consultations.html',1,'2026-04-22 06:18:40'),(24,4,'payment_verified','Payment confirmed','\"123\" is paid. You can message your specialist now.','/consultations.html?chat=2',1,'2026-04-22 06:19:00'),(25,5,'payment_verified','Consultation paid','\"123\" is verified paid. Session can proceed.','/consultations.html?chat=2',1,'2026-04-22 06:19:00'),(26,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"123\".','/consultations.html?chat=2',1,'2026-04-22 06:19:15'),(27,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"123\".','/consultations.html?chat=2',1,'2026-04-22 06:19:20'),(28,4,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"123\".','/consultations.html',1,'2026-04-22 06:19:43'),(29,4,'consultation_status','Consultation update','Your consultation \"123\" is now completed.','/consultations.html',1,'2026-04-22 06:20:18'),(30,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"123\".','/consultations.html',1,'2026-04-22 06:20:18'),(31,5,'consultation_feedback','New consultation feedback','Jane Hairvelian left a 5-star rating.','/consultations.html?chat=2',1,'2026-04-22 06:20:33'),(32,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:12:16'),(33,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:12:26'),(34,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:12:27'),(35,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:15:00'),(36,6,'payment_pending','Payment proof submitted','Consultation #4 needs GCash verification.','/consultations.html',1,'2026-04-22 07:18:15'),(37,4,'payment_verified','Payment confirmed','\"[DEMO] Awaiting payment consultation\" is paid. You can message your specialist now.','/consultations.html?chat=4',1,'2026-04-22 07:18:32'),(38,5,'payment_verified','Consultation paid','\"[DEMO] Awaiting payment consultation\" is verified paid. Session can proceed.','/consultations.html?chat=4',1,'2026-04-22 07:18:32'),(39,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:18:50'),(40,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:18:50'),(41,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:21:16'),(42,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:21:16'),(43,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"[DEMO] Completed consultation\".','/consultations.html?chat=3',1,'2026-04-22 07:21:16'),(44,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:21:51'),(45,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:21:57'),(46,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:23:19'),(47,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:24:53'),(48,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:25:00'),(49,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:26:13'),(50,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:26:14'),(51,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:26:42'),(52,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:26:47'),(53,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:27:42'),(54,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:31:06'),(55,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:31:06'),(56,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:31:06'),(57,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:32:56'),(58,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:35:17'),(59,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:36:43'),(60,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:37:18'),(61,4,'consultation_status','Consultation update','Your consultation \"[DEMO] Awaiting payment consultation\" is now completed.','/consultations.html',1,'2026-04-22 07:37:58'),(62,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"[DEMO] Awaiting payment consultation\".','/consultations.html',1,'2026-04-22 07:37:58'),(63,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:39:23'),(64,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:39:29'),(65,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:44:05'),(66,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:44:05'),(67,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:45:19'),(68,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:45:28'),(69,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:47:45'),(70,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"[DEMO] Awaiting payment consultation\".','/consultations.html?chat=4',1,'2026-04-22 07:47:45'),(71,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"123\".','/consultations.html?chat=2',1,'2026-04-22 07:52:49'),(72,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"123\".','/consultations.html?chat=2',1,'2026-04-22 07:52:49'),(73,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"123\".','/consultations.html?chat=2',1,'2026-04-22 07:53:03'),(74,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"123\".','/consultations.html?chat=2',1,'2026-04-22 07:53:07'),(75,5,'consultation_request','New consultation request','You have a new request: \"Dryness\".','/consultations.html',1,'2026-04-22 07:58:19'),(76,6,'consultation_request','New consultation request','A user submitted \"Dryness\".','/consultations.html',1,'2026-04-22 07:58:19'),(77,4,'consultation_status','Consultation update','Your consultation \"Dryness\" is now awaiting payment.','/consultations.html',1,'2026-04-22 07:58:34'),(78,6,'payment_pending','Payment proof submitted','Consultation #5 needs GCash verification.','/consultations.html',1,'2026-04-22 07:58:47'),(79,4,'payment_verified','Payment confirmed','\"Dryness\" is paid. You can message your specialist now.','/consultations.html?chat=5',1,'2026-04-22 07:59:06'),(80,5,'payment_verified','Consultation paid','\"Dryness\" is verified paid. Session can proceed.','/consultations.html?chat=5',1,'2026-04-22 07:59:06'),(81,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"Dryness\".','/consultations.html?chat=5',1,'2026-04-22 08:03:07'),(82,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Dryness\".','/consultations.html?chat=5',1,'2026-04-22 08:06:57'),(83,4,'consultation_status','Consultation update','Your consultation \"Dryness\" is now completed.','/consultations.html',1,'2026-04-22 08:08:35'),(84,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Dryness\".','/consultations.html',1,'2026-04-22 08:08:35'),(85,4,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Dryness\".','/consultations.html',1,'2026-04-22 08:08:46'),(86,5,'consultation_request','New consultation request','You have a new request: \"Frizz, breakage\".','/consultations.html',1,'2026-04-22 08:09:27'),(87,6,'consultation_request','New consultation request','A user submitted \"Frizz, breakage\".','/consultations.html',1,'2026-04-22 08:09:27'),(88,4,'consultation_status','Consultation update','Your consultation \"Frizz, breakage\" is now awaiting payment.','/consultations.html',1,'2026-04-22 08:09:49'),(89,6,'payment_pending','Payment proof submitted','Consultation #6 needs GCash verification.','/consultations.html',1,'2026-04-22 08:10:20'),(90,4,'payment_verified','Payment confirmed','\"Frizz, breakage\" is paid. You can message your specialist now.','/consultations.html?chat=6',1,'2026-04-22 08:10:42'),(91,5,'payment_verified','Consultation paid','\"Frizz, breakage\" is verified paid. Session can proceed.','/consultations.html?chat=6',1,'2026-04-22 08:10:42'),(92,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"Frizz, breakage\".','/consultations.html?chat=6',1,'2026-04-22 08:11:22'),(93,4,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Frizz, breakage\".','/consultations.html',1,'2026-04-22 08:11:52'),(94,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Frizz, breakage\".','/consultations.html?chat=6',1,'2026-04-22 08:12:02'),(95,4,'consultation_status','Consultation update','Your consultation \"Frizz, breakage\" is now completed.','/consultations.html',1,'2026-04-22 08:12:22'),(96,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Frizz, breakage\".','/consultations.html',1,'2026-04-22 08:12:22'),(97,5,'consultation_request','New consultation request','You have a new request: \"Breakage\".','/consultations.html',0,'2026-04-22 08:16:02'),(98,6,'consultation_request','New consultation request','A user submitted \"Breakage\".','/consultations.html',1,'2026-04-22 08:16:02'),(99,4,'consultation_status','Consultation update','Your consultation \"Breakage\" is now awaiting payment.','/consultations.html',1,'2026-04-22 08:16:13'),(100,6,'payment_pending','Payment proof submitted','Consultation #7 needs GCash verification.','/consultations.html',1,'2026-04-22 08:16:29'),(101,4,'payment_verified','Payment confirmed','\"Breakage\" is paid. You can message your specialist now.','/consultations.html?chat=7',1,'2026-04-22 08:16:37'),(102,5,'payment_verified','Consultation paid','\"Breakage\" is verified paid. Session can proceed.','/consultations.html?chat=7',0,'2026-04-22 08:16:37'),(103,4,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Breakage\".','/consultations.html',1,'2026-04-22 08:17:04'),(104,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"Frizz, breakage\".','/consultations.html?chat=6',0,'2026-04-22 08:49:31'),(105,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"Frizz, breakage\".','/consultations.html?chat=6',0,'2026-04-22 08:49:31'),(106,5,'chat_message','New message from user','Jane Hairvelian sent a message on \"Breakage\".','/consultations.html?chat=7',0,'2026-04-22 08:51:20'),(107,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"Breakage\".','/consultations.html?chat=7',1,'2026-04-22 08:51:20'),(108,4,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Breakage\".','/consultations.html?chat=7',1,'2026-04-22 08:51:21'),(109,3,'plan_change','Pro plan activated','Your Pro plan is now active.','/pricing.html',0,'2026-04-22 18:25:55'),(110,5,'consultation_request','New consultation request','You have a new request: \"Breakage\".','/consultations.html',0,'2026-04-22 18:26:54'),(111,6,'consultation_request','New consultation request','A user submitted \"Breakage\".','/consultations.html',1,'2026-04-22 18:26:54'),(112,3,'consultation_status','Consultation update','Your consultation \"Breakage\" is now awaiting payment.','/consultations.html',0,'2026-04-22 18:27:08'),(113,6,'payment_pending','Payment proof submitted','Consultation #8 needs GCash verification.','/consultations.html',1,'2026-04-22 18:27:42'),(114,3,'payment_verified','Payment confirmed','\"Breakage\" is paid. You can message your specialist now.','/consultations.html?chat=8',0,'2026-04-22 18:27:48'),(115,5,'payment_verified','Consultation paid','\"Breakage\" is verified paid. Session can proceed.','/consultations.html?chat=8',0,'2026-04-22 18:27:48'),(116,3,'consultation_status','Consultation update','Your consultation \"Breakage\" is now cancelled.','/consultations.html',0,'2026-04-22 18:27:52'),(117,5,'consultation_request','New consultation request','You have a new request: \"Frizz\".','/consultations.html',0,'2026-04-22 18:28:22'),(118,6,'consultation_request','New consultation request','A user submitted \"Frizz\".','/consultations.html',1,'2026-04-22 18:28:22'),(119,3,'consultation_status','Consultation update','Your consultation \"Frizz\" is now awaiting payment.','/consultations.html',0,'2026-04-22 18:28:36'),(120,6,'payment_pending','Payment proof submitted','Consultation #9 needs GCash verification.','/consultations.html',1,'2026-04-22 18:28:59'),(121,3,'payment_verified','Payment confirmed','\"Frizz\" is paid. You can message your specialist now.','/consultations.html?chat=9',0,'2026-04-22 18:29:05'),(122,5,'payment_verified','Consultation paid','\"Frizz\" is verified paid. Session can proceed.','/consultations.html?chat=9',0,'2026-04-22 18:29:05'),(123,5,'chat_message','New message from user','John Miguel Cabantugan sent a message on \"Frizz\".','/consultations.html?chat=9',0,'2026-04-22 18:29:25'),(124,5,'consultation_request','New consultation request','You have a new request: \"dryness, breakage\".','/consultations.html',0,'2026-04-22 18:35:37'),(125,6,'consultation_request','New consultation request','A user submitted \"dryness, breakage\".','/consultations.html',1,'2026-04-22 18:35:37'),(126,3,'consultation_status','Consultation update','Your consultation \"dryness, breakage\" is now awaiting payment.','/consultations.html',0,'2026-04-22 18:35:50'),(127,6,'payment_pending','Payment proof submitted','Consultation #10 needs GCash verification.','/consultations.html',1,'2026-04-22 18:36:14'),(128,3,'payment_verified','Payment confirmed','\"dryness, breakage\" is paid. You can message your specialist now.','/consultations.html?chat=10',0,'2026-04-22 18:37:18'),(129,5,'payment_verified','Consultation paid','\"dryness, breakage\" is verified paid. Session can proceed.','/consultations.html?chat=10',1,'2026-04-22 18:37:18'),(130,3,'consultation_status','Consultation update','Your consultation \"dryness, breakage\" is now completed.','/consultations.html',0,'2026-04-22 18:42:36'),(131,3,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"dryness, breakage\".','/consultations.html',0,'2026-04-22 18:42:36'),(132,3,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Frizz\".','/consultations.html?chat=9',0,'2026-04-22 18:43:01'),(133,3,'consultation_status','Consultation update','Your consultation \"Frizz\" is now completed.','/consultations.html',0,'2026-04-22 18:43:11'),(134,3,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Frizz\".','/consultations.html',0,'2026-04-22 18:43:11'),(135,4,'consultation_status','Consultation update','Your consultation \"Breakage\" is now completed.','/consultations.html',0,'2026-04-22 18:43:16'),(136,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Breakage\".','/consultations.html',0,'2026-04-22 18:43:16'),(137,5,'consultation_request','New consultation request','You have a new request: \"Katol katol sa o\".','/consultations.html',0,'2026-04-22 19:03:21'),(138,6,'consultation_request','New consultation request','A user submitted \"Katol katol sa o\".','/consultations.html',1,'2026-04-22 19:03:21'),(139,4,'consultation_status','Consultation update','Your consultation \"Katol katol sa o\" is now awaiting payment.','/consultations.html',0,'2026-04-22 19:03:32'),(140,6,'payment_pending','Payment proof submitted','Consultation #11 needs GCash verification.','/consultations.html',1,'2026-04-22 19:03:57'),(141,4,'payment_verified','Payment confirmed','\"Katol katol sa o\" is paid. You can message your specialist now.','/consultations.html?chat=11',0,'2026-04-22 19:04:08'),(142,5,'payment_verified','Consultation paid','\"Katol katol sa o\" is verified paid. Session can proceed.','/consultations.html?chat=11',0,'2026-04-22 19:04:08'),(143,4,'consultation_status','Consultation update','Your consultation \"Katol katol sa o\" is now completed.','/consultations.html',0,'2026-04-22 19:04:35'),(144,4,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Katol katol sa o\".','/consultations.html',0,'2026-04-22 19:04:35'),(145,12,'payment_update','Payment approved','Your payment was approved and pro_monthly is now active.','/pricing.html',1,'2026-04-22 19:45:19'),(146,13,'payment_update','Payment recorded','pro_monthly plan is now active.','/pricing.html',0,'2026-04-22 19:53:27'),(147,15,'payment_update','Payment recorded','pro_monthly plan is now active.','/pricing.html',0,'2026-04-23 16:42:05'),(148,5,'consultation_request','New consultation request','You have a new request: \"Breakage\".','/consultations.html',0,'2026-04-23 16:42:38'),(149,6,'consultation_request','New consultation request','A user submitted \"Breakage\".','/consultations.html',0,'2026-04-23 16:42:38'),(150,15,'consultation_status','Consultation update','Your consultation \"Breakage\" is now awaiting payment.','/consultations.html',0,'2026-04-23 16:43:39'),(151,6,'payment_pending','Payment proof submitted','Consultation #12 needs GCash verification.','/consultations.html',0,'2026-04-23 16:44:11'),(152,15,'payment_verified','Payment confirmed','\"Breakage\" is paid. You can message your specialist now.','/consultations.html?chat=12',0,'2026-04-23 16:44:22'),(153,5,'payment_verified','Consultation paid','\"Breakage\" is verified paid. Session can proceed.','/consultations.html?chat=12',0,'2026-04-23 16:44:22'),(154,15,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Breakage\".','/consultations.html?chat=12',0,'2026-04-23 16:45:06'),(155,5,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=12',0,'2026-04-23 16:45:09'),(156,15,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Breakage\".','/consultations.html',0,'2026-04-23 16:45:45'),(157,15,'consultation_status','Consultation update','Your consultation \"Breakage\" is now completed.','/consultations.html',0,'2026-04-23 16:47:08'),(158,15,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Breakage\".','/consultations.html',0,'2026-04-23 16:47:08'),(159,5,'consultation_feedback','New consultation feedback','free user left a 5-star rating.','/consultations.html?chat=12',0,'2026-04-23 16:47:46'),(160,5,'consultation_request','New consultation request','You have a new request: \"Breakage 111\".','/consultations.html',1,'2026-04-25 00:05:16'),(161,6,'consultation_request','New consultation request','A user submitted \"Breakage 111\".','/consultations.html',0,'2026-04-25 00:05:16'),(162,13,'consultation_status','Consultation update','Your consultation \"Breakage 111\" is now awaiting payment.','/consultations.html',0,'2026-04-25 00:06:09'),(163,6,'payment_pending','Payment proof submitted','Consultation #13 needs GCash verification.','/consultations.html',0,'2026-04-25 00:07:18'),(164,13,'payment_verified','Payment confirmed','\"Breakage 111\" is paid. You can message your specialist now.','/consultations.html?chat=13',0,'2026-04-25 00:07:49'),(165,5,'payment_verified','Consultation paid','\"Breakage 111\" is verified paid. Session can proceed.','/consultations.html?chat=13',0,'2026-04-25 00:07:49'),(166,5,'chat_message','New message from user','noime kulot sent a message on \"Breakage 111\".','/consultations.html?chat=13',0,'2026-04-25 00:09:01'),(167,13,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Breakage 111\".','/consultations.html?chat=13',0,'2026-04-25 00:09:18'),(168,5,'chat_message','New message from user','noime kulot sent a message on \"Breakage 111\".','/consultations.html?chat=13',0,'2026-04-25 00:09:56'),(169,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"Breakage 111\".','/consultations.html?chat=13',1,'2026-04-25 00:09:56'),(170,13,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Breakage 111\".','/consultations.html?chat=13',0,'2026-04-25 00:10:31'),(171,13,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Breakage 111\".','/consultations.html',0,'2026-04-25 00:12:20'),(172,13,'consultation_status','Consultation update','Your consultation \"Breakage 111\" is now completed.','/consultations.html',0,'2026-04-25 00:13:34'),(173,13,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Breakage 111\".','/consultations.html',1,'2026-04-25 00:13:34'),(174,5,'consultation_feedback','New consultation feedback','noime kulot left a 5-star rating.','/consultations.html?chat=13',0,'2026-04-25 00:14:44'),(175,5,'consultation_request','New consultation request','You have a new request: \"Another test\".','/consultations.html',0,'2026-04-25 00:15:34'),(176,6,'consultation_request','New consultation request','A user submitted \"Another test\".','/consultations.html',0,'2026-04-25 00:15:34'),(177,13,'consultation_status','Consultation update','Your consultation \"Another test\" is now awaiting payment.','/consultations.html',0,'2026-04-25 00:15:49'),(178,6,'payment_pending','Payment proof submitted','Consultation #14 needs GCash verification.','/consultations.html',0,'2026-04-25 00:16:14'),(179,13,'payment_verified','Payment confirmed','\"Another test\" is paid. You can message your specialist now.','/consultations.html?chat=14',0,'2026-04-25 00:16:23'),(180,5,'payment_verified','Consultation paid','\"Another test\" is verified paid. Session can proceed.','/consultations.html?chat=14',0,'2026-04-25 00:16:23'),(181,13,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"Another test\".','/consultations.html?chat=14',0,'2026-04-25 00:17:03'),(182,5,'chat_message','New message from user','noime kulot sent a message on \"Another test\".','/consultations.html?chat=14',1,'2026-04-25 00:17:08'),(183,13,'consultation_status','Consultation update','Your consultation \"Another test\" is now completed.','/consultations.html',0,'2026-04-25 00:21:46'),(184,13,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Another test\".','/consultations.html',0,'2026-04-25 00:21:46'),(185,5,'consultation_request','New consultation request','You have a new request: \"Eczema\".','/consultations.html',0,'2026-04-25 01:10:11'),(186,6,'consultation_request','New consultation request','A user submitted \"Eczema\".','/consultations.html',0,'2026-04-25 01:10:11'),(187,15,'consultation_status','Consultation update','Your consultation \"Eczema\" is now awaiting payment.','/consultations.html',0,'2026-04-25 01:10:38'),(188,6,'payment_pending','Payment proof submitted','Consultation #15 needs GCash verification.','/consultations.html',0,'2026-04-25 01:12:15'),(189,15,'payment_verified','Payment confirmed','\"Eczema\" is paid. You can message your specialist now.','/consultations.html?chat=15',0,'2026-04-25 01:12:36'),(190,5,'payment_verified','Consultation paid','\"Eczema\" is verified paid. Session can proceed.','/consultations.html?chat=15',0,'2026-04-25 01:12:36'),(191,15,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Eczema\".','/consultations.html',0,'2026-04-25 01:14:02'),(192,15,'consultation_status','Consultation update','Your consultation \"Eczema\" is now completed.','/consultations.html',0,'2026-04-25 01:14:41'),(193,15,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Eczema\".','/consultations.html',1,'2026-04-25 01:14:41'),(194,16,'consultation_request','New consultation request','You have a new request: \"Breakage\".','/consultations.html',1,'2026-04-25 08:49:16'),(195,6,'consultation_request','New consultation request','A user submitted \"Breakage\".','/consultations.html',0,'2026-04-25 08:49:16'),(196,15,'consultation_status','Consultation update','Your consultation \"Breakage\" is now awaiting payment.','/consultations.html',0,'2026-04-25 08:49:34'),(197,6,'payment_pending','Payment proof submitted','Consultation #16 needs GCash verification.','/consultations.html',0,'2026-04-25 08:49:50'),(198,15,'payment_verified','Payment confirmed','\"Breakage\" is paid. You can message your specialist now.','/consultations.html?chat=16',0,'2026-04-25 08:49:57'),(199,16,'payment_verified','Consultation paid','\"Breakage\" is verified paid. Session can proceed.','/consultations.html?chat=16',0,'2026-04-25 08:49:57'),(200,16,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:50:29'),(201,16,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:50:29'),(202,15,'chat_message','New message from specialist','Junjum macapagal sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:50:36'),(203,16,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:50:39'),(204,16,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:50:44'),(205,16,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:52:42'),(206,15,'chat_message','New message from specialist','Junjum macapagal sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:52:50'),(207,16,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:53:06'),(208,16,'chat_message','New message from user','free user sent a message on \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:54:10'),(209,16,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"Breakage\".','/consultations.html?chat=16',0,'2026-04-25 08:54:10'),(210,16,'consultation_meeting_request','Video call requested','free user asked for a video chat for \"Breakage\". Add a Meet or Zoom link to the consultation when ready.','/consultations.html?chat=16',0,'2026-04-25 08:57:35'),(211,16,'consultation_meeting_request','Video call requested','free user asked for a video chat for \"Breakage\". Add a Meet or Zoom link to the consultation when ready.','/consultations.html?chat=16',0,'2026-04-25 08:59:32'),(212,16,'consultation_meeting_request','Video call requested','free user asked for a video chat for \"Breakage\". Add a Meet or Zoom link to the consultation when ready.','/consultations.html?chat=16',0,'2026-04-25 08:59:36'),(213,16,'consultation_meeting_request','Video call requested','free user asked for a video chat for \"Breakage\". Add a Meet or Zoom link to the consultation when ready.','/consultations.html?chat=16',0,'2026-04-25 08:59:56'),(214,15,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Breakage\".','/consultations.html',0,'2026-04-25 09:13:23'),(215,15,'consultation_status','Consultation update','Your consultation \"Breakage\" is now completed.','/consultations.html',0,'2026-04-25 09:13:57'),(216,15,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Breakage\".','/consultations.html',0,'2026-04-25 09:13:57'),(217,16,'consultation_feedback','New consultation feedback','free user left a 5-star rating.','/consultations.html?chat=16',1,'2026-04-25 09:14:12'),(218,16,'consultation_meeting_request','Video call requested','free user asked for a video chat for \"Breakage\". Add a Meet or Zoom link to the consultation when ready.','/consultations.html?chat=16',0,'2026-04-25 09:18:29'),(219,17,'consultation_request','New consultation request','You have a new request: \"Frizz\".','/consultations.html',0,'2026-04-25 09:29:53'),(220,6,'consultation_request','New consultation request','A user submitted \"Frizz\".','/consultations.html',0,'2026-04-25 09:29:53'),(221,15,'consultation_status','Consultation update','Your consultation \"Frizz\" is now awaiting payment.','/consultations.html',0,'2026-04-25 09:30:12'),(222,6,'payment_pending','Payment proof submitted','Consultation #17 needs GCash verification.','/consultations.html',0,'2026-04-25 09:30:28'),(223,15,'payment_verified','Payment confirmed','\"Frizz\" is paid. You can message your specialist now.','/consultations.html?chat=17',0,'2026-04-25 09:30:38'),(224,17,'payment_verified','Consultation paid','\"Frizz\" is verified paid. Session can proceed.','/consultations.html?chat=17',0,'2026-04-25 09:30:38'),(225,17,'chat_message','New message from user','free user sent a message on \"Frizz\".','/consultations.html?chat=17',0,'2026-04-25 09:31:12'),(226,15,'chat_message','New message from specialist','noime kulot sent a message on \"Frizz\".','/consultations.html?chat=17',0,'2026-04-25 09:31:18'),(227,15,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"Frizz\".','/consultations.html',0,'2026-04-25 09:31:45'),(228,15,'consultation_status','Consultation update','Your consultation \"Frizz\" is now completed.','/consultations.html',0,'2026-04-25 09:32:18'),(229,15,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"Frizz\".','/consultations.html',0,'2026-04-25 09:32:18'),(230,17,'consultation_feedback','New consultation feedback','free user left a 5-star rating.','/consultations.html?chat=17',0,'2026-04-25 09:32:31'),(231,17,'payout_update','Payout request rejected','Your payout request #5 was rejected. Admin note: test','/consultations.html',0,'2026-04-25 09:44:44'),(232,6,'payout_request','New specialist payout request','noime kulot requested payout #6 for ₱499.','/admin_dashboard.html',0,'2026-04-25 09:44:52'),(233,17,'payout_update','Payout request approved','Your payout request #6 was approved. Admin note: test','/consultations.html',0,'2026-04-25 09:45:06'),(234,17,'payout_update','Payout marked as paid','Your payout request #6 was marked as paid. Admin note: payment process 1hr','/consultations.html',0,'2026-04-25 09:45:34'),(235,5,'consultation_request','New consultation request','You have a new request: \"test\".','/consultations.html',1,'2026-04-25 10:16:07'),(236,6,'consultation_request','New consultation request','A user submitted \"test\".','/consultations.html',0,'2026-04-25 10:16:07'),(237,15,'consultation_status','Consultation update','Your consultation \"test\" is now awaiting payment.','/consultations.html',0,'2026-04-25 10:16:36'),(238,6,'payment_pending','Payment proof submitted','Consultation #18 needs GCash verification.','/consultations.html',1,'2026-04-25 10:16:57'),(239,15,'payment_verified','Payment confirmed','\"test\" is paid. You can message your specialist now.','/consultations.html?chat=18',0,'2026-04-25 10:17:07'),(240,5,'payment_verified','Consultation paid','\"test\" is verified paid. Session can proceed.','/consultations.html?chat=18',0,'2026-04-25 10:17:07'),(241,18,'payment_update','Payment recorded','pro_monthly plan is now active.','/pricing.html',0,'2026-04-25 10:27:36'),(242,5,'consultation_request','New consultation request','You have a new request: \"test page\".','/consultations.html',0,'2026-04-25 10:31:01'),(243,6,'consultation_request','New consultation request','A user submitted \"test page\".','/consultations.html',0,'2026-04-25 10:31:01'),(244,18,'consultation_status','Consultation update','Your consultation \"test page\" is now awaiting payment.','/consultations.html',0,'2026-04-25 10:31:14'),(245,6,'payment_pending','Payment proof submitted','Consultation #19 needs GCash verification.','/consultations.html',1,'2026-04-25 10:31:28'),(246,18,'payment_verified','Payment confirmed','\"test page\" is paid. You can message your specialist now.','/consultations.html?chat=19',0,'2026-04-25 10:31:37'),(247,5,'payment_verified','Consultation paid','\"test page\" is verified paid. Session can proceed.','/consultations.html?chat=19',0,'2026-04-25 10:31:37'),(248,18,'consultation_update','Care prescription is ready','Your specialist added a care prescription for \"test page\".','/consultations.html',0,'2026-04-25 10:33:27'),(249,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 10:33:31'),(250,18,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"test page\".','/consultations.html?chat=19',1,'2026-04-25 10:33:35'),(251,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 10:35:48'),(252,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"test page\".','/consultations.html?chat=19',1,'2026-04-25 10:35:48'),(253,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 10:36:01'),(254,18,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 10:36:06'),(255,18,'consultation_status','Consultation update','Your consultation \"test page\" is now completed.','/consultations.html',0,'2026-04-25 10:36:17'),(256,18,'consultation_update','Specialist updated your consultation','New specialist notes were added to \"test page\".','/consultations.html',1,'2026-04-25 10:36:17'),(257,5,'consultation_feedback','New consultation feedback','petpet gwapo left a 5-star rating.','/consultations.html?chat=19',1,'2026-04-25 10:36:51'),(258,18,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"test page\".','/consultations.html?chat=19',1,'2026-04-25 12:32:59'),(259,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 12:33:11'),(260,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 12:33:11'),(261,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 12:33:41'),(262,5,'assistant_handoff','AI handoff while offline','New user concern summary is ready for \"test page\".','/consultations.html?chat=19',1,'2026-04-25 12:33:41'),(263,5,'chat_message','New message from user','petpet gwapo sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 12:34:25'),(264,18,'chat_message','New message from specialist','Specialist Hairvelous sent a message on \"test page\".','/consultations.html?chat=19',0,'2026-04-25 12:34:34');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_transactions` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `method` enum('gcash','card') NOT NULL DEFAULT 'gcash',
  `amount_php` decimal(10,2) NOT NULL DEFAULT 0.00,
  `gcash_name` varchar(150) DEFAULT NULL,
  `gcash_number` varchar(30) DEFAULT NULL,
  `gcash_reference` varchar(100) DEFAULT NULL,
  `card_name` varchar(150) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `card_reference` varchar(100) DEFAULT NULL,
  `receipt_path` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_user` (`user_id`),
  KEY `fk_payment_plan` (`plan_id`),
  KEY `fk_payment_reviewer` (`reviewed_by`),
  CONSTRAINT `fk_payment_plan` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`plan_id`),
  CONSTRAINT `fk_payment_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
INSERT INTO `payment_transactions` VALUES (1,12,2,'gcash',199.00,'john miguel','09123456789','123123123123',NULL,NULL,NULL,'uploads/hair-12-e1a8dd98-5c1f-48f5-84c1-f6f1965037c4.jpg','approved','yes',6,'2026-04-23 03:45:19','2026-04-22 19:44:57'),(2,13,2,'gcash',199.00,'john miguel','09123456789','123123123123',NULL,NULL,NULL,'uploads/hair-13-36d4fd5e-b98e-4a49-841c-7814ad4c5f9e.jpeg','approved',NULL,NULL,'2026-04-23 03:53:27','2026-04-22 19:53:27'),(3,15,2,'gcash',199.00,'john miguel','09123456789','123123123123',NULL,NULL,NULL,'uploads/hair-15-cf939262-9234-4e54-ae6a-874449ffd77d.jpeg','approved',NULL,NULL,'2026-04-24 00:42:05','2026-04-23 16:42:05'),(4,18,2,'gcash',199.00,'john miguel','09123456789','123123123123',NULL,NULL,NULL,'uploads/hair-18-aad35d4a-a07d-4fb1-9efa-46d14679ea85.jpeg','approved',NULL,NULL,'2026-04-25 18:27:36','2026-04-25 10:27:36');
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_category_name` (`category_name`),
  CONSTRAINT `fk_cat_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=831 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (814,72,'anti-dandruff'),(815,73,'moisturizing'),(816,74,'anti-frizz'),(817,75,'moisturizing'),(818,76,'moisturizing'),(819,77,'anti-frizz'),(820,77,'moisturizing'),(821,62,'anti-frizz'),(822,63,'anti-frizz'),(823,66,'anti-frizz'),(824,66,'moisturizing'),(825,78,'moisturizing'),(826,78,'anti-frizz'),(827,79,'moisturizing'),(828,79,'anti-frizz'),(829,69,'moisturizing'),(830,69,'anti-frizz');
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `expiry_type` enum('not_applicable','date','period_after_opening') NOT NULL DEFAULT 'not_applicable',
  `expiry_date` date DEFAULT NULL,
  `expiry_period_months` int(11) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `idx_name` (`name`),
  KEY `idx_brand` (`brand`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (62,'Cuticle Coat Serum','Vitress','Watsons PH serum for shine, anti-frizz, and smoother finish.','https://medias.watsons.com.ph/publishing/50028690-lUDnp5ON-X0aLMc9l-zoom.png?version=1775577641',129.00,'not_applicable',NULL,NULL),(63,'Keratin 10-in-1 Hair Elixir','Luxe Organix','Watsons PH leave-on elixir for anti-frizz and smoothness support.','https://medias.watsons.com.ph/publishing/LOKeratinHairElixir_50003381_%20%281%29-dMOcRupV-zoom.jpg?version=1746694409',349.00,'not_applicable',NULL,NULL),(66,'Perfect Repair Serum','Mise-en-scene','Watsons PH repair serum for smoother lengths and reduced frizz look.','https://medias.watsons.com.ph/publishing/50040255-SBSImqWI-zoom.png?version=1762676996',599.00,'not_applicable',NULL,NULL),(69,'Premium Touch Hair Mask','Fino','Watsons PH rich conditioning mask for dry-looking and rough hair.','https://medias.watsons.com.ph/publishing/FINO_IMAGE%201_50052641-C2N2qZXG-CeA6PWiB-zoom.png?version=1775577609',699.00,'not_applicable',NULL,NULL),(72,'Cool Menthol Anti-Dandruff Shampoo','Head & Shoulders','Watsons PH anti-dandruff shampoo for visible flakes and scalp freshness.','https://medias.watsons.com.ph/publishing/H%26S_Image1_10091511-jLYyxRaL-zoom.png?version=1763258338',329.00,'not_applicable',NULL,NULL),(73,'Intense Repair Shampoo','Dove','Watsons PH shampoo option for rough and damaged-looking hair.','https://medias.watsons.com.ph/publishing/WTCPH-50055811-front-zoom.jpg?version=1762541407',229.00,'not_applicable',NULL,NULL),(74,'Keratin Smooth Shampoo','TRESemmé','Watsons PH smoothing shampoo for frizz-prone hair.','https://medias.watsons.com.ph/publishing/WTCPH-10097965-front-zoom.jpg?version=1734001427',289.00,'not_applicable',NULL,NULL),(75,'Triple Keratin Rescue Ultimate Repair Conditioner','Cream Silk','Watsons PH conditioner for dry and damaged-looking hair.','https://medias.watsons.com.ph/publishing/WTCPH-50020843-front-zoom.jpg?version=1734084128',199.00,'not_applicable',NULL,NULL),(76,'Hairfall Defense Conditioner','Dove','Watsons PH conditioner for breakage-prone and weak hair strands.','https://medias.watsons.com.ph/publishing/1-gMPZJLae-zoom.jpg?version=1758702040',229.00,'not_applicable',NULL,NULL),(77,'Keratin Smooth Conditioner','TRESemmé','Watsons PH smoothing conditioner for frizz-prone hair.','https://medias.watsons.com.ph/publishing/WTCPH-10097969-front-zoom.jpg?version=1734044690',289.00,'not_applicable',NULL,NULL),(78,'Keratin Treatment Hair Mask','Luxe Organix','Watsons PH keratin treatment mask for dry and frizz-prone hair.','https://medias.watsons.com.ph/publishing/LO_PremiumKeratintreatmentAloeVera_50019775%20%20%281%29-wkra9j9E-zoom.jpg?version=1746695153',399.00,'not_applicable',NULL,NULL),(79,'Keratin Smooth Treatment Mask','TRESemmé','Watsons PH smoothing treatment mask for rough and frizz-prone lengths.','https://medias.watsons.com.ph/publishing/WTCPH-50054912-front-zoom.jpg?version=1763052610',379.00,'not_applicable',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recommendations` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `reason` text DEFAULT NULL,
  `date_recommended` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_date_recommended` (`date_recommended`),
  CONSTRAINT `fk_rec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rec_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1509 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
INSERT INTO `recommendations` VALUES (1277,3,66,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1278,3,69,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1279,3,73,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1280,3,75,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1281,3,76,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1282,3,77,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1283,3,78,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1284,3,79,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-22 18:32:47'),(1309,4,66,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1310,4,69,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1311,4,73,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1312,4,75,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1313,4,76,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1314,4,77,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1315,4,78,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1316,4,79,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-23 16:38:08'),(1397,13,66,'Addresses: Breakage or split ends. Category: anti-frizz, moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1398,13,69,'Addresses: Breakage or split ends. Category: anti-frizz, moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1399,13,73,'Addresses: Breakage or split ends. Category: moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1400,13,75,'Addresses: Breakage or split ends. Category: moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1401,13,76,'Addresses: Breakage or split ends. Category: moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1402,13,77,'Addresses: Breakage or split ends. Category: anti-frizz, moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1403,13,78,'Addresses: Breakage or split ends. Category: anti-frizz, moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1404,13,79,'Addresses: Breakage or split ends. Category: anti-frizz, moisturizing. Suitable for coily hair. For eczema scalp','2026-04-25 00:00:13'),(1413,15,66,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1414,15,69,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1415,15,73,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1416,15,75,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1417,15,76,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1418,15,77,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1419,15,78,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1420,15,79,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 01:04:19'),(1501,18,66,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1502,18,69,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1503,18,73,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1504,18,75,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1505,18,76,'Addresses: Dryness. Category: moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1506,18,77,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1507,18,78,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10'),(1508,18,79,'Addresses: Dryness. Category: anti-frizz, moisturizing. Suitable for straight hair. For normal scalp','2026-04-25 12:32:10');
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`),
  KEY `idx_role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (3,'admin'),(2,'specialist'),(1,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routine_logs`
--

DROP TABLE IF EXISTS `routine_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routine_logs` (
  `routine_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `date_logged` date NOT NULL,
  `media_path` varchar(500) DEFAULT NULL,
  `media_type` enum('image','video') DEFAULT NULL,
  PRIMARY KEY (`routine_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date_logged` (`date_logged`),
  KEY `idx_activity_type` (`activity_type`),
  CONSTRAINT `fk_routine_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine_logs`
--

LOCK TABLES `routine_logs` WRITE;
/*!40000 ALTER TABLE `routine_logs` DISABLE KEYS */;
INSERT INTO `routine_logs` VALUES (1,4,'test','test [Hair feel: worse]','2026-04-22',NULL,NULL),(2,4,'test','test [Hair feel: stable]','2026-04-23',NULL,NULL),(3,4,'test','test [Hair feel: improving]','2026-04-24','uploads/hair-4-f2949ffb-bea3-447f-bd81-8ef6732f2db0.jpg','image'),(4,4,'wash day','test [Hair feel: improving]','2026-04-27',NULL,NULL),(5,15,'wash day','test [Hair feel: worse]','2026-04-24',NULL,NULL),(6,15,'hair oil','test [Hair feel: stable]','2026-04-25',NULL,NULL),(7,15,'mask','test [Hair feel: improving]','2026-04-26',NULL,NULL),(8,15,'hair oil','test [Hair feel: improving]','2026-05-01','uploads/hair-15-5a2ecdb8-4ea0-4fe3-8315-137a85d723e7.mp4','video'),(9,13,'wash day','[Hair feel: worse]','2026-04-25','uploads/hair-13-cb4b4abc-4cfe-4e75-8c61-6eaeb58d5b4b.mp4','video'),(10,13,'wash day','[Hair feel: stable]','2026-04-26','uploads/hair-13-948c0c30-68de-4d3d-beaf-c7b9099e7768.jpg','image'),(11,13,'mask','[Hair feel: improving]','2026-04-27',NULL,NULL),(12,18,'wash day','[Hair feel: worse]','2026-04-25',NULL,NULL),(13,18,'conditioner',NULL,'2026-04-26',NULL,NULL),(14,18,'hair oil','[Hair feel: improving]','2026-04-27','uploads/hair-18-5c014725-941a-4e9c-9b54-adac8bd57c27.png','image');
/*!40000 ALTER TABLE `routine_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialist_earnings_ledger`
--

DROP TABLE IF EXISTS `specialist_earnings_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `specialist_earnings_ledger` (
  `earning_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation_id` int(11) NOT NULL,
  `specialist_user_id` int(11) NOT NULL,
  `gross_amount_php` decimal(10,2) NOT NULL,
  `commission_percent` decimal(5,2) NOT NULL,
  `commission_amount_php` decimal(10,2) NOT NULL,
  `net_amount_php` decimal(10,2) NOT NULL,
  `status` enum('released','in_payout','paid_out') NOT NULL DEFAULT 'released',
  `released_at` datetime NOT NULL,
  `payout_request_id` int(11) DEFAULT NULL,
  `payout_paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`earning_id`),
  UNIQUE KEY `uq_earnings_consult` (`consultation_id`),
  KEY `idx_earnings_specialist_status` (`specialist_user_id`,`status`,`released_at`),
  KEY `fk_earnings_payout_request` (`payout_request_id`),
  CONSTRAINT `fk_earnings_consult` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_earnings_payout_request` FOREIGN KEY (`payout_request_id`) REFERENCES `specialist_payout_requests` (`payout_request_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_earnings_specialist` FOREIGN KEY (`specialist_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialist_earnings_ledger`
--

LOCK TABLES `specialist_earnings_ledger` WRITE;
/*!40000 ALTER TABLE `specialist_earnings_ledger` DISABLE KEYS */;
INSERT INTO `specialist_earnings_ledger` VALUES (1,1,5,548.90,10.00,49.90,499.00,'paid_out','2026-04-22 14:07:11',1,'2026-04-23 02:54:05','2026-04-22 06:07:11'),(2,2,5,880.00,10.00,80.00,800.00,'paid_out','2026-04-22 14:20:18',1,'2026-04-23 02:54:05','2026-04-22 06:20:18'),(3,4,5,990.00,10.00,90.00,900.00,'paid_out','2026-04-22 15:37:58',1,'2026-04-23 02:54:05','2026-04-22 07:37:58'),(4,5,5,990.00,10.00,90.00,900.00,'paid_out','2026-04-22 16:08:35',1,'2026-04-23 02:54:05','2026-04-22 08:08:35'),(5,6,5,990.00,10.00,90.00,900.00,'paid_out','2026-04-22 16:12:22',1,'2026-04-23 02:54:05','2026-04-22 08:12:22'),(6,10,5,990.00,10.00,90.00,900.00,'paid_out','2026-04-23 02:42:36',1,'2026-04-23 02:54:05','2026-04-22 18:42:36'),(7,9,5,990.00,10.00,90.00,900.00,'paid_out','2026-04-23 02:43:11',1,'2026-04-23 02:54:05','2026-04-22 18:43:11'),(8,7,5,990.00,10.00,90.00,900.00,'paid_out','2026-04-23 02:43:16',1,'2026-04-23 02:54:05','2026-04-22 18:43:16'),(9,11,5,990.00,10.00,90.00,900.00,'released','2026-04-23 03:04:35',NULL,NULL,'2026-04-22 19:04:35'),(10,12,5,990.00,10.00,90.00,900.00,'released','2026-04-24 00:47:08',NULL,NULL,'2026-04-23 16:47:08'),(11,13,5,990.00,10.00,90.00,900.00,'released','2026-04-25 08:13:34',NULL,NULL,'2026-04-25 00:13:34'),(12,14,5,990.00,10.00,90.00,900.00,'released','2026-04-25 08:21:46',NULL,NULL,'2026-04-25 00:21:46'),(13,15,5,990.00,10.00,90.00,900.00,'released','2026-04-25 09:14:41',NULL,NULL,'2026-04-25 01:14:41'),(14,16,16,880.00,10.00,80.00,800.00,'paid_out','2026-04-25 17:13:57',2,'2026-04-25 17:15:50','2026-04-25 09:13:57'),(15,17,17,548.90,10.00,49.90,499.00,'paid_out','2026-04-25 17:32:18',6,'2026-04-25 17:45:34','2026-04-25 09:32:18'),(16,19,5,990.00,10.00,90.00,900.00,'released','2026-04-25 18:36:17',NULL,NULL,'2026-04-25 10:36:17');
/*!40000 ALTER TABLE `specialist_earnings_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialist_payout_requests`
--

DROP TABLE IF EXISTS `specialist_payout_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `specialist_payout_requests` (
  `payout_request_id` int(11) NOT NULL AUTO_INCREMENT,
  `specialist_user_id` int(11) NOT NULL,
  `period_start` datetime NOT NULL,
  `period_end` datetime NOT NULL,
  `gross_amount_php` decimal(10,2) NOT NULL,
  `commission_amount_php` decimal(10,2) NOT NULL,
  `net_amount_php` decimal(10,2) NOT NULL,
  `item_count` int(11) NOT NULL DEFAULT 0,
  `status` enum('requested','approved','paid','rejected') NOT NULL DEFAULT 'requested',
  `requested_at` datetime NOT NULL,
  `processed_at` datetime DEFAULT NULL,
  `processed_by_user_id` int(11) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`payout_request_id`),
  KEY `idx_payout_specialist_requested` (`specialist_user_id`,`requested_at`),
  KEY `fk_payout_processor` (`processed_by_user_id`),
  CONSTRAINT `fk_payout_processor` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payout_specialist` FOREIGN KEY (`specialist_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialist_payout_requests`
--

LOCK TABLES `specialist_payout_requests` WRITE;
/*!40000 ALTER TABLE `specialist_payout_requests` DISABLE KEYS */;
INSERT INTO `specialist_payout_requests` VALUES (1,5,'2026-04-22 14:07:11','2026-04-23 02:43:16',7368.90,669.90,6699.00,8,'paid','2026-04-23 02:43:29','2026-04-23 02:54:05',6,'paid','2026-04-22 18:43:29'),(2,16,'2026-04-25 17:13:57','2026-04-25 17:13:57',880.00,80.00,800.00,1,'paid','2026-04-25 17:14:44','2026-04-25 17:15:50',6,NULL,'2026-04-25 09:14:44'),(3,17,'2026-04-25 17:32:18','2026-04-25 17:32:18',548.90,49.90,499.00,1,'rejected','2026-04-25 17:32:59','2026-04-25 17:33:44',6,'not time yet','2026-04-25 09:32:59'),(4,17,'2026-04-25 17:32:18','2026-04-25 17:32:18',548.90,49.90,499.00,1,'rejected','2026-04-25 17:41:20','2026-04-25 17:41:38',6,'test','2026-04-25 09:41:20'),(5,17,'2026-04-25 17:32:18','2026-04-25 17:32:18',548.90,49.90,499.00,1,'rejected','2026-04-25 17:44:13','2026-04-25 17:44:44',6,'test','2026-04-25 09:44:13'),(6,17,'2026-04-25 17:32:18','2026-04-25 17:32:18',548.90,49.90,499.00,1,'paid','2026-04-25 17:44:52','2026-04-25 17:45:34',6,'payment process 1hr','2026-04-25 09:44:52');
/*!40000 ALTER TABLE `specialist_payout_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialist_presence`
--

DROP TABLE IF EXISTS `specialist_presence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `specialist_presence` (
  `specialist_user_id` int(11) NOT NULL,
  `last_seen_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`specialist_user_id`),
  CONSTRAINT `fk_specialist_presence_user` FOREIGN KEY (`specialist_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialist_presence`
--

LOCK TABLES `specialist_presence` WRITE;
/*!40000 ALTER TABLE `specialist_presence` DISABLE KEYS */;
INSERT INTO `specialist_presence` VALUES (5,'2026-04-25 22:14:24','2026-04-25 14:14:24'),(16,'2026-04-25 17:29:15','2026-04-25 09:29:15'),(17,'2026-04-25 18:05:55','2026-04-25 10:05:55');
/*!40000 ALTER TABLE `specialist_presence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_plans` (
  `plan_id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_code` varchar(50) NOT NULL,
  `name` varchar(120) NOT NULL,
  `price_php` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_days` int(11) NOT NULL DEFAULT 30,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `plan_code` (`plan_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
INSERT INTO `subscription_plans` VALUES (1,'free','Free',0.00,3650,1,'2026-04-22 05:51:29'),(2,'pro_monthly','Pro Monthly',199.00,30,1,'2026-04-22 05:51:29');
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_credential_documents`
--

DROP TABLE IF EXISTS `user_credential_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_credential_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_cred_doc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_credential_documents`
--

LOCK TABLES `user_credential_documents` WRITE;
/*!40000 ALTER TABLE `user_credential_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_credential_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_profiles` (
  `user_id` int(11) NOT NULL,
  `profile_photo_path` varchar(500) DEFAULT NULL,
  `specialty` varchar(200) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `consultation_rate` decimal(10,2) DEFAULT NULL,
  `sex` varchar(32) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `race` varchar(120) DEFAULT NULL,
  `expertise_json` text DEFAULT NULL COMMENT 'JSON array of strings',
  `skills_json` text DEFAULT NULL COMMENT 'JSON array of strings',
  `education_json` text DEFAULT NULL COMMENT 'JSON array of {institution, degree, year} or strings',
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_verification_status` varchar(24) DEFAULT 'not_submitted',
  `id_verification_note` varchar(255) DEFAULT NULL,
  `share_routine_with_specialist` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 05:42:08','not_submitted',NULL,0),(2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 05:43:59','not_submitted',NULL,0),(3,'uploads/profiles/profile-3-525afcb8-f95e-4013-8402-e1bb9cb51998.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 18:26:33','not_submitted',NULL,1),(4,'uploads/profiles/profile-4-0a14fba4-a712-4c4f-af21-8c1d508db364.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 18:11:09','not_submitted',NULL,1),(5,'uploads/profiles/profile-5-2474d3cb-974a-40f1-8116-1cf7fb89e163.png','Hair & scalp care','Philippines',900.00,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 18:29:44','not_submitted',NULL,0),(7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 06:11:26','not_submitted',NULL,0),(8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22 06:11:47','not_submitted',NULL,0),(13,NULL,NULL,NULL,NULL,'female','2026-04-10','Asian',NULL,NULL,NULL,'2026-04-22 19:53:06','not_submitted',NULL,0),(14,NULL,NULL,NULL,NULL,'female','2026-04-15','Asian',NULL,NULL,NULL,'2026-04-22 22:34:06','not_submitted',NULL,0),(15,NULL,NULL,NULL,NULL,'male','2026-04-15','Asian',NULL,NULL,NULL,'2026-04-23 16:40:04','not_submitted',NULL,0),(16,NULL,NULL,NULL,800.00,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-25 08:48:51','not_submitted',NULL,0),(18,NULL,NULL,NULL,NULL,'male','2026-04-09','Asian',NULL,NULL,NULL,'2026-04-25 10:25:57','not_submitted',NULL,0);
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subscriptions`
--

DROP TABLE IF EXISTS `user_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_subscriptions` (
  `subscription_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`subscription_id`),
  KEY `fk_sub_user` (`user_id`),
  KEY `fk_sub_plan` (`plan_id`),
  CONSTRAINT `fk_sub_plan` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`plan_id`),
  CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscriptions`
--

LOCK TABLES `user_subscriptions` WRITE;
/*!40000 ALTER TABLE `user_subscriptions` DISABLE KEYS */;
INSERT INTO `user_subscriptions` VALUES (1,4,2,'active','2026-04-22 13:55:25','2026-05-22 13:55:25','2026-04-22 05:55:25'),(2,3,2,'active','2026-04-23 02:25:55','2026-05-23 02:25:55','2026-04-22 18:25:55'),(3,12,2,'active','2026-04-23 03:45:19','2026-05-23 03:45:19','2026-04-22 19:45:19'),(4,13,2,'active','2026-04-23 03:53:27','2026-05-23 03:53:27','2026-04-22 19:53:27'),(5,15,2,'active','2026-04-24 00:42:05','2026-05-24 00:42:05','2026-04-23 16:42:05'),(6,18,2,'active','2026-04-25 18:27:36','2026-05-25 18:27:36','2026-04-25 10:27:36');
/*!40000 ALTER TABLE `user_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `auth_provider` enum('local','google') NOT NULL DEFAULT 'local',
  `google_sub` varchar(64) DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `role_id` int(11) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_suspended` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_email` (`email`),
  UNIQUE KEY `google_sub` (`google_sub`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_reset_token` (`reset_token`),
  KEY `idx_google_sub` (`google_sub`),
  KEY `idx_auth_provider` (`auth_provider`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Demo User','demo_f84c6723@test.local','$2a$10$UY8y70LpDSMStLY1TRaFXOykmGxXtRdLtT43VXcZmFpYDp9cL0Qlu','local',NULL,1,1,NULL,NULL,'2026-04-22 05:42:08',0),(2,'Demo User','demo_8195f4c9@test.local','$2a$10$auVkkdG/K0YBvzYQPON34.pY/l5C6e8w/Mn.6z24y5eaw.a3yiZTi','local',NULL,1,1,NULL,NULL,'2026-04-22 05:43:59',0),(3,'John Miguel Cabantugan','cabantuganmiguel@gmail.com','$2a$10$JeywfLWO1Dwx2pFJOuaMJ.sYQ4VQDC87l4r.ah.6o00rNl1tyOdvq','google','PUtKamXzxUQbbI8kXsJm0hss9rZ2',1,1,NULL,NULL,'2026-04-22 05:45:45',0),(4,'Jane Hairvelian','hairvelian@example.com','$2a$10$uKqdVuIkLfBd15a81hr3NuqIjX9ABJ0V8yzUGtiD1zKhcDkwccBti','local',NULL,0,1,NULL,NULL,'2026-04-22 05:54:29',0),(5,'Specialist Hairvelous','specialist@hairvelous.com','$2a$10$CWMFpwPwH3t2/bvETk.NueZUDBUI8tv56DCZf01yLW4kcR4KocguK','local',NULL,0,2,NULL,NULL,'2026-04-22 05:54:29',0),(6,'Admin Hairvelous','admin@hairvelous.com','$2a$10$8F3l4rrKq63.ZgtGU1KzfO9AYjHlmBIKmPTutUMxnh0ltj4R1Bfma','local',NULL,0,3,NULL,NULL,'2026-04-22 05:54:29',0),(7,'Check User','chk_ca193637@test.local','$2a$10$YlR/HZow9jGT/z.6MHBRxOmg74qkH6cQf317b5lCCsOYuyM6vunVG','local',NULL,1,1,NULL,NULL,'2026-04-22 06:11:26',0),(8,'Check User2','chk_e62bedbe@test.local','$2a$10$M0BnOO0lU.63spUkD1Nu8O2OolHKBYTbgqc9Eih92gRQP8aeyhrd2','local',NULL,1,1,NULL,NULL,'2026-04-22 06:11:47',0),(12,'full pets','petsisonfire@gmail.com','$2a$10$KdHC0bmLLQsqvmwpgkn6T.FAiaG1eaaUaaMGjNqpI7nsweN2rilS6','google','BSBzjeTeSbck56W7sqiMCF9ZMrG2',1,1,NULL,NULL,'2026-04-22 19:44:14',0),(13,'noime kulot','noime@example.com','$2a$10$VyRBuLxXlr9LO9zEz9EstuDOo4EToV3WoVE9njAgHN.gDRStU5Amy','local',NULL,1,1,NULL,NULL,'2026-04-22 19:53:06',0),(14,'melyn cabs','melyn@example.com','$2a$10$/PrUXFfz1hxNAgGbnVWkguAvt7/JTWLt2YZDgV/XUJv9Ctsge7gwu','local',NULL,1,1,NULL,NULL,'2026-04-22 22:34:06',0),(15,'free user','free_user@example.com','$2a$10$8Gn2tQtLCS816lIs4//dNed3uaCXbMm./tH3cAlXBDcRNvhX1A7Wq','local',NULL,1,1,NULL,NULL,'2026-04-23 16:40:04',0),(16,'Junjum macapagal','junjum@specialist.com','$2a$10$NvNuC46jtnQnvBgr6qqIyuwPFLExzK3zCoPS2KgJB67HIhsOKnwfe','local',NULL,0,2,NULL,NULL,'2026-04-25 08:48:18',0),(17,'noime kulot','noime@specialist.com','$2a$10$AdXlksXgUggLT2JYQ7O46uFV/3/4GviniuOi/G03/VNxYK/AMQu/W','local',NULL,0,2,NULL,NULL,'2026-04-25 09:29:17',0),(18,'petpet gwapo','gwapopets@example.com','$2a$10$QqC6Kjcgs8jQaSDKSNYrCO6D.CzN0ez35nET21zaQc03J40rMe4ey','local',NULL,1,1,NULL,NULL,'2026-04-25 10:25:57',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25 23:58:57
