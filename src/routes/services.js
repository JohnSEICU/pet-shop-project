const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Services', (err, results) => res.json(results));
});

router.post('/', (req, res) => {
    const { Name, Description, Price, DurationMinutes } = req.body;
    const sql = 'INSERT INTO Services (Name, Description, Price, DurationMinutes) VALUES (?,?,?,?)';
    db.query(sql, [Name, Description, Price, DurationMinutes], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Services WHERE ServiceID = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

module.exports = router;