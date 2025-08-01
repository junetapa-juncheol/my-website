// Experience Education Page JavaScript

// 타임라인 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // 네비게이션 링크를 직접 페이지 이동으로 처리
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 버블링 중지
            e.preventDefault(); // 기본 동작 방지
            
            const href = this.getAttribute('href');
            
            // 직접 페이지 이동
            if (href) {
                window.location.href = href;
            }
        }, true); // 캡처링 단계에서 실행하여 다른 이벤트보다 먼저 처리
    });

    // 탭 기능 추가
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // 모든 탭 콘텐츠에서 active 클래스 제거
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 클릭된 탭 버튼에 active 클래스 추가
            this.classList.add('active');
            
            // 해당 탭 콘텐츠에 active 클래스 추가
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // 교육 과정 카드 아코디언 기능 추가
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        const title = card.querySelector('.certificate-title');
        const details = card.querySelectorAll('.certificate-details');
        
        if (title && details.length > 0) {
            // 초기 상태: 상세 내용 숨김
            details.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // 제목에 클릭 이벤트 추가
            title.style.cursor = 'pointer';
            title.style.userSelect = 'none';
            title.addEventListener('click', function() {
                // 현재 카드의 상세 내용 토글
                const isExpanded = details[0].style.display !== 'none';
                
                details.forEach(detail => {
                    if (isExpanded) {
                        detail.style.display = 'none';
                        card.classList.remove('expanded');
                    } else {
                        detail.style.display = 'block';
                        card.classList.add('expanded');
                    }
                });
            });
        }
    });
});

// 모바일 최적화 추가 기능
if (window.innerWidth <= 768) {
    // 모바일에서 햄버거 메뉴 개선
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // 모바일에서 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
    
    // 모바일에서 터치 성능 최적화
    let lastTouchY = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        lastTouchY = e.touches[0].clientY;
    }, { passive: true });
    
    // 모바일에서 빠른 탭 지원
    document.addEventListener('touchend', function(e) {
        // 300ms 지연 제거를 위한 빠른 탭 처리
        if (Math.abs(lastTouchY - touchStartY) < 10) {
            e.target.click();
        }
    }, { passive: true });
}

// 모바일에서 화면 회전 시 최적화
window.addEventListener('orientationchange', function() {
    // 화면 회전 시 높이 재계산
    setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
});

// 초기 뷰포트 높이 설정
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// 모바일에서 스크롤 성능 최적화
let ticking = false;

function updateScrollPosition() {
    const scrollY = window.pageYOffset;
    const header = document.querySelector('.navbar');
    
    if (header) {
        if (scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.backdropFilter = 'blur(5px)';
        }
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });

// 모바일에서 이미지 lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// 모바일에서 폰트 로딩 최적화
if (document.fonts) {
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
    });
}

// 모바일에서 접근성 개선
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
});

// 모바일에서 메모리 사용량 최적화
window.addEventListener('beforeunload', function() {
    // 이벤트 리스너 정리
    observer.disconnect();
    if (imageObserver) imageObserver.disconnect();
});