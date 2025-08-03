# CSS 스타일링 가이드라인

## 🎨 색상 시스템

### 기본 색상 팔레트
- **Primary Red**: `#e74c3c` (강조색, 하이라이트)
- **Primary Orange**: `#f39c12` (액센트, 기간 표시)
- **White**: `#ffffff` (메인 텍스트, 제목)
- **Light Gray**: `#f8f9fa` (부제목, 설명 텍스트)
- **Dark Overlay**: `rgba(0,0,0,0.7)` (배경 오버레이)

### 텍스트 색상 가이드
```css
/* 메인 제목 */
color: #ffffff;
font-weight: bold;
text-shadow: 3px 3px 6px rgba(0,0,0,0.9);

/* 부제목 */
color: #f8f9fa;
text-shadow: 2px 2px 4px rgba(0,0,0,0.8);

/* 강조 텍스트 */
color: #e74c3c;
font-weight: 600;

/* 기간/숫자 강조 */
color: #f39c12;
font-weight: bold;
```

## 📐 타이포그래피

### 폰트 크기 시스템
- **Large Title**: `2.5rem` (메인 섹션 제목)
- **Medium Title**: `1.8rem` (서브 섹션 제목)
- **Regular Title**: `1.3rem` (카드 제목)
- **Body Text**: `1rem` (본문)
- **Small Text**: `0.9rem` (캡션, 메타 정보)

### 폰트 굵기
- **Extra Bold**: `700` (강조 제목)
- **Bold**: `600` (제목)
- **Medium**: `500` (부제목)
- **Regular**: `400` (본문)

## 🌅 배경 이미지 처리

### 배경 이미지 기본 설정
```css
background-size: contain;
background-repeat: no-repeat;
background-position: center;
min-height: 300px;
padding: 20px;
```

### 오버레이 효과
```css
/* 그라데이션 오버레이 */
background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%);

/* 단순 오버레이 */
background: rgba(0,0,0,0.6);
```

## 🎯 스킬 태그 스타일

### 기본 스킬 태그
```css
background: rgba(231,76,60,0.8);
color: white;
border: 1px solid #ffffff;
text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
padding: 5px 12px;
border-radius: 20px;
font-size: 0.9rem;
```

## 💡 텍스트 그림자 가이드

### 그림자 강도별 사용
```css
/* 강한 그림자 (제목용) */
text-shadow: 3px 3px 6px rgba(0,0,0,0.9);

/* 중간 그림자 (부제목용) */
text-shadow: 2px 2px 4px rgba(0,0,0,0.8);

/* 약한 그림자 (본문용) */
text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
```

## 🔧 CSS 우선순위 해결

### !important 사용 규칙
- **섹션별 특화 스타일**에만 사용
- **기존 스타일과 충돌** 시에만 사용
- **명확한 주석** 필수

### 예시
```css
/* About 섹션의 화이트 텍스트를 위한 특별 스타일 */
#about .section-title {
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    background: none !important;
}
```

## 📱 반응형 고려사항

### 모바일 텍스트 크기
- **Large Title**: `2rem` (데스크톱 2.5rem)
- **Medium Title**: `1.5rem` (데스크톱 1.8rem)
- **Regular Title**: `1.2rem` (데스크톱 1.3rem)

### 모바일 여백
- **Padding**: `15px` (데스크톱 20px)
- **Min-height**: `250px` (데스크톱 300px)

## 🎨 배경 이미지 파일 가이드

### 권장 사양
- **해상도**: 최소 1920x1080px
- **형식**: JPG (용량 최적화)
- **용량**: 500KB 이하
- **비율**: 16:9 또는 4:3

### 파일명 규칙
- `섹션명-bg.jpg` (메인 배경)
- `YYYY-YYYY-bg.jpg` (타임라인 배경)
- `카테고리-icon.png` (아이콘)

## ⚠️ 주의사항

1. **텍스트 가독성** 최우선
2. **그라데이션 배경** 사용 시 텍스트 색상 확인
3. **-webkit-text-fill-color** 속성 주의
4. **브라우저 호환성** 테스트 필수
5. **성능 최적화**를 위한 이미지 압축