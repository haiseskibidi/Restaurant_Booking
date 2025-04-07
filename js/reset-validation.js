/**
 * Валидация формы восстановления пароля
 */
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const resetForm = document.getElementById('reset-form');
    
    if (emailInput) {
        // Валидация при вводе
        emailInput.addEventListener('input', function() {
            validateEmail(emailInput);
        });
        
        // Валидация при потере фокуса
        emailInput.addEventListener('blur', function() {
            validateEmail(emailInput);
        });
    }
    
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = validateEmail(emailInput);
            
            if (isValid) {
                alert('Инструкции по восстановлению пароля отправлены на указанный email.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    }
});

/**
 * Валидация email
 * @param {HTMLInputElement} input - поле для валидации
 * @return {boolean} - результат валидации
 */
function validateEmail(input) {
    const value = input.value.trim();
    
    // Сначала убираем класс valid
    input.classList.remove('valid');
    
    // Проверка на пустое значение
    if (value === '') {
        return false;
    }
    
    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return false;
    }
    
    // Если все проверки пройдены, помечаем поле как валидное
    input.classList.add('valid');
    return true;
} 