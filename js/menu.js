document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('menuSearchInput');
    const dishItems = document.querySelectorAll('.dish-item');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const categoryLinks = document.querySelectorAll('.category-link');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const detailModal = document.getElementById('dishDetailModal');
    const detailImage = document.getElementById('dishDetailImage');
    const detailTitle = document.getElementById('dishDetailTitle');
    const detailSummary = document.getElementById('dishDetailSummary');
    const detailCategory = document.getElementById('dishDetailCategory');
    const detailOldPrice = document.getElementById('dishDetailOldPrice');
    const detailPrice = document.getElementById('dishDetailPrice');
    const detailRatingText = document.getElementById('dishDetailRatingText');
    const detailStars = document.getElementById('dishDetailStars');
    const detailOrders = document.getElementById('dishDetailOrders');
    const detailChef = document.getElementById('dishDetailChef');
    const detailPrep = document.getElementById('dishDetailPrep');
    const detailIngredients = document.getElementById('dishDetailIngredients');
    const detailServed = document.getElementById('dishDetailServedWith');
    const detailSpiceRow = document.getElementById('dishDetailSpiceRow');
    const detailSpice = document.getElementById('dishDetailSpice');

    let activeCategory = '';

    function syncFilterButtons() {
        if (clearFilterBtn) {
            clearFilterBtn.style.display = activeCategory ? 'block' : 'none';
        }

        if (viewAllBtn) {
            viewAllBtn.style.display = activeCategory ? 'none' : 'inline-block';
        }
    }

    const dishBaseData = {
        'Zesty Smash Burger': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['double-beef patty', 'cheddar', 'house relish', 'sesame brioche', 'pickled onions'],
            rating: 4.9,
            ordersThisWeek: 48,
            chef: 'Chef Elias Hart',
            prepTime: '12 min',
            servedWith: 'Crispy fries & aioli',
            spice: 'Mild',
            originalPrice: '$14.99',
            price: '$12.99'
        },
        'Truffle Mushroom Risotto': {
            categories: ['Dinner'],
            ingredients: ['Arborio rice', 'wild mushrooms', 'truffle oil', 'parmesan', 'thyme'],
            rating: 4.8,
            ordersThisWeek: 31,
            chef: 'Chef Sofia Moreno',
            prepTime: '18 min',
            servedWith: 'Garden greens',
            spice: 'Low',
            originalPrice: '$20.00',
            price: '$18.50'
        },
        'Fiery Peri Peri Wings': {
            categories: ['Lunch', 'Dinner', 'Chef Special'],
            ingredients: ['chicken wings', 'peri-peri glaze', 'lime', 'garlic butter', 'fresh herbs'],
            rating: 4.7,
            ordersThisWeek: 58,
            chef: 'Chef Daniel Brooks',
            prepTime: '14 min',
            servedWith: 'Cucumber salad',
            spice: 'Hot',
            originalPrice: '$15.99',
            price: '$14.00'
        },
        'Classic Berry Cheesecake': {
            categories: ['Dessert'],
            ingredients: ['cream cheese', 'berry compote', 'vanilla biscuit base', 'whipped cream', 'fresh berries'],
            rating: 4.9,
            ordersThisWeek: 39,
            chef: 'Chef Amara Lewis',
            prepTime: '8 min',
            servedWith: 'Berry drizzle',
            spice: null,
            originalPrice: '$10.99',
            price: '$8.99'
        },
        'Smoked Salmon Benedict': {
            categories: ['Breakfast', 'Lunch'],
            ingredients: ['poached eggs', 'brioche', 'smoked salmon', 'hollandaise', 'spinach'],
            rating: 4.8,
            ordersThisWeek: 27,
            chef: 'Chef Julian Price',
            prepTime: '16 min',
            servedWith: 'Herb potatoes',
            spice: 'Mild',
            originalPrice: '$17.99',
            price: '$16.00'
        },
        'Double Chocolate Mousse': {
            categories: ['Dessert'],
            ingredients: ['dark chocolate', 'cocoa', 'cream', 'sea salt caramel', 'gold leaf'],
            rating: 4.9,
            ordersThisWeek: 33,
            chef: 'Chef Lily Park',
            prepTime: '10 min',
            servedWith: 'Chocolate dust',
            spice: null,
            originalPrice: '$10.50',
            price: '$9.50'
        },
        'Lamb Kofta Kebab': {
            categories: ['Dinner'],
            ingredients: ['lamb mince', 'mint', 'garlic yogurt', 'charred peppers', 'warm pita'],
            rating: 4.7,
            ordersThisWeek: 24,
            chef: 'Chef Rahim Khan',
            prepTime: '17 min',
            servedWith: 'Yogurt dip & salad',
            spice: 'Medium',
            originalPrice: '$16.50',
            price: '$15.00'
        },
        'Mango & Passionfruit Tart': {
            categories: ['Dessert'],
            ingredients: ['buttery pastry', 'mango curd', 'passionfruit glaze', 'meringue', 'tropical fruit'],
            rating: 4.8,
            ordersThisWeek: 28,
            chef: 'Chef Amara Lewis',
            prepTime: '9 min',
            servedWith: 'Coconut cream',
            spice: null,
            originalPrice: '$12.50',
            price: '$11.50'
        },
        'Strawberry Waffles': {
            categories: ['Dessert','Breakfast'],
            ingredients: ['Belgian waffle', 'fresh strawberries', 'whipped cream', 'maple syrup', 'vanilla mascarpone'],
            rating: 4.7,
            ordersThisWeek: 22,
            chef: 'Chef Emma Reed',
            prepTime: '8 min',
            servedWith: 'Warm berry compote',
            spice: null,
            originalPrice: '$9.50',
            price: '$7.00'
        },
        'Chocolate Lava Cake': {
            categories: ['Dessert'],
            ingredients: ['dark chocolate', 'butter', 'cocoa', 'vanilla bean', 'sea salt'],
            rating: 4.8,
            ordersThisWeek: 25,
            chef: 'Chef Lily Park',
            prepTime: '11 min',
            servedWith: 'Vanilla ice cream',
            spice: null,
            originalPrice: '$8.00',
            price: '$6.50'
        },
        'New York Cheesecake': {
            categories: ['Dessert'],
            ingredients: ['cream cheese', 'graham crust', 'vanilla bean', 'berry coulis', 'whipped cream'],
            rating: 4.9,
            ordersThisWeek: 31,
            chef: 'Chef Amara Lewis',
            prepTime: '10 min',
            servedWith: 'Fresh berries',
            spice: null,
            originalPrice: '$11.50',
            price: '$9.50'
        },
        'Golden Fried Chicken': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['crispy chicken', 'herb salt', 'garlic aioli', 'pickles', 'lemon zest'],
            rating: 4.8,
            ordersThisWeek: 26,
            chef: 'Chef Daniel Brooks',
            prepTime: '15 min',
            servedWith: 'Crispy fries',
            spice: 'Mild',
            originalPrice: '$15.00',
            price: '$13.00'
        },
        'Artisan Pepperoni Pizza': {
            categories: ['Dinner'],
            ingredients: ['wood-fired crust', 'San Marzano tomato', 'mozzarella', 'pepperoni', 'basil'],
            rating: 4.8,
            ordersThisWeek: 33,
            chef: 'Chef Marco Voss',
            prepTime: '17 min',
            servedWith: 'Arugula salad',
            spice: 'Medium',
            originalPrice: '$18.50',
            price: '$16.00'
        },
        'Smoky BBQ Ribs': {
            categories: ['Dinner'],
            ingredients: ['pork ribs', 'smoky barbecue glaze', 'charred shallots', 'butter beans', 'herbs'],
            rating: 4.9,
            ordersThisWeek: 29,
            chef: 'Chef Rahim Khan',
            prepTime: '20 min',
            servedWith: 'Roasted vegetables',
            spice: 'Medium',
            originalPrice: '$23.50',
            price: '$22.00'
        },
        'Chef\'s Fried Rice': {
            categories: ['Lunch', 'Dinner', 'Chef Special'],
            ingredients: ['jasmine rice', 'prawns', 'egg', 'scallion', 'soy ginger sauce'],
            rating: 4.7,
            ordersThisWeek: 24,
            chef: 'Chef Sofia Moreno',
            prepTime: '13 min',
            servedWith: 'Cucumber relish',
            spice: 'Mild',
            originalPrice: '$14.00',
            price: '$12.00'
        },
        'Ramen Bowl': {
            categories: ['Lunch', 'Dinner', 'Chef Special'],
            ingredients: ['hand-pulled noodles', 'slow broth', 'chashu pork', 'marinated egg', 'bok choy'],
            rating: 4.9,
            ordersThisWeek: 35,
            chef: 'Chef Takumi Sato',
            prepTime: '18 min',
            servedWith: 'Sesame greens',
            spice: 'Medium',
            originalPrice: '$20.50',
            price: '$19.00'
        },
        'Crispy Beef Tacos': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['corn tortillas', 'seasoned beef', 'guacamole', 'lime crema', 'pickled onion'],
            rating: 4.8,
            ordersThisWeek: 26,
            chef: 'Chef Marco Voss',
            prepTime: '12 min',
            servedWith: 'Black bean salad',
            spice: 'Medium',
            originalPrice: '$14.00',
            price: '$13.00'
        },
        'Truffle Mushroom Pasta': {
            categories: ['Dinner', 'Chef Special'],
            ingredients: ['fettuccine', 'wild mushrooms', 'truffle cream', 'parmesan', 'garden herbs'],
            rating: 4.9,
            ordersThisWeek: 30,
            chef: 'Chef Sofia Moreno',
            prepTime: '16 min',
            servedWith: 'Garlic bread',
            spice: 'Low',
            originalPrice: '$19.50',
            price: '$18.00'
        },
        'Steamed Dumplings': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['hand-folded dumplings', 'beef mince', 'ginger', 'spring onion', 'black vinegar'],
            rating: 4.6,
            ordersThisWeek: 19,
            chef: 'Chef Takumi Sato',
            prepTime: '14 min',
            servedWith: 'Chilli oil dip',
            spice: 'Medium',
            originalPrice: '$11.00',
            price: '$9.00'
        },
        'Beef Machal': {
            categories: ['Dinner'],
            ingredients: ['beef cutlet', 'rosemary', 'cracked pepper', 'garlic butter', 'herb potatoes'],
            rating: 4.8,
            ordersThisWeek: 22,
            chef: 'Chef Rahim Khan',
            prepTime: '19 min',
            servedWith: 'Roasted greens',
            spice: 'Medium',
            originalPrice: '$26.00',
            price: '$25.00'
        },
        'Beef Biryani': {
            categories: ['Lunch','Dinner'],
            ingredients: ['basmati rice', 'beef', 'saffron', 'whole chilli', 'fried onion'],
            rating: 4.9,
            ordersThisWeek: 27,
            chef: 'Chef Rahim Khan',
            prepTime: '21 min',
            servedWith: 'Mint raita',
            spice: 'Medium',
            originalPrice: '$30.00',
            price: '$28.00'
        },
        'Thai Soup': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['broth', 'soft egg', 'scallion', 'chilli oil', 'tofu'],
            rating: 4.8,
            ordersThisWeek: 23,
            chef: 'Chef Takumi Sato',
            prepTime: '12 min',
            servedWith: 'Fresh herbs',
            spice: 'Hot',
            originalPrice: '$22.50',
            price: '$21.00'
        },
        'Margherita Wood-Fired Pizza': {
            categories: ['Dinner', 'Lunch'],
            ingredients: ['pizza dough', 'San Marzano tomato', 'mozzarella', 'basil', 'olive oil'],
            rating: 4.7,
            ordersThisWeek: 25,
            chef: 'Chef Marco Voss',
            prepTime: '15 min',
            servedWith: 'Baby greens',
            spice: 'Mild',
            originalPrice: '$29.50',
            price: '$28.00'
        },
        'Gourmet Loaded Nachos': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['corn chips', 'jack cheese', 'black beans', 'jalapenos', 'lime crema'],
            rating: 4.9,
            ordersThisWeek: 21,
            chef: 'Chef Marco Voss',
            prepTime: '11 min',
            servedWith: 'Guacamole',
            spice: 'Hot',
            originalPrice: '$11.00',
            price: '$10.00'
        },
        'Classic Caesar Salad': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['romaine', 'Caesar dressing', 'croutons', 'Parmesan', 'lemon'],
            rating: 4.8,
            ordersThisWeek: 20,
            chef: 'Chef Elias Hart',
            prepTime: '9 min',
            servedWith: 'Grilled chicken',
            spice: 'Mild',
            originalPrice: '$14.00',
            price: '$12.00'
        },
        'Creamy Tomato Basil Soup': {
            categories: ['Lunch', 'Dinner'],
            ingredients: ['tomato', 'basil', 'cream', 'garlic', 'sourdough'],
            rating: 4.9,
            ordersThisWeek: 18,
            chef: 'Chef Elias Hart',
            prepTime: '10 min',
            servedWith: 'Toasted sourdough',
            spice: 'Low',
            originalPrice: '$17.00',
            price: '$15.50'
        },
        'Slow-Roasted Beef Brisket': {
            categories: ['Dinner'],
            ingredients: ['beef brisket', 'roasted garlic mash', 'grilled vegetables', 'gravy', 'thyme'],
            rating: 5,
            ordersThisWeek: 16,
            chef: 'Chef Rahim Khan',
            prepTime: '22 min',
            servedWith: 'Herb butter',
            spice: 'Medium',
            originalPrice: '$34.50',
            price: '$32.00'
        },
        'Garlic Butter Shrimp Scampi': {
            categories: ['Dinner','Chef Special'],
            ingredients: ['jumbo shrimp', 'garlic', 'white wine butter', 'parsley', 'angel hair pasta'],
            rating: 4.8,
            ordersThisWeek: 18,
            chef: 'Chef Daniel Brooks',
            prepTime: '14 min',
            servedWith: 'Lemon zest',
            spice: 'Low',
            originalPrice: '$27.00',
            price: '$25.00'
        },
        'Grilled Salmon Steak': {
            categories: ['Lunch','Dinner'],
            ingredients: ['salmon steak', 'garlic', 'butter', 'fresh dill', 'lemon juice'],
            rating: 4.8,
            ordersThisWeek: 18,
            chef: 'Chef Elias Hart',
            prepTime: '15 min',
            servedWith: 'Steamed Vegetables',
            spice: 'Mild',
            originalPrice: '$25.00',
            price: '$24.00'
        }
    };

    function getDishData(title) {
        return dishBaseData[title] || {
            categories: ['Dessert'],
            ingredients: ['fresh seasonal produce', 'signature herbs', 'chef-selected seasoning'],
            rating: 4.8,
            ordersThisWeek: 18,
            chef: 'Head Chef',
            prepTime: '15 min',
            servedWith: 'House sides',
            spice: null,
            originalPrice: '$0.00',
            price: 'Market Price'
        };
    }

    function renderStars(rating) {
        const fullStars = Math.round(rating);
        let html = '';

        for (let i = 0; i < 5; i += 1) {
            html += i < fullStars ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }

        return html;
    }

    function openDishDetails(card) {
        if (!card || !detailModal) return;

        const title = card.querySelector('.dish-title')?.textContent?.trim() || 'Chef Special';
        const summary = card.querySelector('.dish-description')?.textContent?.trim() || '';
        const image = card.querySelector('img')?.src || '';
        const data = getDishData(title);
        const originalPrice = card.querySelector('.original-price')?.textContent?.trim() || data.originalPrice || '$0.00';
        const currentPrice = card.querySelector('.current-price')?.textContent?.trim() || data.price || '$0.00';
        const categoryText = (data.categories && data.categories.length) ? data.categories.join(', ') : 'Chef Special';

        detailImage.src = image;
        detailImage.alt = title;
        detailTitle.textContent = title;
        detailSummary.textContent = summary;
        detailCategory.textContent = categoryText;
        detailOldPrice.textContent = originalPrice;
        detailPrice.textContent = currentPrice;
        detailRatingText.textContent = `(${data.rating.toFixed(1)}★)`;
        detailStars.innerHTML = renderStars(data.rating);
        detailOrders.textContent = `${data.ordersThisWeek}`;
        detailChef.textContent = data.chef;
        detailPrep.textContent = data.prepTime;
        detailServed.textContent = data.servedWith || 'House sides';

        if (data.spice) {
            detailSpice.textContent = data.spice;
            detailSpiceRow.hidden = false;
        } else {
            detailSpiceRow.hidden = true;
        }

        detailIngredients.innerHTML = '';
        data.ingredients.forEach((ingredient) => {
            const item = document.createElement('li');
            item.textContent = ingredient;
            detailIngredients.appendChild(item);
        });

        detailModal.classList.add('open');
        detailModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('dish-modal-open');
    }

    function closeDishDetails() {
        if (!detailModal) return;

        detailModal.classList.remove('open');
        detailModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('dish-modal-open');
    }

    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            activeCategory = '';
            categoryLinks.forEach((item) => item.classList.remove('active'));
            document.querySelectorAll('.dish-item.hidden-dish').forEach((item) => {
                item.classList.remove('hidden-dish');
            });
            syncFilterButtons();
            filterDishes(searchInput ? searchInput.value : '', '');
        });
    }

    function filterDishes(searchValue = '', categoryValue = activeCategory) {
        const searchTerm = searchValue.toLowerCase().trim();
        const normalizedCategory = categoryValue.toLowerCase().trim();

        dishItems.forEach((item) => {
            if (item.classList.contains('hidden-dish')) {
                return;
            }

            const titleText = item.querySelector('.dish-title')?.textContent || '';
            const descriptionText = item.querySelector('.dish-description')?.textContent || '';
            const title = titleText.toLowerCase();
            const description = descriptionText.toLowerCase();
            const data = getDishData(titleText.trim());
            const categoryMatches = !normalizedCategory || (data.categories || []).some((cat) => cat.toLowerCase() === normalizedCategory);
            const textMatches = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);

            item.style.display = categoryMatches && textMatches ? 'block' : 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            filterDishes(e.target.value, activeCategory);
        });
    }

    categoryLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const nextCategory = link.textContent.trim();
            activeCategory = activeCategory === nextCategory ? '' : nextCategory;

            categoryLinks.forEach((item) => {
                item.classList.toggle('active', item === link && activeCategory !== '');
            });

            syncFilterButtons();
            filterDishes(searchInput ? searchInput.value : '', activeCategory);
        });
    });

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            activeCategory = '';
            categoryLinks.forEach((item) => item.classList.remove('active'));
            syncFilterButtons();
            filterDishes(searchInput ? searchInput.value : '', '');
        });
    }

    dishItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            const quickViewButton = event.target.closest('.overlay-btn[title="Quick View"]');

            if (quickViewButton) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            if (event.target.closest('a, button')) {
                return;
            }

            openDishDetails(item);
        });
    });

    document.querySelectorAll('.overlay-btn[title="Quick View"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const card = button.closest('.dish-card');
            if (card) {
                const dishItem = card.closest('.dish-item');
                openDishDetails(dishItem);
            }
        });
    });

    if (detailModal) {
        detailModal.addEventListener('click', (event) => {
            if (event.target === detailModal || event.target.hasAttribute('data-dish-close')) {
                closeDishDetails();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && detailModal && detailModal.classList.contains('open')) {
            closeDishDetails();
        }
    });

    syncFilterButtons();
    filterDishes('', '');
});
