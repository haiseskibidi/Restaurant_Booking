document.addEventListener('DOMContentLoaded', function() {
    // Загрузка изображений из images.js
    loadImages();
    
    // Инициализация фильтров
    initFilters();
    
    // Обработка кнопок "Забронировать"
    initBookingButtons();
});

/**
 * Загружает изображения из объекта IMAGES (определенного в images.js)
 */
function loadImages() {
    if (typeof IMAGES === 'undefined') {
        console.error('Объект IMAGES не найден. Убедитесь, что файл images.js загружен перед script.js');
        return;
    }
    
    // Загрузка изображений ресторанов
    for (const key in IMAGES.restaurants) {
        const restaurant = IMAGES.restaurants[key];
        const elementId = restaurant.elementId || key.toLowerCase();
        
        const imgElement = document.getElementById(`img-restaurant-${elementId}`);
        if (imgElement) {
            // Сначала применяем стили позиционирования перед загрузкой изображения
            if (restaurant.imageFit) {
                imgElement.style.objectFit = restaurant.imageFit;
            }
            
            if (restaurant.imagePosition) {
                imgElement.style.objectPosition = restaurant.imagePosition;
            }
            
            // Затем устанавливаем источник изображения
            imgElement.src = restaurant.image;
            imgElement.alt = restaurant.name;
        } else {
            console.log(`Элемент с ID img-restaurant-${elementId} не найден для ресторана ${restaurant.name}`);
        }
    }
    
    // Загрузка изображений баров
    for (const key in IMAGES.bars) {
        const bar = IMAGES.bars[key];
        const elementId = bar.elementId || key.toLowerCase();
        
        const imgElement = document.getElementById(`img-bar-${elementId}`);
        if (imgElement) {
            // Сначала применяем стили позиционирования перед загрузкой изображения
            if (bar.imageFit) {
                imgElement.style.objectFit = bar.imageFit;
            }
            
            if (bar.imagePosition) {
                imgElement.style.objectPosition = bar.imagePosition;
            }
            
            // Затем устанавливаем источник изображения
            imgElement.src = bar.image;
            imgElement.alt = bar.name;
        } else {
            console.log(`Элемент с ID img-bar-${elementId} не найден для бара ${bar.name}`);
        }
    }
}

// Глобальная переменная для хранения состояния чекбоксов кухонь
const selectedCuisines = new Set();

// Глобальная переменная для хранения состояния чекбоксов среднего чека
const selectedPrices = new Set();

// Глобальная переменная для хранения состояния чекбоксов местоположения
const selectedLocations = new Set();

/**
 * Инициализирует работу фильтров
 */
function initFilters() {
    // Проверка наличия данных фильтров
    if (typeof FILTERS_DATA === 'undefined') {
        console.error('Объект FILTERS_DATA не найден. Убедитесь, что файл filters-data.js загружен перед script.js');
        return;
    }
    
    // Инициализация текста кнопок фильтров
    initFilterButtonText();
    
    // Фильтр "Кухня"
    const cuisineFilter = document.querySelector('.filter-item:nth-child(1) .filter-btn');
    if (cuisineFilter) {
        cuisineFilter.addEventListener('click', function() {
            showDropdown(this, FILTERS_DATA.cuisines, 'cuisine');
        });
    }
    
    // Фильтр "Средний чек"
    const priceFilter = document.querySelector('.filter-item:nth-child(2) .filter-btn');
    if (priceFilter) {
        priceFilter.addEventListener('click', function() {
            showDropdown(this, FILTERS_DATA.prices, 'price');
        });
    }
    
    // Фильтр "Местоположение"
    const locationFilter = document.querySelector('.filter-item:nth-child(3) .filter-btn');
    if (locationFilter) {
        locationFilter.addEventListener('click', function() {
            showDropdown(this, FILTERS_DATA.locations, 'location');
        });
    }
    
    // Кнопка поиска
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Заглушка для функционала поиска
            alert('Функция поиска будет реализована позже');
        });
    }
    
    // Инициализация сортировки
    initSorting();
}

/**
 * Инициализирует кнопку сортировки
 */
function initSorting() {
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) {
        // Устанавливаем начальный текст кнопки сортировки
        const sortBtnText = sortBtn.querySelector('span');
        if (sortBtnText && FILTERS_DATA.sorting.title) {
            sortBtnText.textContent = FILTERS_DATA.sorting.title;
        }
        
        sortBtn.addEventListener('click', function() {
            // Проверяем, открыт ли уже выпадающий список для данной кнопки
            const sortContainer = sortBtn.closest('.sort-by');
            const existingList = sortContainer.querySelector('.sort-dropdown');
            
            // Если список уже открыт, закрываем его и выходим
            if (existingList) {
                existingList.remove();
                sortContainer.classList.remove('open');
                return;
            }
            
            // Удаляем все открытые выпадающие списки для фильтров
            document.querySelectorAll('.filter-dropdown').forEach(dropdown => dropdown.remove());
            document.querySelectorAll('.filter-item.open').forEach(item => {
                item.classList.remove('open');
            });
            
            // Добавляем класс open к контейнеру сортировки
            sortContainer.classList.add('open');
            
            // Создаем новый выпадающий список
            const sortList = document.createElement('div');
            sortList.className = 'sort-dropdown';
            
            FILTERS_DATA.sorting.options.forEach(sort => {
                const sortItem = document.createElement('div');
                sortItem.className = 'sort-option';
                sortItem.textContent = sort.name;
                sortItem.dataset.value = sort.value;
                
                sortItem.addEventListener('click', function() {
                    // При выборе опции обновляем текст кнопки сортировки
                    if (sortBtnText) {
                        sortBtnText.textContent = sort.name;
                    }
                    
                    // Логика сортировки будет использовать dataset.value
                    console.log(`Сортировка: ${sort.value}`);
                    
                    // Закрываем дропдаун
                    sortList.remove();
                    sortContainer.classList.remove('open');
                });
                
                sortList.appendChild(sortItem);
            });
            
            // Позиционируем и отображаем выпадающий список
            if (sortContainer) {                
                sortContainer.appendChild(sortList);
                
                // Закрытие выпадающего списка при клике вне его
                document.addEventListener('click', function closeSortDropdown(e) {
                    if (!sortList.contains(e.target) && e.target !== sortBtn && !sortBtn.contains(e.target)) {
                        sortList.remove();
                        sortContainer.classList.remove('open');
                        document.removeEventListener('click', closeSortDropdown);
                    }
                });
            }
        });
    }
}

/**
 * Инициализирует текст кнопок фильтров при загрузке страницы
 */
function initFilterButtonText() {
    // Инициализация кнопки фильтра кухонь
    initButtonText('.filter-item:nth-child(1) .filter-btn', selectedCuisines, 'Кухня');
    
    // Инициализация кнопки фильтра цен
    initButtonText('.filter-item:nth-child(2) .filter-btn', selectedPrices, 'Средний чек');
    
    // Инициализация кнопки фильтра местоположения
    initButtonText('.filter-item:nth-child(3) .filter-btn', selectedLocations, 'Местоположение');
}

/**
 * Инициализирует текст кнопки фильтра
 * @param {string} selector - CSS-селектор кнопки
 * @param {Set} selectedItems - Набор выбранных элементов
 * @param {string} defaultText - Текст по умолчанию
 */
function initButtonText(selector, selectedItems, defaultText) {
    const buttonText = document.querySelector(`${selector} span`);
    if (!buttonText) return;
    
    // Если нет выбранных элементов, устанавливаем текст по умолчанию
    if (selectedItems.size === 0) {
        buttonText.textContent = defaultText;
    } else if (selectedItems.size === 1) {
        // Если выбран один элемент, показываем его название
        buttonText.textContent = Array.from(selectedItems)[0];
    } else {
        // Если выбрано несколько элементов
        buttonText.textContent = `Выбрано ${selectedItems.size}`;
    }
}

/**
 * Отображает выпадающий список для фильтра
 * @param {HTMLElement} filterButton - Кнопка фильтра
 * @param {Array} options - Массив опций для выпадающего списка
 * @param {string} filterType - Тип фильтра ('cuisine', 'price', 'location')
 */
function showDropdown(filterButton, options, filterType) {
    // Проверяем, открыт ли уже выпадающий список для данной кнопки
    const filterItem = filterButton.closest('.filter-item');
    const existingDropdown = filterItem.querySelector('.filter-dropdown');
    
    // Удаляем класс open со всех фильтров
    document.querySelectorAll('.filter-item.open').forEach(item => {
        item.classList.remove('open');
    });
    
    // Если список уже открыт для этой кнопки, закрываем его и выходим
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // Удаляем все открытые выпадающие списки
    const allDropdowns = document.querySelectorAll('.filter-dropdown');
    allDropdowns.forEach(dropdown => dropdown.remove());
    
    // Добавляем класс open к текущему фильтру
    filterItem.classList.add('open');
    
    // Создаем новый выпадающий список
    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    
    // Массив для хранения всех чекбоксов (кроме "Все")
    const checkboxes = [];
    // Переменная для хранения чекбокса "Все"
    let allCheckbox = null;
    
    // Выбираем нужный набор выбранных элементов в зависимости от типа фильтра
    let selectedSet;
    let defaultButtonText;
    
    switch (filterType) {
        case 'cuisine':
            selectedSet = selectedCuisines;
            defaultButtonText = 'Кухня';
            break;
        case 'price':
            selectedSet = selectedPrices;
            defaultButtonText = 'Средний чек';
            break;
        case 'location':
            selectedSet = selectedLocations;
            defaultButtonText = 'Местоположение';
            break;
        default:
            selectedSet = new Set();
            defaultButtonText = 'Фильтр';
    }
    
    // Добавляем опции с чекбоксами
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'filter-option';
        
        // Создаем чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-option-${filterType}-${option.replace(/\s+/g, '-').toLowerCase()}`;
        checkbox.className = 'custom-checkbox'; // Добавляем класс для кастомных чекбоксов
        
        // Проверяем, нужно ли отметить чекбокс
        if (option === 'Все') {
            // Чекбокс "Все" отмечаем только если все остальные элементы выбраны
            // (но не когда нет выбранных элементов)
            checkbox.checked = selectedSet.size > 0 && (options.length - 1 === selectedSet.size);
            allCheckbox = checkbox;
        } else {
            // Для обычных опций проверяем наличие в сохраненном списке
            checkbox.checked = selectedSet.has(option);
            checkboxes.push(checkbox);
        }
        
        // Создаем лейбл для чекбокса
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        
        // Форматируем текст опции, оборачиваем скобки и их содержимое в span
        if (option.includes('(') && option.includes(')')) {
            const bracketIndex = option.indexOf('(');
            const mainText = option.substring(0, bracketIndex).trim();
            const bracketText = option.substring(bracketIndex);
            
            label.textContent = mainText + ' ';
            const spanElement = document.createElement('span');
            spanElement.textContent = bracketText;
            label.appendChild(spanElement);
        } else {
            label.textContent = option;
        }
        
        // Добавляем чекбокс и лейбл в опцию
        optionElement.appendChild(checkbox);
        optionElement.appendChild(label);
        
        // Добавляем обработчик события непосредственно на чекбокс
        checkbox.addEventListener('change', function() {
            // Используем атрибут data для предотвращения рекурсивных вызовов
            if (checkbox.dataset.processing) return;
            
            checkbox.dataset.processing = 'true';
            handleCheckboxLogic(this, option, allCheckbox, checkboxes, selectedSet, filterButton, defaultButtonText);
            
            // Сбрасываем флаг после небольшой задержки
            setTimeout(() => {
                delete checkbox.dataset.processing;
            }, 0);
        });
        
        // Обработчик клика по опции
        optionElement.addEventListener('click', function(e) {
            // Предотвращаем всплытие события, чтобы не закрывать dropdown
            e.stopPropagation();
            
            // Если клик был по самому чекбоксу или по его label, не делаем ничего
            // обработка будет в событии change чекбокса
            if (e.target === checkbox || e.target === label || label.contains(e.target)) {
                return;
            }
            
            // Меняем состояние чекбокса, если клик был не по нему
            checkbox.checked = !checkbox.checked;
            
            // Вызываем событие change, чтобы сработал обработчик
            const changeEvent = new Event('change');
            checkbox.dispatchEvent(changeEvent);
        });
        
        dropdown.appendChild(optionElement);
    });
    
    // Позиционируем и отображаем выпадающий список
    if (filterItem) {
        filterItem.appendChild(dropdown);
    }
    
    // Закрытие выпадающего списка при клике вне его и вне кнопки
    document.addEventListener('click', function closeDropdown(e) {
        // Проверяем, был ли клик внутри dropdown или по кнопке фильтра
        if (!dropdown.contains(e.target) && e.target !== filterButton && !filterButton.contains(e.target)) {
            dropdown.remove();
            filterItem.classList.remove('open'); // Удаляем класс open при закрытии
            document.removeEventListener('click', closeDropdown);
        }
    });
}

/**
 * Обрабатывает логику чекбоксов фильтра
 * @param {HTMLElement} checkbox - Чекбокс, который был изменен
 * @param {string} option - Текст опции
 * @param {HTMLElement} allCheckbox - Чекбокс "Все"
 * @param {Array} checkboxes - Массив всех чекбоксов кроме "Все"
 * @param {Set} selectedSet - Набор выбранных опций
 * @param {HTMLElement} filterButton - Кнопка фильтра
 * @param {string} defaultButtonText - Текст кнопки по умолчанию
 */
function handleCheckboxLogic(checkbox, option, allCheckbox, checkboxes, selectedSet, filterButton, defaultButtonText) {
    if (option === 'Все') {
        // Если изменен чекбокс "Все"
        const isChecked = checkbox.checked;
        
        // Устанавливаем все чекбоксы в то же состояние, что и "Все"
        checkboxes.forEach(cb => {
            // Устанавливаем флаг, чтобы предотвратить рекурсивные вызовы
            cb.dataset.processing = 'true';
            cb.checked = isChecked;
            
            // Обновляем коллекцию выбранных опций
            const itemOption = cb.nextElementSibling.textContent;
            if (isChecked) {
                selectedSet.add(itemOption);
            } else {
                selectedSet.delete(itemOption);
            }
            
            // Сбрасываем флаг после небольшой задержки
            setTimeout(() => {
                delete cb.dataset.processing;
            }, 0);
        });
    } else {
        // Если изменен один из обычных чекбоксов
        // Обновляем коллекцию выбранных опций
        if (checkbox.checked) {
            selectedSet.add(option);
        } else {
            selectedSet.delete(option);
        }
        
        // Проверяем, выбраны ли все чекбоксы
        const allItemsSelected = checkboxes.every(cb => cb.checked);
        
        // Если выбраны все чекбоксы, отмечаем "Все"
        // Иначе снимаем отметку с "Все"
        if (allCheckbox) {
            // Устанавливаем флаг, чтобы предотвратить рекурсивные вызовы
            allCheckbox.dataset.processing = 'true';
            allCheckbox.checked = checkboxes.length > 0 && allItemsSelected;
            
            // Сбрасываем флаг после небольшой задержки
            setTimeout(() => {
                delete allCheckbox.dataset.processing;
            }, 0);
        }
    }
    
    // Обновляем текст кнопки фильтра
    updateButtonText(filterButton, checkboxes, allCheckbox, defaultButtonText);
}

/**
 * Обновляет текст на кнопке фильтра
 * @param {HTMLElement} filterButton - Кнопка фильтра
 * @param {Array} checkboxes - Массив всех чекбоксов кроме "Все"
 * @param {HTMLElement} allCheckbox - Чекбокс "Все"
 * @param {string} defaultText - Текст по умолчанию
 */
function updateButtonText(filterButton, checkboxes, allCheckbox, defaultText) {
    const buttonText = filterButton.querySelector('span');
    
    if (!buttonText) return;
    
    // Проверяем, есть ли отмеченные чекбоксы
    const selectedItems = checkboxes
        .filter(cb => cb.checked)
        .map(cb => {
            // Получаем полный текст из лейбла (может содержать span с диапазоном цен)
            const label = cb.nextElementSibling;
            return label.textContent;
        });
    
    // Если выбрано "Все", показываем "Все"
    if (allCheckbox && allCheckbox.checked) {
        buttonText.textContent = 'Все';
        return;
    }
    
    if (selectedItems.length === 0) {
        // Если ничего не выбрано
        buttonText.textContent = defaultText;
    } else if (selectedItems.length === 1) {
        // Если выбрана одна опция
        let displayText = selectedItems[0];
        
        // Проверяем, есть ли в тексте скобки, и если есть, берем только текст до скобок
        const bracketIndex = displayText.indexOf('(');
        if (bracketIndex > 0) {
            displayText = displayText.substring(0, bracketIndex).trim();
        }
        
        buttonText.textContent = displayText;
    } else {
        // Если выбрано несколько опций
        buttonText.textContent = `Выбрано ${selectedItems.length}`;
    }
}

/**
 * Инициализирует обработчики для кнопок "Забронировать"
 */
function initBookingButtons() {
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Получаем название ресторана/бара
            const card = this.closest('.restaurant-card');
            const title = card ? card.querySelector('.card-title').textContent : 'ресторан';
            
            // Заглушка для функционала бронирования
            alert(`Бронирование столика в "${title}" будет реализовано позже`);
        });
    });
}
