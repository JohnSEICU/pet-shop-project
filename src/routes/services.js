const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Services', (err, results) => res.json(results));
});

// JOIN #5: Programari cu detalii Client si Serviciu
router.get('/appointments', (req, res) => {
    const sql = `
        SELECT C.FirstName, C.LastName, S.Name as ServiceName, CS.AppointmentDate, CS.Notes
        FROM Customer_Services CS
        JOIN Customers C ON CS.CustomerID = C.CustomerID
        JOIN Services S ON CS.ServiceID = S.ServiceID
        ORDER BY CS.AppointmentDate DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
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