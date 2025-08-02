// Emoji and Reaction Module
export class EmojiManager {
    constructor(storageManager, languageManager) {
        this.storage = storageManager;
        this.languageManager = languageManager;
        this.reactionHistory = [];
        this.emojiStats = {};
        this.quickEmojis = ['😊', '👍', '❤️', '😂', '👏', '🤔', '😮', '👌'];
        
        this.emojiCategories = {
            ko: {
                faces: {
                    name: '표정',
                    emojis: ['😊', '😂', '🥰', '😍', '🤗', '😎', '🤔', '😮', '😢', '😅', '🙄', '😴']
                },
                gestures: {
                    name: '제스처',
                    emojis: ['👍', '👎', '👏', '🙌', '👌', '✌️', '🤝', '🙏', '💪', '👋', '🤲', '👐']
                },
                hearts: {
                    name: '하트',
                    emojis: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💕', '💖', '💗']
                },
                objects: {
                    name: '오브젝트',
                    emojis: ['💡', '🔥', '⭐', '✨', '🎉', '🎊', '🚀', '💎', '🏆', '🎯', '📱', '💻']
                },
                nature: {
                    name: '자연',
                    emojis: ['🌟', '🌙', '☀️', '🌈', '🌸', '🌺', '🌻', '🌿', '🍀', '🌊', '⚡', '❄️']
                },
                food: {
                    name: '음식',
                    emojis: ['🍕', '🍔', '🍟', '🌭', '🍗', '🥘', '🍜', '🍱', '🍣', '🍰', '🍪', '☕']
                }
            },
            en: {
                faces: {
                    name: 'Faces',
                    emojis: ['😊', '😂', '🥰', '😍', '🤗', '😎', '🤔', '😮', '😢', '😅', '🙄', '😴']
                },
                gestures: {
                    name: 'Gestures',
                    emojis: ['👍', '👎', '👏', '🙌', '👌', '✌️', '🤝', '🙏', '💪', '👋', '🤲', '👐']
                },
                hearts: {
                    name: 'Hearts',
                    emojis: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💕', '💖', '💗']
                },
                objects: {
                    name: 'Objects',
                    emojis: ['💡', '🔥', '⭐', '✨', '🎉', '🎊', '🚀', '💎', '🏆', '🎯', '📱', '💻']
                },
                nature: {
                    name: 'Nature',
                    emojis: ['🌟', '🌙', '☀️', '🌈', '🌸', '🌺', '🌻', '🌿', '🍀', '🌊', '⚡', '❄️']
                },
                food: {
                    name: 'Food',
                    emojis: ['🍕', '🍔', '🍟', '🌭', '🍗', '🥘', '🍜', '🍱', '🍣', '🍰', '🍪', '☕']
                }
            }
        };
        
        this.loadEmojiStats();
        this.loadReactionHistory();
    }
    
    // 메시지에 반응 추가
    addReaction(messageId, emoji, userId = 'user') {
        const reaction = {
            messageId,
            emoji,
            userId,
            timestamp: Date.now(),
            id: this.generateReactionId()
        };
        
        // 반응 기록에 추가
        this.reactionHistory.push(reaction);
        
        // 이모지 통계 업데이트
        this.updateEmojiStats(emoji);
        
        // 로컬 스토리지에 저장
        this.saveReactionHistory();
        this.saveEmojiStats();
        
        return reaction;
    }
    
    // 반응 제거
    removeReaction(reactionId) {
        const reactionIndex = this.reactionHistory.findIndex(r => r.id === reactionId);
        
        if (reactionIndex !== -1) {
            const reaction = this.reactionHistory[reactionIndex];
            this.reactionHistory.splice(reactionIndex, 1);
            
            // 통계에서 차감
            if (this.emojiStats[reaction.emoji]) {
                this.emojiStats[reaction.emoji]--;
                if (this.emojiStats[reaction.emoji] <= 0) {
                    delete this.emojiStats[reaction.emoji];
                }
            }
            
            this.saveReactionHistory();
            this.saveEmojiStats();
            return true;
        }
        
        return false;
    }
    
    // 특정 메시지의 반응 조회
    getMessageReactions(messageId) {
        return this.reactionHistory.filter(r => r.messageId === messageId);
    }
    
    // 반응 요약 생성 (이모지별 개수)
    getReactionSummary(messageId) {
        const reactions = this.getMessageReactions(messageId);
        const summary = {};
        
        reactions.forEach(reaction => {
            if (!summary[reaction.emoji]) {
                summary[reaction.emoji] = {
                    count: 0,
                    users: []
                };
            }
            summary[reaction.emoji].count++;
            summary[reaction.emoji].users.push(reaction.userId);
        });
        
        return summary;
    }
    
    // 이모지 피커 데이터 생성
    generateEmojiPicker() {
        const currentLang = this.languageManager.getCurrentLanguage();
        const categories = this.emojiCategories[currentLang] || this.emojiCategories.ko;
        
        const pickerData = {
            categories: [],
            quickEmojis: this.quickEmojis,
            recentEmojis: this.getRecentEmojis(8),
            popularEmojis: this.getPopularEmojis(8)
        };
        
        // 카테고리별 이모지 정리
        Object.entries(categories).forEach(([key, category]) => {
            pickerData.categories.push({
                id: key,
                name: category.name,
                emojis: category.emojis
            });
        });
        
        return pickerData;
    }
    
    // 최근 사용한 이모지 조회
    getRecentEmojis(limit = 10) {
        const recentReactions = this.reactionHistory
            .slice(-50) // 최근 50개 반응만
            .reverse();
        
        const seen = new Set();
        const recent = [];
        
        for (const reaction of recentReactions) {
            if (!seen.has(reaction.emoji) && recent.length < limit) {
                seen.add(reaction.emoji);
                recent.push(reaction.emoji);
            }
        }
        
        return recent;
    }
    
    // 인기 이모지 조회
    getPopularEmojis(limit = 10) {
        return Object.entries(this.emojiStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([emoji]) => emoji);
    }
    
    // 이모지 통계 업데이트
    updateEmojiStats(emoji) {
        if (!this.emojiStats[emoji]) {
            this.emojiStats[emoji] = 0;
        }
        this.emojiStats[emoji]++;
    }
    
    // 이모지 검색
    searchEmojis(query) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const categories = this.emojiCategories[currentLang] || this.emojiCategories.ko;
        
        if (!query || query.length < 2) return [];
        
        const results = [];
        const queryLower = query.toLowerCase();
        
        // 이모지 이름 매핑 (한국어)
        const emojiNames = {
            '😊': ['웃음', '기쁨', 'smile', 'happy'],
            '😂': ['폭소', '웃음', 'laugh', 'lol'],
            '❤️': ['사랑', '하트', 'love', 'heart'],
            '👍': ['좋아요', '엄지', 'good', 'thumbs'],
            '👏': ['박수', 'clap', 'applause'],
            '🤔': ['생각', 'think', 'hmm'],
            '😮': ['놀람', 'wow', 'surprise'],
            '🔥': ['불', '핫', 'fire', 'hot'],
            '⭐': ['별', 'star'],
            '💡': ['아이디어', '전구', 'idea', 'bulb']
        };
        
        // 모든 카테고리에서 검색
        Object.values(categories).forEach(category => {
            category.emojis.forEach(emoji => {
                const names = emojiNames[emoji] || [];
                const matches = names.some(name => 
                    name.toLowerCase().includes(queryLower)
                );
                
                if (matches && !results.includes(emoji)) {
                    results.push(emoji);
                }
            });
        });
        
        return results.slice(0, 20);
    }
    
    // 이모지 자동 변환 (텍스트 -> 이모지)
    convertTextToEmoji(text) {
        const conversions = {
            ':)': '😊',
            ':-)': '😊',
            ':]': '😊',
            ':D': '😄',
            ':-D': '😄',
            ':P': '😛',
            ':-P': '😛',
            ';)': '😉',
            ';-)': '😉',
            ':(': '😢',
            ':-(': '😢',
            ':[': '😢',
            ':o': '😮',
            ':-o': '😮',
            ':O': '😮',
            ':-O': '😮',
            '<3': '❤️',
            '</3': '💔',
            ':*': '😘',
            ':-*': '😘',
            'xD': '😆',
            'XD': '😆',
            ':x': '😵',
            ':-x': '😵',
            ':X': '😵',
            ':-X': '😵'
        };
        
        let convertedText = text;
        Object.entries(conversions).forEach(([textEmoji, emoji]) => {
            convertedText = convertedText.replace(new RegExp(this.escapeRegex(textEmoji), 'g'), emoji);
        });
        
        return convertedText;
    }
    
    // 이모지가 포함된 텍스트인지 확인
    containsEmoji(text) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        return emojiRegex.test(text);
    }
    
    // 텍스트에서 이모지 추출
    extractEmojis(text) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return text.match(emojiRegex) || [];
    }
    
    // 이모지 반응 제안
    suggestReactions(messageText, messageType = 'user') {
        const suggestions = [];
        const text = messageText.toLowerCase();
        
        // 키워드 기반 제안
        const keywordReactions = {
            // 긍정적 키워드
            '감사': ['🙏', '😊', '❤️'],
            '고마워': ['🙏', '😊', '👍'],
            '좋': ['👍', '😊', '❤️'],
            '최고': ['🏆', '👏', '🔥'],
            '훌륭': ['👏', '🌟', '💯'],
            '완벽': ['💯', '✨', '👌'],
            'thank': ['🙏', '😊', '❤️'],
            'good': ['👍', '😊', '✨'],
            'great': ['👏', '🔥', '🌟'],
            'excellent': ['💯', '🏆', '👌'],
            
            // 질문/궁금
            '궁금': ['🤔', '❓', '💭'],
            '질문': ['❓', '🤔', '💡'],
            '어떻게': ['🤔', '❓', '💭'],
            'question': ['❓', '🤔', '💭'],
            'how': ['🤔', '❓', '💡'],
            'what': ['🤔', '❓', '💭'],
            
            // 놀람/감탄
            '놀라': ['😮', '😲', '🤯'],
            '대박': ['🤯', '😮', '🔥'],
            'wow': ['😮', '🤯', '✨'],
            'amazing': ['🤯', '🌟', '✨'],
            
            // 웃음
            '웃': ['😂', '😄', '😊'],
            '하하': ['😂', '😄', '🤣'],
            'lol': ['😂', '🤣', '😄'],
            'funny': ['😂', '🤣', '😄']
        };
        
        // 키워드 매칭으로 제안 생성
        Object.entries(keywordReactions).forEach(([keyword, emojis]) => {
            if (text.includes(keyword)) {
                suggestions.push(...emojis);
            }
        });
        
        // 기본 제안 (키워드 매칭이 없는 경우)
        if (suggestions.length === 0) {
            if (messageType === 'user') {
                suggestions.push('👍', '😊', '🤔');
            } else {
                suggestions.push('😊', '👏', '❤️');
            }
        }
        
        // 중복 제거 및 최대 6개로 제한
        return [...new Set(suggestions)].slice(0, 6);
    }
    
    // 이모지 통계 조회
    getEmojiStatistics() {
        const totalReactions = this.reactionHistory.length;
        const uniqueEmojis = Object.keys(this.emojiStats).length;
        const topEmojis = this.getPopularEmojis(5);
        const recentEmojis = this.getRecentEmojis(5);
        
        return {
            totalReactions,
            uniqueEmojis,
            topEmojis: topEmojis.map(emoji => ({
                emoji,
                count: this.emojiStats[emoji] || 0,
                percentage: Math.round((this.emojiStats[emoji] || 0) / totalReactions * 100)
            })),
            recentEmojis,
            averageReactionsPerMessage: totalReactions / Math.max(1, this.getUniqueMessageCount()),
            mostActiveDay: this.getMostActiveDay()
        };
    }
    
    // 고유 메시지 수 계산
    getUniqueMessageCount() {
        const uniqueMessages = new Set(this.reactionHistory.map(r => r.messageId));
        return uniqueMessages.size;
    }
    
    // 가장 활발한 날 조회
    getMostActiveDay() {
        const dayStats = {};
        
        this.reactionHistory.forEach(reaction => {
            const date = new Date(reaction.timestamp).toDateString();
            dayStats[date] = (dayStats[date] || 0) + 1;
        });
        
        const mostActive = Object.entries(dayStats)
            .sort(([,a], [,b]) => b - a)[0];
        
        return mostActive ? {
            date: mostActive[0],
            count: mostActive[1]
        } : null;
    }
    
    // 반응 ID 생성
    generateReactionId() {
        return 'reaction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // 정규표현식 이스케이프
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 데이터 저장/로드
    saveReactionHistory() {
        this.storage.saveReactions(this.reactionHistory);
    }
    
    loadReactionHistory() {
        const history = this.storage.loadReactions();
        if (history) {
            this.reactionHistory = history;
        }
    }
    
    saveEmojiStats() {
        this.storage.saveEmojiStats(this.emojiStats);
    }
    
    loadEmojiStats() {
        const stats = this.storage.loadEmojiStats();
        if (stats) {
            this.emojiStats = stats;
        }
    }
    
    // 데이터 정리
    clearOldReactions(daysToKeep = 30) {
        const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
        const oldLength = this.reactionHistory.length;
        
        this.reactionHistory = this.reactionHistory.filter(
            reaction => reaction.timestamp > cutoffDate
        );
        
        // 통계 재계산
        this.recalculateEmojiStats();
        
        const removedCount = oldLength - this.reactionHistory.length;
        if (removedCount > 0) {
            this.saveReactionHistory();
            this.saveEmojiStats();
        }
        
        return removedCount;
    }
    
    // 이모지 통계 재계산
    recalculateEmojiStats() {
        this.emojiStats = {};
        this.reactionHistory.forEach(reaction => {
            this.updateEmojiStats(reaction.emoji);
        });
    }
    
    // 모든 반응 데이터 삭제
    clearAllReactions() {
        this.reactionHistory = [];
        this.emojiStats = {};
        this.saveReactionHistory();
        this.saveEmojiStats();
    }
}