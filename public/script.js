// URL-ul de bază al API-ului
const API_BASE = 'http://localhost:3000';

// Funcția de login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    // Ascunde mesajele anterioare
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validare basic
    if (!username || !password) {
        errorDiv.textContent = 'Te rog completează toate câmpurile!';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            successDiv.textContent = 'Login successful! Redirecting...';
            successDiv.style.display = 'block';
            
            // Redirect to home page after 1 second
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            // Login failed
            errorDiv.textContent = data.error || 'Login failed!';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Eroare de conexiune la server! Verifică dacă serverul rulează.';
        errorDiv.style.display = 'block';
        console.error('Login error:', error);
    }
}

// Funcția de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Verifică dacă utilizatorul este autentificat
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname.includes('home.html')) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// === FUNCȚII PENTRU ÎNCĂRCARE DATE ===

// Încarcă statisticile complete
async function loadCompleteStats() {
    try {
        showLoading('statsContainer', 'Se încarcă statisticile...');
        const response = await fetch(`${API_BASE}/api/dashboard`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const stats = data.stats;
        
        // Actualizează toate statisticile
        document.getElementById('statsPets').textContent = stats.pets;
        document.getElementById('statsProducts').textContent = stats.products;
        document.getElementById('statsCustomers').textContent = stats.customers;
        document.getElementById('statsSpecies').textContent = stats.species;
        document.getElementById('statsCategories').textContent = stats.categories;
        document.getElementById('statsSuppliers').textContent = stats.suppliers;
        document.getElementById('statsServices').textContent = stats.services;
        document.getElementById('statsOrders').textContent = stats.orders;
        document.getElementById('statsUsers').textContent = stats.users;
        
        console.log('✅ Complete stats loaded:', stats);
    } catch (error) {
        console.error('Error loading complete stats:', error);
        document.getElementById('statsContainer').innerHTML = `
            <div class="error" style="grid-column: 1 / -1;">
                Eroare la încărcarea statisticilor: ${error.message}
            </div>
        `;
    }
}

// Încarcă animalele
async function loadPets() {
    try {
        showLoading('petsContainer', 'Se încarcă animalele...');
        const response = await fetch(`${API_BASE}/api/pets`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const pets = await response.json();
        
        const petsContainer = document.getElementById('petsContainer');
        if (!pets || pets.length === 0) {
            petsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; padding: 2rem;">Nu există animale disponibile momentan</p>';
            return;
        }
        
        petsContainer.innerHTML = pets.map(pet => `
            <div class="product-card">
                <div class="product-image">
                    ${getPetEmoji(pet.SpeciesName)}
                </div>
                <div class="product-name">${pet.Name}</div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    <div><strong>Vârstă:</strong> ${pet.Age} ani</div>
                    <div><strong>Gen:</strong> ${pet.Gender}</div>
                    <div><strong>Specie:</strong> ${pet.SpeciesName || 'Nespecificat'}</div>
                </div>
                <div class="product-price">${parseFloat(pet.Price).toFixed(2)} RON</div>
                <div class="product-stock" style="color: ${pet.Available ? '#27ae60' : '#e74c3c'};">
                    ${pet.Available ? '🟢 Disponibil' : '🔴 Indisponibil'}
                </div>
                <div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">
                    ${pet.Description || 'Fără descriere'}
                </div>
            </div>
        `).join('');
        
        console.log('✅ Pets loaded successfully:', pets.length, 'pets');
    } catch (error) {
        console.error('Error loading pets:', error);
        document.getElementById('petsContainer').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea animalelor: ${error.message}
                </p>
                <button onclick="loadPets()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă animalele
                </button>
            </div>
        `;
    }
}

// Încarcă produsele
async function loadProducts() {
    try {
        showLoading('productsContainer', 'Se încarcă produsele...');
        const response = await fetch(`${API_BASE}/api/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        const productsContainer = document.getElementById('productsContainer');
        if (!products || products.length === 0) {
            productsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; padding: 2rem;">Nu există produse disponibile momentan</p>';
            return;
        }
        
        productsContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    🛍️
                </div>
                <div class="product-name">${product.Name}</div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    ${product.Description || 'Fără descriere'}
                </div>
                <div class="product-price">${parseFloat(product.Price).toFixed(2)} RON</div>
                <div class="product-stock" style="color: ${product.Stock > 0 ? '#27ae60' : '#e74c3c'};">
                    ${product.Stock > 0 ? `Stoc: ${product.Stock} bucăți` : 'Stoc epuizat'}
                </div>
                ${product.CategoryName ? 
                    `<div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;"><strong>Categorie:</strong> ${product.CategoryName}</div>` : 
                    ''
                }
            </div>
        `).join('');
        
        console.log('✅ Products loaded successfully:', products.length, 'products');
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsContainer').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea produselor: ${error.message}
                </p>
                <button onclick="loadProducts()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă produsele
                </button>
            </div>
        `;
    }
}

// Încarcă clienții
async function loadCustomers() {
    try {
        showLoading('customersContainer', 'Se încarcă clienții...');
        const response = await fetch(`${API_BASE}/api/customers`);
        const customers = await response.json();
        
        const container = document.getElementById('customersContainer');
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nume</th>
                        <th>Prenume</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Adresă</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(customer => `
                        <tr>
                            <td>${customer.CustomerID}</td>
                            <td><strong>${customer.LastName}</strong></td>
                            <td>${customer.FirstName}</td>
                            <td>${customer.Username || 'N/A'}</td>
                            <td>${customer.Email || 'N/A'}</td>
                            <td>${customer.Phone}</td>
                            <td>${customer.Address}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="padding: 1rem; text-align: center; color: #666;">
                Total clienți: ${customers.length}
            </div>
        `;
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('customersContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea clienților: ${error.message}
                </p>
                <button onclick="loadCustomers()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă clienții
                </button>
            </div>
        `;
    }
}

// Încarcă comenzile
async function loadOrders() {
    try {
        showLoading('ordersContainer', 'Se încarcă comenzile...');
        const response = await fetch(`${API_BASE}/api/orders`);
        const orders = await response.json();
        
        const container = document.getElementById('ordersContainer');
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID Comandă</th>
                        <th>Client</th>
                        <th>Data</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => {
                        const statusClass = order.Status.toLowerCase().replace(' ', '-');
                        return `
                        <tr>
                            <td>#${order.OrderID}</td>
                            <td><strong>${order.FirstName} ${order.LastName}</strong></td>
                            <td>${new Date(order.OrderDate).toLocaleDateString('ro-RO')}</td>
                            <td><strong>${parseFloat(order.TotalAmount).toFixed(2)} RON</strong></td>
                            <td><span class="status-${statusClass}">${order.Status}</span></td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
            <div style="padding: 1rem; text-align: center; color: #666;">
                Total comenzi: ${orders.length}
            </div>
        `;
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea comenzilor: ${error.message}
                </p>
                <button onclick="loadOrders()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă comenzile
                </button>
            </div>
        `;
    }
}

// Încarcă serviciile
async function loadServices() {
    try {
        showLoading('servicesContainer', 'Se încarcă serviciile...');
        const response = await fetch(`${API_BASE}/api/services`);
        const services = await response.json();
        
        const container = document.getElementById('servicesContainer');
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nume Serviciu</th>
                        <th>Descriere</th>
                        <th>Preț</th>
                        <th>Durata</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map(service => `
                        <tr>
                            <td>${service.ServiceID}</td>
                            <td><strong>${service.Name}</strong></td>
                            <td>${service.Description}</td>
                            <td><strong>${parseFloat(service.Price).toFixed(2)} RON</strong></td>
                            <td>${service.DurationMinutes} min</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="padding: 1rem; text-align: center; color: #666;">
                Total servicii: ${services.length}
            </div>
        `;
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('servicesContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea serviciilor: ${error.message}
                </p>
                <button onclick="loadServices()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă serviciile
                </button>
            </div>
        `;
    }
}

// Încarcă furnizorii
async function loadSuppliers() {
    try {
        showLoading('suppliersContainer', 'Se încarcă furnizorii...');
        const response = await fetch(`${API_BASE}/api/suppliers`);
        const suppliers = await response.json();
        
        const container = document.getElementById('suppliersContainer');
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nume Furnizor</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Adresă</th>
                    </tr>
                </thead>
                <tbody>
                    ${suppliers.map(supplier => `
                        <tr>
                            <td>${supplier.SupplierID}</td>
                            <td><strong>${supplier.Name}</strong></td>
                            <td>${supplier.ContactEmail}</td>
                            <td>${supplier.Phone}</td>
                            <td>${supplier.Address}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="padding: 1rem; text-align: center; color: #666;">
                Total furnizori: ${suppliers.length}
            </div>
        `;
    } catch (error) {
        console.error('Error loading suppliers:', error);
        document.getElementById('suppliersContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea furnizorilor: ${error.message}
                </p>
                <button onclick="loadSuppliers()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă furnizorii
                </button>
            </div>
        `;
    }
}

// Încarcă speciile
async function loadSpecies() {
    try {
        showLoading('speciesContainer', 'Se încarcă speciile...');
        const response = await fetch(`${API_BASE}/api/species`);
        const species = await response.json();
        
        const container = document.getElementById('speciesContainer');
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nume Specie</th>
                        <th>Descriere</th>
                    </tr>
                </thead>
                <tbody>
                    ${species.map(specie => `
                        <tr>
                            <td>${specie.SpeciesID}</td>
                            <td><strong>${getPetEmoji(specie.Name)} ${specie.Name}</strong></td>
                            <td>${specie.Description}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="padding: 1rem; text-align: center; color: #666;">
                Total specii: ${species.length}
            </div>
        `;
    } catch (error) {
        console.error('Error loading species:', error);
        document.getElementById('speciesContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea speciilor: ${error.message}
                </p>
                <button onclick="loadSpecies()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă speciile
                </button>
            </div>
        `;
    }
}

// Încarcă categoriile
async function loadCategories() {
    try {
        showLoading('categoriesContainer', 'Se încarcă categoriile...');
        const response = await fetch(`${API_BASE}/api/categories`);
        const categories = await response.json();
        
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nume Categorie</th>
                        <th>Descriere</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(category => `
                        <tr>
                            <td>${category.CategoryID}</td>
                            <td><strong>${category.Name}</strong></td>
                            <td>${category.Description}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="padding: 1rem; text-align: center; color: #666;">
                Total categorii: ${categories.length}
            </div>
        `;
    } catch (error) {
        console.error('Error loading categories:', error);
        document.getElementById('categoriesContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; background: #ffeaea; padding: 1rem; border-radius: 5px;">
                    ❌ Eroare la încărcarea categoriilor: ${error.message}
                </p>
                <button onclick="loadCategories()" class="btn" style="width: auto; margin-top: 1rem;">
                    Reîncarcă categoriile
                </button>
            </div>
        `;
    }
}

// === FUNCȚII UTILITARE ===

// Funcție helper pentru emoji-uri
function getPetEmoji(speciesName) {
    const emojiMap = {
        'câine': '🐕',
        'caine': '🐕',
        'pisică': '🐈',
        'pisica': '🐈',
        'papagal': '🦜',
        'iepure': '🐇',
        'hamster': '🐹',
        'pește': '🐠'
    };
    
    return emojiMap[speciesName.toLowerCase()] || '🐾';
}

// Afișează loading indicator
function showLoading(containerId, message = 'Se încarcă...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="color: #667eea; font-size: 1.2rem; margin-bottom: 1rem;">${message}</div>
                <div class="loading"></div>
            </div>
        `;
    }
}

// Afișează informațiile utilizatorului
function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const welcomeElement = document.getElementById('userWelcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Bun venit, ${user.username} (${user.role})!`;
    }
}

// Verifică statusul serverului
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/status`);
        const data = await response.json();
        console.log('✅ Server status:', data.status);
        return true;
    } catch (error) {
        console.error('❌ Server is not responding:', error);
        return false;
    }
}

// Funcții pentru navigare
function showSection(sectionName) {
    // Ascunde toate secțiunile
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Arată secțiunea selectată
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Încarcă datele pentru secțiunea respectivă
    switch(sectionName) {
        case 'pets':
            loadPets();
            break;
        case 'products':
            loadProducts();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'services':
            loadServices();
            break;
        case 'suppliers':
            loadSuppliers();
            break;
        case 'species':
            loadSpecies();
            break;
        case 'categories':
            loadCategories();
            break;
    }
}

// Reîncarcă toate datele
async function refreshAllData() {
    console.log('🔄 Refreshing all data...');
    await loadCompleteStats();
    await loadPets();
    await loadProducts();
    await loadCustomers();
    await loadOrders();
    await loadServices();
    await loadSuppliers();
    await loadSpecies();
    await loadCategories();
    console.log('✅ All data refreshed!');
    
    // Show success message
    const tempMessage = document.createElement('div');
    tempMessage.className = 'success';
    tempMessage.textContent = 'Datele au fost actualizate cu succes!';
    tempMessage.style.position = 'fixed';
    tempMessage.style.top = '20px';
    tempMessage.style.right = '20px';
    tempMessage.style.zIndex = '1000';
    document.body.appendChild(tempMessage);
    
    setTimeout(() => {
        tempMessage.remove();
    }, 3000);
}

// Încarcă toate datele pentru homepage
async function loadHomepageData() {
    console.log('🔄 Loading complete homepage data...');
    
    // Încarcă statisticile prima dată
    await loadCompleteStats();
    
    // Apoi încarcă restul datelor în paralel pentru performanță
    await Promise.all([
        loadPets(),
        loadProducts(),
        loadCustomers(),
        loadOrders(),
        loadServices(),
        loadSuppliers(),
        loadSpecies(),
        loadCategories()
    ]);
    
    console.log('✅ All homepage data loaded successfully');
}

// Inițializare pagină
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing application...');
    
    // Verifică statusul serverului
    const serverOnline = await checkServerStatus();
    if (!serverOnline) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = 'Serverul nu este disponibil. Verifică dacă serverul rulează.';
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    // Pagina de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('🔐 Login page initialized');
    }
    
    // Pagina home
    if (window.location.pathname.includes('home.html')) {
        if (checkAuth()) {
            console.log('👤 User authenticated, loading homepage...');
            displayUserInfo();
            
            // Încarcă toate datele
            await loadHomepageData();
        }
    }
    
    // Auto-fill pentru testing (opțional)
    if (loginForm && window.location.hostname === 'localhost') {
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'parola123';
        console.log('🔧 Auto-filled test credentials for localhost');
    }
});

// Error boundary pentru a prinde erorile neașteptate
window.addEventListener('error', function(event) {
    console.error('💥 Unhandled error:', event.error);
});

// Online/offline detection
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
});

window.addEventListener('offline', () => {
    console.log('❌ Connection lost');
    alert('Conexiunea la internet a fost pierdută!');
});