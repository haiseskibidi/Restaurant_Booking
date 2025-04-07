/**
 * Валидация форм авторизации и регистрации
 */
document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        setupFormValidation(registerForm);
        
        // Предотвращаем стандартную отправку формы
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(registerForm)) {
                alert('Регистрация успешна! Вы будете перенаправлены на страницу входа.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
    
    // Обработка формы входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        setupFormValidation(loginForm);
        
        // Предотвращаем стандартную отправку формы
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(loginForm)) {
                alert('Вход выполнен успешно! Вы будете перенаправлены на главную страницу.');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
    
    // Обработка формы восстановления пароля
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        const emailInput = document.getElementById('email');
        
        // Добавляем обработчики событий для валидации поля email
        emailInput.addEventListener('input', function() {
            validateInput(emailInput);
        });
        
        emailInput.addEventListener('blur', function() {
            validateInput(emailInput);
        });
        
        // Предотвращаем стандартную отправку формы
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const confirmCheckbox = document.getElementById('confirm_reset');
            
            let isValid = validateInput(emailInput) && confirmCheckbox.checked;
            
            if (isValid) {
                alert('Инструкции по восстановлению пароля отправлены на указанный email.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else if (!confirmCheckbox.checked) {
                alert('Пожалуйста, подтвердите, что у вас есть доступ к указанной почте.');
            }
        });
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
}

/**
 * Валидация всей формы
 * @param {HTMLFormElement} form - форма для валидации
 * @return {boolean} - результат валидации
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
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