const express = require('express');
const router = express.Router();
const db = require('../config/db');

// JOIN: Customers + Appointment Info
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Customers';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// SUBQUERY COMPLEX: Top Spender cu Suma Totala
// Selecteaza clientul care a cheltuit cel mai mult, calculand suma printr-o subcerere
router.get('/reports/top-spender', (req, res) => {
    const sql = `
        SELECT FirstName, LastName, Phone, 
               (SELECT SUM(TotalAmount) FROM Orders WHERE CustomerID = C.CustomerID) as TotalSpent
        FROM Customers C
        WHERE CustomerID = (
            SELECT CustomerID FROM Orders ORDER BY TotalAmount DESC LIMIT 1
        )
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;