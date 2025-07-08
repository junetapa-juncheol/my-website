// Enhanced Interactive Features for LUXE STUDIO

class LuxeStudio {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupSmoothScrolling();
        this.setupPortfolioInteractions();
        this.setupPerformanceOptimizations();
        this.setupHobbyModal();
    }

    // Loading Screen Management
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        
        // Simulate loading time
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'visible';
            this.triggerEntryAnimations();
        }, 2000);

        // Remove loading screen from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 2500);
    }

    // Scroll-based Animations (AOS-like functionality)
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attributes
        document.querySelectorAll('[data-aos]').forEach(element => {
            observer.observe(element);
        });
    }



    // Parallax Effects for Background Elements
    setupParallaxEffects() {
        const shapes = document.querySelectorAll('.shape');
        const orbs = document.querySelectorAll('.orb');
        
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            shapes.forEach((shape, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = -(scrolled * speed);
                shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Smooth Scrolling for Internal Links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Enhanced Portfolio Item Interactions
    setupPortfolioInteractions() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach((item, index) => {
            // Enhanced hover effects with magnetic attraction
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                const rotateX = deltaY * 10;
                const rotateY = deltaX * -10;
                
                item.style.transform = `
                    translateY(-10px) 
                    scale(1.02) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });

            // Sequential animation on page load
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300 + (index * 150));
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Preload critical images
        this.preloadImages();
        
        // Optimize scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollEnd();
            }, 150);
        });

        // Intersection observer for performance monitoring
        this.setupVisibilityOptimizations();
    }

    preloadImages() {
        const imageUrls = [
            '../assets/images/gallery/logo.png',
            '../assets/images/gallery/luxury-bg.jpg',
            '../assets/images/gallery/creative-bg.jpg',
            '../assets/images/gallery/digital-bg.jpg',
            '../assets/images/gallery/premium-bg.jpg'
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    setupVisibilityOptimizations() {
        const expensiveElements = document.querySelectorAll('.portfolio-item, .shape');
        
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });

        expensiveElements.forEach(element => {
            visibilityObserver.observe(element);
        });
    }

    handleScrollEnd() {
        // Add any cleanup or optimization logic here
        document.body.classList.add('scroll-end');
        setTimeout(() => {
            document.body.classList.remove('scroll-end');
        }, 100);
    }

    // Entry animations after loading
    triggerEntryAnimations() {
        const header = document.getElementById('header');
        const container = document.getElementById('container');
        
        // Staggered entry animations
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-50px)';
            
            setTimeout(() => {
                header.style.transition = 'all 0.8s ease';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }

        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                container.style.transition = 'all 1s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    // Hobby Modal Setup
    setupHobbyModal() {
        const portfolioItems = document.querySelectorAll('.portfolio-item[data-hobby]');
        const modal = document.getElementById('hobbyModal');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        // Add click event to portfolio items
        portfolioItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const hobbyType = item.getAttribute('data-hobby');
                const title = item.querySelector('.title').textContent;
                this.openHobbyModal(hobbyType, title);
            });
        });

        // Close modal events
        closeBtn.addEventListener('click', () => this.closeHobbyModal());
        overlay.addEventListener('click', () => this.closeHobbyModal());

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeHobbyModal();
            }
        });
    }

    openHobbyModal(hobbyType, title) {
        const modal = document.getElementById('hobbyModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalSubtitle = document.getElementById('modalSubtitle');
        const photoGallery = document.getElementById('photoGallery');
        const photoCountDisplay = document.querySelector('.photo-count-display');

        // Update modal content
        modalTitle.textContent = title;
        modalSubtitle.textContent = `${title} 사진 갤러리`;

        // Show loading state
        photoGallery.innerHTML = `
            <div class="photo-loading">
                <div class="loading-spinner"></div>
            </div>
        `;

        // Load photos for the hobby type
        const photos = this.getHobbyPhotos(hobbyType);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.displayPhotos(photos, photoGallery, photoCountDisplay);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 500);
    }

    closeHobbyModal() {
        const modal = document.getElementById('hobbyModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'visible';
    }

    getHobbyPhotos(hobbyType) {
        // 각 취미별 사진 데이터
        const hobbyPhotos = {
            travel: [
                { src: '../assets/images/gallery/hobby_photos/travel/travel1.jpg', title: '부산 바다에서', description: '파도소리가 너무 좋아' },
                { src: '../assets/images/gallery/hobby_photos/travel/travel2.jpg', title: '비행기 타고 여행', description: '여행은 즐거워' },
                { src: '../assets/images/gallery/hobby_photos/travel/travel3.jpg', title: '하늘위 풍경', description: '너무 아름다워' },
                { src: '../assets/images/gallery/hobby_photos/travel/travel4.jpg', title: '파주 마장 호수에서', description: '출렁다리를 찾아서' },
                { src: '../assets/images/gallery/hobby_photos/travel/travel5.jpg', title: '하늘위에서 야경', description: '야경은 너무 아름다워' },
                { src: '../assets/images/gallery/hobby_photos/travel/travel6.jpg', title: '다시 생각나는 바다', description: '바다와 함께하는 시간' }
            ],
            movie: [
                { src: '../assets/images/gallery/hobby_photos/movie/movie1.jpg', title: '영화관에서', description: '대형 스크린의 몰입감' },
                { src: '../assets/images/gallery/hobby_photos/movie/movie2.jpg', title: '인상 깊은 장면', description: '잊을 수 없는 순간들' },
                { src: '../assets/images/gallery/hobby_photos/movie/movie3.jpg', title: '영화 포스터', description: '수집한 영화 포스터들' },
                { src: '../assets/images/gallery/hobby_photos/movie/movie4.jpg', title: '영화 티켓', description: '기념으로 남긴 티켓들' },
                { src: '../assets/images/gallery/hobby_photos/movie/movie5.jpg', title: '영화 리뷰', description: '작성한 영화 리뷰들' },
                { src: '../assets/images/gallery/hobby_photos/movie/movie6.jpg', title: '영화 OST', description: '좋아하는 영화 음악' }
            ],
            web: [
                { src: '../assets/images/gallery/web-bg.jpg', title: '웹 검색', description: '새로운 정보 탐색' },
                { src: '../assets/images/gallery/web-bg.jpg', title: '기술 블로그', description: '최신 기술 동향' },
                { src: '../assets/images/gallery/web-bg.jpg', title: '온라인 강의', description: '지식 습득의 시간' },
                { src: '../assets/images/gallery/web-bg.jpg', title: '웹 개발', description: '코딩과 디버깅' },
                { src: '../assets/images/gallery/web-bg.jpg', title: '디자인 참고', description: '아름다운 웹사이트들' },
                { src: '../assets/images/gallery/web-bg.jpg', title: '온라인 커뮤니티', description: '지식 공유의 장' }
            ],
            drive: [
                { src: '../assets/images/gallery/drive-bg.jpg', title: '도로 위에서', description: '자유로운 드라이브' },
                { src: '../assets/images/gallery/drive-bg.jpg', title: '풍경 감상', description: '창 밖의 아름다운 풍경' },
                { src: '../assets/images/gallery/drive-bg.jpg', title: '휴게소에서', description: '잠시 쉬어가는 시간' },
                { src: '../assets/images/gallery/drive-bg.jpg', title: '야경 드라이브', description: '밤의 도시를 달리며' },
                { src: '../assets/images/gallery/drive-bg.jpg', title: '고속도로', description: '빠른 속도로 달리는 즐거움' },
                { src: '../assets/images/gallery/drive-bg.jpg', title: '산악 도로', description: '구불구불한 산길' }
            ],
            game: [
                { src: '../assets/images/gallery/game-bg.jpg', title: '게임 플레이', description: '가상 세계의 모험' },
                { src: '../assets/images/gallery/game-bg.jpg', title: '게임 스크린샷', description: '특별한 순간들을 기록' },
                { src: '../assets/images/gallery/game-bg.jpg', title: '게임 컬렉션', description: '수집한 게임들' },
                { src: '../assets/images/gallery/game-bg.jpg', title: '멀티플레이', description: '친구들과 함께하는 게임' },
                { src: '../assets/images/gallery/game-bg.jpg', title: '게임 리뷰', description: '플레이한 게임들의 후기' },
                { src: '../assets/images/gallery/game-bg.jpg', title: '게임 설정', description: '최적화된 게임 환경' }
            ],
            photo: [
                { src: '../assets/images/gallery/photo-bg.jpg', title: '사진 촬영', description: '렌즈로 담아낸 순간들' },
                { src: '../assets/images/gallery/photo-bg.jpg', title: '자연 사진', description: '자연의 아름다움' },
                { src: '../assets/images/gallery/photo-bg.jpg', title: '도시 사진', description: '도시의 다양한 모습' },
                { src: '../assets/images/gallery/photo-bg.jpg', title: '인물 사진', description: '사람들의 표정과 감정' },
                { src: '../assets/images/gallery/photo-bg.jpg', title: '사진 편집', description: '후보정 작업' },
                { src: '../assets/images/gallery/photo-bg.jpg', title: '사진 전시', description: '작품 전시회' }
            ],
            sns: [
                { src: '../assets/images/gallery/sns-bg.jpg', title: '소셜미디어', description: '일상을 공유하는 공간' },
                { src: '../assets/images/gallery/sns-bg.jpg', title: '인스타그램', description: '사진과 스토리 공유' },
                { src: '../assets/images/gallery/sns-bg.jpg', title: '페이스북', description: '친구들과 소통' },
                { src: '../assets/images/gallery/sns-bg.jpg', title: '트위터', description: '짧은 생각들을 나누며' },
                { src: '../assets/images/gallery/sns-bg.jpg', title: '유튜브', description: '영상 콘텐츠 제작' },
                { src: '../assets/images/gallery/sns-bg.jpg', title: '블로그', description: '긴 글과 생각 정리' }
            ],
            book: [
                { src: '../assets/images/gallery/book-bg.jpg', title: '독서 시간', description: '책과 함께하는 여유' },
                { src: '../assets/images/gallery/book-bg.jpg', title: '책장 정리', description: '수집한 책들' },
                { src: '../assets/images/gallery/book-bg.jpg', title: '독서 노트', description: '읽은 내용 정리' },
                { src: '../assets/images/gallery/book-bg.jpg', title: '독서 모임', description: '책에 대해 이야기하는 시간' },
                { src: '../assets/images/gallery/book-bg.jpg', title: '도서관', description: '지식의 보고' },
                { src: '../assets/images/gallery/book-bg.jpg', title: '독서 리뷰', description: '읽은 책들의 후기' }
            ]
        };

        return hobbyPhotos[hobbyType] || [];
    }

    displayPhotos(photos, gallery, countDisplay) {
        if (photos.length === 0) {
            gallery.innerHTML = `
                <div class="empty-gallery">
                    <div class="empty-icon">📷</div>
                    <h3>아직 사진이 없습니다</h3>
                    <p>곧 새로운 사진들이 추가될 예정입니다!</p>
                </div>
            `;
            countDisplay.textContent = '총 0장의 사진';
            return;
        }

        const photoHTML = photos.map(photo => `
            <div class="photo-item">
                <img src="${photo.src}" alt="${photo.title}" loading="lazy">
                <div class="photo-overlay">
                    <div class="photo-info">
                        <h4>${photo.title}</h4>
                        <p>${photo.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        gallery.innerHTML = photoHTML;
        countDisplay.textContent = `총 ${photos.length}장의 사진`;

        // Add click event to photos for lightbox effect (optional)
        gallery.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', () => {
                // 여기에 라이트박스 기능을 추가할 수 있습니다
                console.log('Photo clicked:', item.querySelector('img').alt);
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LuxeStudio();
});

// Additional utility functions for enhanced UX
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Device detection
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Reduced motion detection
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};

// Export for potential module usage
window.LuxeStudio = LuxeStudio;
window.LuxeUtils = utils;