// Experience Education Mobile Page JavaScript

// 햄버거 메뉴 토글 함수
function toggleHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    hamburger.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
    
    // 햅틱 피드백
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// 카드 토글 함수
function toggleCard(header) {
    const card = header.closest('.education-card');
    const content = card.querySelector('.card-content');
    const icon = header.querySelector('.expand-icon');
    
    card.classList.toggle('expanded');
    content.classList.toggle('expanded');
    
    // 햅틱 피드백
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// 뒤로가기 함수
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '../index.html';
    }
}

// 홈으로 가기 함수
function goHome() {
    window.location.href = '../index.html';
}

// 스크롤 진행률 표시
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scrollProgress').style.width = scrolled + '%';
}

// 페이드인 애니메이션
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 햄버거 메뉴 이벤트 리스너
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleHamburgerMenu);
    }
    
    // 햄버거 메뉴 외부 클릭시 닫기
    document.addEventListener('click', function(event) {
        if (hamburger && hamburgerMenu && 
            !hamburger.contains(event.target) && 
            !hamburgerMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    });
    
    observeElements();
    
    // 스크롤 이벤트
    window.addEventListener('scroll', updateScrollProgress);
    
    // 터치 이벤트 최적화
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diffY = touchStartY - touchY;
        
        if (Math.abs(diffY) > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 성능 최적화를 위한 스크롤 쓰로틀링
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// 메모리 관리
window.addEventListener('beforeunload', () => {
    // 이벤트 리스너 정리
    window.removeEventListener('scroll', updateScrollProgress);
});