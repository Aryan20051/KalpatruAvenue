document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const faqQuestions = document.querySelectorAll(".faq-question");
    const revealItems = document.querySelectorAll(".animate-up, .reveal");

    // NEW: Modal elements
    // NEW: Support all enquiry buttons opening the same modal
    const modalTriggers = document.querySelectorAll(".enquire-modal-trigger");
    const modalOverlay = document.getElementById("enquire-modal");
    const modalClose = document.querySelector(".modal-close");

    const closeMenu = () => {
        body.classList.remove("menu-open");
        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }
    };

    // NEW: Modal functions
    const openModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.add("is-open");
            body.style.overflow = "hidden";
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove("is-open");
            body.style.overflow = "";
        }
    };

    // NEW: Modal event listeners
    modalTriggers.forEach((trigger) => {
        trigger.addEventListener("click", openModal);
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    // NEW: Close modal when clicking on overlay (outside modal content)
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // NEW: Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay?.classList.contains("is-open")) {
            closeModal();
        }
    });

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

    // ── Gallery Carousel ──
    const carousel = document.getElementById("gallery-carousel");
    if (carousel) {
        const track = carousel.querySelector(".carousel-track");
        const slides = carousel.querySelectorAll(".carousel-slide");
        const dots = carousel.querySelectorAll(".carousel-dot");
        const prevBtn = carousel.querySelector(".carousel-prev");
        const nextBtn = carousel.querySelector(".carousel-next");
        let current = 0;
        let autoTimer = null;

        const goTo = (index) => {
            current = ((index % slides.length) + slides.length) % slides.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle("active", i === current));
        };

        const next = () => goTo(current + 1);
        const prev = () => goTo(current - 1);

        const startAuto = () => { autoTimer = setInterval(next, 4000); };
        const stopAuto = () => { clearInterval(autoTimer); };

        nextBtn.addEventListener("click", () => { stopAuto(); next(); startAuto(); });
        prevBtn.addEventListener("click", () => { stopAuto(); prev(); startAuto(); });
        dots.forEach((dot) => {
            dot.addEventListener("click", () => { stopAuto(); goTo(+dot.dataset.slide); startAuto(); });
        });

        carousel.addEventListener("mouseenter", stopAuto);
        carousel.addEventListener("mouseleave", startAuto);

        // Touch swipe support
        let touchStartX = 0;
        carousel.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; stopAuto(); }, { passive: true });
        carousel.addEventListener("touchend", (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
            startAuto();
        }, { passive: true });

        startAuto();
    }

    // ── Testimonial Carousel ──
    const tCarousel = document.getElementById("testimonial-carousel");
    if (tCarousel) {
        const tTrack = tCarousel.querySelector(".testimonial-track");
        const tSlides = tCarousel.querySelectorAll(".testimonial-slide");
        const tDots = tCarousel.querySelectorAll("[data-tslide]");
        const tPrevBtn = tCarousel.querySelector(".testimonial-prev");
        const tNextBtn = tCarousel.querySelector(".testimonial-next");
        const tProgressBar = tCarousel.querySelector(".testimonial-progress-bar");
        const tCounter = tCarousel.querySelector(".testimonial-counter");
        let tCurrent = 0;
        let tTimer = null;

        const tGoTo = (index) => {
            tCurrent = ((index % tSlides.length) + tSlides.length) % tSlides.length;
            tTrack.style.transform = `translateX(-${tCurrent * 100}%)`;
            tDots.forEach((d, i) => d.classList.toggle("active", i === tCurrent));
            tSlides.forEach((slide, i) => {
                const isActive = i === tCurrent;
                slide.classList.toggle("is-active", isActive);
                slide.setAttribute("aria-hidden", String(!isActive));
            });

            if (tProgressBar) {
                tProgressBar.style.width = `${((tCurrent + 1) / tSlides.length) * 100}%`;
            }

            if (tCounter) {
                tCounter.textContent = `${String(tCurrent + 1).padStart(2, "0")} / ${String(tSlides.length).padStart(2, "0")}`;
            }
        };

        const tNext = () => tGoTo(tCurrent + 1);
        const tPrev = () => tGoTo(tCurrent - 1);
        const tStartAuto = () => {
            clearInterval(tTimer);
            tTimer = setInterval(tNext, 3600);
        };
        const tStopAuto = () => { clearInterval(tTimer); };

        tNextBtn?.addEventListener("click", () => { tStopAuto(); tNext(); tStartAuto(); });
        tPrevBtn?.addEventListener("click", () => { tStopAuto(); tPrev(); tStartAuto(); });

        tDots.forEach((dot) => {
            dot.addEventListener("click", () => { tStopAuto(); tGoTo(+dot.dataset.tslide); tStartAuto(); });
        });

        tCarousel.addEventListener("mouseenter", tStopAuto);
        tCarousel.addEventListener("mouseleave", tStartAuto);

        let tTouchX = 0;
        tCarousel.addEventListener("touchstart", (e) => { tTouchX = e.changedTouches[0].clientX; tStopAuto(); }, { passive: true });
        tCarousel.addEventListener("touchend", (e) => {
            const diff = tTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? tNext() : tPrev(); }
            tStartAuto();
        }, { passive: true });

        tGoTo(0);
        tStartAuto();
    }
});
