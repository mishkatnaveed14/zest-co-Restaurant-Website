document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('menuSearchInput');
            const dishItems = document.querySelectorAll('.dish-item');
            const viewAllBtn = document.getElementById('viewAllBtn');
            const categoryLinks = document.querySelectorAll('.category-link');

            // Reveal all hidden items when "View All Items" is clicked, then hide the button.
            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', () => {
                    document.querySelectorAll('.dish-item.hidden-dish').forEach((item) => {
                        item.classList.remove('hidden-dish');
                    });
                    viewAllBtn.style.display = 'none';
                });
            }

            // Shared filter logic: hide/show dishes based on the given term.
            function filterDishes(term) {
                const searchTerm = term.toLowerCase().trim();

                dishItems.forEach((item) => {
                    // Skip hidden (not yet revealed) dishes.
                    if (item.classList.contains('hidden-dish')) {
                        return;
                    }

                    const title = item.querySelector('.dish-title').textContent.toLowerCase();
                    const description = item.querySelector('.dish-description').textContent.toLowerCase();

                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            searchInput.addEventListener('keyup', (e) => {
                filterDishes(e.target.value);
            });

            // Category clicks filter using the category name, same as the search behaviour.
            categoryLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    filterDishes(link.textContent.trim());
                });
            });
        });
