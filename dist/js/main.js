// modal log-in
const loginModal = document.getElementById('login-modal');
const profileIcon = document.getElementById('profile-icon');
const closeModalBtn = document.getElementById('close-modal');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('login-password');
const loginForm = document.querySelector('.login-form');
const emailInput = document.getElementById('login-email');
profileIcon === null || profileIcon === void 0 ? void 0 : profileIcon.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal === null || loginModal === void 0 ? void 0 : loginModal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
});
const closeModal = () => {
    loginModal === null || loginModal === void 0 ? void 0 : loginModal.classList.add('modal-hidden');
    document.body.style.overflow = '';
};
closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener('click', closeModal);
loginModal === null || loginModal === void 0 ? void 0 : loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal)
        closeModal();
});
togglePassword === null || togglePassword === void 0 ? void 0 : togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePassword.style.opacity = isPassword ? '1' : '0.5';
});
loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = document.getElementById('email-error');
    if (emailError)
        emailError.textContent = '';
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
// cart counter
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    let counter = document.querySelector('.cart-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        (_a = document.querySelector('.a-cart')) === null || _a === void 0 ? void 0 : _a.appendChild(counter);
    }
    counter.textContent = String(total);
    counter.style.display = total > 0 ? 'flex' : 'none';
});
const cart2 = JSON.parse(localStorage.getItem('cart') || '[]');
const total2 = cart2.reduce((sum, item) => sum + item.quantity, 0);
const counter2 = document.querySelector('.cart-counter');
if (counter2) {
    counter2.textContent = String(total2);
    counter2.style.display = total2 > 0 ? 'flex' : 'none';
}
// ============================================================
// ADD TO CART FUNCTION
// ============================================================
export function updateCounter() {
    var _a;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    let counter = document.querySelector('.cart-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        (_a = document.querySelector('.a-cart')) === null || _a === void 0 ? void 0 : _a.appendChild(counter);
    }
    counter.textContent = String(total);
    counter.style.display = total > 0 ? 'flex' : 'none';
}
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
    updateCounter();
}
