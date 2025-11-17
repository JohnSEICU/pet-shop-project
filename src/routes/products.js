const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all products + categories
router.get("/", (req, res) => {
    const sql = `
        SELECT Products.*, Categories.Name AS CategoryName
        FROM Products
        JOIN Categories ON Products.CategoryID = Categories.CategoryID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// ADD product
router.post("/", (req, res) => {
    const { Name, Description, Price, Stock, CategoryID, ImageURL } = req.body;

    const sql = `
        INSERT INTO Products (Name, Description, Price, Stock, CategoryID, ImageURL)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [Name, Description, Price, Stock, CategoryID, ImageURL],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Product added!", id: result.insertId });
        }
    );
});

module.exports = router;
