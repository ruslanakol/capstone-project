const form = document.getElementById('contact-form') as HTMLFormElement;
const inputEmail = document.getElementById('user-email') as HTMLInputElement;
const emailError = document.getElementById('email-error') as HTMLElement;
const successMsg = document.getElementById('form-success') as HTMLElement;
const errorMsg = document.getElementById('form-error') as HTMLElement;



// Interface — показує що знаєш TS
interface ContactForm {
    name: string;
    email: string;
    topic: string;
    message: string;
}

// 47. Валідація email в реальному часі
inputEmail.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.textContent = emailRegex.test(inputEmail.value) 
        ? '' 
        : 'Please enter a valid email';
});

// 48 + 49. Сабміт
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data: ContactForm = {
        name: (document.getElementById('user-name') as HTMLInputElement).value,
        email: inputEmail.value,
        topic: (document.getElementById('topic') as HTMLInputElement).value,
        message: (document.getElementById('user-message') as HTMLTextAreaElement).value,
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