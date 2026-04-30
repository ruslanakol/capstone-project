// src/ts/cart-utils.ts
export function addToCart(productId, products) {
    const product = products.find((p) => p.id === productId);
    if (!product)
        return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
    updateCartCounter();
}
export function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = String(total);
        counter.style.display = total > 0 ? 'flex' : 'none';
    }
}
