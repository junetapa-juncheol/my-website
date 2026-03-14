// J Studio Page
document.addEventListener('DOMContentLoaded', function() {
    // AOS
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 80 });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (hamburger && hamburgerMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
        hamburgerMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            });
        });
    }

    // Hobby card click → open modal
    document.querySelectorAll('.hobby-card').forEach(card => {
        card.addEventListener('click', function() {
            const hobby = this.getAttribute('data-hobby');
            if (hobby) openHobbyModal(hobby);
        });
    });

    // Modal close
    const modal = document.getElementById('hobbyModal');
    const closeBtn = document.querySelector('.hobby-modal__close');
    const overlay = document.querySelector('.hobby-modal__overlay');

    if (closeBtn) closeBtn.addEventListener('click', closeHobbyModal);
    if (overlay) overlay.addEventListener('click', closeHobbyModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeHobbyModal();
    });
});

const hobbyData = {
    travel:  { title: '여행',       subtitle: '새로운 곳에서 만나는 특별한 순간들' },
    drive:   { title: '드라이브',   subtitle: '도로 위에서 만나는 자유로운 순간' },
    game:    { title: '게임',       subtitle: '가상 세계에서의 즐거운 모험들' },
    photo:   { title: '사진촬영',   subtitle: '렌즈로 담아낸 아름다운 순간들' },
    sns:     { title: '소셜미디어', subtitle: '일상을 공유하는 소통의 기록' },
    book:    { title: '독서',       subtitle: '책 속에서 만나는 새로운 세상' }
};

function openHobbyModal(hobbyType) {
    const modal = document.getElementById('hobbyModal');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const gallery = document.getElementById('photoGallery');
    const countEl = document.getElementById('photoCount');
    if (!modal) return;

    const data = hobbyData[hobbyType] || { title: '갤러리', subtitle: '취미 활동' };
    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;

    // Load photos
    if (gallery) {
        const photoCount = 6;
        const basePath = '../assets/images/gallery/hobby_photos/' + hobbyType + '/';
        gallery.innerHTML = '';

        for (let i = 1; i <= photoCount; i++) {
            const div = document.createElement('div');
            div.className = 'hobby-modal__photo';

            const img = document.createElement('img');
            img.src = basePath + hobbyType + '_' + i + '.png';
            img.alt = data.title + ' ' + i;
            img.className = 'gallery-photo';
            img.loading = 'lazy';
            img.addEventListener('click', () => openLightbox(img.src, img.alt));
            img.addEventListener('error', () => { div.style.display = 'none'; });

            div.appendChild(img);
            gallery.appendChild(div);
        }

        if (countEl) countEl.textContent = '총 ' + photoCount + '장의 사진';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeHobbyModal() {
    const modal = document.getElementById('hobbyModal');
    if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML =
        '<div class="lightbox-content">' +
            '<button class="lightbox-close" aria-label="닫기">&times;</button>' +
            '<img src="' + src + '" alt="' + alt + '" class="lightbox-image">' +
            '<div class="lightbox-caption">' + alt + '</div>' +
        '</div>';

    document.body.appendChild(lightbox);

    function close() {
        if (lightbox.parentNode) lightbox.parentNode.removeChild(lightbox);
        document.removeEventListener('keydown', onEsc);
    }
    function onEsc(e) { if (e.key === 'Escape') close(); }

    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', onEsc);
}
