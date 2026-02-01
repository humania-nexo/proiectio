/* =========================================
   PROTOCOLO PUENTE BIFROST - Transición Cuántica
   ========================================= */

function iniciarTransicion(destino) {
    // 1. Crear el telón de fondo
    const overlay = document.createElement('div');
    overlay.id = 'quantum-overlay';
    overlay.innerHTML = `
        <div class="morph-container">
            <div class="bar-left"></div>
            <div class="core-dot"></div>
            <div class="bar-right"></div>
            <div class="p-letter">P</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Determinar bando actual
    const esHumania = window.location.hostname.includes('humania.space');
    
    // 3. Activar animación de entrada
    setTimeout(() => {
        overlay.classList.add('active');
        if (destino.includes('humania.space')) {
            overlay.classList.add('to-humania');
        } else {
            overlay.classList.add('to-proiectio');
        }
    }, 10);

    // 4. Salto dimensional tras la animación (2 segundos)
    setTimeout(() => {
        window.location.href = destino;
    }, 2200);
}
