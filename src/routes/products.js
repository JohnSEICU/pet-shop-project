const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all products + categories
router.get("/", (req, res) => {
    const sql = `
        SELECT Products.*, Categories.Name AS CategoryName
        FROM Products
        JOIN Categories ON Products.CategoryID = Categories.CategoryID
        ORDER BY Products.Name
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET product by ID
router.get("/:id", (req, res) => {
    const sql = `
        SELECT Products.*, Categories.Name AS CategoryName
        FROM Products
        JOIN Categories ON Products.CategoryID = Categories.CategoryID
        WHERE Products.ProductID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(results[0]);
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
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product added!", id: result.insertId });
        }
    );
});

// UPDATE product
router.put("/:id", (req, res) => {
    const { Name, Description, Price, Stock, CategoryID, ImageURL } = req.body;
    
    const sql = `
        UPDATE Products 
        SET Name = ?, Description = ?, Price = ?, Stock = ?, CategoryID = ?, ImageURL = ?
        WHERE ProductID = ?
    `;
    
    db.query(sql,
        [Name, Description, Price, Stock, CategoryID, ImageURL, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product updated!" });
        }
    );
});

module.exports = router;