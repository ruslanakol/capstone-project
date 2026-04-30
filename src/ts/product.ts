// ============================================================
// INTERFACES
// ============================================================
interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    color: string;
    size: string;
    category: string;
    salesStatus: boolean;
    rating: number;
    blocks: string[];
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

// ============================================================
// 41. LOAD PRODUCT FROM JSON BY ID
// ============================================================
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

fetch('/src/data/products.json')
    .then(r => r.json())
    .then(json => {
        const products: Product[] = json.data;
        const product = products.find(p => p.id === productId);

        if (product) loadProduct(product);

        // 45. You May Also Like — 4 random products
        const others = products.filter(p => p.id !== productId);
        const random = others.sort(() => Math.random() - 0.5).slice(0, 4);
        renderYouMayLike(random);
    });

// ============================================================
// 41. RENDER PRODUCT DATA
// ============================================================
function loadProduct(p: Product): void {
    const title = document.getElementById('product-title');
    const price = document.getElementById('product-price');
    const image = document.getElementById('suitcase-image-main') as HTMLImageElement;

    if (title) title.textContent = p.name;
    if (price) price.textContent = `$${p.price}`;
    if (image) image.src = p.imageUrl;
}

// ============================================================
// 42. QUANTITY SELECTOR
// ============================================================
const qtyInput = document.getElementById('product-qty') as HTMLInputElement;

document.getElementById('increase-qty')?.addEventListener('click', () => {
    qtyInput.value = String(Number(qtyInput.value) + 1);
});

document.getElementById('decrease-qty')?.addEventListener('click', () => {
    if (Number(qtyInput.value) > 1) {
        qtyInput.value = String(Number(qtyInput.value) - 1);
    }
});

// ============================================================
// 43. ADD TO CART
// ============================================================
document.getElementById('add-to-cart')?.addEventListener('click', () => {
    if (!productId) return;

    fetch('/src/assets/data.json')
        .then(r => r.json())
        .then(json => {
            const product: Product = json.data.find((p: Product) => p.id === productId);
            if (!product) return;

            const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
            const qty = Number(qtyInput.value);
            const existing = cart.find(item => item.id === productId);

            if (existing) {
                existing.quantity += qty;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: qty
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
        });
});

const updateCartCounter = (): void => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter') as HTMLElement;
    if (counter) {
        counter.textContent = String(total);
        counter.style.display = total > 0 ? 'flex' : 'none';
    }
};

// ============================================================
// 44. REVIEW FORM
// ============================================================
document.querySelector('.form-review')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const review = (document.getElementById('user-review') as HTMLTextAreaElement).value;
    const name = (document.getElementById('name-review') as HTMLInputElement).value;
    const email = (document.getElementById('email-review') as HTMLInputElement).value;

    const successMsg = document.getElementById('review-success');
    const errorMsg = document.getElementById('review-error');

    if (!review || !name || !email) {
        if (errorMsg) errorMsg.style.display = 'block';
        if (successMsg) successMsg.style.display = 'none';
        return;
    }

    if (successMsg) successMsg.style.display = 'block';
    if (errorMsg) errorMsg.style.display = 'none';
    (document.querySelector('.form-review') as HTMLFormElement).reset();
});

// ============================================================
// 45. YOU MAY ALSO LIKE
// ============================================================
function renderYouMayLike(products: Product[]): void {
    const grid = document.querySelector('.you-may-like .products-grid') as HTMLElement;
    if (!grid) return;

    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="window.location.href='/src/html/product.html?id=${p.id}'" style="cursor:pointer">
            ${p.salesStatus ? '<div class="product-card__badge">SALE</div>' : ''}
            <div class="product-card__image">
                <img src="${p.imageUrl}" alt="${p.name}">
            </div>
            <div class="product-card__info">
                <h3 class="product-card__name">${p.name}</h3>
                <p class="product-card__price">$${p.price}</p>
                <button class="btn btn--card">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// ============================================================
// TABS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab') as string;
        document.getElementById(tabId)?.classList.add('active');
    });
});

// Init
updateCartCounter();