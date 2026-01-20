/* ========================================
   이사24 - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop = document.getElementById('backToTop');
    const reviewsTrack = document.querySelector('.reviews-track');
    const faqItems = document.querySelectorAll('.faq-item');
    const quoteForm = document.getElementById('quoteForm');

    // ========================================
    // Header Scroll Effect
    // ========================================
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========================================
    // Mobile Menu
    // ========================================
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking links
    document.querySelectorAll('.mobile-nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // Back to Top
    // ========================================
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========================================
    // Number Counter Animation
    // ========================================
    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Observe trust numbers
    const trustNumbers = document.querySelectorAll('.trust-number');
    const trustObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                trustObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    trustNumbers.forEach(num => trustObserver.observe(num));

    // ========================================
    // FAQ Accordion
    // ========================================
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ========================================
    // Reviews Infinite Slider
    // ========================================
    function setupReviewsSlider() {
        if (!reviewsTrack) return;

        const cards = reviewsTrack.querySelectorAll('.review-card');

        // Clone cards for infinite effect
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            reviewsTrack.appendChild(clone);
        });
    }

    setupReviewsSlider();

    // ========================================
    // Scroll Animations
    // ========================================
    const fadeElements = document.querySelectorAll('.service-card, .process-step, .faq-item');

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Form Handling
    // ========================================
    if (quoteForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('move-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Simple validation
            if (!data.agreement) {
                alert('개인정보 수집 및 이용에 동의해주세요.');
                return;
            }

            // Show success message (실제로는 서버로 전송)
            alert('견적 신청이 완료되었습니다.\n24시간 내에 연락드리겠습니다.');
            this.reset();
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^0-9]/g, '');

                if (value.length > 3 && value.length <= 7) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else if (value.length > 7) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }

                e.target.value = value;
            });
        }
    }

    // ========================================
    // Initialize
    // ========================================
    handleScroll(); // Check initial scroll position
});
