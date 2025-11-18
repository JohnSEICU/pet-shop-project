const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all services
router.get("/", (req, res) => {
    const sql = "SELECT * FROM Services ORDER BY Name";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET service by ID
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM Services WHERE ServiceID = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(results[0]);
    });
});

// ADD service
router.post("/", (req, res) => {
    const { Name, Description, Price, DurationMinutes } = req.body;

    const sql = `
        INSERT INTO Services (Name, Description, Price, DurationMinutes)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [Name, Description, Price, DurationMinutes], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Service added!", id: result.insertId });
    });
});

module.exports = router;