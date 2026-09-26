// Sistema de Transición Transmedia - Proiectio / Humania
(function() {
    function initTransmedia() {
        if (document.getElementById('transmedia-overlay')) return; // Evitar duplicados

        // 1. Inyectar CSS
        const style = document.createElement('style');
        style.innerHTML = `
            #transmedia-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: #ffffff; /* Fondo blanco para resaltar el negro y cian */
                z-index: 999999;
                display: flex; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none;
                transition: opacity 0.5s ease;
            }
            #transmedia-overlay.active { opacity: 1; pointer-events: all; }
            
            #transmedia-svg { width: 180px; height: 180px; overflow: visible; }
            
            #tm-core, #tm-play, #tm-pillar-l, #tm-pillar-r {
                transition: all 1.2s cubic-bezier(0.77, 0, 0.175, 1);
                transform-origin: 50% 50%;
            }
            
            /* Utilidad para evitar transición en el seteo inicial */
            #transmedia-svg.no-transition #tm-core,
            #transmedia-svg.no-transition #tm-play,
            #transmedia-svg.no-transition #tm-pillar-l,
            #transmedia-svg.no-transition #tm-pillar-r {
                transition: none !important;
            }

            /* ESTADO: HUMANIA (La jaula / La H) */
            .state-humania #tm-core { transform: scale(1); fill: #00d8ff; }
            .state-humania #tm-play { transform: scale(0) rotate(-90deg); opacity: 0; }
            .state-humania #tm-pillar-l { transform: translateX(0); opacity: 1; }
            .state-humania #tm-pillar-r { transform: translateX(0); opacity: 1; }

            /* ESTADO: PROIECTIO (El despertar / La P) */
            .state-proiectio #tm-core { transform: scale(2.2); fill: #00d8ff; }
            .state-proiectio #tm-play { transform: scale(1.3) rotate(0deg); opacity: 1; }
            .state-proiectio #tm-pillar-l { transform: translateX(-80px); opacity: 0; }
            .state-proiectio #tm-pillar-r { transform: translateX(80px); opacity: 0; }
        `;
        document.head.appendChild(style);

        // 2. Inyectar HTML del Overlay
        const overlay = document.createElement('div');
        overlay.id = 'transmedia-overlay';
        overlay.innerHTML = `
            <svg viewBox="0 0 100 100" id="transmedia-svg">
                <!-- Núcleo -->
                <circle id="tm-core" cx="50" cy="50" r="14" fill="#00d8ff" />
                <!-- La P de Proiectio (Triángulo Play) -->
                <polygon id="tm-play" points="46,40 46,60 60,50" fill="#ffffff" />
                <!-- Pilares Negros Afilados -->
                <rect id="tm-pillar-l" x="22" y="15" width="12" height="70" fill="#000000" />
                <rect id="tm-pillar-r" x="66" y="15" width="12" height="70" fill="#000000" />
            </svg>
        `;
        document.body.appendChild(overlay);

        const svg = document.getElementById('transmedia-svg');

        // Identificar la página actual (de forma infalible)
        const isHumania = window.location.hostname.includes('humania') || 
                          window.location.pathname.includes('humania') || 
                          document.title.toLowerCase().includes('humania');
        
        // Función para manejar el salto transmedia
        function handleTransmediaTransition(e, targetHref) {
            if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('javascript:')) return;

            const goesToProiectio = targetHref.includes('proiect.io') || targetHref.includes('proiectio');
            const goesToHumania = targetHref.includes('humania.space') || targetHref.includes('humania-repo') || targetHref.includes('humania');

            // Solo ejecutar si es un salto transmedia cruzado (Humania -> Proiectio O Proiectio -> Humania)
            const isCrossTransition = (isHumania && goesToProiectio) || (!isHumania && goesToHumania);

            if (isCrossTransition) {
                e.preventDefault();
                e.stopPropagation();

                // Configurar el estado de origen SIN animación previa
                if (isHumania) {
                    svg.setAttribute('class', 'no-transition state-humania');
                } else {
                    svg.setAttribute('class', 'no-transition state-proiectio');
                }
                
                // Forzar reflow en el navegador
                void svg.offsetWidth;

                // Reactivar transiciones suaves y encender el overlay
                svg.classList.remove('no-transition');
                overlay.classList.add('active');

                // Disparar la metamorfosis hacia el destino a los 300ms
                setTimeout(() => {
                    if (goesToProiectio) {
                        svg.setAttribute('class', 'state-proiectio'); // Abrir jaula H -> Liberar P
                    } else if (goesToHumania) {
                        svg.setAttribute('class', 'state-humania'); // Cerrar P -> Consolidar H
                    }
                }, 300);

                // Redirigir al destino
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 1800);
            }
        }

        // Interceptar clics en enlaces <a> (fase de captura para asegurar delegación en elementos asíncronos)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')) {
                handleTransmediaTransition(e, link.getAttribute('href'));
            }
        }, true);

        // Interceptar clics en botones con redirección
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
