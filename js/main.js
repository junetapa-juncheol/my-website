// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeCounters();
    initializeSkillBars();
    initializeTouchOptimizations();
});

// Particles.js initialization
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        // Check if device is mobile for performance optimization
        const isMobile = window.innerWidth <= 768;
        
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: isMobile ? 40 : 80, 
                    density: { enable: true, value_area: 800 } 
                },
                color: { value: '#ffffff' },
                shape: { 
                    type: 'circle',
                    stroke: { width: 0, color: '#000000' }
                },
                opacity: { 
                    value: 0.5, 
                    random: false,
                    anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: { 
                    value: isMobile ? 2 : 3, 
                    random: true,
                    anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                },
                line_linked: { 
                    enable: !isMobile, 
                    distance: 150, 
                    color: '#ffffff', 
                    opacity: 0.4, 
                    width: 1 
                },
                move: { 
                    enable: true, 
                    speed: isMobile ? 3 : 6, 
                    direction: 'none', 
                    random: false, 
                    straight: false, 
                    out_mode: 'out', 
                    bounce: false 
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { 
                    onhover: { enable: !isMobile, mode: 'repulse' }, 
                    onclick: { enable: true, mode: 'push' }, 
                    resize: true 
                },
                modes: { 
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: isMobile ? 100 : 200, duration: 0.4 },
                    push: { particles_nb: isMobile ? 2 : 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    // Navbar scroll effect
    let ticking = false;
    function updateNavbar() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Add animation class
        if (isMenuOpen) {
            navMenu.classList.add('nav-menu-enter');
        } else {
            navMenu.classList.add('nav-menu-exit');
        }
    }

    function closeMobileMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    // Active nav link highlighting
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
                
                // Add will-change for better performance
                entry.target.classList.add('will-animate');
                
                // Trigger specific animations
                if (entry.target.classList.contains('journey-item')) {
                    animateJourneyItem(entry.target);
                }
                
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('skill-card')) {
                    animateSkillCard(entry.target);
                }

                // Remove will-change after animation completes
                setTimeout(() => {
                    entry.target.classList.remove('will-animate');
                }, 1000);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.journey-item, .info-card, .timeline-item, .skill-card, .sales-item, .stat-item'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stagger animation for grids
    const staggerContainers = document.querySelectorAll('.skills-grid, .sales-grid, .info-grid');
    staggerContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Journey item animation
function animateJourneyItem(item) {
    const delay = parseFloat(item.getAttribute('data-delay')) || 0;
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, delay * 1000);
}

// Counter animation
function animateCounter(statItem) {
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

// Skill card animation
function animateSkillCard(skillCard) {
    const progressBar = skillCard.querySelector('.skill-progress');
    const percentage = skillCard.getAttribute('data-skill');
    
    if (progressBar && percentage && !progressBar.dataset.animated) {
        progressBar.dataset.animated = 'true';
        setTimeout(() => {
            progressBar.style.width = percentage + '%';
        }, 500);
    }
}

// Initialize counters
function initializeCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    
    counterElements.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.observed) {
                    entry.target.dataset.observed = 'true';
                    animateCounter(entry.target.closest('.stat-item'));
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
                    animateSkillCard(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(card);
    });
}

// Touch optimizations for mobile
function initializeTouchOptimizations() {
    // Add touch classes for better mobile experience
    const touchElements = document.querySelectorAll('button, .cta-primary, .cta-secondary, .filter-btn, .sales-item');
    
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

    // Prevent zoom on double tap for buttons
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
    const submitBtn = contactForm.querySelector('.submit-btn');

    if (!contactForm) return;

    // EmailJS Public Key
    const publicKey = '3efSrc3mFT9o8xULf'; // ⚠️ 중요: 이 값을 사용자님의 Public Key로 변경하세요.
    const serviceID = 'service_my45w39'; // ⚠️ 중요: 이 값을 사용자님의 Service ID로 변경하세요.
    const templateID = 'template_hagtkx9'; // ⚠️ 중요: 이 값을 사용자님의 Template ID로 변경하세요.

    emailjs.init(publicKey);

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 버튼 상태: 로딩 중
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>전송 중...</span>';
        submitBtn.disabled = true;

        // 폼 데이터 가져오기
        const templateParams = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value,
        };
        
        // 간단한 유효성 검사
        if (!templateParams.name || !templateParams.email || !templateParams.message) {
            showNotification('이름, 이메일, 메시지는 필수 입력 항목입니다.', 'warning');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, function(error) {
                console.log('FAILED...', error);
                showNotification('메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'danger');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }
    }
    
    // Required field validation
    if (field.hasAttribute('required')) {
        if (value) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }
    }
}

// Clear validation
function clearValidation(e) {
    const field = e.target;
    field.classList.remove('valid', 'invalid');
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--success-color)' : 
                   type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-medium)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: 'calc(100vw - 40px)',
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
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

// Performance optimization
const debouncedResize = debounce(() => {
    // Handle resize events
    if (typeof particlesJS !== 'undefined' && window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
    
    // Reinitialize touch optimizations on orientation change
    if (window.innerHeight !== window.innerWidth) {
        initializeTouchOptimizations();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Add loading class to body
document.body.classList.add('loading');

// Remove loading class when everything is loaded
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    
    // Trigger hero animations
    setTimeout(() => {
        const journeyItems = document.querySelectorAll('.journey-item');
        journeyItems.forEach(item => {
            item.classList.add('visible');
        });
    }, 500);
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('Non-critical error:', e.error);
});

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when page is not visible
        const animations = document.querySelectorAll('.animated-gradient, .float, .pulse');
        animations.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        const animations = document.querySelectorAll('.animated-gradient, .float, .pulse');
        animations.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Console welcome message
console.log(`
%c👋 안녕하세요! Junetapa IT Story 에 오신 것을 환영합니다!
%c🚀 이 홈페이지는 모바일 최적화되어 제작되었습니다.
%c📧 문의사항: jun22sky@nate.com
`, 
'color: #667eea; font-size: 16px; font-weight: bold;',
'color: #764ba2; font-size: 14px;',
'color: #f093fb; font-size: 12px;'
);
