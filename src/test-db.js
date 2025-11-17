const db = require("./config/db");

// Verifică tabelele
db.query("SHOW TABLES", (err, results) => {
    if (err) {
        console.error("❌ Error:", err.message);
    } else {
        console.log("✅ Tables in database:");
        results.forEach(row => {
            console.log(" -", row[Object.keys(row)[0]]);
        });
    }
});

// Vezi datele din Pets
db.query("SELECT * FROM Pets", (err, results) => {
    if (err) {
        console.error("❌ Error:", err.message);
    } else {
        console.log("🐕 Pets in database:");
        console.log(results);
    }
    process.exit();
});