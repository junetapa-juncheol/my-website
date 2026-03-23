
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAOS();
    initializeNavigation();
    initializeHeroSwiper();
    initializeExpertiseSwiper();
    initializeCreativeSwiper();
    initializeExpertiseTabs();
    initializeStatCounters();
    initializeTimelineFill();
    initializeCardClicks();
    initializeContactForm();
    initializeFormValidation();
    initializeTouchOptimizations();
});

// AOS initialization
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
    document.body.style.overflow = '';

    let lastScrollY = window.scrollY;
    let scrollThreshold = 10;
    let ticking = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        const isScrollingDown = scrollDelta > scrollThreshold;
        const isScrollingUp = scrollDelta < -scrollThreshold;

        if (Math.abs(scrollDelta) > scrollThreshold && !isMenuOpen && !prefersReducedMotion) {
            if (isScrollingDown && currentScrollY > 100) {
                navbar.classList.remove('nav-visible');
                navbar.classList.add('nav-hidden');
            } else if (isScrollingUp || currentScrollY <= 100) {
                navbar.classList.remove('nav-hidden');
                navbar.classList.add('nav-visible');
            }
        }

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    if (hamburger && (navMenu || hamburgerMenu)) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        document.addEventListener('click', (e) => {
            if (isMenuOpen &&
                !navMenu?.contains(e.target) &&
                !hamburgerMenu?.contains(e.target) &&
                !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        if (navMenu) navMenu.classList.toggle('active');
        if (hamburgerMenu) hamburgerMenu.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        if (isMenuOpen) {
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
        }
    }

    function closeMobileMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (hamburgerMenu) {
        const hamburgerLinks = hamburgerMenu.querySelectorAll('a');
        hamburgerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                closeMobileMenu();

                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        setTimeout(() => {
                            const offsetTop = targetElement.offsetTop - 72;
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        }, 100);
                    }
                }
            });
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId.startsWith('pages/') || targetId.startsWith('http') || targetId.includes('.html')) {
                closeMobileMenu();
                return true;
            }

            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 72;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }

            closeMobileMenu();
        });
    });

    let activeSection = '';
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                if (activeSection !== sectionId) {
                    activeSection = sectionId;
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveLink, 100));
}

// ========== SWIPER INITIALIZATION ==========

// Hero Swiper
function initializeHeroSwiper() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.hero-swiper')) return;

    const progressBar = document.querySelector('.hero-progress__bar');
    const autoplayDuration = 5000;

    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        speed: 800,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: autoplayDuration,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
        },
        on: {
            autoplayTimeLeft: function(swiper, timeLeft) {
                if (progressBar) {
                    const progress = 1 - (timeLeft / autoplayDuration);
                    progressBar.style.width = (progress * 100) + '%';
                }
            },
            slideChange: function() {
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            }
        }
    });
}

// Expertise Swiper
var expertiseSwiper = null;
function initializeExpertiseSwiper() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.expertise-swiper')) return;

    expertiseSwiper = new Swiper('.expertise-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 500,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        navigation: {
            prevEl: '.expertise-prev',
            nextEl: '.expertise-next',
        },
        breakpoints: {
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
        }
    });
}

// Creative Swiper
function initializeCreativeSwiper() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.creative-swiper')) return;

    new Swiper('.creative-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 500,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: true,
        },
        navigation: {
            prevEl: '.creative-prev',
            nextEl: '.creative-next',
        },
        breakpoints: {
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
        }
    });
}

// Expertise Tab Filtering
function initializeExpertiseTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const slides = document.querySelectorAll('.expertise-swiper .swiper-slide');

            slides.forEach(slide => {
                const category = slide.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    slide.style.display = '';
                } else {
                    slide.style.display = 'none';
                }
            });

            if (expertiseSwiper) {
                expertiseSwiper.update();
                expertiseSwiper.slideTo(0);
            }
        });
    });
}

// Stat counter animation
function initializeStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));

    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) return;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                return;
            }
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        };

        element.textContent = '0';
        requestAnimationFrame(update);
    }
}

// Timeline line fill animation
function initializeTimelineFill() {
    const lineFill = document.querySelector('.timeline__line-fill');
    const timeline = document.querySelector('.timeline');
    if (!lineFill || !timeline) return;

    function updateFill() {
        const rect = timeline.getBoundingClientRect();
        const windowH = window.innerHeight;
        const timelineTop = rect.top;
        const timelineHeight = rect.height;

        if (timelineTop > windowH) {
            lineFill.style.height = '0%';
            return;
        }

        const scrolled = windowH - timelineTop;
        const progress = Math.max(0, Math.min(1, scrolled / timelineHeight));
        lineFill.style.height = (progress * 100) + '%';
    }

    window.addEventListener('scroll', throttle(updateFill, 30));
    updateFill();
}

// Card click handlers (expertise + creative)
function initializeCardClicks() {
    const expCards = document.querySelectorAll('.exp-card');
    const crCards = document.querySelectorAll('.cr-card');

    expCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent || '';
            const category = card.getAttribute('data-category') || '';
            if (title && typeof openSalesModal === 'function') {
                openSalesModal(title, category);
            }
        });
    });

    crCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent || '';
            const category = card.getAttribute('data-category') || '';
            if (title && typeof openSalesModal === 'function') {
                openSalesModal(title, category);
            }
        });
    });
}

// Touch optimizations for mobile
function initializeTouchOptimizations() {
    const touchElements = document.querySelectorAll('button, .btn, .tab-btn, .exp-card, .cr-card, .quick-card');

    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });

        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    const submitBtn = contactForm.querySelector('.submit-btn');

    const emailjsConfig = {
        publicKey: '3efSrc3mFT9o8xULf',
        serviceID: 'service_my45w39',
        templateID: 'template_hagtkx9'
    };

    if (typeof emailjs === 'undefined') {
        showFallbackContact();
        return;
    }

    try {
        emailjs.init(emailjsConfig.publicKey);
    } catch (error) {
        showFallbackContact();
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>전송 중...</span>';
        submitBtn.disabled = true;

        const templateParams = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toLocaleString('ko-KR')
        };

        const validation = validateContactForm(templateParams);
        if (!validation.isValid) {
            showNotification(validation.message, 'warning');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        emailjs.send(emailjsConfig.serviceID, emailjsConfig.templateID, templateParams)
            .then(function(response) {
                showNotification('메시지가 성공적으로 전송되었습니다! 24시간 내로 답변 드리겠습니다.', 'success');
                contactForm.reset();
            }, function(error) {
                let errorMessage = '메시지 전송에 실패했습니다. ';
                if (error.status === 402) {
                    errorMessage += '전송 한도를 초과했습니다. 직접 이메일로 연락주세요.';
                } else {
                    errorMessage += '잠시 후 다시 시도하거나 직접 이메일로 연락주세요.';
                }
                showNotification(errorMessage, 'danger');
                setTimeout(() => { showFallbackContact(); }, 3000);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

function validateContactForm(data) {
    if (!data.name || !data.email || !data.message) {
        return { isValid: false, message: '이름, 이메일, 메시지는 필수 입력 항목입니다.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { isValid: false, message: '올바른 이메일 주소를 입력해주세요.' };
    }
    if (data.message.length < 10) {
        return { isValid: false, message: '메시지는 10자 이상 입력해주세요.' };
    }
    return { isValid: true };
}

function showFallbackContact() {
    const fallbackHtml = `
        <div class="fallback-contact" style="
            background: var(--cream, #FAF6EF);
            border: 1px solid var(--border, #e2e8f0);
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            text-align: center;
        ">
            <h4 style="color: var(--gold-dark, #93681E); margin-bottom: 12px;">직접 연락하기</h4>
            <p style="margin-bottom: 12px; color: var(--text-body, #475569);">메시지 전송에 문제가 있나요? 아래 방법으로 직접 연락해주세요:</p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="mailto:jun22sky@nate.com" style="
                    background: var(--gold-dark, #93681E);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                ">이메일 보내기</a>
            </div>
        </div>
    `;

    const contactRight = document.querySelector('.contact-right');
    if (contactRight) {
        contactRight.insertAdjacentHTML('afterend', fallbackHtml);
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';

    field.classList.remove('valid', 'invalid');
    const existingFeedback = field.parentNode.querySelector('.field-feedback');
    if (existingFeedback) existingFeedback.remove();

    switch (fieldName) {
        case 'name':
            if (!value) { isValid = false; message = '이름을 입력해주세요.'; }
            else if (value.length < 2) { isValid = false; message = '이름은 2자 이상 입력해주세요.'; }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) { isValid = false; message = '이메일을 입력해주세요.'; }
            else if (!emailRegex.test(value)) { isValid = false; message = '올바른 이메일 형식을 입력해주세요.'; }
            break;
        case 'message':
            if (!value) { isValid = false; message = '메시지를 입력해주세요.'; }
            else if (value.length < 10) { isValid = false; message = '메시지는 10자 이상 입력해주세요.'; }
            else if (value.length > 1000) { isValid = false; message = '메시지는 1000자 이내로 입력해주세요.'; }
            break;
    }

    if (isValid) {
        field.classList.add('valid');
    } else {
        field.classList.add('invalid');
        const feedback = document.createElement('div');
        feedback.className = 'field-feedback error';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    }
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('valid', 'invalid');
    const feedback = field.parentNode.querySelector('.field-feedback');
    if (feedback) feedback.remove();
}

function showNotification(message, type) {
    type = type || 'success';
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = '<div class="notification-content"><span class="notification-message">' + message + '</span><button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button></div>';

    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 100);
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => { notification.remove(); }, 300);
        }
    }, 5000);
}

function initializeFormValidation() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea');

    formFields.forEach(field => {
        if (['name', 'email', 'message'].includes(field.name)) {
            field.setAttribute('required', '');
        }

        field.addEventListener('blur', validateField);
        field.addEventListener('input', debounce(validateField, 500));
        field.addEventListener('focus', clearValidation);

        if (field.name === 'message') {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.textContent = '0/1000';
            field.parentNode.appendChild(counter);

            field.addEventListener('input', function() {
                const count = this.value.length;
                counter.textContent = count + '/1000';
                counter.style.color = count > 1000 ? '#f44336' : 'var(--text-muted, #94a3b8)';
            });
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        var args = arguments;
        var context = this;
        var later = function() {
            clearTimeout(timeout);
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 72;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }
});

// Page load
document.body.classList.add('loading');
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
});

// Error handling
window.addEventListener('error', function(e) {
    const ignoredErrors = ['data/sales-data.json', 'sales-data.json', 'Script error'];
    const shouldIgnore = ignoredErrors.some(ignore =>
        (e.message && e.message.includes(ignore)) ||
        (e.filename && e.filename.includes(ignore))
    );
    if (!shouldIgnore) {
        console.warn('Page error:', e.message);
    }
});

window.addEventListener('unhandledrejection', function(e) {
    const errorMessage = e.reason?.message || e.reason?.toString() || '';
    const ignoredRejections = ['404', 'Not Found', 'sales-data.json', 'fetch'];
    const shouldIgnore = ignoredRejections.some(ignore => errorMessage.includes(ignore));
    if (shouldIgnore) {
        e.preventDefault();
    }
});
