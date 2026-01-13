const express = require('express');
const path = require('path');
const cors = require('cors'); // Ai acest pachet in package.json
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
// Folosim parser-ul nativ din Express (nu mai e nevoie de body-parser separat)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

// Rute
app.use('/api/users', require('./routes/users'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/products', require('./routes/products'));
app.use('/api/services', require('./routes/services'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));

// Fallback Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`Server activ pe portul ${PORT}`));