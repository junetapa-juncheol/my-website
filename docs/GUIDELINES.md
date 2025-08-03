# 📚 개발 가이드라인 통합 문서

> **Junetapa IT Story** 웹사이트 개발 및 콘텐츠 관리를 위한 종합 가이드라인

## 🗂️ 목차

- [🎨 디자인 시스템](#-디자인-시스템)
- [💻 개발 가이드](#-개발-가이드)
- [🔍 SEO & 접근성](#-seo--접근성)
- [📁 콘텐츠 관리](#-콘텐츠-관리)
- [🛠️ 도구 및 참고자료](#️-도구-및-참고자료)

---

## 🎨 디자인 시스템

### 🌈 핵심 색상 팔레트

```css
/* 브랜드 주요 색상 */
--primary-color: #7B68EE;     /* Medium Slate Blue - 메인 브랜드 */
--secondary-color: #6A5ACD;   /* Slate Blue - 보조 브랜드 */
--accent-color: #4A90E2;      /* Medium Blue - 액센트 */

/* 네온 효과 */
--neon-blue: #00d4ff;         /* 하이라이트용 */
--neon-purple: #b847ff;       /* 강조용 */
```

### 📐 타이포그래피 시스템

| 요소 | 크기 | 굵기 | 용도 |
|------|------|------|------|
| **Large Title** | `2.5rem` | `700` | 메인 섹션 제목 |
| **Medium Title** | `1.8rem` | `600` | 서브 섹션 제목 |
| **Regular Title** | `1.3rem` | `500` | 카드 제목 |
| **Body Text** | `1rem` | `400` | 본문 |
| **Small Text** | `0.9rem` | `400` | 캡션, 메타 정보 |

### 🎯 그라데이션 시스템

```css
/* 주요 그라데이션 */
--gradient-primary: linear-gradient(135deg, #7B68EE 0%, #4A90E2 100%);
--gradient-cosmic: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

/* 배경용 그라데이션 */
--bg-gradient-light: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
```

---

## 💻 개발 가이드

### 🔧 CSS 작성 규칙

#### ✅ 권장사항
- CSS 변수 활용으로 일관성 유지
- 계층별 색상 사용 (Primary → Secondary → Normal)
- 반응형 고려사항 필수 포함
- 접근성 대비비 AA 등급 이상 (4.5:1)

#### ❌ 금지사항
- `!important` 남용 (특수한 경우에만)
- 5개 이상의 색상 동시 사용
- 대비비 4.5:1 미만의 조합
- 색상에만 의존한 정보 전달

### 🚨 히어로 섹션 주의사항 ✅ 검증됨

#### 핵심 z-index 설정 (절대 준수)
```css
.hero-background { z-index: -1 !important; }  /* 배경 */
.hero-content    { z-index: 9999 !important; } /* 콘텐츠 */
.hero-cta        { z-index: 10001 !important; }/* CTA */
```

#### 필수 원칙
- **레이어 순서 엄격 준수**: 배경(-1) < 콘텐츠(9999) < CTA(10000+)
- **클릭 가능성 보장**: `pointer-events: auto !important`
- **텍스트 가독성**: 강한 배경 + 글로우 효과 필수
- **!important 활용**: CSS 간섭 방지

### 🚨 반응형 네비게이션 주의사항 ✅ 검증됨

#### 안전한 햄버거 메뉴 설정 (현재 적용)
```css
.hamburger { display: flex; } /* ← 핵심: 완전 숨김 금지 */
```

#### 원칙
- **햄버거 메뉴 완전 숨김 금지**: `display: flex`로 모든 화면에서 접근 보장
- **데스크톱**: 메인 네비게이션 + 햄버거 메뉴 (선택 가능)
- **모바일**: 햄버거 메뉴만 (메인 네비게이션 숨김)
- **네비게이션 수정 후 필수 테스트**: 320px, 768px, 1024px+ 에서 검증

### 📱 반응형 기준점

```css
/* 모바일 퍼스트 접근 */
@media (max-width: 360px) { /* 극소형 모바일 */ }
@media (max-width: 375px) and (min-width: 361px) { /* iPhone 12 mini 전용 ⭐ */ }
@media (max-width: 768px) { /* 모바일 */ }
@media (min-width: 769px) and (max-width: 1023px) { /* 태블릿 */ }
@media (min-width: 1024px) { /* 데스크톱 */ }
```

### 🍎 iPhone 12 mini 특별 최적화 ⭐ NEW

#### 기술적 사양
- **화면 크기**: 375px × 812px
- **픽셀 밀도**: 476 PPI
- **Safe Area**: 노치 및 홈 인디케이터 대응

#### 주요 최적화 항목
- **컴팩트 레이아웃**: 공간 효율성 극대화
- **Safe Area 지원**: iOS env() 함수 활용
- **성능 최적화**: 파티클 효과 비활성화
- **터치 친화적**: 44px 최소 터치 타겟
- **가독성 향상**: 폰트 크기 및 간격 조정

### 🌅 배경 이미지 처리

```css
/* 표준 배경 설정 */
background-size: contain;
background-repeat: no-repeat;
background-position: center;
min-height: 300px;

/* 오버레이 효과 */
background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%);
```

---

## 🔍 SEO & 접근성

### ♿ WCAG 2.1 준수사항

#### 색상 대비비 요구사항
- **AA 등급**: 최소 4.5:1 (일반 텍스트)
- **AAA 등급**: 최소 7:1 (중요한 텍스트)

#### 색맹 고려사항
```css
/* ✅ 올바른 예: 색상 + 아이콘/패턴 */
.success {
    color: #7B68EE;
    font-weight: bold;
}
.success::before {
    content: "✓ ";
}
```

### 🎯 SEO 최적화

#### 메타 태그 색상 정보
```html
<meta name="theme-color" content="#7B68EE">
<meta name="msapplication-TileColor" content="#7B68EE">
```

#### 다크모드 지원
```css
@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: #9b87f5;
        --text-primary: #e2e8f0;
        --bg-primary: #1a1a2e;
    }
}
```

---

## 📁 콘텐츠 관리

### 📋 파일 명명 규칙

#### 통합 명명 규칙
```
YYYY-MM-DD_카테고리_자료유형.확장자
```

**예시:**
- `2018-03-15_프로젝트_완료보고서.pdf`
- `2020-06-20_교육_수료증.pdf`
- `2016-09-10_자격증_인증서.pdf`

### 📊 자료 분류 체계

#### 🎓 교육 관련 자료
- **수료증**: 교육 과정 완료 증명
- **자격증**: IT 관련 자격 인증서  
- **트레이닝**: 제조사 공인 교육 인증서

#### 💼 경험 관련 자료
- **프로젝트 보고서**: 완료 프로젝트 문서
- **추천서**: 고객사 추천 및 인증서
- **실적 증명서**: 영업/성과 지표 문서

#### 🎨 포트폴리오 자료
- **프로젝트 기획서**: 상세 기술 명세서
- **성과 분석**: KPI 달성 및 ROI 보고서
- **디자인 자료**: UI/UX 및 시각적 자료

### 🔒 보안 가이드라인

#### 개인정보 처리
- **개인정보 마스킹**: 민감정보 블러 처리 후 업로드
- **파일 크기 제한**: 
  - 교육 자료: 5MB 이하
  - 경험 자료: 10MB 이하  
  - 포트폴리오: 15MB 이하
- **형식 제한**: PDF 우선, PPT/DOC 허용

---

## 🛠️ 도구 및 참고자료

### 🎨 색상 관련 도구
- **대비비 검사**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **색맹 시뮬레이션**: Stark, Colour Contrast Analyser
- **색상 팔레트**: Adobe Color, Coolors.co

### 📊 성능 측정 도구
- **Lighthouse**: 웹 성능 및 접근성 감사
- **Core Web Vitals**: 사용자 경험 지표
- **A11y Project**: 접근성 체크리스트

### 🔍 SEO 도구
- **Google Search Console**: 검색 성능 모니터링
- **Schema.org**: 구조화된 데이터 마크업
- **Open Graph**: 소셜 미디어 최적화

---

## 📈 품질 관리

### ✅ 정기 검토 체크리스트

#### 월간 점검 항목
- [ ] 색상 대비비 자동 테스트
- [ ] 모바일 반응형 테스트
- [ ] 다크모드 호환성 확인
- [ ] 페이지 로딩 속도 측정
- [ ] 접근성 점수 확인 (95% 이상)

#### 분기별 점검 항목  
- [ ] 브랜드 가이드라인 일관성 점검
- [ ] 사용자 피드백 수집 및 분석
- [ ] SEO 성능 지표 모니터링
- [ ] 콘텐츠 자료 정리 및 업데이트

### 🎯 목표 지표
- **접근성 점수**: 95% 이상 유지
- **페이지 로딩 속도**: 3초 이내
- **모바일 가독성**: 90% 이상
- **SEO 점수**: 90점 이상

---

## 📚 상세 가이드라인

더 자세한 내용은 아래 개별 가이드라인 문서를 참조하세요:

- 🎨 **[색상 디자인 가이드](./guidelines/colors.md)** - 상세 색상 팔레트 및 브랜딩 규칙
- 💻 **[CSS 스타일링 가이드](./guidelines/css-styling.md)** - 코딩 표준 및 모범 사례  
- 🔍 **[SEO & 접근성 가이드](./guidelines/seo-accessibility.md)** - 최적화 및 접근성 준수 방법
- 📁 **[콘텐츠 관리 가이드](./guidelines/content-management.md)** - 자료 분류 및 파일 관리 규칙

---

## 🤝 기여 방법

이 가이드라인은 지속적으로 개선됩니다. 개선 제안이나 문제 발견 시:

1. **GitHub Issues** 등록
2. **Pull Request** 제출
3. **팀 리뷰** 후 반영

> **Last Updated**: 2025-01-03 | **Version**: 1.0 | **Next Review**: 2025-04-03