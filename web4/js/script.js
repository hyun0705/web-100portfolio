/* ========================================
   김정의 변호사 - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const fadeElements = document.querySelectorAll('.fade-in');
    const fixedForm = document.getElementById('fixedForm');
    const fixedBar = document.getElementById('fixedBar');
    const fixedBarToggle = document.getElementById('fixedBarToggle');

    // Fixed Bar Toggle
    if (fixedBarToggle && fixedBar) {
        // 초기 상태: 접혀있음
        fixedBar.classList.add('collapsed');

        fixedBarToggle.addEventListener('click', function() {
            fixedBar.classList.toggle('collapsed');
        });
    }

    // Header Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Mobile Menu Links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Scroll Animation with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(function(el) {
        observer.observe(el);
    });

    // Fixed Bottom Bar Form Submission
    if (fixedForm) {
        fixedForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(fixedForm);
            const data = Object.fromEntries(formData);

            // Validate
            if (!data.name || !data.phone) {
                alert('이름과 연락처를 입력해주세요.');
                return;
            }

            // Check agreement (only on desktop where it's visible)
            const agreementCheckbox = document.getElementById('fixedAgreement');
            if (agreementCheckbox && window.innerWidth > 768 && !agreementCheckbox.checked) {
                alert('개인정보 수집에 동의해주세요.');
                return;
            }

            // Success message
            alert('상담 신청이 완료되었습니다.\n빠른 시간 내에 연락드리겠습니다.');
            fixedForm.reset();
        });
    }

    // Consultation List Infinite Scroll
    const consultationList = document.getElementById('consultationList');
    if (consultationList) {
        // Duplicate items for seamless infinite scroll
        const items = consultationList.innerHTML;
        consultationList.innerHTML = items + items;
    }

    // Smooth Scroll for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
