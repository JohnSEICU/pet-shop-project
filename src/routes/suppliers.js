const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all suppliers
router.get("/", (req, res) => {
    const sql = "SELECT * FROM Suppliers ORDER BY Name";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET supplier by ID
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM Suppliers WHERE SupplierID = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(results[0]);
    });
});

// ADD supplier
router.post("/", (req, res) => {
    const { Name, ContactEmail, Phone, Address } = req.body;

    const sql = `
        INSERT INTO Suppliers (Name, ContactEmail, Phone, Address)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [Name, ContactEmail, Phone, Address], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Supplier added!", id: result.insertId });
    });
});

module.exports = router;