document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const desktopCollapseBtn = document.getElementById('desktopSidebarCollapse');
            const inventoryToggle = document.getElementById('inventoryToggle');
            const inventorySubmenu = document.getElementById('inventorySubmenu');
            const chevron = inventoryToggle.querySelector('.chevron-icon');
            let isDropdownOpen = false;

            // 1. Desktop Mini / Expanded Sidebar Toggle
            desktopCollapseBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                
                // Switch button icon
                const btnIcon = desktopCollapseBtn.querySelector('i');
                if(sidebar.classList.contains('collapsed')) {
                    btnIcon.className = 'bi bi-layout-sidebar';
                    // Mini mode hone par dropdown auto-close karna
                    if(isDropdownOpen) closeDropdown();
                } else {
                    btnIcon.className = 'bi bi-layout-sidebar-inset';
                }
            });

            // 2. GSAP Dropdown Accordion Function
            function openDropdown() {
                gsap.to(inventorySubmenu, { height: 'auto', duration: 0.35, ease: 'power2.out' });
                gsap.to(chevron, { rotate: 180, duration: 0.3 });
                isDropdownOpen = true;
            }

            function closeDropdown() {
                gsap.to(inventorySubmenu, { height: 0, duration: 0.3, ease: 'power2.in' });
                gsap.to(chevron, { rotate: 0, duration: 0.3 });
                isDropdownOpen = false;
            }

            inventoryToggle.addEventListener('click', (e) => {
                e.preventDefault();
                // Agar mini mode active ho, dropdown open karne par sidebar auto expand ho jayegi
                if(sidebar.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                    openDropdown();
                    return;
                }

                if (!isDropdownOpen) openDropdown();
                else closeDropdown();
            });

            // 3. Mobile Drawer Controls
            const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            let isMobileOpen = false;

            function openMobileDrawer() {
                sidebarOverlay.style.display = 'block';
                gsap.to(sidebar, { x: '0%', duration: 0.35, ease: 'power3.out' });
                gsap.to(sidebarOverlay, { opacity: 1, duration: 0.3 });
                isMobileOpen = true;
            }

            function closeMobileDrawer() {
                gsap.to(sidebar, { x: '-100%', duration: 0.3, ease: 'power3.in' });
                gsap.to(sidebarOverlay, { 
                    opacity: 0, 
                    duration: 0.3, 
                    onComplete: () => { sidebarOverlay.style.display = 'none'; } 
                });
                isMobileOpen = false;
            }

            mobileSidebarToggle.addEventListener('click', () => {
                if (!isMobileOpen) openMobileDrawer();
                else closeMobileDrawer();
            });

            sidebarOverlay.addEventListener('click', closeMobileDrawer);
        });