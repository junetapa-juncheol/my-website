// Main Chatbot Controller
import { chatbotConfig, suggestedMessages } from './config/settings.js';
import { UIManager } from './modules/ui.js';
import { ResponseManager } from './modules/responses.js';
import { StorageManager } from './modules/storage.js';
import { AnalyticsManager } from './modules/analytics.js';
import { SearchManager } from './modules/search.js';
import { EmojiManager } from './modules/emoji.js';
import { ThemeManager } from './modules/theme.js';
import { ExportManager } from './modules/export.js';
import { EmailManager } from './modules/email.js';
import { VoiceManager } from './modules/voice.js';

class JunetapaChatbot {
    constructor() {
        this.ui = new UIManager();
        this.responses = new ResponseManager();
        this.storage = new StorageManager();
        this.analytics = new AnalyticsManager(this.storage);
        this.search = new SearchManager(this.storage, this.responses.languageManager);
        this.emoji = new EmojiManager(this.storage, this.responses.languageManager);
        this.theme = new ThemeManager(this.storage, this.responses.languageManager);
        this.export = new ExportManager(this.storage, this.responses.languageManager);
        this.email = new EmailManager(this.storage, this.responses.languageManager, this.export);
        this.voice = new VoiceManager(this.storage, this.responses.languageManager);
        
        this.isInitialized = false;
        this.eventHandlers = new Map();
        this.faqSearchMode = false;
        this.conversationSearchMode = false;
        this.emojiPickerOpen = false;
        this.currentEmojiCategory = 'quick';
        this.themeCustomizerOpen = false;
        this.exportPanelOpen = false;
        this.emailPanelOpen = false;
    }
    
    // 초기화
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // UI 초기화
            this.ui.initializeElements();
            
            // 이벤트 리스너 설정
            this.setupEventListeners();
            
            // 저장된 상태 복원
            this.restoreState();
            
            // 온라인 상태 업데이트
            this.ui.updateOnlineStatus();
            
            // 주기적 업데이트 설정
            this.setupPeriodicUpdates();
            
            // 분석 시작
            this.analytics.trackSessionStart();
            
            // 검색 기록 로드
            this.search.loadSearchHistory();
            
            // 웰컴 메시지
            this.ui.addWelcomeMessage();
            
            // 추천 메시지 설정
            this.setupSuggestions();
            
            // 초기 UI 언어 설정
            this.ui.updateUILanguage();
            
            // 음성 인식 초기화
            this.initializeVoiceCallbacks();
            
            this.isInitialized = true;
            
            // 초기화 완료 이벤트
            this.emit('initialized');
            
        } catch (error) {
            console.error('Chatbot initialization error:', error);
            this.analytics.trackError(error, { phase: 'initialization' });
        }
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        const { elements } = this.ui;
        
        // 런처 클릭
        elements.launcher?.addEventListener('click', () => this.open());
        
        // 헤더 버튼들
        elements.languageBtn?.addEventListener('click', () => this.toggleLanguage());
        elements.minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
        elements.closeBtn?.addEventListener('click', () => this.close());
        
        // 메시지 입력
        elements.input?.addEventListener('keypress', (e) => this.handleKeyPress(e));
        elements.input?.addEventListener('input', () => this.handleInputChange());
        
        // 전송 버튼
        elements.sendBtn?.addEventListener('click', () => this.sendMessage());
        
        // 이모지 피커 버튼
        elements.emojiPickerBtn?.addEventListener('click', () => this.toggleEmojiPicker());
        
        // 이모지 탭 클릭
        elements.emojiTabs?.addEventListener('click', (e) => this.handleEmojiTabClick(e));
        
        // 이모지 피커 내용 클릭
        elements.emojiPickerContent?.addEventListener('click', (e) => this.handleEmojiClick(e));
        
        // 이모지 검색
        elements.emojiSearch?.addEventListener('input', (e) => this.handleEmojiSearch(e));
        
        // 테마 커스터마이저 버튼
        elements.themeBtn?.addEventListener('click', () => this.toggleThemeCustomizer());
        
        // 테마 커스터마이저 닫기
        elements.themeClose?.addEventListener('click', () => this.toggleThemeCustomizer());
        
        // 테마 커스터마이저 내용 클릭
        elements.themeCustomizerContent?.addEventListener('click', (e) => this.handleThemeCustomizerClick(e));
        
        // 내보내기 버튼
        elements.exportBtn?.addEventListener('click', () => this.toggleExportPanel());
        
        // 내보내기 패널 닫기
        elements.exportClose?.addEventListener('click', () => this.toggleExportPanel());
        
        // 내보내기 패널 내용 클릭
        elements.exportPanelContent?.addEventListener('click', (e) => this.handleExportPanelClick(e));
        
        // 이메일 버튼
        elements.emailBtn?.addEventListener('click', () => this.toggleEmailPanel());
        
        // 이메일 패널 닫기
        elements.emailClose?.addEventListener('click', () => this.toggleEmailPanel());
        
        // 이메일 패널 내용 클릭
        elements.emailPanelContent?.addEventListener('click', (e) => this.handleEmailPanelClick(e));
        
        // 음성 인식 버튼
        elements.voiceBtn?.addEventListener('click', () => this.toggleVoiceRecognition());
        
        // 추천 메시지
        elements.suggestions?.addEventListener('click', (e) => this.handleSuggestionClick(e));
        
        // 메시지 액션 버튼
        elements.messages?.addEventListener('click', (e) => this.handleMessageAction(e));
        
        // 검색 버튼
        elements.searchBtn?.addEventListener('click', () => this.toggleSearchMode());
        
        // FAQ 브라우저 버튼 (헤더에 추가)
        elements.faqBtn?.addEventListener('click', () => this.showFAQBrowser());
        
        // 외부 클릭
        if (chatbotConfig.ui.minimizeOnOutsideClick) {
            document.addEventListener('click', (e) => this.handleOutsideClick(e));
        }
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // 페이지 종료
        window.addEventListener('beforeunload', () => this.handlePageUnload());
    }
    
    // 추천 메시지 설정
    setupSuggestions() {
        // UI 모듈의 updateSuggestions 메서드 사용
        this.ui.updateSuggestions();
    }
    
    // 주기적 업데이트 설정
    setupPeriodicUpdates() {
        // 온라인 상태 업데이트 (1분마다)
        setInterval(() => {
            this.ui.updateOnlineStatus();
        }, 60000);
        
        // 분석 데이터 저장 (5분마다)
        setInterval(() => {
            this.analytics.saveEvents();
        }, 300000);
        
        // 오래된 데이터 정리 (1시간마다)
        setInterval(() => {
            this.storage.cleanupOldData();
        }, 3600000);
    }
    
    // 열기
    open() {
        this.ui.open();
        this.saveState();
        this.analytics.trackInteraction('chat_opened');
        this.emit('opened');
    }
    
    // 닫기
    close() {
        this.ui.close();
        this.saveState();
        this.analytics.trackInteraction('chat_closed');
        this.emit('closed');
    }
    
    // 최소화 토글
    toggleMinimize() {
        this.ui.toggleMinimize();
        this.saveState();
        this.analytics.trackInteraction('chat_minimized', { 
            minimized: this.ui.isMinimized 
        });
    }
    
    // 언어 전환
    toggleLanguage() {
        this.ui.toggleLanguage();
        this.responses.languageManager.toggleLanguage();
        this.analytics.trackInteraction('language_changed', {
            language: this.ui.languageManager.getCurrentLanguage()
        });
        this.emit('languageChanged');
    }
    
    // 메시지 전송
    async sendMessage(messageText = null) {
        let message = messageText || this.ui.getInputValue();
        if (!message) return;
        
        // 텍스트 이모지 자동 변환
        message = this.emoji.convertTextToEmoji(message);
        
        // FAQ 검색 모드 확인
        if (this.faqSearchMode) {
            this.performFAQSearch(message);
            this.ui.clearInput();
            return;
        }
        
        // 대화 검색 모드 확인
        if (this.conversationSearchMode) {
            this.performConversationSearch(message);
            this.ui.clearInput();
            return;
        }
        
        // 분석 시작
        const startTime = Date.now();
        
        // 사용자 메시지 추가
        this.ui.addMessage(message, 'user');
        this.ui.clearInput();
        
        // 타이핑 표시
        this.ui.showTypingIndicator();
        
        // 추천 메시지 숨기기
        if (this.ui.elements.messages.children.length > 2) {
            this.ui.toggleSuggestions(false);
        }
        
        try {
            // 스마트 응답 생성
            const response = this.responses.generateSmartResponse(message);
            
            // 지연 시뮬레이션
            const delay = this.calculateTypingDelay(response);
            await this.sleep(delay);
            
            // 봇 메시지 추가
            this.ui.hideTypingIndicator();
            this.ui.addMessage(response, 'bot');
            
            // 후속 질문 제안 (옵션)
            this.suggestFollowUpQuestions();
            
            // 메시지 저장
            this.storage.saveMessage({ text: message, sender: 'user' });
            this.storage.saveMessage({ text: response, sender: 'bot' });
            
            // 분석
            const category = this.responses.lastCategory;
            this.analytics.trackMessage(message, 'user', category);
            this.analytics.trackMessage(response, 'bot', category);
            this.analytics.trackResponseTime(startTime, Date.now(), category);
            
            // 대화 종료 확인
            if (this.responses.isConversationEnding(message)) {
                this.handleConversationEnd();
            }
            
            this.emit('messageSent', { message, response, category });
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.ui.hideTypingIndicator();
            this.ui.showError('죄송합니다. 일시적인 오류가 발생했습니다.');
            this.analytics.trackError(error, { phase: 'message_sending' });
        }
    }
    
    // 키 입력 처리
    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }
    
    // 입력 변경 처리
    handleInputChange() {
        this.ui.updateSendButton();
        
        // 입력 중 표시 (옵션)
        if (this.ui.getInputValue()) {
            this.emit('userTyping');
        }
    }
    
    // 추천 메시지 클릭
    handleSuggestionClick(e) {
        if (!e.target.classList.contains('suggestion-btn')) return;
        
        const message = e.target.dataset.message;
        const category = e.target.dataset.category;
        
        this.ui.setInputValue(message);
        this.sendMessage();
        
        this.analytics.trackInteraction('suggestion_clicked', { category });
    }
    
    // 메시지 액션 처리
    handleMessageAction(e) {
        if (!e.target.classList.contains('message-action')) return;
        
        const action = e.target.dataset.action;
        const value = e.target.dataset.value;
        
        this.emit('messageAction', { action, value });
        
        // 액션별 처리
        switch (action) {
            case 'link':
                window.open(value, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(value);
                this.ui.addMessage('클립보드에 복사되었습니다.', 'bot');
                break;
            case 'scroll':
                const element = document.querySelector(value);
                element?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'followup':
                // 후속 질문 클릭시 자동 입력
                this.ui.setInputValue(value);
                this.sendMessage(value);
                break;
            case 'faq':
                // FAQ 상세 보기
                this.showFAQDetail(value);
                break;
            case 'faq_search':
                // FAQ 검색
                this.performFAQSearch(value);
                break;
            case 'search_suggestion':
                // 검색 제안 클릭
                this.ui.setInputValue(value);
                this.performConversationSearch(value);
                break;
            case 'search_again':
                // 다시 검색
                this.showSearchSuggestions();
                break;
            case 'search_stats':
                // 검색 통계 표시
                this.showSearchStats();
                break;
            case 'emoji_reaction':
                // 이모지 반응 추가
                const messageId = e.target.dataset.messageId;
                if (messageId) {
                    this.addMessageReaction(messageId, value);
                }
                break;
            case 'emoji_stats':
                // 이모지 통계 표시
                this.showEmojiStatistics();
                break;
            case 'theme_stats':
                // 테마 통계 표시
                this.showThemeStats();
                break;
        }
        
        this.analytics.trackInteraction('message_action', { action, value });
    }
    
    // FAQ 브라우저 표시
    showFAQBrowser() {
        const faqBrowserResponse = this.responses.generateFAQBrowser();
        this.ui.addMessage(faqBrowserResponse, 'bot', {
            actions: [
                { label: '🔍 FAQ 검색', type: 'faq_search', value: 'search' },
                { label: '📞 연락처', type: 'faq', value: 'contact_method' },
                { label: '💼 주요 기술', type: 'faq', value: 'main_skills' },
                { label: '🤝 협업 가능한 일', type: 'faq', value: 'collaboration_types' }
            ]
        });
        
        this.analytics.trackInteraction('faq_browser_opened');
    }
    
    // FAQ 상세 보기
    showFAQDetail(faqId) {
        const language = this.responses.languageManager.getCurrentLanguage();
        const faqs = this.responses.faqManager.faqData[language] || this.responses.faqManager.faqData.ko;
        const allFAQs = Object.values(faqs).flat();
        
        const faq = allFAQs.find(f => f.id === faqId);
        if (faq) {
            const response = faq.answer;
            const relatedFAQs = this.responses.faqManager.findRelatedFAQs(faqId, 3);
            
            let actions = [];
            if (relatedFAQs.length > 0) {
                actions = relatedFAQs.map(related => ({
                    label: related.question,
                    type: 'faq',
                    value: related.id
                }));
            }
            
            this.ui.addMessage(response, 'bot', { actions });
            this.analytics.trackInteraction('faq_detail_viewed', { faqId });
        }
    }
    
    // FAQ 검색 수행
    performFAQSearch(query) {
        if (query === 'search') {
            // 검색 모드 활성화
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const message = currentLang === 'ko' ? 
                '검색하고 싶은 키워드를 입력해 주세요. 예: "연락처", "기술", "경력" 등' :
                'Please enter keywords to search. Example: "contact", "skills", "experience", etc.';
            
            this.ui.addMessage(message, 'bot');
            this.ui.elements.input.placeholder = currentLang === 'ko' ? 'FAQ 검색...' : 'Search FAQ...';
            this.faqSearchMode = true;
        } else {
            // 실제 검색 수행
            const results = this.responses.searchFAQs(query);
            
            if (results.length > 0) {
                const currentLang = this.responses.languageManager.getCurrentLanguage();
                let response = currentLang === 'ko' ? 
                    `"${query}" 검색 결과 (${results.length}개):\n\n` :
                    `Search results for "${query}" (${results.length} found):\n\n`;
                
                const actions = results.slice(0, 5).map((faq, index) => ({
                    label: `${index + 1}. ${faq.question[0]}`,
                    type: 'faq',
                    value: faq.id
                }));
                
                this.ui.addMessage(response, 'bot', { actions });
            } else {
                const currentLang = this.responses.languageManager.getCurrentLanguage();
                const noResultsMsg = currentLang === 'ko' ?
                    '검색 결과가 없습니다. 다른 키워드로 시도해 보세요.' :
                    'No results found. Please try different keywords.';
                
                this.ui.addMessage(noResultsMsg, 'bot');
            }
            
            this.faqSearchMode = false;
            this.ui.elements.input.placeholder = '';
        }
    }
    
    // 검색 모드 토글
    toggleSearchMode() {
        this.conversationSearchMode = !this.conversationSearchMode;
        
        if (this.conversationSearchMode) {
            // 검색 모드 활성화
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const message = currentLang === 'ko' ? 
                '🔍 대화 검색 모드가 활성화되었습니다. 검색할 내용을 입력해주세요.' :
                '🔍 Conversation search mode activated. Enter your search query.';
            
            this.ui.addMessage(message, 'bot');
            this.ui.elements.input.placeholder = currentLang === 'ko' ? '대화 내용 검색...' : 'Search conversations...';
            
            // 검색 제안 표시
            this.showSearchSuggestions();
        } else {
            // 검색 모드 비활성화
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const message = currentLang === 'ko' ? 
                '검색 모드가 종료되었습니다.' :
                'Search mode deactivated.';
            
            this.ui.addMessage(message, 'bot');
            this.ui.elements.input.placeholder = '';
        }
        
        this.analytics.trackInteraction('search_mode_toggled', { 
            active: this.conversationSearchMode 
        });
    }
    
    // 검색 제안 표시
    showSearchSuggestions() {
        const suggestions = this.search.generateSearchSuggestions();
        
        if (suggestions.length > 0) {
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            let message = currentLang === 'ko' ? 
                '💡 추천 검색어:\\n\\n' :
                '💡 Suggested searches:\\n\\n';
            
            const actions = suggestions.slice(0, 6).map(suggestion => ({
                label: suggestion,
                type: 'search_suggestion',
                value: suggestion
            }));
            
            this.ui.addMessage(message, 'bot', { actions });
        }
    }
    
    // 대화 검색 수행
    performConversationSearch(query) {
        const results = this.search.searchConversations(query, { limit: 10 });
        
        if (results.total === 0) {
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const noResultsMsg = currentLang === 'ko' ?
                `"${query}"에 대한 검색 결과가 없습니다. 다른 키워드를 시도해보세요.` :
                `No results found for "${query}". Try different keywords.`;
            
            this.ui.addMessage(noResultsMsg, 'bot');
            this.showSearchSuggestions();
            return;
        }
        
        // 검색 결과 표시
        this.displaySearchResults(results);
        
        // 검색 통계 업데이트
        this.analytics.trackInteraction('conversation_search', { 
            query, 
            resultCount: results.total 
        });
    }
    
    // 검색 결과 표시
    displaySearchResults(results) {
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let response = currentLang === 'ko' ?
            `🔍 "${results.query}" 검색 결과 (${results.total}개 발견):\\n\\n` :
            `🔍 Search results for "${results.query}" (${results.total} found):\\n\\n`;
        
        // 상위 결과들 표시
        results.results.slice(0, 5).forEach((result, index) => {
            const messageDate = new Date(result.message.timestamp).toLocaleDateString();
            const sender = result.message.sender === 'user' ? 
                (currentLang === 'ko' ? '사용자' : 'User') : 
                (currentLang === 'ko' ? '봇' : 'Bot');
            
            const snippet = this.search.generateSnippet(result.message.text, results.query);
            const highlightedSnippet = this.search.highlightSearchResults(snippet, results.query);
            
            response += `**${index + 1}. ${sender}** (${messageDate})\\n`;
            response += `${highlightedSnippet}\\n\\n`;
        });
        
        // 더 많은 결과가 있는 경우
        if (results.total > 5) {
            response += currentLang === 'ko' ?
                `그리고 ${results.total - 5}개 결과가 더 있습니다.` :
                `And ${results.total - 5} more results.`;
        }
        
        // 액션 버튼 생성
        const actions = [
            {
                label: currentLang === 'ko' ? '🔍 다시 검색' : '🔍 Search Again',
                type: 'search_again',
                value: 'new_search'
            },
            {
                label: currentLang === 'ko' ? '📊 검색 통계' : '📊 Search Stats',
                type: 'search_stats',
                value: 'show_stats'
            }
        ];
        
        this.ui.addMessage(response, 'bot', { actions, allowHTML: true });
    }
    
    // 검색 통계 표시
    showSearchStats() {
        const stats = this.search.getSearchStats();
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let response = currentLang === 'ko' ?
            '📊 대화 & 검색 통계:\\n\\n' :
            '📊 Conversation & Search Statistics:\\n\\n';
        
        // 대화 통계
        response += currentLang === 'ko' ?
            `💬 **대화 통계:**\\n` :
            `💬 **Conversation Stats:**\\n`;
        response += currentLang === 'ko' ?
            `• 총 메시지: ${stats.totalMessages}개\\n` :
            `• Total messages: ${stats.totalMessages}\\n`;
        response += currentLang === 'ko' ?
            `• 사용자 메시지: ${stats.userMessages}개\\n` :
            `• User messages: ${stats.userMessages}\\n`;
        response += currentLang === 'ko' ?
            `• 봇 응답: ${stats.botMessages}개\\n\\n` :
            `• Bot responses: ${stats.botMessages}\\n\\n`;
        
        // 검색 통계
        response += currentLang === 'ko' ?
            `🔍 **검색 통계:**\\n` :
            `🔍 **Search Stats:**\\n`;
        response += currentLang === 'ko' ?
            `• 총 검색 횟수: ${stats.searchHistory}회\\n` :
            `• Total searches: ${stats.searchHistory}\\n`;
        
        // 최근 검색어
        if (stats.recentSearches.length > 0) {
            response += currentLang === 'ko' ?
                `• 최근 검색어:\\n` :
                `• Recent searches:\\n`;
            
            stats.recentSearches.forEach((search, index) => {
                const date = new Date(search.timestamp).toLocaleDateString();
                response += `  ${index + 1}. "${search.query}" (${search.results}개 결과, ${date})\\n`;
            });
        }
        
        this.ui.addMessage(response, 'bot');
    }
    
    // 이모지 피커 토글
    toggleEmojiPicker() {
        this.emojiPickerOpen = !this.emojiPickerOpen;
        
        if (this.emojiPickerOpen) {
            this.ui.elements.emojiPicker.style.display = 'block';
            this.loadEmojiCategory(this.currentEmojiCategory);
            
            // 다른 기능들 닫기
            this.faqSearchMode = false;
            this.conversationSearchMode = false;
        } else {
            this.ui.elements.emojiPicker.style.display = 'none';
        }
        
        this.analytics.trackInteraction('emoji_picker_toggled', { 
            open: this.emojiPickerOpen 
        });
    }
    
    // 이모지 카테고리 로드
    loadEmojiCategory(category) {
        const pickerData = this.emoji.generateEmojiPicker();
        const content = this.ui.elements.emojiPickerContent;
        
        if (!content) return;
        
        let emojis = [];
        
        switch (category) {
            case 'quick':
                emojis = pickerData.quickEmojis;
                break;
            case 'recent':
                emojis = pickerData.recentEmojis;
                break;
            case 'popular':
                emojis = pickerData.popularEmojis;
                break;
            default:
                const categoryData = pickerData.categories.find(cat => cat.id === category);
                emojis = categoryData ? categoryData.emojis : [];
        }
        
        // 이모지 그리드 생성
        const grid = document.createElement('div');
        grid.className = 'emoji-grid';
        
        emojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-item';
            button.textContent = emoji;
            button.dataset.emoji = emoji;
            button.title = emoji;
            grid.appendChild(button);
        });
        
        content.innerHTML = '';
        content.appendChild(grid);
        
        this.currentEmojiCategory = category;
    }
    
    // 이모지 탭 클릭 처리
    handleEmojiTabClick(e) {
        if (!e.target.classList.contains('emoji-tab')) return;
        
        // 활성 탭 변경
        this.ui.elements.emojiTabs.querySelectorAll('.emoji-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // 카테고리 로드
        const category = e.target.dataset.category;
        this.loadEmojiCategory(category);
        
        this.analytics.trackInteraction('emoji_category_selected', { category });
    }
    
    // 이모지 클릭 처리
    handleEmojiClick(e) {
        if (!e.target.classList.contains('emoji-item')) return;
        
        const emoji = e.target.dataset.emoji;
        if (emoji) {
            this.insertEmojiToInput(emoji);
            this.toggleEmojiPicker(); // 피커 닫기
            
            this.analytics.trackInteraction('emoji_selected', { emoji });
        }
    }
    
    // 이모지를 입력창에 삽입
    insertEmojiToInput(emoji) {
        const input = this.ui.elements.input;
        if (!input) return;
        
        const currentValue = input.value;
        const cursorPos = input.selectionStart;
        
        const newValue = 
            currentValue.slice(0, cursorPos) + 
            emoji + 
            currentValue.slice(cursorPos);
        
        input.value = newValue;
        input.focus();
        
        // 커서 위치 조정
        const newCursorPos = cursorPos + emoji.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
        
        // 전송 버튼 상태 업데이트
        this.ui.updateSendButton();
    }
    
    // 이모지 검색 처리
    handleEmojiSearch(e) {
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            // 검색어가 없으면 현재 카테고리 로드
            this.loadEmojiCategory(this.currentEmojiCategory);
            return;
        }
        
        if (query.length < 2) return;
        
        // 이모지 검색 수행
        const results = this.emoji.searchEmojis(query);
        
        const content = this.ui.elements.emojiPickerContent;
        if (!content) return;
        
        const grid = document.createElement('div');
        grid.className = 'emoji-grid';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.textContent = '검색 결과가 없습니다';
            noResults.style.textAlign = 'center';
            noResults.style.color = 'var(--text-tertiary)';
            noResults.style.padding = '20px';
            content.innerHTML = '';
            content.appendChild(noResults);
            return;
        }
        
        results.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-item';
            button.textContent = emoji;
            button.dataset.emoji = emoji;
            button.title = emoji;
            grid.appendChild(button);
        });
        
        content.innerHTML = '';
        content.appendChild(grid);
        
        this.analytics.trackInteraction('emoji_search', { 
            query, 
            resultCount: results.length 
        });
    }
    
    // 메시지에 반응 추가
    addMessageReaction(messageId, emoji) {
        const reaction = this.emoji.addReaction(messageId, emoji);
        this.updateMessageReactions(messageId);
        
        this.analytics.trackInteraction('message_reaction_added', { 
            emoji, 
            messageId 
        });
        
        return reaction;
    }
    
    // 메시지 반응 업데이트 (UI)
    updateMessageReactions(messageId) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;
        
        const reactions = this.emoji.getReactionSummary(messageId);
        let reactionsContainer = messageElement.querySelector('.message-reactions');
        
        if (!reactionsContainer) {
            reactionsContainer = document.createElement('div');
            reactionsContainer.className = 'message-reactions';
            messageElement.appendChild(reactionsContainer);
        }
        
        // 반응 버튼들 생성
        let reactionsHTML = '';
        Object.entries(reactions).forEach(([emoji, data]) => {
            const isUserReacted = data.users.includes('user');
            reactionsHTML += `
                <button class="reaction-btn ${isUserReacted ? 'user-reacted' : ''}" 
                        data-emoji="${emoji}" 
                        data-message-id="${messageId}">
                    ${emoji}
                    <span class="reaction-count">${data.count}</span>
                </button>
            `;
        });
        
        // 반응 추가 버튼
        reactionsHTML += `
            <button class="add-reaction-btn" data-message-id="${messageId}">
                +
            </button>
        `;
        
        reactionsContainer.innerHTML = reactionsHTML;
    }
    
    // 이모지 통계 표시
    showEmojiStatistics() {
        const stats = this.emoji.getEmojiStatistics();
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let response = currentLang === 'ko' ?
            '📊 이모지 사용 통계:\\n\\n' :
            '📊 Emoji Usage Statistics:\\n\\n';
        
        response += currentLang === 'ko' ?
            `📈 **전체 반응:** ${stats.totalReactions}개\\n` :
            `📈 **Total Reactions:** ${stats.totalReactions}\\n`;
        
        response += currentLang === 'ko' ?
            `🎭 **사용된 이모지 종류:** ${stats.uniqueEmojis}개\\n\\n` :
            `🎭 **Unique Emojis Used:** ${stats.uniqueEmojis}\\n\\n`;
        
        if (stats.topEmojis.length > 0) {
            response += currentLang === 'ko' ?
                `🏆 **인기 이모지:**\\n` :
                `🏆 **Top Emojis:**\\n`;
            
            stats.topEmojis.forEach((item, index) => {
                response += `${index + 1}. ${item.emoji} - ${item.count}회 (${item.percentage}%)\\n`;
            });
        }
        
        this.ui.addMessage(response, 'bot');
    }
    
    // 테마 커스터마이저 토글
    toggleThemeCustomizer() {
        this.themeCustomizerOpen = !this.themeCustomizerOpen;
        
        if (this.themeCustomizerOpen) {
            this.ui.elements.themeCustomizer.style.display = 'flex';
            this.loadThemeCustomizer();
            
            // 다른 패널들 닫기
            this.emojiPickerOpen = false;
            this.ui.elements.emojiPicker.style.display = 'none';
        } else {
            this.ui.elements.themeCustomizer.style.display = 'none';
        }
        
        this.analytics.trackInteraction('theme_customizer_toggled', { 
            open: this.themeCustomizerOpen 
        });
    }
    
    // 테마 커스터마이저 로드
    loadThemeCustomizer() {
        const customizerData = this.theme.generateThemeCustomizer();
        const content = this.ui.elements.themeCustomizerContent;
        
        if (!content) return;
        
        let html = '';
        
        // 테마 선택 섹션
        html += `
            <div class="theme-section">
                <h4>🎨 테마 선택</h4>
                <div class="theme-grid">
        `;
        
        customizerData.themes.forEach(theme => {
            html += `
                <div class="theme-option ${theme.current ? 'active' : ''}" data-theme="${theme.id}">
                    <div class="theme-preview" style="background: ${theme.preview};">
                        ${theme.name}
                    </div>
                    <div class="theme-name">${theme.name}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        // 커스터마이제이션 섹션들
        Object.entries(customizerData.customizations).forEach(([key, customization]) => {
            html += `
                <div class="customization-group">
                    <h4>${customization.label}</h4>
                    <div class="customization-options">
            `;
            
            customization.options.forEach(option => {
                html += `
                    <button class="customization-option ${option.current ? 'active' : ''}" 
                            data-type="${key}" 
                            data-value="${option.id}">
                        ${option.label}
                    </button>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        // 시스템 테마 따르기 토글
        html += `
            <div class="theme-toggle">
                <span class="theme-toggle-label">${customizerData.settings.followSystem.label}</span>
                <div class="toggle-switch ${customizerData.settings.followSystem.value ? 'active' : ''}" 
                     data-toggle="followSystem">
                    <div class="toggle-knob"></div>
                </div>
            </div>
        `;
        
        // 액션 버튼들
        html += `
            <div class="theme-actions">
                <button class="theme-action-btn" data-action="reset">리셋</button>
                <button class="theme-action-btn" data-action="export">내보내기</button>
                <button class="theme-action-btn" data-action="import">가져오기</button>
            </div>
        `;
        
        content.innerHTML = html;
    }
    
    // 테마 커스터마이저 클릭 처리
    handleThemeCustomizerClick(e) {
        const target = e.target;
        
        // 테마 선택
        if (target.closest('.theme-option')) {
            const themeOption = target.closest('.theme-option');
            const themeId = themeOption.dataset.theme;
            
            if (themeId) {
                this.theme.setTheme(themeId);
                this.loadThemeCustomizer(); // UI 업데이트
                
                this.analytics.trackInteraction('theme_changed', { theme: themeId });
            }
        }
        
        // 커스터마이제이션 옵션
        else if (target.classList.contains('customization-option')) {
            const type = target.dataset.type;
            const value = target.dataset.value;
            
            if (type && value) {
                this.applyCustomization(type, value);
                this.loadThemeCustomizer(); // UI 업데이트
                
                this.analytics.trackInteraction('theme_customization_changed', { type, value });
            }
        }
        
        // 토글 스위치
        else if (target.closest('.toggle-switch')) {
            const toggle = target.closest('.toggle-switch');
            const toggleType = toggle.dataset.toggle;
            
            if (toggleType === 'followSystem') {
                const isActive = toggle.classList.contains('active');
                this.theme.setFollowSystemTheme(!isActive);
                this.loadThemeCustomizer(); // UI 업데이트
                
                this.analytics.trackInteraction('theme_follow_system_toggled', { value: !isActive });
            }
        }
        
        // 액션 버튼
        else if (target.classList.contains('theme-action-btn')) {
            const action = target.dataset.action;
            this.handleThemeAction(action);
        }
    }
    
    // 커스터마이제이션 적용
    applyCustomization(type, value) {
        switch (type) {
            case 'fontSize':
                this.theme.setFontSize(value);
                break;
            case 'borderRadius':
                this.theme.setBorderRadius(value);
                break;
            case 'chatBubbleStyle':
                this.theme.setChatBubbleStyle(value);
                break;
            case 'animation':
                this.theme.setAnimation(value);
                break;
        }
    }
    
    // 테마 액션 처리
    handleThemeAction(action) {
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        switch (action) {
            case 'reset':
                if (confirm(currentLang === 'ko' ? 
                    '테마 설정을 초기화하시겠습니까?' : 
                    'Reset theme settings to default?')) {
                    this.theme.resetTheme();
                    this.loadThemeCustomizer();
                    
                    const message = currentLang === 'ko' ?
                        '테마가 초기화되었습니다.' :
                        'Theme has been reset to default.';
                    this.ui.addMessage(message, 'bot');
                }
                break;
                
            case 'export':
                const themeData = this.theme.exportTheme();
                navigator.clipboard.writeText(themeData).then(() => {
                    const message = currentLang === 'ko' ?
                        '테마 설정이 클립보드에 복사되었습니다.' :
                        'Theme settings copied to clipboard.';
                    this.ui.addMessage(message, 'bot');
                });
                break;
                
            case 'import':
                const importData = prompt(currentLang === 'ko' ?
                    '테마 데이터를 붙여넣어 주세요:' :
                    'Paste theme data:');
                
                if (importData) {
                    const success = this.theme.importTheme(importData);
                    const message = success ?
                        (currentLang === 'ko' ? '테마가 성공적으로 가져와졌습니다.' : 'Theme imported successfully.') :
                        (currentLang === 'ko' ? '테마 가져오기에 실패했습니다.' : 'Failed to import theme.');
                    
                    this.ui.addMessage(message, 'bot');
                    
                    if (success) {
                        this.loadThemeCustomizer();
                    }
                }
                break;
        }
        
        this.analytics.trackInteraction('theme_action', { action });
    }
    
    // 테마 통계 표시
    showThemeStats() {
        const stats = this.theme.getThemeStats();
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let response = currentLang === 'ko' ?
            '🎨 테마 설정 현황:\\n\\n' :
            '🎨 Theme Settings Status:\\n\\n';
        
        response += currentLang === 'ko' ?
            `🎯 **현재 테마:** ${stats.currentTheme}\\n` :
            `🎯 **Current Theme:** ${stats.currentTheme}\\n`;
        
        response += currentLang === 'ko' ?
            `⚙️ **커스터마이제이션:** ${stats.totalCustomizations}개 설정\\n` :
            `⚙️ **Customizations:** ${stats.totalCustomizations} settings\\n`;
        
        response += currentLang === 'ko' ?
            `🎨 **커스텀 색상:** ${stats.hasCustomColors ? '적용됨' : '없음'}\\n` :
            `🎨 **Custom Colors:** ${stats.hasCustomColors ? 'Applied' : 'None'}\\n`;
        
        response += currentLang === 'ko' ?
            `🔄 **시스템 테마 따르기:** ${stats.followsSystem ? '활성' : '비활성'}\\n` :
            `🔄 **Follow System Theme:** ${stats.followsSystem ? 'Enabled' : 'Disabled'}\\n`;
        
        this.ui.addMessage(response, 'bot');
    }
    
    // 내보내기 패널 토글
    toggleExportPanel() {
        this.exportPanelOpen = !this.exportPanelOpen;
        
        if (this.exportPanelOpen) {
            this.ui.elements.exportPanel.style.display = 'flex';
            this.loadExportPanel();
            
            // 다른 패널들 닫기
            this.emojiPickerOpen = false;
            this.ui.elements.emojiPicker.style.display = 'none';
            this.themeCustomizerOpen = false;
            this.ui.elements.themeCustomizer.style.display = 'none';
        } else {
            this.ui.elements.exportPanel.style.display = 'none';
        }
        
        this.analytics.trackInteraction('export_panel_toggled', { 
            open: this.exportPanelOpen 
        });
    }
    
    // 내보내기 패널 로드
    loadExportPanel() {
        const exportOptions = this.export.generateExportOptions();
        const stats = this.export.getExportStats();
        const content = this.ui.elements.exportPanelContent;
        
        if (!content) return;
        
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let html = '';
        
        // 통계 섹션
        html += `
            <div class="export-stats">
                <div><strong>${currentLang === 'ko' ? '총 메시지' : 'Total Messages'}:</strong> ${stats.totalMessages}</div>
                <div><strong>${currentLang === 'ko' ? '사용자 메시지' : 'User Messages'}:</strong> ${stats.userMessages}</div>
                <div><strong>${currentLang === 'ko' ? '봇 메시지' : 'Bot Messages'}:</strong> ${stats.botMessages}</div>
                ${stats.dateRange.first ? `<div><strong>${currentLang === 'ko' ? '기간' : 'Period'}:</strong> ${stats.dateRange.first.toLocaleDateString()} - ${stats.dateRange.last.toLocaleDateString()}</div>` : ''}
            </div>
        `;
        
        // 포맷 선택 섹션
        html += `
            <div class="export-section">
                <h4>${currentLang === 'ko' ? '내보내기 형식' : 'Export Format'}</h4>
                <div class="export-format-grid">
                    ${exportOptions.formats.map(format => `
                        <div class="export-format ${format.id === 'txt' ? 'active' : ''}" 
                             data-format="${format.id}">
                            ${format.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 옵션 섹션
        html += `
            <div class="export-section">
                <h4>${currentLang === 'ko' ? '내보내기 옵션' : 'Export Options'}</h4>
                <div class="export-options">
                    ${Object.entries(exportOptions.options).map(([key, option]) => `
                        <label class="export-option">
                            <input type="checkbox" id="export-${key}" ${option.default ? 'checked' : ''}>
                            ${option.label}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 액션 버튼
        html += `
            <div class="export-actions">
                <button class="export-btn primary" data-action="download">
                    ${currentLang === 'ko' ? '다운로드' : 'Download'}
                </button>
                <button class="export-btn secondary" data-action="copy">
                    ${currentLang === 'ko' ? '복사' : 'Copy'}
                </button>
            </div>
        `;
        
        content.innerHTML = html;
    }
    
    // 내보내기 패널 클릭 처리
    handleExportPanelClick(e) {
        const target = e.target;
        
        // 포맷 선택
        if (target.classList.contains('export-format')) {
            // 모든 포맷에서 active 제거
            this.ui.elements.exportPanelContent.querySelectorAll('.export-format').forEach(el => {
                el.classList.remove('active');
            });
            
            // 선택된 포맷에 active 추가
            target.classList.add('active');
            
            this.analytics.trackInteraction('export_format_selected', { 
                format: target.dataset.format 
            });
        }
        
        // 액션 버튼
        else if (target.classList.contains('export-btn')) {
            const action = target.dataset.action;
            this.handleExportAction(action);
        }
    }
    
    // 내보내기 액션 처리
    handleExportAction(action) {
        const content = this.ui.elements.exportPanelContent;
        const selectedFormat = content.querySelector('.export-format.active');
        const format = selectedFormat?.dataset.format || 'txt';
        
        // 옵션 수집
        const options = {
            includeTimestamps: content.querySelector('#export-includeTimestamps')?.checked || true,
            includeReactions: content.querySelector('#export-includeReactions')?.checked || true,
            includeMetadata: content.querySelector('#export-includeMetadata')?.checked || false
        };
        
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        try {
            switch (action) {
                case 'download':
                    const result = this.export.exportChat(format, options);
                    this.export.downloadFile(result.content, result.filename, result.mimeType);
                    
                    const downloadMessage = currentLang === 'ko' ?
                        `채팅이 ${format.toUpperCase()} 형식으로 다운로드되었습니다.` :
                        `Chat exported as ${format.toUpperCase()} format.`;
                    
                    this.ui.addMessage(downloadMessage, 'bot');
                    break;
                    
                case 'copy':
                    const copyResult = this.export.exportChat(format, options);
                    this.export.copyToClipboard(copyResult.content).then(() => {
                        const copyMessage = currentLang === 'ko' ?
                            '채팅이 클립보드에 복사되었습니다.' :
                            'Chat copied to clipboard.';
                        
                        this.ui.addMessage(copyMessage, 'bot');
                    }).catch((error) => {
                        const errorMessage = currentLang === 'ko' ?
                            '클립보드 복사에 실패했습니다.' :
                            'Failed to copy to clipboard.';
                        
                        this.ui.addMessage(errorMessage, 'bot');
                    });
                    break;
            }
            
            this.analytics.trackInteraction('export_action', { action, format });
            
        } catch (error) {
            console.error('Export error:', error);
            const errorMessage = currentLang === 'ko' ?
                '내보내기에 실패했습니다.' :
                'Export failed.';
            
            this.ui.addMessage(errorMessage, 'bot');
            this.analytics.trackError(error, { context: 'export_action', action, format });
        }
    }
    
    // 이메일 패널 토글
    toggleEmailPanel() {
        this.emailPanelOpen = !this.emailPanelOpen;
        
        if (this.emailPanelOpen) {
            this.ui.elements.emailPanel.style.display = 'flex';
            this.loadEmailPanel();
            
            // 다른 패널들 닫기
            this.emojiPickerOpen = false;
            this.ui.elements.emojiPicker.style.display = 'none';
            this.themeCustomizerOpen = false;
            this.ui.elements.themeCustomizer.style.display = 'none';
            this.exportPanelOpen = false;
            this.ui.elements.exportPanel.style.display = 'none';
        } else {
            this.ui.elements.emailPanel.style.display = 'none';
        }
        
        this.analytics.trackInteraction('email_panel_toggled', { 
            open: this.emailPanelOpen 
        });
    }
    
    // 이메일 패널 로드
    loadEmailPanel(emailType = 'chatHistory') {
        const formData = this.email.generateEmailForm(emailType);
        const stats = this.email.getEmailStats();
        const content = this.ui.elements.emailPanelContent;
        
        if (!content) return;
        
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let html = '';
        
        // 통계 섹션
        if (stats.totalSent > 0) {
            html += `
                <div class="email-stats">
                    <div><strong>${currentLang === 'ko' ? '전송된 이메일' : 'Emails Sent'}:</strong> ${stats.totalSent}</div>
                    <div><strong>${currentLang === 'ko' ? '성공률' : 'Success Rate'}:</strong> ${stats.totalSent > 0 ? Math.round(stats.successCount / stats.totalSent * 100) : 0}%</div>
                    ${stats.lastSent ? `<div><strong>${currentLang === 'ko' ? '마지막 전송' : 'Last Sent'}:</strong> ${new Date(stats.lastSent).toLocaleDateString()}</div>` : ''}
                </div>
            `;
        }
        
        // 이메일 타입 선택
        html += `
            <div class="email-type-selector">
                <button class="email-type-btn ${emailType === 'chatHistory' ? 'active' : ''}" data-type="chatHistory">
                    ${currentLang === 'ko' ? '채팅 기록' : 'Chat History'}
                </button>
                <button class="email-type-btn ${emailType === 'quickMessage' ? 'active' : ''}" data-type="quickMessage">
                    ${currentLang === 'ko' ? '빠른 메시지' : 'Quick Message'}
                </button>
                <button class="email-type-btn ${emailType === 'contactRequest' ? 'active' : ''}" data-type="contactRequest">
                    ${currentLang === 'ko' ? '연락처 요청' : 'Contact Request'}
                </button>
            </div>
        `;
        
        // 이메일 폼
        html += `
            <form class="email-form" id="emailForm">
                ${formData.fields.map(field => {
                    const fieldClass = field.required ? 'email-field required' : 'email-field';
                    
                    if (field.type === 'textarea') {
                        return `
                            <div class="${fieldClass}">
                                <label for="${field.id}">${field.label}</label>
                                <textarea id="${field.id}" name="${field.id}" 
                                         placeholder="${field.placeholder}" 
                                         ${field.required ? 'required' : ''}></textarea>
                            </div>
                        `;
                    } else if (field.type === 'select') {
                        return `
                            <div class="${fieldClass}">
                                <label for="${field.id}">${field.label}</label>
                                <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
                                    ${field.options.map(option => `
                                        <option value="${option.value}">${option.label}</option>
                                    `).join('')}
                                </select>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="${fieldClass}">
                                <label for="${field.id}">${field.label}</label>
                                <input type="${field.type}" id="${field.id}" name="${field.id}" 
                                       placeholder="${field.placeholder}" 
                                       ${field.required ? 'required' : ''}>
                            </div>
                        `;
                    }
                }).join('')}
                
                <div class="email-loading" id="emailLoading">
                    <div class="email-spinner"></div>
                    ${currentLang === 'ko' ? '이메일 전송 중...' : 'Sending email...'}
                </div>
                
                <div class="email-actions">
                    <button type="submit" class="email-btn primary">
                        ${currentLang === 'ko' ? '전송' : 'Send'}
                    </button>
                    <button type="button" class="email-btn secondary" data-action="preview">
                        ${currentLang === 'ko' ? '미리보기' : 'Preview'}
                    </button>
                </div>
            </form>
        `;
        
        content.innerHTML = html;
        
        // 이메일 자동완성 설정
        this.setupEmailAutocomplete();
    }
    
    // 이메일 자동완성 설정
    setupEmailAutocomplete() {
        const emailInput = this.ui.elements.emailPanelContent.querySelector('#senderEmail');
        if (!emailInput) return;
        
        const suggestions = this.email.getEmailSuggestions();
        if (suggestions.length === 0) return;
        
        // 자동완성 컨테이너 생성
        const suggestionContainer = document.createElement('div');
        suggestionContainer.className = 'email-suggestions';
        emailInput.parentNode.style.position = 'relative';
        emailInput.parentNode.appendChild(suggestionContainer);
        
        emailInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value.length < 2) {
                suggestionContainer.style.display = 'none';
                return;
            }
            
            const filteredSuggestions = suggestions.filter(email => 
                email.toLowerCase().startsWith(value)
            );
            
            if (filteredSuggestions.length > 0) {
                suggestionContainer.innerHTML = filteredSuggestions
                    .map(email => `<div class="email-suggestion" data-email="${email}">${email}</div>`)
                    .join('');
                suggestionContainer.style.display = 'block';
            } else {
                suggestionContainer.style.display = 'none';
            }
        });
        
        // 제안 클릭 처리
        suggestionContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('email-suggestion')) {
                emailInput.value = e.target.dataset.email;
                suggestionContainer.style.display = 'none';
            }
        });
        
        // 외부 클릭시 숨기기
        document.addEventListener('click', (e) => {
            if (!emailInput.parentNode.contains(e.target)) {
                suggestionContainer.style.display = 'none';
            }
        });
    }
    
    // 이메일 패널 클릭 처리
    handleEmailPanelClick(e) {
        const target = e.target;
        
        // 이메일 타입 선택
        if (target.classList.contains('email-type-btn')) {
            const emailType = target.dataset.type;
            
            // 모든 타입 버튼에서 active 제거
            this.ui.elements.emailPanelContent.querySelectorAll('.email-type-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 선택된 타입에 active 추가
            target.classList.add('active');
            
            // 폼 다시 로드
            this.loadEmailPanel(emailType);
            
            this.analytics.trackInteraction('email_type_selected', { 
                type: emailType 
            });
        }
        
        // 미리보기 버튼
        else if (target.dataset.action === 'preview') {
            this.previewEmail();
        }
        
        // 폼 제출
        else if (target.type === 'submit') {
            e.preventDefault();
            this.sendEmailFromForm();
        }
    }
    
    // 이메일 미리보기
    async previewEmail() {
        const formData = this.getEmailFormData();
        if (!formData) return;
        
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        const activeType = this.ui.elements.emailPanelContent.querySelector('.email-type-btn.active')?.dataset.type || 'chatHistory';
        
        let emailData;
        try {
            switch (activeType) {
                case 'chatHistory':
                    emailData = await this.email.prepareChatHistoryEmail(formData);
                    break;
                case 'quickMessage':
                    emailData = this.email.prepareQuickMessageEmail(formData);
                    break;
                case 'contactRequest':
                    emailData = this.email.prepareContactRequestEmail(formData);
                    break;
            }
            
            const previewMessage = currentLang === 'ko' ?
                `📧 **이메일 미리보기**\n\n**제목:** ${emailData.subject}\n**수신자:** ${emailData.to}\n**발신자:** ${emailData.fromName} (${emailData.from})\n\n**내용 미리보기:**\n${emailData.body.substring(0, 200)}${emailData.body.length > 200 ? '...' : ''}` :
                `📧 **Email Preview**\n\n**Subject:** ${emailData.subject}\n**To:** ${emailData.to}\n**From:** ${emailData.fromName} (${emailData.from})\n\n**Content Preview:**\n${emailData.body.substring(0, 200)}${emailData.body.length > 200 ? '...' : ''}`;
            
            this.ui.addMessage(previewMessage, 'bot');
            
        } catch (error) {
            const errorMessage = currentLang === 'ko' ?
                '이메일 미리보기 생성에 실패했습니다.' :
                'Failed to generate email preview.';
            
            this.ui.addMessage(errorMessage, 'bot');
        }
    }
    
    // 폼에서 이메일 전송
    async sendEmailFromForm() {
        const formData = this.getEmailFormData();
        if (!formData) return;
        
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        const activeType = this.ui.elements.emailPanelContent.querySelector('.email-type-btn.active')?.dataset.type || 'chatHistory';
        
        // 로딩 표시
        const loading = this.ui.elements.emailPanelContent.querySelector('#emailLoading');
        const submitBtn = this.ui.elements.emailPanelContent.querySelector('.email-btn.primary');
        
        loading.classList.add('active');
        submitBtn.disabled = true;
        
        try {
            const result = await this.email.sendEmail(activeType, formData);
            
            if (result.success) {
                this.ui.addMessage(result.message, 'bot');
                
                // 최근 이메일 저장
                if (formData.senderEmail) {
                    this.email.saveRecentEmail(formData.senderEmail);
                }
                
                // 통계 업데이트
                this.email.updateEmailStats(activeType, true);
                
                // 패널 닫기
                this.toggleEmailPanel();
            } else {
                this.ui.addMessage(result.message, 'bot');
                this.email.updateEmailStats(activeType, false);
            }
            
        } catch (error) {
            console.error('Email sending error:', error);
            
            const errorMessage = currentLang === 'ko' ?
                '이메일 전송 중 오류가 발생했습니다.' :
                'An error occurred while sending email.';
            
            this.ui.addMessage(errorMessage, 'bot');
            this.email.updateEmailStats(activeType, false);
        } finally {
            loading.classList.remove('active');
            submitBtn.disabled = false;
        }
    }
    
    // 이메일 폼 데이터 수집
    getEmailFormData() {
        const form = this.ui.elements.emailPanelContent.querySelector('#emailForm');
        if (!form) return null;
        
        const formData = {};
        const formElements = form.elements;
        
        for (let element of formElements) {
            if (element.name && element.value) {
                formData[element.name] = element.value;
            }
        }
        
        // 필수 필드 검증
        const senderEmail = formData.senderEmail;
        if (!senderEmail || !this.email.validateEmail(senderEmail)) {
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const errorMessage = currentLang === 'ko' ?
                '유효한 이메일 주소를 입력해주세요.' :
                'Please enter a valid email address.';
            
            this.ui.addMessage(errorMessage, 'bot');
            return null;
        }
        
        return formData;
    }
    
    // 음성 인식 콜백 초기화
    initializeVoiceCallbacks() {
        // 음성 인식 시작 콜백
        this.voice.onListeningStart = () => {
            this.ui.elements.voiceBtn?.classList.add('listening');
            this.ui.elements.voiceTranscript?.classList.remove('active');
            this.ui.elements.voiceError?.classList.remove('active');
        };
        
        // 음성 인식 종료 콜백
        this.voice.onListeningEnd = () => {
            this.ui.elements.voiceBtn?.classList.remove('listening');
            
            // 잠시 후 transcript 숨기기
            setTimeout(() => {
                this.ui.elements.voiceTranscript?.classList.remove('active');
            }, 2000);
        };
        
        // 임시 인식 결과 콜백
        this.voice.onInterimResult = (transcript) => {
            const transcriptElement = this.ui.elements.voiceTranscript;
            if (transcriptElement) {
                transcriptElement.textContent = transcript;
                transcriptElement.classList.add('active', 'interim');
            }
        };
        
        // 최종 텍스트 인식 콜백
        this.voice.onTextRecognized = (transcript) => {
            const transcriptElement = this.ui.elements.voiceTranscript;
            if (transcriptElement) {
                transcriptElement.textContent = transcript;
                transcriptElement.classList.remove('interim');
            }
            
            // 입력 필드에 텍스트 설정
            if (this.ui.elements.input) {
                this.ui.elements.input.value = transcript;
                this.ui.updateSendButton();
            }
            
            this.analytics.trackInteraction('voice_text_recognized', { 
                length: transcript.length 
            });
        };
        
        // 음성 명령 콜백
        this.voice.onVoiceCommand = (command, transcript) => {
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            
            switch (command) {
                case 'send':
                    if (this.ui.elements.input?.value.trim()) {
                        this.sendMessage();
                    }
                    break;
                    
                case 'clear':
                    this.ui.clearInput();
                    this.ui.elements.voiceTranscript?.classList.remove('active');
                    break;
                    
                case 'close':
                    this.close();
                    break;
                    
                case 'help':
                    this.showVoiceCommandsHelp();
                    break;
                    
                case 'repeat':
                    const lastBotMessage = this.getLastBotMessage();
                    if (lastBotMessage) {
                        this.voice.speak(lastBotMessage);
                    }
                    break;
            }
            
            this.voice.updateVoiceStats('command', true);
            this.analytics.trackInteraction('voice_command_executed', { 
                command, 
                transcript 
            });
        };
        
        // 인식 실패 콜백
        this.voice.onNoMatch = () => {
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const message = currentLang === 'ko' ? 
                '음성을 인식하지 못했습니다. 다시 시도해주세요.' : 
                'Voice not recognized. Please try again.';
            
            this.showVoiceError(message);
        };
        
        // 오류 콜백
        this.voice.onError = (errorType, message) => {
            this.showVoiceError(message);
            this.analytics.trackError(new Error(errorType), { 
                context: 'voice_recognition', 
                errorType 
            });
        };
        
        // TTS 시작 콜백
        this.voice.onSpeechStart = () => {
            this.analytics.trackInteraction('voice_speech_started');
        };
        
        // TTS 종료 콜백
        this.voice.onSpeechEnd = () => {
            this.analytics.trackInteraction('voice_speech_ended');
        };
    }
    
    // 음성 인식 토글
    toggleVoiceRecognition() {
        if (!this.voice.isVoiceRecognitionSupported()) {
            const currentLang = this.responses.languageManager.getCurrentLanguage();
            const message = currentLang === 'ko' ? 
                '음성 인식이 지원되지 않는 브라우저입니다.' : 
                'Voice recognition is not supported in this browser.';
            
            this.ui.addMessage(message, 'bot');
            return;
        }
        
        if (this.voice.isListening) {
            this.voice.stopListening();
        } else {
            // 마이크 권한 확인
            this.voice.checkMicrophonePermission().then(hasPermission => {
                if (hasPermission) {
                    this.voice.startListening();
                } else {
                    const currentLang = this.responses.languageManager.getCurrentLanguage();
                    const message = currentLang === 'ko' ? 
                        '마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.' : 
                        'Microphone permission is required. Please allow microphone access in browser settings.';
                    
                    this.showVoiceError(message);
                }
            });
        }
    }
    
    // 음성 명령어 도움말 표시
    showVoiceCommandsHelp() {
        const helpElement = this.ui.elements.voiceHelp;
        const commandsList = this.ui.elements.voiceCommandsList;
        
        if (!helpElement || !commandsList) return;
        
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        const commands = this.voice.voiceCommands[currentLang];
        
        // 명령어 리스트 업데이트
        commandsList.innerHTML = '';
        
        const commandLabels = {
            send: currentLang === 'ko' ? '메시지 전송' : 'Send Message',
            clear: currentLang === 'ko' ? '입력 지우기' : 'Clear Input',
            close: currentLang === 'ko' ? '채팅 닫기' : 'Close Chat',
            help: currentLang === 'ko' ? '도움말' : 'Help',
            stop: currentLang === 'ko' ? '음성 중지' : 'Stop Voice',
            repeat: currentLang === 'ko' ? '다시 듣기' : 'Repeat'
        };
        
        for (const [command, keywords] of Object.entries(commands)) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${commandLabels[command]}:</strong> ${keywords.join(', ')}`;
            commandsList.appendChild(li);
        }
        
        // 헤더 업데이트
        const header = helpElement.querySelector('h4');
        if (header) {
            header.textContent = currentLang === 'ko' ? '음성 명령어' : 'Voice Commands';
        }
        
        // 도움말 표시
        helpElement.classList.add('active');
        
        // 5초 후 자동 숨김
        setTimeout(() => {
            helpElement.classList.remove('active');
        }, 5000);
        
        this.analytics.trackInteraction('voice_help_shown');
    }
    
    // 음성 오류 메시지 표시
    showVoiceError(message) {
        const errorElement = this.ui.elements.voiceError;
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
            
            // 3초 후 자동 숨김
            setTimeout(() => {
                errorElement.classList.remove('active');
            }, 3000);
        }
    }
    
    // 마지막 봇 메시지 가져오기
    getLastBotMessage() {
        const messages = this.ui.elements.messages?.querySelectorAll('.bot-message');
        if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const textElement = lastMessage.querySelector('.message-text');
            return textElement?.textContent || '';
        }
        return '';
    }
    
    // 음성으로 메시지 읽기
    speakMessage(text) {
        if (this.voice.isTextToSpeechSupported() && this.voice.ttsEnabled) {
            this.voice.speak(text);
        }
    }
    
    // 음성 설정 표시
    showVoiceSettings() {
        const settings = this.voice.generateVoiceSettings();
        const currentLang = this.responses.languageManager.getCurrentLanguage();
        
        let response = currentLang === 'ko' ? 
            '🎤 **음성 인식 설정**\\n\\n' : 
            '🎤 **Voice Recognition Settings**\\n\\n';
        
        response += currentLang === 'ko' ? 
            `**음성 인식 지원:** ${settings.recognition.supported ? '지원됨' : '지원 안됨'}\\n` :
            `**Voice Recognition Support:** ${settings.recognition.supported ? 'Supported' : 'Not Supported'}\\n`;
        
        response += currentLang === 'ko' ? 
            `**음성 인식 활성화:** ${settings.recognition.enabled ? '활성' : '비활성'}\\n` :
            `**Voice Recognition Enabled:** ${settings.recognition.enabled ? 'Enabled' : 'Disabled'}\\n`;
        
        response += currentLang === 'ko' ? 
            `**TTS 지원:** ${settings.synthesis.supported ? '지원됨' : '지원 안됨'}\\n` :
            `**TTS Support:** ${settings.synthesis.supported ? 'Supported' : 'Not Supported'}\\n`;
        
        response += currentLang === 'ko' ? 
            `**TTS 활성화:** ${settings.synthesis.enabled ? '활성' : '비활성'}\\n` :
            `**TTS Enabled:** ${settings.synthesis.enabled ? 'Enabled' : 'Disabled'}\\n`;
        
        if (settings.stats.totalRecognitions > 0) {
            response += currentLang === 'ko' ? 
                `\\n**통계**\\n` :
                `\\n**Statistics**\\n`;
            
            response += currentLang === 'ko' ? 
                `- 총 인식 시도: ${settings.stats.totalRecognitions}\\n` :
                `- Total Recognition Attempts: ${settings.stats.totalRecognitions}\\n`;
            
            response += currentLang === 'ko' ? 
                `- 성공한 인식: ${settings.stats.successfulRecognitions}\\n` :
                `- Successful Recognitions: ${settings.stats.successfulRecognitions}\\n`;
            
            response += currentLang === 'ko' ? 
                `- 실행된 명령: ${settings.stats.commandsExecuted}\\n` :
                `- Commands Executed: ${settings.stats.commandsExecuted}\\n`;
        }
        
        this.ui.addMessage(response, 'bot');
    }
    
    // 외부 클릭 처리
    handleOutsideClick(e) {
        const { widget, launcher, emojiPicker, themeCustomizer, exportPanel, emailPanel } = this.ui.elements;
        
        // 이모지 피커 외부 클릭시 닫기
        if (this.emojiPickerOpen && 
            !emojiPicker?.contains(e.target) && 
            !this.ui.elements.emojiPickerBtn?.contains(e.target)) {
            this.toggleEmojiPicker();
        }
        
        // 테마 커스터마이저 외부 클릭시 닫기
        if (this.themeCustomizerOpen && 
            !themeCustomizer?.contains(e.target) && 
            !this.ui.elements.themeBtn?.contains(e.target)) {
            this.toggleThemeCustomizer();
        }
        
        // 내보내기 패널 외부 클릭시 닫기
        if (this.exportPanelOpen && 
            !exportPanel?.contains(e.target) && 
            !this.ui.elements.exportBtn?.contains(e.target)) {
            this.toggleExportPanel();
        }
        
        // 이메일 패널 외부 클릭시 닫기
        if (this.emailPanelOpen && 
            !emailPanel?.contains(e.target) && 
            !this.ui.elements.emailBtn?.contains(e.target)) {
            this.toggleEmailPanel();
        }
        
        if (this.ui.isOpen && 
            !widget?.contains(e.target) && 
            !launcher?.contains(e.target) && 
            !this.ui.isMinimized) {
            this.toggleMinimize();
        }
    }
    
    // 키보드 단축키
    handleKeyboardShortcuts(e) {
        const { shortcuts } = chatbotConfig;
        
        // 열기 단축키
        if ((e.ctrlKey || e.metaKey) && e.key === shortcuts.open && !this.ui.isOpen) {
            e.preventDefault();
            this.open();
        }
        
        // 닫기 단축키
        if (e.key === shortcuts.close && this.ui.isOpen) {
            e.preventDefault();
            this.close();
        }
    }
    
    // 페이지 종료 처리
    handlePageUnload() {
        this.saveState();
        this.analytics.trackSessionEnd();
    }
    
    // 대화 종료 처리
    handleConversationEnd() {
        setTimeout(() => {
            this.ui.addMessage('도움이 필요하시면 언제든 연락주세요! 😊', 'bot');
            this.ui.toggleSuggestions(true);
        }, 1000);
    }
    
    // 후속 질문 제안
    suggestFollowUpQuestions() {
        const followUpQuestions = this.responses.generateFollowUpQuestions();
        
        if (followUpQuestions.length > 0 && this.ui.elements.messages.children.length > 4) {
            // 3번째 대화 이후부터 후속 질문 제안
            const summary = this.responses.getConversationSummary();
            
            if (summary.totalMessages > 3 && summary.currentMood !== 'negative') {
                setTimeout(() => {
                    const actions = followUpQuestions.map((question, index) => ({
                        label: question,
                        type: 'followup',
                        value: question
                    }));
                    
                    this.ui.addMessage("추가로 궁금하신 점이 있으신가요?", 'bot', {
                        actions: actions.slice(0, 2) // 최대 2개만 표시
                    });
                }, 500);
            }
        }
    }
    
    // 타이핑 지연 계산
    calculateTypingDelay(text) {
        const { min, max } = chatbotConfig.messages.typingDelay;
        const baseDelay = min + (text.length * 10);
        return Math.min(baseDelay, max);
    }
    
    // 상태 저장
    saveState() {
        const state = this.ui.getState();
        this.storage.saveChatState(state);
    }
    
    // 상태 복원
    restoreState() {
        const savedState = this.storage.loadChatState();
        
        if (savedState) {
            // 이전 메시지 복원
            const messages = this.storage.loadMessages();
            messages.forEach(msg => {
                this.ui.addMessage(msg.text, msg.sender);
            });
            
            // 알림 표시 (자동으로 열지 않음)
            if (savedState.isOpen) {
                this.ui.showNotification();
            }
        }
    }
    
    // 공개 API
    getAPI() {
        return {
            open: () => this.open(),
            close: () => this.close(),
            minimize: () => this.toggleMinimize(),
            toggleLanguage: () => this.toggleLanguage(),
            sendMessage: (text) => this.sendMessage(text),
            clearHistory: () => this.clearHistory(),
            showFAQBrowser: () => this.showFAQBrowser(),
            searchFAQs: (query) => this.performFAQSearch(query),
            getFAQStats: () => this.responses.getFAQStats(),
            toggleSearchMode: () => this.toggleSearchMode(),
            searchConversations: (query, options) => this.search.searchConversations(query, options),
            getSearchStats: () => this.search.getSearchStats(),
            clearSearchHistory: () => this.search.clearSearchHistory(),
            toggleEmojiPicker: () => this.toggleEmojiPicker(),
            addReaction: (messageId, emoji) => this.addMessageReaction(messageId, emoji),
            getEmojiStats: () => this.emoji.getEmojiStatistics(),
            clearEmojiHistory: () => this.emoji.clearAllReactions(),
            toggleThemeCustomizer: () => this.toggleThemeCustomizer(),
            setTheme: (theme) => this.theme.setTheme(theme),
            getThemeStats: () => this.theme.getThemeStats(),
            exportTheme: () => this.theme.exportTheme(),
            importTheme: (data) => this.theme.importTheme(data),
            resetTheme: () => this.theme.resetTheme(),
            toggleExportPanel: () => this.toggleExportPanel(),
            exportChat: (format, options) => this.export.exportChat(format, options),
            quickExport: (format) => this.export.quickExport(format),
            getExportStats: () => this.export.getExportStats(),
            toggleEmailPanel: () => this.toggleEmailPanel(),
            sendEmail: (type, options) => this.email.sendEmail(type, options),
            getEmailStats: () => this.email.getEmailStats(),
            toggleVoiceRecognition: () => this.toggleVoiceRecognition(),
            speakMessage: (text) => this.speakMessage(text),
            showVoiceSettings: () => this.showVoiceSettings(),
            getVoiceStats: () => this.voice.getVoiceStats(),
            getState: () => this.ui.getState(),
            getAnalytics: () => this.analytics.generateReport(),
            getConversationSummary: () => this.responses.getConversationSummary(),
            getCurrentLanguage: () => this.ui.languageManager.getCurrentLanguage(),
            on: (event, handler) => this.on(event, handler),
            off: (event, handler) => this.off(event, handler)
        };
    }
    
    // 채팅 기록 삭제
    clearHistory() {
        if (confirm('채팅 기록을 모두 삭제하시겠습니까?')) {
            this.storage.clearMessages();
            this.ui.clearMessages();
            this.ui.addWelcomeMessage();
            this.ui.toggleSuggestions(true);
            this.responses.reset();
            
            this.analytics.trackInteraction('history_cleared');
        }
    }
    
    // 이벤트 처리
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(handler);
    }
    
    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).delete(handler);
        }
    }
    
    emit(event, data = null) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    // 유틸리티 함수
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 클래스를 내보내기
export { JunetapaChatbot };