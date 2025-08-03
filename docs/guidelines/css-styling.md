# 💻 CSS 스타일링 가이드라인

> 일관된 스타일링과 최적화된 사용자 경험을 위한 CSS 코딩 표준

## 📐 타이포그래피 시스템

### 폰트 크기 시스템
| 요소 | 데스크톱 | 모바일 | 굵기 | 용도 |
|------|----------|--------|------|------|
| **Large Title** | `2.5rem` | `2rem` | `700` | 메인 섹션 제목 |
| **Medium Title** | `1.8rem` | `1.5rem` | `600` | 서브 섹션 제목 |
| **Regular Title** | `1.3rem` | `1.2rem` | `500` | 카드 제목 |
| **Body Text** | `1rem` | `1rem` | `400` | 본문 |
| **Small Text** | `0.9rem` | `0.9rem` | `400` | 캡션, 메타 정보 |

### 텍스트 색상 가이드
```css
/* 메인 제목 */
.main-title {
    color: #ffffff;
    font-weight: bold;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
}

/* 부제목 */
.subtitle {
    color: #f8f9fa;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

/* 강조 텍스트 */
.highlight-text {
    color: #b847ff;
    font-weight: 600;
}

/* 기간/숫자 강조 */
.duration-text {
    color: #f093fb;
    font-weight: bold;
}
```

## 🌅 배경 이미지 처리

### 배경 이미지 기본 설정
```css
.bg-image-container {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 300px;
    padding: 20px;
    position: relative;
}
```

### 오버레이 효과
```css
/* 그라데이션 오버레이 */
.gradient-overlay {
    background: linear-gradient(
        135deg, 
        rgba(0,0,0,0.7) 0%, 
        rgba(0,0,0,0.4) 50%, 
        rgba(0,0,0,0.7) 100%
    );
}

/* 단순 오버레이 */
.simple-overlay {
    background: rgba(0,0,0,0.6);
}

/* Timeline 전용 오버레이 */
.timeline-overlay {
    background: linear-gradient(
        135deg, 
        rgba(26, 26, 46, 0.7) 0%, 
        rgba(22, 33, 62, 0.5) 50%, 
        rgba(26, 26, 46, 0.7) 100%
    );
}
```

## 🎯 컴포넌트 스타일링

### 스킬 태그 스타일
```css
.skill-tag {
    background: rgba(123, 104, 238, 0.8);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.skill-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(123, 104, 238, 0.3);
}
```

### 카드 컴포넌트
```css
.card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(123, 104, 238, 0.2);
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
    padding: 20px;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25);
}
```

### 버튼 스타일
```css
.btn-primary {
    background: linear-gradient(135deg, #7B68EE, #4A90E2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(123, 104, 238, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(123, 104, 238, 0.4);
}

.btn-secondary {
    background: transparent;
    color: #7B68EE;
    border: 2px solid #7B68EE;
    padding: 10px 22px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: #7B68EE;
    color: white;
}
```

## 💡 텍스트 그림자 가이드

### 그림자 강도별 사용
```css
/* 강한 그림자 (제목용) */
.strong-shadow {
    text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
}

/* 중간 그림자 (부제목용) */
.medium-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

/* 약한 그림자 (본문용) */
.light-shadow {
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

/* 네온 효과 */
.neon-shadow {
    text-shadow: 
        0 0 10px #00d4ff,
        0 0 20px #00d4ff,
        0 0 40px #00d4ff;
}
```

## 📱 반응형 디자인

### 브레이크포인트 시스템
```css
/* 모바일 퍼스트 접근 */
/* Extra Small Mobile */
@media (max-width: 360px) {
    .container { padding: 0 10px; }
    .section-title { font-size: 1.6rem; }
}

/* iPhone 12 mini 전용 최적화 */
@media (max-width: 375px) and (min-width: 361px) {
    .container { padding: 0 12px; }
    .section-title { font-size: 1.7rem; }
    .card { padding: 15px; margin-bottom: 15px; }
}

/* Small Mobile */
@media (max-width: 480px) {
    .section-title { font-size: 1.8rem; }
    .card { padding: 15px; }
}

/* Mobile */
@media (max-width: 768px) {
    .section-title { font-size: 2rem; }
    .bg-image-container { min-height: 250px; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1023px) {
    .container { padding: 0 30px; }
}

/* Desktop */
@media (min-width: 1024px) {
    .container { max-width: 1200px; }
}

/* Large Desktop */
@media (min-width: 1400px) {
    .container { max-width: 1300px; }
}
```

### 🍎 iPhone 12 mini 특별 최적화

#### 디바이스 사양
- **화면 크기**: 375px × 812px
- **픽셀 밀도**: 476 PPI
- **Safe Area**: 노치 및 홈 인디케이터 대응 필요

#### 최적화 전략
```css
/* iPhone 12 mini 전용 스타일 */
@media (max-width: 375px) and (min-width: 361px) {
    /* 1. 컴팩트한 네비게이션 */
    .nav-container {
        padding: 0 12px;
        min-height: 65px;
    }
    
    /* 2. 히어로 섹션 최적화 */
    .hero-content .title-main {
        font-size: 2rem;
        line-height: 1.1;
        margin-bottom: 15px;
    }
    
    .hero-content .subtitle {
        font-size: 1rem;
        margin-bottom: 20px;
    }
    
    /* 3. Safe Area 지원 (노치 대응) */
    .hero {
        padding-top: env(safe-area-inset-top, 100px);
        padding-bottom: env(safe-area-inset-bottom, 40px);
        padding-left: env(safe-area-inset-left, 15px);
        padding-right: env(safe-area-inset-right, 15px);
    }
    
    /* 4. 터치 친화적 버튼 크기 */
    .btn {
        min-height: 44px;
        min-width: 44px;
        font-size: 0.9rem;
        padding: 12px 20px;
    }
    
    /* 5. 컴팩트한 카드 레이아웃 */
    .card {
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 12px;
    }
    
    /* 6. 성능 최적화 */
    .animations-reduced {
        animation-duration: 0.2s;
    }
    
    .particle-effect {
        display: none; /* 작은 화면에서 파티클 효과 비활성화 */
    }
    
    /* 7. 글씨 가독성 향상 */
    .text-content {
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    /* 8. 스킬 태그 최적화 */
    .skill-tag {
        font-size: 0.8rem;
        padding: 4px 10px;
        margin: 2px;
    }
    
    /* 9. 타임라인 컴팩트 뷰 */
    .timeline-item {
        padding: 12px;
        margin-bottom: 12px;
    }
    
    /* 10. 모달/팝업 최적화 */
    .modal-content {
        padding: 20px 15px;
        max-height: 70vh;
        overflow-y: auto;
    }
}
```

#### Safe Area 처리
```css
/* iOS Safe Area 지원 */
.safe-area-container {
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}

/* 노치가 있는 디바이스 대응 */
@supports (padding: max(0px)) {
    .header-fixed {
        padding-top: max(env(safe-area-inset-top), 20px);
    }
    
    .footer-fixed {
        padding-bottom: max(env(safe-area-inset-bottom), 20px);
    }
}
```

### 모바일 최적화
```css
/* 터치 친화적 버튼 크기 */
@media (max-width: 768px) {
    .btn {
        min-height: 44px; /* 터치 타겟 최소 크기 */
        min-width: 44px;
        padding: 12px 20px;
    }
    
    /* 터치 디바이스용 호버 효과 제거 */
    .card:hover {
        transform: none;
    }
    
    .card:active {
        transform: translateY(-3px);
    }
}
```

## 🔧 CSS 최적화 및 모범 사례

### CSS 변수 활용
```css
:root {
    /* 색상 시스템 */
    --primary-color: #7B68EE;
    --secondary-color: #6A5ACD;
    --accent-color: #4A90E2;
    
    /* 폰트 시스템 */
    --font-primary: 'Noto Sans KR', sans-serif;
    --font-secondary: 'Montserrat', sans-serif;
    
    /* 간격 시스템 */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    /* 애니메이션 */
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

### !important 사용 규칙
```css
/* ✅ 허용되는 경우: 특정 섹션의 오버라이드 */
#about .section-title {
    color: #ffffff !important; /* 화이트 텍스트 강제 적용 */
    -webkit-text-fill-color: #ffffff !important;
    background: none !important;
    /* 명확한 주석 필수 */
}

/* ❌ 지양해야 할 경우 */
.element {
    color: red !important; /* 이유 없는 !important 사용 */
}
```

### 성능 최적화
```css
/* GPU 가속 활용 */
.animated-element {
    will-change: transform; /* 애니메이션 시에만 */
    transform: translateZ(0); /* 하드웨어 가속 */
}

/* 애니메이션 완료 후 will-change 제거 */
.animation-complete {
    will-change: auto;
}

/* 효율적인 선택자 사용 */
/* ✅ 좋은 예 */
.card-title { }

/* ❌ 나쁜 예 */
div.container .card .header h3.title { }
```

## 🎨 배경 이미지 파일 가이드

### 권장 사양
- **해상도**: 최소 1920x1080px
- **형식**: JPG (용량 최적화), WebP (최신 브라우저)
- **용량**: 500KB 이하
- **비율**: 16:9 또는 4:3
- **최적화**: 압축률 80-85%

### 파일명 규칙
```
섹션명-bg.jpg         # 메인 배경
YYYY-YYYY-bg.jpg      # 타임라인 배경
카테고리-icon.png     # 아이콘
element-hover-bg.jpg  # 호버 상태 배경
```

### 반응형 이미지
```css
.responsive-bg {
    background-image: url('images/desktop-bg.jpg');
}

@media (max-width: 768px) {
    .responsive-bg {
        background-image: url('images/mobile-bg.jpg');
    }
}

/* WebP 지원 브라우저 */
.webp .responsive-bg {
    background-image: url('images/desktop-bg.webp');
}
```

## 🚨 히어로 섹션 개발 가이드라인 ✅ 검증됨

### 🎯 히어로 섹션 핵심 원칙

#### z-index 레이어 관리 (절대 준수)
```css
/* 올바른 레이어 순서 */
.hero-background     { z-index: -1 !important; }  /* 배경 비디오 */
#hero-video         { z-index: -2 !important; }  /* 비디오 요소 */
.hero-content       { z-index: 9999 !important; } /* 텍스트 콘텐츠 */
.hero-cta           { z-index: 10001 !important; }/* CTA 컨테이너 */
.cta-primary, .cta-secondary { z-index: 10000 !important; } /* 버튼들 */

/* 필수 포함 속성 */
position: relative !important;
pointer-events: auto !important;
```

#### 텍스트 가독성 보장
```css
/* 강력한 텍스트 효과 (필수) */
.hero-content {
    background: rgba(0, 0, 0, 0.7) !important; /* 진한 배경 */
    backdrop-filter: blur(25px) !important; /* 강한 블러 */
    border: 2px solid rgba(255, 255, 255, 0.5) !important;
}

.title-main, .title-sub, .hero-subtitle {
    color: #ffffff !important;
    text-shadow: 
        0 0 10px rgba(255, 255, 255, 0.8), /* 흰색 글로우 */
        0 0 20px rgba(255, 255, 255, 0.6), /* 확장 글로우 */
        2px 2px 8px rgba(0, 0, 0, 0.9); /* 강한 그림자 */
}
```

#### 클릭 가능성 보장
```css
/* CTA 버튼 필수 설정 */
.cta-primary, .cta-secondary {
    position: relative !important;
    z-index: 10000 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
}
```

### 🚫 히어로 섹션 금지사항

#### 절대 하지 말아야 할 것들
```css
/* ❌ 위험한 설정들 */
.hero-content { z-index: 1; } /* 너무 낮은 z-index */
.hero-background { z-index: 999; } /* 배경이 텍스트보다 앞으로 */
.cta-primary { pointer-events: none; } /* 클릭 비활성화 */
.hero-content { background: transparent; } /* 투명 배경 */
```

#### 문제가 발생했던 실제 사례
1. **배경 비디오가 텍스트를 가림** → z-index 음수 처리로 해결
2. **CTA 버튼 클릭 안됨** → z-index 최상위 + pointer-events 해결
3. **모바일에서 텍스트 안보임** → 강한 배경 + 글로우 효과로 해결
4. **텍스트가 흐려보임** → backdrop-filter 강화로 해결

### ✅ 히어로 섹션 수정 시 필수 체크리스트

#### 수정 전 체크사항
- [ ] 현재 z-index 순서 확인
- [ ] 텍스트 가독성 테스트 (다양한 배경에서)
- [ ] CTA 버튼 클릭 테스트
- [ ] 모바일 디바이스에서 확인

#### 수정 후 검증사항
- [ ] 배경 비디오가 텍스트 뒤에 있는지 확인
- [ ] 모든 텍스트가 선명하게 보이는지 확인
- [ ] CTA 버튼이 정상 클릭되는지 확인
- [ ] 데스크톱과 모바일 모두에서 테스트
- [ ] 다양한 브라우저에서 테스트

#### 안전한 수정 방법
1. **백업 생성**: 수정 전 현재 상태 저장
2. **단계별 적용**: 한 번에 하나씩 수정
3. **즉시 테스트**: 각 수정 후 바로 확인
4. **!important 활용**: 다른 CSS 간섭 방지

## ⚠️ 주의사항 및 금지사항

### 스타일링 주의사항
1. **텍스트 가독성** 최우선 고려
2. **그라데이션 배경** 사용 시 텍스트 색상 필수 확인
3. **-webkit-text-fill-color** 속성 사용 시 폴백 색상 제공
4. **브라우저 호환성** 테스트 필수
5. **성능 최적화**를 위한 이미지 압축 및 최적화

### 🚨 반응형 네비게이션 주의사항

#### 햄버거 메뉴 표시 원칙
```css
/* ❌ 잘못된 예: 데스크톱에서 완전 숨김 */
.hamburger {
    display: none; /* 모든 화면에서 숨김 - 위험! */
}

/* ✅ 올바른 예: 모든 화면에서 접근 가능 */
.hamburger {
    display: flex; /* 데스크톱에서도 기본 표시 - 권장! */
    flex-direction: column;
    cursor: pointer;
    /* 스타일 속성들... */
}

/* 모바일에서 메인 네비게이션 숨김 */
@media (max-width: 768px) {
    .nav-menu {
        display: none !important;
    }
    
    /* 햄버거 메뉴는 이미 display: flex로 표시됨 */
    .hamburger-menu {
        /* 모바일 전용 스타일 */
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        width: 100%;
        /* ... */
    }
}

/* 데스크톱에서 햄버거 메뉴 스타일 */
@media (min-width: 769px) {
    .hamburger-menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 20px;
        min-width: 220px;
        /* ... */
    }
}
```

#### ✅ 검증된 안전한 설정 (현재 적용 중)
```css
/* 기본 설정: 모든 화면에서 햄버거 메뉴 접근 가능 */
.hamburger {
    display: flex; /* ← 핵심: 완전 숨김 금지 */
}

/* 모바일: 메인 네비게이션 숨김, 햄버거만 사용 */
@media (max-width: 768px) {
    .nav-menu {
        display: none !important;
    }
}

/* 결과: 
 * - 데스크톱: 메인 네비게이션 + 햨버거 메뉴 (선택 가능)
 * - 모바일: 햄버거 메뉴만 (메인 네비게이션 숨김)
 */
```

#### 네비게이션 수정 시 필수 검증 사항
1. **데스크톱 접근성**: 모든 메뉴에 접근 가능한지 확인
2. **모바일 대체 수단**: 햄버거 메뉴가 정상 작동하는지 확인
3. **키보드 네비게이션**: Tab 순서가 논리적인지 확인
4. **스크린 리더**: ARIA 속성이 올바른지 확인

#### 반응형 네비게이션 테스트 체크리스트
- [ ] 320px (최소 모바일): 햄버거 메뉴 표시
- [ ] 768px (태블릿): 적절한 네비게이션 선택
- [ ] 1024px+ (데스크톱): 전체 메뉴 또는 호버 햄버거
- [ ] 키보드만으로 모든 메뉴 접근 가능
- [ ] 터치 디바이스에서 터치 타겟 44px 이상

### 금지사항
```css
/* ❌ 과도한 네스팅 */
.header .nav .menu .item .link { }

/* ❌ 불필요한 !important */
.text { color: blue !important; }

/* ❌ 인라인 스타일 */
<div style="color: red;">

/* ❌ 하드코딩된 색상 */
.element { color: #ff0000; } /* 변수 사용 권장 */

/* ❌ 과도한 애니메이션 */
.everything-animated {
    animation: spin 0.1s infinite;
}
```

### 브라우저 호환성
```css
/* 벤더 프리픽스 적용 */
.element {
    background: linear-gradient(135deg, #7B68EE, #4A90E2);
    background: -webkit-linear-gradient(135deg, #7B68EE, #4A90E2);
    background: -moz-linear-gradient(135deg, #7B68EE, #4A90E2);
}

/* 폴백 제공 */
.modern-feature {
    background: #7B68EE; /* 폴백 */
    background: linear-gradient(135deg, #7B68EE, #4A90E2); /* 모던 브라우저 */
}
```

## 📊 품질 검사 체크리스트

### 코드 품질
- [ ] CSS 변수 활용 여부
- [ ] 불필요한 !important 제거
- [ ] 브라우저 호환성 확인
- [ ] 성능 최적화 적용
- [ ] 반응형 디자인 구현

### 접근성
- [ ] 색상 대비비 4.5:1 이상
- [ ] 터치 타겟 44px 이상
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 호환성

### 성능
- [ ] 이미지 최적화 완료
- [ ] CSS 파일 압축
- [ ] 불필요한 코드 제거
- [ ] 애니메이션 성능 확인

---

> **Last Updated**: 2025-01-03 | **Version**: 1.0