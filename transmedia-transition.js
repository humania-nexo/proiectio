// Sistema de Transición Transmedia - Proiectio / Humania
// Coreografía Cinemática: «La Jaula de Humania (H)» <-> «El Despertar de Proiectio (P)»
(function() {
    function initTransmedia() {
        if (document.getElementById('transmedia-overlay')) return; // Evitar duplicados

        // Identificar el origen actual (Humania vs Proiectio)
        const isHumania = window.location.hostname.includes('humania') || 
                          window.location.pathname.includes('humania') || 
                          document.title.toLowerCase().includes('humania');

        // 1. Inyectar Estilos de Transición Kinética
        const style = document.createElement('style');
        style.innerHTML = `
            #transmedia-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #ffffff; /* Fondo blanco puro */
                z-index: 9999999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.35s ease;
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

            /* --- ESTADO: HUMANIA (La Jaula de Control / La H) --- */
            /* Dos pilares negros encerrando el punto azul central */
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
            /* Los pilares expulsados lejos a los costados y el núcleo cian expandido */
            .state-proiectio #tm-core {
                transform: scale(2.4);
                fill: #00d8ff;
            }
            .state-proiectio #tm-play {
                transform: scale(1.3) rotate(0deg);
                opacity: 1;
            }
            .state-proiectio #tm-pillar-l {
                transform: translateX(-160px);
                opacity: 0;
            }
            .state-proiectio #tm-pillar-r {
                transform: translateX(160px);
                opacity: 0;
            }
        `;
        document.head.appendChild(style);

        // 2. Inyectar HTML del Escenario Vectorial con el estado nativo pre-configurado
        const overlay = document.createElement('div');
        overlay.id = 'transmedia-overlay';
        overlay.innerHTML = `
            <svg viewBox="0 0 100 100" id="transmedia-svg" class="${isHumania ? 'state-humania' : 'state-proiectio'}">
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
        
        // Ejecución precisa de la coreografía transmedia
        function handleTransmediaTransition(e, targetHref) {
            if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('javascript:')) return;

            const goesToProiectio = targetHref.includes('proiect.io') || targetHref.includes('proiectio');
            const goesToHumania = targetHref.includes('humania.space') || targetHref.includes('humania-repo') || targetHref.includes('humania');

            // Solo disparar en salto transmedia cruzado (Humania -> Proiectio o Proiectio -> Humania)
            const isCrossTransition = (isHumania && goesToProiectio) || (!isHumania && goesToHumania);

            if (isCrossTransition) {
                e.preventDefault();
                e.stopPropagation();

                // 1. Asegurar que el estado inicial de partida esté fijado con precisión
                svg.setAttribute('class', isHumania ? 'state-humania' : 'state-proiectio');
                
                // 2. Encender overlay blanco
                overlay.classList.add('active');

                // 3. Tras 300ms de mostrar el logo de origen, disparar la transformación al destino
                setTimeout(() => {
                    if (goesToProiectio) {
                        // De H a P: Los barrotes se expulsan a los costados (-160px / +160px) y el núcleo cian se expande
                        svg.setAttribute('class', 'state-proiectio');
                    } else if (goesToHumania) {
                        // De P a H: El núcleo cian se contrae a punto y los barrotes entran desde lejos (-160px / +160px) para encerrarlo
                        svg.setAttribute('class', 'state-humania');
                    }
                }, 300);

                // 4. Salto de navegación al culminar el movimiento
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 1750);
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
