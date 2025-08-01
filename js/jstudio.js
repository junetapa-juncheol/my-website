// J Studio Page JavaScript
// This file contains jstudio.html page functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('J Studio page loaded successfully');
    
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize gallery functionality
    initializeGallery();
});

function initializeGallery() {
    // Loading Screen Management
    setupLoadingScreen();
    
    // Portfolio Interactions
    setupPortfolioInteractions();
    
    // Hobby Modal
    setupHobbyModal();
    
    // Smooth scrolling
    setupSmoothScrolling();
}

// Loading Screen Management
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Remove loading screen after 2 seconds
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 2000);

        // Remove from DOM after animation
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 2500);
    }
}

// Portfolio Interactions
function setupPortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const hobby = this.getAttribute('data-hobby');
            if (hobby) {
                openHobbyModal(hobby);
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Hobby Modal
function setupHobbyModal() {
    const modal = document.getElementById('hobbyModal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeHobbyModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeHobbyModal);
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeHobbyModal();
        }
    });
}

function openHobbyModal(hobbyType) {
    const modal = document.getElementById('hobbyModal');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const gallery = document.getElementById('photoGallery');
    const photoCount = document.querySelector('.photo-count-display');
    
    if (!modal) return;
    
    // Set modal content based on hobby type
    const hobbyData = getHobbyData(hobbyType);
    if (title) title.textContent = hobbyData.title;
    if (subtitle) subtitle.textContent = hobbyData.subtitle;
    
    // Load photos from hobby_photos directory
    if (gallery) {
        loadHobbyPhotos(gallery, hobbyType, photoCount);
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function loadHobbyPhotos(gallery, hobbyType, photoCountElement) {
    const photoCount = 6; // Each hobby has 6 photos
    const basePath = `../assets/images/gallery/hobby_photos/${hobbyType}/`;
    
    gallery.innerHTML = '';
    
    for (let i = 1; i <= photoCount; i++) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = `${basePath}${hobbyType}_${i}.png`;
        img.alt = `${hobbyType} photo ${i}`;
        img.className = 'gallery-photo';
        img.loading = 'lazy';
        
        // Add click event for lightbox
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
        
        // Handle image load error
        img.addEventListener('error', () => {
            photoContainer.style.display = 'none';
        });
        
        photoContainer.appendChild(img);
        gallery.appendChild(photoContainer);
    }
    
    // Update photo count
    if (photoCountElement) {
        photoCountElement.textContent = `총 ${photoCount}장의 사진`;
    }
}

function openLightbox(imageSrc, imageAlt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="닫기">&times;</button>
            <img src="${imageSrc}" alt="${imageAlt}" class="lightbox-image">
            <div class="lightbox-caption">${imageAlt}</div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(lightbox);
    
    // Add event listeners
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', handleLightboxEsc);
    
    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.removeEventListener('keydown', handleLightboxEsc);
    }
    
    function handleLightboxEsc(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
}

function closeHobbyModal() {
    const modal = document.getElementById('hobbyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'visible';
    }
}

function getHobbyData(hobbyType) {
    const hobbyMap = {
        travel: { title: '여행', subtitle: '새로운 곳에서 만나는 특별한 순간들' },
        movie: { title: '영화감상', subtitle: '감동적인 스토리와 함께한 시간들' },
        web: { title: '웹검색', subtitle: '새로운 정보를 찾아가는 여정' },
        drive: { title: '드라이브', subtitle: '도로 위에서 만나는 자유로운 순간' },
        game: { title: '게임', subtitle: '가상 세계에서의 즐거운 모험들' },
        photo: { title: '사진촬영', subtitle: '렌즈로 담아낸 아름다운 순간들' },
        sns: { title: '소셜미디어', subtitle: '친구들과 공유하는 일상의 기록' },
        book: { title: '독서', subtitle: '책 속에서 만나는 새로운 세상' }
    };
    
    return hobbyMap[hobbyType] || { title: '갤러리', subtitle: '취미 활동 모음' };
}

// Smooth Scrolling
function setupSmoothScrolling() {
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