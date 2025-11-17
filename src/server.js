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
app.use(express.static('public')); // Servește fișierele statice

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
        
        // Pentru demo, verifică parola simplă
        // În producție, folosește: await bcrypt.compare(password, user.Password)
        const validPassword = (password === 'parola123');

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

// RUTĂ PROTECTATĂ - exemplu profil utilizator
app.get("/api/profile", authenticateToken, (req, res) => {
    const db = require("./config/db");
    
    const sql = "SELECT UserID, Username, Email, Role, CreatedAt FROM Users WHERE UserID = ?";
    db.query(sql, [req.user.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilizator negăsit' });
        }
        
        res.json({
            user: results[0],
            message: 'Profil utilizator'
        });
    });
});

// STATISTICI PENTRU HOMEPAGE
app.get("/api/home-stats", (req, res) => {
    const db = require("./config/db");
    
    const queries = {
        totalPets: "SELECT COUNT(*) as count FROM Pets WHERE Available = true",
        totalProducts: "SELECT COUNT(*) as count FROM Products", 
        totalCustomers: "SELECT COUNT(*) as count FROM Customers",
        totalSpecies: "SELECT COUNT(*) as count FROM Species",
        totalCategories: "SELECT COUNT(*) as count FROM Categories",
        totalUsers: "SELECT COUNT(*) as count FROM Users"
    };

    Promise.all([
        db.promise().query(queries.totalPets),
        db.promise().query(queries.totalProducts),
        db.promise().query(queries.totalCustomers),
        db.promise().query(queries.totalSpecies),
        db.promise().query(queries.totalCategories),
        db.promise().query(queries.totalUsers)
    ]).then(([
        [pets], 
        [products], 
        [customers],
        [species],
        [categories],
        [users]
    ]) => {
        res.json({
            pets: pets[0].count,
            products: products[0].count, 
            customers: customers[0].count,
            species: species[0].count,
            categories: categories[0].count,
            users: users[0].count,
            message: "Database connection successful! ✅",
            timestamp: new Date().toISOString()
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// RUTE EXISTENTE PENTRU API
app.use("/api/users", require("./routes/users"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/pets", require("./routes/pets"));
app.use("/api/products", require("./routes/products"));

// RUTE PUBLICE SUPLIMENTARE
app.get("/api/species", (req, res) => {
    const db = require("./config/db");
    db.query("SELECT * FROM Species", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/api/categories", (req, res) => {
    const db = require("./config/db");
    db.query("SELECT * FROM Categories", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/api/services", (req, res) => {
    const db = require("./config/db");
    db.query("SELECT * FROM Services", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// RUTĂ PENTRU VERIFICARE SERVER
app.get("/api/status", (req, res) => {
    res.json({
        status: "Server is running 🚀",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: process.env.DB_NAME || 'pricopi_robert_alexandru_341b1'
    });
});

// RUTĂ PENTRU INFO API
app.get("/api/info", (req, res) => {
    res.json({
        name: "Pet Shop API",
        version: "1.0.0",
        author: "Robert Alexandru Pricopi",
        description: "Sistem de management pentru magazin de animale",
        endpoints: {
            auth: {
                login: "POST /api/login",
                profile: "GET /api/profile (protected)"
            },
            public: {
                status: "GET /api/status",
                stats: "GET /api/home-stats",
                species: "GET /api/species",
                categories: "GET /api/categories",
                services: "GET /api/services"
            },
            protected: {
                users: "GET/POST /api/users",
                customers: "GET/POST /api/customers", 
                pets: "GET/POST /api/pets",
                products: "GET/POST /api/products"
            }
        }
    });
});

// RUTĂ PENTRU PAGINA HOME (după login)
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
    console.log(`🔗 API: http://localhost:${PORT}/api/info`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`🏠 Home: http://localhost:${PORT}/home`);
    console.log(`📊 Stats: http://localhost:${PORT}/api/home-stats`);
});