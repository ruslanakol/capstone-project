
const loginModal = document.getElementById('login-modal') as HTMLElement;
const profileIcon = document.getElementById('profile-icon') as HTMLElement;
const closeModalBtn = document.getElementById('close-modal') as HTMLElement;
const togglePassword = document.getElementById('toggle-password') as HTMLImageElement;
const passwordInput = document.getElementById('login-password') as HTMLInputElement;
const loginForm = document.querySelector('.login-form') as HTMLFormElement;
const emailInput = document.getElementById('login-email') as HTMLInputElement;

profileIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal?.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
});

const closeModal = () => {
    loginModal?.classList.add('modal-hidden');
    document.body.style.overflow = '';
};

closeModalBtn?.addEventListener('click', closeModal);

loginModal?.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal();
});

togglePassword?.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePassword.style.opacity = isPassword ? '1' : '0.5';
});

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = document.getElementById('email-error');

    if (emailError) emailError.textContent = '';

    if (!emailRegex.test(emailInput.value)) {
        if (emailError) {
            emailError.textContent = 'Please enter a valid email address';
        }
        emailInput.focus();
        return;
    }

    if (!passwordInput.value.trim()) {
        passwordInput.focus();
        return;
    }

    closeModal();
    loginForm.reset();
});

document.addEventListener('DOMContentLoaded', () => {
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
});

const cart2 = JSON.parse(localStorage.getItem('cart') ?? '[]');
const total2 = cart2.reduce((sum: number, item: any) => sum + item.quantity, 0);
const counter2 = document.querySelector('.cart-counter') as HTMLElement;
if (counter2) {
    counter2.textContent = String(total2);
    counter2.style.display = total2 > 0 ? 'flex' : 'none';
}

export function updateCounter(): void {
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

export function addToCart(productId: string, products: any[]): void {
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