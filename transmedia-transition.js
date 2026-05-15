// Sistema de Transición Transmedia - Proiectio / Humania
(function() {
    // 1. Inyectar CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #transmedia-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #081c2e; z-index: 999999;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.4s ease;
        }
        #transmedia-overlay.active { opacity: 1; pointer-events: all; }
        
        #transmedia-svg { width: 150px; height: 150px; overflow: visible; }
        
        #tm-core, #tm-play, #tm-pillar-l, #tm-pillar-r {
            transition: all 1.2s cubic-bezier(0.77, 0, 0.175, 1); /* Curva suave y cinematográfica */
            transform-origin: 50% 50%;
        }
        
        /* ESTADO: HUMANIA (La jaula / La H) */
        .state-humania #tm-core { transform: scale(1); fill: #00ffff; }
        .state-humania #tm-play { transform: scale(0); opacity: 0; }
        .state-humania #tm-pillar-l { transform: translateX(0); opacity: 1; }
        .state-humania #tm-pillar-r { transform: translateX(0); opacity: 1; }

        /* ESTADO: PROIECTIO (El despertar / La P) */
        .state-proiectio #tm-core { transform: scale(2); fill: #00ffff; box-shadow: 0 0 20px #00ffff; }
        .state-proiectio #tm-play { transform: scale(1.2); opacity: 1; }
        .state-proiectio #tm-pillar-l { transform: translateX(-60px); opacity: 0; }
        .state-proiectio #tm-pillar-r { transform: translateX(60px); opacity: 0; }
    `;
    document.head.appendChild(style);

    // 2. Inyectar HTML
    const overlay = document.createElement('div');
    overlay.id = 'transmedia-overlay';
    overlay.innerHTML = `
        <svg viewBox="0 0 100 100" id="transmedia-svg">
            <circle id="tm-core" cx="50" cy="50" r="14" fill="#00ffff" />
            <!-- La P de Proiectio estilizada como un triángulo Play -->
            <polygon id="tm-play" points="46,42 46,58 58,50" fill="#081c2e" />
            <!-- Los pilares de Humania -->
            <rect id="tm-pillar-l" x="22" y="20" width="12" height="60" fill="#c5a059" rx="2" />
            <rect id="tm-pillar-r" x="66" y="20" width="12" height="60" fill="#c5a059" rx="2" />
        </svg>
    `;
    document.body.appendChild(overlay);

    const svg = document.getElementById('transmedia-svg');

    // Identificar la página actual usando el título
    const isHumania = document.title.includes('Humania') || document.title.includes('HUMANIA');
    
    // Función para manejar el clic
    function handleTransmediaTransition(e, targetHref) {
        const goesToProiectio = targetHref.includes('proiect.io') || targetHref.includes('proiectio');
        const goesToHumania = targetHref.includes('humania.space') || targetHref.includes('humania-repo') || targetHref.includes('humania-nexo.github.io/humania');

        if (goesToProiectio || goesToHumania) {
            e.preventDefault();

            // Fase 1: Entrar con el logo actual
            if (isHumania) {
                svg.setAttribute('class', 'state-humania');
            } else {
                svg.setAttribute('class', 'state-proiectio');
            }
            overlay.classList.add('active');

            // Fase 2: Animar hacia el logo de destino
            setTimeout(() => {
                if (goesToProiectio) {
                    svg.setAttribute('class', 'state-proiectio'); // Los barrotes se abren
                } else if (goesToHumania) {
                    svg.setAttribute('class', 'state-humania'); // Los barrotes se cierran
                }
            }, 500); // Esperar a que el overlay negro esté 100% visible

            // Fase 3: Redirigir
            setTimeout(() => {
                window.location.href = targetHref;
            }, 1800); // Tiempo suficiente para admirar la animación
        }
    }

    // Interceptar enlaces <a href="...">
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')) {
            handleTransmediaTransition(e, link.getAttribute('href'));
        }
    });

    // Sobrescribir botones con window.location.href en onclick
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
