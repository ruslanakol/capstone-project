
const track = document.querySelector('.travel-cards-track') as HTMLElement;
const originalCards = Array.from(document.querySelectorAll('.travel-card'));
const cardWidth = 320;
let currentIndex = 0;

originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
});

const goTo = (index: number, animate: boolean = true) => {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${index * cardWidth}px)`;
};

document.querySelector('.next-btn')?.addEventListener('click', () => {
    currentIndex++;
    goTo(currentIndex);

    if (currentIndex >= originalCards.length) {
        setTimeout(() => {
            currentIndex = 0;
            goTo(0, false);
        }, 500);
    }
});

document.querySelector('.prev-btn')?.addEventListener('click', () => {
    if (currentIndex <= 0) {
        currentIndex = originalCards.length;
        goTo(currentIndex, false);
        setTimeout(() => {
            currentIndex--;
            goTo(currentIndex);
        }, 20);
    } else {
        currentIndex--;
        goTo(currentIndex);
    }
});

fetch('../../src/assets/data.json')
    .then(r => r.json())
    .then(json => {
        const products = json.data;

        const selectedGrid = document.querySelector('.selected-products .products-grid') as HTMLElement;
        if (selectedGrid) {
            selectedGrid.innerHTML = products
                .filter((p: any) => p.blocks.includes('Selected Products'))
                .map((p: any) => productCard(p, 'Add to Cart'))
                .join('');
        }

        const arrivalGrid = document.querySelector('.new-products-arrival .products-grid') as HTMLElement;
        if (arrivalGrid) {
            arrivalGrid.innerHTML = products
                .filter((p: any) => p.blocks.includes('New Products Arrival'))
                .map((p: any) => productCard(p, 'View Product'))
                .join('');
        }

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = (e.currentTarget as HTMLElement).dataset.id as string;
                addToCartHome(id, products);
            });
        });
    });

function productCard(p: any, btnText: string): string {
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

function addToCartHome(productId: string, products: any[]): void {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const existing = cart.find((item: any) => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
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

function updateCounter(): void {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

    let counter = document.querySelector('.cart-counter') as HTMLElement;
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        document.querySelector('.a-cart')?.appendChild(counter);
    }

    counter.textContent = String(total);
    counter.style.display = total > 0 ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCounter();
});