// Email Integration Module
export class EmailManager {
    constructor(storageManager, languageManager, exportManager) {
        this.storage = storageManager;
        this.languageManager = languageManager;
        this.export = exportManager;
        
        this.emailEndpoint = '/api/send-email'; // 서버 엔드포인트 (실제 구현 필요)
        this.maxEmailSize = 10 * 1024 * 1024; // 10MB 제한
        
        this.emailTemplates = {
            ko: {
                subject: '채팅 기록 - Junetapa',
                intro: '안녕하세요,\n\n요청하신 채팅 기록을 첨부해 드립니다.',
                outro: '\n\n감사합니다.\nJunetapa 팀',
                quickSubject: '빠른 문의 - Junetapa',
                quickIntro: '안녕하세요,\n\n채팅에서 전송된 메시지입니다:\n\n',
                quickOutro: '\n\n답변을 기다리겠습니다.\n감사합니다.',
                contactSubject: '연락처 요청 - Junetapa',
                contactIntro: '안녕하세요,\n\n연락처 정보를 요청합니다.',
                contactOutro: '\n\n빠른 연락 부탁드립니다.\n감사합니다.'
            },
            en: {
                subject: 'Chat History - Junetapa',
                intro: 'Hello,\n\nPlease find the requested chat history attached.',
                outro: '\n\nBest regards,\nJunetapa Team',
                quickSubject: 'Quick Inquiry - Junetapa',
                quickIntro: 'Hello,\n\nThis message was sent from the chat:\n\n',
                quickOutro: '\n\nI look forward to your response.\nThank you.',
                contactSubject: 'Contact Request - Junetapa',
                contactIntro: 'Hello,\n\nI would like to request contact information.',
                contactOutro: '\n\nPlease contact me soon.\nThank you.'
            }
        };
        
        this.recipientEmail = 'jun22sky@nate.com'; // 기본 수신자
        this.senderName = 'Junetapa Chatbot';
    }
    
    // 이메일 전송 (메인 함수)
    async sendEmail(type, options = {}) {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        try {
            let emailData;
            
            switch (type) {
                case 'chatHistory':
                    emailData = await this.prepareChatHistoryEmail(options);
                    break;
                case 'quickMessage':
                    emailData = this.prepareQuickMessageEmail(options);
                    break;
                case 'contactRequest':
                    emailData = this.prepareContactRequestEmail(options);
                    break;
                default:
                    throw new Error(`Unknown email type: ${type}`);
            }
            
            // 실제 이메일 전송 (서버 API 호출)
            const result = await this.sendEmailToServer(emailData);
            
            return {
                success: true,
                message: currentLang === 'ko' ? 
                    '이메일이 성공적으로 전송되었습니다.' : 
                    'Email sent successfully.',
                messageId: result.messageId
            };
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            return {
                success: false,
                message: currentLang === 'ko' ? 
                    '이메일 전송에 실패했습니다.' : 
                    'Failed to send email.',
                error: error.message
            };
        }
    }
    
    // 채팅 기록 이메일 준비
    async prepareChatHistoryEmail(options = {}) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const template = this.emailTemplates[currentLang];
        
        const {
            format = 'txt',
            senderEmail = '',
            senderName = '',
            message = '',
            includeAttachment = true
        } = options;
        
        const emailData = {
            to: this.recipientEmail,
            from: senderEmail,
            fromName: senderName || 'Anonymous User',
            subject: template.subject,
            body: template.intro,
            attachments: []
        };
        
        // 사용자 메시지 추가
        if (message) {
            emailData.body += `\n\n사용자 메시지:\n${message}`;
        }
        
        // 채팅 기록 첨부
        if (includeAttachment) {
            try {
                const exportResult = this.export.exportChat(format, {
                    includeTimestamps: true,
                    includeReactions: true,
                    includeMetadata: false
                });
                
                // 첨부파일 크기 확인
                const attachmentSize = new Blob([exportResult.content]).size;
                if (attachmentSize > this.maxEmailSize) {
                    throw new Error('Attachment too large');
                }
                
                emailData.attachments.push({
                    filename: exportResult.filename,
                    content: exportResult.content,
                    contentType: exportResult.mimeType
                });
                
                emailData.body += `\n\n채팅 기록이 ${format.toUpperCase()} 형식으로 첨부되었습니다.`;
                
            } catch (error) {
                console.warn('Failed to attach chat history:', error);
                emailData.body += '\n\n* 채팅 기록 첨부에 실패했습니다.';
            }
        }
        
        emailData.body += template.outro;
        
        return emailData;
    }
    
    // 빠른 메시지 이메일 준비
    prepareQuickMessageEmail(options = {}) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const template = this.emailTemplates[currentLang];
        
        const {
            senderEmail = '',
            senderName = '',
            message = '',
            category = 'general'
        } = options;
        
        const emailData = {
            to: this.recipientEmail,
            from: senderEmail,
            fromName: senderName || 'Anonymous User',
            subject: `${template.quickSubject} - ${category}`,
            body: template.quickIntro + message + template.quickOutro,
            attachments: []
        };
        
        return emailData;
    }
    
    // 연락처 요청 이메일 준비
    prepareContactRequestEmail(options = {}) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const template = this.emailTemplates[currentLang];
        
        const {
            senderEmail = '',
            senderName = '',
            phone = '',
            preferredContact = 'email',
            message = ''
        } = options;
        
        let body = template.contactIntro;
        
        body += `\n\n연락처 정보:`;
        body += `\n이름: ${senderName}`;
        body += `\n이메일: ${senderEmail}`;
        if (phone) body += `\n전화: ${phone}`;
        body += `\n선호 연락 방법: ${preferredContact}`;
        
        if (message) {
            body += `\n\n추가 메시지:\n${message}`;
        }
        
        body += template.contactOutro;
        
        const emailData = {
            to: this.recipientEmail,
            from: senderEmail,
            fromName: senderName || 'Anonymous User',
            subject: template.contactSubject,
            body: body,
            attachments: []
        };
        
        return emailData;
    }
    
    // 서버로 이메일 전송
    async sendEmailToServer(emailData) {
        // 실제 서버 API 호출 (모의 구현)
        // 실제 환경에서는 백엔드 API를 호출해야 함
        
        const response = await fetch(this.emailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // 이메일 주소 유효성 검사
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 이메일 폼 데이터 생성
    generateEmailForm(type = 'chatHistory') {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        const forms = {
            chatHistory: {
                title: currentLang === 'ko' ? '채팅 기록 이메일 전송' : 'Send Chat History Email',
                fields: [
                    {
                        id: 'senderEmail',
                        type: 'email',
                        label: currentLang === 'ko' ? '보내는 이메일' : 'Sender Email',
                        required: true,
                        placeholder: 'your@email.com'
                    },
                    {
                        id: 'senderName',
                        type: 'text',
                        label: currentLang === 'ko' ? '이름' : 'Name',
                        required: true,
                        placeholder: currentLang === 'ko' ? '홍길동' : 'John Doe'
                    },
                    {
                        id: 'message',
                        type: 'textarea',
                        label: currentLang === 'ko' ? '추가 메시지' : 'Additional Message',
                        required: false,
                        placeholder: currentLang === 'ko' ? 
                            '추가로 전달하실 메시지가 있으시면 입력해 주세요...' : 
                            'Enter any additional message...'
                    },
                    {
                        id: 'format',
                        type: 'select',
                        label: currentLang === 'ko' ? '첨부 형식' : 'Attachment Format',
                        required: false,
                        options: [
                            { value: 'txt', label: 'Text (.txt)' },
                            { value: 'html', label: 'HTML (.html)' },
                            { value: 'json', label: 'JSON (.json)' },
                            { value: 'csv', label: 'CSV (.csv)' },
                            { value: 'md', label: 'Markdown (.md)' }
                        ]
                    }
                ]
            },
            quickMessage: {
                title: currentLang === 'ko' ? '빠른 메시지 전송' : 'Send Quick Message',
                fields: [
                    {
                        id: 'senderEmail',
                        type: 'email',
                        label: currentLang === 'ko' ? '보내는 이메일' : 'Sender Email',
                        required: true,
                        placeholder: 'your@email.com'
                    },
                    {
                        id: 'senderName',
                        type: 'text',
                        label: currentLang === 'ko' ? '이름' : 'Name',
                        required: true,
                        placeholder: currentLang === 'ko' ? '홍길동' : 'John Doe'
                    },
                    {
                        id: 'category',
                        type: 'select',
                        label: currentLang === 'ko' ? '문의 유형' : 'Inquiry Type',
                        required: false,
                        options: [
                            { value: 'general', label: currentLang === 'ko' ? '일반 문의' : 'General Inquiry' },
                            { value: 'business', label: currentLang === 'ko' ? '비즈니스 문의' : 'Business Inquiry' },
                            { value: 'technical', label: currentLang === 'ko' ? '기술 문의' : 'Technical Inquiry' },
                            { value: 'collaboration', label: currentLang === 'ko' ? '협업 제안' : 'Collaboration Proposal' }
                        ]
                    },
                    {
                        id: 'message',
                        type: 'textarea',
                        label: currentLang === 'ko' ? '메시지' : 'Message',
                        required: true,
                        placeholder: currentLang === 'ko' ? 
                            '전달하실 메시지를 입력해 주세요...' : 
                            'Enter your message...'
                    }
                ]
            },
            contactRequest: {
                title: currentLang === 'ko' ? '연락처 요청' : 'Contact Request',
                fields: [
                    {
                        id: 'senderEmail',
                        type: 'email',
                        label: currentLang === 'ko' ? '보내는 이메일' : 'Sender Email',
                        required: true,
                        placeholder: 'your@email.com'
                    },
                    {
                        id: 'senderName',
                        type: 'text',
                        label: currentLang === 'ko' ? '이름' : 'Name',
                        required: true,
                        placeholder: currentLang === 'ko' ? '홍길동' : 'John Doe'
                    },
                    {
                        id: 'phone',
                        type: 'tel',
                        label: currentLang === 'ko' ? '전화번호' : 'Phone Number',
                        required: false,
                        placeholder: currentLang === 'ko' ? '010-0000-0000' : '+1-555-0000'
                    },
                    {
                        id: 'preferredContact',
                        type: 'select',
                        label: currentLang === 'ko' ? '선호 연락 방법' : 'Preferred Contact Method',
                        required: false,
                        options: [
                            { value: 'email', label: currentLang === 'ko' ? '이메일' : 'Email' },
                            { value: 'phone', label: currentLang === 'ko' ? '전화' : 'Phone' },
                            { value: 'both', label: currentLang === 'ko' ? '이메일/전화 모두' : 'Both Email/Phone' }
                        ]
                    },
                    {
                        id: 'message',
                        type: 'textarea',
                        label: currentLang === 'ko' ? '추가 메시지' : 'Additional Message',
                        required: false,
                        placeholder: currentLang === 'ko' ? 
                            '추가 요청사항이 있으시면 입력해 주세요...' : 
                            'Enter any additional requests...'
                    }
                ]
            }
        };
        
        return forms[type] || forms.chatHistory;
    }
    
    // 이메일 전송 통계
    getEmailStats() {
        const stats = this.storage.getItem('emailStats') || {
            totalSent: 0,
            successCount: 0,
            failureCount: 0,
            lastSent: null,
            typeStats: {
                chatHistory: 0,
                quickMessage: 0,
                contactRequest: 0
            }
        };
        
        return stats;
    }
    
    // 이메일 전송 통계 업데이트
    updateEmailStats(type, success) {
        const stats = this.getEmailStats();
        
        stats.totalSent++;
        stats.lastSent = new Date().toISOString();
        
        if (success) {
            stats.successCount++;
        } else {
            stats.failureCount++;
        }
        
        if (stats.typeStats[type] !== undefined) {
            stats.typeStats[type]++;
        }
        
        this.storage.setItem('emailStats', stats);
    }
    
    // 이메일 주소 자동완성 데이터
    getEmailSuggestions() {
        const recentEmails = this.storage.getItem('recentEmails') || [];
        return recentEmails.slice(0, 5); // 최근 5개만 반환
    }
    
    // 최근 사용한 이메일 저장
    saveRecentEmail(email) {
        if (!this.validateEmail(email)) return;
        
        let recentEmails = this.storage.getItem('recentEmails') || [];
        
        // 중복 제거
        recentEmails = recentEmails.filter(e => e !== email);
        
        // 맨 앞에 추가
        recentEmails.unshift(email);
        
        // 최대 10개까지만 저장
        recentEmails = recentEmails.slice(0, 10);
        
        this.storage.setItem('recentEmails', recentEmails);
    }
    
    // 이메일 템플릿 커스터마이징
    customizeEmailTemplate(lang, type, field, value) {
        if (!this.emailTemplates[lang] || !this.emailTemplates[lang][field]) {
            return false;
        }
        
        this.emailTemplates[lang][field] = value;
        return true;
    }
    
    // 서버 연결 상태 확인
    async checkServerConnection() {
        try {
            const response = await fetch(this.emailEndpoint + '/health', {
                method: 'HEAD',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            console.warn('Email server connection check failed:', error);
            return false;
        }
    }
    
    // 모의 이메일 전송 (개발/테스트용)
    async mockEmailSend(emailData) {
        // 실제 서버가 없을 때 사용할 모의 구현
        console.log('Mock email send:', emailData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    messageId: 'mock_' + Date.now(),
                    status: 'sent',
                    timestamp: new Date().toISOString()
                });
            }, 1000);
        });
    }
}