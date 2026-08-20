//  ===================================== aside bar start ======================================= 

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const brandToggleTrigger = document.getElementById('brandToggleTrigger');
    const brandArrow = brandToggleTrigger.querySelector('.brand-toggle-arrow');
    const inventoryToggle = document.getElementById('inventoryToggle');
    const inventorySubmenu = document.getElementById('inventorySubmenu');
    const chevron = inventoryToggle.querySelector('.chevron-icon');
    let isDropdownOpen = false;

    // 1. Initial GSAP Entrance Animation (Sidebar Load Effect)
    gsap.from('.nav-item', {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
    });

    // 2. Logo Click - Smooth Collapse / Expand with GSAP
    brandToggleTrigger.addEventListener('click', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');

            // Arrow Rotate Animation
            gsap.to(brandArrow, {
                rotate: isCollapsed ? 180 : 0,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });

            // Close Submenu automatically if collapsing
            if (isCollapsed && isDropdownOpen) {
                closeDropdown();
            }

            // Quick bounce animation for icons on view mode change
            gsap.fromTo('.nav-link-custom i.icon', 
                { scale: 0.8 }, 
                { scale: 1, duration: 0.3, stagger: 0.02, ease: 'power1.out' }
            );
        }
    });

    // 3. Submenu Dropdown Accordion GSAP Functions
    function openDropdown() {
        gsap.to(inventorySubmenu, { 
            height: 'auto', 
            duration: 0.4, 
            ease: 'power3.out' 
        });
        gsap.to(chevron, { 
            rotate: 180, 
            duration: 0.3, 
            ease: 'power2.out' 
        });
        
        // Submenu Links Fade In
        gsap.fromTo('#inventorySubmenu .nav-item', 
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.1 }
        );
        isDropdownOpen = true;
    }

    function closeDropdown() {
        gsap.to(inventorySubmenu, { 
            height: 0, 
            duration: 0.3, 
            ease: 'power3.in' 
        });
        gsap.to(chevron, { 
            rotate: 0, 
            duration: 0.3, 
            ease: 'power2.in' 
        });
        isDropdownOpen = false;
    }

    inventoryToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Mini mode mein hover/click par sidebar pehle auto-expand hogi
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            gsap.to(brandArrow, { rotate: 0, duration: 0.3 });
            openDropdown();
            return;
        }

        if (!isDropdownOpen) {
            openDropdown();
        } else {
            closeDropdown();
        }
    });

// 4. Enhanced Mobile Off-Canvas Drawer Controls with Staggered Entrance
const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
let isMobileOpen = false;

function openMobileDrawer() {
    sidebarOverlay.style.display = 'block';
    
    // Toggle Animated Hamburger Class
    mobileSidebarToggle.classList.add('active');

    // Drawer Slide In
    gsap.to(sidebar, { x: '0%', duration: 0.4, ease: 'power3.out' });
    gsap.to(sidebarOverlay, { opacity: 1, duration: 0.3 });

    // Text & Items Smooth Stagger Animation
    gsap.fromTo('.sidebar .nav-item', 
        { opacity: 0, x: -25 }, 
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, delay: 0.1, ease: 'power2.out' }
    );

    isMobileOpen = true;
}

function closeMobileDrawer() {
    mobileSidebarToggle.classList.remove('active');

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
// Mobile Dedicated Close Button Event
const mobileDrawerClose = document.getElementById('mobileDrawerClose');

if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', (e) => {
        e.stopPropagation(); // Brand toggle click prevent karne ke liye
        closeMobileDrawer();
    });
}
});
//  ===================================== aside bar end ======================================= 
