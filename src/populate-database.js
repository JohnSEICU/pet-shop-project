const db = require('./config/db');
const fs = require('fs');
const path = require('path');

console.log('🚀 Populating database with sample data...');

// Date de test pentru populare
const sampleData = {
    users: [
        { Username: 'admin', Email: 'admin@petshop.com', Password: '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', Role: 'admin', CreatedAt: new Date() },
        { Username: 'john_doe', Email: 'john@email.com', Password: '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', Role: 'customer', CreatedAt: new Date() },
        { Username: 'mary_smith', Email: 'mary@email.com', Password: '$2a$10$rOzZIVQ.8b5b6e1O2b6K3O', Role: 'customer', CreatedAt: new Date() }
    ],
    species: [
        { Name: 'Câine', Description: 'Animale domestice loiale' },
        { Name: 'Pisică', Description: 'Animale independente și elegante' },
        { Name: 'Papagal', Description: 'Păsări vorbărețe și colorate' },
        { Name: 'Iepure', Description: 'Rozătoare prietenoase' },
        { Name: 'Pește', Description: 'Pești decorativi pentru acvariu' }
    ],
    categories: [
        { Name: 'Hrană', Description: 'Hrană pentru animale de companie' },
        { Name: 'Jucării', Description: 'Jucării și accesorii de divertisment' },
        { Name: 'Îngrijire', Description: 'Produse de îngrijire și igienă' },
        { Name: 'Transport', Description: 'Căști și accesorii de transport' },
        { Name: 'Sănătate', Description: 'Produse pentru sănătatea animalelor' }
    ],
    pets: [
        { Name: 'Rex', Age: 2, Gender: 'Male', Price: 1500.00, Available: true, SpeciesID: 1, ImageURL: '/images/rex.jpg', Description: 'Cățel jucăuș și prietenos' },
        { Name: 'Miti', Age: 1, Gender: 'Female', Price: 800.00, Available: true, SpeciesID: 2, ImageURL: '/images/miti.jpg', Description: 'Pisică blană scurtă, foarte iubitoare' },
        { Name: 'Coco', Age: 3, Gender: 'Male', Price: 1200.00, Available: true, SpeciesID: 3, ImageURL: '/images/coco.jpg', Description: 'Papagal vorbitor, foarte inteligent' },
        { Name: 'Bunny', Age: 1, Gender: 'Female', Price: 400.00, Available: true, SpeciesID: 4, ImageURL: '/images/bunny.jpg', Description: 'Iepure pitic, foarte blând' },
        { Name: 'Nemo', Age: 1, Gender: 'Male', Price: 200.00, Available: true, SpeciesID: 5, ImageURL: '/images/nemo.jpg', Description: 'Pește colorat pentru acvariu' }
    ],
    products: [
        { Name: 'Hrană uscată câini', Description: 'Hrană premium pentru câini adulți', Price: 45.50, Stock: 100, CategoryID: 1, ImageURL: '/images/hrana_caini.jpg' },
        { Name: 'Jucărie pisici', Description: 'Minge cu surpriză pentru pisici', Price: 15.99, Stock: 50, CategoryID: 2, ImageURL: '/images/jucarie_pisici.jpg' },
        { Name: 'Șampon pentru animale', Description: 'Șampon delicat pentru blană', Price: 32.00, Stock: 30, CategoryID: 3, ImageURL: '/images/sampon.jpg' },
        { Name: 'Geantă transport', Description: 'Geantă ergonomică pentru transport', Price: 89.99, Stock: 20, CategoryID: 4, ImageURL: '/images/geanta.jpg' },
        { Name: 'Vitamine pentru păsări', Description: 'Suplimente vitaminice pentru păsări', Price: 25.50, Stock: 40, CategoryID: 5, ImageURL: '/images/vitamine.jpg' }
    ]
};

// Funcție pentru a popula fiecare tabel
function populateTable(tableName, data, callback) {
    if (data.length === 0) {
        callback();
        return;
    }
    
    const columns = Object.keys(data[0]).join(', ');
    const placeholders = Object.keys(data[0]).map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    
    let completed = 0;
    data.forEach(item => {
        const values = Object.values(item);
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(`❌ Error inserting into ${tableName}:`, err.message);
            } else {
                console.log(`✅ Inserted into ${tableName}: ${values[0]}`);
            }
            completed++;
            if (completed === data.length) {
                callback();
            }
        });
    });
}

// Populează toate tabelele în ordine
console.log('🗃️ Starting database population...');

populateTable('Species', sampleData.species, () => {
    populateTable('Categories', sampleData.categories, () => {
        populateTable('Users', sampleData.users, () => {
            // După Users, putem popula Customers (care are foreign key către Users)
            const customers = [
                { UserID: 2, FirstName: 'John', LastName: 'Doe', Phone: '0722123456', Address: 'Str. Primaverii, Nr. 10, București' },
                { UserID: 3, FirstName: 'Mary', LastName: 'Smith', Phone: '0733123456', Address: 'Str. Libertatii, Nr. 25, Cluj-Napoca' }
            ];
            
            populateTable('Customers', customers, () => {
                populateTable('Pets', sampleData.pets, () => {
                    populateTable('Products', sampleData.products, () => {
                        console.log('🎉 Database population completed!');
                        console.log('📊 Sample data inserted:');
                        console.log('   - 3 Users (admin, john_doe, mary_smith)');
                        console.log('   - 2 Customers');
                        console.log('   - 5 Species');
                        console.log('   - 5 Categories');
                        console.log('   - 5 Pets');
                        console.log('   - 5 Products');
                        console.log('🔗 Test the API: http://localhost:3000/');
                        process.exit();
                    });
                });
            });
        });
    });
});