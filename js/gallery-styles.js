// Gallery Styles Integration
// CSS 파일들을 JavaScript로 통합하여 동적으로 스타일 적용

function loadGalleryStyles() {
    // CSS 스타일을 동적으로 추가
    const galleryStyles = `
        /* Common Utilities and Base Styles - Bright Luxury Theme */
        
        /* Root Variables */
        :root {
            /* Bright Color Palette */
            --color-primary: #3b82f6;
            --color-secondary: #8b5cf6;
            --color-accent: #d946ef;
            --color-white: #ffffff;
            --color-black: #000000;
            --color-light: #f8fafc;
            --color-gray-50: #f9fafb;
            --color-gray-100: #f3f4f6;
            --color-gray-200: #e5e7eb;
            --color-gray-300: #d1d5db;
            --color-gray-400: #9ca3af;
            --color-gray-500: #6b7280;
            --color-gray-600: #4b5563;
            --color-gray-700: #374151;
            --color-gray-800: #1f2937;
            --color-gray-900: #111827;
            
            /* Luxury Theme Colors */
            --luxury-primary: #d946ef;
            --luxury-secondary: #a855f7;
            --luxury-accent: #f3e8ff;
            
            /* Creative Theme Colors */
            --creative-primary: #3b82f6;
            --creative-secondary: #1d4ed8;
            --creative-accent: #dbeafe;
            
            /* Digital Theme Colors */
            --digital-primary: #10b981;
            --digital-secondary: #047857;
            --digital-accent: #d1fae5;
            
            /* Premium Theme Colors */
            --premium-primary: #f59e0b;
            --premium-secondary: #d97706;
            --premium-accent: #fef3c7;
            
            /* Background Gradients */
            --bg-primary: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            --bg-secondary: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
            --bg-luxury: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%);
            --bg-glass: rgba(255, 255, 255, 0.8);
            --bg-glass-light: rgba(255, 255, 255, 0.6);
            
            /* Spacing Scale */
            --spacing-xs: 0.5rem;
            --spacing-sm: 1rem;
            --spacing-md: 2rem;
            --spacing-lg: 3rem;
            --spacing-xl: 4rem;
            --spacing-2xl: 6rem;
            --spacing-3xl: 8rem;
            
            /* Typography */
            --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-display: 'Playfair Display', Georgia, serif;
            --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
            
            /* Font Sizes */
            --text-xs: 0.75rem;
            --text-sm: 0.875rem;
            --text-base: 1rem;
            --text-lg: 1.125rem;
            --text-xl: 1.25rem;
            --text-2xl: 1.5rem;
            --text-3xl: 1.875rem;
            --text-4xl: 2.25rem;
            --text-5xl: 3rem;
            --text-6xl: 3.75rem;
            
            /* Font Weights */
            --font-light: 300;
            --font-normal: 400;
            --font-medium: 500;
            --font-semibold: 600;
            --font-bold: 700;
            --font-extrabold: 800;
            --font-black: 900;
            
            /* Line Heights */
            --leading-none: 1;
            --leading-tight: 1.25;
            --leading-snug: 1.375;
            --leading-normal: 1.5;
            --leading-relaxed: 1.625;
            --leading-loose: 2;
            
            /* Letter Spacing */
            --tracking-tighter: -0.05em;
            --tracking-tight: -0.025em;
            --tracking-normal: 0;
            --tracking-wide: 0.025em;
            --tracking-wider: 0.05em;
            --tracking-widest: 0.1em;
            
            /* Transitions */
            --transition-all: all 0.3s ease;
            --transition-fast: all 0.15s ease;
            --transition-normal: all 0.3s ease;
            --transition-slow: all 0.5s ease;
            --transition-slower: all 0.75s ease;
            
            /* Easing Functions */
            --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
            --ease-out: cubic-bezier(0, 0, 0.2, 1);
            --ease-in: cubic-bezier(0.4, 0, 1, 1);
            --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
            
            /* Shadows */
            --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
            --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
            --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);
            --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
            --shadow-glow: 0 0 30px rgba(59, 130, 246, 0.3);
            --shadow-luxury: 0 0 40px rgba(217, 70, 239, 0.2);
            
            /* Border Radius */
            --radius-none: 0;
            --radius-sm: 0.375rem;
            --radius-md: 0.5rem;
            --radius-lg: 0.75rem;
            --radius-xl: 1rem;
            --radius-2xl: 1.5rem;
            --radius-3xl: 2rem;
            --radius-full: 9999px;
            
            /* Z-Index Scale */
            --z-hide: -1;
            --z-auto: auto;
            --z-0: 0;
            --z-10: 10;
            --z-20: 20;
            --z-30: 30;
            --z-40: 40;
            --z-50: 50;
            --z-modal: 1000;
            --z-popover: 1010;
            --z-tooltip: 1020;
            --z-overlay: 1030;
            --z-max: 9999;
        }

        /* Base Styles */
        html {
            font-size: 16px;
            scroll-behavior: smooth;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        body {
            font-family: var(--font-primary);
            font-size: var(--text-base);
            font-weight: var(--font-normal);
            line-height: var(--leading-normal);
            color: var(--color-gray-900);
            background: var(--bg-primary);
            overflow-x: hidden;
            min-height: 100vh;
            text-rendering: optimizeLegibility;
        }

        /* Selection Styles */
        ::selection {
            background: var(--color-primary);
            color: var(--color-white);
        }

        ::-moz-selection {
            background: var(--color-primary);
            color: var(--color-white);
        }

        /* Focus Styles */
        :focus {
            outline: none;
        }

        :focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
            border-radius: var(--radius-sm);
        }

        /* Common Utilities */
        .clearfix::after {
            content: '';
            display: block;
            clear: both;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-sm);
        }

        .wrapper {
            position: relative;
            width: 100%;
            min-height: 100vh;
        }

        /* Display Utilities */
        .block { display: block; }
        .inline-block { display: inline-block; }
        .inline { display: inline; }
        .flex { display: flex; }
        .inline-flex { display: inline-flex; }
        .grid { display: grid; }
        .hidden { display: none !important; }

        /* Visibility */
        .invisible { visibility: hidden; }
        .visible { visibility: visible; }

        /* Screen Reader Only */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* Text Alignment */
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }

        /* Font Sizes */
        .text-xs { font-size: var(--text-xs); }
        .text-sm { font-size: var(--text-sm); }
        .text-base { font-size: var(--text-base); }
        .text-lg { font-size: var(--text-lg); }
        .text-xl { font-size: var(--text-xl); }
        .text-2xl { font-size: var(--text-2xl); }
        .text-3xl { font-size: var(--text-3xl); }
        .text-4xl { font-size: var(--text-4xl); }
        .text-5xl { font-size: var(--text-5xl); }
        .text-6xl { font-size: var(--text-6xl); }

        /* Font Weights */
        .font-light { font-weight: var(--font-light); }
        .font-normal { font-weight: var(--font-normal); }
        .font-medium { font-weight: var(--font-medium); }
        .font-semibold { font-weight: var(--font-semibold); }
        .font-bold { font-weight: var(--font-bold); }
        .font-extrabold { font-weight: var(--font-extrabold); }
        .font-black { font-weight: var(--font-black); }

        /* Text Transform */
        .uppercase { text-transform: uppercase; }
        .lowercase { text-transform: lowercase; }
        .capitalize { text-transform: capitalize; }

        /* Letter Spacing */
        .tracking-tight { letter-spacing: var(--tracking-tight); }
        .tracking-normal { letter-spacing: var(--tracking-normal); }
        .tracking-wide { letter-spacing: var(--tracking-wide); }
        .tracking-wider { letter-spacing: var(--tracking-wider); }
        .tracking-widest { letter-spacing: var(--tracking-widest); }

        /* Colors */
        .text-primary { color: var(--color-primary); }
        .text-secondary { color: var(--color-secondary); }
        .text-gray-500 { color: var(--color-gray-500); }
        .text-gray-600 { color: var(--color-gray-600); }
        .text-gray-700 { color: var(--color-gray-700); }
        .text-gray-900 { color: var(--color-gray-900); }
        .text-white { color: var(--color-white); }

        /* Background Colors */
        .bg-white { background-color: var(--color-white); }
        .bg-gray-50 { background-color: var(--color-gray-50); }
        .bg-gray-100 { background-color: var(--color-gray-100); }
        .bg-primary { background-color: var(--color-primary); }
        .bg-secondary { background-color: var(--color-secondary); }

        /* Spacing */
        .m-0 { margin: 0; }
        .mt-0 { margin-top: 0; }
        .mr-0 { margin-right: 0; }
        .mb-0 { margin-bottom: 0; }
        .ml-0 { margin-left: 0; }

        .p-0 { padding: 0; }
        .pt-0 { padding-top: 0; }
        .pr-0 { padding-right: 0; }
        .pb-0 { padding-bottom: 0; }
        .pl-0 { padding-left: 0; }

        /* Flexbox */
        .flex-col { flex-direction: column; }
        .flex-row { flex-direction: row; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .items-end { align-items: flex-end; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .justify-around { justify-content: space-around; }

        /* Glass Effect */
        .glass {
            background: var(--bg-glass);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-light {
            background: var(--bg-glass-light);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Transitions */
        .transition-all { transition: var(--transition-all); }
        .transition-fast { transition: var(--transition-fast); }
        .transition-slow { transition: var(--transition-slow); }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        /* Animation Classes */
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }

        /* Responsive Design */
        @media (max-width: 640px) {
            :root {
                --spacing-sm: 0.75rem;
                --spacing-md: 1.5rem;
                --spacing-lg: 2rem;
                --text-2xl: 1.25rem;
                --text-3xl: 1.5rem;
                --text-4xl: 1.875rem;
            }

            html {
                font-size: 14px;
            }

            .container,
            .wrapper {
                padding: 0 var(--spacing-xs);
            }
        }

        @media (max-width: 480px) {
            :root {
                --spacing-sm: 0.5rem;
                --spacing-md: 1rem;
                --spacing-lg: 1.5rem;
                --text-xl: 1.125rem;
                --text-2xl: 1.25rem;
                --text-3xl: 1.5rem;
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }

        @media (prefers-contrast: high) {
            :root {
                --color-gray-500: #000000;
                --color-gray-600: #000000;
                --color-gray-700: #000000;
            }

            .glass,
            .glass-light {
                background: var(--color-white);
                border: 2px solid var(--color-black);
            }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            :root {
                --color-gray-900: #ffffff;
                --color-gray-800: #f3f4f6;
                --color-gray-700: #e5e7eb;
                --bg-primary: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            }
        }

        /* Print Styles */
        @media print {
            * {
                background: transparent !important;
                color: black !important;
                box-shadow: none !important;
            }

            .bg-animation,
            .floating-shapes {
                display: none !important;
            }
        }

        /* Main Gallery Styles */
        
        /* Loading Screen */
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .loading-screen.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .loading-content {
            text-align: center;
        }

        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-content p {
            color: #64748b;
            font-weight: 500;
            letter-spacing: 0.05em;
        }

        /* Cursor Follower */
        .cursor-follower {
            position: fixed;
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.15s ease;
            opacity: 0;
            mix-blend-mode: multiply;
        }

        .cursor-follower.active {
            opacity: 0.8;
            transform: scale(1.5);
        }

        /* Background Animation */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .gradient-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                #f8fafc 0%, 
                #e2e8f0 25%, 
                #f1f5f9 50%, 
                #e7e5e4 75%, 
                #f5f5f4 100%);
            animation: gradientShift 15s ease-in-out infinite;
        }

        @keyframes gradientShift {
            0%, 100% { 
                filter: hue-rotate(0deg) brightness(1); 
            }
            50% { 
                filter: hue-rotate(10deg) brightness(1.05); 
            }
        }

        .mesh-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
            animation: meshFloat 20s ease-in-out infinite;
        }

        @keyframes meshFloat {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-20px, -30px) scale(1.05); }
            66% { transform: translate(20px, -20px) scale(0.95); }
        }

        .floating-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            animation: shapeFloat 12s ease-in-out infinite;
        }

        .shape-1 {
            width: 120px;
            height: 120px;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }

        .shape-2 {
            width: 80px;
            height: 80px;
            top: 20%;
            right: 20%;
            animation-delay: 2s;
            border-radius: 20px;
        }

        .shape-3 {
            width: 100px;
            height: 100px;
            bottom: 30%;
            left: 15%;
            animation-delay: 4s;
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            border-radius: 0;
        }

        .shape-4 {
            width: 90px;
            height: 90px;
            top: 60%;
            right: 10%;
            animation-delay: 6s;
            border-radius: 20px;
        }

        .shape-5 {
            width: 110px;
            height: 110px;
            bottom: 10%;
            right: 30%;
            animation-delay: 8s;
        }

        @keyframes shapeFloat {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.6;
            }
            25% {
                transform: translate(-30px, -20px) rotate(90deg);
                opacity: 0.8;
            }
            50% {
                transform: translate(20px, -40px) rotate(180deg);
                opacity: 0.4;
            }
            75% {
                transform: translate(-10px, 30px) rotate(270deg);
                opacity: 0.7;
            }
        }

        /* Header */
        #header {
            position: relative;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
        }

        .header-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(226, 232, 240, 0.9) 100%);
            backdrop-filter: blur(10px);
        }

        .logo {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .logo-img {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .logo:hover .logo-img {
            transform: scale(1.1) rotate(5deg);
        }

        .logo-content {
            text-align: center;
        }

        .logo-text {
            font-family: var(--font-display);
            font-size: 3.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6, #d946ef);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            animation: textShimmer 3s ease-in-out infinite;
        }

        @keyframes textShimmer {
            0%, 100% { filter: brightness(1) saturate(1); }
            50% { filter: brightness(1.2) saturate(1.3); }
        }

        .logo-subtitle {
            font-size: 1.1rem;
            color: #64748b;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .scroll-indicator {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            z-index: 10;
        }

        .scroll-text {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 10px;
            font-weight: 500;
        }

        .scroll-arrow {
            width: 20px;
            height: 20px;
            border-right: 2px solid #64748b;
            border-bottom: 2px solid #64748b;
            transform: rotate(45deg);
            margin: 0 auto;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0) rotate(45deg);
            }
            40% {
                transform: translateY(-10px) rotate(45deg);
            }
            60% {
                transform: translateY(-5px) rotate(45deg);
            }
        }

        /* Main Container */
        #container {
            position: relative;
            z-index: 1;
            padding: 80px 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .section-title {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-title h2 {
            font-family: var(--font-display);
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b, #475569);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
        }

        .section-title p {
            font-size: 1.1rem;
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
        }

        /* Portfolio Grid */
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .portfolio-item {
            position: relative;
            height: 400px;
            border-radius: 20px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: var(--bg-glass);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .portfolio-item:nth-child(odd) {
            transform: translateY(20px);
        }

        .portfolio-item:nth-child(even) {
            transform: translateY(-20px);
        }

        .portfolio-item:nth-child(3n) {
            transform: translateY(10px);
        }

        .portfolio-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1;
        }

        .portfolio-item:hover::before {
            opacity: 1;
        }

        .item-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .bg-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }

        .portfolio-item:hover .bg-image {
            transform: scale(1.1);
        }





        .item-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(0, 0, 0, 0.3) 0%, 
                rgba(0, 0, 0, 0.1) 50%, 
                rgba(0, 0, 0, 0.4) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 2;
        }

        .portfolio-item:hover .item-overlay {
            opacity: 1;
        }

        .item-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transition: all 0.4s ease;
            z-index: 1;
        }

        .portfolio-item:hover .item-glow {
            width: 200px;
            height: 200px;
        }

        .item-link {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: white;
            z-index: 3;
            padding: 40px;
            text-align: center;
        }

        .item-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
        }

        .item-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .portfolio-item:hover .item-icon {
            transform: scale(1.2) rotate(5deg);
        }

        .portfolio-item:hover .item-icon img {
            filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
        }

        .item-content {
            transition: transform 0.3s ease;
        }

        .portfolio-item:hover .item-content {
            transform: translateY(-10px);
        }

        .item-content .desc {
            font-size: 0.9rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .item-content .title {
            font-family: var(--font-display);
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .item-details {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }

        .portfolio-item:hover .item-details {
            opacity: 1;
            transform: translateY(0);
        }

        .item-details p {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
        }

        .item-number {
            position: absolute;
            bottom: 20px;
            left: 20px;
            font-size: 3rem;
            font-weight: 900;
            color: rgba(255, 255, 255, 0.2);
            font-family: var(--font-display);
            z-index: 3;
            transition: all 0.3s ease;
        }

        .portfolio-item:hover .item-number {
            color: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
        }

        /* Theme Variations */
        .portfolio-item[data-theme="travel"] { --theme-color: #10b981; }
        .portfolio-item[data-theme="movie"] { --theme-color: #f59e0b; }
        .portfolio-item[data-theme="web"] { --theme-color: #3b82f6; }
        .portfolio-item[data-theme="drive"] { --theme-color: #8b5cf6; }
        .portfolio-item[data-theme="game"] { --theme-color: #ef4444; }
        .portfolio-item[data-theme="photo"] { --theme-color: #06b6d4; }
        .portfolio-item[data-theme="sns"] { --theme-color: #ec4899; }
        .portfolio-item[data-theme="book"] { --theme-color: #84cc16; }

        .portfolio-item:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        /* Footer */
        #footer {
            position: relative;
            z-index: 1;
            padding: 40px 20px;
            text-align: center;
            background: var(--bg-glass);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer-content {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .footer-content p {
            color: #64748b;
            font-weight: 500;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .footer-link:hover {
            color: #1d4ed8;
        }

        /* AOS Animations */
        [data-aos="fade-up"] {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        [data-aos="fade-up"].aos-animate {
            opacity: 1;
            transform: translateY(0);
        }

        [data-aos="zoom-in"] {
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.6s ease;
        }

        [data-aos="zoom-in"].aos-animate {
            opacity: 1;
            transform: scale(1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .portfolio-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }

            .logo {
                gap: 15px;
            }

            .logo-text {
                font-size: 2.5rem;
            }

            .section-title h2 {
                font-size: 2rem;
            }

            .portfolio-item:hover {
                transform: translateY(-5px) scale(1.01);
            }

            .footer-content {
                gap: 15px;
            }
        }

        @media (max-width: 480px) {
            .logo-text {
                font-size: 2rem;
            }

            .section-title h2 {
                font-size: 1.5rem;
            }

            .item-content .title {
                font-size: 1.4rem;
            }
        }

        /* Modal Styles */
        .hobby-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .hobby-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .hobby-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .hobby-modal .modal-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 900px;
            max-height: 90vh;
            width: 90%;
            overflow-y: auto;
            transform: translateY(-50px) scale(0.9);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .hobby-modal.active .modal-content {
            transform: translateY(0) scale(1);
            opacity: 1;
        }

        .hobby-modal .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            z-index: 10001;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .hobby-modal .modal-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }

        .hobby-modal .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid #eee;
        }

        .hobby-modal .modal-header h2 {
            margin: 0 0 10px 0;
            color: #1e293b;
            font-size: 2rem;
            font-weight: 700;
        }

        .hobby-modal .modal-subtitle {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
        }

        .hobby-modal .modal-body {
            padding: 30px;
        }

        .hobby-modal .photo-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .hobby-modal .photo-item {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .hobby-modal .photo-item:hover {
            transform: scale(1.05);
        }

        .hobby-modal .photo-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .hobby-modal .photo-item:hover img {
            transform: scale(1.1);
        }

        .hobby-modal .photo-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(0, 0, 0, 0.3) 0%, 
                rgba(0, 0, 0, 0.1) 50%, 
                rgba(0, 0, 0, 0.4) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .hobby-modal .photo-item:hover .photo-overlay {
            opacity: 1;
        }

        .hobby-modal .photo-info {
            text-align: center;
            color: white;
        }

        .hobby-modal .photo-info h4 {
            font-size: 1.1rem;
            margin-bottom: 5px;
        }

        .hobby-modal .photo-info p {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .hobby-modal .gallery-info {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 15px;
        }

        .hobby-modal .gallery-stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .hobby-modal .photo-count-display,
        .hobby-modal .gallery-date {
            font-size: 0.9rem;
            color: #64748b;
            font-weight: 500;
        }

        .hobby-modal .empty-gallery {
            text-align: center;
            padding: 60px 20px;
            color: #64748b;
        }

        .hobby-modal .empty-gallery .empty-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .hobby-modal .empty-gallery h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #1e293b;
        }

        .hobby-modal .empty-gallery p {
            font-size: 1rem;
            line-height: 1.6;
        }

        /* Modal Responsive */
        @media (max-width: 768px) {
            .hobby-modal .modal-content {
                width: 95%;
                max-height: 95vh;
            }

            .hobby-modal .modal-header {
                padding: 20px 20px 15px;
            }

            .hobby-modal .modal-header h2 {
                font-size: 1.5rem;
            }

            .hobby-modal .modal-body {
                padding: 20px;
            }

            .hobby-modal .photo-gallery {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }

            .hobby-modal .photo-item img {
                height: 150px;
            }

            .hobby-modal .gallery-stats {
                flex-direction: column;
                gap: 10px;
            }
        }

        @media (max-width: 480px) {
            .hobby-modal .modal-header h2 {
                font-size: 1.25rem;
            }

            .hobby-modal .photo-gallery {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 10px;
            }

            .hobby-modal .photo-item img {
                height: 120px;
            }
        }

        .hobby-modal .photo-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #64748b;
        }

        .hobby-modal .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 15px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    // 스타일 태그 생성 및 추가
    const styleElement = document.createElement('style');
    styleElement.id = 'gallery-styles';
    styleElement.textContent = galleryStyles;
    document.head.appendChild(styleElement);
}

// 페이지 로드 시 스타일 적용
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGalleryStyles);
} else {
    loadGalleryStyles();
} 