USE pricopi_robert_alexandru_341b1;

-- Dezactivam temporar verificarea cheilor straine pentru a putea sterge/insera in orice ordine
SET FOREIGN_KEY_CHECKS = 0;

-- Golim tabelele pentru a evita duplicatele sau ID-urile decalate
DELETE FROM Order_Items;
DELETE FROM Orders;
DELETE FROM Customer_Services;
DELETE FROM Customer_Pets;
DELETE FROM Pet_Suppliers;
DELETE FROM Product_Suppliers;
DELETE FROM Services;
DELETE FROM Pets;
DELETE FROM Products;
DELETE FROM Suppliers;
DELETE FROM Customers;
DELETE FROM Users;
DELETE FROM Categories;
DELETE FROM Species;

-- 1. Users (ID-uri explicite)
INSERT INTO Users (UserID, Username, Email, Password, Role) VALUES
(1, 'admin', 'admin@petshop.com', 'admin123', 'admin'),
(2, 'ion_popescu', 'ion@mail.com', 'user123', 'user'),
(3, 'maria_i', 'maria@mail.com', 'user123', 'user'),
(4, 'andrei_t', 'andrei@mail.com', 'user123', 'user'),
(5, 'elena_d', 'elena@mail.com', 'user123', 'user'),
(6, 'vlad_m', 'vlad@mail.com', 'user123', 'user');

-- 2. Customers (ID-uri explicite)
INSERT INTO Customers (CustomerID, UserID, FirstName, LastName, Phone, Address) VALUES
(1, 2, 'Ion', 'Popescu', '0722111222', 'Str. Principala 1, Bucuresti'),
(2, 3, 'Maria', 'Ionescu', '0733444555', 'Str. Secundara 2, Cluj'),
(3, 4, 'Andrei', 'Tudor', '0744777888', 'Bd. Unirii 3, Timisoara'),
(4, 5, 'Elena', 'Dumitrescu', '0755111999', 'Str. Pacii 4, Iasi'),
(5, 6, 'Vlad', 'Mihai', '0766222333', 'Aleea Rozelor, Brasov');

-- 3. Species
INSERT INTO Species (SpeciesID, Name, Description) VALUES
(1, 'Caine', 'Cel mai bun prieten al omului'),
(2, 'Pisica', 'Independenta si pufoasa'),
(3, 'Pasari', 'Papagali si canari'),
(4, 'Pesti', 'Acvaristica'),
(5, 'Rozatoare', 'Hamsteri si iepuri');

-- 4. Categories
INSERT INTO Categories (CategoryID, Name, Description) VALUES
(1, 'Hrana', 'Mancare uscata si umeda'),
(2, 'Jucarii', 'Jucarii interactive'),
(3, 'Accesorii', 'Lese, zgarzi, custi'),
(4, 'Ingrijire', 'Sampoane si perii'),
(5, 'Sanatate', 'Vitamine si suplimente');

-- 5. Suppliers
INSERT INTO Suppliers (SupplierID, Name, ContactEmail, Phone, Address) VALUES
(1, 'ZooDistribution', 'contact@zoodist.ro', '0211111111', 'Depozit Baneasa'),
(2, 'PetWorld Global', 'sales@petworld.com', '0264111222', 'Cluj Napoca'),
(3, 'AquaLife', 'fish@aqualife.ro', '0241555666', 'Constanta'),
(4, 'HappyPaws Supply', 'supply@happypaws.com', '0256333444', 'Timisoara'),
(5, 'Empty Supplier', 'no-stock@test.com', '0000000000', 'Nowhere');

-- 6. Pets
INSERT INTO Pets (PetID, Name, Age, Gender, Price, Available, SpeciesID) VALUES
(1, 'Rex', 2, 'M', 1200.00, 1, 1),
(2, 'Luna', 1, 'F', 800.00, 1, 2),
(3, 'Nemo', 1, 'M', 45.00, 1, 4),
(4, 'Coco', 3, 'M', 2500.00, 1, 3),
(5, 'Bella', 2, 'F', 1500.00, 0, 1), -- Sold
(6, 'Max', 1, 'M', 900.00, 1, 2),
(7, 'Hammy', 1, 'M', 50.00, 1, 5);

-- 7. Products (ID-uri explicite pentru a garanta referintele)
INSERT INTO Products (ProductID, Name, Description, Price, Stock, CategoryID) VALUES
(1, 'Royal Canin Adult', 'Hrana premium caini', 250.00, 50, 1),
(2, 'Lesa Retractabila', '5m lungime', 45.00, 20, 3),
(3, 'Acvariu 60L', 'Sticla rezistenta', 300.00, 5, 3),
(4, 'Colivie Mare', 'Pentru papagali mari', 150.00, 10, 3),
(5, 'Sampon Caini', 'Antiparazitar', 30.00, 100, 4),
(6, 'Os Jucarie', 'Cauciuc dur', 15.00, 200, 2),
(7, 'Vitamine Pisici', 'Pentru blana', 60.00, 30, 5);

-- 8. Product_Suppliers
INSERT INTO Product_Suppliers (ProductID, SupplierID, SupplyPrice) VALUES
(1, 1, 200.00), (2, 2, 30.00), (3, 3, 220.00), (4, 4, 100.00), (5, 1, 20.00), (6, 2, 8.00);

-- 9. Pet_Suppliers
INSERT INTO Pet_Suppliers (PetID, SupplierID, AcquisitionDate) VALUES
(1, 1, '2023-01-10'), (2, 2, '2023-02-15'), (3, 3, '2023-03-20'), (4, 4, '2023-04-05');

-- 10. Services
INSERT INTO Services (ServiceID, Name, Description, Price, DurationMinutes) VALUES
(1, 'Toaletaj Canin', 'Spalat si tuns', 100.00, 60),
(2, 'Dresaj', 'Sedinta individuala', 80.00, 50),
(3, 'Veterinar', 'Consultatie generala', 150.00, 30),
(4, 'Hotel Animale', 'Cazare pe noapte', 50.00, 1440),
(5, 'Toaletaj Felin', 'Spalat si periat', 90.00, 45);

-- 11. Orders (ID-uri explicite)
INSERT INTO Orders (OrderID, CustomerID, TotalAmount, Status, OrderDate) VALUES
(1, 1, 295.00, 'Completed', '2023-10-01 10:00:00'),
(2, 2, 1500.00, 'Completed', '2023-10-05 12:00:00'),
(3, 1, 30.00, 'Processing', '2023-10-10 09:00:00'),
(4, 3, 45.00, 'Completed', '2023-10-12 14:00:00'),
(5, 2, 100.00, 'Cancelled', '2023-10-15 16:00:00');

-- 12. Order_Items (Acum ProductID 1, 2, 3, 5 sigur exista)
INSERT INTO Order_Items (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 1, 1, 250.00), (1, 2, 1, 45.00),
(2, 3, 5, 300.00),
(3, 5, 1, 30.00),
(4, 2, 1, 45.00);

-- 13. Customer_Services
INSERT INTO Customer_Services (CustomerID, ServiceID, AppointmentDate, Notes) VALUES
(1, 1, '2023-11-01 14:00:00', 'Caine agresiv'),
(2, 3, '2023-11-02 10:00:00', 'Vaccin anual'),
(3, 2, '2023-11-03 16:00:00', 'Dresaj pui');

-- 14. Customer_Pets
INSERT INTO Customer_Pets (CustomerID, PetID, PurchaseDate) VALUES
(2, 5, '2023-10-05');

-- Reactivam verificarea cheilor straine
SET FOREIGN_KEY_CHECKS = 1;