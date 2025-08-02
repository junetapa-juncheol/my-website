// Context Management Module
export class ContextManager {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = {
            name: null,
            interests: [],
            preferences: {},
            previousTopics: [],
            language: 'ko'
        };
        this.currentContext = {
            topic: null,
            intent: null,
            entities: {},
            mood: 'neutral',
            depth: 0
        };
        this.sessionMemory = new Map();
        this.shortTermMemory = [];
        this.maxMemorySize = 20;
    }
    
    // 대화 컨텍스트 업데이트
    updateContext(message, response, category) {
        // 대화 기록 추가
        this.conversationHistory.push({
            message,
            response,
            category,
            timestamp: Date.now(),
            context: { ...this.currentContext }
        });
        
        // 짧은 기억 업데이트
        this.updateShortTermMemory(message, category);
        
        // 현재 컨텍스트 분석
        this.analyzeContext(message, category);
        
        // 사용자 프로필 업데이트
        this.updateUserProfile(message, category);
        
        // 대화 깊이 추적
        if (this.currentContext.topic === category) {
            this.currentContext.depth++;
        } else {
            this.currentContext.topic = category;
            this.currentContext.depth = 1;
        }
    }
    
    // 짧은 기억 업데이트
    updateShortTermMemory(message, category) {
        this.shortTermMemory.push({
            message,
            category,
            timestamp: Date.now()
        });
        
        // 최대 크기 유지
        if (this.shortTermMemory.length > this.maxMemorySize) {
            this.shortTermMemory.shift();
        }
    }
    
    // 컨텍스트 분석
    analyzeContext(message, category) {
        // 의도 파악
        this.currentContext.intent = this.detectIntent(message);
        
        // 엔티티 추출
        this.currentContext.entities = this.extractEntities(message);
        
        // 감정 분석
        this.currentContext.mood = this.analyzeMood(message);
    }
    
    // 의도 파악
    detectIntent(message) {
        const intents = {
            question: ['?', '무엇', '어떻게', '언제', '어디', '누가', '왜', 'what', 'how', 'when', 'where', 'who', 'why'],
            request: ['주세요', '부탁', '해줘', '원해', '싶어', 'please', 'want', 'need', 'could', 'would'],
            information: ['알려', '설명', '정보', 'tell', 'explain', 'info'],
            greeting: ['안녕', '반가', 'hello', 'hi'],
            farewell: ['안녕히', '잘가', 'bye', 'goodbye'],
            thanks: ['감사', '고마워', 'thank'],
            complaint: ['불만', '문제', '오류', 'problem', 'issue', 'error'],
            confirmation: ['네', '맞아', '그래', 'yes', 'correct', 'right']
        };
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }
    
    // 엔티티 추출
    extractEntities(message) {
        const entities = {};
        
        // 이메일 추출
        const emailMatch = message.match(/\b[\w.-]+@[\w.-]+\.\w+\b/);
        if (emailMatch) {
            entities.email = emailMatch[0];
        }
        
        // 전화번호 추출
        const phoneMatch = message.match(/\b\d{2,4}-?\d{3,4}-?\d{4}\b/);
        if (phoneMatch) {
            entities.phone = phoneMatch[0];
        }
        
        // 날짜 추출
        const datePatterns = [
            /\d{4}년\s?\d{1,2}월\s?\d{1,2}일/,
            /\d{1,2}월\s?\d{1,2}일/,
            /내일|오늘|어제|모레/,
            /다음주|이번주|지난주/
        ];
        
        for (const pattern of datePatterns) {
            const dateMatch = message.match(pattern);
            if (dateMatch) {
                entities.date = dateMatch[0];
                break;
            }
        }
        
        // 시간 추출
        const timeMatch = message.match(/\b\d{1,2}시\s?(\d{1,2}분)?|\b\d{1,2}:\d{2}\b/);
        if (timeMatch) {
            entities.time = timeMatch[0];
        }
        
        // 기술 키워드 추출
        const techKeywords = ['React', 'Vue', 'JavaScript', 'Python', 'Java', 'HTML', 'CSS', 'Node.js', 'IT', 'B2B', '영업', '마케팅'];
        entities.technologies = techKeywords.filter(tech => 
            message.toLowerCase().includes(tech.toLowerCase())
        );
        
        return entities;
    }
    
    // 감정 분석
    analyzeMood(message) {
        const moods = {
            positive: {
                keywords: ['좋아', '감사', '훌륭', '멋진', '최고', 'good', 'great', 'excellent', 'love', 'happy'],
                score: 1
            },
            negative: {
                keywords: ['싫어', '나쁜', '문제', '오류', '실망', 'bad', 'hate', 'problem', 'error', 'disappointed'],
                score: -1
            },
            neutral: {
                keywords: [],
                score: 0
            },
            curious: {
                keywords: ['궁금', '알고싶', '어떻게', '무엇', 'curious', 'wonder', 'how', 'what'],
                score: 0
            },
            urgent: {
                keywords: ['급해', '빨리', '지금', '즉시', 'urgent', 'quickly', 'now', 'immediately'],
                score: 0
            }
        };
        
        let moodScores = {};
        
        for (const [mood, data] of Object.entries(moods)) {
            moodScores[mood] = data.keywords.filter(keyword => 
                message.toLowerCase().includes(keyword)
            ).length * data.score;
        }
        
        // 가장 높은 점수의 감정 반환
        let detectedMood = 'neutral';
        let maxScore = 0;
        
        for (const [mood, score] of Object.entries(moodScores)) {
            if (Math.abs(score) > Math.abs(maxScore)) {
                maxScore = score;
                detectedMood = mood;
            }
        }
        
        return detectedMood;
    }
    
    // 사용자 프로필 업데이트
    updateUserProfile(message, category) {
        // 관심사 추가
        if (!this.userProfile.interests.includes(category) && category !== 'default') {
            this.userProfile.interests.push(category);
        }
        
        // 이전 주제 추적
        if (!this.userProfile.previousTopics.includes(category)) {
            this.userProfile.previousTopics.push(category);
        }
        
        // 선호도 업데이트
        this.userProfile.preferences[category] = (this.userProfile.preferences[category] || 0) + 1;
        
        // 이름 추출 시도
        if (!this.userProfile.name) {
            const nameMatch = message.match(/제 이름은 (.+)입니다|저는 (.+)입니다|(.+)라고 합니다/);
            if (nameMatch) {
                this.userProfile.name = nameMatch[1] || nameMatch[2] || nameMatch[3];
            }
        }
    }
    
    // 컨텍스트 기반 응답 향상
    enhanceResponse(baseResponse, category) {
        const context = this.currentContext;
        const profile = this.userProfile;
        
        // 깊은 대화일 경우 더 상세한 정보 제공
        if (context.depth > 2) {
            baseResponse = this.addDepthToResponse(baseResponse, category);
        }
        
        // 사용자 이름이 있으면 개인화
        if (profile.name) {
            baseResponse = `${profile.name}님, ${baseResponse}`;
        }
        
        // 감정에 따른 응답 조정
        if (context.mood === 'urgent') {
            baseResponse = this.makeResponseUrgent(baseResponse);
        } else if (context.mood === 'negative') {
            baseResponse = this.makeResponseEmpathetic(baseResponse);
        }
        
        // 이전 대화 참조
        if (this.shouldReferPreviousConversation()) {
            baseResponse = this.addPreviousReference(baseResponse);
        }
        
        return baseResponse;
    }
    
    // 깊이 있는 응답 생성
    addDepthToResponse(response, category) {
        const depthAdditions = {
            portfolio: "\n\n더 자세한 프로젝트 정보나 특정 기술에 대해 궁금하신 점이 있다면 말씀해 주세요.",
            experience: "\n\n특정 시기나 회사에서의 경험에 대해 더 자세히 알려드릴 수 있습니다.",
            skills: "\n\n각 기술의 실무 적용 사례나 프로젝트 경험을 구체적으로 설명드릴 수 있습니다.",
            collaboration: "\n\n프로젝트 규모, 기간, 예산 등 구체적인 내용을 알려주시면 더 정확한 제안을 드릴 수 있습니다."
        };
        
        return response + (depthAdditions[category] || "");
    }
    
    // 긴급한 톤으로 변경
    makeResponseUrgent(response) {
        return `바로 도와드리겠습니다! ${response}`;
    }
    
    // 공감하는 톤으로 변경
    makeResponseEmpathetic(response) {
        return `이해합니다. 불편을 드려 죄송합니다. ${response}`;
    }
    
    // 이전 대화 참조 여부 결정
    shouldReferPreviousConversation() {
        if (this.conversationHistory.length < 3) return false;
        
        // 같은 주제가 계속되고 있는지 확인
        const recentTopics = this.conversationHistory.slice(-3).map(h => h.category);
        return recentTopics.every(topic => topic === recentTopics[0]);
    }
    
    // 이전 대화 참조 추가
    addPreviousReference(response) {
        const previousTopics = this.conversationHistory.slice(-3).map(h => h.message);
        return `${response}\n\n앞서 말씀하신 내용과 관련해서 추가로 도움이 필요하시면 알려주세요.`;
    }
    
    // 대화 요약 생성
    generateConversationSummary() {
        if (this.conversationHistory.length === 0) return "대화 내역이 없습니다.";
        
        const topics = {};
        this.conversationHistory.forEach(item => {
            topics[item.category] = (topics[item.category] || 0) + 1;
        });
        
        const mainTopics = Object.entries(topics)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([topic]) => topic);
        
        return {
            totalMessages: this.conversationHistory.length,
            mainTopics,
            duration: this.conversationHistory.length > 0 
                ? Date.now() - this.conversationHistory[0].timestamp 
                : 0,
            userProfile: this.userProfile,
            currentMood: this.currentContext.mood
        };
    }
    
    // 추천 응답 생성
    generateFollowUpQuestions(category) {
        const followUps = {
            portfolio: [
                "어떤 종류의 프로젝트에 관심이 있으신가요?",
                "특정 기술 스택에 대해 더 알고 싶으신가요?",
                "프로젝트 진행 과정이 궁금하신가요?"
            ],
            experience: [
                "어떤 분야의 경험이 특히 궁금하신가요?",
                "특정 시기의 경력에 대해 자세히 알고 싶으신가요?",
                "업무 성과나 달성한 목표가 궁금하신가요?"
            ],
            skills: [
                "어떤 기술에 대해 더 자세히 알고 싶으신가요?",
                "실무에서의 활용 사례가 궁금하신가요?",
                "기술 습득 과정이나 학습 방법이 궁금하신가요?"
            ],
            collaboration: [
                "프로젝트의 규모와 기간은 어떻게 되나요?",
                "어떤 분야의 전문성이 필요하신가요?",
                "예상 일정이나 마감일이 있으신가요?"
            ]
        };
        
        return followUps[category] || [];
    }
    
    // 컨텍스트 리셋
    reset() {
        this.conversationHistory = [];
        this.currentContext = {
            topic: null,
            intent: null,
            entities: {},
            mood: 'neutral',
            depth: 0
        };
        this.shortTermMemory = [];
        this.sessionMemory.clear();
    }
    
    // 학습 데이터 내보내기 (향후 ML 모델 학습용)
    exportLearningData() {
        return {
            conversations: this.conversationHistory,
            userProfile: this.userProfile,
            patterns: this.extractPatterns()
        };
    }
    
    // 패턴 추출
    extractPatterns() {
        const patterns = {
            commonQuestions: {},
            responseEffectiveness: {},
            topicTransitions: []
        };
        
        // 자주 묻는 질문 패턴
        this.conversationHistory.forEach(item => {
            const key = `${item.category}:${item.context.intent}`;
            patterns.commonQuestions[key] = (patterns.commonQuestions[key] || 0) + 1;
        });
        
        // 주제 전환 패턴
        for (let i = 1; i < this.conversationHistory.length; i++) {
            const prev = this.conversationHistory[i-1];
            const curr = this.conversationHistory[i];
            if (prev.category !== curr.category) {
                patterns.topicTransitions.push({
                    from: prev.category,
                    to: curr.category,
                    trigger: curr.message
                });
            }
        }
        
        return patterns;
    }
}