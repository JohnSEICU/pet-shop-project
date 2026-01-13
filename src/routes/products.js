const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL (Join Categories)
router.get('/', (req, res) => {
    const sql = `
        SELECT P.*, C.Name as CategoryName 
        FROM Products P 
        LEFT JOIN Categories C ON P.CategoryID = C.CategoryID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// SUBQUERY: Expensive Products (Produse peste media de pret)
router.get('/reports/expensive', (req, res) => {
    const sql = 'SELECT Name, Price FROM Products WHERE Price > (SELECT AVG(Price) FROM Products)';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// SUBQUERY: Unordered Products (Produse care nu au fost comandate niciodata)
// INLOCUIESTE "Furnizori fara animale"
router.get('/reports/unused', (req, res) => {
    const sql = 'SELECT Name, Price, Stock FROM Products WHERE ProductID NOT IN (SELECT DISTINCT ProductID FROM Order_Items)';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// JOIN: Products & Suppliers (M:M via Product_Suppliers)
router.get('/reports/with-suppliers', (req, res) => {
    const sql = `
        SELECT P.Name as Product, S.Name as Supplier, PS.SupplyPrice 
        FROM Products P 
        JOIN Product_Suppliers PS ON P.ProductID = PS.ProductID 
        JOIN Suppliers S ON PS.SupplierID = S.SupplierID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Admin ADD
router.post('/', (req, res) => {
    const { Name, Price, Stock, CategoryID, Description } = req.body;
    const sql = 'INSERT INTO Products (Name, Price, Stock, CategoryID, Description) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [Name, Price, Stock, CategoryID, Description], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Admin UPDATE (Adaugat pentru a permite modificarea stocului manual)
router.put('/:id', (req, res) => {
    const { Name, Price, Stock, CategoryID, Description } = req.body;
    const sql = 'UPDATE Products SET Name = ?, Price = ?, Stock = ?, CategoryID = ?, Description = ? WHERE ProductID = ?';
    db.query(sql, [Name, Price, Stock, CategoryID, Description, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Admin DELETE
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

module.exports = router;