//  ================= Top Navbar Header start ========================
// User Profile Dropdown Animation via GSAP
const profileTrigger = document.querySelector('.profile-trigger');
const profileMenu = document.getElementById('profileMenu');
const profileChevron = document.querySelector('.profile-chevron');
let isProfileOpen = false;

function toggleProfileMenu() {
    if (!isProfileOpen) {
        profileMenu.style.display = 'block';
        gsap.to(profileMenu, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
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

    // Close on Outside Click
    document.addEventListener('click', (e) => {
        if (isProfileOpen && !profileMenu.contains(e.target)) {
            toggleProfileMenu();
        }
    });
}

//  ================= Top Navbar Header end ========================