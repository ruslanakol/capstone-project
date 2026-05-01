"use strict";
var _a, _b, _c, _d, _e;
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PER_PAGE = 12;
let activeFilters = {
    category: '',
    color: '',
    size: '',
    salesStatus: '',
};
fetch('/src/assets/data.json')
    .then(r => r.json())
    .then(json => {
    allProducts = json.data;
    filteredProducts = [...allProducts];
    renderGrid();
    renderTopSets();
});
const filterSelects = document.querySelectorAll('.filter-select');
filterSelects.forEach(select => {
    select.addEventListener('change', (e) => {
        const el = e.currentTarget;
        const key = el.dataset.filter;
        activeFilters[key] = el.value;
        if (el.value !== '') {
            el.classList.add('filter-active');
        }
        else {
            el.classList.remove('filter-active');
        }
        currentPage = 1;
        applyFilters();
    });
});
function applyFilters() {
    filteredProducts = allProducts.filter(p => {
        if (activeFilters.category && p.category !== activeFilters.category)
            return false;
        if (activeFilters.color && p.color !== activeFilters.color)
            return false;
        if (activeFilters.size && p.size !== activeFilters.size)
            return false;
        if (activeFilters.salesStatus && String(p.salesStatus) !== activeFilters.salesStatus)
            return false;
        return true;
    });
    applySort();
    renderGrid();
}
(_a = document.getElementById('reset-filters')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    activeFilters = { category: '', color: '', size: '', salesStatus: '' };
    filterSelects.forEach(select => {
        select.value = '';
        select.classList.remove('filter-active');
    });
    document.getElementById('sort').value = 'default';
    filteredProducts = [...allProducts];
    currentPage = 1;
    renderGrid();
});
(_b = document.getElementById('sort')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', () => {
    applySort();
    renderGrid();
});
function applySort() {
    const sortVal = document.getElementById('sort').value;
    if (sortVal === 'price-low-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    }
    else if (sortVal === 'price-high-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    else if (sortVal === 'popularity') {
        filteredProducts.sort((a, b) => b.popularity - a.popularity);
    }
    else if (sortVal === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }
}
(_c = document.querySelector('.search-input')) === null || _c === void 0 ? void 0 : _c.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
        filteredProducts = [...allProducts];
        hideNotFound();
        renderGrid();
        return;
    }
    const results = allProducts.filter(p => p.name.toLowerCase().includes(query));
    if (results.length === 0) {
        showNotFound();
        filteredProducts = [];
        renderGrid();
    }
    else if (results.length === 1) {
        window.location.href = `/src/html/product.html?id=${results[0].id}`;
    }
    else {
        hideNotFound();
        filteredProducts = results;
        currentPage = 1;
        renderGrid();
    }
});
function showNotFound() {
    const popup = document.getElementById('not-found-popup');
    if (popup)
        popup.style.display = 'block';
}
function hideNotFound() {
    const popup = document.getElementById('not-found-popup');
    if (popup)
        popup.style.display = 'none';
}
function renderGrid() {
    const grid = document.getElementById('catalog-grid');
    if (!grid)
        return;
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / PER_PAGE);
    const start = (currentPage - 1) * PER_PAGE;
    const end = Math.min(start + PER_PAGE, total);
    const pageProducts = filteredProducts.slice(start, end);
    const resultsEl = document.querySelector('.results-showing');
    if (resultsEl) {
        resultsEl.textContent = total > 0
            ? `Showing ${start + 1}–${end} of ${total} results`
            : 'No products found';
    }
    grid.innerHTML = pageProducts.map(p => `
        <article class="product-card" 
                 onclick="window.location.href='/src/html/product.html?id=${p.id}'"
                 style="cursor:pointer">
            ${p.salesStatus ? '<span class="product-card__badge">SALE</span>' : ''}
            <div class="product-card__image">
                <img src="${p.imageUrl}" alt="${p.name}">
            </div>
            <div class="product-card__info">
                <h3 class="product-card__name">${p.name}</h3>
                <p class="product-card__price">$${p.price}</p>
                <button class="btn btn--card add-to-cart-btn" 
                        data-id="${p.id}"
                        onclick="event.stopPropagation()">Add to Cart</button>
            </div>
        </article>
    `).join('');
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.currentTarget.dataset.id;
            addToCart(id);
        });
    });
    renderPagination(totalPages);
}
function renderPagination(totalPages) {
    const pagesEl = document.querySelector('.pages');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (pagesEl) {
        pagesEl.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <button class="page ${i + 1 === currentPage ? 'page-active' : ''}" 
                    data-page="${i + 1}">${i + 1}</button>
        `).join('');
        pagesEl.querySelectorAll('.page').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = Number(btn.dataset.page);
                renderGrid();
            });
        });
    }
    if (prevBtn)
        prevBtn.disabled = currentPage === 1;
    if (nextBtn)
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}
(_d = document.getElementById('prev-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderGrid();
    }
});
(_e = document.getElementById('next-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderGrid();
    }
});
function renderTopSets() {
    const sets = allProducts.filter(p => p.category === 'luggage sets');
    const random = [...sets].sort(() => Math.random() - 0.5).slice(0, 3);
    const container = document.getElementById('top-sets');
    if (!container || random.length === 0)
        return;
    container.innerHTML = random.map(p => `
        <div class="set">
            <img src="${p.imageUrl}" alt="${p.name}" class="set-img">
            <div class="set-content">
                <p>${p.name}</p>
                <div class="start-rate">
                    ${'<img src="/src/assets/images/icons/star-yellow.svg" alt="star">'.repeat(Math.round(p.rating))}
                </div>
                <p class="price">$${p.price}</p>
            </div>
        </div>
    `).join('');
}
function addToCart(productId) {
    var _a;
    const product = allProducts.find(p => p.id === productId);
    if (!product)
        return;
    const cart = JSON.parse((_a = localStorage.getItem('cart')) !== null && _a !== void 0 ? _a : '[]');
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
        existing.quantity++;
    }
    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
            size: '',
            color: ''
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = String(total);
        counter.style.display = total > 0 ? 'flex' : 'none';
    }
}
