/**
 * VERTEX TOWER - Fullpage Scroll Website
 * Smooth one section per scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initBackToTop();

    // Only init fullpage scroll on main page (not subpages)
    if (!document.body.classList.contains('page-reservation')) {
        initFullpageScroll();
        initTowerIndicator();
        initScrollAnimations();
    }
});

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        smoothScrollTo(0, 800);
    });
}

/**
 * Smooth scroll with easing
 */
function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    // Easing function - easeInOutCubic
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        window.scrollTo(0, startY + difference * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/**
 * Fullpage Scroll - One section at a time with smooth transition
 */
function initFullpageScroll() {
    const sections = document.querySelectorAll('.section, .footer');
    let currentSection = 0;
    let isScrolling = false;
    const scrollCooldown = 1000; // ms

    // Find current section on load
    function updateCurrentSection() {
        const scrollPos = window.scrollY;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop - 100 && scrollPos < sectionTop + sectionHeight - 100) {
                currentSection = index;
            }
        });
    }

    updateCurrentSection();

    // Scroll to section with smooth animation
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        if (isScrolling) return;

        isScrolling = true;
        currentSection = index;

        const targetY = sections[index].offsetTop;
        smoothScrollTo(targetY, 800);

        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    }

    // Wheel event
    window.addEventListener('wheel', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        // Check if on mobile (disabled fullpage)
        if (window.innerWidth <= 768) return;

        e.preventDefault();

        if (e.deltaY > 0) {
            // Scroll down
            scrollToSection(currentSection + 1);
        } else {
            // Scroll up
            scrollToSection(currentSection - 1);
        }
    }, { passive: false });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if (window.innerWidth <= 768) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            scrollToSection(currentSection + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            scrollToSection(currentSection - 1);
        }
    });

    // Touch events for swipe
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (window.innerWidth <= 768) return;

        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollToSection(currentSection + 1);
            } else {
                scrollToSection(currentSection - 1);
            }
        }
    }, { passive: true });

    // Update section on manual scroll (for nav clicks)
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            updateCurrentSection();
        }
    }, { passive: true });

    // Nav link clicks - smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                const index = Array.from(sections).indexOf(targetSection);
                if (index !== -1) {
                    scrollToSection(index);
                }
            }
        });
    });
}

/**
 * Tower Indicator
 */
function initTowerIndicator() {
    const towerIndicator = document.getElementById('towerIndicator');
    const towerSections = document.querySelectorAll('.tower-section[data-target]');

    const sections = {
        observatory: document.getElementById('observatory'),
        skylounge: document.getElementById('skylounge'),
        exhibition: document.getElementById('exhibition'),
        lobby: document.getElementById('lobby')
    };

    // Show/hide tower based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.5) {
            towerIndicator.classList.add('visible');
        } else {
            towerIndicator.classList.remove('visible');
        }

        // Update active tower section
        updateActiveTower();
    }, { passive: true });

    // Tower section click
    towerSections.forEach(section => {
        section.addEventListener('click', () => {
            const target = section.dataset.target;
            if (sections[target]) {
                const targetY = sections[target].offsetTop;
                smoothScrollTo(targetY, 800);
            }
        });
    });

    function updateActiveTower() {
        const scrollPos = window.scrollY + window.innerHeight / 2;

        towerSections.forEach(section => {
            section.classList.remove('active');
        });

        for (const [key, element] of Object.entries(sections)) {
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + window.scrollY;
                const elementBottom = elementTop + element.offsetHeight;

                if (scrollPos >= elementTop && scrollPos < elementBottom) {
                    const activeSection = document.querySelector(`.tower-section[data-target="${key}"]`);
                    if (activeSection) {
                        activeSection.classList.add('active');
                    }
                    break;
                }
            }
        }
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.floor-header, .floor-image, .floor-info, .intro-content'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}
