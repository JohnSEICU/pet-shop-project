const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL
router.get('/', (req, res) => {
    const sql = `
        SELECT P.*, S.Name as SpeciesName 
        FROM Pets P 
        LEFT JOIN Species S ON P.SpeciesID = S.SpeciesID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Admin ADD
router.post('/', (req, res) => {
    const { Name, Age, Gender, Price, SpeciesID } = req.body;
    const sql = 'INSERT INTO Pets (Name, Age, Gender, Price, SpeciesID, Available) VALUES (?, ?, ?, ?, ?, 1)';
    db.query(sql, [Name, Age, Gender, Price, SpeciesID], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, id: result.insertId });
    });
});

// Admin UPDATE
router.put('/:id', (req, res) => {
    const { Name, Age, Gender, Price, SpeciesID } = req.body;
    const sql = 'UPDATE Pets SET Name=?, Age=?, Gender=?, Price=?, SpeciesID=? WHERE PetID=?';
    db.query(sql, [Name, Age, Gender, Price, SpeciesID, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Admin DELETE (CU TRANZACTIE PENTRU STERGERE DEPENDINTE)
router.delete('/:id', (req, res) => {
    const petId = req.params.id;

    // Obtinem o conexiune din Pool pentru tranzactie
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection failed" });

        connection.beginTransaction(err => {
            if (err) { connection.release(); return res.status(500).json(err); }

            // 1. Stergem legaturile cu furnizorii (Pet_Suppliers)
            connection.query('DELETE FROM Pet_Suppliers WHERE PetID = ?', [petId], (err) => {
                if (err) {
                    return connection.rollback(() => { connection.release(); res.status(500).json({ error: "Eroare stergere furnizori", details: err }); });
                }

                // 2. Stergem istoricul de adoptii (Customer_Pets) - daca exista
                connection.query('DELETE FROM Customer_Pets WHERE PetID = ?', [petId], (err) => {
                    if (err) {
                        return connection.rollback(() => { connection.release(); res.status(500).json({ error: "Eroare stergere istoric adoptii", details: err }); });
                    }

                    // 3. Stergem Animalul efectiv
                    connection.query('DELETE FROM Pets WHERE PetID = ?', [petId], (err) => {
                        if (err) {
                            return connection.rollback(() => { connection.release(); res.status(500).json({ error: "Eroare stergere animal (posibil alte dependinte)", details: err }); });
                        }

                        connection.commit((err) => {
                            if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                            
                            connection.release();
                            res.json({ success: true, message: 'Animal si datele asociate sterse cu succes.' });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;