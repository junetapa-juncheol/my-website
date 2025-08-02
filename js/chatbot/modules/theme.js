// Theme Customization Module
export class ThemeManager {
    constructor(storageManager, languageManager) {
        this.storage = storageManager;
        this.languageManager = languageManager;
        this.currentTheme = 'light';
        this.themeSettings = {};
        
        // 기본 테마 설정
        this.defaultThemes = {
            light: {
                name: '라이트',
                colors: {
                    primary: '#7B68EE',
                    secondary: '#6A5ACD',
                    accent: '#4A90E2',
                    success: '#4CAF50',
                    warning: '#FF9800',
                    danger: '#f44336',
                    bgPrimary: '#ffffff',
                    bgSecondary: '#f8f9fa',
                    bgTertiary: '#e9ecef',
                    textPrimary: '#333333',
                    textSecondary: '#666666',
                    textTertiary: '#999999',
                    textInverse: '#ffffff',
                    borderPrimary: '#e0e0e0',
                    borderSecondary: '#f0f0f0'
                },
                fonts: {
                    primaryFamily: "'Noto Sans KR', sans-serif",
                    secondaryFamily: "'Montserrat', sans-serif",
                    baseSize: '14px',
                    lineHeight: '1.6'
                },
                spacing: {
                    borderRadius: '12px',
                    borderRadiusLg: '20px'
                },
                effects: {
                    shadowLight: '0 2px 10px rgba(0,0,0,0.1)',
                    shadowMedium: '0 8px 30px rgba(0,0,0,0.12)',
                    shadowHeavy: '0 15px 35px rgba(0,0,0,0.1)'
                }
            },
            dark: {
                name: '다크',
                colors: {
                    primary: '#8B7ED8',
                    secondary: '#7A6FCD',
                    accent: '#5BA0F2',
                    success: '#5CBF60',
                    warning: '#FFA726',
                    danger: '#f66',
                    bgPrimary: '#1a1a1a',
                    bgSecondary: '#2d2d2d',
                    bgTertiary: '#404040',
                    textPrimary: '#ffffff',
                    textSecondary: '#cccccc',
                    textTertiary: '#999999',
                    textInverse: '#000000',
                    borderPrimary: '#404040',
                    borderSecondary: '#2d2d2d'
                },
                fonts: {
                    primaryFamily: "'Noto Sans KR', sans-serif",
                    secondaryFamily: "'Montserrat', sans-serif",
                    baseSize: '14px',
                    lineHeight: '1.6'
                },
                spacing: {
                    borderRadius: '12px',
                    borderRadiusLg: '20px'
                },
                effects: {
                    shadowLight: '0 2px 10px rgba(0,0,0,0.3)',
                    shadowMedium: '0 8px 30px rgba(0,0,0,0.4)',
                    shadowHeavy: '0 15px 35px rgba(0,0,0,0.5)'
                }
            },
            blue: {
                name: '블루',
                colors: {
                    primary: '#2196F3',
                    secondary: '#1976D2',
                    accent: '#03DAC6',
                    success: '#4CAF50',
                    warning: '#FF9800',
                    danger: '#f44336',
                    bgPrimary: '#f5f9ff',
                    bgSecondary: '#e3f2fd',
                    bgTertiary: '#bbdefb',
                    textPrimary: '#0d47a1',
                    textSecondary: '#1565c0',
                    textTertiary: '#1976d2',
                    textInverse: '#ffffff',
                    borderPrimary: '#90caf9',
                    borderSecondary: '#e3f2fd'
                },
                fonts: {
                    primaryFamily: "'Noto Sans KR', sans-serif",
                    secondaryFamily: "'Montserrat', sans-serif",
                    baseSize: '14px',
                    lineHeight: '1.6'
                },
                spacing: {
                    borderRadius: '12px',
                    borderRadiusLg: '20px'
                },
                effects: {
                    shadowLight: '0 2px 10px rgba(33,150,243,0.1)',
                    shadowMedium: '0 8px 30px rgba(33,150,243,0.12)',
                    shadowHeavy: '0 15px 35px rgba(33,150,243,0.1)'
                }
            },
            green: {
                name: '그린',
                colors: {
                    primary: '#4CAF50',
                    secondary: '#388E3C',
                    accent: '#FF5722',
                    success: '#8BC34A',
                    warning: '#FF9800',
                    danger: '#f44336',
                    bgPrimary: '#f9fffe',
                    bgSecondary: '#e8f5e8',
                    bgTertiary: '#c8e6c9',
                    textPrimary: '#1b5e20',
                    textSecondary: '#2e7d32',
                    textTertiary: '#388e3c',
                    textInverse: '#ffffff',
                    borderPrimary: '#a5d6a7',
                    borderSecondary: '#e8f5e8'
                },
                fonts: {
                    primaryFamily: "'Noto Sans KR', sans-serif",
                    secondaryFamily: "'Montserrat', sans-serif",
                    baseSize: '14px',
                    lineHeight: '1.6'
                },
                spacing: {
                    borderRadius: '12px',
                    borderRadiusLg: '20px'
                },
                effects: {
                    shadowLight: '0 2px 10px rgba(76,175,80,0.1)',
                    shadowMedium: '0 8px 30px rgba(76,175,80,0.12)',
                    shadowHeavy: '0 15px 35px rgba(76,175,80,0.1)'
                }
            }
        };
        
        // 커스텀 설정
        this.customizationOptions = {
            fontSize: {
                small: '12px',
                medium: '14px',
                large: '16px',
                xlarge: '18px'
            },
            borderRadius: {
                sharp: '4px',
                normal: '8px',
                rounded: '12px',
                pill: '24px'
            },
            chatBubbleStyle: {
                normal: 'normal',
                rounded: 'rounded',
                minimal: 'minimal'
            },
            animation: {
                none: 'none',
                subtle: 'subtle',
                smooth: 'smooth',
                bouncy: 'bouncy'
            }
        };
        
        this.loadThemeSettings();
        this.initializeTheme();
    }
    
    // 테마 초기화
    initializeTheme() {
        // 시스템 다크모드 감지
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!this.themeSettings.theme) {
                this.currentTheme = 'dark';
            }
        }
        
        this.applyTheme(this.currentTheme);
        
        // 시스템 테마 변경 감지
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.themeSettings.followSystem) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // 테마 설정
    setTheme(themeName) {
        if (!this.defaultThemes[themeName]) {
            console.warn(`Theme '${themeName}' not found`);
            return false;
        }
        
        this.currentTheme = themeName;
        this.themeSettings.theme = themeName;
        this.applyTheme(themeName);
        this.saveThemeSettings();
        
        return true;
    }
    
    // 테마 적용
    applyTheme(themeName) {
        const theme = this.defaultThemes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        
        // CSS 변수 업데이트
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = this.convertToCSSVar(key);
            root.style.setProperty(cssVar, value);
        });
        
        Object.entries(theme.fonts).forEach(([key, value]) => {
            const cssVar = this.convertToCSSVar(key, 'font');
            root.style.setProperty(cssVar, value);
        });
        
        Object.entries(theme.spacing).forEach(([key, value]) => {
            const cssVar = this.convertToCSSVar(key);
            root.style.setProperty(cssVar, value);
        });
        
        Object.entries(theme.effects).forEach(([key, value]) => {
            const cssVar = this.convertToCSSVar(key, 'shadow');
            root.style.setProperty(cssVar, value);
        });
        
        // 커스텀 설정 적용
        this.applyCustomizations();
        
        // 테마 클래스 추가
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
        document.body.classList.add(`theme-${themeName}`);
    }
    
    // CSS 변수명 변환
    convertToCSSVar(key, prefix = '') {
        const prefixMap = {
            font: '--font-',
            shadow: '--shadow-',
            '': '--'
        };
        
        const actualPrefix = prefixMap[prefix] || '--';
        
        // camelCase를 kebab-case로 변환
        const kebabCase = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        
        return `${actualPrefix}${kebabCase}`;
    }
    
    // 커스텀 설정 적용
    applyCustomizations() {
        const root = document.documentElement;
        
        // 폰트 크기
        if (this.themeSettings.fontSize) {
            const fontSize = this.customizationOptions.fontSize[this.themeSettings.fontSize];
            if (fontSize) {
                root.style.setProperty('--font-base-size', fontSize);
            }
        }
        
        // 모서리 둥글기
        if (this.themeSettings.borderRadius) {
            const borderRadius = this.customizationOptions.borderRadius[this.themeSettings.borderRadius];
            if (borderRadius) {
                root.style.setProperty('--border-radius', borderRadius);
                root.style.setProperty('--border-radius-lg', `${parseInt(borderRadius) * 1.5}px`);
            }
        }
        
        // 채팅 버블 스타일
        if (this.themeSettings.chatBubbleStyle) {
            document.body.classList.remove('bubble-normal', 'bubble-rounded', 'bubble-minimal');
            document.body.classList.add(`bubble-${this.themeSettings.chatBubbleStyle}`);
        }
        
        // 애니메이션 설정
        if (this.themeSettings.animation) {
            document.body.classList.remove('anim-none', 'anim-subtle', 'anim-smooth', 'anim-bouncy');
            document.body.classList.add(`anim-${this.themeSettings.animation}`);
        }
    }
    
    // 커스텀 색상 설정
    setCustomColor(colorType, hexColor) {
        if (!this.isValidHexColor(hexColor)) {
            console.warn('Invalid hex color:', hexColor);
            return false;
        }
        
        const root = document.documentElement;
        const cssVar = this.convertToCSSVar(colorType);
        
        root.style.setProperty(cssVar, hexColor);
        
        // 설정 저장
        if (!this.themeSettings.customColors) {
            this.themeSettings.customColors = {};
        }
        this.themeSettings.customColors[colorType] = hexColor;
        this.saveThemeSettings();
        
        return true;
    }
    
    // 폰트 크기 설정
    setFontSize(size) {
        if (!this.customizationOptions.fontSize[size]) {
            console.warn('Invalid font size:', size);
            return false;
        }
        
        this.themeSettings.fontSize = size;
        this.applyCustomizations();
        this.saveThemeSettings();
        
        return true;
    }
    
    // 모서리 둥글기 설정
    setBorderRadius(radius) {
        if (!this.customizationOptions.borderRadius[radius]) {
            console.warn('Invalid border radius:', radius);
            return false;
        }
        
        this.themeSettings.borderRadius = radius;
        this.applyCustomizations();
        this.saveThemeSettings();
        
        return true;
    }
    
    // 채팅 버블 스타일 설정
    setChatBubbleStyle(style) {
        if (!this.customizationOptions.chatBubbleStyle[style]) {
            console.warn('Invalid chat bubble style:', style);
            return false;
        }
        
        this.themeSettings.chatBubbleStyle = style;
        this.applyCustomizations();
        this.saveThemeSettings();
        
        return true;
    }
    
    // 애니메이션 설정
    setAnimation(animation) {
        if (!this.customizationOptions.animation[animation]) {
            console.warn('Invalid animation setting:', animation);
            return false;
        }
        
        this.themeSettings.animation = animation;
        this.applyCustomizations();
        this.saveThemeSettings();
        
        return true;
    }
    
    // 시스템 테마 따르기 설정
    setFollowSystemTheme(follow) {
        this.themeSettings.followSystem = follow;
        
        if (follow && window.matchMedia) {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(isDark ? 'dark' : 'light');
        }
        
        this.saveThemeSettings();
    }
    
    // 테마 커스터마이저 UI 데이터 생성
    generateThemeCustomizer() {
        const currentLang = this.languageManager.getCurrentLanguage();
        
        return {
            themes: Object.entries(this.defaultThemes).map(([key, theme]) => ({
                id: key,
                name: currentLang === 'ko' ? theme.name : key.charAt(0).toUpperCase() + key.slice(1),
                preview: theme.colors.primary,
                current: this.currentTheme === key
            })),
            customizations: {
                fontSize: {
                    label: currentLang === 'ko' ? '폰트 크기' : 'Font Size',
                    options: Object.entries(this.customizationOptions.fontSize).map(([key, value]) => ({
                        id: key,
                        label: currentLang === 'ko' ? 
                            { small: '작게', medium: '보통', large: '크게', xlarge: '매우 크게' }[key] :
                            key.charAt(0).toUpperCase() + key.slice(1),
                        value,
                        current: this.themeSettings.fontSize === key
                    }))
                },
                borderRadius: {
                    label: currentLang === 'ko' ? '모서리 둥글기' : 'Border Radius',
                    options: Object.entries(this.customizationOptions.borderRadius).map(([key, value]) => ({
                        id: key,
                        label: currentLang === 'ko' ? 
                            { sharp: '각진', normal: '보통', rounded: '둥근', pill: '매우 둥근' }[key] :
                            key.charAt(0).toUpperCase() + key.slice(1),
                        value,
                        current: this.themeSettings.borderRadius === key
                    }))
                },
                chatBubbleStyle: {
                    label: currentLang === 'ko' ? '채팅 버블 스타일' : 'Chat Bubble Style',
                    options: Object.entries(this.customizationOptions.chatBubbleStyle).map(([key]) => ({
                        id: key,
                        label: currentLang === 'ko' ? 
                            { normal: '기본', rounded: '둥근', minimal: '미니멀' }[key] :
                            key.charAt(0).toUpperCase() + key.slice(1),
                        current: this.themeSettings.chatBubbleStyle === key
                    }))
                },
                animation: {
                    label: currentLang === 'ko' ? '애니메이션' : 'Animation',
                    options: Object.entries(this.customizationOptions.animation).map(([key]) => ({
                        id: key,
                        label: currentLang === 'ko' ? 
                            { none: '없음', subtle: '부드럽게', smooth: '매끄럽게', bouncy: '통통하게' }[key] :
                            key.charAt(0).toUpperCase() + key.slice(1),
                        current: this.themeSettings.animation === key
                    }))
                }
            },
            settings: {
                followSystem: {
                    label: currentLang === 'ko' ? '시스템 테마 따르기' : 'Follow System Theme',
                    value: this.themeSettings.followSystem || false
                }
            },
            currentTheme: this.currentTheme,
            customColors: this.themeSettings.customColors || {}
        };
    }
    
    // 테마 미리보기
    previewTheme(themeName) {
        if (!this.defaultThemes[themeName]) return;
        
        // 임시로 테마 적용
        this.applyTheme(themeName);
        
        // 5초 후 원래 테마로 복원
        setTimeout(() => {
            this.applyTheme(this.currentTheme);
        }, 5000);
    }
    
    // 테마 내보내기
    exportTheme() {
        const themeData = {
            theme: this.currentTheme,
            settings: this.themeSettings,
            timestamp: Date.now(),
            version: '1.0'
        };
        
        return JSON.stringify(themeData, null, 2);
    }
    
    // 테마 가져오기
    importTheme(themeData) {
        try {
            const data = typeof themeData === 'string' ? JSON.parse(themeData) : themeData;
            
            if (data.theme && this.defaultThemes[data.theme]) {
                this.setTheme(data.theme);
            }
            
            if (data.settings) {
                this.themeSettings = { ...this.themeSettings, ...data.settings };
                this.applyCustomizations();
                this.saveThemeSettings();
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import theme:', error);
            return false;
        }
    }
    
    // 테마 리셋
    resetTheme() {
        this.themeSettings = {};
        this.currentTheme = 'light';
        this.applyTheme('light');
        this.saveThemeSettings();
    }
    
    // HEX 색상 유효성 검사
    isValidHexColor(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
    
    // RGB를 HEX로 변환
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // HEX를 RGB로 변환
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // 테마 설정 저장
    saveThemeSettings() {
        this.storage.saveThemeSettings({
            ...this.themeSettings,
            theme: this.currentTheme
        });
    }
    
    // 테마 설정 로드
    loadThemeSettings() {
        const settings = this.storage.loadThemeSettings();
        if (settings) {
            this.themeSettings = settings;
            this.currentTheme = settings.theme || 'light';
        }
    }
    
    // 현재 테마 정보 조회
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            theme: this.defaultThemes[this.currentTheme],
            settings: this.themeSettings
        };
    }
    
    // 테마 통계
    getThemeStats() {
        return {
            currentTheme: this.currentTheme,
            totalCustomizations: Object.keys(this.themeSettings).length,
            hasCustomColors: !!(this.themeSettings.customColors && Object.keys(this.themeSettings.customColors).length > 0),
            followsSystem: this.themeSettings.followSystem || false,
            lastChanged: this.themeSettings.lastChanged || null
        };
    }
}