const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all pets + species
router.get("/", (req, res) => {
    const sql = `
        SELECT Pets.*, Species.Name AS SpeciesName
        FROM Pets
        JOIN Species ON Pets.SpeciesID = Species.SpeciesID
        ORDER BY Pets.Name
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET pet by ID
router.get("/:id", (req, res) => {
    const sql = `
        SELECT Pets.*, Species.Name AS SpeciesName
        FROM Pets
        JOIN Species ON Pets.SpeciesID = Species.SpeciesID
        WHERE Pets.PetID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(results[0]);
    });
});

// ADD pet
router.post("/", (req, res) => {
    const { Name, Age, Gender, Price, Available, SpeciesID, ImageURL, Description } = req.body;

    const sql = `
        INSERT INTO Pets (Name, Age, Gender, Price, Available, SpeciesID, ImageURL, Description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [Name, Age, Gender, Price, Available, SpeciesID, ImageURL, Description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Pet added!", id: result.insertId });
        }
    );
});

// UPDATE pet
router.put("/:id", (req, res) => {
    const { Name, Age, Gender, Price, Available, SpeciesID, ImageURL, Description } = req.body;
    
    const sql = `
        UPDATE Pets 
        SET Name = ?, Age = ?, Gender = ?, Price = ?, Available = ?, SpeciesID = ?, ImageURL = ?, Description = ?
        WHERE PetID = ?
    `;
    
    db.query(sql,
        [Name, Age, Gender, Price, Available, SpeciesID, ImageURL, Description, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Pet updated!" });
        }
    );
});

// DELETE pet
router.delete("/:id", (req, res) => {
    const sql = "DELETE FROM Pets WHERE PetID = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Pet deleted!" });
    });
});

module.exports = router;