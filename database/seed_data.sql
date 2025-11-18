USE pricopi_robert_alexandru_341b1;

-- Șterge datele existente pentru a repopula
DELETE FROM Customer_Pets;
DELETE FROM Customer_Services;
DELETE FROM Pet_Suppliers;
DELETE FROM Product_Suppliers;
DELETE FROM Order_Items;
DELETE FROM Orders;
DELETE FROM Services;
DELETE FROM Suppliers;
DELETE FROM Products;
DELETE FROM Pets;
DELETE FROM Categories;
DELETE FROM Species;
DELETE FROM Customers;
DELETE FROM Users;

-- 1. Users - 5 înregistrări
INSERT INTO `Users` (`UserID`, `Username`, `Email`, `Password`, `Role`, `CreatedAt`) VALUES
(1, 'admin', 'admin@petshop.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', 'admin', NOW()),
(2, 'john_doe', 'john@email.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', 'customer', NOW()),
(3, 'mary_smith', 'mary@email.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', 'customer', NOW()),
(4, 'alex_pop', 'alex@email.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', 'customer', NOW()),
(5, 'laura_ionescu', 'laura@email.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', 'customer', NOW());

-- 2. Customers - 5 înregistrări
INSERT INTO `Customers` (`CustomerID`, `UserID`, `FirstName`, `LastName`, `Phone`, `Address`) VALUES
(1, 2, 'John', 'Doe', '0722123456', 'Str. Primaverii, Nr. 10, București'),
(2, 3, 'Mary', 'Smith', '0733123456', 'Str. Libertatii, Nr. 25, Cluj-Napoca'),
(3, 4, 'Alex', 'Pop', '0744123456', 'Str. Mihai Viteazu, Nr. 15, Timișoara'),
(4, 5, 'Laura', 'Ionescu', '0755123456', 'Str. Unirii, Nr. 8, Iași'),
(5, 1, 'Admin', 'User', '0766123456', 'Str. Admin, Nr. 1, București');

-- 3. Species - 5 înregistrări
INSERT INTO `Species` (`SpeciesID`, `Name`, `Description`) VALUES
(1, 'Câine', 'Animale domestice loiale și prietenoase'),
(2, 'Pisică', 'Animale independente și elegante'),
(3, 'Papagal', 'Păsări vorbărețe și colorate'),
(4, 'Iepure', 'Rozătoare prietenoase și jucăușe'),
(5, 'Hamster', 'Rozătoare mici și active');

-- 4. Categories - 5 înregistrări
INSERT INTO `Categories` (`CategoryID`, `Name`, `Description`) VALUES
(1, 'Hrană', 'Hrană pentru animale de companie'),
(2, 'Jucării', 'Jucării și accesorii de divertisment'),
(3, 'Îngrijire', 'Produse de îngrijire și igienă'),
(4, 'Transport', 'Căști și accesorii de transport'),
(5, 'Sănătate', 'Produse pentru sănătatea animalelor');

-- 5. Pets - 5 înregistrări
INSERT INTO `Pets` (`PetID`, `Name`, `Age`, `Gender`, `Price`, `Available`, `SpeciesID`, `ImageURL`, `Description`) VALUES
(1, 'Rex', 2, 'Male', 1500.00, true, 1, '/images/rex.jpg', 'Cățel jucăuș și prietenos, foarte activ'),
(2, 'Miti', 1, 'Female', 800.00, true, 2, '/images/miti.jpg', 'Pisică blană scurtă, foarte iubitoare'),
(3, 'Coco', 3, 'Male', 1200.00, true, 3, '/images/coco.jpg', 'Papagal vorbitor, foarte inteligent'),
(4, 'Bunny', 1, 'Female', 400.00, true, 4, '/images/bunny.jpg', 'Iepure pitic, foarte blând și prietenos'),
(5, 'Hammy', 1, 'Male', 250.00, true, 5, '/images/hammy.jpg', 'Hamster syrian, foarte jucăuș');

-- 6. Products - 5 înregistrări
INSERT INTO `Products` (`ProductID`, `Name`, `Description`, `Price`, `Stock`, `CategoryID`, `ImageURL`) VALUES
(1, 'Hrană uscată câini', 'Hrană premium pentru câini adulți', 45.50, 100, 1, '/images/hrana_caini.jpg'),
(2, 'Jucărie pisici', 'Minge cu surpriză pentru pisici', 15.99, 50, 2, '/images/jucarie_pisici.jpg'),
(3, 'Șampon pentru animale', 'Șampon delicat pentru blană', 32.00, 30, 3, '/images/sampon.jpg'),
(4, 'Geantă transport', 'Geantă ergonomică pentru transport', 89.99, 20, 4, '/images/geanta.jpg'),
(5, 'Vitamine pentru păsări', 'Suplimente vitaminice pentru păsări', 25.50, 40, 5, '/images/vitamine.jpg');

-- 7. Suppliers - 5 înregistrări
INSERT INTO `Suppliers` (`SupplierID`, `Name`, `ContactEmail`, `Phone`, `Address`) VALUES
(1, 'PetFood SRL', 'contact@petfood.ro', '0211234567', 'București, Sector 3'),
(2, 'AnimalCare SA', 'office@animalcare.ro', '0217654321', 'Cluj-Napoca, Str. Fabricii'),
(3, 'VetProducts SRL', 'info@vetproducts.ro', '0318123456', 'Timișoara, Str. Aurel Vlaicu'),
(4, 'HappyPets SRL', 'sales@happypets.ro', '0264123456', 'Brașov, Str. Castanilor'),
(5, 'BioPet RO', 'office@biopet.ro', '0332123456', 'Constanța, Str. Marului');

-- 8. Services - 5 înregistrări
INSERT INTO `Services` (`ServiceID`, `Name`, `Description`, `Price`, `DurationMinutes`) VALUES
(1, 'Tuns și aranjare', 'Tuns și aranjare profesională a blănii', 80.00, 60),
(2, 'Vaccinare anuală', 'Vaccinare pentru boli comune', 120.00, 30),
(3, 'Consult veterinar', 'Consult general veterinar', 50.00, 45),
(4, 'Pensiuă animal', 'Cazare animal de companie', 40.00, 1440),
(5, 'Baie și grooming', 'Baie completă și aranjare', 65.00, 90);

-- 9. Orders - 5 înregistrări
INSERT INTO `Orders` (`OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, `Status`) VALUES
(1, 1, '2024-01-15 10:30:00', 145.50, 'Finalizată'),
(2, 2, '2024-01-16 14:20:00', 89.99, 'În curs'),
(3, 3, '2024-01-17 09:15:00', 32.00, 'Finalizată'),
(4, 4, '2024-01-18 16:45:00', 105.99, 'Anulată'),
(5, 5, '2024-01-19 11:00:00', 25.50, 'Finalizată');

-- 10. Order_Items - 5 înregistrări
INSERT INTO `Order_Items` (`OrderItemID`, `ProductID`, `OrderID`, `Quantity`, `UnitPrice`) VALUES
(1, 1, 1, 2, 45.50),
(2, 4, 2, 1, 89.99),
(3, 3, 3, 1, 32.00),
(4, 2, 4, 3, 15.99),
(5, 5, 5, 1, 25.50);

-- 11. Product_Suppliers - 5 înregistrări
INSERT INTO `Product_Suppliers` (`ProductID`, `SupplierID`, `SupplyPrice`) VALUES
(1, 1, 35.00),
(2, 2, 12.00),
(3, 3, 25.00),
(4, 4, 70.00),
(5, 5, 20.00);

-- 12. Pet_Suppliers - 5 înregistrări
INSERT INTO `Pet_Suppliers` (`PetID`, `SupplierID`, `AcquisitionDate`) VALUES
(1, 1, '2024-01-15'),
(2, 2, '2024-02-20'),
(3, 3, '2024-01-10'),
(4, 4, '2024-03-05'),
(5, 5, '2024-02-28');

-- 13. Customer_Services - 5 înregistrări
INSERT INTO `Customer_Services` (`CustomerID`, `ServiceID`, `AppointmentDate`, `Notes`) VALUES
(1, 1, '2024-04-10 10:00:00', 'Tuns scurt'),
(2, 2, '2024-04-11 11:30:00', 'Vaccin rabies'),
(3, 3, '2024-04-12 09:00:00', 'Consult de rutină'),
(4, 4, '2024-04-13 15:00:00', 'Cazare 3 zile'),
(5, 5, '2024-04-14 14:00:00', 'Baie cu șampon special');

-- 14. Customer_Pets - 5 înregistrări
INSERT INTO `Customer_Pets` (`CustomerID`, `PetID`, `PurchaseDate`) VALUES
(1, 1, '2024-01-20'),
(2, 2, '2024-02-25'),
(3, 3, '2024-01-15'),
(4, 4, '2024-03-10'),
(5, 5, '2024-03-01');