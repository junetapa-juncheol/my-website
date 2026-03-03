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
    // 라벨 분기
    const isCreation = (modalData.category === '창작활동');
    const baseLabels = isCreation ? {
        desc: '창작 배경 및 의의',
        achievements: '창작 하이라이트',
        tech: '활용 도구/플랫폼',
        duration: '활동 기간',
        scale: '창작 규모',
        role: '창작자 역할'
    } : {
        desc: '업무 소개',
        achievements: '주요 성과',
        tech: '사용 기술',
        duration: '유지보수 기간',
        scale: '유지보수 규모',
        role: '담당 역할'
    };
    const LABELS = {
        ...baseLabels,
        duration: modalData.durationLabel || baseLabels.duration,
        scale: modalData.scaleLabel || baseLabels.scale
    };
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
                        <h3>${LABELS.desc}</h3>
                        <p>${modalData.description}</p>
                        <h3>${LABELS.achievements}</h3>
                        <ul>
                            ${modalData.achievements.map(achievement => 
                                `<li>${achievement}</li>`
                            ).join('')}
                        </ul>
                        <h3>${LABELS.tech}</h3>
                        <div class="tech-tags">
                            ${modalData.technologies.map(tech => 
                                `<span class="tech-tag">${tech}</span>`
                            ).join('')}
                        </div>
                        <div class="project-metrics">
                            <div class="metric">
                                <span class="metric-value">${modalData.duration}</span>
                                <span class="metric-label">${LABELS.duration}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${modalData.scale}</span>
                                <span class="metric-label">${LABELS.scale}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${modalData.role}</span>
                                <span class="metric-label">${LABELS.role}</span>
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
            color: #333;
        }
        
        .project-info ul {
            margin: 10px 0 20px 20px;
        }
        
        .project-info li {
            margin-bottom: 5px;
            line-height: 1.6;
            font-size: clamp(0.9rem, 2.5vw, 1rem);
            color: #333;
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
            color: #333;
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
            color: #333;
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
            
            /* 모바일 텍스트 색상 개선 */
            .project-info p {
                color: rgb(104,104,104);
                font-weight: 500;
            }
            
            .project-info li {
                color: rgb(104,104,104);
                font-weight: 500;
            }
            
            .tech-tag {
                color: rgb(104,104,104);
                font-weight: 500;
                background: #f8f9fa;
            }
            
            .metric-label {
                color: rgb(104,104,104);
                font-weight: 500;
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
                color: rgb(104,104,104);
                font-weight: 500;
                background: #f8f9fa;
            }
            
            /* 작은 모바일 화면에서도 텍스트 색상 개선 */
            .project-info p {
                color: rgb(104,104,104);
                font-weight: 500;
            }
            
            .project-info li {
                color: rgb(104,104,104);
                font-weight: 500;
            }
            
            .metric-label {
                color: rgb(104,104,104);
                font-weight: 500;
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
        '다분야 전산관리 경험': {
            title: '다분야 전산관리 경험',
            category: '전산유지보수',
            image: 'assets/images/core/computer_service.png',
            description: '컴퓨터 조립과 수리를 시작으로 IT 업계에 첫발을 내디뎠습니다. 소기업 수리센터부터 교육업체, 부동산업계, 중견 여행사 고객센터, 상장 보안장비 제조사까지 다양한 업종과 규모의 전산관리를 경험하며, 업종별로 다른 IT 환경에 맞는 유지보수 역량을 쌓았습니다. 심야 서버 모니터링과 ERP 전산 운영 업무까지 수행하며 인프라 전반에 걸친 실무 경험을 갖추었습니다.',
            achievements: [
                '다양한 산업군 경험: 교육·부동산·여행·보안장비 제조 등 각기 다른 산업 환경의 IT 인프라 운영 및 유지보수',
                '여행사 고객센터 전산관리: 중견 여행사의 고객센터 전산 시스템 관리 및 안정적 운영 지원',
                '보안장비 제조사 전산관리: 상장 CCTV 제조 중견기업의 전산유지보수 담당',
                '서버 모니터링: 심야 서버 데이터 집계, 서버 자동리셋 관리, 일 매출현황 집계, 보안 모니터링 및 보고',
                'ERP 전산 운영: ERP R6, SAP 시스템 전산 모니터링 및 운영 지원',
                '시스템 안정화: 각 기업 환경에 맞는 유지보수 체계를 구축하여 시스템 장애 최소화',
                'OA 유지보수: 복합기, 프린터, 팩스 등 사무기기 설치·점검·장애 처리까지 통합 관리',
                '문제 해결 능력: 하드웨어, 소프트웨어, 네트워크를 아우르는 종합적인 트러블슈팅 역량'
            ],
            technologies: ['PC 유지보수', '서버 관리/모니터링', '네트워크 설정', 'ERP (R6/SAP)', 'OA 사무기기', '보안 솔루션'],
            duration: '2001-2007',
            scale: '소기업, 중견기업, 대기업',
            role: '전산 관리자'
        },
        '교육청 전산유지보수': {
            title: '교육청 전산유지보수',
            category: '전산유지보수',
            image: 'assets/images/core/Education_Sales.png',
            description: '소규모 회사에서 교육지원청 전산유지보수 수의계약 수주에 성공한 실적입니다. 교육지원청 산하 학교 및 기관의 전산장비와 OA 사무기기 통합 관리, 하드웨어 장애 대응 및 예방 정비, 네트워크 인프라 안정성 확보, 컴퓨터 및 전산소모품 공급을 담당했습니다.',
            achievements: [
                '인프라 통합 관리: 전산장비 및 OA 사무기기 통합 운영, PC·서버·네트워크 장비 유지보수를 통한 시스템 장애 최소화',
                '사업 영역 확장: 전산소모품 공급 영업 확장, 보안솔루션 도입으로 종합 IT 솔루션 파트너로 전환',
                '계약 신뢰 확보: 유지보수 기간 내 안정적인 서비스 제공으로 고객 신뢰도 확보 및 재계약 달성'
            ],
            technologies: ['네트워크 관리', 'PC 유지보수', '보안시스템', '원격관리', 'OA 장비 관리'],
            duration: '유지보수 2년',
            scale: '교육지원청 산하 기관',
            role: '유지보수 및 소싱 관리'
        },
        '금융(보험업) 전산관리': {
            title: '금융(보험업) 전산관리',
            category: '전산유지보수',
            image: 'assets/images/core/finance_it.png',
            description: '대기업 생명보험사 12개 영업지점의 전산유지보수를 담당한 경험입니다. 금융업 특성상 보안이 최우선이었으며, 각 지점의 전산 시스템이 원활하게 운영될 수 있도록 장애를 최소화하고 안정적인 IT 환경을 구축·유지하는 데 주력했습니다.',
            achievements: [
                '다지점 전산관리: 12개 영업지점의 PC, 네트워크, 주변기기 등 전산장비 통합 유지보수',
                '보안 체계 준수: 금융업 보안 기준에 맞는 시스템 점검, 보안 솔루션 관리 및 정책 준수',
                '시스템 안정화: 지점별 전산 환경 최적화를 통한 시스템 장애 최소화',
                '장애 대응: 장애 발생 시 신속한 현장 출동 및 원인 분석, 복구를 통한 업무 공백 최소화'
            ],
            technologies: ['PC 유지보수', '네트워크 관리', '보안 솔루션', 'OA 사무기기', '장애 대응'],
            duration: '유지보수 2년',
            scale: '12개 영업지점',
            role: '지점 전산유지보수 관리'
        },
        '스마트미러 OEM 개발': {
            title: '스마트미러 OEM 개발',
            category: '기술영업',
            image: 'assets/images/core/Smart_Mirror.png',
            description: '기존 스마트미러 제품을 미용실 특화 솔루션으로 완전히 재탄생시킨 혁신적인 OEM 개발 프로젝트입니다. 기존 하드웨어 플랫폼 기반 UI/UX 완전 재설계, 미용실 특화 기능 개발 및 사용자 경험 최적화, 터치 인터페이스 기반 직관적 조작 시스템 구현, B2B 판매 채널 구축 및 전국 대리점 네트워크 확장 전략을 수립했습니다.',
            achievements: [
                '미용실 특화 UI/UX 완전 재설계: 기존 범용 제품을 미용실 맞춤형으로 사용성 개선',
                '5가지 핵심 기능 모듈 개발 완료: 미러 터치방식 조작 시스템, TV 시청, 두피체크 및 관리, 헤어스타일 시뮬레이션'
            ],
            technologies: ['UI/UX 디자인', 'IoT 기술', '터치스크린', '안드로이드', '클라우드 연동'],
            duration: '1년',
            scale: '4차산업 스마트미러',
            role: '개발 기획 및 영업 총괄',
            durationLabel: '프로젝트 기간',
            scaleLabel: '프로젝트명'
        },
        '대학병원 전산유지보수': {
            title: '대학병원 전산유지보수',
            category: '전산유지보수',
            image: 'assets/images/core/Hospital_Computer.png',
            description: '대학병원 전체 IT 인프라의 전산유지보수를 담당했습니다. 의료 현장은 시스템이 잠시라도 멈추면 안 되는 환경이기 때문에, 시스템 장애 및 하드웨어 장애를 최소화하고 원활한 전산 환경을 유지하는 데 주력했습니다.',
            achievements: [
                '병원 전체 IT 인프라 유지보수 관리',
                '시스템 장애 및 하드웨어 장애 최소화',
                '각종 의료장비 네트워크 연동 및 점검',
                '보안 강화 및 개인정보 보호 체계 준수'
            ],
            technologies: ['네트워크 관리', '서버 관리', '의료장비 연동', '보안시스템', 'PC 유지보수'],
            duration: '유지보수 1년',
            scale: '대학병원 전체',
            role: '전산유지보수 관리'
        },
        '카드발급기 기술영업': {
            title: '카드발급기 기술영업',
            category: '기술영업',
            image: 'assets/images/core/card_print.png',
            description: '카드발급기 제조사에서 전국 다수 기관을 대상으로 카드발급기 기술영업을 담당했습니다. 각 업종별 특성에 맞는 맞춤형 솔루션을 제안하고, 설치부터 유지보수까지 원스톱 서비스를 제공했습니다.',
            achievements: [
                '의료기관 진료카드 시스템: 국내 상급 대학병원 환자 진료카드 발급기 영업 및 납품',
                '금융권 카드발급 시스템: 1금융, 2금융 은행권 카드발급기 영업 및 납품',
                '호텔/리조트 회원권 시스템: 국내 리조트, 팬션, 호텔 회원권 카드 발급기 납품',
                '교육기관 학생증 시스템: 국내 중·고등학교 학생증 카드 발급기 납품',
                '이벤트/행사 카드 시스템: 이벤트, 행사 업체 카드발급기 납품 및 렌탈 서비스'
            ],
            technologies: ['카드발급기 하드웨어', '카드 인코딩 시스템', '데이터베이스 연동', '보안 인증', '원격 모니터링'],
            duration: '3년',
            scale: '카드발급기 납품',
            role: '기술영업',
            durationLabel: '영업기간',
            scaleLabel: '영업부'
        }
    };

    const creationData = typeof getCreationData === 'function' ? getCreationData() : {};
    const allData = { ...salesData, ...creationData };
    const data = allData[title];

    return data || {
        title: title,
        category: category,
        image: 'https://via.placeholder.com/900x300/666/ffffff?text=정보+준비+중',
        description: '프로젝트 상세 정보를 불러오는 중입니다.',
        achievements: ['프로젝트 정보 준비 중'],
        technologies: ['정보 없음'],
        duration: '-',
        scale: '-',
        role: '-'
    };
}

// Load sales data from external source (completely rewritten)
async function loadSalesData() {
    // 외부 JSON 파일 로드는 현재 비활성화됨 (404 오류 방지)
    console.log('내장된 판매 데이터를 사용합니다 (정상)');
    
    // 필요시 나중에 활성화할 수 있는 코드 (주석 처리됨)
    /*
    try {
        const jsonFilePath = 'data/sales-data.json';
        const response = await fetch(jsonFilePath);
        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData && jsonData.projects) {
                updateSalesItems(jsonData.projects);
                console.log('외부 판매 데이터 로드 성공');
                return;
            }
        }
    } catch (fetchError) {
        console.log('외부 데이터 로드 실패, 기본 데이터 사용');
    }
    */
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
