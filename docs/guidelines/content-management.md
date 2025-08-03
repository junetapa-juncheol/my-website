# 📁 콘텐츠 관리 가이드라인

> 자료 분류, 파일 관리, 콘텐츠 구조화를 위한 종합 가이드

## 📋 통합 파일 관리 체계

### 🎯 통합 명명 규칙

#### 표준 파일명 형식
```
YYYY-MM-DD_카테고리_프로젝트명_자료유형.확장자
```

#### 카테고리 코드
| 코드 | 카테고리 | 설명 |
|------|----------|------|
| `EDU` | 교육 | 수료증, 자격증, 트레이닝 |
| `EXP` | 경험 | 프로젝트, 실적, 추천서 |
| `PJT` | 프로젝트 | 기획서, 보고서, 결과물 |
| `CERT` | 인증서 | 자격증, 인증서, 증명서 |
| `DOC` | 문서 | 기술문서, 매뉴얼, 가이드 |

#### 자료유형 코드
| 코드 | 자료유형 | 설명 |
|------|----------|------|
| `COMP` | 완료보고서 | 프로젝트 완료 보고서 |
| `PLAN` | 기획서 | 프로젝트 기획 문서 |
| `SPEC` | 명세서 | 기술 명세서 |
| `CERT` | 증명서 | 각종 증명서 |
| `REC` | 추천서 | 고객 추천서 |
| `PERF` | 성과서 | 성과 분석 보고서 |

### 📂 디렉토리 구조

```
assets/documents/
├── education/           # 교육 관련 자료
│   ├── certificates/    # 자격증
│   ├── training/       # 교육 수료증
│   └── assessments/    # 기술 평가서
├── experience/         # 경험 관련 자료
│   ├── projects/       # 프로젝트 보고서
│   ├── recommendations/ # 추천서
│   └── achievements/   # 실적 증명서
├── portfolio/          # 포트폴리오 자료
│   ├── planning/       # 기획 문서
│   ├── technical/      # 기술 명세서
│   ├── results/        # 성과 분석
│   └── designs/        # 디자인 자료
└── archive/            # 아카이브 (구버전)
    ├── 2023/
    ├── 2022/
    └── older/
```

## 🎓 교육 관련 자료 관리

### 📜 자격증 및 인증서

#### 파일명 예시
```
2018-09-20_CERT_네트워크관리_자격증.pdf
2020-03-15_EDU_하드웨어전문가_수료증.pdf
2019-11-10_CERT_정보보안_인증서.pdf
```

#### 메타데이터 관리
```json
{
  "fileName": "2018-09-20_CERT_네트워크관리_자격증.pdf",
  "category": "CERT",
  "type": "자격증",
  "issueDate": "2018-09-20",
  "issuer": "한국정보통신자격협회",
  "validUntil": "2023-09-20",
  "description": "네트워크 관리사 2급 자격증",
  "tags": ["네트워크", "자격증", "IT인증"],
  "fileSize": "2.1MB",
  "language": "ko"
}
```

#### 보관 기준
- **원본 스캔**: 300DPI 이상, 컬러
- **파일 형식**: PDF 우선, JPG 허용
- **파일 크기**: 5MB 이하
- **개인정보**: 마스킹 후 저장
- **백업**: 클라우드 + 로컬 이중 백업

## 💼 경험 관련 자료 관리

### 📊 프로젝트 보고서

#### 파일명 예시
```
2018-03-15_PJT_교육청전산유지보수_완료보고서.pdf
2020-06-20_EXP_대학병원IT인프라_성과서.pdf
2016-09-10_PJT_스마트미러OEM_기획서.pdf
```

#### 프로젝트 문서 구조
```markdown
# 프로젝트명: 교육청 전산유지보수

## 1. 프로젝트 개요
- **기간**: 2018.01 - 2020.12 (3년)
- **규모**: 2,000대 PC 관리
- **역할**: 프로젝트 매니저
- **예산**: ₩500M

## 2. 주요 성과
- [ ] 시스템 안정성 99.8% 달성
- [ ] 비용 절감 15% 실현
- [ ] 고객 만족도 4.8/5.0

## 3. 기술 스택
- Windows Server 2016/2019
- Active Directory
- WSUS (Windows Update Services)
- 네트워크 모니터링 도구

## 4. 문제 해결 사례
### 문제: 대규모 업데이트 오류
- **원인**: 네트워크 대역폭 부족
- **해결**: 분산 업데이트 스케줄링
- **결과**: 업데이트 성공률 95% → 99%

## 5. 고객 피드백
> "전문적이고 신속한 대응으로 업무 효율성이 크게 향상되었습니다."
> - 교육청 정보화담당 김OO 과장

## 6. 첨부 자료
- [완료보고서.pdf]
- [고객추천서.pdf]
- [성과분석서.xlsx]
```

### 🏆 고객 추천서 관리

#### 파일명 예시
```
2020-06-20_REC_대학병원_고객추천서.pdf
2019-12-15_REC_교육청_성과인증서.pdf
2021-03-10_REC_협력업체_추천서.pdf
```

#### 추천서 정보 관리
```json
{
  "fileName": "2020-06-20_REC_대학병원_고객추천서.pdf",
  "recommender": {
    "organization": "OO대학병원",
    "department": "정보보호팀",
    "position": "팀장",
    "name": "김OO",
    "contact": "masked"
  },
  "project": "IT 인프라 구축 및 관리",
  "period": "2018.03 - 2020.06",
  "rating": "최우수",
  "keyPoints": [
    "전문적인 기술 역량",
    "적극적인 문제 해결",
    "우수한 커뮤니케이션"
  ]
}
```

## 🎨 포트폴리오 자료 관리

### 📋 프로젝트 기획서

#### 파일명 예시
```
2016-09-01_PJT_스마트미러OEM_기획서.pdf
2018-03-15_PJT_교육청유지보수_제안서.pdf
2020-01-20_PJT_병원IT인프라_설계서.pdf
```

#### 기획서 템플릿
```markdown
# 프로젝트 기획서

## 1. 프로젝트 개요
### 1.1 배경 및 목적
### 1.2 범위 및 목표
### 1.3 기대 효과

## 2. 요구사항 분석
### 2.1 기능적 요구사항
### 2.2 비기능적 요구사항
### 2.3 제약 사항

## 3. 시스템 설계
### 3.1 시스템 아키텍처
### 3.2 데이터베이스 설계
### 3.3 보안 설계

## 4. 개발 계획
### 4.1 개발 방법론
### 4.2 일정 계획
### 4.3 리소스 계획

## 5. 리스크 관리
### 5.1 리스크 식별
### 5.2 대응 방안
### 5.3 모니터링 계획

## 6. 품질 보증
### 6.1 테스트 계획
### 6.2 품질 기준
### 6.3 검수 절차
```

### 📈 성과 분석 보고서

#### 파일명 예시
```
2020-12-31_PERF_교육청유지보수_ROI분석.xlsx
2019-06-30_PERF_스마트미러_시장분석.pdf
2021-03-15_PERF_IT인프라_만족도조사.pdf
```

#### KPI 관리 체계
```json
{
  "project": "교육청 전산유지보수",
  "period": "2018-2020",
  "kpis": {
    "technical": {
      "systemUptime": {
        "target": "99.5%",
        "achieved": "99.8%",
        "status": "exceeded"
      },
      "incidentResponse": {
        "target": "< 2시간",
        "achieved": "1.2시간",
        "status": "exceeded"
      }
    },
    "business": {
      "costSaving": {
        "target": "10%",
        "achieved": "15%",
        "amount": "₩75M"
      },
      "customerSatisfaction": {
        "target": "4.0/5.0",
        "achieved": "4.8/5.0",
        "status": "excellent"
      }
    }
  }
}
```

## 🔒 보안 및 개인정보 관리

### 🛡️ 개인정보 보호

#### 마스킹 규칙
```
• 이름: 김○○, 박○○
• 전화번호: 010-****-3888
• 이메일: jun22***@***.com
• 주소: 인천광역시 부평구 ○○동
• 생년월일: 19**년 **월 **일
```

#### 파일 암호화
```bash
# PDF 패스워드 설정
pdftk input.pdf output encrypted.pdf user_pw [password]

# 압축 파일 암호화
7z a -p[password] archive.7z files/

# 클라우드 업로드 전 암호화
gpg --symmetric --cipher-algo AES256 file.pdf
```

### 🔐 접근 권한 관리

#### 권한 레벨
| 레벨 | 권한 | 대상 |
|------|------|------|
| **Public** | 읽기 | 일반 포트폴리오 |
| **Private** | 읽기 | 민감하지 않은 내부 자료 |
| **Confidential** | 제한적 접근 | 고객사 기밀 정보 |
| **Restricted** | 본인만 접근 | 개인 정보 포함 자료 |

#### 백업 전략
```
• 로컬 백업: 주 1회 외장 하드
• 클라우드 백업: 실시간 동기화
• 오프사이트 백업: 월 1회 물리적 분리
• 백업 검증: 분기 1회 복원 테스트
```

## 📊 Sitemap 업데이트 현황 관리 가이드라인 ✅ 검증됨

### 🎯 개발 현황 대시보드 관리

#### 핵심 통계 업데이트 규칙
```html
<!-- 매주 금요일 통계 업데이트 -->
<div class="stat-number">120+</div> <!-- 개발 기능 수 -->
<div class="stat-number">60+</div>  <!-- 모듈화 컴포넌트 -->
<div class="stat-number">16+</div>  <!-- 업데이트 기록 -->
<div class="stat-number">3</div>    <!-- 개발 기간(개월) -->
```

#### 일일 기능 하이라이트 업데이트
```html
<!-- 🆕 오늘 완성된 주요 기능 섹션 -->
<div style="padding: 12px; background: #f8f9ff; border-left: 3px solid #667eea;">
    <strong style="color: #667eea;">[기능명]</strong>
    <div style="font-size: 0.9rem; color: #666;">[간단한 설명]</div>
</div>
```

#### 색상 코딩 시스템
- `#667eea` (보라): 핵심 기능 개편
- `#764ba2` (진보라): 모바일/반응형 최적화  
- `#f093fb` (핑크): 가이드라인/문서화
- `#00d4ff` (청록): UI/레이아웃 개선

### 📋 업데이트 내역 작성 가이드

#### 표준 업데이트 엔트리 형식
```html
<div style="border-left: 3px solid var(--primary-color); padding-left: 20px; margin-bottom: 25px;">
    <div style="font-weight: 600; color: var(--primary-color); font-size: 1.1rem; margin-bottom: 8px;">
        YYYY.MM.DD (시간대)
    </div>
    <div style="font-weight: 600; margin-bottom: 8px; color: #333;">
        [메인 업데이트 제목 - 핵심 기능 요약]
    </div>
    <div style="color: #666; line-height: 1.6;">
        <ul style='margin-left: 1em; padding-left: 0; list-style: disc;'>
            <li><strong>[기능명]:</strong> [상세 설명]</li>
            <!-- 5-10개 세부 항목 -->
        </ul>
    </div>
    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
        <span style="background: var(--gradient-primary); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">[태그1]</span>
        <span style="background: var(--gradient-primary); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">[태그2]</span>
        <!-- 4개 태그 권장 -->
    </div>
</div>
```

#### 업데이트 작성 원칙
1. **최신순 배치**: 새 업데이트를 맨 위에 추가
2. **구체적 설명**: 기술적 세부사항 포함
3. **임팩트 중심**: 사용자 경험 개선 효과 명시
4. **태그 일관성**: 기존 태그 체계 준수

### 🚨 Sitemap 관리 주의사항

#### 필수 업데이트 상황
- [ ] 새로운 페이지 추가 시
- [ ] 주요 기능 개발 완료 시  
- [ ] UI/UX 대규모 변경 시
- [ ] 성능 최적화 완료 시
- [ ] 버그 수정 완료 시

#### 금지사항
- ❌ 미완성 기능 미리 공지
- ❌ 기술적 세부사항 누락
- ❌ 업데이트 순서 뒤바뀜
- ❌ 태그 누락 또는 오남용

## 📊 버전 관리 및 아카이브

### 🗂️ 버전 관리 체계

#### 버전 번호 규칙
```
v[Major].[Minor].[Patch]
• Major: 대규모 구조 변경
• Minor: 기능 추가 및 개선
• Patch: 오타 수정, 소규모 업데이트

예시:
v1.0.0 - 초기 버전
v1.1.0 - 새로운 프로젝트 추가
v1.1.1 - 오타 수정
```

#### 변경 이력 관리
```markdown
# 변경 이력 (CHANGELOG.md)

## [v1.1.1] - 2025-01-03
### Fixed
- 교육청 프로젝트 기간 수정
- 파일명 표기 오류 수정

## [v1.1.0] - 2024-12-15
### Added
- 스마트미러 OEM 프로젝트 추가
- 고객 추천서 3건 추가

### Changed
- 포트폴리오 구조 개선
- 메타데이터 체계 업데이트

## [v1.0.0] - 2024-11-01
### Added
- 초기 포트폴리오 구성
- 교육청 전산유지보수 프로젝트
- 대학병원 IT 인프라 프로젝트
```

### 📁 아카이브 관리

#### 아카이브 기준
- **연도별 분류**: 매년 12월 아카이브
- **프로젝트별 분류**: 완료된 프로젝트
- **중요도별 분류**: 핵심/참고/폐기 분류
- **보존 기간**: 법적 요구사항 고려

#### 정리 주기
```
• 일일: 작업 파일 정리
• 주간: 프로젝트 폴더 정리
• 월간: 불필요한 파일 삭제
• 분기: 아카이브 정리
• 연간: 전체 구조 검토 및 개선
```

## 📝 콘텐츠 작성 가이드

### ✍️ 문서 작성 표준

#### 한글 문서 스타일
```
• 문체: 경어체 (습니다/입니다)
• 띄어쓰기: 표준 맞춤법 준수
• 숫자 표기: 아라비아 숫자 사용
• 외래어: 필요시 병기 (예: AI(인공지능))
• 단위: 국제 표준 단위 사용
```

#### 영문 문서 스타일
```
• Case: Title Case for headings
• Tone: Professional and friendly
• Numbers: Spell out numbers under 10
• Dates: YYYY-MM-DD format
• Currency: Use ₩ for KRW, $ for USD
```

### 📷 이미지 및 미디어

#### 이미지 관리
```
• 해상도: 최소 1920x1080px
• 형식: JPG(사진), PNG(그래픽), WebP(웹용)
• 파일명: YYYY-MM-DD_카테고리_설명.확장자
• 압축: 품질 85%, 500KB 이하
• Alt 텍스트: 접근성 고려한 설명 추가
```

#### 동영상 관리
```
• 형식: MP4 (H.264), WebM (VP9)
• 해상도: 1080p, 720p, 480p 다중 버전
• 압축: 비트레이트 최적화
• 자막: SRT 형식, 다국어 지원
• 썸네일: 16:9 비율, JPG 형식
```

## 🚀 자동화 및 도구

### 🔧 파일 관리 자동화

#### 파일명 검증 스크립트
```bash
#!/bin/bash
# 파일명 형식 검증
validate_filename() {
    local filename=$1
    local pattern="^[0-9]{4}-[0-9]{2}-[0-9]{2}_[A-Z]+_.*\.(pdf|jpg|png|docx|xlsx)$"
    
    if [[ $filename =~ $pattern ]]; then
        echo "✅ Valid filename: $filename"
    else
        echo "❌ Invalid filename: $filename"
        echo "Expected format: YYYY-MM-DD_CATEGORY_description.ext"
    fi
}
```

#### 메타데이터 추출
```python
import os
import json
from datetime import datetime

def extract_metadata(filepath):
    """파일 메타데이터 추출"""
    filename = os.path.basename(filepath)
    file_size = os.path.getsize(filepath)
    modified_date = datetime.fromtimestamp(os.path.getmtime(filepath))
    
    # 파일명에서 정보 추출
    parts = filename.split('_')
    if len(parts) >= 3:
        date_part = parts[0]
        category = parts[1]
        description = '_'.join(parts[2:]).split('.')[0]
        extension = filename.split('.')[-1]
        
        metadata = {
            "filename": filename,
            "filepath": filepath,
            "date": date_part,
            "category": category,
            "description": description,
            "extension": extension,
            "file_size": file_size,
            "modified_date": modified_date.isoformat(),
            "created_date": datetime.now().isoformat()
        }
        
        return metadata
    
    return None
```

### 📊 대시보드 및 리포팅

#### 파일 현황 대시보드
```json
{
  "portfolio_stats": {
    "total_files": 127,
    "categories": {
      "education": 23,
      "experience": 45,
      "portfolio": 38,
      "archive": 21
    },
    "file_types": {
      "pdf": 89,
      "jpg": 21,
      "docx": 12,
      "xlsx": 5
    },
    "storage_usage": {
      "total_size": "2.3GB",
      "average_file_size": "18.1MB",
      "largest_file": "125.4MB"
    }
  }
}
```

## 📈 품질 관리 및 검토

### ✅ 정기 검토 체크리스트

#### 월간 검토
- [ ] 파일명 규칙 준수 확인
- [ ] 중복 파일 제거
- [ ] 개인정보 마스킹 점검
- [ ] 백업 상태 확인
- [ ] 접근 권한 검토

#### 분기별 검토
- [ ] 아카이브 정리
- [ ] 메타데이터 업데이트
- [ ] 가이드라인 개선사항 검토
- [ ] 사용자 피드백 수집
- [ ] 보안 취약점 점검

#### 연간 검토
- [ ] 전체 구조 재설계 검토
- [ ] 법적 요구사항 업데이트
- [ ] 기술 발전 사항 반영
- [ ] 비용 대비 효과 분석
- [ ] 차년도 계획 수립

---

> **Last Updated**: 2025-01-03 | **Version**: 1.0