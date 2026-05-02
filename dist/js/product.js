"use strict";
var _a, _b, _c, _d;
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
fetch('../../src/assets/data.json')
    .then(r => r.json())
    .then(json => {
    const products = json.data;
    const product = products.find(p => p.id === productId);
    if (product)
        loadProduct(product);
    const others = products.filter(p => p.id !== productId);
    const random = [...others].sort(() => Math.random() - 0.5).slice(0, 4);
    renderYouMayLike(random);
});
function loadProduct(p) {
    const title = document.getElementById('product-title');
    const price = document.getElementById('product-price');
    const image = document.getElementById('suitcase-image-main');
    if (title)
        title.textContent = p.name;
    if (price)
        price.textContent = `$${p.price}`;
    if (image)
        image.src = `../../${p.imageUrl}`;
}
const qtyInput = document.getElementById('product-qty');
(_a = document.getElementById('increase-qty')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    qtyInput.value = String(Number(qtyInput.value) + 1);
});
(_b = document.getElementById('decrease-qty')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    if (Number(qtyInput.value) > 1) {
        qtyInput.value = String(Number(qtyInput.value) - 1);
    }
});
const updateProductCounter = () => {
    var _a;
    const cart = JSON.parse((_a = localStorage.getItem('cart')) !== null && _a !== void 0 ? _a : '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = String(total);
        counter.style.display = total > 0 ? 'flex' : 'none';
    }
};
(_c = document.getElementById('add-to-cart')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    if (!productId)
        return;
    fetch('../../src/assets/data.json')
        .then(r => r.json())
        .then(json => {
        var _a;
        const product = json.data.find((p) => p.id === productId);
        if (!product)
            return;
        const cart = JSON.parse((_a = localStorage.getItem('cart')) !== null && _a !== void 0 ? _a : '[]');
        const qty = Number(qtyInput.value);
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += qty;
        }
        else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: qty,
                size: '',
                color: ''
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateProductCounter();
    });
});
(_d = document.querySelector('.form-review')) === null || _d === void 0 ? void 0 : _d.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('user-review').value;
    const name = document.getElementById('name-review').value;
    const email = document.getElementById('email-review').value;
    const successMsg = document.getElementById('review-success');
    const errorMsg = document.getElementById('review-error');
    if (!review || !name || !email) {
        if (errorMsg)
            errorMsg.style.display = 'block';
        if (successMsg)
            successMsg.style.display = 'none';
        return;
    }
    if (successMsg)
        successMsg.style.display = 'block';
    if (errorMsg)
        errorMsg.style.display = 'none';
    document.querySelector('.form-review').reset();
});
function renderYouMayLike(products) {
    const grid = document.querySelector('.you-may-like .products-grid');
    if (!grid)
        return;
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer">
            ${p.salesStatus ? '<div class="product-card__badge">SALE</div>' : ''}
            <div class="product-card__image">
                <img src="../../${p.imageUrl}" alt="${p.name}">
            </div>
            <div class="product-card__info">
                <h3 class="product-card__name">${p.name}</h3>
                <p class="product-card__price">$${p.price}</p>
                <button class="btn btn--card">Add to Cart</button>
            </div>
        </div>
    `).join('');
}
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        var _a;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        (_a = document.getElementById(tabId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
    });
});
updateProductCounter();
