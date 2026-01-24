/* ===================================
   POWER GYM - JavaScript
=================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const topBtn = document.querySelector('.top-btn');
    const fadeElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in, .stagger');

    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking nav links (except toggle buttons)
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Don't close menu if clicking on submenu toggle
                if (this.classList.contains('mobile-menu-toggle')) {
                    return;
                }
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Mobile submenu accordion toggle
        const mobileMenuToggles = document.querySelectorAll('.mobile-menu-toggle');

        mobileMenuToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;

                // Close other open submenus
                document.querySelectorAll('.mobile-has-sub.active').forEach(function(item) {
                    if (item !== parent) {
                        item.classList.remove('active');
                    }
                });

                // Toggle current submenu
                parent.classList.toggle('active');
            });
        });
    }

    // Back to top button
    function handleTopButton() {
        if (window.scrollY > 500) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleTopButton, { passive: true });
    handleTopButton(); // Initial check

    if (topBtn) {
        topBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(function(element) {
        observer.observe(element);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

    // Circle text animation on scroll
    const circleTexts = document.querySelectorAll('.circle-text');

    const circleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    circleTexts.forEach(function(text) {
        circleObserver.observe(text);
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            statsAnimated = true;

            statNumbers.forEach(function(stat) {
                const text = stat.textContent;
                const match = text.match(/(\d+)/);

                if (match) {
                    const target = parseInt(match[1]);
                    const suffix = text.replace(/\d+/, '');
                    let current = 0;
                    const increment = target / 50;
                    const duration = 2000;
                    const stepTime = duration / 50;

                    const timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }

                        // Rebuild the content with span for unit
                        const unitMatch = suffix.match(/[+%]/);
                        if (unitMatch) {
                            stat.innerHTML = Math.floor(current) + '<span class="stat-unit">' + unitMatch[0] + '</span>';
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, stepTime);
                }
            });
        }
    }

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats(); // Initial check

    // Parallax effect for hero background
    const heroBg = document.querySelector('.hero-bg img');

    if (heroBg) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            }
        }, { passive: true });
    }

    // Program card hover effect for touch devices
    const programCards = document.querySelectorAll('.program-card');

    programCards.forEach(function(card) {
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        }, { passive: true });

        card.addEventListener('touchend', function() {
            const self = this;
            setTimeout(function() {
                self.classList.remove('touch-hover');
            }, 300);
        }, { passive: true });
    });

    // Preload images for better UX
    function preloadImages() {
        const images = document.querySelectorAll('img[src]');
        images.forEach(function(img) {
            const src = img.getAttribute('src');
            if (src) {
                const preloadImg = new Image();
                preloadImg.src = src;
            }
        });
    }

    // Run preload after page load
    window.addEventListener('load', preloadImages);

    // Review Slider - True Infinite Loop
    const reviewTrack = document.querySelector('.review-track');
    let autoSlideInterval;

    function getSlideWidth() {
        const firstCard = reviewTrack.querySelector('.review-card');
        if (!firstCard) return 0;
        const gap = 32;
        return firstCard.offsetWidth + gap;
    }

    function setupSlider() {
        // 마지막 카드를 맨 앞으로 이동 (왼쪽에 보이도록)
        const cards = reviewTrack.querySelectorAll('.review-card');
        const lastCard = cards[cards.length - 1];
        reviewTrack.insertBefore(lastCard, cards[0]);

        // 초기 위치를 왼쪽으로 이동 (마지막 카드가 왼쪽에 보이도록)
        reviewTrack.style.transform = 'translateX(-' + getSlideWidth() + 'px)';
    }

    function moveSlideNext() {
        const slideWidth = getSlideWidth();
        const currentTransform = new WebKitCSSMatrix(getComputedStyle(reviewTrack).transform);
        const currentX = currentTransform.m41;

        // Animate slide
        reviewTrack.style.transition = 'transform 0.5s ease';
        reviewTrack.style.transform = 'translateX(' + (currentX - slideWidth) + 'px)';

        // After animation, move first card to end and reset position
        setTimeout(function() {
            const firstCard = reviewTrack.querySelector('.review-card');
            reviewTrack.appendChild(firstCard);
            reviewTrack.style.transition = 'none';
            reviewTrack.style.transform = 'translateX(-' + slideWidth + 'px)';
        }, 500);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(moveSlideNext, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    if (reviewTrack) {
        setupSlider();
        startAutoSlide();

        reviewTrack.addEventListener('mouseenter', stopAutoSlide);
        reviewTrack.addEventListener('mouseleave', startAutoSlide);
    }

    // Trainer Slider (Mobile Only)
    const trainerTrack = document.querySelector('.trainer-track');
    const trainerCards = document.querySelectorAll('.trainer-card');
    let trainerSlide = 0;
    let trainerAutoSlide;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function getTrainerSlideWidth() {
        if (trainerCards.length === 0) return 0;
        const card = trainerCards[0];
        const gap = 16; // 1rem
        return card.offsetWidth + gap;
    }

    function moveTrainerSlide() {
        if (!isMobile()) return;

        trainerSlide++;
        if (trainerSlide >= trainerCards.length) {
            trainerSlide = 0;
        }
        const offset = trainerSlide * getTrainerSlideWidth();
        trainerTrack.style.transition = 'transform 0.5s ease';
        trainerTrack.style.transform = 'translateX(-' + offset + 'px)';
    }

    function startTrainerSlide() {
        if (isMobile()) {
            trainerAutoSlide = setInterval(moveTrainerSlide, 3000);
        }
    }

    function stopTrainerSlide() {
        clearInterval(trainerAutoSlide);
    }

    // Initialize trainer slider
    if (trainerTrack && trainerCards.length > 0) {
        startTrainerSlide();

        window.addEventListener('resize', function() {
            stopTrainerSlide();
            trainerSlide = 0;
            trainerTrack.style.transition = 'none';
            trainerTrack.style.transform = 'translateX(0)';
            startTrainerSlide();
        });
    }
});
