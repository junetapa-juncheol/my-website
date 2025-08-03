# SEO 최적화 및 접근성 가이드라인

## 🎨 색상 접근성 (WCAG 2.1 기준)

### 대비비 요구사항

#### AA 등급 (최소 4.5:1) - 일반 텍스트
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

#### AAA 등급 (최소 7:1) - 중요한 텍스트
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

### 색맹 고려사항

#### 색상에 의존하지 않는 정보 전달
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

#### 색맹 친화적 색상 조합
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

## 🔍 SEO 색상 최적화

### 메타 태그 색상 정보
```html
<!-- 테마 색상 정의 -->
<meta name="theme-color" content="#7B68EE">
<meta name="msapplication-TileColor" content="#7B68EE">

<!-- Apple 기기용 -->
<meta name="apple-mobile-web-app-status-bar-style" content="default">

<!-- 매니페스트 파일 -->
<link rel="manifest" href="/manifest.json">
```

### 구조화된 데이터에서 색상 활용
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
    "url": "https://example.com/brand-image.jpg",
    "description": "블루-퍼플 브랜드 이미지"
  }
}
```

## 📱 반응형 색상 최적화

### 다크모드 지원
```css
/* 시스템 다크모드 감지 */
@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: #9b87f5;      /* 밝은 퍼플 */
        --secondary-color: #8b7cf6;    /* 밝은 블루 */
        --text-primary: #e2e8f0;       /* 밝은 텍스트 */
        --bg-primary: #1a1a2e;         /* 다크 배경 */
    }
}

/* 사용자 선택 다크모드 */
[data-theme="dark"] {
    --primary-color: #9b87f5;
    --text-primary: #e2e8f0;
    --bg-primary: #1a1a2e;
}
```

### 고대비 모드 지원
```css
@media (prefers-contrast: high) {
    :root {
        --primary-color: #000080;      /* 진한 네이비 */
        --text-primary: #000000;       /* 순흑색 */
        --bg-primary: #ffffff;         /* 순백색 */
        --border-color: #000000;       /* 진한 테두리 */
    }
    
    .card {
        border: 2px solid var(--border-color);
        box-shadow: none;
    }
}
```

## ⚡ 성능 최적화

### CSS 색상 최적화
```css
/* ✅ 효율적인 색상 코드 */
.element {
    color: #7B68EE;                   /* 짧은 hex 코드 사용 */
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

## 📊 색상 테스트 도구

### 자동 테스트 체크리스트
- [ ] **대비비 검사**: WebAIM Contrast Checker
- [ ] **색맹 시뮬레이션**: Stark, Colour Contrast Analyser
- [ ] **다크모드 테스트**: 브라우저 개발자 도구
- [ ] **고대비 모드**: Windows 고대비 설정
- [ ] **모바일 가독성**: 실제 기기 테스트

### Lighthouse 성능 지표
```javascript
// Core Web Vitals 색상 관련 최적화
const colorOptimizations = {
    'avoid-excessive-gradients': true,
    'use-system-colors': true,
    'optimize-css-delivery': true,
    'minify-css': true
};
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

## 📈 모니터링 및 개선

### 정기 검토 항목
1. **월간 접근성 감사**
2. **색상 대비비 자동 테스트**
3. **사용자 피드백 수집**
4. **성능 지표 모니터링**
5. **브랜드 일관성 점검**

### 개선 지표
- 접근성 점수 95% 이상 유지
- 페이지 로딩 속도 3초 이내
- 모바일 가독성 점수 90% 이상
- 사용자 만족도 조사 정기 실시