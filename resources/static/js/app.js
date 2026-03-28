// ==========================================
// 1. YARDIMCI FONKSİYONLAR
// ==========================================
function slugOlustur(metin) {
    const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
    let slug = metin.toLowerCase();
    for (let key in trMap) { slug = slug.replace(new RegExp(key, 'g'), trMap[key]); }
    return slug.replace(/[^-a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function notify(msg) {
    const toastEl = document.getElementById('liveToast');
    const toastMsg = document.getElementById('toastMessage');
    if (toastEl) {
        toastMsg.innerText = msg;
        new bootstrap.Toast(toastEl).show();
    } else { alert(msg); }
}

// ==========================================
// 2. ADMİN: KATEGORİ VE SÜRÜKLE-BIRAK
// ==========================================
async function loadAdminCategories() {
    const tbody = document.querySelector("#adminCategoryTable tbody");
    if (!tbody) return;

    const res = await fetch("/api/categories");
    const cats = await res.json();

    tbody.innerHTML = cats.map(c => `
        <tr draggable="true" data-id="${c.id}">
            <td style="cursor: grab; width: 40px; text-align: center;">
                <i class="fa-solid fa-bars drag-handle text-muted"></i>
            </td>
            <td>
                <img src="/uploads/${c.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" onerror="this.src='/images/default.jpg'">
            </td>
            <td class="fw-bold">${c.name}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm me-2" onclick="editCategoryPrompt(${c.id}, '${c.name}')">
                    <i class="fa-solid fa-pen"></i> Düzenle
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteCategory(${c.id})">
                    <i class="fa-solid fa-trash"></i> Sil
                </button>
            </td>
        </tr>
    `).join('');

    enableDragSort();
}

function enableDragSort() {
    const tbody = document.querySelector("#adminCategoryTable tbody");
    let draggedRow = null;

    tbody.querySelectorAll("tr").forEach(row => {
        row.addEventListener("dragstart", () => { draggedRow = row; row.classList.add("dragging"); });
        row.addEventListener("dragend", () => { row.classList.remove("dragging"); });
        row.addEventListener("dragover", (e) => { e.preventDefault(); });
        row.addEventListener("drop", () => {
            if (draggedRow !== row) {
                tbody.insertBefore(draggedRow, row);
                updateCategoryOrder();
            }
        });
    });
}

function updateCategoryOrder() {
    const rows = document.querySelectorAll("#adminCategoryTable tbody tr");
    const order = [];
    rows.forEach((row, index) => {
        order.push({ id: row.dataset.id, orderIndex: index });
    });

    fetch("/api/categories/update-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    }).then(() => notify("✅ Kategori sırası güncellendi"));
}

// ==========================================
// 3. ADMİN: ÜRÜN LİSTESİ VE İŞLEMLER
// ==========================================
async function loadAdminTables() {
    const tbody = document.querySelector("#adminProductTable tbody");
    if (!tbody) return;

    const res = await fetch("/products");
    const products = await res.json();

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="/uploads/${p.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" onerror="this.src='/images/default.jpg'"></td>
            <td>${p.name}</td>
            <td><span class="badge bg-info text-dark">${p.category}</span></td>
            <td class="fw-bold">${p.price}₺</td>
            <td>
                <button class="btn btn-outline-primary btn-sm me-2" onclick='openEditProductModal(${JSON.stringify(p)})'>
                    <i class="fa-solid fa-pen"></i> Düzenle
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct(${p.id})">
                    <i class="fa-solid fa-trash"></i> Sil
                </button>
            </td>
        </tr>
    `).join('');
}

async function addCategory() {
    const name = document.getElementById("catName").value;
    const file = document.getElementById("catImage").files[0];
    if (!name || !file) return notify("İsim ve resim seçin!");

    let formData = new FormData();
    formData.append("file", file);
    const imgName = await (await fetch("/products/upload", { method: "POST", body: formData })).text();

    await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slugOlustur(name), image: imgName })
    });
    notify("✅ Kategori eklendi!");
    setTimeout(() => location.reload(), 1000);
}

async function addProduct() {
    const name = document.getElementById("prodName").value;
    const price = document.getElementById("prodPrice").value;
    const desc = document.getElementById("prodDesc").value;
    const cat = document.getElementById("prodCat").value;
    const file = document.getElementById("prodImage").files[0];
    if (!file || !cat) return notify("Resim ve kategori şart!");

    let formData = new FormData();
    formData.append("file", file);
    const imgName = await (await fetch("/products/upload", { method: "POST", body: formData })).text();

    await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description: desc, category: cat, image: imgName })
    });
    notify("✅ Ürün eklendi!");
    setTimeout(() => location.reload(), 1000);
}

async function deleteProduct(id) {
    if (confirm("Silmek istediğinize emin misiniz?")) {
        await fetch(`/products/${id}`, { method: "DELETE" });
        notify("🗑️ Ürün silindi!");
        setTimeout(() => location.reload(), 1000);
    }
}

async function deleteCategory(id) {
    if (confirm("Kategoriyi silmeyi onaylıyor musunuz?")) {
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        notify("🗑️ Kategori silindi!");
        setTimeout(() => location.reload(), 1000);
    }
}

async function openEditProductModal(p) {
    document.getElementById("editProdId").value = p.id;
    document.getElementById("editProdName").value = p.name;
    document.getElementById("editProdPrice").value = p.price;
    document.getElementById("editProdDesc").value = p.description;

    const cats = await (await fetch("/api/categories")).json();
    document.getElementById("editProdCat").innerHTML = cats.map(c => `<option value="${c.slug}" ${c.slug === p.category ? 'selected' : ''}>${c.name}</option>`).join('');
    new bootstrap.Modal(document.getElementById('editProductModal')).show();
}

function editCategoryPrompt(id, oldName) {
    document.getElementById("editCatId").value = id;
    document.getElementById("editCatName").value = oldName;
    new bootstrap.Modal(document.getElementById('editCategoryModal')).show();
}

async function updateProduct() {
    const id = document.getElementById("editProdId").value;
    const file = document.getElementById("editProdImage").files[0];
    const data = {
        name: document.getElementById("editProdName").value,
        price: document.getElementById("editProdPrice").value,
        description: document.getElementById("editProdDesc").value,
        category: document.getElementById("editProdCat").value
    };

    if (file) {
        let formData = new FormData(); formData.append("file", file);
        data.image = await (await fetch("/products/upload", { method: "POST", body: formData })).text();
    }

    await fetch(`/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    notify("✅ Güncellendi!");
    setTimeout(() => location.reload(), 1000);
}

async function updateCategory() {
    const id = document.getElementById("editCatId").value;
    const newName = document.getElementById("editCatName").value;
    const file = document.getElementById("editCatImage").files[0];
    const data = { name: newName, slug: slugOlustur(newName) };

    if (file) {
        let formData = new FormData(); formData.append("file", file);
        data.image = await (await fetch("/products/upload", { method: "POST", body: formData })).text();
    }

    await fetch(`/api/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    notify("✅ Güncellendi!");
    setTimeout(() => location.reload(), 1000);
}

// ==========================================
// 4. MÜŞTERİ EKRANI (ANA SAYFA VE KATEGORİ)
// ==========================================
function loadCategoriesHome() {
    const container = document.getElementById('category-container');
    if (!container) return;

    fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
            container.innerHTML = data.map(cat => `
                <div class="col-12 col-sm-6 col-md-4">
                    <a href="/kategori?kategori=${cat.slug}" class="category-card">
                        <img src="/uploads/${cat.image}" onerror="this.src='/images/default.jpg'">
                        <div class="overlay"><h2>${cat.name}</h2></div>
                    </a>
                </div>
            `).join('');
        });
}

async function loadCategoryProducts() {
    const slug = new URLSearchParams(window.location.search).get('kategori');
    const container = document.getElementById("menu");
    if (!container || !slug) return;

    try {
        const cats = await (await fetch('/api/categories')).json();
        const currentCat = cats.find(c => c.slug === slug);
        if (currentCat) {
            document.getElementById("categoryTitle").innerText = currentCat.name;
            document.getElementById("categoryHero").style.backgroundImage = `url('/uploads/${currentCat.image}')`;
        }

        const prods = await (await fetch(`/products/category/${slug}`)).json();
        if (prods.length === 0) {
            container.innerHTML = '<div class="col-12 text-center mt-5 text-muted">Bu kategoride ürün yok.</div>';
            return;
        }

        container.innerHTML = prods.map(p => `
            <div class="col-12 col-md-6 mb-3">
                <div class="menu-item d-flex align-items-center p-3 bg-white rounded shadow-sm">
                    <img src="/uploads/${p.image}" style="width:85px; height:85px; object-fit:cover; border-radius:12px;" onerror="this.src='/images/default.jpg'">
                    <div class="ms-3 flex-grow-1">
                        <h5 class="mb-1 fw-bold">${p.name}</h5>
                        <p class="mb-0 text-muted small">${p.description || ''}</p>
                        <div class="mt-1 fw-bold text-success">${p.price} ₺</div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

// ==========================================
// 5. AKILLI ARAMA (TÜRKÇE KARAKTER DESTEKLİ)
// ==========================================
function initSearch() {
    const input = document.getElementById('searchInput');
    const resDiv = document.getElementById('searchResults');
    if (!input || !resDiv) return;

    const normalize = (str) => str.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').trim();

    input.addEventListener('input', async (e) => {
        const term = normalize(e.target.value);
        if (term.length < 2) { resDiv.style.display = "none"; return; }

        const prods = await (await fetch("/products")).json();
        const filtered = prods.filter(p => normalize(p.name).includes(term) || normalize(p.description || "").includes(term));

        if (filtered.length > 0) {
            resDiv.style.display = "block";
            resDiv.innerHTML = filtered.map(p => `
                <div class="search-item d-flex align-items-center p-2 border-bottom bg-white" style="cursor:pointer;" onclick="window.location.href='/kategori?kategori=${p.category}'">
                    <img src="/uploads/${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:5px;" class="me-2">
                    <div><strong>${p.name}</strong><br><small class="text-success">${p.price}₺</small></div>
                </div>
            `).join('');
        } else { resDiv.innerHTML = '<div class="p-2 bg-white text-muted">Bulunamadı</div>'; }
    });
}

// ==========================================
// 6. SAYFA YÜKLENİNCE ÇALIŞTIRICI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("adminCategoryTable")) { loadAdminCategories(); loadAdminTables(); }
    if (document.getElementById("category-container")) { loadCategoriesHome(); }
    if (document.getElementById("menu")) { loadCategoryProducts(); }
    if (document.getElementById("searchInput")) { initSearch(); }
});