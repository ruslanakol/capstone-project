"use strict";
const form = document.getElementById('contact-form');
const inputEmail = document.getElementById('user-email');
const emailError = document.getElementById('email-error');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');
inputEmail.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.textContent = emailRegex.test(inputEmail.value)
        ? ''
        : 'Please enter a valid email';
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('user-name').value,
        email: inputEmail.value,
        topic: document.getElementById('topic').value,
        message: document.getElementById('user-message').value,
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.name || !data.email || !data.topic || !data.message || !emailRegex.test(data.email)) {
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
        return;
    }
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
    form.reset();
});
