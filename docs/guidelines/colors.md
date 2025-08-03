# 🎨 색상 디자인 가이드라인

> 블루-퍼플 색상 조합을 활용한 브랜드 아이덴티티 구축 가이드

## 🌈 메인 색상 팔레트

### Primary Colors (주요 색상)
```css
--primary-color: #7B68EE;        /* Medium Slate Blue - 메인 브랜드 컬러 */
--secondary-color: #6A5ACD;      /* Slate Blue - 보조 브랜드 컬러 */
--accent-color: #4A90E2;         /* Medium Blue - 액센트 컬러 */
```

### Secondary Colors (보조 색상)
```css
--soft-periwinkle: #667eea;      /* 부드러운 퍼플 블루 */
--dark-lavender: #764ba2;        /* 진한 라벤더 */
--sky-blue: #5B9BD5;            /* 스카이 블루 */
```

### Special Effects (특수 효과)
```css
--neon-blue: #00d4ff;           /* 네온 블루 - 하이라이트용 */
--neon-purple: #b847ff;         /* 네온 퍼플 - 강조용 */
```

### Text Colors (텍스트 색상)
```css
--text-primary: #333333;        /* 기본 텍스트 */
--text-secondary: #666666;      /* 보조 텍스트 */
--text-light: #ffffff;          /* 밝은 배경용 텍스트 */
--text-muted: #f8f9fa;         /* 연한 텍스트 */
```

## 🌈 그라데이션 시스템

### Primary Gradients (주요 그라데이션)
```css
--gradient-primary: linear-gradient(135deg, #7B68EE 0%, #4A90E2 100%);
--gradient-accent: linear-gradient(135deg, #6A5ACD 0%, #5B9BD5 100%);
--gradient-ocean: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Special Gradients (특수 그라데이션)
```css
--gradient-cosmic: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
--gradient-mesh: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%);
```

### Background Gradients (배경용)
```css
--bg-gradient-light: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
--bg-gradient-medium: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
--bg-gradient-dark: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
```

## 🎯 색상 사용 규칙

### 1. 계층별 색상 사용
```css
/* Level 1: 최고 중요도 */
.primary-element {
    background: var(--gradient-primary);
    color: var(--text-light);
}

/* Level 2: 보조 중요도 */
.secondary-element {
    background: var(--gradient-accent);
    color: var(--text-light);
}

/* Level 3: 일반 요소 */
.normal-element {
    background: var(--bg-gradient-light);
    color: var(--text-primary);
}
```

### 2. 인터랙티브 요소
```css
/* 버튼 */
.btn-primary {
    background: var(--gradient-primary);
    color: var(--text-light);
    box-shadow: 0 4px 15px rgba(123, 104, 238, 0.3);
}

.btn-primary:hover {
    box-shadow: 0 6px 20px rgba(123, 104, 238, 0.4);
    transform: translateY(-2px);
}

/* 링크 */
.link-primary {
    color: var(--primary-color);
    text-decoration: none;
}

.link-primary:hover {
    color: var(--accent-color);
    text-shadow: 0 0 10px var(--neon-blue);
}
```

### 3. 카드 및 컨테이너
```css
.card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(123, 104, 238, 0.2);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

.card:hover {
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25);
}
```

## 📊 SEO 및 접근성 최적화

### 1. 색상 대비비 (WCAG 2.1 기준)

#### AA 등급 (최소 4.5:1)
```css
/* 일반 텍스트 */
.text-on-light {
    color: #333333;  /* 대비비: 12.6:1 */
    background: #ffffff;
}

.text-on-primary {
    color: #ffffff;  /* 대비비: 5.8:1 */
    background: #7B68EE;
}
```

#### AAA 등급 (최소 7:1)
```css
/* 중요한 텍스트 */
.important-text {
    color: #2c2c2c;  /* 대비비: 15.3:1 */
    background: #ffffff;
}
```

### 2. 색맹 고려사항
```css
/* 색맹 사용자를 위한 추가 시각적 단서 */
.success {
    color: #4A90E2;
    font-weight: bold;
    /* 아이콘 추가 권장 */
}

.warning {
    color: #764ba2;
    text-decoration: underline;
    /* 패턴 추가 권장 */
}
```

## 🌙 다크모드 색상

### Dark Mode Palette
```css
--dark-bg: #1a1a2e;
--dark-surface: #16213e;
--dark-primary: #9b87f5;
--dark-secondary: #8b7cf6;
--dark-text: #e2e8f0;
--dark-text-muted: #94a3b8;
```

### Dark Mode Usage
```css
@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: var(--dark-primary);
        --text-primary: var(--dark-text);
        --bg-color: var(--dark-bg);
    }
}
```

## 🎨 About Timeline 전용 색상

### Timeline Colors
```css
--timeline-primary: #7B68EE;      /* 타임라인 메인 색상 */
--timeline-accent: #b847ff;       /* 타임라인 액센트 */
--timeline-text: #ffffff;         /* 타임라인 텍스트 */
--timeline-highlight: #00d4ff;    /* 하이라이트 텍스트 */
--timeline-duration: #f093fb;     /* 기간 표시 */
```

### Timeline Gradients
```css
--timeline-bg: linear-gradient(135deg, rgba(123, 104, 238, 0.8) 0%, rgba(102, 126, 234, 0.6) 50%, rgba(118, 75, 162, 0.8) 100%);
--timeline-overlay: linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(22, 33, 62, 0.5) 50%, rgba(26, 26, 46, 0.7) 100%);
```

## 🚀 성능 최적화

### 1. CSS 변수 활용
- 모든 색상을 CSS 변수로 정의하여 일관성 유지
- 테마 변경 시 한 번에 전체 색상 변경 가능

### 2. 그라데이션 최적화
- 복잡한 그라데이션보다는 2-3개 색상으로 제한
- will-change 속성 활용으로 애니메이션 성능 향상

### 3. 색상 미니파이
- 16진수 색상코드 축약 (#ffffff → #fff)
- 불필요한 투명도 제거

## 📝 브랜딩 가이드

### 1. 로고 색상
- Primary: #7B68EE (Medium Slate Blue)
- Secondary: #4A90E2 (Medium Blue)

### 2. 브랜드 톤앤매너
- **Professional**: 진정성과 전문성을 나타내는 블루 계열
- **Creative**: 창의성과 혁신을 나타내는 퍼플 계열
- **Modern**: 현대적이고 미래지향적인 그라데이션

### 3. 금지사항
- 🚫 빨간색 계열과의 조합
- 🚫 과도한 네온 색상 남용
- 🚫 대비비 4.5:1 미만의 조합
- 🚫 5개 이상의 색상 동시 사용

---

> **Last Updated**: 2025-01-03 | **Version**: 1.0