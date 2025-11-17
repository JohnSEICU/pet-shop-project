USE pricopi_robert_alexandru_341b1;

-- 1. Populează Users
INSERT INTO `Users` (`Username`, `Email`, `Password`, `Role`, `CreatedAt`) VALUES
('admin', 'admin@petshop.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3OQYQYQYQYQYQYQYQYQYQYQYQYQYQYQY', 'admin', NOW()),
('john_doe', 'john@email.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3OQYQYQYQYQYQYQYQYQYQYQYQYQYQYQY', 'customer', NOW()),
('mary_smith', 'mary@email.com', '$2a$10$rOzZIVQ.8b5b6e1O2b6K3OQYQYQYQYQYQYQYQYQYQYQYQYQYQYQY', 'customer', NOW());

-- 2. Populează Customers
INSERT INTO `Customers` (`UserID`, `FirstName`, `LastName`, `Phone`, `Address`) VALUES
(2, 'John', 'Doe', '0722123456', 'Str. Primaverii, Nr. 10, București'),
(3, 'Mary', 'Smith', '0733123456', 'Str. Libertatii, Nr. 25, Cluj-Napoca');

-- 3. Populează Species
INSERT INTO `Species` (`Name`, `Description`) VALUES
('Caine', 'Animale domestice loiale'),
('Pisica', 'Animale independente și elegante'),
('Papagal', 'Păsări vorbărețe și colorate'),
('Iepure', 'Rozătoare prietenoase'),
('Pește', 'Pești decorativi pentru acvariu');

-- 4. Populează Categories
INSERT INTO `Categories` (`Name`, `Description`) VALUES
('Hrană', 'Hrană pentru animale de companie'),
('Jucării', 'Jucării și accesorii de divertisment'),
('Îngrijire', 'Produse de îngrijire și igienă'),
('Transport', 'Căști și accesorii de transport'),
('Sănătate', 'Produse pentru sănătatea animalelor');

-- 5. Populează Pets
INSERT INTO `Pets` (`Name`, `Age`, `Gender`, `Price`, `Available`, `SpeciesID`, `ImageURL`, `Description`) VALUES
('Rex', 2, 'Male', 1500.00, true, 1, '/images/rex.jpg', 'Cățel jucăuș și prietenos'),
('Miti', 1, 'Female', 800.00, true, 2, '/images/miti.jpg', 'Pisică blană scurtă, foarte iubitoare'),
('Coco', 3, 'Male', 1200.00, true, 3, '/images/coco.jpg', 'Papagal vorbitor, foarte inteligent'),
('Bunny', 1, 'Female', 400.00, true, 4, '/images/bunny.jpg', 'Iepure pitic, foarte blând'),
('Nemo', 1, 'Male', 200.00, true, 5, '/images/nemo.jpg', 'Pește colorat pentru acvariu');

-- 6. Populează Products
INSERT INTO `Products` (`Name`, `Description`, `Price`, `Stock`, `CategoryID`, `ImageURL`) VALUES
('Hrană uscată câini', 'Hrană premium pentru câini adulți', 45.50, 100, 1, '/images/hrana_caini.jpg'),
('Jucărie pisici', 'Minge cu surpriză pentru pisici', 15.99, 50, 2, '/images/jucarie_pisici.jpg'),
('Șampon pentru animale', 'Șampon delicat pentru blană', 32.00, 30, 3, '/images/sampon.jpg'),
('Geantă transport', 'Geantă ergonomică pentru transport', 89.99, 20, 4, '/images/geanta.jpg'),
('Vitamine pentru păsări', 'Suplimente vitaminice pentru păsări', 25.50, 40, 5, '/images/vitamine.jpg');

-- 7. Populează Suppliers
INSERT INTO `Suppliers` (`Name`, `ContactEmail`, `Phone`, `Address`) VALUES
('PetFood SRL', 'contact@petfood.ro', '0211234567', 'București, Sector 3'),
('AnimalCare SA', 'office@animalcare.ro', '0217654321', 'Cluj-Napoca, Str. Fabricii');

-- 8. Populează Services
INSERT INTO `Services` (`Name`, `Description`, `Price`, `DurationMinutes`) VALUES
('Tuns', 'Tuns și aranjare blană', 80.00, 60),
('Vaccin', 'Vaccinare anuală', 120.00, 30),
('Consultatii', 'Consult veterinar general', 50.00, 45),
('Pensiuă', 'Cazare animal de companie', 40.00, 1440);