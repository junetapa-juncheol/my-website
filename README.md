# Junetapa IT Story

> 기술과 비즈니스를 연결하는 IT 브릿지 전문가 - 25년+ IT 전문가의 포트폴리오 웹사이트

## 프로젝트 소개

박준철(Junetapa)의 IT 전문가로서의 여정과 창작 활동을 소개하는 개인 포트폴리오 웹사이트입니다.

### 주요 특징
- **Gold/Navy 프리미엄 디자인**: 세련된 골드/네이비 컬러 테마
- **Swiper 캐러셀**: 히어로 슬라이드, 핵심역량/창작활동 자동 슬라이드
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- **스크롤 애니메이션**: AOS 라이브러리 활용
- **성능 최적화**: 경량화된 CSS/JS로 빠른 로딩

## 웹사이트
https://junetapa.info (GitHub Pages)

## 프로젝트 구조

```
my-website/
├── index.html                    # 메인 홈페이지
├── pages/                        # 서브 페이지
│   ├── about.html                # 나의 이야기
│   ├── experience-education.html # 활동&교육 이력
│   ├── jstudio.html              # 취미 갤러리
│   └── sitemap.html              # 사이트맵 & 업데이트 내역
├── css/                          # 스타일시트
│   ├── style.css                 # 메인 스타일
│   ├── responsive.css            # 반응형 스타일
│   ├── about.css                 # About 페이지
│   ├── jstudio.css               # 갤러리 페이지
│   ├── sitemap.css               # 사이트맵 페이지
│   └── experience-education.css  # 활동&교육 페이지
├── js/                           # JavaScript
│   ├── main.js                   # 메인 스크립트 (Swiper, 타임라인, 폼)
│   ├── jstudio.js                # 갤러리 페이지
│   ├── sales.js                  # 핵심역량 모달
│   ├── creation.js               # 창작활동 데이터
│   └── chatbot-lite.js           # 경량 챗봇
└── assets/                       # 정적 자원
    └── images/                   # 이미지 파일
```

## 디자인 시스템

### 색상 팔레트
- **Navy**: `#09102A`
- **Navy Light**: `#111B3D`
- **Gold**: `#FFE08C`
- **Gold Dark**: `#93681E`
- **Background**: `#FFFFFF` / `#F8F9FC`
- **Text**: `#1A1A2E` / `#475569`

### 타이포그래피
- **영문**: Outfit (300~800)
- **한글**: Pretendard

## 기술 스택

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Custom Properties, BEM 네이밍
- **JavaScript**: ES6+, DOM manipulation

### 라이브러리
- **Swiper v11**: 캐러셀 슬라이드
- **AOS**: 스크롤 애니메이션
- **EmailJS**: 메일 전송

### 호스팅
- **GitHub Pages** (CNAME: junetapa.info)

## 브라우저 지원

| 브라우저 | 버전 | 지원 상태 |
|----------|------|-----------|
| Chrome | 90+ | 완전 지원 |
| Firefox | 88+ | 완전 지원 |
| Safari | 14+ | 완전 지원 |
| Edge | 90+ | 완전 지원 |

## 연락처

- **이메일**: jun22sky@nate.com

## 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다. 상업적 사용 시 사전 연락 필요.

---

- **Last Updated**: 2026-03-15
- **Since**: 2025-05

### 최근 업데이트
- Gold/Navy 테마 전면 리디자인
- Swiper 히어로 캐러셀 (페이드 효과, 자동 슬라이드)
- 핵심역량/창작활동 Swiper 자동 슬라이드
- 타임라인 좌우 교차 레이아웃 + 스크롤 연동 애니메이션
- J Studio 갤러리 전면 개편
- 전 페이지 디자인 통일 및 코드 경량화
- 불필요한 모듈 제거 (챗봇 모듈, PWA, 갤러리 스크립트 등)
