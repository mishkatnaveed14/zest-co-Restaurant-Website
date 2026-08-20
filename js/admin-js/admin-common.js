document.addEventListener('DOMContentLoaded', () => {
            const inventoryToggle = document.getElementById('inventoryToggle');
            const inventorySubmenu = document.getElementById('inventorySubmenu');
            const chevron = inventoryToggle.querySelector('.chevron-icon');
            let isDropdownOpen = false;

            // GSAP Animated Accordion Dropdown
            inventoryToggle.addEventListener('click', (e) => {
                e.preventDefault();

                if (!isDropdownOpen) {
                    gsap.to(inventorySubmenu, {
                        height: 'auto',
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                    gsap.to(chevron, { rotate: 180, duration: 0.3 });
                    isDropdownOpen = true;
                } else {
                    gsap.to(inventorySubmenu, {
                        height: 0,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                    gsap.to(chevron, { rotate: 0, duration: 0.3 });
                    isDropdownOpen = false;
                }
            });

            // GSAP Responsive Mobile Drawer Control
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            let isMobileOpen = false;

            function openDrawer() {
                sidebarOverlay.style.display = 'block';
                gsap.to(sidebar, { x: '0%', duration: 0.4, ease: 'power3.out' });
                gsap.to(sidebarOverlay, { opacity: 1, duration: 0.3 });
                isMobileOpen = true;
            }

            function closeDrawer() {
                gsap.to(sidebar, { x: '-100%', duration: 0.3, ease: 'power3.in' });
                gsap.to(sidebarOverlay, { 
                    opacity: 0, 
                    duration: 0.3, 
                    onComplete: () => { sidebarOverlay.style.display = 'none'; } 
                });
                isMobileOpen = false;
            }

            sidebarToggle.addEventListener('click', () => {
                if (!isMobileOpen) openDrawer();
                else closeDrawer();
            });

            sidebarOverlay.addEventListener('click', closeDrawer);
        });