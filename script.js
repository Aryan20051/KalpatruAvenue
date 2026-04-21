document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const faqQuestions = document.querySelectorAll(".faq-question");
    const faqPanelImage = document.getElementById("faq-panel-image");
    const faqPanelTitle = document.getElementById("faq-panel-title");
    const faqVisualMedia = document.getElementById("faq-visual-media");
    const faqLayout = document.querySelector(".faq-layout");
    const faqContainer = faqLayout?.querySelector(".faq-container");
    const faqVisual = faqLayout?.querySelector(".faq-visual");
    const faqMobileQuery = window.matchMedia("(max-width: 640px)");
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
                // Trigger recalculation for carousels that were hidden
                requestAnimationFrame(() => {
                    window.dispatchEvent(new Event("resize"));
                });
            }
        });
    });

    const setFaqPanelContent = (item) => {
        if (!item || !faqPanelImage || !faqVisualMedia) return;

        const imageSrc = item.dataset.faqImage;
        const imageTitle = item.dataset.faqTitle || "FAQ highlight";

        if (!imageSrc) return;

        faqVisualMedia.classList.add("is-transitioning");
        window.setTimeout(() => {
            faqPanelImage.src = imageSrc;
            faqPanelImage.alt = imageTitle;
            if (faqPanelTitle) {
                faqPanelTitle.textContent = imageTitle;
            }
            requestAnimationFrame(() => {
                faqVisualMedia.classList.remove("is-transitioning");
            });
        }, 160);
    };

    const activateFaq = (targetItem) => {
        if (!targetItem) return;

        faqItems.forEach((item) => {
            const isActive = item === targetItem;
            item.classList.toggle("active", isActive);
            const btn = item.querySelector(".faq-question");
            if (btn) {
                btn.setAttribute("aria-expanded", String(isActive));
            }
        });

        setFaqPanelContent(targetItem);

        if (faqVisual && faqLayout && faqContainer) {
            if (faqMobileQuery.matches) {
                targetItem.insertAdjacentElement("afterend", faqVisual);
            } else {
                faqLayout.appendChild(faqVisual);
            }
        }
    };

    if (faqItems.length > 0) {
        const initialItem = faqItems.find((item) => item.classList.contains("active")) || faqItems[0];

        // Preload mapped FAQ visuals for smoother panel transitions.
        faqItems.forEach((item) => {
            if (!item.dataset.faqImage) return;
            const img = new Image();
            img.src = item.dataset.faqImage;
        });

        activateFaq(initialItem);
    }

    faqMobileQuery.addEventListener("change", () => {
        const activeItem = faqItems.find((item) => item.classList.contains("active")) || faqItems[0];
        if (activeItem) {
            activateFaq(activeItem);
        }
    });

    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const currentItem = question.closest(".faq-item");
            if (!currentItem) return;
            activateFaq(currentItem);
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

    // ── Gallery Carousel (Dynamic 11-Image) ──
    const carousel = document.getElementById("gallery-carousel");
    if (carousel) {
        const track = document.getElementById("gallery-track");
        const dotsContainer = document.getElementById("gallery-dots");
        const prevBtn = carousel.querySelector(".carousel-prev");
        const nextBtn = carousel.querySelector(".carousel-next");
        
        // Visual Preview carousel: 3 existing images + 8 newly uploaded amenity images
        const galleryImages = [
            { src: 'assets/gallery/facade.jpg', label: 'Signature facade' },
            { src: 'assets/gallery/gym.jpg', label: 'Green open spaces' },
            { src: 'assets/gallery/green-space.jpg', label: 'Fitness amenities' },
            { src: 'assets/amenities/amenity1.jpg', label: 'Infinity pool deck' },
            { src: 'assets/amenities/amenity2.jpg', label: 'Designer kitchen' },
            { src: 'assets/amenities/amenity3.jpg', label: 'Kids play zone' },
            { src: 'assets/amenities/amenity4.jpg', label: 'Rooftop lounge' },
            { src: 'assets/amenities/amenity5.jpg', label: 'Family living room' },
            { src: 'assets/amenities/amenity6.jpg', label: 'Master bedroom' },
            { src: 'assets/amenities/amenity7.jpg', label: 'Coworking lounge' },
            { src: 'assets/amenities/amenity8.jpg', label: 'Grand entrance lobby' },
            { src: 'assets/amenities/lobby.jpg', label: 'Grand lobby' },
            { src: 'assets/amenities/jogging.jpg', label: 'Jogging track' },
            { src: 'assets/amenities/indoor-games.jpg', label: 'Indoor games' }
        ];

        // 1. Generate Slides and Dots
        let slidesHTML = "";
        let dotsHTML = "";
        galleryImages.forEach((img, i) => {
            slidesHTML += `
                <article class="carousel-slide">
                    <img src="${img.src}" alt="${img.label}" loading="${i === 0 ? 'eager' : 'lazy'}">
                    <div class="gallery-overlay">
                        <h4>${img.label}</h4>
                    </div>
                </article>
            `;
            dotsHTML += `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`;
        });
        
        track.innerHTML = slidesHTML;
        dotsContainer.innerHTML = dotsHTML;

        // 2. Setup Logic
        const slides = track.querySelectorAll(".carousel-slide");
        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        let current = 0;
        let autoTimer = null;
        let isTransitioning = false;

        const goTo = (index) => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            // Handle negative index / overflow for infinite loop
            current = ((index % slides.length) + slides.length) % slides.length;
            
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle("active", i === current));
            
            setTimeout(() => { isTransitioning = false; }, 500); // match CSS duration
        };

        const next = () => goTo(current + 1);
        const prev = () => goTo(current - 1);

        const startAuto = () => { 
            clearInterval(autoTimer);
            autoTimer = setInterval(next, 4000); 
        };
        const stopAuto = () => { clearInterval(autoTimer); };

        nextBtn.addEventListener("click", () => { stopAuto(); next(); startAuto(); });
        prevBtn.addEventListener("click", () => { stopAuto(); prev(); startAuto(); });
        
        dots.forEach((dot) => {
            dot.addEventListener("click", () => { 
                stopAuto(); 
                goTo(parseInt(dot.dataset.slide)); 
                startAuto(); 
            });
        });

        carousel.addEventListener("mouseenter", stopAuto);
        carousel.addEventListener("mouseleave", startAuto);

        // Touch swipe support
        let touchStartX = 0;
        carousel.addEventListener("touchstart", (e) => { 
            touchStartX = e.changedTouches[0].clientX; 
            stopAuto(); 
        }, { passive: true });
        
        carousel.addEventListener("touchend", (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { 
                diff > 0 ? next() : prev(); 
            }
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

    // ── Floor Plan Carousel (Center-Focus, Transform-Based) ──
    const floorPlanAssetBase = "Layout";
    const fullLayoutImages = [
        { file: "Full.png", label: "Full Layout" }
    ];

    const oneBHKImages = [
        { file: "1Bhk top.png", label: "1 BHK Top Layout" },
        { file: "1bhk 3.png", label: "1 BHK Layout 3" },
        { file: "1bhk 4.png", label: "1 BHK Layout 4" },
        { file: "1bhk 5.png", label: "1 BHK Layout 5" }
    ];

    const twoBHKImages = [
        { file: "2bhk.png", label: "2 BHK Layout" }
    ];

    const applyFloorPlanImages = (container, unitLabel, imageConfigs) => {
        if (!container) return;

        const slides = Array.from(container.querySelectorAll(".fp-slide"));

        slides.forEach((slide, i) => {
            const img = slide.querySelector("img");
            const config = imageConfigs[i];
            if (!img || !config) return;

            img.src = `${floorPlanAssetBase}/${config.file}`;
            img.alt = `${unitLabel} - ${config.label}`;

            const label = slide.querySelector(".fp-slide-label");
            if (label) {
                label.textContent = config.label;
            }
        });
    };

    const initFloorPlanCarousel = (container) => {
        if (!container) return;

        const slides = Array.from(container.querySelectorAll(".fp-slide"));
        const dots = container.querySelectorAll(".fp-dot");
        const prevBtn = container.querySelector(".fp-arrow-left");
        const nextBtn = container.querySelector(".fp-arrow-right");
        const total = slides.length;
        let currentIndex = 0;
        const viewport = container.querySelector(".fp-carousel-viewport");
        const dotsWrap = container.querySelector(".fp-dots");

        container.classList.toggle("fp-carousel-single", total <= 1);
        if (dotsWrap) {
            dotsWrap.hidden = total <= 1;
        }

        if (prevBtn) {
            prevBtn.hidden = total <= 1;
        }

        if (nextBtn) {
            nextBtn.hidden = total <= 1;
        }

        const getPositionConfig = () => {
            const vw = viewport.offsetWidth;
            const sideOffset = Math.round(vw * 0.3);
            const hiddenOffset = Math.round(vw * 0.55);
            return {
                center: {
                    tx: 0,
                    ty: -10,
                    scale: 1,
                    opacity: 1,
                    z: 6,
                    shadow: "0 26px 58px rgba(25,34,28,0.2), 0 10px 24px rgba(186,145,84,0.13)",
                    filter: "saturate(1)",
                    pointer: "auto"
                },
                left: {
                    tx: -sideOffset,
                    ty: 8,
                    scale: 0.88,
                    opacity: 0.68,
                    z: 3,
                    shadow: "0 12px 28px rgba(25,34,28,0.1)",
                    filter: "saturate(0.74)",
                    pointer: "auto"
                },
                right: {
                    tx: sideOffset,
                    ty: 8,
                    scale: 0.88,
                    opacity: 0.68,
                    z: 3,
                    shadow: "0 12px 28px rgba(25,34,28,0.1)",
                    filter: "saturate(0.74)",
                    pointer: "auto"
                },
                hiddenLeft: {
                    tx: -hiddenOffset,
                    ty: 16,
                    scale: 0.75,
                    opacity: 0,
                    z: 1,
                    shadow: "none",
                    filter: "saturate(0.5)",
                    pointer: "none"
                },
                hiddenRight: {
                    tx: hiddenOffset,
                    ty: 16,
                    scale: 0.75,
                    opacity: 0,
                    z: 1,
                    shadow: "none",
                    filter: "saturate(0.5)",
                    pointer: "none"
                }
            };
        };

        const getWrappedIndex = (index) => {
            return ((index % total) + total) % total;
        };

        const render = () => {
            const positions = getPositionConfig();

            slides.forEach((slide, i) => {
                let pos = positions.hiddenRight;
                let posName = "hidden";
                const forwardDistance = getWrappedIndex(i - currentIndex);
                const backwardDistance = getWrappedIndex(currentIndex - i);

                if (total <= 1 || i === currentIndex) {
                    pos = positions.center;
                    posName = "center";
                } else if (backwardDistance === 1) {
                    pos = positions.left;
                    posName = "left";
                } else if (forwardDistance === 1) {
                    pos = positions.right;
                    posName = "right";
                } else if (backwardDistance < forwardDistance) {
                    pos = positions.hiddenLeft;
                }

                slide.style.transform = `translate(calc(-50% + ${pos.tx}px), calc(-50% + ${pos.ty}px)) scale(${pos.scale})`;
                slide.style.opacity = pos.opacity;
                slide.style.zIndex = pos.z;
                slide.style.boxShadow = pos.shadow;
                slide.style.filter = pos.filter;
                slide.style.pointerEvents = pos.pointer;
                slide.dataset.pos = posName;
            });

            dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
        };

        // Recalculate on resize
        window.addEventListener("resize", () => { render(); }, { passive: true });

        const goTo = (index) => {
            currentIndex = getWrappedIndex(index);
            render();
        };

        const goNext = () => goTo(currentIndex + 1);
        const goPrev = () => goTo(currentIndex - 1);

        // Arrow buttons
        nextBtn?.addEventListener("click", goNext);
        prevBtn?.addEventListener("click", goPrev);

        // Dot navigation
        dots.forEach((dot) => {
            dot.addEventListener("click", () => goTo(+dot.dataset.fpSlide));
        });

        // Click on ANY slide to bring it to center
        slides.forEach((slide, i) => {
            slide.addEventListener("click", () => {
                if (i !== currentIndex) {
                    goTo(i);
                }
            });
        });

        // Keyboard navigation
        container.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
            if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
        });

        // Touch swipe
        let fpTouchX = 0;
        container.addEventListener("touchstart", (e) => {
            fpTouchX = e.changedTouches[0].clientX;
        }, { passive: true });

        container.addEventListener("touchend", (e) => {
            const diff = fpTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goNext() : goPrev();
            }
        }, { passive: true });

        // Initial render
        render();
    };

    const fullLayoutCarousel = document.getElementById("fp-carousel-full-layout");
    const oneBHKCarousel = document.getElementById("fp-carousel-1bhk");
    const twoBHKCarousel = document.getElementById("fp-carousel-2bhk");

    applyFloorPlanImages(fullLayoutCarousel, "Full Layout", fullLayoutImages);
    applyFloorPlanImages(oneBHKCarousel, "1 BHK Layout", oneBHKImages);
    applyFloorPlanImages(twoBHKCarousel, "2 BHK Layout", twoBHKImages);

    initFloorPlanCarousel(fullLayoutCarousel);
    initFloorPlanCarousel(oneBHKCarousel);
    initFloorPlanCarousel(twoBHKCarousel);

    // ── Floor Plan Lightbox Logic ──
    const lightbox = document.getElementById("floorplan-lightbox");
    const lightboxImg = document.getElementById("floorplan-lightbox-img");
    const lightboxClose = document.getElementById("floorplan-lightbox-close");
    const lightboxPrev = document.getElementById("floorplan-lightbox-prev");
    const lightboxNext = document.getElementById("floorplan-lightbox-next");
    const clickableFloorplans = Array.from(document.querySelectorAll(".clickable-floorplan"));
    let currentLightboxIndex = 0;

    if (lightbox && lightboxImg && clickableFloorplans.length > 0) {
        const openLightbox = (index) => {
            currentLightboxIndex = index;
            lightboxImg.src = clickableFloorplans[currentLightboxIndex].src;
            lightbox.classList.add("is-open");
            document.body.style.overflow = "hidden";
        };

        const closeLightbox = () => {
            lightbox.classList.remove("is-open");
            // Don't remove overflow if the main enquire modal is open
            if (!document.getElementById("enquire-modal")?.classList.contains("is-open")) {
                document.body.style.overflow = "";
            }
        };

        const showNextImage = () => {
            currentLightboxIndex++;
            if (currentLightboxIndex >= clickableFloorplans.length) {
                currentLightboxIndex = 0; // loop back
            }
            lightboxImg.src = clickableFloorplans[currentLightboxIndex].src;
        };

        const showPrevImage = () => {
            currentLightboxIndex--;
            if (currentLightboxIndex < 0) {
                currentLightboxIndex = clickableFloorplans.length - 1; // loop to last
            }
            lightboxImg.src = clickableFloorplans[currentLightboxIndex].src;
        };

        // Attach click to image tags
        clickableFloorplans.forEach((img, index) => {
            img.addEventListener("click", () => {
                openLightbox(index);
            });
        });

        // Navigation buttons
        lightboxNext?.addEventListener("click", showNextImage);
        lightboxPrev?.addEventListener("click", showPrevImage);

        lightboxClose?.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("is-open")) return;
            
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowRight") {
                showNextImage();
            } else if (e.key === "ArrowLeft") {
                showPrevImage();
            }
        });
    }
});
