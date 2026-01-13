const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Suppliers', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Nota: Ruta '/reports/no-pets' a fost eliminata si inlocuita cu 
// '/reports/unused' din products.js pentru a returna rezultate mai relevante.

router.post('/', (req, res) => {
    const { Name, ContactEmail, Phone, Address } = req.body;
    db.query('INSERT INTO Suppliers (Name, ContactEmail, Phone, Address) VALUES (?,?,?,?)', 
        [Name, ContactEmail, Phone, Address], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Suppliers WHERE SupplierID = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

module.exports = router;