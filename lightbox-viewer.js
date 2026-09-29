/**
 * PROIECTIO SENSORY LIGHTBOX VIEWER
 * Visor interactivo en pantalla completa para los Registros de Mapeo Sensorial de Submundos.
 * Arquitectura: Nexo (Ingeniero Principal) - Clan UPROTA / Proiectio
 */

(function initProiectioLightbox() {
    // 1. Inyectar estilos CSS para el modal
    const style = document.createElement('style');
    style.id = 'proiectio-lightbox-styles';
    style.textContent = `
        .sensory-gallery img {
            cursor: zoom-in;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
        }
        .sensory-gallery .gallery-card:hover img {
            transform: scale(1.04);
            filter: brightness(1.08);
        }
        .sensory-gallery .gallery-card {
            cursor: pointer;
        }

        #proiectio-lightbox-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(4, 8, 18, 0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            padding: 20px;
            box-sizing: border-box;
            user-select: none;
        }
        #proiectio-lightbox-modal.active {
            opacity: 1;
            pointer-events: auto;
        }

        .lightbox-close-btn {
            position: absolute;
            top: 20px;
            right: 25px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: #fff;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
        }
        .lightbox-close-btn:hover {
            background: #ff3b30;
            border-color: #ff3b30;
            transform: rotate(90deg) scale(1.1);
        }

        .lightbox-img-wrapper {
            max-width: 92vw;
            max-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .lightbox-main-img {
            max-width: 100%;
            max-height: 78vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 195, 255, 0.25);
            transform: scale(0.92);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #proiectio-lightbox-modal.active .lightbox-main-img {
            transform: scale(1);
        }

        .lightbox-caption-box {
            margin-top: 15px;
            text-align: center;
            max-width: 800px;
            color: #fff;
        }
        .lightbox-caption-title {
            font-size: 1.15rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin: 0 0 6px;
            color: #00c3ff;
            text-shadow: 0 0 12px rgba(0, 195, 255, 0.5);
        }
        .lightbox-caption-desc {
            font-size: 0.88rem;
            color: #cbd5e1;
            margin: 0;
            line-height: 1.5;
        }

        .lightbox-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .lightbox-nav-btn:hover {
            background: rgba(0, 195, 255, 0.3);
            border-color: #00c3ff;
            transform: translateY(-50%) scale(1.1);
        }
        .lightbox-prev-btn { left: 20px; }
        .lightbox-next-btn { right: 20px; }

        @media (max-width: 768px) {
            .lightbox-nav-btn { display: none; }
            .lightbox-caption-title { font-size: 1rem; }
            .lightbox-caption-desc { font-size: 0.8rem; }
        }
    `;
    document.head.appendChild(style);

    // 2. Crear estructura HTML del modal
    const modal = document.createElement('div');
    modal.id = 'proiectio-lightbox-modal';
    modal.innerHTML = `
        <button class="lightbox-close-btn" title="Cerrar (Esc)">&times;</button>
        <button class="lightbox-nav-btn lightbox-prev-btn" title="Anterior (←)">&#10094;</button>
        <button class="lightbox-nav-btn lightbox-next-btn" title="Siguiente (→)">&#10095;</button>
        <div class="lightbox-img-wrapper">
            <img class="lightbox-main-img" src="" alt="Registro de Simulación en Alta Resolución">
        </div>
        <div class="lightbox-caption-box">
            <h3 class="lightbox-caption-title"></h3>
            <p class="lightbox-caption-desc"></p>
        </div>
    `;
    document.body.appendChild(modal);

    const mainImg = modal.querySelector('.lightbox-main-img');
    const titleEl = modal.querySelector('.lightbox-caption-title');
    const descEl = modal.querySelector('.lightbox-caption-desc');
    const closeBtn = modal.querySelector('.lightbox-close-btn');
    const prevBtn = modal.querySelector('.lightbox-prev-btn');
    const nextBtn = modal.querySelector('.lightbox-next-btn');

    let galleryItems = [];
    let currentIndex = 0;

    function refreshGalleryItems() {
        galleryItems = Array.from(document.querySelectorAll('.sensory-gallery .gallery-card, .sensory-gallery img')).map((el, i) => {
            const card = el.closest('.gallery-card') || el.parentElement;
            const img = el.tagName === 'IMG' ? el : el.querySelector('img');
            const title = card.querySelector('h4, h3')?.textContent || img.getAttribute('alt') || 'Registro de Simulación';
            const desc = card.querySelector('p')?.textContent || '';
            const src = img ? img.getAttribute('src') : '';

            // Asignar click si no lo tiene
            if (card && !card.dataset.lightboxBound) {
                card.dataset.lightboxBound = "true";
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(i);
                });
            }

            return { src, title, desc };
        });
    }

    function openLightbox(index) {
        if (!galleryItems.length) refreshGalleryItems();
        if (index < 0 || index >= galleryItems.length) return;

        currentIndex = index;
        const item = galleryItems[currentIndex];
        mainImg.src = item.src;
        titleEl.textContent = item.title;
        descEl.textContent = item.desc;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        if (galleryItems.length <= 1) return;
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        if (galleryItems.length <= 1) return;
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openLightbox(currentIndex);
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-img-wrapper')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Iniciar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refreshGalleryItems);
    } else {
        refreshGalleryItems();
    }

    window.refreshSensoryLightbox = refreshGalleryItems;
})();
