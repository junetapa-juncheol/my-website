// Chatbot Analytics Module
import { chatbotConfig } from '../config/settings.js';

export class AnalyticsManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = Date.now();
        this.messageCount = 0;
        this.events = [];
    }
    
    // 세션 ID 생성
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // 이벤트 추적
    trackEvent(eventName, eventData = {}) {
        if (!chatbotConfig.analytics.enabled) return;
        
        const event = {
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            data: eventData
        };
        
        this.events.push(event);
        
        // 실시간 이벤트 처리
        this.processEvent(event);
        
        // 주기적으로 저장
        if (this.events.length >= 10) {
            this.saveEvents();
        }
    }
    
    // 메시지 추적
    trackMessage(message, sender, category) {
        if (!chatbotConfig.analytics.trackMessages) return;
        
        this.messageCount++;
        
        this.trackEvent('message_sent', {
            sender,
            category,
            messageLength: message.length,
            messageCount: this.messageCount
        });
        
        // 카테고리별 통계 업데이트
        this.updateCategoryStats(category);
    }
    
    // 세션 시작 추적
    trackSessionStart() {
        this.trackEvent('session_start', {
            startTime: this.sessionStartTime,
            userAgent: navigator.userAgent,
            language: navigator.language
        });
        
        // 총 세션 수 업데이트
        const analytics = this.storage.loadAnalytics();
        analytics.totalSessions = (analytics.totalSessions || 0) + 1;
        this.storage.saveAnalytics(analytics);
    }
    
    // 세션 종료 추적
    trackSessionEnd() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        
        this.trackEvent('session_end', {
            duration: sessionDuration,
            messageCount: this.messageCount
        });
        
        // 평균 세션 시간 업데이트
        this.updateAverageSessionDuration(sessionDuration);
        
        // 이벤트 저장
        this.saveEvents();
    }
    
    // 사용자 상호작용 추적
    trackInteraction(interactionType, details = {}) {
        this.trackEvent('user_interaction', {
            type: interactionType,
            ...details
        });
    }
    
    // 오류 추적
    trackError(error, context = {}) {
        this.trackEvent('error', {
            message: error.message || error,
            stack: error.stack,
            context
        });
    }
    
    // 응답 시간 추적
    trackResponseTime(startTime, endTime, category) {
        const responseTime = endTime - startTime;
        
        this.trackEvent('response_time', {
            duration: responseTime,
            category
        });
    }
    
    // 카테고리별 통계 업데이트
    updateCategoryStats(category) {
        const analytics = this.storage.loadAnalytics();
        
        if (!analytics.topCategories) {
            analytics.topCategories = {};
        }
        
        analytics.topCategories[category] = (analytics.topCategories[category] || 0) + 1;
        analytics.totalMessages = (analytics.totalMessages || 0) + 1;
        
        this.storage.saveAnalytics(analytics);
    }
    
    // 평균 세션 시간 업데이트
    updateAverageSessionDuration(duration) {
        const analytics = this.storage.loadAnalytics();
        
        const totalSessions = analytics.totalSessions || 1;
        const currentAverage = analytics.averageSessionDuration || 0;
        
        // 새로운 평균 계산
        analytics.averageSessionDuration = 
            ((currentAverage * (totalSessions - 1)) + duration) / totalSessions;
        
        this.storage.saveAnalytics(analytics);
    }
    
    // 이벤트 처리
    processEvent(event) {
        // 실시간 이벤트 처리 로직
        switch (event.name) {
            case 'message_sent':
                this.updateMessageMetrics(event.data);
                break;
            case 'user_interaction':
                this.updateInteractionMetrics(event.data);
                break;
            case 'error':
                this.handleErrorEvent(event.data);
                break;
        }
    }
    
    // 메시지 메트릭 업데이트
    updateMessageMetrics(data) {
        // 시간대별 메시지 통계
        const hour = new Date().getHours();
        const analytics = this.storage.loadAnalytics();
        
        if (!analytics.messagesByHour) {
            analytics.messagesByHour = {};
        }
        
        analytics.messagesByHour[hour] = (analytics.messagesByHour[hour] || 0) + 1;
        this.storage.saveAnalytics(analytics);
    }
    
    // 상호작용 메트릭 업데이트
    updateInteractionMetrics(data) {
        const analytics = this.storage.loadAnalytics();
        
        if (!analytics.interactions) {
            analytics.interactions = {};
        }
        
        const type = data.type;
        analytics.interactions[type] = (analytics.interactions[type] || 0) + 1;
        
        this.storage.saveAnalytics(analytics);
    }
    
    // 오류 이벤트 처리
    handleErrorEvent(data) {
        console.error('Chatbot Error:', data);
        
        // 오류 통계 업데이트
        const analytics = this.storage.loadAnalytics();
        analytics.errorCount = (analytics.errorCount || 0) + 1;
        this.storage.saveAnalytics(analytics);
    }
    
    // 이벤트 저장
    saveEvents() {
        if (!this.events.length) return;
        
        // 세션 데이터에 이벤트 저장
        this.storage.saveSessionData(this.sessionId, {
            events: this.events,
            messageCount: this.messageCount,
            duration: Date.now() - this.sessionStartTime
        });
        
        // 이벤트 배열 초기화
        this.events = [];
    }
    
    // 분석 보고서 생성
    generateReport() {
        const analytics = this.storage.loadAnalytics();
        const sessionData = this.storage.loadSessionData(this.sessionId);
        
        return {
            summary: {
                totalSessions: analytics.totalSessions || 0,
                totalMessages: analytics.totalMessages || 0,
                averageSessionDuration: Math.round(analytics.averageSessionDuration / 1000) + '초',
                errorCount: analytics.errorCount || 0
            },
            topCategories: this.getTopCategories(analytics.topCategories),
            messagesByHour: analytics.messagesByHour || {},
            currentSession: {
                id: this.sessionId,
                duration: Math.round((Date.now() - this.sessionStartTime) / 1000) + '초',
                messageCount: this.messageCount
            }
        };
    }
    
    // 상위 카테고리 가져오기
    getTopCategories(categories = {}) {
        return Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => ({ category, count }));
    }
    
    // 사용자 행동 패턴 분석
    analyzeUserBehavior() {
        const analytics = this.storage.loadAnalytics();
        const messages = this.storage.loadMessages();
        
        // 대화 패턴 분석
        const patterns = {
            averageMessageLength: 0,
            commonTimeSlots: [],
            preferredCategories: [],
            responseRate: 0
        };
        
        if (messages.length > 0) {
            // 평균 메시지 길이
            const totalLength = messages.reduce((sum, msg) => sum + msg.text.length, 0);
            patterns.averageMessageLength = Math.round(totalLength / messages.length);
            
            // 선호 시간대
            const hourCounts = {};
            messages.forEach(msg => {
                const hour = new Date(msg.timestamp).getHours();
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            });
            
            patterns.commonTimeSlots = Object.entries(hourCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([hour]) => parseInt(hour));
        }
        
        return patterns;
    }
    
    // 성능 메트릭 수집
    collectPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            
            return {
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaintTime: timing.domComplete - timing.domLoading
            };
        }
        
        return null;
    }
    
    // 분석 데이터 내보내기
    exportAnalytics() {
        const report = this.generateReport();
        const behavior = this.analyzeUserBehavior();
        const performance = this.collectPerformanceMetrics();
        
        return {
            report,
            behavior,
            performance,
            exportDate: new Date().toISOString()
        };
    }
}