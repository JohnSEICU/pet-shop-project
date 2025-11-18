# 🐾 Pet Shop Management System

## 📋 Descriere
Sistem complet de management pentru magazin de animale construit cu Node.js, Express.js, MySQL și JavaScript. Proiectul demonstrează o arhitectură full-stack cu autentificare, API RESTful și interfață web responsive.

## ✨ Caracteristici
- ✅ Autentificare utilizatori cu JWT
- ✅ Gestionare completă a datelor (CRUD)
- ✅ Dashboard cu statistici în timp real
- ✅ API RESTful pentru toate tabelele
- ✅ Interfață web responsive
- ✅ 5 înregistrări în fiecare tabel
- ✅ Validare și gestionare erori

## 🛠️ Tehnologii
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Autentificare:** JWT, bcryptjs
- **Middleware:** CORS, dotenv

## 🏗️ Structura Proiectului
pet-shop-project/
├── config/
│ └── db.js # Configurație MySQL
├── routes/ # Toate rutele API
│ ├── pets.js
│ ├── products.js
│ ├── customers.js
│ ├── users.js
│ ├── services.js
│ ├── suppliers.js
│ └── orders.js
├── public/ # Frontend
│ ├── index.html # Pagina de login
│ ├── home.html # Dashboard principal
│ ├── styles.css # Stiluri CSS
│ └── script.js # JavaScript frontend
├── database/
│ ├── Pricopi_Robert-Alexandru_341B1.sql # Schema bazei de date
│ └── seed_data.sql # Date de test (5 înregistrări/tabel)
├── server.js # Server principal
├── populate-database.js # Script populare date
├── test-db.js # Test conexiune database
├── package.json # Dependințe proiect
├── .env # Variabile de mediu
└── README.md # Documentație


## 🗃️ Baza de Date
Proiectul conține 14 tabele interconectate, fiecare cu exact 5 înregistrări:

### Tabele Principale
- **Users** - Utilizatori sistem (admin, customer)
- **Customers** - Clienți magazin cu date complete
- **Species** - Tipuri de animale (câini, pisici, etc.)
- **Categories** - Categorii produse (hrană, jucării, etc.)
- **Pets** - Animale disponibile pentru vânzare
- **Products** - Produse magazin
- **Suppliers** - Furnizori
- **Services** - Servicii oferite
- **Orders** - Comenzi clienți

### Tabele de Legătură
- **Order_Items** - Detalii comenzi
- **Product_Suppliers** - Relații produse-furnizori
- **Pet_Suppliers** - Relații animale-furnizori
- **Customer_Services** - Servicii prestate clienților
- **Customer_Pets** - Animale cumpărate de clienți

## 🚀 Instalare și Rulare

### 1. Precondiții
- Node.js (v14 sau mai recent)
- MySQL Server
- Git (opțional)

### 2. Configurare Proiect
```bash
# Clonează sau descarcă proiectul
cd pet-shop-project

# Instalează dependințele
npm install
```
### 3. Configurare Bază de Date

# Pornește MySQL Server
# Crează baza de date:
```sql
CREATE DATABASE pricopi_robert_alexandru_341b1

#Configurează fisierul .env:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pricopi_robert_alexandru_341b1
PORT=3000
JWT_SECRET=secret_key_pet_shop_robert_341b1
```
### 4. Populare Bază de Date
```bash
# Rulează scriptul de populare
npm run populate
```
###  5. Pornire Aplicație
```bash
# Mod development cu auto-reload
npm run dev

# Sau mod production
npm start
```
### 6. Accesare Aplicație
Deschide Browser-ul și accesează:
- Aplicație: http://localhost:3000
- API Status: http://localhost:3000/api/status

## Autentificare
Conturi predefinite pentru testare
- Admin
  - Username: admin
  - Parola: parola123
- Client:
  - Username: john_doe
  - Parola: parola123