document.addEventListener('DOMContentLoaded', function() {
    loadImages();
    
    initFilters();
    
    initBookingButtons();
    
    window.addEventListener('load', function() {
        setTimeout(updateCarouselDimensions, 300);
    });
});

function updateCarouselDimensions() {
    if (typeof updateCarouselState === 'function') {
        updateCarouselState(0);
    }
}

function loadImages() {
    if (typeof IMAGES === 'undefined') {
        console.error('Объект IMAGES не найден. Убедитесь, что файл images.js загружен перед script.js');
        return;
    }
    
    for (const key in IMAGES.restaurants) {
        const restaurant = IMAGES.restaurants[key];
        const elementId = restaurant.elementId || key.toLowerCase();
        
        const imgElement = document.getElementById(`img-restaurant-${elementId}`);
        if (imgElement) {
            if (restaurant.imageFit) {
                imgElement.style.objectFit = restaurant.imageFit;
            }
            
            if (restaurant.imagePosition) {
                imgElement.style.objectPosition = restaurant.imagePosition;
            }
            
            imgElement.src = restaurant.image;
            imgElement.alt = restaurant.name;
        } else {
            console.log(`Элемент с ID img-restaurant-${elementId} не найден для ресторана ${restaurant.name}`);
        }
    }
    
    for (const key in IMAGES.bars) {
        const bar = IMAGES.bars[key];
        const elementId = bar.elementId || key.toLowerCase();
        
        const imgElement = document.getElementById(`img-bar-${elementId}`);
        if (imgElement) {
            if (bar.imageFit) {
                imgElement.style.objectFit = bar.imageFit;
            }
            
            if (bar.imagePosition) {
                imgElement.style.objectPosition = bar.imagePosition;
            }
            
            imgElement.src = bar.image;
            imgElement.alt = bar.name;
        } else {
            console.log(`Элемент с ID img-bar-${elementId} не найден для бара ${bar.name}`);
        }
    }
}

const selectedCuisines = new Set();

const selectedPrices = new Set();

const selectedLocations = new Set();

function initFilters() {
    if (typeof FILTERS_DATA === 'undefined') {
        console.error('Объект FILTERS_DATA не найден. Убедитесь, что файл filters-data.js загружен перед script.js');
        return;
    }
    
    initFilterButtonText();
    
    const cuisineFilter = document.querySelector('.filter-item:nth-child(1) .filter-btn');
    if (cuisineFilter) {
        cuisineFilter.addEventListener('click', function() {
            showDropdown(this, FILTERS_DATA.cuisines, 'cuisine');
        });
    }
    
    const priceFilter = document.querySelector('.filter-item:nth-child(2) .filter-btn');
    if (priceFilter) {
        priceFilter.addEventListener('click', function() {
            showDropdown(this, FILTERS_DATA.prices, 'price');
        });
    }
    
    const locationFilter = document.querySelector('.filter-item:nth-child(3) .filter-btn');
    if (locationFilter) {
        locationFilter.addEventListener('click', function() {
            showDropdown(this, FILTERS_DATA.locations, 'location');
        });
    }
    
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            alert('Функция поиска будет реализована позже');
        });
    }
    
    initSorting();
}

function initSorting() {
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) {
        const sortBtnText = sortBtn.querySelector('span');
        if (sortBtnText && FILTERS_DATA.sorting.title) {
            sortBtnText.textContent = FILTERS_DATA.sorting.title;
        }
        
        sortBtn.addEventListener('click', function() {
            const sortContainer = sortBtn.closest('.sort-by');
            const existingList = sortContainer.querySelector('.sort-dropdown');
            
            if (existingList) {
                existingList.remove();
                sortContainer.classList.remove('open');
                return;
            }
            
            document.querySelectorAll('.filter-dropdown').forEach(dropdown => dropdown.remove());
            document.querySelectorAll('.filter-item.open').forEach(item => {
                item.classList.remove('open');
            });
            
            sortContainer.classList.add('open');
            
            const sortList = document.createElement('div');
            sortList.className = 'sort-dropdown';
            
            FILTERS_DATA.sorting.options.forEach(sort => {
                const sortItem = document.createElement('div');
                sortItem.className = 'sort-option';
                sortItem.textContent = sort.name;
                sortItem.dataset.value = sort.value;
                
                sortItem.addEventListener('click', function() {
                    if (sortBtnText) {
                        sortBtnText.textContent = sort.name;
                    }
                    
                    console.log(`Сортировка: ${sort.value}`);
                    
                    sortList.remove();
                    sortContainer.classList.remove('open');
                });
                
                sortList.appendChild(sortItem);
            });
            
            if (sortContainer) {                
                sortContainer.appendChild(sortList);
                
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

function initFilterButtonText() {
    initButtonText('.filter-item:nth-child(1) .filter-btn', selectedCuisines, 'Кухня');
    
    initButtonText('.filter-item:nth-child(2) .filter-btn', selectedPrices, 'Средний чек');
    
    initButtonText('.filter-item:nth-child(3) .filter-btn', selectedLocations, 'Местоположение');
}

function initButtonText(selector, selectedItems, defaultText) {
    const buttonText = document.querySelector(`${selector} span`);
    if (!buttonText) return;
    
    if (selectedItems.size === 0) {
        buttonText.textContent = defaultText;
    } else if (selectedItems.size === 1) {
        buttonText.textContent = Array.from(selectedItems)[0];
    } else {
        buttonText.textContent = `${defaultText} (${selectedItems.size})`;
    }
}

function showDropdown(filterButton, options, filterType) {
    const filterItem = filterButton.closest('.filter-item');
    
    if (!filterItem) return;
    
    const existingDropdown = filterItem.querySelector('.filter-dropdown');
    
    if (existingDropdown) {
        existingDropdown.remove();
        filterItem.classList.remove('open');
        return;
    }
    
    document.querySelectorAll('.filter-dropdown').forEach(dropdown => dropdown.remove());
    document.querySelectorAll('.filter-item.open').forEach(item => {
        item.classList.remove('open');
    });
    
    document.querySelectorAll('.sort-dropdown').forEach(dropdown => dropdown.remove());
    document.querySelectorAll('.sort-by.open').forEach(item => {
        item.classList.remove('open');
    });
    
    filterItem.classList.add('open');
    
    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'filter-search';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск';
    searchInput.className = 'filter-search-input';
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const checkboxes = dropdown.querySelectorAll('.filter-option:not(.all-option)');
        
        checkboxes.forEach(option => {
            const label = option.querySelector('label');
            const text = label.textContent.toLowerCase();
            
            if (text.includes(searchTerm)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    });
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    dropdown.appendChild(searchContainer);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'filter-options';
    
    let selectedValues;
    let defaultButtonText;
    
    switch (filterType) {
        case 'cuisine':
            selectedValues = selectedCuisines;
            defaultButtonText = 'Кухня';
            break;
        case 'price':
            selectedValues = selectedPrices;
            defaultButtonText = 'Средний чек';
            break;
        case 'location':
            selectedValues = selectedLocations;
            defaultButtonText = 'Местоположение';
            break;
        default:
            selectedValues = new Set();
            defaultButtonText = 'Фильтр';
    }
    
    const allOption = document.createElement('div');
    allOption.className = 'filter-option all-option';
    
    const allCheckbox = document.createElement('input');
    allCheckbox.type = 'checkbox';
    allCheckbox.id = `${filterType}-all`;
    allCheckbox.checked = selectedValues.size === 0;
    
    const allLabel = document.createElement('label');
    allLabel.htmlFor = `${filterType}-all`;
    allLabel.textContent = 'Все';
    
    allOption.appendChild(allCheckbox);
    allOption.appendChild(allLabel);
    
    optionsContainer.appendChild(allOption);
    
    const checkboxes = [];
    
    options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'filter-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${filterType}-${index}`;
        checkbox.checked = selectedValues.has(option.name);
        
        const label = document.createElement('label');
        label.htmlFor = `${filterType}-${index}`;
        label.textContent = option.name;
        
        checkbox.addEventListener('change', function() {
            handleCheckboxLogic(this, option.name, allCheckbox, checkboxes, selectedValues, filterButton, defaultButtonText);
        });
        
        checkboxes.push(checkbox);
        
        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(label);
        
        optionsContainer.appendChild(optionDiv);
    });
    
    allCheckbox.addEventListener('change', function() {
        if (this.checked) {
            selectedValues.clear();
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
        } else {
            this.checked = true;
        }
        
        updateButtonText(filterButton, checkboxes, allCheckbox, defaultButtonText);
    });
    
    dropdown.appendChild(optionsContainer);
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'filter-buttons';
    
    const applyBtn = document.createElement('button');
    applyBtn.className = 'filter-apply-btn';
    applyBtn.textContent = 'Применить';
    
    applyBtn.addEventListener('click', function() {
        dropdown.remove();
        filterItem.classList.remove('open');
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'filter-reset-btn';
    resetBtn.textContent = 'Сбросить';
    
    resetBtn.addEventListener('click', function() {
        selectedValues.clear();
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        allCheckbox.checked = true;
        
        updateButtonText(filterButton, checkboxes, allCheckbox, defaultButtonText);
    });
    
    btnContainer.appendChild(resetBtn);
    btnContainer.appendChild(applyBtn);
    
    dropdown.appendChild(btnContainer);
    
    filterItem.appendChild(dropdown);
    
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== filterButton && !filterButton.contains(e.target)) {
            dropdown.remove();
            filterItem.classList.remove('open');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function handleCheckboxLogic(checkbox, option, allCheckbox, checkboxes, selectedSet, filterButton, defaultButtonText) {
    if (checkbox.checked) {
        selectedSet.add(option);
        allCheckbox.checked = false;
    } else {
        selectedSet.delete(option);
        
        const anyChecked = checkboxes.some(cb => cb.checked);
        if (!anyChecked) {
            allCheckbox.checked = true;
        }
    }
    
    updateButtonText(filterButton, checkboxes, allCheckbox, defaultButtonText);
}

function updateButtonText(filterButton, checkboxes, allCheckbox, defaultText) {
    const buttonSpan = filterButton.querySelector('span');
    if (!buttonSpan) return;
    
    if (allCheckbox.checked) {
        buttonSpan.textContent = defaultText;
        return;
    }
    
    const checkedOptions = checkboxes.filter(cb => cb.checked);
    
    if (checkedOptions.length === 0) {
        buttonSpan.textContent = defaultText;
        allCheckbox.checked = true;
    } else if (checkedOptions.length === 1) {
        const checkedLabel = document.querySelector(`label[for="${checkedOptions[0].id}"]`);
        buttonSpan.textContent = checkedLabel ? checkedLabel.textContent : defaultText;
    } else {
        buttonSpan.textContent = `${defaultText} (${checkedOptions.length})`;
    }
}

function initBookingButtons() {
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.card');
            if (!card) return;
            
            const titleElement = card.querySelector('.card-title');
            const title = titleElement ? titleElement.textContent : 'ресторан';
            
            alert(`Функционал бронирования для "${title}" будет реализован позже`);
        });
    });
}

window.updateFilterHeaderHeight = function() {
    const filterHeader = document.querySelector('.search-section');
    const mainNav = document.querySelector('.main-nav');
    
    if (filterHeader && mainNav) {
        const filterHeaderHeight = filterHeader.offsetHeight;
        const mainNavTop = mainNav.offsetTop;
        
        if (window.pageYOffset > filterHeaderHeight) {
            mainNav.classList.add('fixed');
            document.body.style.paddingTop = `${mainNavTop}px`;
        } else {
            mainNav.classList.remove('fixed');
            document.body.style.paddingTop = 0;
        }
    }
};

window.addEventListener('scroll', function() {
    if (typeof window.updateFilterHeaderHeight === 'function') {
        window.updateFilterHeaderHeight();
    }
});
