
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeVisitorStats();
    initializeLiveChat();
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
    initializeInteractiveTimeline();
    initializeTechStackAnimations();
    initializeTimelineGallery();
    initializeNoticePopup();
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

// Interactive Timeline functionality
function initializeInteractiveTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const progressBar = document.querySelector('.timeline-progress-bar');
    
    if (!timelineItems.length || !progressBar) return;
    
    // Initialize timeline items visibility
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered animation
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 200);
                
                // Update progress bar
                updateTimelineProgress();
                
                // Add click handler for timeline item
                entry.target.addEventListener('click', () => {
                    toggleTimelineItem(entry.target);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe timeline items
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Update progress bar based on scroll
    function updateTimelineProgress() {
        const activeItems = document.querySelectorAll('.timeline-item.active');
        const totalItems = timelineItems.length;
        const progress = (activeItems.length / totalItems) * 100;
        
        progressBar.style.height = `${progress}%`;
    }
    
    // Toggle timeline item details
    function toggleTimelineItem(item) {
        const isExpanded = item.classList.contains('expanded');
        
        // Remove expanded class from all items
        timelineItems.forEach(timelineItem => {
            timelineItem.classList.remove('expanded');
        });
        
        // Add expanded class to clicked item if it wasn't already expanded
        if (!isExpanded) {
            item.classList.add('expanded');
            item.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
    
    // Add smooth scroll progress tracking
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
    const skillBars = document.querySelectorAll('.skill-progress');
    const statCards = document.querySelectorAll('.stat-card');
    
    // Animate tech categories on scroll
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation for categories
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
    
    // Observe tech categories
    techCategories.forEach(category => {
        techObserver.observe(category);
    });
    
    // Animate skill bars within a category
    function animateSkillBarsInCategory(category) {
        const categorySkillBars = category.querySelectorAll('.skill-progress');
        
        categorySkillBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                // Animate to target width
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }, index * 100);
        });
    }
    
    // Animate stat cards
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    animateStatNumber(statNumber);
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    statCards.forEach(card => {
        statsObserver.observe(card);
    });
    
    // Animate stat numbers with counting effect
    function animateStatNumber(element) {
        const targetText = element.textContent;
        const targetNumber = parseInt(targetText.match(/\d+/)?.[0] || '0');
        const suffix = targetText.replace(/\d+/, '');
        
        let currentNumber = 0;
        const increment = Math.ceil(targetNumber / 30);
        const duration = 1000;
        const stepTime = duration / (targetNumber / increment);
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
            }
            element.textContent = currentNumber + suffix;
        }, stepTime);
    }
    
    // Add hover effects for tech categories
    techCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        category.addEventListener('mouseleave', () => {
            category.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click to expand functionality for mobile
    if (window.innerWidth <= 768) {
        techCategories.forEach(category => {
            const header = category.querySelector('.category-header');
            const skills = category.querySelector('.tech-skills');
            
            if (header && skills) {
                header.addEventListener('click', () => {
                    const isExpanded = category.classList.contains('expanded');
                    
                    // Close all other categories
                    techCategories.forEach(cat => {
                        if (cat !== category) {
                            cat.classList.remove('expanded');
                        }
                    });
                    
                    // Toggle current category
                    category.classList.toggle('expanded');
                    
                    if (!isExpanded) {
                        // Scroll category into view
                        category.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                });
            }
        });
    }
    
    // Philosophy points hover effect
    const philosophyPoints = document.querySelectorAll('.point-item');
    philosophyPoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            point.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        point.addEventListener('mouseleave', () => {
            point.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Visitor Statistics functionality
function initializeVisitorStats() {
    const widget = document.getElementById('visitorStatsWidget');
    const toggle = document.getElementById('statsToggle');
    const content = document.getElementById('statsContent');
    const closeBtn = document.getElementById('statsClose');
    const header = document.getElementById('statsHeader');
    
    if (!widget || !toggle || !content || !closeBtn || !header) return;
    
    // Initialize stats object
    const stats = {
        currentVisitors: 1,
        todayVisitors: 0,
        totalVisitors: 0,
        pageViews: 0,
        sessionStart: Date.now(),
        lastUpdate: Date.now()
    };
    
    // Load saved statistics
    loadStats();
    
    // Initialize widget toggle functionality
    initializeStatsToggle();
    
    // Initialize close functionality
    initializeStatsClose();
    
    // Initialize drag functionality
    initializeStatsDrag();
    
    // Start tracking
    startVisitorTracking();
    
    // Update display
    updateStatsDisplay();
    
    // Set up periodic updates
    setInterval(updateStatsDisplay, 30000); // Update every 30 seconds
    
    // Set up page visibility tracking
    setupPageVisibilityTracking();
    
    // Track page unload
    setupPageUnloadTracking();
    
    // Make show function globally available
    window.showVisitorStats = function() {
        widget.classList.remove('hidden');
        localStorage.setItem('statsWidgetHidden', 'false');
    };
    
    function loadStats() {
        try {
            const savedStats = localStorage.getItem('visitorStats');
            if (savedStats) {
                const parsed = JSON.parse(savedStats);
                
                // Check if it's a new day
                const today = new Date().toDateString();
                const lastVisitDate = new Date(parsed.lastUpdate || 0).toDateString();
                
                if (today !== lastVisitDate) {
                    // New day - reset today's count
                    stats.todayVisitors = 1;
                    stats.totalVisitors = (parsed.totalVisitors || 0) + 1;
                } else {
                    // Same day - load existing stats
                    stats.todayVisitors = parsed.todayVisitors || 0;
                    stats.totalVisitors = parsed.totalVisitors || 0;
                }
                
                stats.pageViews = (parsed.pageViews || 0) + 1;
            } else {
                // First visit ever
                stats.todayVisitors = 1;
                stats.totalVisitors = 1;
                stats.pageViews = 1;
            }
        } catch (error) {
            console.warn('Error loading visitor stats:', error);
            // Set default values
            stats.todayVisitors = 1;
            stats.totalVisitors = 1;
            stats.pageViews = 1;
        }
    }
    
    function saveStats() {
        try {
            stats.lastUpdate = Date.now();
            localStorage.setItem('visitorStats', JSON.stringify(stats));
        } catch (error) {
            console.warn('Error saving visitor stats:', error);
        }
    }
    
    function initializeStatsToggle() {
        // Toggle widget collapse/expand
        toggle.addEventListener('click', () => {
            widget.classList.toggle('collapsed');
            const isCollapsed = widget.classList.contains('collapsed');
            
            // Save collapsed state
            localStorage.setItem('statsWidgetCollapsed', isCollapsed.toString());
            
            // Update aria-label
            toggle.setAttribute('aria-label', 
                isCollapsed ? '통계 위젯 펼치기' : '통계 위젯 접기'
            );
        });
        
        // Load collapsed state
        const isCollapsed = localStorage.getItem('statsWidgetCollapsed') === 'true';
        if (isCollapsed) {
            widget.classList.add('collapsed');
        }
        
        // Add keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    }
    
    function initializeStatsClose() {
        // Close button functionality
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent header click event
            widget.classList.add('hidden');
            
            // Save hidden state
            localStorage.setItem('statsWidgetHidden', 'true');
        });
        
        // Load hidden state
        const isHidden = localStorage.getItem('statsWidgetHidden') === 'true';
        if (isHidden) {
            widget.classList.add('hidden');
        }
        
        // Add keyboard support for close button
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeBtn.click();
            }
        });
    }
    
    function initializeStatsDrag() {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let startPos = { x: 0, y: 0 };
        
        // Load saved position
        const savedPosition = localStorage.getItem('statsWidgetPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            widget.style.left = position.left + 'px';
            widget.style.bottom = position.bottom + 'px';
        }
        
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events for mobile
        header.addEventListener('touchstart', startDragTouch, { passive: false });
        document.addEventListener('touchmove', dragTouch, { passive: false });
        document.addEventListener('touchend', stopDrag);
        
        function startDrag(e) {
            // Don't start drag if clicking on toggle or close buttons
            if (e.target.closest('.stats-toggle') || e.target.closest('.stats-close')) {
                return;
            }
            
            isDragging = true;
            widget.classList.add('dragging');
            startPos.x = e.clientX;
            startPos.y = e.clientY;
            
            const rect = widget.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        }
        
        function startDragTouch(e) {
            if (e.target.closest('.stats-toggle') || e.target.closest('.stats-close')) {
                return;
            }
            
            const touch = e.touches[0];
            isDragging = true;
            widget.classList.add('dragging');
            startPos.x = touch.clientX;
            startPos.y = touch.clientY;
            
            const rect = widget.getBoundingClientRect();
            dragOffset.x = touch.clientX - rect.left;
            dragOffset.y = touch.clientY - rect.top;
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            
            updatePosition(x, y);
            e.preventDefault();
        }
        
        function dragTouch(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const x = touch.clientX - dragOffset.x;
            const y = touch.clientY - dragOffset.y;
            
            updatePosition(x, y);
            e.preventDefault();
        }
        
        function updatePosition(x, y) {
            // Keep widget within viewport bounds
            const maxX = window.innerWidth - widget.offsetWidth;
            const maxY = window.innerHeight - widget.offsetHeight;
            
            const clampedX = Math.max(0, Math.min(x, maxX));
            const clampedY = Math.max(0, Math.min(y, maxY));
            
            // Convert to bottom/left positioning
            const left = clampedX;
            const bottom = window.innerHeight - clampedY - widget.offsetHeight;
            
            widget.style.left = left + 'px';
            widget.style.bottom = bottom + 'px';
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            widget.classList.remove('dragging');
            
            // Save position
            const left = parseInt(widget.style.left) || 30;
            const bottom = parseInt(widget.style.bottom) || 30;
            
            localStorage.setItem('statsWidgetPosition', JSON.stringify({
                left: left,
                bottom: bottom
            }));
        }
    }
    
    function startVisitorTracking() {
        // Simulate current visitors (in real app, this would come from server)
        simulateCurrentVisitors();
        
        // Track session duration
        setInterval(() => {
            const sessionDuration = Math.floor((Date.now() - stats.sessionStart) / 1000);
            // You could send this to analytics service
        }, 60000); // Every minute
    }
    
    function simulateCurrentVisitors() {
        // Simulate realistic visitor counts based on time
        const hour = new Date().getHours();
        let baseVisitors = 1;
        
        // More visitors during peak hours (9 AM - 6 PM)
        if (hour >= 9 && hour <= 18) {
            baseVisitors = Math.floor(Math.random() * 5) + 2; // 2-6 visitors
        } else if (hour >= 19 && hour <= 23) {
            baseVisitors = Math.floor(Math.random() * 3) + 1; // 1-3 visitors
        } else {
            baseVisitors = Math.floor(Math.random() * 2) + 1; // 1-2 visitors
        }
        
        stats.currentVisitors = baseVisitors;
        
        // Vary the count slightly every 2-5 minutes
        const nextUpdate = (Math.random() * 3 + 2) * 60000; // 2-5 minutes
        setTimeout(() => {
            simulateCurrentVisitors();
        }, nextUpdate);
    }
    
    function updateStatsDisplay() {
        const elements = {
            currentVisitors: document.getElementById('currentVisitors'),
            todayVisitors: document.getElementById('todayVisitors'),
            totalVisitors: document.getElementById('totalVisitors'),
            pageViews: document.getElementById('pageViews'),
            lastUpdated: document.getElementById('lastUpdated')
        };
        
        // Update each stat with animation
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && stats[key] !== undefined) {
                const oldValue = element.textContent;
                const newValue = formatNumber(stats[key]);
                
                if (oldValue !== newValue && key !== 'lastUpdated') {
                    element.classList.add('updated');
                    setTimeout(() => {
                        element.classList.remove('updated');
                    }, 600);
                }
                
                element.textContent = newValue;
            }
        });
        
        // Update timestamp
        if (elements.lastUpdated) {
            elements.lastUpdated.textContent = `마지막 업데이트: ${getTimeAgo(stats.lastUpdate)}`;
        }
        
        // Save updated stats
        saveStats();
    }
    
    function setupPageVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page became hidden
                stats.lastUpdate = Date.now();
                saveStats();
            } else {
                // Page became visible
                stats.pageViews++;
                updateStatsDisplay();
            }
        });
    }
    
    function setupPageUnloadTracking() {
        window.addEventListener('beforeunload', () => {
            stats.lastUpdate = Date.now();
            saveStats();
        });
        
        // Also save on page focus lost
        window.addEventListener('blur', () => {
            saveStats();
        });
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    function getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (seconds < 60) {
            return '방금 전';
        } else if (minutes < 60) {
            return `${minutes}분 전`;
        } else if (hours < 24) {
            return `${hours}시간 전`;
        } else {
            return `${Math.floor(hours / 24)}일 전`;
        }
    }
    
    // Public methods for external use
    window.visitorStats = {
        increment: (type) => {
            if (stats[type] !== undefined) {
                stats[type]++;
                updateStatsDisplay();
            }
        },
        
        getCurrentStats: () => ({ ...stats }),
        
        reset: () => {
            if (confirm('정말로 통계를 초기화하시겠습니까?')) {
                localStorage.removeItem('visitorStats');
                location.reload();
            }
        }
    };
}

// Live Chat functionality
function initializeLiveChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatLauncher = document.getElementById('chatLauncher');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const chatMinimize = document.getElementById('chatMinimize');
    const chatClose = document.getElementById('chatClose');
    const chatTyping = document.getElementById('chatTyping');
    const chatSuggestions = document.getElementById('chatSuggestions');
    const launcherNotification = document.getElementById('launcherNotification');
    
    if (!chatWidget || !chatLauncher) return;
    
    // Chat state
    let isOpen = false;
    let isMinimized = false;
    let isTyping = false;
    let messageId = 0;
    
    // Auto-responses database
    const autoResponses = {
        greeting: [
            "안녕하세요! 방문해주셔서 감사합니다. 무엇을 도와드릴까요?",
            "반갑습니다! 궁금한 점이 있으시면 언제든 말씀해주세요.",
            "안녕하세요! Junetapa입니다. 어떤 도움이 필요하신가요?"
        ],
        portfolio: [
            "포트폴리오에 관심을 가져주셔서 감사합니다! 25년+ IT 경험을 바탕으로 한 다양한 프로젝트를 진행했습니다.",
            "제 포트폴리오는 B2B 기술영업, IT 인프라 관리, 그리고 창작 활동으로 구성되어 있습니다. 어떤 부분이 궁금하신가요?",
            "포트폴리오 상세 내용은 '소개' 페이지와 '핵심역량' 섹션에서 확인하실 수 있습니다!"
        ],
        collaboration: [
            "협업 제안에 감사드립니다! 현재 프리랜서로 활동하며 새로운 프로젝트를 찾고 있습니다.",
            "협업은 언제나 환영입니다! jun22sky@nate.com으로 상세한 제안서를 보내주시면 검토 후 답변드리겠습니다.",
            "어떤 종류의 협업을 생각하고 계신가요? IT 컨설팅, 기술영업, 또는 프로젝트 관리 등 다양한 분야에서 도움을 드릴 수 있습니다."
        ],
        contact: [
            "연락처 정보는 페이지 하단의 '연락하기' 섹션에서 확인하실 수 있습니다.",
            "이메일: jun22sky@nate.com | 전화: 010-****-3888 | 카카오톡 오픈채팅도 이용 가능합니다!",
            "24시간 내 답변 보장해드리니 편하신 방법으로 연락주세요!"
        ],
        experience: [
            "25년+ IT 업계 경험을 가지고 있습니다. 전산유지보수부터 B2B 기술영업까지 다양한 분야를 담당했습니다.",
            "주요 경력: 교육청 전산유지보수, 대학병원 IT 관리, 카드발급기 기술영업, 1000+ 렌탈 실적 등이 있습니다.",
            "경력 상세 내용은 '활동&교육' 페이지에서 더 자세히 보실 수 있습니다!"
        ],
        default: [
            "죄송합니다. 구체적으로 어떤 도움이 필요하신지 말씀해주시면 더 정확한 답변을 드릴 수 있습니다.",
            "더 자세한 정보가 필요하시면 jun22sky@nate.com으로 연락주시거나 카카오톡 오픈채팅을 이용해주세요!",
            "홈페이지의 각 섹션을 살펴보시면 더 많은 정보를 얻으실 수 있습니다. 특별히 궁금한 점이 있으시면 알려주세요!"
        ]
    };
    
    // Initialize chat
    initializeChat();
    
    function initializeChat() {
        // Load chat state
        loadChatState();
        
        // Set up event listeners
        setupEventListeners();
        
        // Show initial notification
        showNotification();
        
        // Set up auto-status updates
        updateOnlineStatus();
        setInterval(updateOnlineStatus, 300000); // Update every 5 minutes
    }
    
    function setupEventListeners() {
        // Chat launcher
        chatLauncher.addEventListener('click', openChat);
        
        // Chat controls
        chatMinimize.addEventListener('click', minimizeChat);
        chatClose.addEventListener('click', closeChat);
        
        // Message input
        chatInput.addEventListener('keypress', handleKeyPress);
        chatInput.addEventListener('input', handleInputChange);
        chatSend.addEventListener('click', sendMessage);
        
        // Suggestion buttons
        chatSuggestions.addEventListener('click', handleSuggestionClick);
        
        // Outside click to close
        document.addEventListener('click', handleOutsideClick);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    function openChat() {
        isOpen = true;
        isMinimized = false;
        chatWidget.classList.add('active');
        chatWidget.classList.remove('minimized');
        chatLauncher.classList.add('hidden');
        
        // Focus input
        setTimeout(() => {
            chatInput.focus();
        }, 300);
        
        // Hide notification
        hideNotification();
        
        // Save state
        saveChatState();
        
        // Track opening
        if (window.visitorStats) {
            // You could track chat opens here
        }
    }
    
    function closeChat() {
        isOpen = false;
        isMinimized = false;
        chatWidget.classList.remove('active', 'minimized');
        chatLauncher.classList.remove('hidden');
        
        // Save state
        saveChatState();
    }
    
    function minimizeChat() {
        isMinimized = !isMinimized;
        
        if (isMinimized) {
            chatWidget.classList.add('minimized');
            chatMinimize.querySelector('.minimize-icon').textContent = '□';
            chatMinimize.setAttribute('aria-label', '채팅 복원');
        } else {
            chatWidget.classList.remove('minimized');
            chatMinimize.querySelector('.minimize-icon').textContent = '−';
            chatMinimize.setAttribute('aria-label', '채팅 최소화');
            chatInput.focus();
        }
        
        // Save state
        saveChatState();
    }
    
    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }
    
    function handleInputChange() {
        const message = chatInput.value.trim();
        chatSend.disabled = !message;
        
        // Auto-resize input (optional)
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
    }
    
    function handleSuggestionClick(e) {
        if (e.target.classList.contains('suggestion-btn')) {
            const message = e.target.dataset.message;
            chatInput.value = message;
            sendMessage();
        }
    }
    
    function handleOutsideClick(e) {
        if (isOpen && !chatWidget.contains(e.target) && !chatLauncher.contains(e.target)) {
            // Don't close on outside click, just minimize
            if (!isMinimized) {
                minimizeChat();
            }
        }
    }
    
    function handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to open chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isOpen) {
            e.preventDefault();
            openChat();
        }
        
        // Escape to close chat
        if (e.key === 'Escape' && isOpen) {
            closeChat();
        }
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        chatSend.disabled = true;
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate bot response
        setTimeout(() => {
            const response = generateResponse(message);
            hideTypingIndicator();
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 2000); // 1-3 seconds delay
        
        // Hide suggestions after first message
        if (chatMessages.children.length > 2) {
            chatSuggestions.style.display = 'none';
        }
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">
                <div class="message-text">${escapeHtml(text)}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
        
        // Save message history
        saveMessage(text, sender);
    }
    
    function generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Keyword matching
        if (message.includes('안녕') || message.includes('hello') || message.includes('hi')) {
            return getRandomResponse('greeting');
        } else if (message.includes('포트폴리오') || message.includes('portfolio') || message.includes('작업')) {
            return getRandomResponse('portfolio');
        } else if (message.includes('협업') || message.includes('제안') || message.includes('프로젝트') || message.includes('일') || message.includes('collaboration')) {
            return getRandomResponse('collaboration');
        } else if (message.includes('연락') || message.includes('contact') || message.includes('이메일') || message.includes('전화')) {
            return getRandomResponse('contact');
        } else if (message.includes('경력') || message.includes('경험') || message.includes('experience') || message.includes('이력')) {
            return getRandomResponse('experience');
        } else {
            return getRandomResponse('default');
        }
    }
    
    function getRandomResponse(category) {
        const responses = autoResponses[category] || autoResponses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    function showTypingIndicator() {
        isTyping = true;
        chatTyping.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        isTyping = false;
        chatTyping.style.display = 'none';
    }
    
    function showNotification() {
        launcherNotification.classList.remove('hidden');
    }
    
    function hideNotification() {
        launcherNotification.classList.add('hidden');
    }
    
    function updateOnlineStatus() {
        const hour = new Date().getHours();
        const isOnline = (hour >= 9 && hour <= 22); // 9 AM - 10 PM
        
        const statusIndicator = chatWidget.querySelector('.status-indicator');
        const statusText = chatWidget.querySelector('.chat-status-text');
        
        if (isOnline) {
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');
            statusText.textContent = '온라인';
        } else {
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online');
            statusText.textContent = '오프라인';
        }
    }
    
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function saveChatState() {
        try {
            const state = {
                isOpen,
                isMinimized,
                lastActive: Date.now()
            };
            localStorage.setItem('chatState', JSON.stringify(state));
        } catch (error) {
            console.warn('Error saving chat state:', error);
        }
    }
    
    function loadChatState() {
        try {
            const saved = localStorage.getItem('chatState');
            if (saved) {
                const state = JSON.parse(saved);
                
                // Don't auto-open if it's been more than 1 hour
                const oneHour = 60 * 60 * 1000;
                if (Date.now() - state.lastActive < oneHour) {
                    if (state.isOpen) {
                        // Don't auto-open, just show notification
                        showNotification();
                    }
                }
            }
        } catch (error) {
            console.warn('Error loading chat state:', error);
        }
    }
    
    function saveMessage(text, sender) {
        try {
            const messages = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            messages.push({
                id: ++messageId,
                text,
                sender,
                timestamp: Date.now()
            });
            
            // Keep only last 50 messages
            if (messages.length > 50) {
                messages.splice(0, messages.length - 50);
            }
            
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        } catch (error) {
            console.warn('Error saving message:', error);
        }
    }
    
    // Public API
    window.liveChat = {
        open: openChat,
        close: closeChat,
        sendMessage: (text) => {
            if (text) {
                chatInput.value = text;
                sendMessage();
            }
        },
        
        isOpen: () => isOpen,
        
        clearHistory: () => {
            if (confirm('채팅 기록을 모두 삭제하시겠습니까?')) {
                localStorage.removeItem('chatHistory');
                chatMessages.innerHTML = `
                    <div class="message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <div class="message-text">안녕하세요! Junetapa 입니다. 무엇을 도와드릴까요?</div>
                            <div class="message-time">${getCurrentTime()}</div>
                        </div>
                    </div>
                `;
                chatSuggestions.style.display = 'flex';
            }
        }
    };
}

// Timeline Gallery Functionality
function initializeTimelineGallery() {
    const galleryImages = document.querySelectorAll('.timeline-image-item');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.gallery-nav-btn.prev');
    const nextBtn = document.querySelector('.gallery-nav-btn.next');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!galleryImages.length) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    let isUserInteracting = false;
    
    // Initialize gallery
    function initGallery() {
        showImage(0);
        startAutoSlide();
        setupEventListeners();
        syncWithTimeline();
    }
    
    // Show specific image
    function showImage(index) {
        galleryImages.forEach((img, i) => {
            img.classList.remove('active', 'prev');
            if (i < index) {
                img.classList.add('prev');
            } else if (i === index) {
                img.classList.add('active');
            }
        });
        
        galleryDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
        updateNavigationButtons();
    }
    
    // Update navigation button states
    function updateNavigationButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === galleryImages.length - 1;
    }
    
    // Navigate to next image
    function nextImage() {
        if (currentIndex < galleryImages.length - 1) {
            showImage(currentIndex + 1);
        }
    }
    
    // Navigate to previous image
    function prevImage() {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    }
    
    // Start auto slide
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            if (!isUserInteracting) {
                const nextIndex = (currentIndex + 1) % galleryImages.length;
                showImage(nextIndex);
            }
        }, 5000);
    }
    
    // Stop auto slide
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Reset user interaction flag
    function resetUserInteraction() {
        isUserInteracting = true;
        setTimeout(() => {
            isUserInteracting = false;
            startAutoSlide();
        }, 10000);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                resetUserInteraction();
                prevImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                resetUserInteraction();
                nextImage();
            });
        }
        
        // Gallery dots
        galleryDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                resetUserInteraction();
                showImage(index);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Touch/swipe support
        setupTouchNavigation();
        
        // Pause auto-slide on hover
        const galleryContainer = document.querySelector('.timeline-gallery');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', () => {
                isUserInteracting = true;
                stopAutoSlide();
            });
            
            galleryContainer.addEventListener('mouseleave', () => {
                isUserInteracting = false;
                startAutoSlide();
            });
        }
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(e) {
        const galleryContainer = document.querySelector('.timeline-gallery');
        if (!galleryContainer || !galleryContainer.contains(document.activeElement)) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                resetUserInteraction();
                prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                resetUserInteraction();
                nextImage();
                break;
        }
    }
    
    // Setup touch/swipe navigation
    function setupTouchNavigation() {
        const galleryContainer = document.querySelector('.timeline-images');
        if (!galleryContainer) return;
        
        let startX = 0;
        let endX = 0;
        
        galleryContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isUserInteracting = true;
        }, { passive: true });
        
        galleryContainer.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        galleryContainer.addEventListener('touchend', () => {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                resetUserInteraction();
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        });
    }
    
    // Sync gallery with timeline items
    function syncWithTimeline() {
        timelineItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                const year = item.getAttribute('data-year');
                const galleryItem = document.querySelector(`[data-period="${year}"]`);
                if (galleryItem) {
                    const imageIndex = Array.from(galleryImages).indexOf(galleryItem);
                    if (imageIndex !== -1 && imageIndex !== currentIndex) {
                        showImage(imageIndex);
                        resetUserInteraction();
                    }
                }
            });
        });
    }
    
    // Initialize the gallery
    initGallery();
}

// Notice Popup Functionality
function initializeNoticePopup() {
    const popup = document.getElementById('noticePopup');
    const closeBtns = [
        document.querySelector('.notice-close-btn'),
        document.getElementById('noticeCloseBtn')
    ];
    const chatBtn = document.getElementById('noticeChatBtn');
    const contactBtn = document.getElementById('noticeContactBtn');
    const dontShowAgainCheckbox = document.getElementById('dontShowAgain');
    
    if (!popup) return;
    
    // Check if user doesn't want to see popup today
    const dontShowToday = localStorage.getItem('dontShowNoticeToday');
    const today = new Date().toDateString();
    
    if (dontShowToday === today) {
        return; // Don't show popup
    }
    
    // Show popup after page load
    setTimeout(() => {
        showNoticePopup();
    }, 1500);
    
    // Show popup function
    function showNoticePopup() {
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusable = popup.querySelector('.notice-close-btn');
        if (firstFocusable) firstFocusable.focus();
        
        // Announce for screen readers
        announceForScreenReader('홈페이지 안내 팝업이 열렸습니다');
    }
    
    // Hide popup function
    function hideNoticePopup() {
        popup.classList.remove('show');
        document.body.style.overflow = '';
        
        // Check if user selected "don't show again"
        if (dontShowAgainCheckbox && dontShowAgainCheckbox.checked) {
            localStorage.setItem('dontShowNoticeToday', today);
        }
        
        announceForScreenReader('팝업이 닫혔습니다');
    }
    
    // Close button events
    closeBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', hideNoticePopup);
        }
    });
    
    // Chat button event
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            hideNoticePopup();
            // Open live chat if available
            setTimeout(() => {
                if (window.liveChat && typeof window.liveChat.open === 'function') {
                    window.liveChat.open();
                } else {
                    // Fallback: scroll to contact section
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 300);
        });
    }
    
    // Contact button event
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            hideNoticePopup();
            // Scroll to contact section
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    }
    
    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hideNoticePopup();
        }
    });
    
    // Keyboard navigation
    popup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideNoticePopup();
        }
        
        // Tab navigation within popup
        if (e.key === 'Tab') {
            const focusableElements = popup.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Screen reader announcement function
    function announceForScreenReader(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    // Public API
    window.noticePopup = {
        show: showNoticePopup,
        hide: hideNoticePopup,
        isVisible: () => popup.classList.contains('show')
    };
}
