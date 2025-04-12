document.addEventListener('DOMContentLoaded', function() {
    loadRestaurantsData();
    initCarouselControls();
});

/**
 * Загружает данные о ресторанах из JSON файла
 */
function loadRestaurantsData() {
    fetch('assets/data/establishments_restaurants.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки данных: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            renderRestaurantCards(data.results);
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных ресторанов:', error);
        });
}

/**
 * Создает карточки ресторанов на основе полученных данных
 * @param {Array} restaurants - массив объектов с данными о ресторанах
 */
function renderRestaurantCards(restaurants) {
    const restaurantsContainer = document.getElementById('restaurants-container');
    if (!restaurantsContainer) return;

    // Очищаем контейнер перед добавлением новых карточек
    restaurantsContainer.innerHTML = '';

    // Добавляем карточки ресторанов
    restaurants.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        restaurantsContainer.appendChild(card);
    });
    
    // Инициализируем состояние карусели
    updateCarouselState();
}

/**
 * Создает DOM-элемент карточки ресторана
 * @param {Object} restaurant - объект с данными о ресторане
 * @returns {HTMLElement} - DOM-элемент карточки
 */
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'card restaurant-card';

    // Формируем ценовую категорию на основе среднего чека
    let priceCategory = '';
    if (restaurant.average_check <= 500) priceCategory = '₽'; // Низкий (до 500р)
    else if (restaurant.average_check <= 1500) priceCategory = '₽₽'; // Средний (500 - 1500р)
    else if (restaurant.average_check <= 2500) priceCategory = '₽₽₽'; // Выше среднего (1500 - 2500р)
    else priceCategory = '₽₽₽₽'; // Высокий (2500р и выше)

    // Формируем строку с типами кухни (используем полный список)
    const cuisineText = restaurant.cuisine_types.join(', ');

    // Формируем HTML структуру карточки
    card.innerHTML = `
        <div class="card-image">
            <img src="${restaurant.photo}" alt="${restaurant.name}">
        </div>
        <div class="card-body">
            <div class="card-header">
                <h3 class="card-title">${restaurant.name}</h3>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${restaurant.average_rating > 0 ? restaurant.average_rating.toFixed(1) : '0'}</span>
                </div>
            </div>
            <div class="card-info">
                <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${cuisineText}">${cuisineText} • ${priceCategory}</p>
                <p class="address">${restaurant.address}</p>
            </div>
            <a href="#" class="btn book-btn" data-id="${restaurant.id}">Забронировать</a>
        </div>
    `;

    return card;
}

/**
 * Инициализирует контроллеры карусели
 */
function initCarouselControls() {
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    
    if (!prevArrow || !nextArrow) {
        console.error('Стрелки карусели не найдены!');
        return;
    }
    
    console.log('Стрелки карусели инициализированы');
    
    // Начальная позиция карусели
    let currentPage = 0;
    
    // Обработчик клика на стрелку "Предыдущий"
    prevArrow.addEventListener('click', function() {
        console.log('Клик на стрелку "Предыдущий"');
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    });
    
    // Обработчик клика на стрелку "Следующий"
    nextArrow.addEventListener('click', function() {
        console.log('Клик на стрелку "Следующий"');
        const totalCards = document.querySelectorAll('.restaurant-card').length;
        const maxPage = Math.ceil(totalCards / 4) - 1;
        
        if (currentPage < maxPage) {
            currentPage++;
            showPage(currentPage);
        }
    });
}

/**
 * Показывает определенную страницу карусели
 * @param {number} pageIndex - Индекс страницы для отображения
 */
function showPage(pageIndex) {
    const container = document.getElementById('restaurants-container');
    const cards = container.querySelectorAll('.restaurant-card');
    
    // Скрываем все карточки
    cards.forEach((card, index) => {
        if (index >= pageIndex * 4 && index < (pageIndex + 1) * 4) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Обновляем состояние кнопок
    updateCarouselState(pageIndex);
}

/**
 * Обновляет состояние карусели (активность стрелок)
 * @param {number} currentPage - Текущая страница
 */
function updateCarouselState(currentPage = 0) {
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    const cards = document.querySelectorAll('.restaurant-card');
    const maxPage = Math.ceil(cards.length / 4) - 1;
    
    if (prevArrow) {
        prevArrow.classList.toggle('disabled', currentPage <= 0);
    }
    
    if (nextArrow) {
        nextArrow.classList.toggle('disabled', currentPage >= maxPage);
    }
    
    // Показываем только карточки текущей страницы при первой загрузке
    if (!document.querySelector('.carousel-page-initialized')) {
        // Отмечаем, что страница уже была инициализирована
        const container = document.getElementById('restaurants-container');
        if (container) {
            container.classList.add('carousel-page-initialized');
            
            // Скрываем все карточки, кроме первых 4-х
            const cards = container.querySelectorAll('.restaurant-card');
            cards.forEach((card, index) => {
                card.style.display = index < 4 ? 'block' : 'none';
            });
        }
    }
}
