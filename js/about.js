// //////////////////////TEXT ANIMATION START////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.fade-in-left');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));
});
// //////////////////////TEXT ANIMATION END////////////////////////