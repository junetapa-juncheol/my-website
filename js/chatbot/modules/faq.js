// FAQ Auto-Response Module
export class FAQManager {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.faqData = {};
        this.loadFAQData();
        this.exactMatchThreshold = 0.8; // 정확 매칭 임계값
        this.fuzzyMatchThreshold = 0.6;  // 유사 매칭 임계값
    }
    
    // FAQ 데이터 로드
    loadFAQData() {
        this.faqData = {
            ko: {
                // 일반 정보
                general: [
                    {
                        id: 'about_age',
                        question: ['나이가 어떻게 되세요', '몇 살이세요', '연세가 어떻게', '태어난 년도'],
                        answer: '1981년생으로 현재 43세입니다. 12살부터 컴퓨터를 시작해서 25년 넘게 IT 분야에 종사하고 있습니다.',
                        category: 'general',
                        keywords: ['나이', '몇살', '연세', '태어난', '1981']
                    },
                    {
                        id: 'location',
                        question: ['어디 사세요', '지역이', '위치가', '거주지'],
                        answer: '현재 인천광역시 부평구에 거주하고 있습니다. 서울 및 수도권 전체에서 업무 가능합니다.',
                        category: 'general',
                        keywords: ['어디', '지역', '위치', '거주', '인천', '부평']
                    },
                    {
                        id: 'status',
                        question: ['현재 상태', '취업', '회사', '직장', '근무'],
                        answer: '현재 프리랜서로 활동하고 있습니다. 좋은 기회가 있다면 정규직 제안도 검토하겠습니다.',
                        category: 'general',
                        keywords: ['현재', '상태', '취업', '프리랜서', '정규직']
                    }
                ],
                
                // 기술 관련
                technical: [
                    {
                        id: 'main_skills',
                        question: ['주요 기술', '잘하는 것', '전문 분야', '핵심 역량'],
                        answer: '주요 전문 분야는 다음과 같습니다:\n• IT 인프라 관리 (Windows Server, 네트워크)\n• B2B 기술영업 (15년+ 경험)\n• 웹 개발 (HTML/CSS/JavaScript)\n• 디지털 마케팅\n• AI 도구 활용',
                        category: 'technical',
                        keywords: ['기술', '전문', '역량', '스킬', '능력']
                    },
                    {
                        id: 'programming',
                        question: ['프로그래밍', '개발', '코딩', '언어'],
                        answer: 'HTML, CSS, JavaScript를 주로 사용하며, Python으로 업무 자동화 스크립트를 작성합니다. 최근에는 AI 도구를 활용한 개발에도 관심이 많습니다.',
                        category: 'technical',
                        keywords: ['프로그래밍', '개발', '코딩', 'html', 'css', 'javascript', 'python']
                    },
                    {
                        id: 'experience_years',
                        question: ['경력', '몇 년', '경험', '년수'],
                        answer: '1993년부터 시작해서 현재까지 25년 이상의 IT 경력을 보유하고 있습니다. 분야별로는 IT 인프라 20년+, B2B 영업 15년+, 웹 개발 5년+ 입니다.',
                        category: 'technical',
                        keywords: ['경력', '년', '경험', '25년', '1993']
                    }
                ],
                
                // 업무 관련
                work: [
                    {
                        id: 'collaboration_types',
                        question: ['어떤 일', '협업', '프로젝트', '업무'],
                        answer: '다양한 협업이 가능합니다:\n• B2B 기술영업 및 컨설팅\n• IT 인프라 구축 및 관리\n• 웹사이트 기획 및 개발\n• 디지털 마케팅 전략\n• 기술 교육 및 멘토링',
                        category: 'work',
                        keywords: ['협업', '프로젝트', '업무', '일', '가능']
                    },
                    {
                        id: 'work_area',
                        question: ['근무 지역', '출근', '지역', '어디까지'],
                        answer: '수도권 전체에서 근무 가능합니다. 현재 인천 부평구에 거주하고 있어서 서울, 경기도 어디든 출근 가능합니다.',
                        category: 'work',
                        keywords: ['근무', '출근', '지역', '수도권', '서울', '경기']
                    },
                    {
                        id: 'remote_work',
                        question: ['재택', '원격', '리모트'],
                        answer: '재택근무 및 원격업무 모두 가능합니다. 25년 IT 경력으로 다양한 협업 도구에 익숙하며, 효율적인 원격 업무 환경을 구축할 수 있습니다.',
                        category: 'work',
                        keywords: ['재택', '원격', '리모트', '화상회의']
                    }
                ],
                
                // 연락 및 채용
                contact: [
                    {
                        id: 'contact_method',
                        question: ['연락처', '이메일', '전화', '카카오톡'],
                        answer: '연락 방법:\n• 📧 이메일: jun22sky@nate.com\n• 📱 전화: 010-****-3888\n• 💬 카카오톡: 오픈채팅 링크 클릭\n• 💻 실시간 채팅: 이 채팅창 이용',
                        category: 'contact',
                        keywords: ['연락', '이메일', '전화', '카카오', '채팅']
                    },
                    {
                        id: 'response_time',
                        question: ['답변', '회신', '응답', '얼마나'],
                        answer: '이메일: 24시간 내 답변 보장\n전화: 평일 09:00-18:00 즉시 응답\n실시간 채팅: 즉시 응답 (온라인 시간 내)\n카카오톡: 수 시간 내 응답',
                        category: 'contact',
                        keywords: ['답변', '회신', '응답', '시간', '얼마나']
                    },
                    {
                        id: 'salary',
                        question: ['연봉', '급여', '페이', '돈', '비용'],
                        answer: '연봉 및 프로젝트 비용은 업무 범위, 기간, 난이도에 따라 협의합니다. 구체적인 프로젝트 내용을 알려주시면 합리적인 견적을 제공해드리겠습니다.',
                        category: 'contact',
                        keywords: ['연봉', '급여', '비용', '돈', '페이', '견적']
                    }
                ],
                
                // 과거 경험
                experience: [
                    {
                        id: 'notable_projects',
                        question: ['대표 프로젝트', '주요 업무', '성과'],
                        answer: '주요 프로젝트:\n• 교육청 전산유지보수 (2,000대 PC 관리, 2년)\n• 대학병원 정보보호팀장 (2,000대 PC 네트워크 총괄)\n• 스마트미러 OEM 개발 (UI/UX 설계)\n• 1,000+ 대 사무OA기기 렌탈 영업 달성',
                        category: 'experience',
                        keywords: ['프로젝트', '업무', '성과', '교육청', '병원', '렌탈']
                    },
                    {
                        id: 'education',
                        question: ['학력', '학교', '전공', '공부'],
                        answer: '실무 중심의 경력을 쌓아왔습니다. 12살부터 컴퓨터를 독학으로 시작해서 현장에서 25년간 실무 경험을 축적했습니다. 지속적인 자기계발과 최신 기술 학습을 중시합니다.',
                        category: 'experience',
                        keywords: ['학력', '학교', '전공', '공부', '교육']
                    }
                ],
                
                // 기타
                misc: [
                    {
                        id: 'hobbies',
                        question: ['취미', '여가', '관심사'],
                        answer: '창작 활동을 즐깁니다:\n• AI 음악 창작 (100+ 곡 작곡)\n• 디지털 마케팅 (13,000+ 네트워크)\n• 과학 교육 콘텐츠 제작\n• 웹 개발 및 기획\n• 소셜미디어 운영',
                        category: 'misc',
                        keywords: ['취미', '여가', '관심사', '음악', '창작']
                    },
                    {
                        id: 'personality',
                        question: ['성격', '장점', '단점', '특징'],
                        answer: '적극적이고 투명한 커뮤니케이션을 선호하며, 문제 해결 중심의 실용적 사고를 합니다. 새로운 기술과 트렌드에 대한 지속적인 탐구정신이 있습니다.',
                        category: 'misc',
                        keywords: ['성격', '장점', '단점', '특징', '커뮤니케이션']
                    }
                ]
            },
            
            en: {
                // General Information
                general: [
                    {
                        id: 'about_age',
                        question: ['how old', 'age', 'born', 'year'],
                        answer: 'I was born in 1981, so I\'m currently 43 years old. I\'ve been working in IT for over 25 years since I started with computers at age 12.',
                        category: 'general',
                        keywords: ['age', 'old', 'born', '1981', '43']
                    },
                    {
                        id: 'location',
                        question: ['where live', 'location', 'area', 'residence'],
                        answer: 'I currently reside in Bupyeong-gu, Incheon. I can work anywhere in Seoul and the metropolitan area.',
                        category: 'general',
                        keywords: ['where', 'live', 'location', 'incheon', 'bupyeong']
                    },
                    {
                        id: 'status',
                        question: ['current status', 'job', 'employment', 'working'],
                        answer: 'I\'m currently working as a freelancer. I\'m open to full-time opportunities if there are good offers.',
                        category: 'general',
                        keywords: ['status', 'freelancer', 'job', 'employment']
                    }
                ],
                
                // Technical
                technical: [
                    {
                        id: 'main_skills',
                        question: ['main skills', 'expertise', 'specialization', 'core competency'],
                        answer: 'My main areas of expertise include:\n• IT Infrastructure Management (Windows Server, Networking)\n• B2B Technical Sales (15+ years)\n• Web Development (HTML/CSS/JavaScript)\n• Digital Marketing\n• AI Tool Utilization',
                        category: 'technical',
                        keywords: ['skills', 'expertise', 'specialization', 'competency']
                    },
                    {
                        id: 'programming',
                        question: ['programming', 'development', 'coding', 'languages'],
                        answer: 'I primarily use HTML, CSS, and JavaScript, and write automation scripts in Python. Recently, I\'ve been very interested in AI-assisted development.',
                        category: 'technical',
                        keywords: ['programming', 'development', 'coding', 'html', 'css', 'javascript', 'python']
                    },
                    {
                        id: 'experience_years',
                        question: ['experience', 'years', 'career'],
                        answer: 'I have over 25 years of IT experience since starting in 1993. By field: IT Infrastructure 20+ years, B2B Sales 15+ years, Web Development 5+ years.',
                        category: 'technical',
                        keywords: ['experience', 'years', 'career', '25', '1993']
                    }
                ],
                
                // Work
                work: [
                    {
                        id: 'collaboration_types',
                        question: ['what work', 'collaboration', 'projects', 'services'],
                        answer: 'Various types of collaboration are possible:\n• B2B Technical Sales & Consulting\n• IT Infrastructure Setup & Management\n• Website Planning & Development\n• Digital Marketing Strategy\n• Technical Training & Mentoring',
                        category: 'work',
                        keywords: ['collaboration', 'projects', 'work', 'services']
                    },
                    {
                        id: 'work_area',
                        question: ['work area', 'commute', 'location', 'where'],
                        answer: 'I can work anywhere in the metropolitan area. Currently residing in Bupyeong, Incheon, I can commute to Seoul or Gyeonggi Province.',
                        category: 'work',
                        keywords: ['work', 'commute', 'area', 'seoul', 'gyeonggi']
                    },
                    {
                        id: 'remote_work',
                        question: ['remote', 'work from home', 'telecommute'],
                        answer: 'Both remote work and telecommuting are possible. With 25 years of IT experience, I\'m familiar with various collaboration tools and can establish an efficient remote work environment.',
                        category: 'work',
                        keywords: ['remote', 'home', 'telecommute', 'online']
                    }
                ],
                
                // Contact
                contact: [
                    {
                        id: 'contact_method',
                        question: ['contact', 'email', 'phone', 'reach'],
                        answer: 'Contact methods:\n• 📧 Email: jun22sky@nate.com\n• 📱 Phone: 010-****-3888\n• 💬 KakaoTalk: Click open chat link\n• 💻 Live Chat: Use this chat window',
                        category: 'contact',
                        keywords: ['contact', 'email', 'phone', 'kakao', 'chat']
                    },
                    {
                        id: 'response_time',
                        question: ['response time', 'reply', 'how long'],
                        answer: 'Email: Guaranteed response within 24 hours\nPhone: Immediate response on weekdays 09:00-18:00\nLive Chat: Immediate response (during online hours)\nKakaoTalk: Response within a few hours',
                        category: 'contact',
                        keywords: ['response', 'reply', 'time', 'how long']
                    },
                    {
                        id: 'salary',
                        question: ['salary', 'pay', 'cost', 'price'],
                        answer: 'Salary and project costs are negotiable based on scope, duration, and complexity. Please provide specific project details for a reasonable quote.',
                        category: 'contact',
                        keywords: ['salary', 'pay', 'cost', 'price', 'quote']
                    }
                ]
            }
        };
    }
    
    // FAQ 매칭 및 응답
    findFAQResponse(userMessage) {
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqData[language] || this.faqData.ko;
        
        // 모든 카테고리에서 검색
        const allFAQs = Object.values(faqs).flat();
        
        // 정확 매칭 먼저 시도
        const exactMatch = this.findExactMatch(userMessage, allFAQs);
        if (exactMatch) return exactMatch;
        
        // 키워드 기반 매칭
        const keywordMatch = this.findKeywordMatch(userMessage, allFAQs);
        if (keywordMatch) return keywordMatch;
        
        // 유사도 기반 매칭
        const similarityMatch = this.findSimilarityMatch(userMessage, allFAQs);
        if (similarityMatch) return similarityMatch;
        
        return null;
    }
    
    // 정확 매칭 검색
    findExactMatch(userMessage, faqs) {
        const message = userMessage.toLowerCase();
        
        for (const faq of faqs) {
            for (const question of faq.question) {
                if (message.includes(question.toLowerCase())) {
                    return {
                        ...faq,
                        confidence: 0.95,
                        matchType: 'exact'
                    };
                }
            }
        }
        return null;
    }
    
    // 키워드 매칭
    findKeywordMatch(userMessage, faqs) {
        const message = userMessage.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;
        
        for (const faq of faqs) {
            let score = 0;
            let matchedKeywords = 0;
            
            for (const keyword of faq.keywords) {
                if (message.includes(keyword.toLowerCase())) {
                    score += keyword.length;
                    matchedKeywords++;
                }
            }
            
            // 키워드 매칭 비율 계산
            const matchRatio = matchedKeywords / faq.keywords.length;
            score *= matchRatio;
            
            if (score > maxScore && matchRatio >= 0.3) {
                maxScore = score;
                bestMatch = {
                    ...faq,
                    confidence: Math.min(0.9, 0.5 + matchRatio * 0.4),
                    matchType: 'keyword',
                    matchedKeywords
                };
            }
        }
        
        return bestMatch && bestMatch.confidence >= this.fuzzyMatchThreshold ? bestMatch : null;
    }
    
    // 유사도 매칭 (간단한 구현)
    findSimilarityMatch(userMessage, faqs) {
        const message = userMessage.toLowerCase();
        let bestMatch = null;
        let maxSimilarity = 0;
        
        for (const faq of faqs) {
            for (const question of faq.question) {
                const similarity = this.calculateSimilarity(message, question.toLowerCase());
                
                if (similarity > maxSimilarity && similarity >= this.fuzzyMatchThreshold) {
                    maxSimilarity = similarity;
                    bestMatch = {
                        ...faq,
                        confidence: similarity,
                        matchType: 'similarity',
                        matchedQuestion: question
                    };
                }
            }
        }
        
        return bestMatch;
    }
    
    // 간단한 문자열 유사도 계산 (Jaccard similarity 기반)
    calculateSimilarity(str1, str2) {
        const words1 = new Set(str1.split(' '));
        const words2 = new Set(str2.split(' '));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }
    
    // FAQ 추천 생성
    generateFAQSuggestions(category = null, limit = 5) {
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqData[language] || this.faqData.ko;
        
        let suggestions = [];
        
        if (category) {
            suggestions = faqs[category] || [];
        } else {
            // 모든 카테고리에서 인기 FAQ 선별
            const popularFAQs = [
                faqs.general?.[0], // 나이/소개
                faqs.technical?.[0], // 주요 기술
                faqs.work?.[0], // 협업 가능한 일
                faqs.contact?.[0], // 연락처
                faqs.experience?.[0] // 대표 프로젝트
            ].filter(Boolean);
            
            suggestions = popularFAQs;
        }
        
        return suggestions.slice(0, limit).map(faq => ({
            id: faq.id,
            question: faq.question[0], // 첫 번째 질문을 대표로
            category: faq.category
        }));
    }
    
    // FAQ 카테고리별 개수 조회
    getFAQStats() {
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqData[language] || this.faqData.ko;
        
        const stats = {};
        for (const [category, items] of Object.entries(faqs)) {
            stats[category] = items.length;
        }
        
        return {
            total: Object.values(stats).reduce((sum, count) => sum + count, 0),
            byCategory: stats
        };
    }
    
    // FAQ 검색 (관리자용)
    searchFAQs(query, category = null) {
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqData[language] || this.faqData.ko;
        
        let searchTarget = [];
        if (category) {
            searchTarget = faqs[category] || [];
        } else {
            searchTarget = Object.values(faqs).flat();
        }
        
        const results = searchTarget.filter(faq => {
            const searchFields = [
                ...faq.question,
                faq.answer,
                ...faq.keywords
            ].map(field => field.toLowerCase());
            
            return searchFields.some(field => field.includes(query.toLowerCase()));
        });
        
        return results;
    }
    
    // 관련 FAQ 찾기
    findRelatedFAQs(currentFAQId, limit = 3) {
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqData[language] || this.faqData.ko;
        const allFAQs = Object.values(faqs).flat();
        
        const currentFAQ = allFAQs.find(faq => faq.id === currentFAQId);
        if (!currentFAQ) return [];
        
        // 같은 카테고리의 다른 FAQ들
        const sameCategoryFAQs = allFAQs.filter(faq => 
            faq.category === currentFAQ.category && faq.id !== currentFAQId
        );
        
        return sameCategoryFAQs.slice(0, limit).map(faq => ({
            id: faq.id,
            question: faq.question[0],
            category: faq.category
        }));
    }
    
    // 자주 묻는 질문 순위 (시뮬레이션)
    getPopularFAQs(limit = 10) {
        const popularIds = [
            'main_skills',
            'contact_method', 
            'collaboration_types',
            'about_age',
            'experience_years',
            'status',
            'location',
            'programming',
            'response_time',
            'notable_projects'
        ];
        
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqData[language] || this.faqData.ko;
        const allFAQs = Object.values(faqs).flat();
        
        return popularIds.slice(0, limit).map(id => {
            const faq = allFAQs.find(f => f.id === id);
            return faq ? {
                id: faq.id,
                question: faq.question[0],
                category: faq.category,
                answer: faq.answer.substring(0, 100) + (faq.answer.length > 100 ? '...' : '')
            } : null;
        }).filter(Boolean);
    }
}