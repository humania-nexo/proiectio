// Sistema de Transición Transmedia - Proiectio / Humania
// Coreografía de Identidad Simbólica: «La Jaula de Humania (H)» <-> «El Despertar de Proiectio (P)»
(function() {
    function initTransmedia() {
        if (document.getElementById('transmedia-overlay')) return; // Evitar duplicados

        // 1. Inyectar Estilos de Transición Kinética
        const style = document.createElement('style');
        style.innerHTML = `
            #transmedia-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #ffffff; /* Fondo blanco inmaculado para contraste radical */
                z-index: 9999999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
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
                transition: all 1.1s cubic-bezier(0.77, 0, 0.175, 1);
            }
            
            /* Utilidad para evitar transición en el seteo inicial del estado de origen */
            #transmedia-svg.no-transition #tm-core,
            #transmedia-svg.no-transition #tm-play,
            #transmedia-svg.no-transition #tm-pillar-l,
            #transmedia-svg.no-transition #tm-pillar-r {
                transition: none !important;
            }

            /* --- ESTADO: HUMANIA (La Jaula Institucional / La H) --- */
            /* Dos pilares de control encierran el punto azul central */
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

            /* --- ESTADO: PROIECTIO (El Despertar del Entretenimiento / La P) --- */
            /* Los pilares son expulsados a los costados y el núcleo cian se expande liberando el botón de juego */
            .state-proiectio #tm-core {
                transform: scale(2.4);
                fill: #00d8ff;
            }
            .state-proiectio #tm-play {
                transform: scale(1.3) rotate(0deg);
                opacity: 1;
            }
            .state-proiectio #tm-pillar-l {
                transform: translateX(-120px);
                opacity: 0;
            }
            .state-proiectio #tm-pillar-r {
                transform: translateX(120px);
                opacity: 0;
            }
        `;
        document.head.appendChild(style);

        // 2. Inyectar HTML del Escenario Vectorial
        const overlay = document.createElement('div');
        overlay.id = 'transmedia-overlay';
        overlay.innerHTML = `
            <svg viewBox="0 0 100 100" id="transmedia-svg">
                <!-- Núcleo Cyan (El punto atrapado / La esfera Proiectio) -->
                <circle id="tm-core" cx="50" cy="50" r="12" fill="#00d8ff" />
                
                <!-- Símbolo Play Blanco (Forma la P de entretenimiento en Proiectio) -->
                <polygon id="tm-play" points="46,42 46,58 58,50" fill="#ffffff" />
                
                <!-- Barrotes / Pilares Negros de Contención de Humania -->
                <rect id="tm-pillar-l" x="24" y="18" width="12" height="64" fill="#000000" />
                <rect id="tm-pillar-r" x="64" y="18" width="12" height="64" fill="#000000" />
            </svg>
        `;
        document.body.appendChild(overlay);

        const svg = document.getElementById('transmedia-svg');

        // Identificar el origen actual (Humania vs Proiectio)
        const isHumania = window.location.hostname.includes('humania') || 
                          window.location.pathname.includes('humania') || 
                          document.title.toLowerCase().includes('humania');
        
        // Ejecución de la coreografía transmedia
        function handleTransmediaTransition(e, targetHref) {
            if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('javascript:')) return;

            const goesToProiectio = targetHref.includes('proiect.io') || targetHref.includes('proiectio');
            const goesToHumania = targetHref.includes('humania.space') || targetHref.includes('humania-repo') || targetHref.includes('humania');

            // Solo disparar en salto transmedia cruzado (Humania -> Proiectio o Proiectio -> Humania)
            const isCrossTransition = (isHumania && goesToProiectio) || (!isHumania && goesToHumania);

            if (isCrossTransition) {
                e.preventDefault();
                e.stopPropagation();

                // 1. Congelar estado inicial de origen sin animación
                if (isHumania) {
                    svg.setAttribute('class', 'no-transition state-humania');
                } else {
                    svg.setAttribute('class', 'no-transition state-proiectio');
                }
                
                // Forzar reflujo en el DOM
                void svg.offsetWidth;

                // 2. Encender overlay blanco y reactivar transiciones
                svg.classList.remove('no-transition');
                overlay.classList.add('active');

                // 3. Disparar metamorfosis simbólica tras 300ms
                setTimeout(() => {
                    if (goesToProiectio) {
                        // De H a P: Los barrotes se abren y el círculo se expande
                        svg.setAttribute('class', 'state-proiectio');
                    } else if (goesToHumania) {
                        // De P a H: El círculo se reduce y los barrotes caen encerrándolo
                        svg.setAttribute('class', 'state-humania');
                    }
                }, 300);

                // 4. Salto de navegación al completarse el clímax visual
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
