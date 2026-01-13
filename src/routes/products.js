const express = require('express');
const router = express.Router();
const db = require('../config/db');

// JOIN #1: Products + Categories
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

// PARAMETRU VARIABIL: Cautare produs dupa nume (LIKE)
router.get('/search', (req, res) => {
    const keyword = req.query.q; // Variabila din URL
    const sql = `
        SELECT P.*, C.Name as CategoryName 
        FROM Products P 
        LEFT JOIN Categories C ON P.CategoryID = C.CategoryID
        WHERE P.Name LIKE ?
    `;
    db.query(sql, [`%${keyword}%`], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// COMPLEX #1: Expensive (Subquery)
router.get('/reports/expensive', (req, res) => {
    const sql = 'SELECT Name, Price FROM Products WHERE Price > (SELECT AVG(Price) FROM Products)';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// COMPLEX #2: Unused (Subquery NOT IN)
router.get('/reports/unused', (req, res) => {
    const sql = 'SELECT Name, Price, Stock FROM Products WHERE ProductID NOT IN (SELECT DISTINCT ProductID FROM Order_Items)';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// COMPLEX #4: Low Stock (Subquery AVG - NOU)
router.get('/reports/low-stock', (req, res) => {
    const sql = 'SELECT Name, Stock FROM Products WHERE Stock < (SELECT AVG(Stock) FROM Products)';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// JOIN #2: Products + Suppliers
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

// CRUD Operations...
router.post('/', (req, res) => {
    const { Name, Price, Stock, CategoryID, Description } = req.body;
    const sql = 'INSERT INTO Products (Name, Price, Stock, CategoryID, Description) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [Name, Price, Stock, CategoryID, Description], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

router.put('/:id', (req, res) => {
    const { Name, Price, Stock, CategoryID, Description } = req.body;
    const sql = 'UPDATE Products SET Name = ?, Price = ?, Stock = ?, CategoryID = ?, Description = ? WHERE ProductID = ?';
    db.query(sql, [Name, Price, Stock, CategoryID, Description, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

module.exports = router;