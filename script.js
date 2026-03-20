document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const faqQuestions = document.querySelectorAll(".faq-question");
    const revealItems = document.querySelectorAll(".animate-up, .reveal");

    const closeMenu = () => {
        body.classList.remove("menu-open");
        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isOpen = body.classList.toggle("menu-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.tab;

            tabButtons.forEach((item) => item.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            button.classList.add("active");

            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add("active");
            }
        });
    });

    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const currentItem = question.closest(".faq-item");

            faqQuestions.forEach((otherQuestion) => {
                const item = otherQuestion.closest(".faq-item");
                if (item && item !== currentItem) {
                    item.classList.remove("active");
                }
            });

            if (currentItem) {
                currentItem.classList.toggle("active");
            }
        });
    });

    const updateNavbar = () => {
        if (!navbar) {
            return;
        }

        navbar.classList.toggle("scrolled", window.scrollY > 24);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
            observer.observe(item);
        });
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }
});
