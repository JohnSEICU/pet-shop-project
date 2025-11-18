const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware pentru verificare token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// RUTA PRINCIPALĂ - Redirecționează către login
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// RUTA LOGIN
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const db = require("./config/db");

    const sql = "SELECT * FROM Users WHERE Username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Utilizator inexistent' });
        }

        const user = results[0];
        const validPassword = (password === 'parola123'); // Simplificat pentru demo

        if (!validPassword) {
            return res.status(401).json({ error: 'Parolă incorectă' });
        }

        const token = jwt.sign(
            { 
                userId: user.UserID, 
                username: user.Username, 
                role: user.Role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.UserID,
                username: user.Username,
                email: user.Email,
                role: user.Role
            }
        });
    });
});

// RUTE EXISTENTE PENTRU API
app.use("/api/users", require("./routes/users"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/pets", require("./routes/pets"));
app.use("/api/products", require("./routes/products"));
app.use("/api/services", require("./routes/services"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/orders", require("./routes/orders"));

// RUTE COMPLETE PENTRU TOATE TABELELE

// GET all species
app.get("/api/species", (req, res) => {
    const db = require("./config/db");
    db.query("SELECT * FROM Species ORDER BY Name", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET all categories
app.get("/api/categories", (req, res) => {
    const db = require("./config/db");
    db.query("SELECT * FROM Categories ORDER BY Name", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET complete dashboard data
app.get("/api/dashboard", (req, res) => {
    const db = require("./config/db");
    
    const queries = {
        totalPets: "SELECT COUNT(*) as count FROM Pets WHERE Available = true",
        totalProducts: "SELECT COUNT(*) as count FROM Products", 
        totalCustomers: "SELECT COUNT(*) as count FROM Customers",
        totalSpecies: "SELECT COUNT(*) as count FROM Species",
        totalCategories: "SELECT COUNT(*) as count FROM Categories",
        totalSuppliers: "SELECT COUNT(*) as count FROM Suppliers",
        totalServices: "SELECT COUNT(*) as count FROM Services",
        totalOrders: "SELECT COUNT(*) as count FROM Orders",
        totalUsers: "SELECT COUNT(*) as count FROM Users"
    };

    Promise.all([
        db.promise().query(queries.totalPets),
        db.promise().query(queries.totalProducts),
        db.promise().query(queries.totalCustomers),
        db.promise().query(queries.totalSpecies),
        db.promise().query(queries.totalCategories),
        db.promise().query(queries.totalSuppliers),
        db.promise().query(queries.totalServices),
        db.promise().query(queries.totalOrders),
        db.promise().query(queries.totalUsers)
    ]).then(([
        [pets], [products], [customers], [species], [categories],
        [suppliers], [services], [orders], [users]
    ]) => {
        res.json({
            stats: {
                pets: pets[0].count,
                products: products[0].count, 
                customers: customers[0].count,
                species: species[0].count,
                categories: categories[0].count,
                suppliers: suppliers[0].count,
                services: services[0].count,
                orders: orders[0].count,
                users: users[0].count
            },
            message: "Complete dashboard data",
            timestamp: new Date().toISOString()
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// RUTE COMPATIBILITATE - pentru frontend-ul existent
app.use("/pets", require("./routes/pets"));
app.use("/products", require("./routes/products"));
app.use("/customers", require("./routes/customers"));
app.use("/users", require("./routes/users"));

// RUTĂ PENTRU VERIFICARE SERVER
app.get("/api/status", (req, res) => {
    res.json({
        status: "Server is running 🚀",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: process.env.DB_NAME || 'pricopi_robert_alexandru_341b1'
    });
});

// RUTĂ PENTRU PAGINA HOME
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// RUTĂ PENTRU PAGINA LOGIN
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware pentru erori 404
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        path: req.path,
        method: req.method
    });
});

// Middleware pentru gestionarea erorilor globale
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: "Internal server error",
        message: err.message
    });
});

// Pornire server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🐾 Pet Shop Server running on port ${PORT}`);
    console.log(`📍 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`🏠 Home: http://localhost:${PORT}/home`);
});