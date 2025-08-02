// Chatbot UI Module
import { chatbotConfig } from '../config/settings.js';
import { LanguageManager } from './language.js';

export class UIManager {
    constructor() {
        this.elements = {};
        this.isOpen = false;
        this.isMinimized = false;
        this.isTyping = false;
        this.messageId = 0;
        this.languageManager = new LanguageManager();
        
        this.initializeElements();
        this.setupLanguageChangeListener();
    }
    
    // DOM 요소 초기화
    initializeElements() {
        this.elements = {
            widget: document.getElementById('chatWidget'),
            launcher: document.getElementById('chatLauncher'),
            header: document.getElementById('chatHeader'),
            body: document.getElementById('chatBody'),
            messages: document.getElementById('chatMessages'),
            input: document.getElementById('chatInput'),
            sendBtn: document.getElementById('chatSend'),
            emojiPickerBtn: document.getElementById('emojiPickerBtn'),
            emojiPicker: document.getElementById('emojiPicker'),
            emojiTabs: document.getElementById('emojiTabs'),
            emojiSearch: document.getElementById('emojiSearch'),
            emojiPickerContent: document.getElementById('emojiPickerContent'),
            themeBtn: document.getElementById('chatTheme'),
            themeCustomizer: document.getElementById('themeCustomizer'),
            themeClose: document.getElementById('themeClose'),
            themeCustomizerContent: document.getElementById('themeCustomizerContent'),
            exportBtn: document.getElementById('chatExport'),
            exportPanel: document.getElementById('exportPanel'),
            exportClose: document.getElementById('exportClose'),
            exportPanelContent: document.getElementById('exportPanelContent'),
            emailBtn: document.getElementById('chatEmail'),
            emailPanel: document.getElementById('emailPanel'),
            emailClose: document.getElementById('emailClose'),
            emailPanelContent: document.getElementById('emailPanelContent'),
            voiceBtn: document.getElementById('voiceBtn'),
            voiceTranscript: document.getElementById('voiceTranscript'),
            voiceError: document.getElementById('voiceError'),
            voiceHelp: document.getElementById('voiceHelp'),
            voiceCommandsList: document.getElementById('voiceCommandsList'),
            searchBtn: document.getElementById('chatSearch'),
            faqBtn: document.getElementById('chatFAQ'),
            languageBtn: document.getElementById('chatLanguage'),
            minimizeBtn: document.getElementById('chatMinimize'),
            closeBtn: document.getElementById('chatClose'),
            typing: document.getElementById('chatTyping'),
            suggestions: document.getElementById('chatSuggestions'),
            notification: document.getElementById('launcherNotification'),
            statusIndicator: document.querySelector('.status-indicator'),
            statusText: document.querySelector('.chat-status-text'),
            chatTitle: document.querySelector('.chat-title')
        };
    }
    
    // 챗봇 열기
    open() {
        if (!this.elements.widget || !this.elements.launcher) return;
        
        this.isOpen = true;
        this.isMinimized = false;
        
        this.elements.widget.classList.add('active');
        this.elements.widget.classList.remove('minimized');
        this.elements.launcher.classList.add('hidden');
        
        // 애니메이션 후 포커스
        setTimeout(() => {
            this.elements.input?.focus();
        }, chatbotConfig.ui.animationDuration);
        
        this.hideNotification();
        this.updateOnlineStatus();
    }
    
    // 챗봇 닫기
    close() {
        if (!this.elements.widget || !this.elements.launcher) return;
        
        this.isOpen = false;
        this.isMinimized = false;
        
        this.elements.widget.classList.remove('active', 'minimized');
        this.elements.launcher.classList.remove('hidden');
    }
    
    // 챗봇 최소화/복원
    toggleMinimize() {
        if (!this.elements.widget) return;
        
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            this.elements.widget.classList.add('minimized');
            this.updateMinimizeButton('□', '채팅 복원');
        } else {
            this.elements.widget.classList.remove('minimized');
            this.updateMinimizeButton('−', '채팅 최소화');
            this.elements.input?.focus();
        }
    }
    
    // 메시지 추가
    addMessage(text, sender = 'bot', options = {}) {
        if (!this.elements.messages) return;
        
        const messageElement = this.createMessageElement(text, sender, options);
        this.elements.messages.appendChild(messageElement);
        
        // 애니메이션
        requestAnimationFrame(() => {
            messageElement.classList.add('fade-in');
        });
        
        // 자동 스크롤
        setTimeout(() => {
            this.scrollToBottom();
        }, chatbotConfig.ui.autoScrollDelay);
        
        return messageElement;
    }
    
    // 메시지 요소 생성
    createMessageElement(text, sender, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.dataset.messageId = ++this.messageId;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const time = this.getCurrentTime();
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${options.avatar || avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                ${options.actions ? this.createMessageActions(options.actions) : ''}
                <div class="message-time">${time}</div>
            </div>
        `;
        
        return messageDiv;
    }
    
    // 메시지 액션 버튼 생성
    createMessageActions(actions) {
        const actionsHtml = actions.map(action => `
            <button class="message-action" data-action="${action.type}" data-value="${action.value}">
                ${action.label}
            </button>
        `).join('');
        
        return `<div class="message-actions">${actionsHtml}</div>`;
    }
    
    // 타이핑 인디케이터 표시
    showTypingIndicator() {
        if (!this.elements.typing) return;
        
        this.isTyping = true;
        this.elements.typing.style.display = 'flex';
        this.scrollToBottom();
    }
    
    // 타이핑 인디케이터 숨기기
    hideTypingIndicator() {
        if (!this.elements.typing) return;
        
        this.isTyping = false;
        this.elements.typing.style.display = 'none';
    }
    
    // 추천 메시지 표시/숨기기
    toggleSuggestions(show) {
        if (!this.elements.suggestions) return;
        
        this.elements.suggestions.style.display = show ? 'flex' : 'none';
    }
    
    // 알림 표시
    showNotification(count = 1) {
        if (!this.elements.notification) return;
        
        this.elements.notification.textContent = count;
        this.elements.notification.classList.remove('hidden');
        
        // 애니메이션
        this.elements.launcher?.classList.add('bounce');
        setTimeout(() => {
            this.elements.launcher?.classList.remove('bounce');
        }, 1000);
    }
    
    // 알림 숨기기
    hideNotification() {
        if (!this.elements.notification) return;
        
        this.elements.notification.classList.add('hidden');
    }
    
    // 온라인 상태 업데이트
    updateOnlineStatus() {
        const hour = new Date().getHours();
        const { start, end } = chatbotConfig.onlineHours;
        const isOnline = hour >= start && hour <= end;
        
        if (this.elements.statusIndicator) {
            this.elements.statusIndicator.classList.toggle('online', isOnline);
            this.elements.statusIndicator.classList.toggle('offline', !isOnline);
        }
        
        if (this.elements.statusText) {
            this.elements.statusText.textContent = isOnline ? '온라인' : '오프라인';
        }
        
        return isOnline;
    }
    
    // 입력 필드 활성화/비활성화
    setInputEnabled(enabled) {
        if (!this.elements.input || !this.elements.sendBtn) return;
        
        this.elements.input.disabled = !enabled;
        this.elements.sendBtn.disabled = !enabled;
        
        if (enabled) {
            this.elements.input.focus();
        }
    }
    
    // 입력 필드 초기화
    clearInput() {
        if (!this.elements.input) return;
        
        this.elements.input.value = '';
        this.elements.input.style.height = 'auto';
        this.elements.sendBtn.disabled = true;
    }
    
    // 입력 필드 값 가져오기
    getInputValue() {
        return this.elements.input?.value.trim() || '';
    }
    
    // 입력 필드 값 설정
    setInputValue(value) {
        if (!this.elements.input) return;
        
        this.elements.input.value = value;
        this.updateSendButton();
    }
    
    // 전송 버튼 상태 업데이트
    updateSendButton() {
        if (!this.elements.sendBtn || !this.elements.input) return;
        
        const hasValue = this.elements.input.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasValue;
    }
    
    // 스크롤 최하단으로
    scrollToBottom() {
        if (!this.elements.messages) return;
        
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
    
    // 메시지 삭제
    removeMessage(messageId) {
        const message = this.elements.messages?.querySelector(`[data-message-id="${messageId}"]`);
        if (message) {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 300);
        }
    }
    
    // 모든 메시지 삭제
    clearMessages() {
        if (!this.elements.messages) return;
        
        this.elements.messages.innerHTML = '';
        this.messageId = 0;
    }
    
    // 웰컴 메시지 추가
    addWelcomeMessage() {
        const welcomeText = this.languageManager.getUIText('welcome');
        this.addMessage(welcomeText, 'bot');
    }
    
    // 에러 메시지 표시
    showError(message) {
        this.addMessage(message, 'bot', {
            avatar: '⚠️',
            className: 'error-message'
        });
    }
    
    // 로딩 상태 표시
    showLoading(show = true) {
        if (show) {
            this.setInputEnabled(false);
            this.showTypingIndicator();
        } else {
            this.setInputEnabled(true);
            this.hideTypingIndicator();
        }
    }
    
    // 미니마이즈 버튼 업데이트
    updateMinimizeButton(icon, label) {
        if (!this.elements.minimizeBtn) return;
        
        const iconElement = this.elements.minimizeBtn.querySelector('.minimize-icon');
        if (iconElement) {
            iconElement.textContent = icon;
        }
        this.elements.minimizeBtn.setAttribute('aria-label', label);
    }
    
    // 현재 시간 가져오기
    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 상태 가져오기
    getState() {
        return {
            isOpen: this.isOpen,
            isMinimized: this.isMinimized,
            messageCount: this.messageId
        };
    }
    
    // 애니메이션 효과
    animateElement(element, animationClass, duration = 300) {
        if (!element) return;
        
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
    
    // 테마 변경
    setTheme(theme) {
        if (!this.elements.widget) return;
        
        this.elements.widget.dataset.theme = theme;
    }
    
    // 언어 변경 리스너 설정
    setupLanguageChangeListener() {
        window.addEventListener('languageChanged', (e) => {
            this.updateUILanguage();
        });
    }
    
    // UI 언어 업데이트
    updateUILanguage() {
        const texts = this.languageManager.getAllUITexts();
        
        // 헤더 텍스트
        if (this.elements.chatTitle) {
            this.elements.chatTitle.textContent = texts.title;
        }
        
        // 상태 텍스트
        if (this.elements.statusText) {
            const isOnline = this.elements.statusIndicator?.classList.contains('online');
            this.elements.statusText.textContent = isOnline ? texts.online : texts.offline;
        }
        
        // 버튼 라벨
        if (this.elements.minimizeBtn) {
            const isMinimized = this.elements.widget?.classList.contains('minimized');
            this.elements.minimizeBtn.setAttribute('aria-label', isMinimized ? texts.restore : texts.minimize);
        }
        
        if (this.elements.closeBtn) {
            this.elements.closeBtn.setAttribute('aria-label', texts.close);
        }
        
        // 입력 필드
        if (this.elements.input) {
            this.elements.input.placeholder = texts.placeholder;
        }
        
        // 타이핑 인디케이터
        const typingText = this.elements.typing?.querySelector('.typing-text');
        if (typingText) {
            typingText.textContent = texts.typing;
        }
        
        // 추천 메시지 업데이트
        this.updateSuggestions();
    }
    
    // 추천 메시지 업데이트
    updateSuggestions() {
        if (!this.elements.suggestions) return;
        
        const suggestions = this.languageManager.getSuggestions();
        this.elements.suggestions.innerHTML = '';
        
        suggestions.slice(0, chatbotConfig.ui.maxSuggestions).forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.textContent = suggestion.text;
            button.dataset.message = suggestion.text;
            button.dataset.category = suggestion.category;
            this.elements.suggestions.appendChild(button);
        });
    }
    
    // 언어 전환
    toggleLanguage() {
        this.languageManager.toggleLanguage();
        const newLang = this.languageManager.getCurrentLanguage();
        
        // 언어 변경 메시지
        const message = this.languageManager.getUIText('languageChanged');
        this.addMessage(message + ` (${newLang.toUpperCase()})`, 'bot');
    }
}