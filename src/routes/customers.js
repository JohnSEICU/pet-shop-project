const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all customers
router.get("/", (req, res) => {
    const sql = `SELECT * FROM Customers`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
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
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Customer added!", id: result.insertId });
    });
});

module.exports = router;
