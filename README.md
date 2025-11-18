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
- **pet-shop-project/**
  - **config/**
    - `db.js`
      - Configurație MySQL Connection Pool
      - Setări conexiune bază de date
      - Testare conexiune
  - **routes/**
    - `pets.js`
      - GET /api/pets - Listare animale
      - GET /api/pets/:id - Detalii animal
      - POST /api/pets - Adăugare animal
      - PUT /api/pets/:id - Actualizare animal
      - DELETE /api/pets/:id - Ștergere animal
    - `products.js`
      - GET /api/products - Listare produse
      - GET /api/products/:id - Detalii produs
      - POST /api/products - Adăugare produs
      - JOIN cu Categories pentru nume categorie
    - `customers.js`
      - GET /api/customers - Listare clienți
      - GET /api/customers/:id - Detalii client
      - POST /api/customers - Adăugare client
      - JOIN cu Users pentru date utilizator
    - `users.js`
      - GET /api/users - Listare utilizatori
      - GET /api/users/:id - Detalii utilizator
      - POST /api/users - Adăugare utilizator
      - Excludere câmp password din răspuns
    - `services.js**
      - GET /api/services - Listare servicii
      - GET /api/services/:id - Detalii serviciu
      - POST /api/services - Adăugare serviciu
    - `suppliers.js`
      - GET /api/suppliers - Listare furnizori
      - GET /api/suppliers/:id - Detalii furnizor
      - POST /api/suppliers - Adăugare furnizor
    - `orders.js`
      - GET /api/orders - Listare comenzi
      - GET /api/orders/:id - Detalii comandă
      - POST /api/orders - Adăugare comandă
      - JOIN cu Customers pentru date client
  - **public/**
    - `index.html`
      - Pagină de autentificare
      - Formular login
      - Validare client-side
      - Afișare mesaje eroare/succes
    - `home.html`
      - Dashboard principal
      - Statistici în timp real
      - Sistem de navigare
      - Secțiuni pentru fiecare tip de date
    - `styles.css`
      - Stiluri globale
      - Design responsive
      - Animații și tranziții
      - Stiluri componente:
        - Cards pentru produse/animale
        - Tabele pentru date
        - Butoane și formulare
        - Statistici și indicatori
    - `script.js`
      - Authentication Module
        - Funcție login
        - Management token JWT
        - Verificare sesiune
        - Logout
      - API Communication Module
        - Funcții fetch pentru fiecare endpoint
        - Management erori
        - Headers authentication
      - UI Management Module
        - Încărcare date pe secțiuni
        - Actualizare DOM
        - Event listeners
        - Loading indicators
      - Utility Functions
        - Formatare date
        - Validare input
        - Helpers diverse
  - **database/**
    - `Pricopi_Robert-Alexandru_341B1.sql`
      - Schema completă bazei de date
      - 14 tabele interconectate
      - Constraint-uri foreign key
      - Structură normalizată
    - `seed_data.sql`
      - Date de test pentru fiecare tabel
      - 5 înregistrări per tabel
      - Relații consistente între tabele
      - Date realiste pentru magazin pet shop
  - `server.js`
    - Aplicație Express.js principală
    - Middleware Configuration
      - CORS pentru cross-origin requests
      - JSON parsing pentru request bodies
      - Static file serving pentru frontend
    - Authentication System
      - JWT token verification middleware
      - Login endpoint (/api/login)
      - Password validation
    - Route Registration
      - Rute API pentru toate resursele
      - Rute compatibilitate pentru frontend
    - API Endpoints
      - GET /api/dashboard - Statistici complete
      - GET /api/home-stats - Statistici rapide
      - GET /api/species - Listă specii
      - GET /api/categories - Listă categorii
      - Rute pentru toate tabelele
    - Error Handling
      - 404 pentru rute inexistente
      - 500 pentru erori server
      - Formatare răspuns eroare
    - Server Startup
      - Configurare port din environment
      - Logging la pornire
      - Liste de endpoint-uri disponibile
  - `populate-database.js`
    - Script populare baza de date
    - Execuție fișier SQL seed_data.sql
    - Verificare număr înregistrări
    - Logging progres operații
    - Management erori
  - `test-db.js`
    - Test conexiune bază de date
    - Verificare query-uri pentru fiecare tabel
    - Validare număr înregistrări
    - Raport stare finală
  - `package.json`
    - Metadata proiect
    - Dependencies:
      - express - Web framework
      - mysql2 - MySQL driver
      - cors - CORS middleware
      - dotenv - Environment variables
      - bcryptjs - Password hashing
      - jsonwebtoken - JWT authentication
    - Dev Dependencies:
      - nodemon - Auto-restart development
    - Scripts:
      - npm run dev - Development cu auto-reload
      - npm start - Production
      - npm run populate - Populare baza de date
      - npm run test-db - Test conexiune
  - `.env`
    - Variabile de mediu:
      - DB_HOST - Host MySQL
      - DB_USER - Utilizator MySQL
      - DB_PASSWORD - Parolă MySQL
      - DB_NAME - Nume bază de date
      - PORT - Port aplicație
      - JWT_SECRET - Cheie semnătură JWT
  - `README.md`
    - Documentație completă proiect
    - Instrucțiuni instalare și configurare
    - Descriere arhitectură
    - Listă endpoint-uri API
    - Ghid utilizare

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

Pornește MySQL Server
Crează baza de date:
```sql
CREATE DATABASE pricopi_robert_alexandru_341b1
```
Configurează fisierul .env:
```
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