# 🔍 SEO 최적화 및 접근성 가이드라인

> WCAG 2.1 준수 및 검색엔진 최적화를 통한 포용적 웹 경험 구축

## ♿ 웹 접근성 (WCAG 2.1 기준)

### 🎨 색상 접근성

#### 대비비 요구사항

**AA 등급 (최소 4.5:1) - 일반 텍스트**
```css
/* 권장 조합 */
.text-primary {
    color: #333333;          /* 대비비: 12.6:1 */
    background: #ffffff;
}

.text-on-primary {
    color: #ffffff;          /* 대비비: 5.8:1 */
    background: #7B68EE;
}

.text-on-dark {
    color: #e2e8f0;         /* 대비비: 8.2:1 */
    background: #1a1a2e;
}
```

**AAA 등급 (최소 7:1) - 중요한 텍스트**
```css
/* 핵심 콘텐츠용 */
.important-text {
    color: #2c2c2c;         /* 대비비: 15.3:1 */
    background: #ffffff;
}

.critical-info {
    color: #ffffff;         /* 대비비: 8.1:1 */
    background: #4A4A4A;
}
```

#### 색맹 고려사항

**색상에 의존하지 않는 정보 전달**
```css
/* ❌ 잘못된 예: 색상에만 의존 */
.success { color: #7B68EE; }
.error { color: #e74c3c; }

/* ✅ 올바른 예: 색상 + 아이콘/패턴 */
.success {
    color: #7B68EE;
    font-weight: bold;
    position: relative;
}
.success::before {
    content: "✓ ";
    font-weight: bold;
}

.error {
    color: #e74c3c;
    text-decoration: underline;
    position: relative;
}
.error::before {
    content: "⚠ ";
    font-weight: bold;
}
```

**색맹 친화적 색상 조합**
```css
/* 적록색맹을 위한 블루-퍼플 사용 */
.primary-action {
    background: linear-gradient(135deg, #7B68EE, #4A90E2);  /* 블루 계열 */
}

.secondary-action {
    background: linear-gradient(135deg, #667eea, #764ba2);  /* 퍼플 계열 */
}

.warning {
    background: linear-gradient(135deg, #f093fb, #f5576c);  /* 핑크 계열 */
}
```

### 🔧 접근성 HTML 구조

#### Semantic HTML
```html
<!-- ✅ 올바른 구조 -->
<header role="banner">
    <nav role="navigation" aria-label="메인 네비게이션">
        <ul>
            <li><a href="#home" aria-current="page">홈</a></li>
            <li><a href="#about">소개</a></li>
        </ul>
    </nav>
</header>

<main role="main">
    <section aria-labelledby="tech-stack-title">
        <h2 id="tech-stack-title">기술 스택</h2>
        <!-- 콘텐츠 -->
    </section>
</main>

<footer role="contentinfo">
    <!-- 푸터 내용 -->
</footer>
```

#### ARIA 레이블 및 속성
```html
<!-- 폼 접근성 -->
<form role="form" aria-label="연락처 문의 폼">
    <div class="form-group">
        <label for="name">이름 (필수)</label>
        <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            aria-describedby="name-help"
            autocomplete="name">
        <div id="name-help" class="sr-only">성명을 입력해주세요.</div>
    </div>
</form>

<!-- 버튼 접근성 -->
<button aria-label="메뉴 열기" aria-expanded="false">
    <span class="hamburger-icon"></span>
</button>

<!-- 이미지 접근성 -->
<img 
    src="profile.jpg" 
    alt="박준철의 프로필 사진 - IT 전문가로서 25년 경력" 
    role="img">
```

### ⌨️ 키보드 네비게이션

#### 포커스 관리
```css
/* 포커스 표시자 */
.nav-link:focus,
.btn:focus,
.form-control:focus {
    outline: 2px solid #7B68EE;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(123, 104, 238, 0.3);
}

/* 포커스 건너뛰기 링크 */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #7B68EE;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
}

.skip-link:focus {
    top: 6px;
}
```

#### 탭 순서 관리
```html
<!-- 논리적 탭 순서 -->
<nav>
    <a href="#main" class="skip-link">본문으로 건너뛰기</a>
    <ul>
        <li><a href="#home" tabindex="1">홈</a></li>
        <li><a href="#about" tabindex="2">소개</a></li>
        <li><a href="#contact" tabindex="3">연락처</a></li>
    </ul>
</nav>

<!-- 모달 포커스 트랩 -->
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">연락처 정보</h2>
    <!-- 모달 내용 -->
    <button class="modal-close" aria-label="모달 닫기">×</button>
</div>
```

## 🔍 SEO 최적화

### 📋 메타 태그 최적화

#### 기본 SEO 메타 태그
```html
<!-- 기본 메타 정보 -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="박준철(Junetapa) - 25년+ IT 전문가의 업적과 창작 활동">
<meta name="keywords" content="IT 전문가, 전산유지보수, B2B 기술영업, 박준철, Junetapa">
<meta name="author" content="박준철 (Junetapa)">

<!-- 테마 색상 정의 -->
<meta name="theme-color" content="#7B68EE">
<meta name="msapplication-TileColor" content="#7B68EE">

<!-- Apple 기기용 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Junetapa IT Story">

<!-- 캐노니컬 URL -->
<link rel="canonical" href="https://junetapa-story.com/">
```

#### Open Graph (소셜 미디어)
```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="박준철 (Junetapa) - IT Story">
<meta property="og:description" content="기술과 창작이 만나는 특별한 여정">
<meta property="og:image" content="https://junetapa-story.com/assets/images/og-image.jpg">
<meta property="og:url" content="https://junetapa-story.com/">
<meta property="og:site_name" content="Junetapa IT Story">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="박준철 (Junetapa) - IT Story">
<meta name="twitter:description" content="기술과 창작이 만나는 특별한 여정">
<meta name="twitter:image" content="https://junetapa-story.com/assets/images/twitter-card.jpg">
```

### 🏗️ 구조화된 데이터

#### Schema.org 마크업
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "박준철",
  "alternateName": "Junetapa",
  "description": "25년+ 경력의 IT 전문가",
  "url": "https://junetapa-story.com",
  "image": "https://junetapa-story.com/assets/images/profile.jpg",
  "sameAs": [
    "https://blog.naver.com/jun22sky",
    "https://www.instagram.com/junetapa/",
    "https://www.tiktok.com/@junetapa0",
    "https://youtube.com/channel/UCKHGfXZJ2Ix-qlfvHNqFGdg"
  ],
  "jobTitle": "IT 전문가",
  "worksFor": {
    "@type": "Organization",
    "name": "프리랜서"
  },
  "knowsAbout": [
    "IT 인프라 관리",
    "B2B 기술영업",
    "전산유지보수",
    "디지털 마케팅"
  ]
}
```

#### 조직 정보
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Junetapa IT Story",
  "brand": {
    "@type": "Brand",
    "name": "Junetapa",
    "color": "#7B68EE"
  },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://junetapa-story.com/assets/images/brand-image.jpg",
    "description": "블루-퍼플 브랜드 이미지"
  }
}
```

### 📱 모바일 최적화

#### 반응형 디자인
```css
/* 모바일 퍼스트 */
@media (max-width: 768px) {
    /* 터치 친화적 버튼 크기 */
    .btn {
        min-height: 44px;
        min-width: 44px;
    }
    
    /* 가독성 향상 */
    body {
        font-size: 16px; /* 줌 방지 */
        line-height: 1.6;
    }
}

/* 고해상도 디스플레이 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .logo {
        background-image: url('logo@2x.png');
        background-size: 100px 50px;
    }
}
```

#### 성능 최적화
```html
<!-- 중요 리소스 프리로드 -->
<link rel="preload" href="fonts/NotoSansKR.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="css/critical.css" as="style">

<!-- 이미지 최적화 -->
<img 
    src="profile-small.jpg" 
    srcset="profile-small.jpg 480w, profile-medium.jpg 768w, profile-large.jpg 1024w"
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
    alt="박준철 프로필"
    loading="lazy">

<!-- WebP 지원 -->
<picture>
    <source srcset="hero.webp" type="image/webp">
    <source srcset="hero.jpg" type="image/jpeg">
    <img src="hero.jpg" alt="Hero 이미지">
</picture>
```

## 🌙 다크모드 및 사용자 설정

### 시스템 설정 감지
```css
/* 다크모드 지원 */
@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: #9b87f5;
        --secondary-color: #8b7cf6;
        --text-primary: #e2e8f0;
        --bg-primary: #1a1a2e;
    }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
    :root {
        --primary-color: #000080;
        --text-primary: #000000;
        --bg-primary: #ffffff;
        --border-color: #000000;
    }
    
    .card {
        border: 2px solid var(--border-color);
        box-shadow: none;
    }
}

/* 애니메이션 감소 설정 */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

### 사용자 선택 테마
```css
/* 수동 다크모드 */
[data-theme="dark"] {
    --primary-color: #9b87f5;
    --text-primary: #e2e8f0;
    --bg-primary: #1a1a2e;
}

[data-theme="light"] {
    --primary-color: #7B68EE;
    --text-primary: #333333;
    --bg-primary: #ffffff;
}
```

## ⚡ 성능 최적화

### CSS 최적화
```css
/* ✅ 효율적인 색상 코드 */
.element {
    color: #7B68EE;                   /* 짧은 hex 코드 */
    background: rgb(123, 104, 238);   /* RGB 필요시에만 */
}

/* ❌ 비효율적인 색상 코드 */
.element {
    color: rgba(123, 104, 238, 1.0);  /* 불필요한 alpha */
    background: hsl(252, 75%, 67%);    /* 복잡한 HSL */
}
```

### 그라데이션 최적화
```css
/* ✅ 최적화된 그라데이션 */
.gradient-optimized {
    background: linear-gradient(135deg, #7B68EE 0%, #4A90E2 100%);
    will-change: transform;  /* 애니메이션 시에만 */
}

/* ❌ 과도한 그라데이션 */
.gradient-heavy {
    background: linear-gradient(
        135deg, 
        #7B68EE 0%, 
        #6A5ACD 25%, 
        #4A90E2 50%, 
        #667eea 75%, 
        #764ba2 100%
    );
}
```

## 🎯 브랜드 일관성

### 색상 변수 시스템
```css
:root {
    /* Primary Brand Colors */
    --brand-primary: #7B68EE;
    --brand-secondary: #4A90E2;
    --brand-accent: #667eea;
    
    /* Semantic Colors */
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: var(--brand-primary);
    
    /* Neutral Colors */
    --neutral-50: #f8fafc;
    --neutral-100: #f1f5f9;
    --neutral-900: #0f172a;
}
```

### 브랜드 가이드라인 준수
```css
/* 로고 및 브랜드 요소 */
.logo {
    color: var(--brand-primary);
    filter: drop-shadow(0 2px 4px rgba(123, 104, 238, 0.2));
}

/* 주요 CTA 버튼 */
.cta-primary {
    background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
    box-shadow: 0 4px 15px rgba(123, 104, 238, 0.3);
}

/* 보조 버튼 */
.cta-secondary {
    border: 2px solid var(--brand-primary);
    color: var(--brand-primary);
    background: transparent;
}
```

## 📊 색상 테스트 및 모니터링

### 자동 테스트 체크리스트
- [ ] **대비비 검사**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] **색맹 시뮬레이션**: Stark, Colour Contrast Analyser
- [ ] **다크모드 테스트**: 브라우저 개발자 도구
- [ ] **고대비 모드**: Windows 고대비 설정
- [ ] **모바일 가독성**: 실제 기기 테스트

### Core Web Vitals
```javascript
// 성능 모니터링
const colorOptimizations = {
    'avoid-excessive-gradients': true,
    'use-system-colors': true,
    'optimize-css-delivery': true,
    'minify-css': true
};

// Lighthouse 감사 항목
const auditChecklist = [
    'color-contrast',
    'meta-viewport',
    'document-title',
    'html-has-lang',
    'image-alt',
    'button-name',
    'link-name'
];
```

## 🌐 국제화 고려사항

### 문화별 색상 의미
- **블루**: 신뢰성, 전문성 (글로벌 긍정적)
- **퍼플**: 창의성, 혁신 (서구 긍정적)
- **조합**: IT/기술 분야에 적합한 색상 조합

### 다국어 지원
```css
/* 아랍어/히브리어 등 RTL 언어 */
[dir="rtl"] .gradient-element {
    background: linear-gradient(-45deg, #7B68EE 0%, #4A90E2 100%);
}

/* 중국어/일본어 등 동아시아 언어 */
.cjk-text {
    color: var(--brand-primary);
    font-weight: 500;  /* 한글/한자에 적합한 굵기 */
}
```

## ⚠️ 주의사항 및 금지사항

### 접근성 위반 사례
```css
/* ❌ 금지: 낮은 대비비 */
.bad-contrast {
    color: #b847ff;      /* 대비비: 2.1:1 */
    background: #667eea;
}

/* ❌ 금지: 색상에만 의존한 정보 */
.status-error { color: red; }
.status-success { color: green; }

/* ❌ 금지: 깜빡이는 색상 */
.flashing {
    animation: flash 0.5s infinite;
}
```

### SEO 악영향 요소
- 🚫 과도한 그라데이션으로 인한 로딩 지연
- 🚫 색상 정보 누락 (메타 태그)
- 🚫 다크모드 미지원
- 🚫 모바일 환경에서의 가독성 저하

## 📈 정기 검토 및 개선

### 월간 검토 항목
1. **접근성 감사** - WAVE, axe 도구 사용
2. **색상 대비비 자동 테스트**
3. **모바일 사용성 테스트**
4. **페이지 속도 측정** - Lighthouse
5. **SEO 순위 모니터링**

### 분기별 검토 항목
1. **사용자 피드백 수집**
2. **브랜드 일관성 점검**
3. **경쟁사 분석**
4. **기술 트렌드 반영**
5. **가이드라인 업데이트**

### 목표 지표
- **접근성 점수**: 95% 이상 유지
- **페이지 로딩 속도**: 3초 이내
- **모바일 가독성 점수**: 90% 이상
- **SEO 점수**: 90점 이상
- **사용자 만족도**: 4.5/5.0 이상

---

> **Last Updated**: 2025-01-03 | **Version**: 1.0