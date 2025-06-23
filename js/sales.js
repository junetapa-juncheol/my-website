// Sales functionality (previously portfolio functionality)
document.addEventListener('DOMContentLoaded', function() {
    initializeSalesFilters();
    initializeSalesModal();
    loadSalesData();
    initializeSalesTouch();
});

// Sales filter functionality
function initializeSalesFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const salesItems = document.querySelectorAll('.sales-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Prevent double clicks
            if (btn.dataset.filtering) return;
            btn.dataset.filtering = 'true';
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            
            // Filter items with staggered animation
            salesItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.classList.add('will-animate');
                    }, index * 50);
                    
                    // Remove will-change after animation
                    setTimeout(() => {
                        item.classList.remove('will-animate');
                    }, (index * 50) + 600);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Re-enable button after animation
            setTimeout(() => {
                btn.dataset.filtering = 'false';
            }, 1000);
        });
    });
}

// Sales touch optimizations
function initializeSalesTouch() {
    const salesItems = document.querySelectorAll('.sales-item');
    const isTouchDevice = 'ontouchstart' in window;
    
    if (isTouchDevice) {
        salesItems.forEach(item => {
            let touchStartTime;
            let touchStartPos;
            
            item.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchStartPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
                
                // Show overlay on touch start for mobile
                const overlay = item.querySelector('.sales-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.transition = 'transform 0.3s ease';
                }
            });
            
            item.addEventListener('touchend', (e) => {
                const touchEndTime = Date.now();
                const touchEndPos = {
                    x: e.changedTouches[0].clientX,
                    y: e.changedTouches[0].clientY
                };
                
                const touchDuration = touchEndTime - touchStartTime;
                const touchDistance = Math.sqrt(
                    Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
                    Math.pow(touchEndPos.y - touchStartPos.y, 2)
                );
                
                // Consider it a tap if duration < 500ms and distance < 10px
                if (touchDuration < 500 && touchDistance < 10) {
                    const title = item.querySelector('h3').textContent;
                    const category = item.getAttribute('data-category');
                    openSalesModal(title, category);
                }
                
                // Hide overlay after a delay on mobile
                setTimeout(() => {
                    const overlay = item.querySelector('.sales-overlay');
                    if (overlay) {
                        overlay.style.transform = 'translateY(100%)';
                    }
                }, 2000);
            });
            
            // Prevent default touch behavior that might interfere
            item.addEventListener('touchmove', (e) => {
                // Allow scrolling but prevent other touch behaviors
                if (e.touches.length === 1) {
                    e.stopPropagation();
                }
            });
        });
    } else {
        // Desktop hover behavior
        salesItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h3').textContent;
                const category = item.getAttribute('data-category');
                openSalesModal(title, category);
            });
        });
    }
}

// Sales modal functionality
function initializeSalesModal() {
    // Modal is initialized when opened to save memory
}

function openSalesModal(title, category) {
    const modalData = getSalesDetails(title, category);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'sales-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="모달 닫기">&times;</button>
            <div class="modal-header">
                <h2>${modalData.title}</h2>
                <span class="modal-category">${modalData.category}</span>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${modalData.image}" alt="${modalData.title}" loading="lazy">
                </div>
                <div class="modal-details">
                    <div class="project-info">
                        <h3>업무 소개</h3>
                        <p>${modalData.description}</p>
                        
                        <h3>주요 성과</h3>
                        <ul>
                            ${modalData.achievements.map(achievement => 
                                `<li>${achievement}</li>`
                            ).join('')}
                        </ul>
                        
                        <h3>사용 기술</h3>
                        <div class="tech-tags">
                            ${modalData.technologies.map(tech => 
                                `<span class="tech-tag">${tech}</span>`
                            ).join('')}
                        </div>
                        
                        <div class="project-metrics">
                            <div class="metric">
                                <span class="metric-value">${modalData.duration}</span>
                                <span class="metric-label">프로젝트 기간</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${modalData.scale}</span>
                                <span class="metric-label">프로젝트 규모</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${modalData.role}</span>
                                <span class="metric-label">담당 역할</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal styles if not already present
    addModalStyles();
    
    document.body.appendChild(modal);

    // Animate modal in
    requestAnimationFrame(() => {
        modal.style.animation = 'modalFadeIn 0.3s ease forwards';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease forwards';
    });

    // Close modal functionality
    const closeModal = () => {
        modal.style.animation = 'modalFadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300);
    };

    // Event listeners for closing
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Touch handling for mobile
    let touchStartY;
    modal.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    modal.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;
        
        // Close modal if swiped down significantly
        if (deltaY > 100) {
            closeModal();
        }
    });
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Focus management for accessibility
    const firstFocusable = modal.querySelector('.modal-close');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

function addModalStyles() {
    if (document.querySelector('#modal-styles')) return;
    
    const modalStyles = document.createElement('style');
    modalStyles.id = 'modal-styles';
    modalStyles.textContent = `
        .sales-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 15px;
            max-width: 900px;
            max-height: 90vh;
            width: 90%;
            overflow-y: auto;
            transform: translateY(-50px) scale(0.9);
            opacity: 0;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            z-index: 10001;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover,
        .modal-close:focus {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
            outline: 2px solid var(--primary-color);
        }
        
        .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            margin: 0 0 10px 0;
            color: var(--primary-color);
            font-size: clamp(1.5rem, 4vw, 2rem);
        }
        
        .modal-category {
            background: var(--gradient-primary);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: clamp(0.8rem, 2.5vw, 0.9rem);
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .modal-image {
            width: 100%;
            height: 300px;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 30px;
        }
        
        .modal-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .project-info h3 {
            color: var(--primary-color);
            margin: 20px 0 10px 0;
            font-size: clamp(1.1rem, 3vw, 1.2rem);
        }
        
        .project-info p {
            font-size: clamp(0.9rem, 2.5vw, 1rem);
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .project-info ul {
            margin: 10px 0 20px 20px;
        }
        
        .project-info li {
            margin-bottom: 5px;
            line-height: 1.6;
            font-size: clamp(0.9rem, 2.5vw, 1rem);
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0 20px 0;
        }
        
        .tech-tag {
            background: #f0f0f0;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            color: #666;
        }
        
        .project-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .metric {
            text-align: center;
        }
        
        .metric-value {
            display: block;
            font-size: clamp(1.2rem, 4vw, 1.5rem);
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 5px;
        }
        
        .metric-label {
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            color: #666;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                max-height: 95vh;
                margin: 2.5vh auto;
            }
            
            .modal-header,
            .modal-body {
                padding: 20px;
            }
            
            .modal-image {
                height: 200px;
                margin-bottom: 20px;
            }
            
            .project-metrics {
                grid-template-columns: 1fr;
                gap: 15px;
                padding: 15px;
            }
            
            .modal-close {
                top: 10px;
                right: 10px;
                width: 35px;
                height: 35px;
                font-size: 1.5rem;
            }
        }
        
        @media (max-width: 480px) {
            .modal-content {
                width: 98%;
                margin: 1vh auto;
                border-radius: 10px;
            }
            
            .modal-header,
            .modal-body {
                padding: 15px;
            }
            
            .modal-image {
                height: 180px;
                margin-bottom: 15px;
            }
            
            .project-info h3 {
                margin: 15px 0 8px 0;
            }
            
            .tech-tags {
                gap: 6px;
            }
            
            .tech-tag {
                padding: 4px 8px;
                font-size: 0.75rem;
            }
        }
        
        @keyframes modalFadeIn {
            to { opacity: 1; }
        }
        
        @keyframes modalFadeOut {
            to { opacity: 0; }
        }
        
        @keyframes modalSlideIn {
            to { 
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
    `;

    document.head.appendChild(modalStyles);
}

function getSalesDetails(title, category) {
    const salesData = {
        '교육청 전산유지보수': {
            title: '교육청 전산유지보수',
            category: '전산유지보수',
            image: 'img/core_img/edu.png',
            description: '개인사업자에서 법인으로 전환하며 실적이 전혀 없는 불리한 상황에서도 수의계약 수주에 성공한 놀라운 프로젝트입니다. 1,300대 규모의 PC와 네트워크 인프라를 완벽하게 관리하며, 추가적인 소모품과 보안프로그램 영업까지 확장시킨 전략적 성과를 달성했습니다.',
            achievements: [
                '전산장비 및 OA 사무기기 2,000대 규모 완벽 관리',
                'PC, 네트워크 인프라 통합 운영 및 유지보수',
                '안정적인 시스템 운영으로 무장애 서비스 달성',
                '전산소모품 영업 확장으로 부가가치 창출',
                '보안솔루션 영업 확장으로 종합 IT 솔루션 파트너로 성장'
            ],
            technologies: ['네트워크 관리', 'PC 유지보수', '보안시스템', '원격관리', 'ERP 연동', 'OA 장비 관리'],
            duration: '2년 5개월',
            scale: '2,000대 장비',
            role: '프로젝트 총괄'
        },
        '스마트미러 OEM 개발': {
            title: '스마트미러 OEM 개발',
            category: '기술영업',
            image: 'img/core_img/smart mirror.png',
            description: '기존 스마트미러 제품의 UI 변경과 디자인 수정을 담당하여 미용실 특화 솔루션으로 개발했습니다. 전국 대리점 모집 전략을 수립하고 실행하여 성공적인 판매 네트워크를 구축한 혁신적인 프로젝트입니다.',
            achievements: [
                '미용실 특화 UI/UX 디자인 개발',
                '전국 대리점 네트워크 구축',
                'OEM 제품 성공적 출시',
                '판매 채널 다양화 달성',
                '브랜드 인지도 확산'
            ],
            technologies: ['UI/UX 디자인', 'IoT 기술', '터치스크린', '안드로이드', '클라우드 연동'],
            duration: '1년 3개월',
            scale: '전국 대리점',
            role: 'UI 기획 및 영업 총괄'
        },
        '대학병원 정보보호팀': {
            title: '대학병원 정보보호팀 관리',
            category: '전산유지보수',
            image: 'img/core_img/hos.png',
            description: '3명 팀의 리더로서 대학병원 전체 IT 인프라를 총괄 관리했습니다. 의료진의 업무 중단 없이 안정적인 서비스를 제공하는 극도로 까다로운 환경에서 완벽한 시스템 운영을 달성했습니다.',
            achievements: [
                '병원 전체 IT 인프라 총괄 관리',
                '3명 팀 리더십으로 효율적 운영',
                '무중단 서비스 제공 달성',
                '각종 의료장비 네트워크 연동',
                '보안 강화 및 개인정보 보호'
            ],
            technologies: ['네트워크 관리', '서버 관리', '의료장비 연동', '보안시스템', '원격 모니터링'],
            duration: '1년 4개월',
            scale: '병원 전체',
            role: '정보보호팀 팀장'
        },
        '디지털 마케팅 혁신': {
            title: '디지털 마케팅 혁신',
            category: '창작',
            image: 'img/디지털 마케팅 혁신.png',
            description: '회사 홈페이지 기획부터 개발까지 총괄하고, 블로그 마케팅을 통해 단 5개월 만에 1400명의 네트워크를 구축한 혁신적인 디지털 마케팅 프로젝트입니다. 온라인 셀러 모집과 B2B 협력점 확보까지 달성했습니다.',
            achievements: [
                '홈페이지 기획 및 개발 총괄',
                '5개월간 블로그 이웃 1400명 모집',
                '온라인 셀러 네트워크 구축',
                'B2B 협력점 4곳 모집 성공',
                '매출 증대에 직접적 기여'
            ],
            technologies: ['웹개발', 'SEO 최적화', '소셜미디어 마케팅', '콘텐츠 제작', '데이터 분석'],
            duration: '4년',
            scale: '1400명 네트워크',
            role: '디지털 마케팅 총괄'
        }
    };

    return salesData[title] || {
        title: title,
        category: category,
        image: 'https://via.placeholder.com/900x300/666/ffffff?text=기술영업+이미지',
        description: '프로젝트 상세 정보를 불러오는 중입니다.',
        achievements: ['프로젝트 정보 준비 중'],
        technologies: ['정보 없음'],
        duration: '-',
        scale: '-',
        role: '-'
    };
}

// Load sales data from external source
async function loadSalesData() {
    try {
        // Try to load from external JSON file
        const response = await fetch('data/sales-data.json');
        if (response.ok) {
            const data = await response.json();
            if (data && data.projects) {
                updateSalesItems(data.projects);
            }
        }
    } catch (error) {
        console.log('Using default sales data');
    }
}

function updateSalesItems(projects) {
    const salesGrid = document.querySelector('.sales-grid');
    if (!salesGrid) return;
    
    salesGrid.innerHTML = projects.map(project => `
        <div class="sales-item" data-category="${project.category}">
            <div class="sales-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="sales-overlay">
                    <div class="sales-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="sales-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize sales functionality
    initializeSalesFilters();
    initializeSalesTouch();
}

// Lazy loading for sales images
function initializeLazyLoading() {
    const images = document.querySelectorAll('.sales-image img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Export functions for external use
window.salesFunctions = {
    openSalesModal,
    initializeSalesFilters,
    loadSalesData,
    initializeSalesTouch
};

// Performance optimization: Preload critical modal styles
document.addEventListener('DOMContentLoaded', () => {
    // Preload modal styles to avoid FOUC
    setTimeout(addModalStyles, 1000);
});

// Handle orientation change for mobile devices
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Reinitialize touch handling after orientation change
        initializeSalesTouch();
        
        // Update modal dimensions if open
        const modal = document.querySelector('.sales-modal');
        if (modal) {
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.maxHeight = '90vh';
        }
    }, 100);
});

// Memory management: Clean up event listeners
window.addEventListener('beforeunload', () => {
    const modal = document.querySelector('.sales-modal');
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
});
