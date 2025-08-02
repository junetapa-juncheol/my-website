// Language Management Module
import { chatbotConfig } from '../config/settings.js';

export class LanguageManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = {};
        this.loadTranslations();
    }
    
    // 언어 감지
    detectLanguage() {
        // 1. localStorage에 저장된 언어 확인
        const savedLang = localStorage.getItem('junetapa_chat_language');
        if (savedLang && this.isSupported(savedLang)) {
            return savedLang;
        }
        
        // 2. 브라우저 언어 확인
        const browserLang = navigator.language.substring(0, 2);
        if (this.isSupported(browserLang)) {
            return browserLang;
        }
        
        // 3. 기본값: 한국어
        return 'ko';
    }
    
    // 지원 언어 확인
    isSupported(lang) {
        return ['ko', 'en'].includes(lang);
    }
    
    // 번역 데이터 로드
    loadTranslations() {
        this.translations = {
            ko: {
                // UI 텍스트
                ui: {
                    title: '실시간 상담',
                    online: '온라인',
                    offline: '오프라인',
                    minimize: '채팅 최소화',
                    restore: '채팅 복원',
                    close: '채팅 닫기',
                    send: '전송',
                    placeholder: '메시지를 입력하세요...',
                    typing: '입력 중...',
                    welcome: '안녕하세요! Junetapa 입니다. 무엇을 도와드릴까요?',
                    clearHistory: '채팅 기록을 모두 삭제하시겠습니까?',
                    historyCleared: '채팅 기록이 삭제되었습니다.',
                    copiedToClipboard: '클립보드에 복사되었습니다.',
                    languageChanged: '언어가 변경되었습니다.'
                },
                
                // 추천 메시지
                suggestions: [
                    { text: '안녕하세요!', category: 'greeting' },
                    { text: '포트폴리오에 대해 문의드립니다', category: 'portfolio' },
                    { text: '협업 제안이 있습니다', category: 'collaboration' },
                    { text: '경력에 대해 알고 싶습니다', category: 'experience' },
                    { text: '기술 스택이 궁금합니다', category: 'skills' }
                ],
                
                // 응답 템플릿
                responses: {
                    greeting: [
                        "안녕하세요! 저는 Junetapa의 AI 어시스턴트입니다. 무엇을 도와드릴까요?",
                        "반갑습니다! 오늘은 어떤 일로 찾아주셨나요?",
                        "안녕하세요! 포트폴리오, 경력, 협업 등 궁금하신 점을 편하게 물어보세요."
                    ],
                    portfolio: [
                        "25년 이상의 IT 경력을 바탕으로 다양한 프로젝트를 수행했습니다. 특히 B2B 기술영업, IT 인프라 관리, 디지털 마케팅 분야에서 전문성을 보유하고 있습니다.",
                        "포트폴리오 페이지에서 제가 진행한 프로젝트들을 자세히 확인하실 수 있습니다. 어떤 분야에 특히 관심이 있으신가요?",
                        "교육청 전산유지보수, 대학병원 IT 관리, 스마트미러 OEM 개발 등 다양한 경험이 있습니다. 구체적으로 어떤 프로젝트가 궁금하신가요?"
                    ],
                    collaboration: [
                        "협업 제안 감사합니다! 프로젝트의 구체적인 내용을 이메일(jun22sky@nate.com)로 보내주시면 검토 후 연락드리겠습니다.",
                        "새로운 프로젝트에 항상 열려있습니다. B2B 기술영업, IT 인프라 구축, 디지털 마케팅 등 다양한 분야에서 협업 가능합니다.",
                        "협업 문의는 언제든 환영입니다! 연락처 섹션에서 다양한 연락 방법을 확인하실 수 있습니다."
                    ],
                    contact: [
                        "연락 방법: 📧 이메일: jun22sky@nate.com | 📱 전화: 010-****-3888 | 💬 카카오톡 오픈채팅도 가능합니다!",
                        "이메일로 연락주시면 24시간 내 답변 드리겠습니다. 급한 건은 전화 주시면 빠르게 응대하겠습니다.",
                        "다양한 채널로 연락 가능합니다. 편하신 방법으로 연락 주세요!"
                    ],
                    experience: [
                        "1993년부터 시작된 저의 IT 여정은 25년이 넘었습니다. 전산유지보수, B2B 기술영업, 디지털 마케팅까지 다양한 경험을 쌓았습니다.",
                        "주요 경력: IT 인프라 관리 20년+, B2B 기술영업 15년+, 디지털 마케팅 4년+ 등 폭넓은 경험을 보유하고 있습니다.",
                        "컴퓨터 수리센터 운영부터 대기업 프로젝트까지, 다양한 규모의 비즈니스를 경험했습니다."
                    ],
                    skills: [
                        "핵심 기술: Windows Server, 네트워크 관리, B2B 영업, 프로젝트 관리, HTML/CSS/JS, AI 도구 활용 등",
                        "기술 스택 섹션에서 제 역량을 자세히 확인하실 수 있습니다. 특히 IT 인프라와 비즈니스 영역에 강점이 있습니다.",
                        "25년간 축적한 기술력과 최신 트렌드를 접목하여 실용적인 솔루션을 제공합니다."
                    ],
                    default: [
                        "흥미로운 질문이네요! 더 자세히 설명해 주시면 정확한 답변을 드릴 수 있을 것 같습니다.",
                        "네, 말씀해 주세요. 어떤 부분이 궁금하신가요?",
                        "죄송합니다, 정확히 이해하지 못했습니다. 다시 한 번 설명해 주시겠어요?",
                        "포트폴리오, 경력, 기술, 협업 등에 대해 자유롭게 질문해 주세요!"
                    ],
                    farewell: [
                        "좋은 하루 되세요! 또 궁금한 점이 있으시면 언제든 찾아주세요.",
                        "감사합니다! 도움이 필요하시면 언제든 연락 주세요.",
                        "안녕히 가세요! 좋은 인연이 되었으면 좋겠습니다."
                    ]
                },
                
                // 키워드 매핑
                keywords: {
                    greeting: ['안녕', '반가', '처음', '시작', '하이', '헬로'],
                    portfolio: ['포트폴리오', '작업', '프로젝트', '실적', '성과', '작품'],
                    collaboration: ['협업', '제안', '프로젝트', '일', '같이', '함께', '의뢰'],
                    contact: ['연락', '이메일', '전화', '카카오', '연락처', '문의'],
                    experience: ['경력', '경험', '이력', '커리어', '근무', '활동'],
                    skills: ['기술', '스킬', '역량', '능력', '전문', '특기'],
                    farewell: ['안녕히', '잘가', '종료', '끝', '다음에', '바이']
                }
            },
            
            en: {
                // UI texts
                ui: {
                    title: 'Live Chat',
                    online: 'Online',
                    offline: 'Offline',
                    minimize: 'Minimize Chat',
                    restore: 'Restore Chat',
                    close: 'Close Chat',
                    send: 'Send',
                    placeholder: 'Type a message...',
                    typing: 'Typing...',
                    welcome: "Hello! I'm Junetapa. How can I help you today?",
                    clearHistory: 'Clear all chat history?',
                    historyCleared: 'Chat history has been cleared.',
                    copiedToClipboard: 'Copied to clipboard.',
                    languageChanged: 'Language has been changed.'
                },
                
                // Suggested messages
                suggestions: [
                    { text: 'Hello!', category: 'greeting' },
                    { text: 'Tell me about your portfolio', category: 'portfolio' },
                    { text: 'I have a collaboration proposal', category: 'collaboration' },
                    { text: 'Tell me about your experience', category: 'experience' },
                    { text: 'What are your skills?', category: 'skills' }
                ],
                
                // Response templates
                responses: {
                    greeting: [
                        "Hello! I'm Junetapa's AI assistant. How can I help you today?",
                        "Welcome! What brings you here today?",
                        "Hello! Feel free to ask about my portfolio, experience, or collaboration opportunities."
                    ],
                    portfolio: [
                        "With over 25 years of IT experience, I've worked on various projects. I specialize in B2B technical sales, IT infrastructure management, and digital marketing.",
                        "You can find detailed information about my projects on the portfolio page. Which area are you particularly interested in?",
                        "I have diverse experience including education office IT maintenance, university hospital IT management, and smart mirror OEM development. Which project would you like to know more about?"
                    ],
                    collaboration: [
                        "Thank you for your collaboration proposal! Please send project details to jun22sky@nate.com and I'll get back to you after review.",
                        "I'm always open to new projects. I can collaborate in various fields including B2B technical sales, IT infrastructure, and digital marketing.",
                        "Collaboration inquiries are always welcome! You can find various contact methods in the contact section."
                    ],
                    contact: [
                        "Contact methods: 📧 Email: jun22sky@nate.com | 📱 Phone: 010-****-3888 | 💬 KakaoTalk open chat is also available!",
                        "I'll respond within 24 hours if you email me. For urgent matters, please call for a quick response.",
                        "You can reach me through various channels. Please use whichever method is most convenient for you!"
                    ],
                    experience: [
                        "My IT journey started in 1993 and spans over 25 years. I've gained diverse experience from IT maintenance to B2B technical sales and digital marketing.",
                        "Key experience: IT infrastructure management 20+ years, B2B technical sales 15+ years, digital marketing 4+ years, and more.",
                        "From running a computer repair center to enterprise projects, I've experienced businesses of various scales."
                    ],
                    skills: [
                        "Core skills: Windows Server, Network Management, B2B Sales, Project Management, HTML/CSS/JS, AI Tools, and more.",
                        "You can check my capabilities in detail in the Tech Stack section. I have particular strengths in IT infrastructure and business domains.",
                        "I provide practical solutions by combining 25 years of accumulated expertise with the latest trends."
                    ],
                    default: [
                        "That's an interesting question! Could you provide more details so I can give you an accurate answer?",
                        "Yes, please tell me more. What aspect are you curious about?",
                        "I'm sorry, I didn't quite understand. Could you explain again?",
                        "Feel free to ask about portfolio, experience, skills, collaboration, and more!"
                    ],
                    farewell: [
                        "Have a great day! Feel free to come back if you have any questions.",
                        "Thank you! Please contact me anytime you need help.",
                        "Goodbye! I hope this was a good connection."
                    ]
                },
                
                // Keyword mappings
                keywords: {
                    greeting: ['hello', 'hi', 'hey', 'greetings', 'good', 'morning', 'afternoon', 'evening'],
                    portfolio: ['portfolio', 'work', 'project', 'projects', 'achievement', 'showcase'],
                    collaboration: ['collaboration', 'proposal', 'project', 'work', 'together', 'partnership'],
                    contact: ['contact', 'email', 'phone', 'kakao', 'reach', 'message'],
                    experience: ['experience', 'career', 'history', 'background', 'work', 'employment'],
                    skills: ['skill', 'skills', 'expertise', 'capability', 'proficiency', 'specialty'],
                    farewell: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'exit']
                }
            }
        };
    }
    
    // 현재 언어 가져오기
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // 언어 변경
    setLanguage(lang) {
        if (!this.isSupported(lang)) {
            console.warn(`Language ${lang} is not supported`);
            return false;
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('junetapa_chat_language', lang);
        
        // 언어 변경 이벤트 발생
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        
        return true;
    }
    
    // 번역 가져오기
    translate(key, defaultValue = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }
        
        return value || defaultValue || key;
    }
    
    // UI 텍스트 가져오기
    getUIText(key) {
        return this.translate(`ui.${key}`, key);
    }
    
    // 응답 가져오기
    getResponses(category) {
        return this.translate(`responses.${category}`, []);
    }
    
    // 키워드 가져오기
    getKeywords(category) {
        return this.translate(`keywords.${category}`, []);
    }
    
    // 추천 메시지 가져오기
    getSuggestions() {
        return this.translate('suggestions', []);
    }
    
    // 모든 UI 텍스트 가져오기
    getAllUITexts() {
        return this.translate('ui', {});
    }
    
    // 언어 토글
    toggleLanguage() {
        const newLang = this.currentLanguage === 'ko' ? 'en' : 'ko';
        return this.setLanguage(newLang);
    }
    
    // 사용자 메시지 언어 감지
    detectMessageLanguage(message) {
        // 간단한 언어 감지 로직
        const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        const hasKorean = koreanPattern.test(message);
        
        // 한글이 포함되어 있으면 한국어로 판단
        return hasKorean ? 'ko' : 'en';
    }
    
    // 자동 언어 전환 (옵션)
    autoSwitchLanguage(message) {
        const detectedLang = this.detectMessageLanguage(message);
        
        if (detectedLang !== this.currentLanguage) {
            // 사용자에게 언어 전환을 제안할 수 있음
            return {
                shouldSwitch: true,
                detectedLanguage: detectedLang,
                currentLanguage: this.currentLanguage
            };
        }
        
        return { shouldSwitch: false };
    }
}

// 언어별 날짜/시간 포맷
export function formatDateTime(date, language = 'ko') {
    const options = {
        ko: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        en: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }
    };
    
    return new Intl.DateTimeFormat(language, options[language] || options.ko).format(date);
}

// 언어별 숫자 포맷
export function formatNumber(number, language = 'ko') {
    return new Intl.NumberFormat(language).format(number);
}