const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all pets + species
router.get("/", (req, res) => {
    const sql = `
        SELECT Pets.*, Species.Name AS SpeciesName
        FROM Pets
        JOIN Species ON Pets.SpeciesID = Species.SpeciesID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
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
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Pet added!", id: result.insertId });
        }
    );
});

module.exports = router;
