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

// Obține token-ul pentru request-uri
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Încarcă statisticile
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/home-stats`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const stats = await response.json();
        
        const statsContainer = document.getElementById('statsContainer');
        statsContainer.innerHTML = `
            <div class="stat-card">
                <span class="stat-number">${stats.pets}</span>
                <span>Animale</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.products}</span>
                <span>Produse</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.customers}</span>
                <span>Clienți</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.species}</span>
                <span>Specii</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.categories}</span>
                <span>Categorii</span>
            </div>
        `;
        
        console.log('✅ Stats loaded successfully:', stats);
    } catch (error) {
        console.error('Error loading stats:', error);
        const statsContainer = document.getElementById('statsContainer');
        statsContainer.innerHTML = `
            <div class="error" style="grid-column: 1 / -1;">
                Eroare la încărcarea statisticilor: ${error.message}
            </div>
        `;
    }
}

// Încarcă produsele
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        const productsContainer = document.getElementById('productsContainer');
        if (!products || products.length === 0) {
            productsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Nu există produse disponibile momentan</p>';
            return;
        }
        
        productsContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    ${product.ImageURL ? 
                        `<img src="${product.ImageURL}" alt="${product.Name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">` : 
                        '🛍️'
                    }
                </div>
                <div class="product-name">${product.Name}</div>
                <div class="product-description" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    ${product.Description || 'Fără descriere'}
                </div>
                <div class="product-price" style="color: #667eea; font-weight: bold; font-size: 1.2rem;">
                    ${parseFloat(product.Price).toFixed(2)} RON
                </div>
                <div class="product-stock" style="color: ${product.Stock > 0 ? '#27ae60' : '#e74c3c'}; font-size: 0.9rem;">
                    ${product.Stock > 0 ? `Stoc: ${product.Stock} bucăți` : 'Stoc epuizat'}
                </div>
                ${product.CategoryName ? 
                    `<div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">Categorie: ${product.CategoryName}</div>` : 
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

// Încarcă animalele
async function loadPets() {
    try {
        const response = await fetch(`${API_BASE}/api/pets`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const pets = await response.json();
        
        const petsContainer = document.getElementById('petsContainer');
        if (!pets || pets.length === 0) {
            petsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Nu există animale disponibile momentan</p>';
            return;
        }
        
        petsContainer.innerHTML = pets.map(pet => `
            <div class="product-card">
                <div class="product-image">
                    ${pet.ImageURL ? 
                        `<img src="${pet.ImageURL}" alt="${pet.Name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">` : 
                        '🐾'
                    }
                </div>
                <div class="product-name">${pet.Name}</div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    <div>Vârstă: ${pet.Age} ani</div>
                    <div>Gen: ${pet.Gender}</div>
                    <div>Specie: ${pet.SpeciesName || 'Nespecificat'}</div>
                </div>
                <div class="product-price" style="color: #667eea; font-weight: bold; font-size: 1.2rem;">
                    ${parseFloat(pet.Price).toFixed(2)} RON
                </div>
                <div class="product-stock" style="color: ${pet.Available ? '#27ae60' : '#e74c3c'}; font-size: 0.9rem;">
                    ${pet.Available ? '🟢 Disponibil' : '🔴 Indisponibil'}
                </div>
                <div class="product-description" style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">
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

// Încarcă toate datele pentru homepage
async function loadHomepageData() {
    console.log('🔄 Loading homepage data...');
    
    // Încarcă statisticile prima dată
    await loadStats();
    
    // Apoi încarcă produsele și animalele în paralel
    await Promise.all([
        loadProducts(),
        loadPets()
    ]);
    
    console.log('✅ All homepage data loaded successfully');
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

// Afișează loading indicator
function showLoading(containerId, message = 'Se încarcă...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div style="color: #667eea; font-size: 1.2rem;">${message}</div>
                <div style="margin-top: 1rem;">⏳</div>
            </div>
        `;
    }
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
            
            // Afișează loading indicators
            showLoading('statsContainer', 'Se încarcă statisticile...');
            showLoading('productsContainer', 'Se încarcă produsele...');
            showLoading('petsContainer', 'Se încarcă animalele...');
            
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

// Funcție pentru refresh manual
function refreshData() {
    if (confirm('Sigur dorești să reîncarci toate datele?')) {
        loadHomepageData();
    }
}

// Adaugă buton de refresh în homepage (opțional)
function addRefreshButton() {
    const header = document.querySelector('.header');
    if (header) {
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn';
        refreshBtn.style.background = '#27ae60';
        refreshBtn.style.marginLeft = '1rem';
        refreshBtn.innerHTML = '🔄 Refresh';
        refreshBtn.onclick = refreshData;
        header.querySelector('.user-info').appendChild(refreshBtn);
    }
}

// Error boundary pentru a prinde erorile neașteptate
window.addEventListener('error', function(event) {
    console.error('💥 Unhandled error:', event.error);
});