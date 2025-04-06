/**
 * В этом файле хранятся все ссылки на изображения ресторанов и баров
 */

const IMAGES = {
    // Рестораны
    restaurants: {
        supra: {
            name: "Супра",
            elementId: "supra",
            image: "assets/images/restaurants/Supra.jpg",
            imageFit: "cover", // cover, contain, fill
            imagePosition: "center" // center, top, bottom, left, right, или "x% y%"
        },
        tokyoKawaii: {
            name: "Tokyo Kawaii",
            elementId: "tokyo",
            image: "assets/images/restaurants/Tokyo_Kawaii.jpg",
            imageFit: "cover",
            imagePosition: "center"
        },
        millionka: {
            name: "Миллионка",
            elementId: "millionka",
            image: "assets/images/restaurants/Millionka.jpg",
            imageFit: "cover",
            imagePosition: "center"
        },
        ilPatio: {
            name: "IL Патио",
            elementId: "ilpatio",
            image: "assets/images/restaurants/IL_Patio.jpg",
            imageFit: "cover",
            imagePosition: "center"
        }
    },
    
    // Бары
    bars: {
        bruggePub: {
            name: "Brugge Pub",
            elementId: "brugge",
            image: "assets/images/bars/Brugge_Pub.jpg",
            imageFit: "cover",
            imagePosition: "90% center",
        },
        atelier: {
            name: "Atelier",
            elementId: "atelier",
            image: "assets/images/bars/Atelier.jpg",
            imageFit: "cover",
            imagePosition: "center"
        },
        mumiyTroll: {
            name: "Мумий Тролль",
            elementId: "mumiy",
            image: "assets/images/bars/Mummi_Troll.jpg",
            imageFit: "cover",
            imagePosition: "center"
        },
        zhuklevich: {
            name: "Жуклевичъ",
            elementId: "zhuklevich",
            image: "assets/images/bars/Jiklevich.jpg",
            imageFit: "cover",
            imagePosition: "center"
        }
    },
    
    // Специальные предложения
    offers: {
        summerTerraces: {
            title: "Лучшие летние террасы",
            image: "https://via.placeholder.com/300x200",
            imageFit: "cover",
            imagePosition: "center"
        },
        romanticDinner: {
            title: "Романтический ужин",
            image: "https://via.placeholder.com/300x200",
            imageFit: "cover",
            imagePosition: "center"
        },
        weeklyDiscounts: {
            title: "Скидки недели",
            image: "https://via.placeholder.com/300x200",
            imageFit: "cover",
            imagePosition: "center"
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IMAGES;
} 