interface CartItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    size: string;
    color: string;
    quantity: number;
}

const getCart = (): CartItem[] => JSON.parse(localStorage.getItem('cart') ?? '[]');
const saveCart = (cart: CartItem[]): void => localStorage.setItem('cart', JSON.stringify(cart));

const updateCartCounter = (): void => {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter') as HTMLElement;
    if (counter) {
        counter.textContent = String(total);
        counter.style.display = total > 0 ? 'flex' : 'none';
    }
};

const renderTotals = (): void => {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 30;
    const discount = subtotal > 3000 ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discount;

    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-final-total');
    const discountEl = document.getElementById('cart-discount');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
    if (shippingEl) shippingEl.textContent = `$${shipping}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (discountEl) discountEl.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0';
};

const renderCart = (): void => {
    const cart = getCart();
    const tbody = document.getElementById('cart-table-body') as HTMLElement;
    if (!tbody) return;

    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; font-size:18px;">
                    Your cart is empty
                </td>
            </tr>`;
        renderTotals();
        return;
    }

    tbody.innerHTML = cart.map((item, index) => `
        <tr class="cart-item" data-index="${index}">
            <td class="cart-item__image">
                <img src="${item.imageUrl}" alt="${item.name}" style="width:80px">
            </td>
            <td class="cart-item__name">${item.name}</td>
            <td class="cart-item__price">$${item.price}</td>
            <td class="cart-item__quantity">
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
            </td>
            <td class="cart-item__total">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="cart-item__delete">
                <button class="delete-btn" data-index="${index}">
                    <img src="../../src/assets/Pages/My Cart/delete.svg" alt="Delete">
                </button>
            </td>
        </tr>
    `).join('');

    bindCartEvents();
    renderTotals();
};


const bindCartEvents = (): void => {

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const index = Number(target.dataset.index);
            const cart = getCart();

            if (target.classList.contains('plus')) {
                cart[index].quantity++;
            } else if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }

            saveCart(cart);
            renderCart();
            updateCartCounter();
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const index = Number(target.dataset.index);
            const cart = getCart();
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
            updateCartCounter();
        });
    });
};

document.getElementById('clear-btn')?.addEventListener('click', () => {
    saveCart([]);
    renderCart();
    updateCartCounter();
});

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    saveCart([]);
    renderCart();
    updateCartCounter();

    const tbody = document.getElementById('cart-table-body') as HTMLElement;
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; font-size:20px; color:#B92770; font-weight:700;">
                    Thank you for your order! 🎉
                </td>
            </tr>`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCounter();
});