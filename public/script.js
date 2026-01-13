const API_URL = 'http://localhost:3000/api';
let currentUser = JSON.parse(localStorage.getItem('user'));
let isEditMode = false;
let editId = null;

// --- AUTH & INIT ---
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    try {
        const res = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        if(data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'home.html';
        } else { alert('Eroare: ' + data.message); }
    } catch(err) { console.error(err); }
});

if (window.location.pathname.includes('home.html')) {
    if (!currentUser) window.location.href = 'index.html';
    document.getElementById('welcome-msg').innerText = `Salut, ${currentUser.Username}`;
    
    if (currentUser.Role === 'admin') {
        document.getElementById('admin-view').style.display = 'block';
    } else {
        document.getElementById('user-view').style.display = 'block';
        loadUserShop();
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// --- ADMIN (CRUD) ---
async function loadAdminData(entity) {
    cancelEdit();
    try {
        const res = await fetch(`${API_URL}/${entity}`);
        const data = await res.json();
        const container = document.getElementById('data-display');
        
        if (!data.length) { container.innerHTML = '<p>Nu exista date.</p>'; setupForm(entity); return; }

        const keys = Object.keys(data[0]);
        const idKey = keys.find(k => k.endsWith('ID') && k.length > 2) || 'id';

        let html = `<table><thead><tr>${keys.map(k=>`<th>${k}</th>`).join('')}<th>Actiuni</th></tr></thead><tbody>`;
        html += data.map(row => {
            const rowString = encodeURIComponent(JSON.stringify(row));
            return `<tr>
                ${keys.map(k => `<td>${row[k]}</td>`).join('')}
                <td style="display:flex; gap:5px;">
                    <button style="background:#f39c12" onclick="startEdit('${entity}', '${idKey}', '${row[idKey]}', '${rowString}')">Editeaza</button>
                    <button style="background:#c0392b" onclick="deleteItem('${entity}', ${row[idKey]})">Sterge</button>
                </td>
            </tr>`;
        }).join('');
        html += '</tbody></table>';
        container.innerHTML = html;
        setupForm(entity);
    } catch (e) { console.error(e); }
}

// Search Function (Variable Parameter)
async function searchProduct() {
    const term = document.getElementById('search-input').value;
    try {
        const res = await fetch(`${API_URL}/products/search?q=${term}`);
        const data = await res.json();
        const container = document.getElementById('data-display');
        
        if (!data.length) { container.innerHTML = '<p>Niciun produs gasit.</p>'; return; }

        const keys = Object.keys(data[0]);
        let html = `<table><thead><tr>${keys.map(k=>`<th>${k}</th>`).join('')}</tr></thead><tbody>`;
        html += data.map(row => `<tr>${keys.map(k => `<td>${row[k]}</td>`).join('')}</tr>`).join('');
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (e) { console.error(e); }
}

function setupForm(entity) {
    const form = document.getElementById('admin-form');
    form.innerHTML = '';
    
    // Simplistic handling for 'services/appointments' which is read-only
    if (entity.includes('/')) { form.innerHTML = '<p>Vizualizare doar.</p>'; return; }

    let fields = [];
    if(entity === 'products') fields = ['Name', 'Price', 'Stock', 'CategoryID', 'Description'];
    if(entity === 'pets') fields = ['Name', 'Age', 'Gender', 'Price', 'SpeciesID'];
    if(entity === 'suppliers') fields = ['Name', 'ContactEmail', 'Phone', 'Address'];
    if(entity === 'services') fields = ['Name', 'Description', 'Price', 'DurationMinutes'];

    if(fields.length > 0) {
        form.innerHTML = fields.map(f => `<div><label>${f}:</label><input id="field-${f}" name="${f}" placeholder="${f}" required style="width:100%"></div>`).join('') + 
        `<div style="margin-top:10px"><button type="submit" id="submit-btn" style="background:#27ae60">Adauga</button> <button type="button" id="cancel-btn" onclick="cancelEdit()" style="display:none;background:#7f8c8d">Anuleaza</button></div>`;
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            const body = {};
            fields.forEach(f => {
                const val = document.getElementById(`field-${f}`).value;
                body[f] = isNaN(val) ? val : Number(val);
            });
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `${API_URL}/${entity}/${editId}` : `${API_URL}/${entity}`;
            
            await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
            loadAdminData(entity);
            form.reset(); cancelEdit();
        };
    } else { form.innerHTML = '<p>Fara formular editare.</p>'; }
}

window.startEdit = function(entity, idKey, idVal, rowEnc) {
    isEditMode = true; editId = idVal;
    const row = JSON.parse(decodeURIComponent(rowEnc));
    document.getElementById('crud-area').scrollIntoView();
    document.getElementById('submit-btn').innerText = 'Salveaza';
    document.getElementById('submit-btn').style.background = '#f39c12';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    Object.keys(row).forEach(k => {
        const i = document.getElementById(`field-${k}`);
        if(i) i.value = row[k];
    });
}

window.cancelEdit = function() {
    isEditMode = false; editId = null;
    document.getElementById('admin-form').reset();
    const btn = document.getElementById('submit-btn');
    if(btn) { btn.innerText = 'Adauga'; btn.style.background = '#27ae60'; }
    const cBtn = document.getElementById('cancel-btn');
    if(cBtn) cBtn.style.display = 'none';
}

async function deleteItem(entity, id) {
    if(confirm('Sigur stergi?')) {
        const res = await fetch(`${API_URL}/${entity}/${id}`, { method: 'DELETE' });
        const d = await res.json();
        if(res.ok && d.success) loadAdminData(entity);
        else alert('Eroare: ' + (d.error || d.sqlMessage || 'Operatiune esuata'));
    }
}

async function fetchReport(ep) {
    const res = await fetch(`${API_URL}/${ep}`);
    const data = await res.json();
    const div = document.getElementById('report-result');
    if(!data.length) { div.innerHTML = 'Fara rezultate.'; return; }
    const k = Object.keys(data[0]);
    div.innerHTML = `<table><thead><tr>${k.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>` + 
    data.map(r => `<tr>${k.map(x=>`<td>${r[x]}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}

// --- SHOP (USER) ---
async function loadUserShop() {
    try {
        const pRes = await fetch(`${API_URL}/products`);
        const prods = await pRes.json();
        document.getElementById('shop-products').innerHTML = prods.map(p => `
            <div class="card">
                <h4>${p.Name}</h4>
                <p>${p.Description || ''}</p>
                <p style="color:red;font-weight:bold">${p.Price} RON</p>
                <p style="font-size:0.9em">Stoc: ${p.Stock}</p>
                <button onclick="buyProduct(${p.ProductID}, 1)" ${p.Stock < 1 ? 'disabled style="background:grey"' : ''}>
                    ${p.Stock < 1 ? 'Stoc Epuizat' : 'Cumpara'}
                </button>
            </div>
        `).join('');

        const ptRes = await fetch(`${API_URL}/pets`);
        const pets = await ptRes.json();
        const availablePets = pets.filter(p => p.Available === 1);
        
        if (availablePets.length === 0) {
            document.getElementById('shop-pets').innerHTML = '<p>Nu sunt animale disponibile momentan.</p>';
        } else {
            document.getElementById('shop-pets').innerHTML = availablePets.map(p => `
                <div class="card">
                    <h4>${p.Name} (${p.SpeciesName || 'Animal'})</h4>
                    <p>Varsta: ${p.Age} ani</p>
                    <p style="color:blue;font-weight:bold">${p.Price} RON</p>
                    <button onclick="adoptPet(${p.PetID})" style="background:#9b59b6">Adopta</button>
                </div>
            `).join('');
        }
        
        if(currentUser.CustomerID) {
            const oRes = await fetch(`${API_URL}/orders/my-orders/${currentUser.CustomerID}`);
            const orders = await oRes.json();
            document.getElementById('my-orders').innerHTML = orders.map(o => 
                `<div class="card">Comanda #${o.OrderID} - ${o.TotalAmount} RON (${new Date(o.OrderDate).toLocaleDateString()})</div>`
            ).join('');
        } else {
            document.getElementById('my-orders').innerHTML = '<p>Contul nu are profil de client asociat.</p>';
        }
    } catch(e) { console.error(e); }
}

async function buyProduct(id, qty) {
    if(!confirm('Cumperi produsul?')) return;
    performOrder(`${API_URL}/orders/create`, { CustomerID: currentUser.CustomerID, ProductID: id, Quantity: qty });
}

async function adoptPet(id) {
    if(!confirm('Adopti acest animal?')) return;
    performOrder(`${API_URL}/orders/adopt`, { CustomerID: currentUser.CustomerID, PetID: id });
}

async function performOrder(url, body) {
    if(!currentUser.CustomerID) return alert('Eroare: User fara profil Client.');
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        const d = await res.json();
        if(d.success) {
            alert(d.message);
            loadUserShop();
        } else {
            alert('Eroare: ' + d.error);
        }
    } catch(e) { console.error(e); alert('Eroare server'); }
}