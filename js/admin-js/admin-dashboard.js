//  ================= Top Navbar Header start ========================
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const brandToggleTrigger = document.getElementById('brandToggleTrigger');
    const searchBox = document.getElementById('searchBox');
    const titleText = document.querySelector('.title-text');
    const subtitleText = document.querySelector('.subtitle-text');

    // 1. Sidebar Collapse Event - Synchronized Header Animation
    if (brandToggleTrigger) {
        brandToggleTrigger.addEventListener('click', () => {
            if (window.innerWidth >= 992) {
                const isCollapsed = sidebar.classList.contains('collapsed');

                if (isCollapsed) {
                    // Jab Drawer Icon-Mode (Collapsed) par aye tu Search Bar widen ho jaye
                    gsap.to(searchBox, { width: '340px', duration: 0.35, ease: 'power2.out' });
                    
                    // Title Text Micro-Bounce Animation
                    gsap.fromTo(titleText, 
                        { y: -5, opacity: 0.7 }, 
                        { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
                    );
                } else {
                    // Normal Expand state par standard size par chala jaye
                    gsap.to(searchBox, { width: '260px', duration: 0.35, ease: 'power2.out' });
                }
            }
        });
    }

    // 2. Action Icons Micro-Interaction (Hover Effect via GSAP)
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.1, duration: 0.2, ease: 'power1.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1.0, duration: 0.2, ease: 'power1.in' });
        });
    });

    // 3. User Profile Dropdown GSAP Animation
    const profileTrigger = document.getElementById('profileTrigger');
    const profileMenu = document.getElementById('profileMenu');
    const profileChevron = document.querySelector('.profile-chevron');
    let isProfileOpen = false;

    function toggleProfileMenu() {
        if (!isProfileOpen) {
            profileMenu.style.display = 'block';
            gsap.fromTo(profileMenu, 
                { opacity: 0, y: -15 }, 
                { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
            );
            if (profileChevron) gsap.to(profileChevron, { rotate: 180, duration: 0.25 });
            isProfileOpen = true;
        } else {
            gsap.to(profileMenu, { 
                opacity: 0, 
                y: -10, 
                duration: 0.2, 
                ease: 'power2.in',
                onComplete: () => { profileMenu.style.display = 'none'; } 
            });
            if (profileChevron) gsap.to(profileChevron, { rotate: 0, duration: 0.25 });
            isProfileOpen = false;
        }
    }

    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProfileMenu();
        });

        document.addEventListener('click', (e) => {
            if (isProfileOpen && !profileMenu.contains(e.target)) {
                toggleProfileMenu();
            }
        });
    }
});

//  ================= Top Navbar Header end ========================