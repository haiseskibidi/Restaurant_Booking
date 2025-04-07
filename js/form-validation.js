/**
 * Валидация форм авторизации и регистрации
 */
document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        setupFormValidation(registerForm);
    }
    
    // Обработка формы входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        setupFormValidation(loginForm);
    }
});

/**
 * Настройка валидации для формы
 * @param {HTMLFormElement} form - форма для валидации
 */
function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Обработка события ввода в поле
        input.addEventListener('input', function() {
            validateInput(input);
        });
        
        // Обработка события потери фокуса
        input.addEventListener('blur', function() {
            validateInput(input);
        });
    });
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
}

/**
 * Валидация отдельного поля ввода
 * @param {HTMLInputElement} input - поле для валидации
 * @return {boolean} - результат валидации
 */
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const id = input.id;
    
    // Убираем предыдущий класс валидации
    input.classList.remove('valid');
    
    // Проверка на пустое значение
    if (value === '') {
        return false;
    }
    
    // Специфические проверки для разных типов полей
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return false;
        }
    } else if (id === 'phone') {
        // Простая проверка для телефона (можно расширить)
        const phoneRegex = /^[+0-9]{10,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return false;
        }
    } else if (id === 'password') {
        // Минимальная длина пароля
        if (value.length < 6) {
            return false;
        }
    } else if (id === 'email_phone') {
        // Проверка для поля email или телефон
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+0-9]{10,15}$/;
        if (!emailRegex.test(value) && !phoneRegex.test(value.replace(/\s/g, ''))) {
            return false;
        }
    }
    
    // Если все проверки пройдены, помечаем поле как валидное
    input.classList.add('valid');
    return true;
} 