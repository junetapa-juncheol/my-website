
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeFormValidation();
    initializeCounters();
    initializeSkillBars();
    initializeTouchOptimizations();
    initializeModals();
    initializeSmoothEntrances();
    initializeInteractiveTimeline();
    initializeTechStackAnimations();
});

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
                            const offsetTop = targetElement.offsetTop - 70;
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
                    const offsetTop = targetElement.offsetTop - 70;
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

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }

                setTimeout(() => {
                    entry.target.classList.remove('will-animate');
                }, 1000);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.info-card, .timeline-item, .sales-item, .hobby-item, .stat-item, .tech-category, .stat-card'
    );

    animatedElements.forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        observer.observe(el);
    });

    const staggerContainers = document.querySelectorAll('.sales-grid, .hobby-grid, .info-grid');
    staggerContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Counter animation
function animateCounter(statItem) {
    if (!statItem) return;
    const numberElement = statItem.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated) return;

    const finalText = numberElement.textContent;
    const finalNumber = parseInt(finalText.replace(/\D/g, ''));
    const suffix = finalText.replace(/[\d,]/g, '');
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    let current = 0;

    numberElement.dataset.animated = 'true';

    const updateCounter = () => {
        current += increment;
        if (current >= finalNumber) {
            numberElement.textContent = finalNumber.toLocaleString() + suffix;
        } else {
            numberElement.textContent = Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

// Initialize counters
function initializeCounters() {
    const counterElements = document.querySelectorAll('.stat-number');

    counterElements.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.observed) {
                    entry.target.dataset.observed = 'true';
                    animateCounter(entry.target.closest('.stat-item') || entry.target.closest('.stat-card'));
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

// Initialize skill bars
function initializeSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.observed) {
                    entry.target.dataset.observed = 'true';
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(card);
    });
}

// Touch optimizations for mobile
function initializeTouchOptimizations() {
    const touchElements = document.querySelectorAll('button, .cta-primary, .cta-secondary, .filter-btn, .sales-item, .hobby-item');

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
            background: var(--bg-light, #F9FAFC);
            border: 1px solid var(--border-color, #E8EAED);
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            text-align: center;
        ">
            <h4 style="color: var(--primary, #667eea); margin-bottom: 12px;">직접 연락하기</h4>
            <p style="margin-bottom: 12px; color: var(--text-secondary, #54595F);">메시지 전송에 문제가 있나요? 아래 방법으로 직접 연락해주세요:</p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="mailto:jun22sky@nate.com" style="
                    background: var(--primary, #667eea);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                ">이메일 보내기</a>
            </div>
        </div>
    `;

    const contactFormWrapper = document.querySelector('.contact-form-wrapper');
    if (contactFormWrapper) {
        contactFormWrapper.insertAdjacentHTML('afterend', fallbackHtml);
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

function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;

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
                counter.textContent = `${count}/1000`;
                counter.style.color = count > 1000 ? '#f44336' : 'var(--text-tertiary, #9AA0A6)';
            });
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
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
            const offsetTop = targetElement.offsetTop - 70;
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

// Modals
function initializeModals() {
    const clickableItems = document.querySelectorAll('.sales-item, .hobby-item');

    clickableItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.currentTarget !== item) return;

            const title = item.dataset.title;
            const category = item.dataset.category;

            if (title && category && typeof openSalesModal === 'function') {
                openSalesModal(title, category);
            }
        });
    });
}

// Smooth Entrance Animations
function initializeSmoothEntrances() {
    const smoothElements = document.querySelectorAll('.smooth-entrance, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    smoothElements.forEach(element => {
        observer.observe(element);
    });
}

// Interactive Timeline functionality
function initializeInteractiveTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const progressBar = document.querySelector('.timeline-progress-bar');

    if (!timelineItems.length || !progressBar) return;

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 200);
                updateTimelineProgress();
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    function updateTimelineProgress() {
        const activeItems = document.querySelectorAll('.timeline-item.active');
        const totalItems = timelineItems.length;
        const progress = (activeItems.length / totalItems) * 100;
        progressBar.style.height = `${progress}%`;
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const timelineContainer = document.querySelector('.timeline-container');

        if (timelineContainer) {
            const containerTop = timelineContainer.offsetTop;
            const containerHeight = timelineContainer.offsetHeight;
            const windowHeight = window.innerHeight;

            const scrollProgress = Math.max(0, Math.min(1,
                (scrollTop - containerTop + windowHeight / 2) / containerHeight
            ));

            progressBar.style.height = `${scrollProgress * 100}%`;
        }
    });
}

// Tech Stack Animations
function initializeTechStackAnimations() {
    const techCategories = document.querySelectorAll('.tech-category');
    const statCards = document.querySelectorAll('.stat-card');

    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    animateSkillBarsInCategory(entry.target);
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    techCategories.forEach(category => {
        techObserver.observe(category);
    });

    function animateSkillBarsInCategory(category) {
        const skillItems = category.querySelectorAll('.skill-item');

        skillItems.forEach((item, index) => {
            const level = item.getAttribute('data-level');
            const bar = item.querySelector('.skill-progress');

            if (bar && level && !bar.dataset.animated) {
                bar.dataset.animated = 'true';
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, index * 100 + 200);
            }
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.animated) {
                    animateStatNumber(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => {
        statsObserver.observe(card);
    });

    function animateStatNumber(element) {
        const targetText = element.textContent;
        const targetNumber = parseInt(targetText.match(/\d+/)?.[0] || '0');
        const suffix = targetText.replace(/\d+/, '');

        if (!targetNumber) return;

        element.dataset.animated = 'true';
        let currentNumber = 0;
        const increment = Math.ceil(targetNumber / 30);
        const stepTime = 1000 / (targetNumber / increment);

        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
            }
            element.textContent = currentNumber + suffix;
        }, stepTime);
    }
}
