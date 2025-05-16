BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Feedback" (
	"userID"	INTEGER,
	"rating"	INTEGER,
	"review"	TEXT,
	"airline"	TEXT,
	"airlineID"	INTEGER,
	PRIMARY KEY("userID","airline","airlineID"),
	FOREIGN KEY("airline") REFERENCES "Flights"("Airline"),
	FOREIGN KEY("airlineID") REFERENCES "Flights"("AirlineID"),
	FOREIGN KEY("userID") REFERENCES "client"("id")
);
CREATE TABLE IF NOT EXISTS "Flights" (
	"FlightID"	TEXT,
	"Airline"	TEXT,
	"DepartureTime"	DATETIME,
	"ArrivalTime"	DATETIME,
	"ArrivalAirportID"	INT,
	"ArrivalAirport"	TEXT,
	"AirlineID"	INTEGER,
	"TicketPrice"	DECIMAL(10, 2),
	"DepartureDate"	DATE,
	"ArrivalDate"	DATE,
	"ecofriendly"	BOOLEAN,
	"AvailableTickets"	INTEGER,
	PRIMARY KEY("FlightID","ArrivalAirportID","Airline","AirlineID"),
	FOREIGN KEY("ArrivalAirportID") REFERENCES "destinations"("id")
);
CREATE TABLE IF NOT EXISTS "Transactions" (
	"userID"	TEXT,
	"transactionID"	INTEGER,
	"flightID"	INTEGER,
	"userName"	TEXT,
	"transactionStatus"	TEXT,
	FOREIGN KEY("flightID") REFERENCES "Flights"("FlightID"),
	FOREIGN KEY("userID") REFERENCES "client"("id")
);
CREATE TABLE IF NOT EXISTS "client" (
	"id"	INTEGER,
	"password"	TEXT,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"phone_number"	TEXT,
	"email"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "destinations" (
	"id"	INTEGER,
	"name"	TEXT,
	"city"	TEXT,
	"country"	TEXT,
	PRIMARY KEY("id")
);
INSERT INTO "Flights" VALUES ('LA104','American Airlines','08:00:00','12:00:00',3,'Los Angeles International Airport',7,150,'2024-12-02','2024-12-02',0,4);
INSERT INTO "Flights" VALUES ('CD456','Air France','09:30:00','13:45:00',2,'Charles de Gaulle Airport

',4,1650,'2024-12-03','2024-12-03',0,154);
INSERT INTO "Flights" VALUES ('DX304','Emirates','14:00:00','20:30:00',3,'Dubai International Airport',14,1050,'2024-12-04','2024-12-04',0,1);
INSERT INTO "Flights" VALUES ('LA101','Delta Airlines','06:00:00','09:30:00',1,'Los Angeles International Airport',12,350,'2024-12-02','2024-12-02',1,250);
INSERT INTO "Flights" VALUES ('LA102','American Airlines','10:15:00','13:45:00',1,'Los Angeles International Airport',7,400,'2024-12-02','2024-12-02',0,32);
INSERT INTO "Flights" VALUES ('LA103','United Airlines','14:00:00','17:30:00',1,'Los Angeles International Airport',30,370,'2024-12-02','2024-12-02',0,105);
INSERT INTO "Flights" VALUES ('CDG201','Air France','07:00:00','11:15:00',2,'Charles de Gaulle Airport',4,500,'2024-12-03','2024-12-03',0,75);
INSERT INTO "Flights" VALUES ('CDG202','British Airways','12:00:00','16:30:00',2,'Charles de Gaulle Airport',9,520,'2024-12-03','2024-12-03',1,84);
INSERT INTO "Flights" VALUES ('CDG203','Lufthansa','18:00:00','22:30:00',2,'Charles de Gaulle Airport',23,550,'2024-12-03','2024-12-03',0,23);
INSERT INTO "Flights" VALUES ('DXB301','Emirates','08:00:00','14:00:00',3,'Dubai International Airport',14,800,'2024-12-04','2024-12-04',0,183);
INSERT INTO "Flights" VALUES ('DXB302','Qatar Airways','15:00:00','21:00:00',3,'Dubai International Airport',25,780,'2024-12-04','2024-12-04',1,3);
INSERT INTO "Flights" VALUES ('DXB303','Etihad Airways','22:00:00','04:00:00',3,'Dubai International Airport',15,810,'2024-12-04','2024-12-05',0,90);
INSERT INTO "Flights" VALUES ('SYD401','Qantas','09:00:00','17:00:00',4,'Sydney Kingsford Smith Airport',24,900,'2024-12-05','2024-12-05',0,34);
INSERT INTO "Flights" VALUES ('SYD402','Virgin Australia','18:30:00','02:30:00',4,'Sydney Kingsford Smith Airport',31,950,'2024-12-05','2024-12-06',1,201);
INSERT INTO "Flights" VALUES ('SYD403','Jetstar Airways','03:00:00','11:00:00',4,'Sydney Kingsford Smith Airport',21,890,'2024-12-06','2024-12-06',0,299);
INSERT INTO "Flights" VALUES ('MEX601','Aeromexico','06:00:00','10:30:00',7,'Mexico City International Airport','',350,'2024-12-07','2024-12-07',1,99);
INSERT INTO "Flights" VALUES ('MEX602','Volaris','12:00:00','16:30:00',7,'Mexico City International Airport',32,300,'2024-12-07','2024-12-07',0,26);
INSERT INTO "Flights" VALUES ('MEX603','Interjet','18:00:00','22:30:00',7,'Mexico City International Airport',18,320,'2024-12-07','2024-12-07',0,113);
INSERT INTO "Flights" VALUES ('JFK501','Delta Airlines','07:00:00','11:30:00',5,'John F. Kennedy International Airport',12,450,'2024-12-06','2024-12-06',1,15);
INSERT INTO "Flights" VALUES ('JFK502','American Airlines','13:00:00','17:30:00',5,'John F. Kennedy International Airport',7,460,'2024-12-06','2024-12-06',0,7);
INSERT INTO "Flights" VALUES ('JFK503','JetBlue','19:00:00','23:30:00',5,'John F. Kennedy International Airport',20,420,'2024-12-06','2024-12-06',0,43);
INSERT INTO "Flights" VALUES ('LHR701','British Airways','09:00:00','13:00:00',8,'Heathrow Airport',9,550,'2024-12-08','2024-12-08',1,135);
INSERT INTO "Flights" VALUES ('LHR702','Virgin Atlantic','14:30:00','18:30:00',8,'Heathrow Airport',30,560,'2024-12-08','2024-12-08',1,227);
INSERT INTO "Flights" VALUES ('LHR703','EasyJet','20:00:00','00:00:00',8,'Heathrow Airport',13,510,'2024-12-08','2024-12-09',0,300);
INSERT INTO "Flights" VALUES ('DBV801','Croatia Airlines','07:30:00','11:00:00',9,'Dubrovnik Airport',11,320,'2024-12-09','2024-12-09',1,20);
INSERT INTO "Flights" VALUES ('DBV802','Lufthansa','12:00:00','15:30:00',9,'Dubrovnik Airport',23,340,'2024-12-09','2024-12-09',0,1);
INSERT INTO "Flights" VALUES ('DBV803','Ryanair','18:00:00','21:30:00',9,'Dubrovnik Airport',26,300,'2024-12-09','2024-12-09',0,5);
INSERT INTO "Flights" VALUES ('YUL901','Air Canada','06:30:00','11:00:00',10,'Montreal-Trudeau International Airport',2,400,'2024-12-10','2024-12-10',0,73);
INSERT INTO "Flights" VALUES ('YUL902','Westjet','12:30:00','17:00:00',10,'Montreal-Trudeau International Airport',33,380,'2024-12-10','2024-12-10',0,280);
INSERT INTO "Flights" VALUES ('YUL903','Air Transat','18:30:00','00:00:00',10,'Montreal-Trudeau International Airport',5,390,'2024-12-10','2024-12-11',0,198);
INSERT INTO "Flights" VALUES ('SEA1101','Alaska Airlines','07:00:00','10:30:00',11,'Seattle-Tacoma International Airport',6,350,'2024-12-11','2024-12-11',1,160);
INSERT INTO "Flights" VALUES ('SEA1102','Delta Airlines','12:00:00','15:45:00',11,'Seattle-Tacoma International Airport',12,370,'2024-12-11','2024-12-11',1,149);
INSERT INTO "Flights" VALUES ('SEA1103','United Airlines','18:00:00','21:30:00',11,'Seattle-Tacoma International Airport',30,360,'2024-12-11','2024-12-11',0,102);
INSERT INTO "Flights" VALUES ('CPT1201','South African Airways','06:00:00','14:30:00',12,'Cape Town International Airport',28,850,'2024-12-12','2024-12-12',0,45);
INSERT INTO "Flights" VALUES ('CPT1202','British Airways','15:00:00','23:30:00',12,'Cape Town International Airport',9,870,'2024-12-12','2024-12-12',1,30);
INSERT INTO "Flights" VALUES ('CPT1203','Qatar Airways','00:00:00','08:30:00',12,'Cape Town International Airport',25,890,'2024-12-13','2024-12-13',1,63);
INSERT INTO "Flights" VALUES ('GIG1301','LATAM','07:30:00','12:00:00',13,'Galeão International Airport',22,650,'2024-12-13','2024-12-13',1,70);
INSERT INTO "Flights" VALUES ('GIG1302','Gol Airlines','13:30:00','18:00:00',13,'Galeão International Airport',16,620,'2024-12-13','2024-12-13',0,126);
INSERT INTO "Flights" VALUES ('GIG1303','Azul','19:00:00','00:30:00',13,'Galeão International Airport',8,670,'2024-12-13','2024-12-14',0,180);
INSERT INTO "Flights" VALUES ('YVR1401','Air Canada','06:00:00','11:00:00',14,'Vancouver International Airport',2,450,'2024-12-14','2024-12-14',0,168);
INSERT INTO "Flights" VALUES ('YVR1402','Westjet','12:30:00','17:30:00',14,'Vancouver International Airport',33,430,'2024-12-14','2024-12-14',0,63);
INSERT INTO "Flights" VALUES ('YVR1403','Alaska Airlines','18:00:00','23:00:00',14,'Vancouver International Airport',6,440,'2024-12-14','2024-12-14',1,62);
INSERT INTO "Flights" VALUES ('LYS1501','Air France','07:00:00','09:45:00',15,'Lyon-Saint Exupéry Airport',4,360,'2024-12-15','2024-12-15',0,301);
INSERT INTO "Flights" VALUES ('LYS1502','British Airways','11:00:00','13:45:00',15,'Lyon-Saint Exupéry Airport',9,370,'2024-12-15','2024-12-15',1,324);
INSERT INTO "Flights" VALUES ('LYS1503','Lufthansa','15:00:00','17:45:00',15,'Lyon-Saint Exupéry Airport',23,350,'2024-12-15','2024-12-15',0,349);
INSERT INTO "Flights" VALUES ('PEK1701','Air China','08:00:00','14:30:00',17,'Beijing Capital International Airport',3,780,0,'2024-12-16',1,244);
INSERT INTO "Flights" VALUES ('PEK1702','Hainan Airlines','15:00:00','21:30:00',17,'Beijing Capital International Airport',17,760,'2024-12-16','2024-12-16',1,270);
INSERT INTO "Flights" VALUES ('PEK1703','China Eastern Airlines','22:00:00','04:30:00',17,'Beijing Capital International Airport',10,790,'2024-12-16','2024-12-17',0,295);
INSERT INTO "Flights" VALUES ('PVG1801','China Eastern Airlines','09:00:00','15:00:00',18,'Shanghai Pudong International Airport',10,770,'2024-12-17','2024-12-17',0,25);
INSERT INTO "Flights" VALUES ('PVG1802','Air China','16:00:00','22:00:00',18,'Shanghai Pudong International Airport',3,750,'2024-12-17','2024-12-17',1,1);
INSERT INTO "Flights" VALUES ('PVG1803','Spring Airlines','00:00:00','06:00:00',18,'Shanghai Pudong International Airport',29,740,'2024-12-18','2024-12-18',0,3);
INSERT INTO "Flights" VALUES ('CAN2001','China Southern Airlines','07:00:00','13:00:00',20,'Guangzhou Baiyun International Airport',10,720,'2024-12-18','2024-12-18',0,306);
INSERT INTO "Flights" VALUES ('CAN2002','Hainan Airlines','14:30:00','20:30:00',20,'Guangzhou Baiyun International Airport',17,730,'2024-12-18','2024-12-18',1,129);
INSERT INTO "Flights" VALUES ('CAN2003','China Eastern Airlines','01:00:00','07:00:00',20,'Guangzhou Baiyun International Airport',10,710,'2024-12-19','2024-12-19',0,230);
INSERT INTO "Flights" VALUES ('EDI2101','British Airways','06:30:00','09:30:00',21,'Edinburgh Airport',9,450,'2024-12-19','2024-12-19',1,11);
INSERT INTO "Flights" VALUES ('EDI2102','EasyJet','11:00:00','14:00:00',21,'Edinburgh Airport',13,420,'2024-12-19','2024-12-19',0,49);
INSERT INTO "Flights" VALUES ('EDI2103','Ryanair','15:30:00','18:30:00',21,'Edinburgh Airport',26,410,'2024-12-19','2024-12-19',0,20);
INSERT INTO "Flights" VALUES ('BHX2201','British Airways','07:00:00','09:30:00',22,'Birmingham Airport',9,430,'2024-12-20','2024-12-20',1,79);
INSERT INTO "Flights" VALUES ('BHX2202','Ryanair','12:00:00','14:30:00',22,'Birmingham Airport',27,400,'2024-12-20','2024-12-20',0,45);
INSERT INTO "Flights" VALUES ('BHX2203','EasyJet','18:00:00','20:30:00',22,'Birmingham Airport',13,420,'2024-12-20','2024-12-20',0,111);
INSERT INTO "Flights" VALUES ('YYZ2301','Air Canada','08:00:00','11:00:00',23,'Toronto Pearson International Airport',2,480,'2024-12-21','2024-12-21',0,7);
INSERT INTO "Flights" VALUES ('YYZ2302','Westjet','12:30:00','17:00:00',23,'Toronto Pearson International Airport',33,460,'2024-12-21','2024-12-21',0,50);
INSERT INTO "Flights" VALUES ('YYZ2303','Delta Airlines','18:30:00','23:00:00',23,'Toronto Pearson International Airport',12,470,'2024-12-21','2024-12-21',1,210);
INSERT INTO "Flights" VALUES ('SPU2601','Croatia Airlines','08:00:00','11:30:00',26,'Split Airport',11,360,'2024-12-22','2024-12-22',1,33);
INSERT INTO "Flights" VALUES ('SPU2602','Lufthansa','13:00:00','16:30:00',26,'Split Airport',23,370,'2024-12-22','2024-12-22',0,56);
INSERT INTO "Flights" VALUES ('SPU2603','EasyJet','18:30:00','22:00:00',26,'Split Airport',13,350,'2024-12-22','2024-12-22',0,4);
INSERT INTO "client" VALUES (1,'lisa','Lisa','Ynineb','123-123-123','l@y.com');
INSERT INTO "client" VALUES (2,'$2b$10$J7ZS/R/seczEDMjNNiFAcuuTSLOxYhzXlNRvXlNkhHp87kUJXHcVO','Samia','Soltane','123-456-7890','samiasoltane@yahoo.fr');
INSERT INTO "client" VALUES (3,'$2b$10$ppItkVIfRmBowAdqIZg81eaIKjxZBvZ3hErkxh8MHixjmrgOivR0W','Samia','Soltane','123-456-7890','samiasoltane@yahoo.fr');
INSERT INTO "client" VALUES (4,'uw','Lisa','UW','123-456-7890','lynineb@uw.edu');
INSERT INTO "destinations" VALUES (1,'Los Angeles International Airport','Los Angeles','USA');
INSERT INTO "destinations" VALUES (2,'Charles de Gaulle Airport','Paris','France');
INSERT INTO "destinations" VALUES (3,'Dubai International Airport','Dubai','United Arab Emirates');
INSERT INTO "destinations" VALUES (4,'Sydney Kingsford Smith Airport','Sydney','Australia');
INSERT INTO "destinations" VALUES (5,'John F. Kennedy International Airport','New York','USA');
INSERT INTO "destinations" VALUES (7,'Mexico City International Airport','Mexico City','Mexico');
INSERT INTO "destinations" VALUES (8,'Heathrow Airport','London','United Kingdom');
INSERT INTO "destinations" VALUES (9,'Dubrovnik Airport','Dubrovnik','Croatia');
INSERT INTO "destinations" VALUES (10,'Montreal-Trudeau International Airport','Montreal','Canada');
INSERT INTO "destinations" VALUES (11,'Seattle-Tacoma International Airport','Seattle','USA');
INSERT INTO "destinations" VALUES (12,'Cape Town International Airport','Cape Town','South Africa');
INSERT INTO "destinations" VALUES (13,'Galeão International Airport','Rio de Janeiro','Brazil');
INSERT INTO "destinations" VALUES (14,'Vancouver International Airport','Vancouver','Canada');
INSERT INTO "destinations" VALUES (15,'Lyon-Saint Exupéry Airport','Lyon','France');
INSERT INTO "destinations" VALUES (17,'Beijing Capital International Airport','Beijing','China');
INSERT INTO "destinations" VALUES (18,'Shanghai Pudong International Airport','Shanghai','China');
INSERT INTO "destinations" VALUES (20,'Guangzhou Baiyun International Airport','Guangzhou','China');
INSERT INTO "destinations" VALUES (21,'Edinburgh Airport','Edinburgh','United Kingdom');
INSERT INTO "destinations" VALUES (22,'Birmingham Airport','Birmingham','United Kingdom');
INSERT INTO "destinations" VALUES (23,'Toronto Pearson International Airport','Toronto','Canada');
INSERT INTO "destinations" VALUES (26,'Split Airport','Split','Croatia');
INSERT INTO "destinations" VALUES (27,'Cancun International Airport','Cancun','Mexico');
COMMIT;
