// Chat Export Module
export class ExportManager {
    constructor(storageManager, languageManager) {
        this.storage = storageManager;
        this.languageManager = languageManager;
        
        this.exportFormats = {
            txt: {
                name: 'Text File',
                extension: 'txt',
                mimeType: 'text/plain'
            },
            json: {
                name: 'JSON',
                extension: 'json',
                mimeType: 'application/json'
            },
            csv: {
                name: 'CSV',
                extension: 'csv',
                mimeType: 'text/csv'
            },
            html: {
                name: 'HTML',
                extension: 'html',
                mimeType: 'text/html'
            },
            md: {
                name: 'Markdown',
                extension: 'md',
                mimeType: 'text/markdown'
            }
        };
    }
    
    // 채팅 내보내기 (메인 함수)
    exportChat(format = 'txt', options = {}) {
        const messages = this.storage.loadMessages();
        
        if (!messages || messages.length === 0) {
            throw new Error('No messages to export');
        }
        
        const exportOptions = {
            includeTimestamps: true,
            includeReactions: true,
            includeMetadata: false,
            dateRange: null,
            messageTypes: ['user', 'bot'],
            ...options
        };
        
        // 메시지 필터링
        const filteredMessages = this.filterMessages(messages, exportOptions);
        
        // 포맷에 따른 내보내기
        let content;
        let filename;
        
        switch (format) {
            case 'txt':
                content = this.exportToText(filteredMessages, exportOptions);
                filename = this.generateFilename('txt');
                break;
            case 'json':
                content = this.exportToJSON(filteredMessages, exportOptions);
                filename = this.generateFilename('json');
                break;
            case 'csv':
                content = this.exportToCSV(filteredMessages, exportOptions);
                filename = this.generateFilename('csv');
                break;
            case 'html':
                content = this.exportToHTML(filteredMessages, exportOptions);
                filename = this.generateFilename('html');
                break;
            case 'md':
                content = this.exportToMarkdown(filteredMessages, exportOptions);
                filename = this.generateFilename('md');
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
        
        return {
            content,
            filename,
            mimeType: this.exportFormats[format].mimeType
        };
    }
    
    // 메시지 필터링
    filterMessages(messages, options) {
        let filtered = [...messages];
        
        // 날짜 범위 필터
        if (options.dateRange && options.dateRange.start && options.dateRange.end) {
            const startTime = new Date(options.dateRange.start).getTime();
            const endTime = new Date(options.dateRange.end).getTime();
            
            filtered = filtered.filter(msg => {
                const msgTime = new Date(msg.timestamp).getTime();
                return msgTime >= startTime && msgTime <= endTime;
            });
        }
        
        // 메시지 타입 필터
        if (options.messageTypes && options.messageTypes.length > 0) {
            filtered = filtered.filter(msg => options.messageTypes.includes(msg.sender));
        }
        
        return filtered;
    }
    
    // 텍스트 형식으로 내보내기
    exportToText(messages, options) {
        const currentLang = this.languageManager.getCurrentLanguage();
        let content = '';
        
        // 헤더
        content += currentLang === 'ko' ? 
            '=== 채팅 기록 ===\n' : 
            '=== Chat History ===\n';
        content += `${currentLang === 'ko' ? '내보내기 시간' : 'Exported'}: ${new Date().toLocaleString()}\n`;
        content += `${currentLang === 'ko' ? '총 메시지' : 'Total messages'}: ${messages.length}\n\n`;
        
        // 메시지들
        messages.forEach((message, index) => {
            const timestamp = options.includeTimestamps ? 
                `[${new Date(message.timestamp).toLocaleString()}] ` : '';
            
            const sender = message.sender === 'user' ? 
                (currentLang === 'ko' ? '사용자' : 'User') : 
                (currentLang === 'ko' ? '봇' : 'Bot');
            
            content += `${timestamp}${sender}: ${message.text}\n`;
            
            // 반응 포함 (옵션)
            if (options.includeReactions && message.reactions && message.reactions.length > 0) {
                const reactions = message.reactions.map(r => `${r.emoji}${r.count > 1 ? ` (${r.count})` : ''}`).join(' ');
                content += `   ${currentLang === 'ko' ? '반응' : 'Reactions'}: ${reactions}\n`;
            }
            
            content += '\n';
        });
        
        return content;
    }
    
    // JSON 형식으로 내보내기
    exportToJSON(messages, options) {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                language: currentLang,
                totalMessages: messages.length,
                exportOptions: options
            },
            messages: messages.map(message => ({
                id: message.id,
                text: message.text,
                sender: message.sender,
                timestamp: message.timestamp,
                category: message.category,
                ...(options.includeReactions && message.reactions ? { reactions: message.reactions } : {}),
                ...(options.includeMetadata && message.metadata ? { metadata: message.metadata } : {})
            }))
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    // CSV 형식으로 내보내기
    exportToCSV(messages, options) {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        // 헤더
        let headers = [
            currentLang === 'ko' ? '시간' : 'Timestamp',
            currentLang === 'ko' ? '발신자' : 'Sender',
            currentLang === 'ko' ? '메시지' : 'Message',
            currentLang === 'ko' ? '카테고리' : 'Category'
        ];
        
        if (options.includeReactions) {
            headers.push(currentLang === 'ko' ? '반응' : 'Reactions');
        }
        
        let content = headers.join(',') + '\n';
        
        // 데이터 행들
        messages.forEach(message => {
            const row = [
                `"${new Date(message.timestamp).toLocaleString()}"`,
                `"${message.sender}"`,
                `"${this.escapeCSV(message.text)}"`,
                `"${message.category || ''}"`
            ];
            
            if (options.includeReactions) {
                const reactions = message.reactions ? 
                    message.reactions.map(r => `${r.emoji}${r.count > 1 ? `(${r.count})` : ''}`).join(' ') : '';
                row.push(`"${reactions}"`);
            }
            
            content += row.join(',') + '\n';
        });
        
        return content;
    }
    
    // HTML 형식으로 내보내기
    exportToHTML(messages, options) {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        let html = `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentLang === 'ko' ? '채팅 기록' : 'Chat History'}</title>
    <style>
        body { 
            font-family: 'Noto Sans KR', sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .header { 
            background: #7B68EE; 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px; 
        }
        .message { 
            background: white; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 10px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
        }
        .user-message { 
            background: #e3f2fd; 
            margin-left: 50px; 
        }
        .bot-message { 
            background: #f3e5f5; 
            margin-right: 50px; 
        }
        .timestamp { 
            font-size: 0.8em; 
            color: #666; 
            margin-bottom: 5px; 
        }
        .sender { 
            font-weight: bold; 
            margin-bottom: 8px; 
        }
        .reactions { 
            margin-top: 8px; 
            font-size: 0.9em; 
        }
        .stats { 
            background: white; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${currentLang === 'ko' ? '채팅 기록' : 'Chat History'}</h1>
        <p>${currentLang === 'ko' ? '내보내기 시간' : 'Exported'}: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="stats">
        <strong>${currentLang === 'ko' ? '총 메시지' : 'Total Messages'}:</strong> ${messages.length}
    </div>
`;
        
        messages.forEach(message => {
            const messageClass = message.sender === 'user' ? 'user-message' : 'bot-message';
            const sender = message.sender === 'user' ? 
                (currentLang === 'ko' ? '사용자' : 'User') : 
                (currentLang === 'ko' ? '봇' : 'Bot');
            
            html += `
    <div class="message ${messageClass}">
        ${options.includeTimestamps ? `<div class="timestamp">${new Date(message.timestamp).toLocaleString()}</div>` : ''}
        <div class="sender">${sender}</div>
        <div class="content">${this.escapeHTML(message.text)}</div>
        ${options.includeReactions && message.reactions ? 
            `<div class="reactions">${currentLang === 'ko' ? '반응' : 'Reactions'}: ${message.reactions.map(r => `${r.emoji}${r.count > 1 ? ` (${r.count})` : ''}`).join(' ')}</div>` : ''}
    </div>`;
        });
        
        html += `
</body>
</html>`;
        
        return html;
    }
    
    // Markdown 형식으로 내보내기
    exportToMarkdown(messages, options) {
        const currentLang = this.languageManager.getCurrentLanguage();
        let content = '';
        
        // 헤더
        content += `# ${currentLang === 'ko' ? '채팅 기록' : 'Chat History'}\n\n`;
        content += `**${currentLang === 'ko' ? '내보내기 시간' : 'Exported'}:** ${new Date().toLocaleString()}  \n`;
        content += `**${currentLang === 'ko' ? '총 메시지' : 'Total Messages'}:** ${messages.length}\n\n`;
        content += '---\n\n';
        
        // 메시지들
        messages.forEach((message, index) => {
            const timestamp = options.includeTimestamps ? 
                `*${new Date(message.timestamp).toLocaleString()}*  \n` : '';
            
            const sender = message.sender === 'user' ? 
                (currentLang === 'ko' ? '**사용자**' : '**User**') : 
                (currentLang === 'ko' ? '**봇**' : '**Bot**');
            
            content += `${timestamp}${sender}: ${message.text}\n\n`;
            
            // 반응 포함
            if (options.includeReactions && message.reactions && message.reactions.length > 0) {
                const reactions = message.reactions.map(r => `${r.emoji}${r.count > 1 ? ` (${r.count})` : ''}`).join(' ');
                content += `> ${currentLang === 'ko' ? '반응' : 'Reactions'}: ${reactions}\n\n`;
            }
        });
        
        return content;
    }
    
    // 파일 다운로드
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
    }
    
    // 클립보드에 복사
    copyToClipboard(content) {
        return navigator.clipboard.writeText(content);
    }
    
    // 내보내기 옵션 UI 데이터 생성
    generateExportOptions() {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        return {
            formats: Object.entries(this.exportFormats).map(([key, format]) => ({
                id: key,
                name: format.name,
                extension: format.extension
            })),
            options: {
                includeTimestamps: {
                    label: currentLang === 'ko' ? '시간 포함' : 'Include Timestamps',
                    default: true
                },
                includeReactions: {
                    label: currentLang === 'ko' ? '반응 포함' : 'Include Reactions',
                    default: true
                },
                includeMetadata: {
                    label: currentLang === 'ko' ? '메타데이터 포함' : 'Include Metadata',
                    default: false
                }
            },
            dateRange: {
                label: currentLang === 'ko' ? '날짜 범위' : 'Date Range',
                options: [
                    { id: 'all', label: currentLang === 'ko' ? '전체' : 'All' },
                    { id: 'today', label: currentLang === 'ko' ? '오늘' : 'Today' },
                    { id: 'week', label: currentLang === 'ko' ? '이번 주' : 'This Week' },
                    { id: 'month', label: currentLang === 'ko' ? '이번 달' : 'This Month' },
                    { id: 'custom', label: currentLang === 'ko' ? '사용자 지정' : 'Custom' }
                ]
            },
            messageTypes: {
                label: currentLang === 'ko' ? '메시지 타입' : 'Message Types',
                options: [
                    { id: 'all', label: currentLang === 'ko' ? '전체' : 'All' },
                    { id: 'user', label: currentLang === 'ko' ? '사용자만' : 'User Only' },
                    { id: 'bot', label: currentLang === 'ko' ? '봇만' : 'Bot Only' }
                ]
            }
        };
    }
    
    // 날짜 범위 계산
    calculateDateRange(rangeType) {
        const now = new Date();
        let start, end;
        
        switch (rangeType) {
            case 'today':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                weekStart.setHours(0, 0, 0, 0);
                start = weekStart;
                end = new Date(weekStart);
                end.setDate(weekStart.getDate() + 7);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            default:
                return null;
        }
        
        return { start, end };
    }
    
    // 내보내기 통계
    getExportStats() {
        const messages = this.storage.loadMessages();
        
        return {
            totalMessages: messages.length,
            userMessages: messages.filter(m => m.sender === 'user').length,
            botMessages: messages.filter(m => m.sender === 'bot').length,
            dateRange: {
                first: messages.length > 0 ? new Date(messages[0].timestamp) : null,
                last: messages.length > 0 ? new Date(messages[messages.length - 1].timestamp) : null
            },
            totalReactions: messages.reduce((sum, msg) => sum + (msg.reactions ? msg.reactions.length : 0), 0),
            categories: this.getCategoryStats(messages)
        };
    }
    
    // 카테고리 통계
    getCategoryStats(messages) {
        const stats = {};
        messages.forEach(msg => {
            if (msg.category) {
                stats[msg.category] = (stats[msg.category] || 0) + 1;
            }
        });
        return stats;
    }
    
    // 파일명 생성
    generateFilename(extension) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        return `chat-export-${dateStr}-${timeStr}.${extension}`;
    }
    
    // CSV 이스케이프
    escapeCSV(text) {
        return text.replace(/"/g, '""');
    }
    
    // HTML 이스케이프
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 빠른 내보내기 (기본 설정)
    quickExport(format = 'txt') {
        try {
            const result = this.exportChat(format);
            this.downloadFile(result.content, result.filename, result.mimeType);
            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    }
    
    // 내보내기 미리보기
    previewExport(format, options) {
        const messages = this.storage.loadMessages().slice(0, 5); // 처음 5개만
        const filteredMessages = this.filterMessages(messages, options);
        
        switch (format) {
            case 'txt':
                return this.exportToText(filteredMessages, options);
            case 'json':
                return this.exportToJSON(filteredMessages, options);
            case 'csv':
                return this.exportToCSV(filteredMessages, options);
            case 'html':
                return this.exportToHTML(filteredMessages, options);
            case 'md':
                return this.exportToMarkdown(filteredMessages, options);
            default:
                return '';
        }
    }
}