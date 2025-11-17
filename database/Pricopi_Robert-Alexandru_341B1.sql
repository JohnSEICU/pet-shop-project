CREATE TABLE `Users` (
  `UserID` int PRIMARY KEY AUTO_INCREMENT,
  `Username` varchar(100),
  `Email` varchar(150),
  `Password` varchar(255),
  `Role` varchar(20),
  `CreatedAt` datetime
);

CREATE TABLE `Customers` (
  `CustomerID` int PRIMARY KEY AUTO_INCREMENT,
  `UserID` int,
  `FirstName` varchar(100),
  `LastName` varchar(100),
  `Phone` varchar(20),
  `Address` varchar(200)
);

CREATE TABLE `Species` (
  `SpeciesID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(50),
  `Description` text
);

CREATE TABLE `Pets` (
  `PetID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(100),
  `Age` int,
  `Gender` varchar(10),
  `Price` decimal(10,2),
  `Available` boolean,
  `SpeciesID` int,
  `ImageURL` varchar(255),
  `Description` text
);

CREATE TABLE `Categories` (
  `CategoryID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(100),
  `Description` text
);

CREATE TABLE `Products` (
  `ProductID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(100),
  `Description` text,
  `Price` decimal(10,2),
  `Stock` int,
  `CategoryID` int,
  `ImageURL` varchar(255)
);

CREATE TABLE `Suppliers` (
  `SupplierID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(150),
  `ContactEmail` varchar(150),
  `Phone` varchar(20),
  `Address` varchar(200)
);

CREATE TABLE `Product_Suppliers` (
  `ProductID` int,
  `SupplierID` int,
  `SupplyPrice` decimal(10,2)
);

CREATE TABLE `Pet_Suppliers` (
  `PetID` int,
  `SupplierID` int,
  `AcquisitionDate` date
);

CREATE TABLE `Orders` (
  `OrderID` int PRIMARY KEY AUTO_INCREMENT,
  `CustomerID` int,
  `OrderDate` datetime,
  `TotalAmount` decimal(10,2),
  `Status` varchar(50)
);

CREATE TABLE `Order_Items` (
  `OrderItemID` int PRIMARY KEY AUTO_INCREMENT,
  `ProductID` int,
  `OrderID` int,
  `Quantity` int,
  `UnitPrice` decimal(10,2)
);

CREATE TABLE `Services` (
  `ServiceID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(100),
  `Description` text,
  `Price` decimal(10,2),
  `DurationMinutes` int
);

CREATE TABLE `Customer_Services` (
  `CustomerID` int,
  `ServiceID` int,
  `AppointmentDate` datetime,
  `Notes` text
);

CREATE TABLE `Customer_Pets` (
  `CustomerID` int,
  `PetID` int,
  `PurchaseDate` date
);

ALTER TABLE `Customers` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `Pets` ADD FOREIGN KEY (`SpeciesID`) REFERENCES `Species` (`SpeciesID`);

ALTER TABLE `Products` ADD FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`);

ALTER TABLE `Product_Suppliers` ADD FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`);

ALTER TABLE `Product_Suppliers` ADD FOREIGN KEY (`SupplierID`) REFERENCES `Suppliers` (`SupplierID`);

ALTER TABLE `Pet_Suppliers` ADD FOREIGN KEY (`PetID`) REFERENCES `Pets` (`PetID`);

ALTER TABLE `Pet_Suppliers` ADD FOREIGN KEY (`SupplierID`) REFERENCES `Suppliers` (`SupplierID`);

ALTER TABLE `Orders` ADD FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`);

ALTER TABLE `Order_Items` ADD FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`);

ALTER TABLE `Order_Items` ADD FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`);

ALTER TABLE `Customer_Services` ADD FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`);

ALTER TABLE `Customer_Services` ADD FOREIGN KEY (`ServiceID`) REFERENCES `Services` (`ServiceID`);

ALTER TABLE `Customer_Pets` ADD FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`);

ALTER TABLE `Customer_Pets` ADD FOREIGN KEY (`PetID`) REFERENCES `Pets` (`PetID`);
