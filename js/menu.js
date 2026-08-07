document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('menuSearchInput');
            const dishItems = document.querySelectorAll('.dish-item');

            searchInput.addEventListener('keyup', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();

                dishItems.forEach((item) => {
                    const title = item.querySelector('.dish-title').textContent.toLowerCase();
                    const description = item.querySelector('.dish-description').textContent.toLowerCase();

                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });