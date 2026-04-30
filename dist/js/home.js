"use strict";
var _a, _b;
const track = document.querySelector('.travel-cards-track');
const originalCards = Array.from(document.querySelectorAll('.travel-card'));
const cardWidth = 320;
let currentIndex = 0;
originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
});
const goTo = (index, animate = true) => {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${index * cardWidth}px)`;
};
(_a = document.querySelector('.next-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    currentIndex++;
    goTo(currentIndex);
    if (currentIndex >= originalCards.length) {
        setTimeout(() => {
            currentIndex = 0;
            goTo(0, false);
        }, 500);
    }
});
(_b = document.querySelector('.prev-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    if (currentIndex <= 0) {
        currentIndex = originalCards.length;
        goTo(currentIndex, false);
        setTimeout(() => {
            currentIndex--;
            goTo(currentIndex);
        }, 20);
    }
    else {
        currentIndex--;
        goTo(currentIndex);
    }
});
fetch('/src/assets/data.json')
    .then(r => r.json())
    .then(json => {
    const products = json.data;
    const selectedGrid = document.querySelector('.selected-products .products-grid');
    if (selectedGrid) {
        selectedGrid.innerHTML = products
            .filter((p) => p.blocks.includes('Selected Products'))
            .map((p) => productCard(p, 'Add to Cart'))
            .join('');
    }
    const arrivalGrid = document.querySelector('.new-products-arrival .products-grid');
    if (arrivalGrid) {
        arrivalGrid.innerHTML = products
            .filter((p) => p.blocks.includes('New Products Arrival'))
            .map((p) => productCard(p, 'View Product'))
            .join('');
    }
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.currentTarget.dataset.id;
            addToCartHome(id, products);
        });
    });
});
function productCard(p, btnText) {
    return `
        <div class="product-card" data-id="${p.id}"
             onclick="window.location.href='/src/html/product.html?id=${p.id}'"
             style="cursor:pointer">
            ${p.salesStatus ? '<div class="product-card__badge">SALE</div>' : ''}
            <div class="product-card__image">
                <img src="${p.imageUrl}" alt="${p.name}">
            </div>
            <div class="product-card__info">
                <h3 class="product-card__name">${p.name}</h3>
                <p class="product-card__price">$${p.price}</p>
                <button class="btn btn--card add-to-cart-btn" data-id="${p.id}">${btnText}</button>
            </div>
        </div>
    `;
}
function addToCartHome(productId, products) {
    var _a;
    const product = products.find((p) => p.id === productId);
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
    updateCounter();
}
function updateCounter() {
    var _a, _b;
    const cart = JSON.parse((_a = localStorage.getItem('cart')) !== null && _a !== void 0 ? _a : '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    let counter = document.querySelector('.cart-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        (_b = document.querySelector('.a-cart')) === null || _b === void 0 ? void 0 : _b.appendChild(counter);
    }
    counter.textContent = String(total);
    counter.style.display = total > 0 ? 'flex' : 'none';
}
document.addEventListener('DOMContentLoaded', () => {
    updateCounter();
});
