// Chatbot Response Module
import { responseTemplates, keywordMappings } from '../config/settings.js';
import { LanguageManager } from './language.js';
import { ContextManager } from './context.js';
import { FAQManager } from './faq.js';

export class ResponseManager {
    constructor() {
        this.responseHistory = [];
        this.contextStack = [];
        this.lastCategory = null;
        this.languageManager = new LanguageManager();
        this.contextManager = new ContextManager();
        this.faqManager = new FAQManager(this.languageManager);
    }
    
    // 메인 응답 생성 함수
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // FAQ 제안 확인 응답 처리
        if (this.suggestedFAQId && (message.includes('네') || message.includes('자세히') || message.includes('yes') || message.includes('more'))) {
            const response = this.confirmFAQSuggestion();
            this.updateAllContexts(userMessage, response, 'faq_confirmed');
            return response;
        }
        
        // 컨텍스트 기반 응답 확인
        const contextResponse = this.checkContextualResponse(message);
        if (contextResponse) {
            const category = this.lastCategory || 'default';
            this.updateAllContexts(userMessage, contextResponse, category);
            return contextResponse;
        }
        
        // 키워드 기반 카테고리 결정
        const category = this.detectCategory(message);
        
        // 카테고리에 따른 기본 응답 생성
        let response = this.getResponseByCategory(category);
        
        // 컨텍스트를 활용한 응답 향상
        response = this.contextManager.enhanceResponse(response, category);
        
        // 응답 기록 및 컨텍스트 업데이트
        this.updateAllContexts(userMessage, response, category);
        
        return response;
    }
    
    // 모든 컨텍스트 업데이트
    updateAllContexts(userMessage, response, category) {
        this.updateResponseHistory(userMessage, response, category);
        this.updateContext(category);
        this.contextManager.updateContext(userMessage, response, category);
    }
    
    // 카테고리 감지
    detectCategory(message) {
        let bestMatch = { category: 'default', score: 0 };
        
        // 언어별 키워드 가져오기
        const categories = ['greeting', 'portfolio', 'collaboration', 'contact', 'experience', 'skills', 'farewell'];
        
        for (const category of categories) {
            const keywords = this.languageManager.getKeywords(category);
            let score = 0;
            
            for (const keyword of keywords) {
                if (message.includes(keyword)) {
                    score += keyword.length; // 긴 키워드에 더 높은 가중치
                }
            }
            
            if (score > bestMatch.score) {
                bestMatch = { category, score };
            }
        }
        
        return bestMatch.category;
    }
    
    // 카테고리별 응답 선택
    getResponseByCategory(category) {
        // 언어별 응답 가져오기
        const responses = this.languageManager.getResponses(category);
        
        if (!responses || responses.length === 0) {
            return this.languageManager.getResponses('default')[0] || "I'm sorry, I don't understand.";
        }
        
        // 이전에 사용한 응답 피하기
        const unusedResponses = responses.filter(response => 
            !this.responseHistory.slice(-5).some(history => history.response === response)
        );
        
        const responsePool = unusedResponses.length > 0 ? unusedResponses : responses;
        return responsePool[Math.floor(Math.random() * responsePool.length)];
    }
    
    // 컨텍스트 기반 응답
    checkContextualResponse(message) {
        if (!this.lastCategory) return null;
        
        // 후속 질문 패턴
        const followUpPatterns = {
            portfolio: {
                patterns: ['자세히', '더', '구체적', '어떤', '예시'],
                response: "구체적으로 어떤 프로젝트에 관심이 있으신가요? 교육청 전산유지보수, 대학병원 IT 관리, 스마트미러 개발 등 다양한 경험이 있습니다."
            },
            experience: {
                patterns: ['어디서', '언제', '얼마나', '기간'],
                response: "1993년부터 현재까지 25년 이상의 경력을 보유하고 있습니다. 자세한 경력사항은 '활동&교육' 페이지에서 확인하실 수 있습니다."
            },
            collaboration: {
                patterns: ['비용', '기간', '방법', '절차'],
                response: "프로젝트의 규모와 요구사항에 따라 달라집니다. 구체적인 내용을 이메일로 보내주시면 맞춤형 제안을 드리겠습니다."
            }
        };
        
        const contextualData = followUpPatterns[this.lastCategory];
        if (contextualData) {
            for (const pattern of contextualData.patterns) {
                if (message.includes(pattern)) {
                    return contextualData.response;
                }
            }
        }
        
        return null;
    }
    
    // 응답 기록 업데이트
    updateResponseHistory(userMessage, response, category) {
        this.responseHistory.push({
            userMessage,
            response,
            category,
            timestamp: Date.now()
        });
        
        // 최대 20개까지만 유지
        if (this.responseHistory.length > 20) {
            this.responseHistory.shift();
        }
    }
    
    // 컨텍스트 업데이트
    updateContext(category) {
        this.lastCategory = category;
        
        this.contextStack.push(category);
        if (this.contextStack.length > 5) {
            this.contextStack.shift();
        }
    }
    
    // 대화 패턴 분석
    analyzeConversationPattern() {
        if (this.responseHistory.length < 3) return null;
        
        const recentCategories = this.responseHistory
            .slice(-5)
            .map(h => h.category);
        
        // 같은 카테고리가 반복되면 더 깊은 정보 제공
        const categoryCount = {};
        recentCategories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        
        const dominantCategory = Object.entries(categoryCount)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (dominantCategory && dominantCategory[1] >= 3) {
            return {
                category: dominantCategory[0],
                depth: dominantCategory[1]
            };
        }
        
        return null;
    }
    
    // 특별 응답 (시간대별, 날짜별)
    getSpecialResponse() {
        const now = new Date();
        const hour = now.getHours();
        const lang = this.languageManager.getCurrentLanguage();
        
        // 시간대별 인사
        if (lang === 'ko') {
            if (hour >= 6 && hour < 12) {
                return "좋은 아침입니다! 오늘도 좋은 하루 되세요.";
            } else if (hour >= 12 && hour < 17) {
                return "안녕하세요! 점심은 드셨나요?";
            } else if (hour >= 17 && hour < 22) {
                return "안녕하세요! 오늘 하루는 어떠셨나요?";
            } else {
                return "늦은 시간까지 수고하시네요! 무엇을 도와드릴까요?";
            }
        } else {
            if (hour >= 6 && hour < 12) {
                return "Good morning! Have a great day!";
            } else if (hour >= 12 && hour < 17) {
                return "Good afternoon! How can I help you?";
            } else if (hour >= 17 && hour < 22) {
                return "Good evening! How was your day?";
            } else {
                return "Working late? How can I assist you?";
            }
        }
    }
    
    // 감정 분석 (간단한 버전)
    analyzeSentiment(message) {
        const positiveWords = ['감사', '좋', '최고', '훌륭', '멋', '대단'];
        const negativeWords = ['아니', '안', '못', '실망', '별로', '글쎄'];
        
        let sentiment = 0;
        positiveWords.forEach(word => {
            if (message.includes(word)) sentiment++;
        });
        negativeWords.forEach(word => {
            if (message.includes(word)) sentiment--;
        });
        
        return sentiment;
    }
    
    // 대화 종료 체크
    isConversationEnding(message) {
        const endingKeywords = ['감사', '고마워', '수고', '안녕히', '다음에', '나중에'];
        return endingKeywords.some(keyword => message.includes(keyword));
    }
    
    // 리셋
    reset() {
        this.responseHistory = [];
        this.contextStack = [];
        this.lastCategory = null;
        this.contextManager.reset();
    }
    
    // 후속 질문 생성
    generateFollowUpQuestions() {
        if (!this.lastCategory || this.lastCategory === 'default') return [];
        return this.contextManager.generateFollowUpQuestions(this.lastCategory);
    }
    
    // 대화 요약 가져오기
    getConversationSummary() {
        return this.contextManager.generateConversationSummary();
    }
    
    // 스마트 응답 생성 (향상된 버전)
    generateSmartResponse(userMessage) {
        const context = this.contextManager.currentContext;
        const intent = context.intent;
        
        // FAQ 매칭 먼저 확인
        const faqResponse = this.faqManager.findFAQResponse(userMessage);
        if (faqResponse && faqResponse.confidence >= 0.7) {
            // 높은 신뢰도의 FAQ 응답이 있으면 사용
            const response = this.enhanceFAQResponse(faqResponse);
            this.updateAllContexts(userMessage, response, faqResponse.category);
            return response;
        }
        
        // 의도에 따른 특별 처리
        if (intent === 'complaint') {
            return this.handleComplaint(userMessage);
        } else if (intent === 'question' && context.entities.technologies?.length > 0) {
            return this.handleTechnicalQuestion(userMessage, context.entities.technologies);
        } else if (intent === 'request' && this.lastCategory === 'collaboration') {
            return this.handleCollaborationRequest(userMessage);
        }
        
        // 중간 신뢰도의 FAQ가 있으면 제안으로 제시
        if (faqResponse && faqResponse.confidence >= 0.5) {
            const suggestion = this.createFAQSuggestion(faqResponse);
            this.updateAllContexts(userMessage, suggestion, 'faq_suggestion');
            return suggestion;
        }
        
        // 기본 응답 생성
        return this.generateResponse(userMessage);
    }
    
    // 불만 처리
    handleComplaint(message) {
        const response = "죄송합니다. 불편을 드려 대단히 죄송합니다. 구체적으로 어떤 부분이 문제인지 알려주시면 즉시 도움을 드리겠습니다.";
        this.updateAllContexts(message, response, 'support');
        return response;
    }
    
    // 기술 질문 처리
    handleTechnicalQuestion(message, technologies) {
        const tech = technologies[0];
        const responses = {
            'javascript': "JavaScript에 대해 궁금하신가요? 저는 웹 개발에 JavaScript를 활용한 경험이 있습니다. 특히 인터랙티브한 UI 구현에 강점이 있습니다.",
            'react': "React는 현대적인 웹 개발의 핵심 기술입니다. 컴포넌트 기반 개발과 상태 관리에 대한 경험이 있습니다.",
            'html': "HTML/CSS는 웹의 기초입니다. 시맨틱 마크업과 반응형 디자인을 중시합니다.",
            'python': "Python은 데이터 분석과 자동화에 활용하고 있습니다. 업무 효율화를 위한 스크립트 작성 경험이 있습니다."
        };
        
        const response = responses[tech.toLowerCase()] || `${tech}에 대한 실무 경험이 있습니다. 구체적으로 어떤 부분이 궁금하신가요?`;
        this.updateAllContexts(message, response, 'skills');
        return response;
    }
    
    // 협업 요청 처리
    handleCollaborationRequest(message) {
        const entities = this.contextManager.currentContext.entities;
        let response = "협업 제안 감사합니다! ";
        
        if (entities.email) {
            response += `${entities.email}로 연락드리겠습니다. `;
        } else if (entities.phone) {
            response += `${entities.phone}로 연락드리겠습니다. `;
        } else {
            response += "구체적인 내용을 jun22sky@nate.com으로 보내주시면 검토 후 연락드리겠습니다. ";
        }
        
        if (entities.date) {
            response += `${entities.date}까지 회신드리도록 하겠습니다.`;
        }
        
        this.updateAllContexts(message, response, 'collaboration');
        return response;
    }
    
    // FAQ 응답 향상
    enhanceFAQResponse(faqResponse) {
        let response = faqResponse.answer;
        
        // 매칭 타입에 따른 신뢰도 표시
        if (faqResponse.matchType === 'exact') {
            // 정확 매칭인 경우 그대로 사용
        } else if (faqResponse.matchType === 'keyword') {
            // 키워드 매칭인 경우 약간의 확신도 조절
            if (faqResponse.confidence < 0.8) {
                response = "다음 정보가 도움이 될 것 같습니다:\n\n" + response;
            }
        } else if (faqResponse.matchType === 'similarity') {
            // 유사도 매칭인 경우 추가 확인 제안
            response += "\n\n💡 원하시는 답변이 아니라면 다른 방식으로 질문해 주세요.";
        }
        
        // 관련 FAQ 제안 추가
        const relatedFAQs = this.faqManager.findRelatedFAQs(faqResponse.id, 2);
        if (relatedFAQs.length > 0) {
            response += "\n\n🔍 관련 질문들:\n";
            relatedFAQs.forEach((related, index) => {
                response += `${index + 1}. ${related.question}\n`;
            });
        }
        
        return response;
    }
    
    // FAQ 제안 생성
    createFAQSuggestion(faqResponse) {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        let response;
        if (currentLang === 'ko') {
            response = `혹시 이런 내용을 찾고 계신가요?\n\n"${faqResponse.question[0]}"\n\n답변: ${faqResponse.answer.substring(0, 150)}${faqResponse.answer.length > 150 ? '...' : ''}\n\n💬 맞다면 '네' 또는 '자세히'라고 말씀해 주세요.`;
        } else {
            response = `Are you looking for this information?\n\n"${faqResponse.question[0]}"\n\nAnswer: ${faqResponse.answer.substring(0, 150)}${faqResponse.answer.length > 150 ? '...' : ''}\n\n💬 If this is what you need, please say 'yes' or 'more details'.`;
        }
        
        // 제안된 FAQ ID 저장 (후속 확인용)
        this.suggestedFAQId = faqResponse.id;
        
        return response;
    }
    
    // FAQ 브라우저 응답 생성
    generateFAQBrowser() {
        const currentLang = this.languageManager.getCurrentLanguage();
        const popularFAQs = this.faqManager.getPopularFAQs(5);
        
        let response;
        if (currentLang === 'ko') {
            response = "💫 자주 묻는 질문들:\n\n";
            popularFAQs.forEach((faq, index) => {
                response += `${index + 1}. ${faq.question}\n`;
            });
            response += "\n번호를 선택하거나 직접 질문해 주세요!";
        } else {
            response = "💫 Frequently Asked Questions:\n\n";
            popularFAQs.forEach((faq, index) => {
                response += `${index + 1}. ${faq.question}\n`;
            });
            response += "\nSelect a number or ask directly!";
        }
        
        return response;
    }
    
    // FAQ 통계 조회
    getFAQStats() {
        return this.faqManager.getFAQStats();
    }
    
    // FAQ 검색
    searchFAQs(query, category = null) {
        return this.faqManager.searchFAQs(query, category);
    }
    
    // FAQ 제안 확인 처리
    confirmFAQSuggestion() {
        if (!this.suggestedFAQId) return null;
        
        const language = this.languageManager.getCurrentLanguage();
        const faqs = this.faqManager.faqData[language] || this.faqManager.faqData.ko;
        const allFAQs = Object.values(faqs).flat();
        
        const faq = allFAQs.find(f => f.id === this.suggestedFAQId);
        if (faq) {
            const response = this.enhanceFAQResponse(faq);
            this.suggestedFAQId = null; // 리셋
            return response;
        }
        
        this.suggestedFAQId = null;
        return this.languageManager.getCurrentLanguage() === 'ko' ?
            '죄송합니다. 해당 정보를 찾을 수 없습니다.' :
            'Sorry, I cannot find that information.';
    }
}