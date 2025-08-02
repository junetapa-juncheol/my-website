// Chatbot Configuration Settings
export const chatbotConfig = {
    // 온라인 시간 설정
    onlineHours: {
        start: 9,  // 오전 9시
        end: 22    // 오후 10시
    },
    
    // 메시지 설정
    messages: {
        maxHistory: 50,        // 최대 저장 메시지 수
        typingDelay: {
            min: 1000,         // 최소 타이핑 지연 (ms)
            max: 3000          // 최대 타이핑 지연 (ms)
        },
        maxLength: 500         // 메시지 최대 길이
    },
    
    // UI 설정
    ui: {
        animationDuration: 300,  // 애니메이션 지속 시간 (ms)
        autoScrollDelay: 100,    // 자동 스크롤 지연 (ms)
        minimizeOnOutsideClick: true,
        showSuggestions: true,
        maxSuggestions: 3
    },
    
    // 저장소 설정
    storage: {
        prefix: 'junetapa_chat_',  // localStorage 키 접두사
        stateKey: 'chatState',
        historyKey: 'chatHistory',
        sessionTimeout: 3600000     // 1시간 (ms)
    },
    
    // 키보드 단축키
    shortcuts: {
        open: 'k',           // Ctrl/Cmd + K
        close: 'Escape'      // Esc
    },
    
    // 분석 설정
    analytics: {
        enabled: true,
        trackMessages: true,
        trackUsageTime: true
    }
};

// 기본 응답 템플릿
export const responseTemplates = {
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
};

// 키워드 매핑
export const keywordMappings = {
    greeting: ['안녕', 'hello', 'hi', '반가', '처음', '시작'],
    portfolio: ['포트폴리오', 'portfolio', '작업', '프로젝트', 'project', '실적', '성과'],
    collaboration: ['협업', '제안', '프로젝트', '일', 'collaboration', '같이', '함께', '의뢰'],
    contact: ['연락', 'contact', '이메일', 'email', '전화', 'phone', '카카오', 'kakao'],
    experience: ['경력', '경험', 'experience', '이력', '커리어', 'career'],
    skills: ['기술', '스킬', 'skill', '역량', '능력', '전문'],
    farewell: ['안녕히', '잘가', 'bye', '종료', '끝', '다음에']
};

// 추천 메시지
export const suggestedMessages = [
    { text: "안녕하세요!", category: "greeting" },
    { text: "포트폴리오에 대해 문의드립니다", category: "portfolio" },
    { text: "협업 제안이 있습니다", category: "collaboration" },
    { text: "경력에 대해 알고 싶습니다", category: "experience" },
    { text: "기술 스택이 궁금합니다", category: "skills" }
];