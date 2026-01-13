const express = require('express');
const router = express.Router();
const db = require('../config/db');

// JOIN #4 (Existent): Orders + Customer Name
router.get('/', (req, res) => {
    const sql = `
        SELECT O.OrderID, O.OrderDate, O.TotalAmount, O.Status, C.FirstName, C.LastName 
        FROM Orders O 
        JOIN Customers C ON O.CustomerID = C.CustomerID 
        ORDER BY O.OrderDate DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// JOIN #6: Detalii Comanda (Items + Product Names) - Parametru Variabil (ID)
router.get('/details/:id', (req, res) => {
    const sql = `
        SELECT P.Name, OI.Quantity, OI.UnitPrice 
        FROM Order_Items OI
        JOIN Products P ON OI.ProductID = P.ProductID
        WHERE OI.OrderID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.get('/my-orders/:customerId', (req, res) => {
    const sql = 'SELECT * FROM Orders WHERE CustomerID = ? ORDER BY OrderDate DESC';
    db.query(sql, [req.params.customerId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// CREATE (Tranzactie existenta)
router.post('/create', (req, res) => {
    const { CustomerID, ProductID, Quantity } = req.body;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json(err);
        connection.beginTransaction(err => {
            if (err) { connection.release(); return res.status(500).json(err); }
            connection.query('SELECT Price, Stock FROM Products WHERE ProductID = ? FOR UPDATE', [ProductID], (err, prodRes) => {
                if (err || prodRes.length === 0) return connection.rollback(() => { connection.release(); res.status(404).json({ error: 'Produs invalid' }); });
                const product = prodRes[0];
                if (product.Stock < Quantity) return connection.rollback(() => { connection.release(); res.status(400).json({ error: 'Stoc insuficient' }); });
                const total = product.Price * Quantity;
                connection.query('INSERT INTO Orders (CustomerID, TotalAmount, Status) VALUES (?, ?, "Completed")', [CustomerID, total], (err, ordRes) => {
                    if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                    const orderId = ordRes.insertId;
                    connection.query('INSERT INTO Order_Items (OrderID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)', [orderId, ProductID, Quantity, product.Price], (err) => {
                        if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                        connection.query('UPDATE Products SET Stock = Stock - ? WHERE ProductID = ?', [Quantity, ProductID], (err) => {
                            if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                            connection.commit((err) => {
                                if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                                connection.release(); res.json({ success: true, message: 'Comanda reusita!' });
                            });
                        });
                    });
                });
            });
        });
    });
});

// ADOPT (Tranzactie existenta)
router.post('/adopt', (req, res) => {
    const { CustomerID, PetID } = req.body;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json(err);
        connection.beginTransaction(err => {
            if (err) { connection.release(); return res.status(500).json(err); }
            connection.query('SELECT Price, Available FROM Pets WHERE PetID = ? FOR UPDATE', [PetID], (err, petRes) => {
                if (err || petRes.length === 0) return connection.rollback(() => { connection.release(); res.status(404).json({ error: 'Animal invalid' }); });
                const pet = petRes[0];
                if (!pet.Available) return connection.rollback(() => { connection.release(); res.status(400).json({ error: 'Indisponibil' }); });
                connection.query('INSERT INTO Orders (CustomerID, TotalAmount, Status) VALUES (?, ?, "Completed")', [CustomerID, pet.Price], (err, ordRes) => {
                    if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                    connection.query('INSERT INTO Customer_Pets (CustomerID, PetID, PurchaseDate) VALUES (?, ?, NOW())', [CustomerID, PetID], (err) => {
                        if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                        connection.query('UPDATE Pets SET Available = 0 WHERE PetID = ?', [PetID], (err) => {
                            if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                            connection.commit((err) => {
                                if (err) return connection.rollback(() => { connection.release(); res.status(500).json(err); });
                                connection.release(); res.json({ success: true, message: 'Adoptat!' });
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;