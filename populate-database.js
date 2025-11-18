const db = require('./src/config/db');
const fs = require('fs');
const path = require('path');

console.log('🚀 Populating database with 5 records per table...');

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
    let errors = 0;
    
    data.forEach(item => {
        const values = Object.values(item);
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(`❌ Error inserting into ${tableName}:`, err.message);
                errors++;
            } else {
                console.log(`✅ Inserted into ${tableName}: ${values[1] || values[0]}`);
            }
            completed++;
            if (completed === data.length) {
                if (errors === 0) {
                    console.log(`🎉 Completed ${tableName} - ${data.length} records`);
                } else {
                    console.log(`⚠️  Completed ${tableName} with ${errors} errors`);
                }
                callback();
            }
        });
    });
}

// Execută fișierul SQL complet
function runSeedFile(callback) {
    const sqlFile = path.join(__dirname, 'database', 'seed_data.sql');
    
    console.log('📁 Reading SQL seed file...');
    
    fs.readFile(sqlFile, 'utf8', (err, sqlContent) => {
        if (err) {
            console.error('❌ Error reading seed file:', err.message);
            callback();
            return;
        }
        
        // Împarte comenzile SQL
        const commands = sqlContent.split(';').filter(cmd => cmd.trim() && !cmd.trim().toLowerCase().startsWith('use'));
        
        console.log(`📝 Found ${commands.length} SQL commands to execute`);
        
        function executeCommand(index) {
            if (index >= commands.length) {
                console.log('✅ All SQL commands executed successfully');
                callback();
                return;
            }
            
            const command = commands[index].trim();
            if (!command) {
                executeCommand(index + 1);
                return;
            }
            
            console.log(`⚡ Executing: ${command.substring(0, 80)}...`);
            
            db.query(command, (err, results) => {
                if (err) {
                    console.error(`❌ Error executing command ${index + 1}:`, err.message);
                } else {
                    console.log(`✅ Command ${index + 1}/${commands.length} executed`);
                }
                executeCommand(index + 1);
            });
        }
        
        executeCommand(0);
    });
}

// Funcție principală de populare
function populateDatabase() {
    console.log('🗃️ Starting database population...');
    console.log('📊 Each table will have exactly 5 records');
    
    runSeedFile(() => {
        // Verifică populația finală
        const verificationQueries = {
            'Users': 'SELECT COUNT(*) as count FROM Users',
            'Customers': 'SELECT COUNT(*) as count FROM Customers',
            'Species': 'SELECT COUNT(*) as count FROM Species',
            'Categories': 'SELECT COUNT(*) as count FROM Categories',
            'Pets': 'SELECT COUNT(*) as count FROM Pets',
            'Products': 'SELECT COUNT(*) as count FROM Products',
            'Suppliers': 'SELECT COUNT(*) as count FROM Suppliers',
            'Services': 'SELECT COUNT(*) as count FROM Services',
            'Orders': 'SELECT COUNT(*) as count FROM Orders',
            'Order_Items': 'SELECT COUNT(*) as count FROM Order_Items',
            'Product_Suppliers': 'SELECT COUNT(*) as count FROM Product_Suppliers',
            'Pet_Suppliers': 'SELECT COUNT(*) as count FROM Pet_Suppliers',
            'Customer_Services': 'SELECT COUNT(*) as count FROM Customer_Services',
            'Customer_Pets': 'SELECT COUNT(*) as count FROM Customer_Pets'
        };
        
        console.log('\n🔍 Verifying final record counts...');
        
        const tableNames = Object.keys(verificationQueries);
        let verifiedTables = 0;
        let allCorrect = true;
        
        tableNames.forEach(tableName => {
            db.query(verificationQueries[tableName], (err, results) => {
                if (err) {
                    console.error(`❌ Error verifying ${tableName}:`, err.message);
                } else {
                    const count = results[0].count;
                    const status = count === 5 ? '✅' : '❌';
                    console.log(`${status} ${tableName}: ${count} records`);
                    
                    if (count !== 5) {
                        allCorrect = false;
                    }
                }
                
                verifiedTables++;
                if (verifiedTables === tableNames.length) {
                    console.log('\n' + '='.repeat(50));
                    if (allCorrect) {
                        console.log('🎉 SUCCESS: All tables have exactly 5 records!');
                        console.log('📊 Database is ready for use.');
                    } else {
                        console.log('⚠️  WARNING: Some tables do not have exactly 5 records');
                    }
                    console.log('🔗 Test the application: http://localhost:3000');
                    console.log('='.repeat(50));
                    
                    process.exit();
                }
            });
        });
    });
}

// Rulează popularea
populateDatabase();