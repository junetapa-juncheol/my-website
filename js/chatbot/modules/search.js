// Conversation Search Module
export class SearchManager {
    constructor(storageManager, languageManager) {
        this.storage = storageManager;
        this.languageManager = languageManager;
        this.searchHistory = [];
        this.searchFilters = {
            dateRange: null,
            messageType: 'all', // 'all', 'user', 'bot'
            category: null
        };
    }
    
    // 대화 검색 (메인 기능)
    searchConversations(query, options = {}) {
        const messages = this.storage.loadMessages();
        if (!messages || messages.length === 0) {
            return {
                results: [],
                total: 0,
                query: query,
                timestamp: Date.now()
            };
        }
        
        // 검색 옵션 설정
        const searchOptions = {
            caseSensitive: false,
            exactMatch: false,
            dateRange: null,
            messageType: 'all',
            category: null,
            limit: 20,
            ...options
        };
        
        // 검색 수행
        let results = this.performSearch(messages, query, searchOptions);
        
        // 검색 기록 저장
        this.addToSearchHistory(query, results.length);
        
        return {
            results: results.slice(0, searchOptions.limit),
            total: results.length,
            query: query,
            options: searchOptions,
            timestamp: Date.now()
        };
    }
    
    // 실제 검색 로직
    performSearch(messages, query, options) {
        if (!query || query.trim() === '') return [];
        
        const searchTerm = options.caseSensitive ? query : query.toLowerCase();
        const results = [];
        
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            
            // 메시지 타입 필터
            if (options.messageType !== 'all' && message.sender !== options.messageType) {
                continue;
            }
            
            // 날짜 범위 필터
            if (options.dateRange && !this.isInDateRange(message.timestamp, options.dateRange)) {
                continue;
            }
            
            // 카테고리 필터
            if (options.category && message.category !== options.category) {
                continue;
            }
            
            // 텍스트 매칭
            const messageText = options.caseSensitive ? message.text : message.text.toLowerCase();
            let isMatch = false;
            
            if (options.exactMatch) {
                isMatch = messageText === searchTerm;
            } else {
                isMatch = messageText.includes(searchTerm);
            }
            
            if (isMatch) {
                // 컨텍스트 메시지 포함 (이전/다음 메시지)
                const contextMessages = this.getContextMessages(messages, i, 2);
                
                results.push({
                    messageIndex: i,
                    message: message,
                    context: contextMessages,
                    matchPosition: messageText.indexOf(searchTerm),
                    relevanceScore: this.calculateRelevance(message, searchTerm, options)
                });
            }
        }
        
        // 관련도 순으로 정렬
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    
    // 날짜 범위 확인
    isInDateRange(timestamp, dateRange) {
        if (!dateRange || !dateRange.start || !dateRange.end) return true;
        
        const messageDate = new Date(timestamp);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        return messageDate >= startDate && messageDate <= endDate;
    }
    
    // 컨텍스트 메시지 가져오기
    getContextMessages(messages, currentIndex, contextSize = 2) {
        const start = Math.max(0, currentIndex - contextSize);
        const end = Math.min(messages.length - 1, currentIndex + contextSize);
        
        return messages.slice(start, end + 1).map((msg, index) => ({
            ...msg,
            isTarget: (start + index) === currentIndex,
            relativeIndex: start + index - currentIndex
        }));
    }
    
    // 관련도 점수 계산
    calculateRelevance(message, searchTerm, options) {
        let score = 0;
        
        // 기본 매칭 점수
        const messageText = message.text.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        // 정확한 일치
        if (messageText === term) {
            score += 100;
        }
        // 단어 시작 매칭
        else if (messageText.startsWith(term)) {
            score += 80;
        }
        // 단어 포함
        else if (messageText.includes(term)) {
            score += 50;
        }
        
        // 길이 기반 보정 (짧은 메시지가 더 정확)
        const lengthBonus = Math.max(0, 50 - messageText.length);
        score += lengthBonus * 0.1;
        
        // 최신 메시지 가산점
        const messageAge = Date.now() - (message.timestamp || Date.now());
        const ageBonus = Math.max(0, 30 - (messageAge / (1000 * 60 * 60 * 24))); // 일수
        score += ageBonus * 0.5;
        
        // 사용자 메시지 가산점
        if (message.sender === 'user') {
            score += 10;
        }
        
        return score;
    }
    
    // 검색 제안 생성
    generateSearchSuggestions(currentQuery = '') {
        const suggestions = [];
        
        // 인기 검색어 (시뮬레이션)
        const popularQueries = [
            '연락처', '이메일', '전화번호', '나이', '경력', '기술', '협업', '프로젝트',
            'contact', 'email', 'phone', 'age', 'experience', 'skills', 'collaboration'
        ];
        
        // 검색 기록에서 제안
        const recentQueries = this.searchHistory
            .slice(-10)
            .map(item => item.query)
            .filter(query => query !== currentQuery);
        
        // 현재 쿼리와 유사한 제안
        if (currentQuery) {
            const similarQueries = popularQueries.filter(query => 
                query.toLowerCase().includes(currentQuery.toLowerCase()) ||
                currentQuery.toLowerCase().includes(query.toLowerCase())
            );
            suggestions.push(...similarQueries);
        }
        
        // 최근 검색어 추가
        suggestions.push(...recentQueries.slice(0, 3));
        
        // 인기 검색어 추가
        suggestions.push(...popularQueries.slice(0, 5));
        
        // 중복 제거 및 제한
        return [...new Set(suggestions)].slice(0, 8);
    }
    
    // 고급 검색 옵션
    advancedSearch(options) {
        const {
            query,
            dateRange,
            messageType,
            category,
            exactMatch,
            caseSensitive,
            sortBy = 'relevance' // 'relevance', 'date', 'length'
        } = options;
        
        let results = this.searchConversations(query, {
            dateRange,
            messageType,
            category,
            exactMatch,
            caseSensitive,
            limit: 100
        });
        
        // 정렬 옵션 적용
        if (sortBy === 'date') {
            results.results.sort((a, b) => b.message.timestamp - a.message.timestamp);
        } else if (sortBy === 'length') {
            results.results.sort((a, b) => a.message.text.length - b.message.text.length);
        }
        
        return results;
    }
    
    // 검색 하이라이트 생성
    highlightSearchResults(text, query, options = {}) {
        if (!query || !text) return text;
        
        const {
            highlightClass = 'search-highlight',
            caseSensitive = false,
            maxHighlights = 10
        } = options;
        
        const searchTerm = caseSensitive ? query : query.toLowerCase();
        const targetText = caseSensitive ? text : text.toLowerCase();
        
        let highlightedText = text;
        let highlightCount = 0;
        
        // 정규표현식을 사용한 하이라이트
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, caseSensitive ? 'g' : 'gi');
        
        highlightedText = text.replace(regex, (match) => {
            if (highlightCount >= maxHighlights) return match;
            highlightCount++;
            return `<span class="${highlightClass}">${match}</span>`;
        });
        
        return highlightedText;
    }
    
    // 정규표현식 이스케이프
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 검색 통계
    getSearchStats() {
        const messages = this.storage.loadMessages();
        
        return {
            totalMessages: messages.length,
            userMessages: messages.filter(m => m.sender === 'user').length,
            botMessages: messages.filter(m => m.sender === 'bot').length,
            searchHistory: this.searchHistory.length,
            recentSearches: this.searchHistory.slice(-5).map(item => ({
                query: item.query,
                results: item.resultCount,
                timestamp: item.timestamp
            }))
        };
    }
    
    // 검색 기록 관리
    addToSearchHistory(query, resultCount) {
        this.searchHistory.push({
            query: query.trim(),
            resultCount,
            timestamp: Date.now()
        });
        
        // 최대 50개까지만 유지
        if (this.searchHistory.length > 50) {
            this.searchHistory.shift();
        }
        
        // 로컬 스토리지에 저장
        this.storage.saveSearchHistory(this.searchHistory);
    }
    
    // 검색 기록 로드
    loadSearchHistory() {
        const history = this.storage.loadSearchHistory();
        if (history) {
            this.searchHistory = history;
        }
    }
    
    // 검색 기록 삭제
    clearSearchHistory() {
        this.searchHistory = [];
        this.storage.clearSearchHistory();
    }
    
    // 빠른 검색 (자동완성용)
    quickSearch(query, limit = 5) {
        if (!query || query.length < 2) return [];
        
        const results = this.searchConversations(query, { limit });
        
        return results.results.map(result => ({
            text: result.message.text.substring(0, 100) + '...',
            sender: result.message.sender,
            timestamp: result.message.timestamp,
            snippet: this.generateSnippet(result.message.text, query)
        }));
    }
    
    // 검색 결과 스니펫 생성
    generateSnippet(text, query, maxLength = 150) {
        const queryPos = text.toLowerCase().indexOf(query.toLowerCase());
        
        if (queryPos === -1) {
            return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
        }
        
        const start = Math.max(0, queryPos - 50);
        const end = Math.min(text.length, queryPos + query.length + 50);
        
        let snippet = text.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        
        return snippet;
    }
    
    // 검색 필터 설정
    setSearchFilters(filters) {
        this.searchFilters = { ...this.searchFilters, ...filters };
    }
    
    // 검색 필터 리셋
    resetSearchFilters() {
        this.searchFilters = {
            dateRange: null,
            messageType: 'all',
            category: null
        };
    }
    
    // 검색 내보내기
    exportSearchResults(searchResults) {
        const exportData = {
            query: searchResults.query,
            total: searchResults.total,
            timestamp: searchResults.timestamp,
            results: searchResults.results.map(result => ({
                text: result.message.text,
                sender: result.message.sender,
                timestamp: result.message.timestamp,
                category: result.message.category
            }))
        };
        
        return JSON.stringify(exportData, null, 2);
    }
}