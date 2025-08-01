// Sitemap Page JavaScript
// This file contains sitemap-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sitemap page loaded successfully');
    
    // Initialize sitemap animations
    initializeSitemapAnimations();
    
    // Add smooth scrolling for internal links
    addSmoothScrolling();
    
    // Initialize changelog interactions
    initializeChangelogInteractions();
});

// Initialize sitemap animations
function initializeSitemapAnimations() {
    // Add intersection observer for fade-in animations
    const animatedElements = document.querySelectorAll('.structure-item, .social-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Add smooth scrolling for internal links
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize changelog interactions
function initializeChangelogInteractions() {
    const changelogItems = document.querySelectorAll('.changelog-item');
    
    changelogItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Add click tracking for sitemap links
function trackSitemapClicks() {
    const sitemapLinks = document.querySelectorAll('.sitemap-list a');
    
    sitemapLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent;
            console.log(`Sitemap link clicked: ${linkText}`);
            
            // Add visual feedback
            this.style.background = 'rgba(102, 126, 234, 0.1)';
            setTimeout(() => {
                this.style.background = 'transparent';
            }, 200);
        });
    });
}

// Initialize all sitemap functionality
function initializeSitemap() {
    trackSitemapClicks();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Reset any active states or close modals if needed
            document.activeElement.blur();
        }
    });
}