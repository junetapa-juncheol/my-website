// Chatbot Storage Module
import { chatbotConfig } from '../config/settings.js';

export class StorageManager {
    constructor() {
        this.prefix = chatbotConfig.storage.prefix;
        this.maxMessages = chatbotConfig.messages.maxHistory;
    }
    
    // 채팅 상태 저장
    saveChatState(state) {
        try {
            const key = this.prefix + chatbotConfig.storage.stateKey;
            const data = {
                ...state,
                lastActive: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving chat state:', error);
            return false;
        }
    }
    
    // 채팅 상태 불러오기
    loadChatState() {
        try {
            const key = this.prefix + chatbotConfig.storage.stateKey;
            const saved = localStorage.getItem(key);
            
            if (!saved) return null;
            
            const state = JSON.parse(saved);
            
            // 세션 타임아웃 체크
            const sessionTimeout = chatbotConfig.storage.sessionTimeout;
            if (Date.now() - state.lastActive > sessionTimeout) {
                this.clearChatState();
                return null;
            }
            
            return state;
        } catch (error) {
            console.error('Error loading chat state:', error);
            return null;
        }
    }
    
    // 채팅 상태 삭제
    clearChatState() {
        try {
            const key = this.prefix + chatbotConfig.storage.stateKey;
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error clearing chat state:', error);
            return false;
        }
    }
    
    // 메시지 기록 저장
    saveMessage(message) {
        try {
            const messages = this.loadMessages() || [];
            
            messages.push({
                id: Date.now(),
                text: message.text,
                sender: message.sender,
                timestamp: message.timestamp || Date.now(),
                category: message.category
            });
            
            // 최대 메시지 수 제한
            if (messages.length > this.maxMessages) {
                messages.splice(0, messages.length - this.maxMessages);
            }
            
            const key = this.prefix + chatbotConfig.storage.historyKey;
            localStorage.setItem(key, JSON.stringify(messages));
            return true;
        } catch (error) {
            console.error('Error saving message:', error);
            return false;
        }
    }
    
    // 메시지 기록 불러오기
    loadMessages() {
        try {
            const key = this.prefix + chatbotConfig.storage.historyKey;
            const saved = localStorage.getItem(key);
            
            if (!saved) return [];
            
            const messages = JSON.parse(saved);
            
            // 오래된 메시지 필터링 (24시간)
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            return messages.filter(msg => msg.timestamp > oneDayAgo);
        } catch (error) {
            console.error('Error loading messages:', error);
            return [];
        }
    }
    
    // 메시지 기록 삭제
    clearMessages() {
        try {
            const key = this.prefix + chatbotConfig.storage.historyKey;
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error clearing messages:', error);
            return false;
        }
    }
    
    // 사용자 설정 저장
    saveUserPreferences(preferences) {
        try {
            const key = this.prefix + 'preferences';
            localStorage.setItem(key, JSON.stringify(preferences));
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    }
    
    // 사용자 설정 불러오기
    loadUserPreferences() {
        try {
            const key = this.prefix + 'preferences';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading preferences:', error);
            return {};
        }
    }
    
    // 분석 데이터 저장
    saveAnalytics(data) {
        if (!chatbotConfig.analytics.enabled) return false;
        
        try {
            const key = this.prefix + 'analytics';
            const existing = this.loadAnalytics();
            
            const updated = {
                ...existing,
                ...data,
                lastUpdated: Date.now()
            };
            
            localStorage.setItem(key, JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error('Error saving analytics:', error);
            return false;
        }
    }
    
    // 분석 데이터 불러오기
    loadAnalytics() {
        try {
            const key = this.prefix + 'analytics';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : {
                totalSessions: 0,
                totalMessages: 0,
                averageSessionDuration: 0,
                topCategories: {},
                lastUpdated: Date.now()
            };
        } catch (error) {
            console.error('Error loading analytics:', error);
            return {};
        }
    }
    
    // 세션 데이터 저장
    saveSessionData(sessionId, data) {
        try {
            const key = this.prefix + 'session_' + sessionId;
            const sessionData = {
                id: sessionId,
                startTime: Date.now(),
                ...data
            };
            sessionStorage.setItem(key, JSON.stringify(sessionData));
            return true;
        } catch (error) {
            console.error('Error saving session data:', error);
            return false;
        }
    }
    
    // 세션 데이터 불러오기
    loadSessionData(sessionId) {
        try {
            const key = this.prefix + 'session_' + sessionId;
            const saved = sessionStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading session data:', error);
            return null;
        }
    }
    
    // 저장소 크기 확인
    getStorageSize() {
        let totalSize = 0;
        
        try {
            for (let key in localStorage) {
                if (key.startsWith(this.prefix)) {
                    totalSize += localStorage[key].length;
                }
            }
            
            // 바이트를 KB로 변환
            return Math.round(totalSize / 1024 * 100) / 100;
        } catch (error) {
            console.error('Error calculating storage size:', error);
            return 0;
        }
    }
    
    // 오래된 데이터 정리
    cleanupOldData(daysToKeep = 7) {
        try {
            const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
            let cleaned = 0;
            
            // 메시지 정리
            const messages = this.loadMessages();
            const filteredMessages = messages.filter(msg => msg.timestamp > cutoffDate);
            
            if (filteredMessages.length < messages.length) {
                const key = this.prefix + chatbotConfig.storage.historyKey;
                localStorage.setItem(key, JSON.stringify(filteredMessages));
                cleaned += messages.length - filteredMessages.length;
            }
            
            return cleaned;
        } catch (error) {
            console.error('Error cleaning up old data:', error);
            return 0;
        }
    }
    
    // 검색 기록 저장
    saveSearchHistory(history) {
        try {
            const key = this.prefix + 'searchHistory';
            localStorage.setItem(key, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error saving search history:', error);
            return false;
        }
    }
    
    // 검색 기록 불러오기
    loadSearchHistory() {
        try {
            const key = this.prefix + 'searchHistory';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading search history:', error);
            return [];
        }
    }
    
    // 검색 기록 삭제
    clearSearchHistory() {
        try {
            const key = this.prefix + 'searchHistory';
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error clearing search history:', error);
            return false;
        }
    }
    
    // 이모지 반응 저장
    saveReactions(reactions) {
        try {
            const key = this.prefix + 'reactions';
            localStorage.setItem(key, JSON.stringify(reactions));
            return true;
        } catch (error) {
            console.error('Error saving reactions:', error);
            return false;
        }
    }
    
    // 이모지 반응 불러오기
    loadReactions() {
        try {
            const key = this.prefix + 'reactions';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading reactions:', error);
            return [];
        }
    }
    
    // 이모지 통계 저장
    saveEmojiStats(stats) {
        try {
            const key = this.prefix + 'emojiStats';
            localStorage.setItem(key, JSON.stringify(stats));
            return true;
        } catch (error) {
            console.error('Error saving emoji stats:', error);
            return false;
        }
    }
    
    // 이모지 통계 불러오기
    loadEmojiStats() {
        try {
            const key = this.prefix + 'emojiStats';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading emoji stats:', error);
            return {};
        }
    }
    
    // 테마 설정 저장
    saveThemeSettings(settings) {
        try {
            const key = this.prefix + 'themeSettings';
            const dataToSave = {
                ...settings,
                lastChanged: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(dataToSave));
            return true;
        } catch (error) {
            console.error('Error saving theme settings:', error);
            return false;
        }
    }
    
    // 테마 설정 불러오기
    loadThemeSettings() {
        try {
            const key = this.prefix + 'themeSettings';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading theme settings:', error);
            return null;
        }
    }
    
    // 모든 챗봇 데이터 삭제
    clearAllData() {
        try {
            const keys = [];
            
            for (let key in localStorage) {
                if (key.startsWith(this.prefix)) {
                    keys.push(key);
                }
            }
            
            keys.forEach(key => localStorage.removeItem(key));
            
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    }
    
    // 데이터 내보내기
    exportData() {
        try {
            const data = {
                messages: this.loadMessages(),
                preferences: this.loadUserPreferences(),
                analytics: this.loadAnalytics(),
                exportDate: new Date().toISOString()
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }
    
    // 데이터 가져오기
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.messages) {
                const key = this.prefix + chatbotConfig.storage.historyKey;
                localStorage.setItem(key, JSON.stringify(data.messages));
            }
            
            if (data.preferences) {
                this.saveUserPreferences(data.preferences);
            }
            
            if (data.analytics) {
                this.saveAnalytics(data.analytics);
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}