/**
 * Chatbot Lite - 경량 FAQ 챗봇
 * junetapa.info
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'chatbot-state';

    // --- FAQ 데이터 (9개 카테고리) ---
    const responses = {
        greeting: [
            '안녕하세요! Junetapa입니다. 무엇을 도와드릴까요?',
            '반갑습니다! 어떤 것이 궁금하신가요?',
            '환영합니다! 포트폴리오, 경력, 협업 등 자유롭게 질문해 주세요.'
        ],
        portfolio: [
            '25년 이상의 IT 경력을 바탕으로 다양한 프로젝트를 수행했습니다. 포트폴리오 섹션에서 확인해 보세요!',
            'B2B 기술영업, 전산유지보수, 웹 개발 등 폭넓은 프로젝트 경험이 있습니다.',
            '디지털 마케팅부터 시스템 구축까지, 다양한 IT 프로젝트를 진행해 왔습니다.'
        ],
        skills: [
            'IT 인프라 관리, 웹 개발(HTML/CSS/JS), B2B 기술영업이 핵심 역량입니다.',
            '전산유지보수, 네트워크 관리, 디지털 마케팅 등 폭넓은 기술 스택을 보유하고 있습니다.',
            'AI 도구 활용, 클라우드 서비스, 데이터 분석 등 최신 기술에도 관심이 많습니다.'
        ],
        experience: [
            '25년 이상의 IT 현장 경험을 보유하고 있습니다. 경력 섹션에서 자세히 확인하실 수 있어요.',
            'B2B 기술영업과 전산유지보수 분야에서 오랜 경력을 쌓았습니다.',
            '다양한 기업의 IT 인프라 구축 및 운영 경험이 있습니다.'
        ],
        contact: [
            '이메일: jun22sky@nate.com 으로 연락해 주세요!',
            '페이지 하단의 연락처 폼을 통해 메시지를 보내실 수 있습니다.',
            '카카오톡 오픈채팅으로도 연락 가능합니다. 하단 카카오톡 버튼을 클릭해 보세요!'
        ],
        collaboration: [
            '협업 제안은 언제든 환영합니다! 이메일이나 연락처 폼으로 내용을 보내주세요.',
            '프리랜서 프로젝트, 기술 자문, 공동 개발 등 다양한 형태의 협업이 가능합니다.',
            '구체적인 프로젝트 내용을 알려주시면 더 정확한 답변을 드릴 수 있습니다.'
        ],
        music: [
            'Junetapa는 음악 크리에이터로도 활동 중입니다! 창작활동 섹션을 확인해 보세요.',
            'AI 기반 음악 제작(Suno, Udio 등)에도 관심이 많습니다.',
            '작곡, 편곡, 음원 제작까지 다양한 음악 활동을 하고 있습니다.'
        ],
        blog: [
            'AI 도구 리뷰와 개발 블로그를 운영하고 있습니다. junetapa.com에서 확인하세요!',
            'ChatGPT, Claude, Cursor AI 등 AI 도구 실전 리뷰를 작성하고 있습니다.',
            '프론트엔드, 백엔드, DevOps 등 다양한 개발 주제를 다루고 있습니다.'
        ],
        default: [
            '흥미로운 질문이네요! 좀 더 자세히 말씀해 주시겠어요?',
            '포트폴리오, 경력, 협업, 음악 등에 대해 자유롭게 질문해 주세요!',
            '궁금한 점이 있으시면 언제든 물어봐 주세요. 최선을 다해 답변드리겠습니다!'
        ]
    };

    const keywords = {
        greeting: ['안녕', 'hello', 'hi', '반가', '처음', '하이', '헬로'],
        portfolio: ['포트폴리오', '작업', '프로젝트', '작품'],
        skills: ['기술', '스킬', '역량', '능력', '할 수 있', 'skill', '전문'],
        experience: ['경력', '이력', '경험', '커리어', '연차', 'career'],
        contact: ['연락', '이메일', '전화', '문의', 'email', 'contact', '메일'],
        collaboration: ['협업', '제안', '같이', '함께', '파트너', '외주', '프리랜서'],
        music: ['음악', '노래', '작곡', '뮤직', 'music', '사운드', 'suno'],
        blog: ['블로그', '글', '포스트', '리뷰', 'blog', '게시글']
    };

    // --- 유틸리티 ---
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function timeGreeting() {
        var h = new Date().getHours();
        if (h < 12) return '좋은 아침이에요! ';
        if (h < 18) return '좋은 오후예요! ';
        return '좋은 저녁이에요! ';
    }

    function now() {
        return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }

    // --- DOM 캐시 ---
    var widget, launcher, chatMessages, chatInput, chatSend, chatTyping,
        closeBtn, minimizeBtn, suggestions, notification;

    function cacheDom() {
        widget = document.getElementById('chatWidget');
        launcher = document.getElementById('chatLauncher');
        chatMessages = document.getElementById('chatMessages');
        chatInput = document.getElementById('chatInput');
        chatSend = document.getElementById('chatSend');
        chatTyping = document.getElementById('chatTyping');
        closeBtn = document.getElementById('chatClose');
        minimizeBtn = document.getElementById('chatMinimize');
        suggestions = document.querySelectorAll('.suggestion-btn');
        notification = document.getElementById('launcherNotification');
    }

    // --- 메시지 추가 ---
    function addMessage(content, isUser) {
        var div = document.createElement('div');
        div.className = 'chat-message ' + (isUser ? 'user' : 'bot');

        var avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? 'U' : 'J';

        var body = document.createElement('div');
        body.className = 'message-content';

        var text = document.createElement('div');
        text.className = 'message-text';
        text.textContent = content;

        var time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = now();

        body.appendChild(text);
        body.appendChild(time);
        div.appendChild(avatar);
        div.appendChild(body);

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- 응답 생성 ---
    function generateResponse(message) {
        var lower = message.toLowerCase();
        for (var cat in keywords) {
            if (!keywords.hasOwnProperty(cat)) continue;
            var words = keywords[cat];
            for (var i = 0; i < words.length; i++) {
                if (lower.indexOf(words[i]) !== -1) {
                    return pick(responses[cat]);
                }
            }
        }
        return pick(responses.default);
    }

    // --- 타이핑 인디케이터 ---
    function showTyping() {
        if (chatTyping) chatTyping.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        if (chatTyping) chatTyping.style.display = 'none';
    }

    // --- 전송 ---
    function sendMessage(text) {
        var message = text || (chatInput ? chatInput.value.trim() : '');
        if (!message) return;

        addMessage(message, true);
        if (chatInput) chatInput.value = '';

        showTyping();
        var delay = 400 + Math.random() * 600;
        setTimeout(function () {
            hideTyping();
            addMessage(generateResponse(message), false);
        }, delay);
    }

    // --- 위젯 열기/닫기 ---
    function openWidget() {
        widget.classList.add('active');
        if (notification) notification.style.display = 'none';
        saveState('open');
        setTimeout(function () {
            if (chatInput) chatInput.focus();
        }, 300);
    }

    function closeWidget() {
        widget.classList.remove('active');
        saveState('closed');
    }

    function minimizeWidget() {
        widget.classList.remove('active');
        saveState('closed');
    }

    // --- 상태 저장 ---
    function saveState(state) {
        try { localStorage.setItem(STORAGE_KEY, state); } catch (e) { /* noop */ }
    }

    function loadState() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    // --- 초기화 ---
    function init() {
        cacheDom();
        if (!widget || !launcher) return;

        // 런처 클릭
        launcher.addEventListener('click', function () {
            if (widget.classList.contains('active')) {
                closeWidget();
            } else {
                openWidget();
            }
        });

        // 닫기
        if (closeBtn) closeBtn.addEventListener('click', closeWidget);

        // 최소화
        if (minimizeBtn) minimizeBtn.addEventListener('click', minimizeWidget);

        // 전송
        if (chatSend) chatSend.addEventListener('click', function () { sendMessage(); });
        if (chatInput) {
            chatInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') sendMessage();
            });
        }

        // 추천 버튼
        for (var i = 0; i < suggestions.length; i++) {
            suggestions[i].addEventListener('click', function () {
                sendMessage(this.getAttribute('data-message'));
            });
        }

        // 이전 상태 복원
        if (loadState() === 'open') {
            openWidget();
        }

        // 시간대 인사 (초기 메시지 교체)
        var firstMsg = chatMessages.querySelector('.bot-message .message-text, .message-text');
        if (firstMsg) {
            firstMsg.textContent = timeGreeting() + 'Junetapa입니다. 무엇을 도와드릴까요?';
        }
    }

    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
