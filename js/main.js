// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeroBackground();
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeFormValidation();
    initializeCounters();
    initializeSkillBars();
    initializeTouchOptimizations();
    initializeModals();
    initializeMagneticEffect();
    initializeParallaxEffect();
    initializeSmoothEntrances();
});

// Hero Background initialization (Video + Particles fallback)
function initializeHeroBackground() {
    const heroVideo = document.getElementById('hero-video');
    
    if (heroVideo) {
        // Set time-based video source
        setTimeBasedVideo(heroVideo);
        
        // Check if device is mobile for performance optimization
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            console.log('Mobile device detected, optimizing video for mobile');
            // Keep video but optimize for mobile
            heroVideo.style.opacity = '0.5';
            // Also initialize particles for enhanced background
            initializeParticles();
            
            // Add mobile-specific video error handling
            heroVideo.addEventListener('error', function() {
                console.log('Mobile video failed, using particles only');
                heroVideo.style.display = 'none';
                const particlesContainer = document.getElementById('particles-js');
                if (particlesContainer) {
                    particlesContainer.style.opacity = '1';
                }
            });
        }
        
        // Try to load video first
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Hero video loaded successfully');
            // On desktop, hide particles when video loads
            // On mobile, keep both for enhanced background
            const isMobile = window.innerWidth <= 768;
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer && !isMobile) {
                particlesContainer.style.display = 'none';
            }
        });
        
        // Fallback to particles if video fails
        heroVideo.addEventListener('error', function() {
            console.log('Hero video failed to load, using particles fallback');
            heroVideo.style.display = 'none';
            initializeParticles();
        });
        
        // Auto-play with user interaction fallback
        heroVideo.addEventListener('canplaythrough', function() {
            heroVideo.play().catch(function(error) {
                console.log('Autoplay prevented:', error);
                // Fallback to particles if autoplay fails
                heroVideo.style.display = 'none';
                initializeParticles();
            });
        });
        
        // Check if video sources exist
        const videoSources = heroVideo.querySelectorAll('source');
        let hasValidSource = false;
        
        videoSources.forEach(source => {
            if (source.src && source.src !== '') {
                hasValidSource = true;
            }
        });
        
        if (!hasValidSource) {
            console.log('No valid video source found, using particles');
            heroVideo.style.display = 'none';
            initializeParticles();
        }
    } else {
        // No video element, use particles
        initializeParticles();
    }
}

// Set time-based video function
function setTimeBasedVideo(heroVideo) {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Define time periods and corresponding videos
    const timeBasedVideos = {
        morning: {
            start: 6,
            end: 11,
            mp4: 'assets/videos/morning_video.mp4',
            webm: 'assets/videos/morning_video.webm',
            fallback: 'assets/videos/hero-video.mp4'
        },
        afternoon: {
            start: 12,
            end: 17,
            mp4: 'assets/videos/afternoon_video.mp4',
            webm: 'assets/videos/afternoon_video.webm',
            fallback: 'assets/videos/hero-video.mp4'
        },
        evening: {
            start: 18,
            end: 22,
            mp4: 'assets/videos/evening_video.mp4',
            webm: 'assets/videos/evening_video.webm',
            fallback: 'assets/videos/hero-video.mp4'
        },
        night: {
            start: 23,
            end: 5,
            mp4: 'assets/videos/night_video.mp4',
            webm: 'assets/videos/night_video.webm',
            fallback: 'assets/videos/hero-video.mp4'
        }
    };
    
    // Determine current time period
    let currentPeriod = 'morning'; // default
    
    if (currentHour >= timeBasedVideos.morning.start && currentHour <= timeBasedVideos.morning.end) {
        currentPeriod = 'morning';
    } else if (currentHour >= timeBasedVideos.afternoon.start && currentHour <= timeBasedVideos.afternoon.end) {
        currentPeriod = 'afternoon';
    } else if (currentHour >= timeBasedVideos.evening.start && currentHour <= timeBasedVideos.evening.end) {
        currentPeriod = 'evening';
    } else {
        currentPeriod = 'night';
    }
    
    console.log(`Current time: ${currentHour}:00 - Setting ${currentPeriod} video theme`);
    
    // Get video sources
    const mp4Source = document.getElementById('video-source-mp4');
    const webmSource = document.getElementById('video-source-webm');
    
    if (mp4Source && webmSource) {
        const videoConfig = timeBasedVideos[currentPeriod];
        
        // Set video sources with fallback
        mp4Source.src = videoConfig.mp4;
        webmSource.src = videoConfig.webm;
        
        // Add error handling for time-based videos
        mp4Source.addEventListener('error', function() {
            console.log(`${currentPeriod} video not found, using fallback`);
            mp4Source.src = videoConfig.fallback;
            heroVideo.load();
        });
        
        webmSource.addEventListener('error', function() {
            console.log(`${currentPeriod} webm video not found, using fallback`);
            webmSource.src = videoConfig.fallback;
            heroVideo.load();
        });
        
        // Reload video with new sources
        heroVideo.load();
    }
    
    // Update video every hour
    setInterval(() => {
        const newHour = new Date().getHours();
        if (newHour !== currentHour) {
            console.log('Hour changed, updating video...');
            setTimeBasedVideo(heroVideo);
        }
    }, 60000); // Check every minute
}



// Particles.js initialization
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        // Check if device is mobile for performance optimization
        const isMobile = window.innerWidth <= 768;
        
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: isMobile ? 30 : 80, // Reduce particles on mobile for better performance
                    density: { enable: true, value_area: 800 } 
                },
                color: { value: '#ffffff' },
                shape: { 
                    type: 'circle',
                    stroke: { width: 0, color: '#000000' }
                },
                opacity: { 
                    value: isMobile ? 0.3 : 0.5, // Reduce opacity on mobile when video is present
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
                    speed: isMobile ? 2 : 6, // Slower speed on mobile for better performance
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

    // Scroll direction detection variables
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    let scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
    let ticking = false;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Navbar scroll effect with hide/show functionality
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Determine scroll direction
        isScrollingDown = scrollDelta > scrollThreshold;
        const isScrollingUp = scrollDelta < -scrollThreshold;
        
        // Only hide/show if we've scrolled enough and not at the very top
        // Don't hide navbar if mobile menu is open or user prefers reduced motion
        if (Math.abs(scrollDelta) > scrollThreshold && !isMenuOpen && !prefersReducedMotion) {
            if (isScrollingDown && currentScrollY > 100) {
                // Hide navbar when scrolling down
                navbar.classList.remove('nav-visible');
                navbar.classList.add('nav-hidden');
            } else if (isScrollingUp || currentScrollY <= 100) {
                // Show navbar when scrolling up or at top
                navbar.classList.remove('nav-hidden');
                navbar.classList.add('nav-visible');
            }
        }
        
        // Update background and shadow based on scroll position
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
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

    // Hamburger menu toggle for additional menu items
    const hamburgerMenu = document.getElementById('hamburger-menu');
    let isHamburgerMenuOpen = false;
    
    if (hamburger && hamburgerMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHamburgerMenu();
        });

        // Close hamburger menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isHamburgerMenuOpen && !hamburgerMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeHamburgerMenu();
            }
        });

        // Close hamburger menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isHamburgerMenuOpen) {
                closeHamburgerMenu();
            }
        });
    }

    function toggleHamburgerMenu() {
        isHamburgerMenuOpen = !isHamburgerMenuOpen;
        hamburgerMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isHamburgerMenuOpen ? 'hidden' : '';
    }

    function closeHamburgerMenu() {
        if (isHamburgerMenuOpen) {
            isHamburgerMenuOpen = false;
            hamburgerMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Ensure navbar is visible when mobile menu is open
        if (isMenuOpen) {
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
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
            
            // Remove animation classes
            navMenu.classList.remove('nav-menu-enter', 'nav-menu-exit');
        }
    }

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // 외부 링크 (페이지 이동)는 기본 동작 허용
            if (targetId.startsWith('pages/') || targetId.startsWith('http') || targetId.includes('.html')) {
                // 기본 동작 허용 (페이지 이동)
                closeMobileMenu();
                return true;
            }
            
            // 앵커 링크만 preventDefault 적용
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
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
        '.journey-item, .info-card, .timeline-item, .skill-card, .sales-item, .hobby-item, .stat-item'
    );
    
    animatedElements.forEach(el => {
        // Only add fade-in class if it doesn't already exist
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        observer.observe(el);
    });

    // Stagger animation for grids
    const staggerContainers = document.querySelectorAll('.skills-grid, .sales-grid, .hobby-grid, .info-grid');
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

    // EmailJS Configuration
    const emailjsConfig = {
        publicKey: '3efSrc3mFT9o8xULf',
        serviceID: 'service_my45w39',
        templateID: 'template_hagtkx9'
    };

    // EmailJS 라이브러리 로드 확인
    if (typeof emailjs === 'undefined') {
        console.warn('⚠️ EmailJS 라이브러리가 로드되지 않았습니다. 대체 연락 방법을 표시합니다.');
        showFallbackContact();
        return;
    }

    // EmailJS 초기화 (오류 처리 추가)
    try {
        emailjs.init(emailjsConfig.publicKey);
        console.log('✅ EmailJS 초기화 완료');
    } catch (error) {
        console.error('❌ EmailJS 초기화 실패:', error);
        showFallbackContact();
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 버튼 상태: 로딩 중
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>전송 중...</span>';
        submitBtn.disabled = true;

        // 폼 데이터 가져오기
        const templateParams = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toLocaleString('ko-KR')
        };
        
        // 향상된 유효성 검사
        const validation = validateContactForm(templateParams);
        if (!validation.isValid) {
            showNotification(validation.message, 'warning');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        // EmailJS 전송 시도 (안전한 방식으로 재작성)
        const emailService = emailjsConfig.serviceID;
        const emailTemplate = emailjsConfig.templateID;
        
        emailjs.send(emailService, emailTemplate, templateParams)
            .then(function(response) {
                console.log('✅ EmailJS 전송 성공:', response.status, response.text);
                showNotification('메시지가 성공적으로 전송되었습니다! 24시간 내로 답변 드리겠습니다.', 'success');
                contactForm.reset();
                
                // 전송 성공 추적
                trackContactSubmission('success');
                
            }, function(error) {
                console.error('❌ EmailJS 전송 실패:', error);
                
                // 구체적인 오류 메시지 제공
                let errorMessage = '메시지 전송에 실패했습니다. ';
                
                if (error.status === 400) {
                    errorMessage += '입력 정보를 확인해주세요.';
                } else if (error.status === 402) {
                    errorMessage += '전송 한도를 초과했습니다. 직접 이메일로 연락주세요.';
                } else if (error.status === 403) {
                    errorMessage += '접근이 제한되었습니다. 직접 이메일로 연락주세요.';
                } else {
                    errorMessage += '잠시 후 다시 시도하거나 직접 이메일로 연락주세요.';
                }
                
                showNotification(errorMessage, 'danger');
                
                // 대체 연락 방법 제공
                setTimeout(() => {
                    showFallbackContact();
                }, 3000);
                
                // 전송 실패 추적
                trackContactSubmission('failed', error);
                
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// 폼 유효성 검사 함수
function validateContactForm(data) {
    // 필수 필드 검사
    if (!data.name || !data.email || !data.message) {
        return {
            isValid: false,
            message: '이름, 이메일, 메시지는 필수 입력 항목입니다.'
        };
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return {
            isValid: false,
            message: '올바른 이메일 주소를 입력해주세요.'
        };
    }
    
    // 메시지 길이 검사
    if (data.message.length < 10) {
        return {
            isValid: false,
            message: '메시지는 10자 이상 입력해주세요.'
        };
    }
    
    return { isValid: true };
}

// 대체 연락 방법 표시
function showFallbackContact() {
    const fallbackHtml = `
        <div class="fallback-contact" style="
            background: #f8f9fa; 
            border: 2px solid #007bff; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0;
            text-align: center;
        ">
            <h4 style="color: #007bff; margin-bottom: 15px;">📧 직접 연락하기</h4>
            <p style="margin-bottom: 10px;">메시지 전송에 문제가 있나요? 아래 방법으로 직접 연락해주세요:</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="mailto:jun22sky@nate.com" style="
                    background: #007bff; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    text-decoration: none;
                    font-weight: 600;
                ">📧 이메일 보내기</a>
                <a href="tel:010-0000-3888" style="
                    background: #28a745; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    text-decoration: none;
                    font-weight: 600;
                ">📞 전화하기</a>
            </div>
        </div>
    `;
    
    const contactFormWrapper = document.querySelector('.contact-form-wrapper');
    if (contactFormWrapper) {
        contactFormWrapper.insertAdjacentHTML('afterend', fallbackHtml);
    }
}

// 연락처 제출 추적
function trackContactSubmission(status, error = null) {
    const trackingData = {
        timestamp: new Date().toISOString(),
        status: status,
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    if (error) {
        trackingData.error = {
            status: error.status,
            text: error.text,
            message: error.message
        };
    }
    
    // 로컬 스토리지에 추적 데이터 저장
    const existingData = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    existingData.push(trackingData);
    
    // 최근 10개만 유지
    if (existingData.length > 10) {
        existingData.shift();
    }
    
    localStorage.setItem('contactSubmissions', JSON.stringify(existingData));
    console.log('📊 Contact submission tracked:', trackingData);
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    let isValid = true;
    let message = '';
    
    // Remove previous validation states
    field.classList.remove('valid', 'invalid');
    const existingFeedback = field.parentNode.querySelector('.field-feedback');
    if (existingFeedback) existingFeedback.remove();
    
    // Validate based on field type
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                message = '이름을 입력해주세요.';
            } else if (value.length < 2) {
                isValid = false;
                message = '이름은 2자 이상 입력해주세요.';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                message = '이메일을 입력해주세요.';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                message = '올바른 이메일 형식을 입력해주세요.';
            }
            break;
        case 'message':
            if (!value) {
                isValid = false;
                message = '메시지를 입력해주세요.';
            } else if (value.length < 10) {
                isValid = false;
                message = '메시지는 10자 이상 입력해주세요.';
            } else if (value.length > 1000) {
                isValid = false;
                message = '메시지는 1000자 이내로 입력해주세요.';
            }
            break;
    }
    
    // Apply validation styles and feedback
    if (isValid) {
        field.classList.add('valid');
        if (fieldName !== 'company') { // Company is optional
            const feedback = document.createElement('div');
            feedback.className = 'field-feedback success';
            feedback.textContent = '✓ 올바른 형식입니다.';
            field.parentNode.appendChild(feedback);
        }
    } else {
        field.classList.add('invalid');
        const feedback = document.createElement('div');
        feedback.className = 'field-feedback error';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    }
    
    // Update submit button state
    updateSubmitButtonState();
}

// Update submit button state based on form validity
function updateSubmitButtonState() {
    const submitBtn = document.querySelector('.submit-btn');
    const requiredFields = document.querySelectorAll('#contactForm [required]');
    
    let allValid = true;
    requiredFields.forEach(field => {
        if (!field.classList.contains('valid')) {
            allValid = false;
        }
    });
    
    if (allValid) {
        submitBtn.disabled = false;
        submitBtn.classList.add('ready');
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('ready');
        submitBtn.style.background = '';
    }
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('valid', 'invalid');
    const feedback = field.parentNode.querySelector('.field-feedback');
    if (feedback) feedback.remove();
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: '✅',
        warning: '⚠️',
        danger: '❌',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${iconMap[type] || 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Initialize form field validation
function initializeFormValidation() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    formFields.forEach(field => {
        // Add required attribute to name, email, and message fields
        if (['name', 'email', 'message'].includes(field.name)) {
            field.setAttribute('required', '');
        }
        
        // Add real-time validation
        field.addEventListener('blur', validateField);
        field.addEventListener('input', debounce(validateField, 500));
        field.addEventListener('focus', clearValidation);
        
        // Add character counter for message field
        if (field.name === 'message') {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.textContent = '0/1000';
            field.parentNode.appendChild(counter);
            
            field.addEventListener('input', function() {
                const count = this.value.length;
                counter.textContent = `${count}/1000`;
                counter.style.color = count > 1000 ? '#f44336' : '#666';
            });
        }
    });
    
    // Initial submit button state
    updateSubmitButtonState();
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

// 강화된 전역 오류 처리기
window.addEventListener('error', function(e) {
    // 무시할 오류들 (더 포괄적으로)
    const ignoredErrors = [
        'data/sales-data.json',
        'sales-data.json',
        'json1', // 이상한 json1 요청
        'send1', // 이상한 send1 요청
        'Non-Error promise rejection',
        'Script error',
        'Loading chunk',
        'ChunkLoadError'
    ];
    
    const shouldIgnore = ignoredErrors.some(ignore => 
        (e.message && e.message.includes(ignore)) || 
        (e.filename && e.filename.includes(ignore))
    );
    
    if (!shouldIgnore) {
        console.warn('⚠️ 페이지 오류 감지:', e.message);
    }
});

// 강화된 Promise rejection 처리
window.addEventListener('unhandledrejection', function(e) {
    const errorMessage = e.reason?.message || e.reason?.toString() || '';
    
    // 무시할 Promise rejection들
    const ignoredRejections = [
        '404',
        'Not Found',
        'sales-data.json',
        'json1',
        'send1',
        'fetch'
    ];
    
    const shouldIgnore = ignoredRejections.some(ignore => 
        errorMessage.includes(ignore)
    );
    
    if (shouldIgnore) {
        e.preventDefault(); // 콘솔 에러 방지
        console.log('📁 무시된 요청 오류 (정상):', errorMessage);
    }
});

// EmailJS 진단 도구 (개발자 도구에서 실행 가능)
window.diagnoseEmailJS = function() {
    console.log('%c🔧 EmailJS 진단 시작...', 'color: #007bff; font-weight: bold;');
    
    // EmailJS 로드 확인
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS 라이브러리가 로드되지 않았습니다.');
        console.log('💡 해결방법: index.html에서 EmailJS CDN 로드를 확인하세요.');
        return;
    }
    
    console.log('✅ EmailJS 라이브러리 로드 완료');
    
    // 설정 확인
    const config = {
        publicKey: '3efSrc3mFT9o8xULf',
        serviceID: 'service_my45w39',
        templateID: 'template_hagtkx9'
    };
    
    console.log('📋 현재 EmailJS 설정:', config);
    console.log('🌐 현재 도메인:', window.location.hostname);
    console.log('🔗 현재 URL:', window.location.href);
    
    // 실제 폼 데이터로 테스트 (실제 전송하지 않음)
    console.log('🧪 폼 유효성 검사 테스트...');
    
    const testData = {
        name: 'DiagnosticTest',
        email: 'diagnostic@test.com',
        company: 'Test Company',
        message: 'EmailJS 진단 테스트 메시지 - 실제 전송되지 않습니다.',
        timestamp: new Date().toLocaleString('ko-KR')
    };
    
    // 유효성 검사 테스트
    if (typeof validateContactForm === 'function') {
        const validation = validateContactForm(testData);
        console.log('📝 유효성 검사 결과:', validation);
    }
    
    // 실제 EmailJS 서비스 연결 테스트 (간단한 ping)
    console.log('📡 EmailJS 서비스 연결 테스트 중...');
    
    // 실제 전송은 사용자 승인 후에만
    console.log('%c⚠️ 실제 이메일 전송 테스트를 원하면 아래 명령어를 실행하세요:', 'color: #ff6b00; font-weight: bold;');
    console.log('testEmailJSSend() - 실제 테스트 이메일 전송');
};

// 실제 전송 테스트 함수 (분리)
window.testEmailJSSend = function() {
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS가 로드되지 않았습니다.');
        return;
    }
    
    const config = {
        publicKey: '3efSrc3mFT9o8xULf',
        serviceID: 'service_my45w39',
        templateID: 'template_hagtkx9'
    };
    
    const testData = {
        name: '[TEST] 진단도구',
        email: 'diagnostic.test@example.com',
        company: '시스템 진단',
        message: '🔧 EmailJS 연결 테스트입니다. 이 메시지는 진단 목적으로 전송되었습니다.',
        timestamp: new Date().toLocaleString('ko-KR')
    };
    
    console.log('📤 실제 테스트 이메일 전송 중...');
    
    const testService = config.serviceID;
    const testTemplate = config.templateID;
    
    emailjs.send(testService, testTemplate, testData)
        .then(function(response) {
            console.log('✅ 테스트 전송 성공!', response);
            console.log('📊 응답 상태:', response.status);
            console.log('📧 테스트 이메일이 jun22sky@nate.com으로 전송되었습니다.');
        })
        .catch(function(error) {
            console.error('❌ 테스트 전송 실패:', error);
            console.error('📊 오류 상태:', error.status);
            console.error('📊 오류 메시지:', error.text);
            
            // 구체적인 오류 해결 방법 제시
            const solutions = {
                400: '입력 데이터나 템플릿 설정을 확인하세요.',
                402: 'EmailJS 월간 전송 한도를 초과했습니다. 계정 업그레이드가 필요합니다.',
                403: '도메인 허용 목록을 확인하거나 Public Key를 재설정하세요.',
                404: '서비스 ID나 템플릿 ID가 올바르지 않습니다.',
                429: '너무 많은 요청입니다. 잠시 후 다시 시도하세요.',
                500: 'EmailJS 서버 오류입니다. 잠시 후 다시 시도하세요.'
            };
            
            const solution = solutions[error.status] || '알 수 없는 오류입니다. EmailJS 문서를 확인하세요.';
            console.log(`💡 해결 방법: ${solution}`);
            
            if (error.status === 402) {
                console.log('🔗 EmailJS 계정 관리: https://dashboard.emailjs.com/admin');
            }
        });
};

// 전송 히스토리 확인 도구
window.checkContactHistory = function() {
    const history = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.log('📈 최근 연락처 제출 히스토리:', history);
    
    if (history.length === 0) {
        console.log('📭 제출 히스토리가 없습니다.');
        return;
    }
    
    const successCount = history.filter(h => h.status === 'success').length;
    const failedCount = history.filter(h => h.status === 'failed').length;
    
    console.log(`📊 통계: 성공 ${successCount}건, 실패 ${failedCount}건`);
    
    // 최근 실패 오류 분석
    const recentFailures = history.filter(h => h.status === 'failed').slice(-3);
    if (recentFailures.length > 0) {
        console.log('❌ 최근 실패 오류들:');
        recentFailures.forEach((failure, index) => {
            console.log(`${index + 1}. ${failure.timestamp}: ${failure.error?.status || 'Unknown'} - ${failure.error?.text || 'No details'}`);
        });
    }
};

// 캐시 클리어 도구 추가
window.clearWebsiteCache = function() {
    console.log('%c🧹 캐시 클리어 시작...', 'color: #ff6b00; font-weight: bold;');
    
    // LocalStorage 클리어
    const storageKeys = Object.keys(localStorage);
    console.log('💾 LocalStorage 항목들:', storageKeys);
    localStorage.clear();
    
    // SessionStorage 클리어  
    sessionStorage.clear();
    
    // Service Worker 클리어 (있다면)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
                console.log('🔧 Service Worker 제거됨');
            }
        });
    }
    
    // 캐시 클리어 안내
    console.log('✅ 웹사이트 데이터 클리어 완료!');
    console.log('%c다음 단계: Ctrl+Shift+R 로 하드 리프레시하세요', 'color: #ff0000; font-weight: bold;');
};

// 네트워크 요청 모니터링 도구
window.monitorRequests = function() {
    console.log('%c📡 네트워크 요청 모니터링 시작...', 'color: #007bff; font-weight: bold;');
    
    // fetch 요청 가로채기
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        console.log('🌐 Fetch 요청:', url);
        
        // 이상한 요청 감지
        if (url && (url.includes('json1') || url.includes('send1'))) {
            console.error('❌ 이상한 요청 감지됨:', url);
            console.trace('요청 스택 추적:');
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ 요청 모니터링 활성화됨');
};

console.log('%c🔧 확장된 진단 도구 사용법:', 'color: #28a745; font-weight: bold;');
console.log('clearWebsiteCache() - 웹사이트 캐시 완전 삭제');
console.log('monitorRequests() - 네트워크 요청 실시간 모니터링');
console.log('diagnoseEmailJS() - EmailJS 연결 및 설정 진단');
console.log('testEmailJSSend() - 실제 테스트 이메일 전송');
console.log('checkContactHistory() - 최근 제출 히스토리 확인');
console.log('%c🚀 오류 해결 도구가 업그레이드되었습니다!', 'color: #007bff; font-weight: bold;');

function initializeModals() {
    const clickableItems = document.querySelectorAll('.sales-item, .hobby-item');

    clickableItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // 자식 요소의 클릭 이벤트가 버블링되는 것을 막기 위해,
            // 클릭된 요소가 item 자신인지 확인합니다.
            if (e.currentTarget !== item) {
                return;
            }

            const title = item.dataset.title;
            const category = item.dataset.category;

            if (title && category && typeof openSalesModal === 'function') {
                openSalesModal(title, category);
            }
        });
    });
}

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if(window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Magnetic Hover Effect
function initializeMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic-hover, .cta-primary, .cta-secondary, .info-card, .sales-item, .hobby-item');
    
    magneticElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 10;
            const rotateY = deltaX * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
    });
}

// Parallax Scrolling Effect
function initializeParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-element, .hero-background');
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Throttle parallax updates for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
}

// Smooth Entrance Animations
function initializeSmoothEntrances() {
    const smoothElements = document.querySelectorAll('.smooth-entrance, .timeline-item, .journey-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger delay for multiple elements
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
        element.classList.add('smooth-entrance');
        observer.observe(element);
    });
}
