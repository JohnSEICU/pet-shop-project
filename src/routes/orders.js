const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all orders with customer info
router.get("/", (req, res) => {
    const sql = `
        SELECT o.*, c.FirstName, c.LastName, c.Phone 
        FROM Orders o 
        JOIN Customers c ON o.CustomerID = c.CustomerID 
        ORDER BY o.OrderDate DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET order by ID
router.get("/:id", (req, res) => {
    const sql = `
        SELECT o.*, c.FirstName, c.LastName, c.Phone, c.Address
        FROM Orders o 
        JOIN Customers c ON o.CustomerID = c.CustomerID 
        WHERE o.OrderID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(results[0]);
    });
});

// ADD order
router.post("/", (req, res) => {
    const { CustomerID, TotalAmount, Status } = req.body;

    const sql = `
        INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, Status)
        VALUES (?, NOW(), ?, ?)
    `;

    db.query(sql, [CustomerID, TotalAmount, Status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order added!", id: result.insertId });
    });
});

module.exports = router;