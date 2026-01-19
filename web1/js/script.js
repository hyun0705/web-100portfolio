/**
 * AURELIA SEATING - Main JavaScript
 * Premium Chair Brand Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initHeader();
    initMobileMenu();

    // Only init hero slider on pages that have it
    if (document.querySelector('.hero-slider')) {
        initHeroSlider();
    }

    initScrollAnimations();
    initCounterAnimation();
    initSmoothScroll();
    initBackToTop();
});

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Hero Slider
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const pauseBtn = document.getElementById('pauseSlide');
    const currentSpan = document.querySelector('.hero-pagination .current');
    const pauseIcon = pauseBtn.querySelector('.pause-icon');
    const playIcon = pauseBtn.querySelector('.play-icon');

    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;
    const slideDelay = 6000;

    const updateSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        currentSpan.textContent = String(index + 1).padStart(2, '0');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide(currentSlide);
    };

    const startAutoPlay = () => {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDelay);
    };

    const stopAutoPlay = () => {
        if (slideInterval) clearInterval(slideInterval);
    };

    const togglePlay = () => {
        isPlaying = !isPlaying;
        pauseIcon.classList.toggle('hidden', !isPlaying);
        playIcon.classList.toggle('hidden', isPlaying);

        if (isPlaying) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    };

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        if (isPlaying) {
            startAutoPlay();
        }
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        if (isPlaying) {
            startAutoPlay();
        }
    });

    pauseBtn.addEventListener('click', togglePlay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            if (isPlaying) startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            if (isPlaying) startAutoPlay();
        }
    });

    // Start autoplay
    startAutoPlay();
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        // Main page elements
        '.section-title, .section-title-sm, .section-title-center, ' +
        '.about-desc, .about-image, .stat-item, .feature-item, ' +
        '.perfect-item, .cta-content, .footer-content, ' +
        // Subpage elements
        '.about-intro-text, .about-intro-image, .vm-item, ' +
        '.timeline-item, .team-stats, .team-stat, ' +
        '.philosophy-item, .quote-section, ' +
        '.collection-card, .collections-grid, ' +
        '.project-card, .projects-filter, ' +
        '.contact-info, .contact-form, .contact-item'
    );

    // Add fade-in class to all animated elements
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Add staggered delay for grid items
        if (el.classList.contains('feature-item') ||
            el.classList.contains('philosophy-item') ||
            el.classList.contains('collection-card') ||
            el.classList.contains('project-card') ||
            el.classList.contains('timeline-item') ||
            el.classList.contains('team-stat') ||
            el.classList.contains('contact-item')) {
            el.style.transitionDelay = `${index * 0.1}s`;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Counter Animation for Stats
 */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const animateCounter = (element) => {
        const target = parseFloat(element.dataset.target);
        const isDecimal = element.dataset.decimal === 'true';
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (target - startValue) * easeOut;

            if (isDecimal) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.round(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effect (Optional - can be enabled)
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.cta-bg, .hero-bg');

    const handleParallax = () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
            const speed = 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    const handleScroll = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
