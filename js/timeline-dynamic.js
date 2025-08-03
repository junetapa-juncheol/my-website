// Timeline 동적 간격 조정 스크립트

class DynamicTimeline {
    constructor() {
        this.timeline = document.querySelector('.timeline');
        this.items = document.querySelectorAll('.timeline-item');
        this.init();
    }

    init() {
        if (!this.timeline || this.items.length === 0) return;
        
        // 초기 설정
        this.adjustSpacing();
        this.setupObserver();
        this.groupByYear();
        
        // 리사이즈 이벤트
        window.addEventListener('resize', () => {
            this.debounce(this.adjustSpacing.bind(this), 300);
        });
    }

    // 컨텐츠 양에 따른 동적 간격 조정
    adjustSpacing() {
        this.items.forEach((item, index) => {
            const content = item.querySelector('.timeline-content, .timeline-description');
            if (!content) return;

            const contentHeight = content.offsetHeight;
            const nextItem = this.items[index + 1];
            
            // 컨텐츠 높이에 따른 간격 계산
            let spacing;
            if (contentHeight < 150) {
                spacing = 30; // 작은 컨텐츠
                item.classList.add('timeline-item--small');
            } else if (contentHeight < 300) {
                spacing = 45; // 중간 컨텐츠
                item.classList.add('timeline-item--medium');
            } else {
                spacing = 60; // 큰 컨텐츠
                item.classList.add('timeline-item--large');
            }

            // 모바일에서는 간격 축소
            if (window.innerWidth <= 768) {
                spacing *= 0.7;
            }

            // 마지막 아이템이 아닌 경우에만 간격 적용
            if (nextItem) {
                item.style.marginBottom = `${spacing}px`;
            } else {
                item.style.marginBottom = '0';
            }
        });
    }

    // 연도별 그룹핑
    groupByYear() {
        const yearGroups = new Map();
        
        this.items.forEach(item => {
            const yearElement = item.querySelector('.timeline-year');
            if (!yearElement) return;
            
            const year = yearElement.textContent.trim();
            if (!yearGroups.has(year)) {
                yearGroups.set(year, []);
            }
            yearGroups.get(year).push(item);
        });

        // 연도별로 그룹 생성
        yearGroups.forEach((items, year) => {
            if (items.length > 1) {
                const firstItem = items[0];
                const lastItem = items[items.length - 1];
                
                // 같은 연도 그룹에 클래스 추가
                items.forEach(item => {
                    item.classList.add('timeline-year-group-item');
                });
                
                // 첫 번째와 마지막 아이템 표시
                firstItem.classList.add('timeline-year-group-first');
                lastItem.classList.add('timeline-year-group-last');
            }
        });
    }

    // Intersection Observer 설정
    setupObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 순차적 애니메이션
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, observerOptions);

        this.items.forEach(item => {
            observer.observe(item);
        });
    }

    // 디바운스 함수
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
    }

    // 스크롤 위치에 따른 활성 아이템 표시
    highlightActiveItem() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        this.items.forEach(item => {
            const itemTop = item.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;
            
            if (scrollPosition >= itemTop && scrollPosition <= itemBottom) {
                item.classList.add('timeline-item--active');
            } else {
                item.classList.remove('timeline-item--active');
            }
        });
    }
}

// 스마트 간격 계산 함수
function calculateSmartSpacing(items) {
    const spacings = [];
    
    items.forEach((item, index) => {
        if (index === items.length - 1) return;
        
        const currentContent = item.querySelector('.timeline-content');
        const nextContent = items[index + 1].querySelector('.timeline-content');
        
        if (!currentContent || !nextContent) return;
        
        // 현재와 다음 아이템의 컨텐츠 높이
        const currentHeight = currentContent.offsetHeight;
        const nextHeight = nextContent.offsetHeight;
        
        // 평균 높이를 기준으로 간격 계산
        const avgHeight = (currentHeight + nextHeight) / 2;
        const baseSpacing = 40;
        const dynamicSpacing = Math.min(Math.max(avgHeight * 0.2, 30), 80);
        
        spacings.push({
            item: item,
            spacing: baseSpacing + (dynamicSpacing - baseSpacing) * 0.5
        });
    });
    
    return spacings;
}

// Timeline 대안: 카드 그리드 레이아웃 개선
class EnhancedCertificateGrid {
    constructor() {
        this.grid = document.querySelector('.certificate-grid');
        this.cards = document.querySelectorAll('.certificate-card');
        this.init();
    }

    init() {
        if (!this.grid || this.cards.length === 0) return;
        
        this.setupMasonry();
        this.setupAnimations();
        this.addTimelineIndicators();
    }

    // Masonry 스타일 레이아웃
    setupMasonry() {
        // CSS Grid의 auto-fit을 활용한 자동 레이아웃
        this.grid.style.gridAutoRows = '10px';
        
        this.cards.forEach(card => {
            const cardHeight = card.offsetHeight;
            const rowSpan = Math.ceil(cardHeight / 10);
            card.style.gridRowEnd = `span ${rowSpan}`;
        });
    }

    // 시간순 정렬 표시
    addTimelineIndicators() {
        const sortedCards = Array.from(this.cards).sort((a, b) => {
            const dateA = this.extractDate(a);
            const dateB = this.extractDate(b);
            return dateB - dateA; // 최신순
        });

        sortedCards.forEach((card, index) => {
            card.setAttribute('data-timeline-order', index + 1);
            card.style.order = index;
        });
    }

    // 날짜 추출
    extractDate(card) {
        const dateElement = card.querySelector('.certificate-date');
        if (!dateElement) return 0;
        
        const dateText = dateElement.textContent;
        const yearMatch = dateText.match(/(\d{4})/);
        return yearMatch ? parseInt(yearMatch[1]) : 0;
    }

    // 애니메이션 설정
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('card-visible');
                    }, index * 50);
                }
            });
        }, {
            threshold: 0.1
        });

        this.cards.forEach(card => {
            observer.observe(card);
        });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Timeline을 사용하는 경우
    const timeline = new DynamicTimeline();
    
    // Certificate Grid를 사용하는 경우
    const grid = new EnhancedCertificateGrid();
    
    // 스크롤 이벤트 최적화
    let ticking = false;
    function updateOnScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                timeline.highlightActiveItem();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
});