// Sistema de Transición Transmedia - Proiectio / Humania
// Coreografía Cinemática: «La Jaula de Humania (H)» <-> «El Despertar de Proiectio (P)»
(function() {
    function detectSite() {
        const href = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();

        // 1. Proiectio: Si la URL o el título pertenecen a Proiectio
        if (href.includes('proiect.io') || href.includes('/proiectio') || href.includes('humania-nexo-proiectio') || title.includes('proiectio')) {
            return 'proiectio';
        }
        // 2. Humania: Si la URL o el título pertenecen a Humania
        if (href.includes('humania.space') || href.includes('/humania') || href.includes('humania-repo') || title.includes('humania')) {
            return 'humania';
        }
        return title.includes('proiectio') ? 'proiectio' : 'humania';
    }

    function initTransmedia() {
        if (document.getElementById('transmedia-overlay')) return; // Evitar duplicados

        const currentSite = detectSite();

        // 1. Inyectar Estilos Cinemáticos
        const style = document.createElement('style');
        style.innerHTML = `
            #transmedia-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #ffffff; /* Fondo blanco inmaculado */
                z-index: 99999999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            #transmedia-overlay.active {
                opacity: 1;
                pointer-events: all;
            }
            
            #transmedia-svg {
                width: 200px;
                height: 200px;
                overflow: visible;
            }
            
            #tm-core, #tm-play, #tm-pillar-l, #tm-pillar-r {
                transform-box: fill-box;
                transform-origin: center;
                transition: transform 1.1s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.7s ease;
            }

            /* --- ESTADO: HUMANIA (La Jaula de Control / La H) --- */
            .state-humania #tm-core {
                transform: scale(1);
                fill: #00d8ff;
            }
            .state-humania #tm-play {
                transform: scale(0) rotate(-90deg);
                opacity: 0;
            }
            .state-humania #tm-pillar-l {
                transform: translateX(0);
                opacity: 1;
            }
            .state-humania #tm-pillar-r {
                transform: translateX(0);
                opacity: 1;
            }

            /* --- ESTADO: PROIECTIO (El Despertar / La P) --- */
            .state-proiectio #tm-core {
                transform: scale(2.4);
                fill: #00d8ff;
            }
            .state-proiectio #tm-play {
                transform: scale(1.3) rotate(0deg);
                opacity: 1;
            }
            .state-proiectio #tm-pillar-l {
                transform: translateX(-180px);
                opacity: 0;
            }
            .state-proiectio #tm-pillar-r {
                transform: translateX(180px);
                opacity: 0;
            }
        `;
        document.head.appendChild(style);

        // 2. Inyectar SVG con la clase inicial exacta según la página donde estamos
        const overlay = document.createElement('div');
        overlay.id = 'transmedia-overlay';
        overlay.innerHTML = `
            <svg viewBox="0 0 100 100" id="transmedia-svg" class="${currentSite === 'humania' ? 'state-humania' : 'state-proiectio'}">
                <!-- Núcleo Cyan -->
                <circle id="tm-core" cx="50" cy="50" r="12" fill="#00d8ff" />
                
                <!-- Símbolo Play Blanco (Forma la P de entretenimiento) -->
                <polygon id="tm-play" points="46,42 46,58 58,50" fill="#ffffff" />
                
                <!-- Barrotes / Pilares Negros de Contención -->
                <rect id="tm-pillar-l" x="24" y="18" width="12" height="64" fill="#000000" />
                <rect id="tm-pillar-r" x="64" y="18" width="12" height="64" fill="#000000" />
            </svg>
        `;
        document.body.appendChild(overlay);

        const svg = document.getElementById('transmedia-svg');
        
        // Función de navegación transmedia
        function handleTransmediaTransition(e, targetHref) {
            if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('javascript:')) return;

            const lowerHref = targetHref.toLowerCase();
            const goesToProiectio = lowerHref.includes('proiect.io') || lowerHref.includes('proiectio');
            const goesToHumania = lowerHref.includes('humania.space') || (lowerHref.includes('humania') && !goesToProiectio);

            const siteNow = detectSite();

            // Salto cruzado: de Proiectio a Humania O de Humania a Proiectio
            const isCross = (siteNow === 'proiectio' && goesToHumania) || (siteNow === 'humania' && goesToProiectio);

            if (isCross) {
                e.preventDefault();
                e.stopPropagation();

                // 1. Asegurar estado inicial idéntico a la página de origen
                svg.setAttribute('class', siteNow === 'humania' ? 'state-humania' : 'state-proiectio');
                
                // 2. Activar overlay blanco
                overlay.classList.add('active');

                // 3. Tras 350ms, transformar hacia el destino
                setTimeout(() => {
                    if (goesToProiectio) {
                        // De H a P: Los barrotes se expulsan a los costados y el núcleo cian se expande a P
                        svg.setAttribute('class', 'state-proiectio');
                    } else if (goesToHumania) {
                        // De P a H: El núcleo cian se reduce y los barrotes entran desde lejos (-180px / +180px) para encerrarlo
                        svg.setAttribute('class', 'state-humania');
                    }
                }, 350);

                // 4. Salto de navegación al completarse el clímax
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 1800);
            }
        }

        // Intercepción delegada para enlaces <a> (fase de captura)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')) {
                handleTransmediaTransition(e, link.getAttribute('href'));
            }
        }, true);

        // Intercepción delegada para botones de navegación
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (btn) {
                const onclickRaw = btn.getAttribute('onclick') || '';
                if (onclickRaw.includes('window.location.href') || onclickRaw.includes('location.href')) {
                    const match = onclickRaw.match(/['"]([^'"]+)['"]/);
                    if (match && match[1]) {
                        handleTransmediaTransition(e, match[1]);
                    }
                }
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTransmedia);
    } else {
        initTransmedia();
    }
})();
