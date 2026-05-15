// Sistema de Transición Transmedia - Proiectio / Humania
(function() {
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

    // 2. Inyectar HTML
    const overlay = document.createElement('div');
    overlay.id = 'transmedia-overlay';
    // Pilares negros sin radius, núcleo cian, triángulo blanco (play)
    overlay.innerHTML = `
        <svg viewBox="0 0 100 100" id="transmedia-svg">
            <!-- Núcleo -->
            <circle id="tm-core" cx="50" cy="50" r="14" fill="#00d8ff" />
            <!-- La P de Proiectio (Triángulo Play) -->
            <!-- Es de color blanco para parecer un hueco en la esfera cuando crezca -->
            <polygon id="tm-play" points="46,40 46,60 60,50" fill="#ffffff" />
            <!-- Pilares Negros Afilados -->
            <rect id="tm-pillar-l" x="22" y="15" width="12" height="70" fill="#000000" />
            <rect id="tm-pillar-r" x="66" y="15" width="12" height="70" fill="#000000" />
        </svg>
    `;
    document.body.appendChild(overlay);

    const svg = document.getElementById('transmedia-svg');

    // Identificar la página actual
    const isHumania = document.title.includes('Humania') || document.title.includes('HUMANIA');
    
    // Función para manejar el clic
    function handleTransmediaTransition(e, targetHref) {
        const goesToProiectio = targetHref.includes('proiect.io') || targetHref.includes('proiectio');
        const goesToHumania = targetHref.includes('humania.space') || targetHref.includes('humania-repo') || targetHref.includes('humania-nexo.github.io/humania');

        if (goesToProiectio || goesToHumania) {
            e.preventDefault();

            // Configurar el estado inicial para que coincida con la página donde estamos
            // Forza un "reflow" para que el CSS aplique antes de poner la opacidad
            if (isHumania) {
                svg.setAttribute('class', 'state-humania');
            } else {
                svg.setAttribute('class', 'state-proiectio');
            }
            
            // Un pequeño truco para forzar el repintado del navegador y evitar saltos
            void svg.offsetWidth;

            // Mostrar el fondo
            overlay.classList.add('active');

            // Disparar la animación
            setTimeout(() => {
                if (goesToProiectio) {
                    svg.setAttribute('class', 'state-proiectio'); // Abrir jaula
                } else if (goesToHumania) {
                    svg.setAttribute('class', 'state-humania'); // Cerrar jaula
                }
            }, 600); // Dar suficiente tiempo para que el fade-in termine

            // Redirigir
            setTimeout(() => {
                window.location.href = targetHref;
            }, 2000); // Aumenté el tiempo para que disfrutes toda la animación antes del salto
        }
    }

    // Interceptar enlaces <a href="...">
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')) {
            handleTransmediaTransition(e, link.getAttribute('href'));
        }
    });

    // Sobrescribir botones con window.location.href
    const buttons = document.querySelectorAll('button[onclick]');
    buttons.forEach(btn => {
        const onclickRaw = btn.getAttribute('onclick');
        if (onclickRaw.includes('window.location.href')) {
            btn.removeAttribute('onclick');
            btn.addEventListener('click', (e) => {
                const match = onclickRaw.match(/'([^']+)'/);
                if (match && match[1]) {
                    handleTransmediaTransition(e, match[1]);
                }
            });
        }
    });

})();
