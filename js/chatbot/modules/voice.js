// Voice Recognition Module
export class VoiceManager {
    constructor(storageManager, languageManager) {
        this.storage = storageManager;
        this.languageManager = languageManager;
        
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.recognition = null;
        this.isListening = false;
        this.isEnabled = true;
        
        // 음성 인식 설정
        this.recognitionConfig = {
            continuous: false,
            interimResults: true,
            maxAlternatives: 3,
            lang: 'ko-KR' // 기본값, 동적으로 변경됨
        };
        
        // 음성 합성 설정 (TTS)
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.ttsEnabled = true;
        this.ttsVoice = null;
        
        // 음성 명령 키워드
        this.voiceCommands = {
            ko: {
                send: ['전송', '보내기', '전송해줘'],
                clear: ['지우기', '삭제', '클리어'],
                close: ['닫기', '종료'],
                help: ['도움말', '헬프'],
                stop: ['정지', '중지', '그만'],
                repeat: ['다시', '반복']
            },
            en: {
                send: ['send', 'submit', 'go'],
                clear: ['clear', 'delete', 'remove'],
                close: ['close', 'exit', 'quit'],
                help: ['help', 'assist'],
                stop: ['stop', 'cancel'],
                repeat: ['repeat', 'again']
            }
        };
        
        this.initializeVoiceRecognition();
        this.initializeTextToSpeech();
        
        // 언어 변경 시 음성 인식 언어도 변경
        window.addEventListener('languageChanged', () => {
            this.updateLanguageSettings();
        });
    }
    
    // 음성 인식 초기화
    initializeVoiceRecognition() {
        if (!this.isSupported) {
            console.warn('Speech recognition not supported');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // 음성 인식 설정 적용
        Object.assign(this.recognition, this.recognitionConfig);
        
        // 이벤트 리스너 설정
        this.recognition.onstart = () => {
            this.isListening = true;
            this.onListeningStart();
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningEnd();
        };
        
        this.recognition.onresult = (event) => {
            this.handleSpeechResult(event);
        };
        
        this.recognition.onerror = (event) => {
            this.handleSpeechError(event);
        };
        
        this.recognition.onnomatch = () => {
            this.onNoMatch();
        };
    }
    
    // 텍스트 음성 변환 초기화
    initializeTextToSpeech() {
        if (!this.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }
        
        // 사용 가능한 음성 로드
        this.loadAvailableVoices();
        
        // 음성이 변경될 때마다 업데이트
        this.speechSynthesis.addEventListener('voiceschanged', () => {
            this.loadAvailableVoices();
        });
    }
    
    // 사용 가능한 음성 로드
    loadAvailableVoices() {
        const voices = this.speechSynthesis.getVoices();
        const currentLang = this.languageManager.getCurrentLanguage();
        
        // 현재 언어에 맞는 음성 찾기
        let preferredVoice = null;
        
        if (currentLang === 'ko') {
            preferredVoice = voices.find(voice => 
                voice.lang.startsWith('ko') && voice.localService
            ) || voices.find(voice => voice.lang.startsWith('ko'));
        } else {
            preferredVoice = voices.find(voice => 
                voice.lang.startsWith('en') && voice.localService
            ) || voices.find(voice => voice.lang.startsWith('en'));
        }
        
        this.ttsVoice = preferredVoice || voices[0];
    }
    
    // 언어 설정 업데이트
    updateLanguageSettings() {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        if (this.recognition) {
            this.recognition.lang = currentLang === 'ko' ? 'ko-KR' : 'en-US';
        }
        
        this.loadAvailableVoices();
    }
    
    // 음성 인식 시작
    startListening() {
        if (!this.isSupported || !this.isEnabled || this.isListening) {
            return false;
        }
        
        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            return false;
        }
    }
    
    // 음성 인식 중지
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    // 음성 인식 토글
    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
    
    // 음성 인식 결과 처리
    handleSpeechResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        // 임시 결과 표시
        if (interimTranscript) {
            this.onInterimResult(interimTranscript);
        }
        
        // 최종 결과 처리
        if (finalTranscript) {
            this.processFinalResult(finalTranscript.trim());
        }
    }
    
    // 최종 음성 인식 결과 처리
    processFinalResult(transcript) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const commands = this.voiceCommands[currentLang];
        
        // 음성 명령 확인
        const command = this.detectVoiceCommand(transcript, commands);
        
        if (command) {
            this.executeVoiceCommand(command, transcript);
        } else {
            // 일반 텍스트로 처리
            this.onTextRecognized(transcript);
        }
        
        // 통계 업데이트
        this.updateVoiceStats('recognition', true);
    }
    
    // 음성 명령 감지
    detectVoiceCommand(transcript, commands) {
        const lowerTranscript = transcript.toLowerCase();
        
        for (const [command, keywords] of Object.entries(commands)) {
            for (const keyword of keywords) {
                if (lowerTranscript.includes(keyword.toLowerCase())) {
                    return command;
                }
            }
        }
        
        return null;
    }
    
    // 음성 명령 실행
    executeVoiceCommand(command, transcript) {
        switch (command) {
            case 'send':
                this.onVoiceCommand('send', transcript);
                break;
            case 'clear':
                this.onVoiceCommand('clear', transcript);
                break;
            case 'close':
                this.onVoiceCommand('close', transcript);
                break;
            case 'help':
                this.onVoiceCommand('help', transcript);
                break;
            case 'stop':
                this.stopListening();
                this.stopSpeaking();
                break;
            case 'repeat':
                this.onVoiceCommand('repeat', transcript);
                break;
        }
    }
    
    // 음성 인식 오류 처리
    handleSpeechError(event) {
        console.warn('Speech recognition error:', event.error);
        
        const currentLang = this.languageManager.getCurrentLanguage();
        let errorMessage;
        
        switch (event.error) {
            case 'network':
                errorMessage = currentLang === 'ko' ? 
                    '네트워크 연결을 확인해주세요.' : 
                    'Please check your network connection.';
                break;
            case 'not-allowed':
                errorMessage = currentLang === 'ko' ? 
                    '마이크 권한을 허용해주세요.' : 
                    'Please allow microphone access.';
                break;
            case 'no-speech':
                errorMessage = currentLang === 'ko' ? 
                    '음성이 감지되지 않았습니다.' : 
                    'No speech detected.';
                break;
            default:
                errorMessage = currentLang === 'ko' ? 
                    '음성 인식 오류가 발생했습니다.' : 
                    'Speech recognition error occurred.';
        }
        
        this.onError(event.error, errorMessage);
        this.updateVoiceStats('recognition', false);
    }
    
    // 텍스트 음성 변환 (TTS)
    speak(text, options = {}) {
        if (!this.speechSynthesis || !this.ttsEnabled) {
            return false;
        }
        
        // 현재 재생 중인 음성 중지
        this.stopSpeaking();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 설정 적용
        utterance.voice = this.ttsVoice;
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        
        // 이벤트 리스너
        utterance.onstart = () => {
            this.onSpeechStart();
        };
        
        utterance.onend = () => {
            this.currentUtterance = null;
            this.onSpeechEnd();
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.updateVoiceStats('synthesis', false);
        };
        
        this.currentUtterance = utterance;
        this.speechSynthesis.speak(utterance);
        
        this.updateVoiceStats('synthesis', true);
        return true;
    }
    
    // 음성 재생 중지
    stopSpeaking() {
        if (this.speechSynthesis && this.currentUtterance) {
            this.speechSynthesis.cancel();
            this.currentUtterance = null;
        }
    }
    
    // 음성 재생 일시정지/재개
    pauseResumeSpeaking() {
        if (!this.speechSynthesis) return;
        
        if (this.speechSynthesis.speaking && !this.speechSynthesis.paused) {
            this.speechSynthesis.pause();
        } else if (this.speechSynthesis.paused) {
            this.speechSynthesis.resume();
        }
    }
    
    // 음성 인식 지원 여부 확인
    isVoiceRecognitionSupported() {
        return this.isSupported;
    }
    
    // TTS 지원 여부 확인
    isTextToSpeechSupported() {
        return !!this.speechSynthesis;
    }
    
    // 음성 인식 활성화/비활성화
    setVoiceRecognitionEnabled(enabled) {
        this.isEnabled = enabled;
        this.storage.setItem('voiceRecognitionEnabled', enabled);
        
        if (!enabled && this.isListening) {
            this.stopListening();
        }
    }
    
    // TTS 활성화/비활성화
    setTextToSpeechEnabled(enabled) {
        this.ttsEnabled = enabled;
        this.storage.setItem('textToSpeechEnabled', enabled);
        
        if (!enabled) {
            this.stopSpeaking();
        }
    }
    
    // 음성 설정 데이터 생성
    generateVoiceSettings() {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        return {
            recognition: {
                supported: this.isSupported,
                enabled: this.isEnabled,
                listening: this.isListening,
                language: this.recognition?.lang || 'ko-KR'
            },
            synthesis: {
                supported: this.isTextToSpeechSupported(),
                enabled: this.ttsEnabled,
                speaking: this.speechSynthesis?.speaking || false,
                voice: this.ttsVoice?.name || 'Default',
                voices: this.speechSynthesis?.getVoices().map(voice => ({
                    name: voice.name,
                    lang: voice.lang,
                    localService: voice.localService
                })) || []
            },
            commands: this.voiceCommands[currentLang],
            stats: this.getVoiceStats()
        };
    }
    
    // 음성 통계
    getVoiceStats() {
        const stats = this.storage.getItem('voiceStats') || {
            totalRecognitions: 0,
            successfulRecognitions: 0,
            totalSynthesis: 0,
            successfulSynthesis: 0,
            commandsExecuted: 0,
            lastUsed: null
        };
        
        return stats;
    }
    
    // 음성 통계 업데이트
    updateVoiceStats(type, success) {
        const stats = this.getVoiceStats();
        
        stats.lastUsed = new Date().toISOString();
        
        if (type === 'recognition') {
            stats.totalRecognitions++;
            if (success) stats.successfulRecognitions++;
        } else if (type === 'synthesis') {
            stats.totalSynthesis++;
            if (success) stats.successfulSynthesis++;
        } else if (type === 'command') {
            stats.commandsExecuted++;
        }
        
        this.storage.setItem('voiceStats', stats);
    }
    
    // 마이크 권한 확인
    async checkMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.warn('Microphone permission denied:', error);
            return false;
        }
    }
    
    // 음성 명령 도움말 생성
    generateVoiceCommandHelp() {
        const currentLang = this.languageManager.getCurrentLanguage();
        const commands = this.voiceCommands[currentLang];
        
        let helpText = currentLang === 'ko' ? 
            '🎤 **음성 명령어**\\n\\n' : 
            '🎤 **Voice Commands**\\n\\n';
        
        for (const [command, keywords] of Object.entries(commands)) {
            const commandLabel = {
                send: currentLang === 'ko' ? '메시지 전송' : 'Send Message',
                clear: currentLang === 'ko' ? '입력 지우기' : 'Clear Input',
                close: currentLang === 'ko' ? '채팅 닫기' : 'Close Chat',
                help: currentLang === 'ko' ? '도움말' : 'Help',
                stop: currentLang === 'ko' ? '음성 중지' : 'Stop Voice',
                repeat: currentLang === 'ko' ? '다시 듣기' : 'Repeat'
            }[command];
            
            helpText += `**${commandLabel}:** ${keywords.join(', ')}\\n`;
        }
        
        return helpText;
    }
    
    // 이벤트 콜백 (외부에서 구현)
    onListeningStart() {
        // 음성 인식 시작 시 호출
    }
    
    onListeningEnd() {
        // 음성 인식 종료 시 호출
    }
    
    onInterimResult(transcript) {
        // 임시 인식 결과 수신 시 호출
    }
    
    onTextRecognized(transcript) {
        // 최종 텍스트 인식 시 호출
    }
    
    onVoiceCommand(command, transcript) {
        // 음성 명령 실행 시 호출
    }
    
    onNoMatch() {
        // 음성이 인식되지 않았을 때 호출
    }
    
    onError(errorType, message) {
        // 오류 발생 시 호출
    }
    
    onSpeechStart() {
        // TTS 시작 시 호출
    }
    
    onSpeechEnd() {
        // TTS 종료 시 호출
    }
    
    // 설정 저장/로드
    saveSettings() {
        const settings = {
            recognitionEnabled: this.isEnabled,
            ttsEnabled: this.ttsEnabled,
            recognitionLang: this.recognition?.lang,
            selectedVoice: this.ttsVoice?.name
        };
        
        this.storage.setItem('voiceSettings', settings);
    }
    
    loadSettings() {
        const settings = this.storage.getItem('voiceSettings');
        if (settings) {
            this.isEnabled = settings.recognitionEnabled !== false;
            this.ttsEnabled = settings.ttsEnabled !== false;
            
            if (this.recognition && settings.recognitionLang) {
                this.recognition.lang = settings.recognitionLang;
            }
            
            if (settings.selectedVoice) {
                const voices = this.speechSynthesis?.getVoices() || [];
                const selectedVoice = voices.find(voice => voice.name === settings.selectedVoice);
                if (selectedVoice) {
                    this.ttsVoice = selectedVoice;
                }
            }
        }
    }
}