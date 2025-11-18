const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all customers
router.get("/", (req, res) => {
    const sql = `
        SELECT c.*, u.Username, u.Email 
        FROM Customers c 
        JOIN Users u ON c.UserID = u.UserID 
        ORDER BY c.LastName, c.FirstName
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET customer by ID
router.get("/:id", (req, res) => {
    const sql = `
        SELECT c.*, u.Username, u.Email 
        FROM Customers c 
        JOIN Users u ON c.UserID = u.UserID 
        WHERE c.CustomerID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(results[0]);
    });
});

// ADD customer
router.post("/", (req, res) => {
    const { UserID, FirstName, LastName, Phone, Address } = req.body;

    const sql = `
        INSERT INTO Customers (UserID, FirstName, LastName, Phone, Address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [UserID, FirstName, LastName, Phone, Address], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer added!", id: result.insertId });
    });
});

// UPDATE customer
router.put("/:id", (req, res) => {
    const { FirstName, LastName, Phone, Address } = req.body;
    
    const sql = `
        UPDATE Customers 
        SET FirstName = ?, LastName = ?, Phone = ?, Address = ?
        WHERE CustomerID = ?
    `;
    
    db.query(sql, [FirstName, LastName, Phone, Address, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer updated!" });
    });
});

module.exports = router;