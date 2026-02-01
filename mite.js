/* =========================================
   MITE VIRTUAL ASSISTANT - MODULO INTEGRAL
   Versión: 2.0 (Omnipresente)
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {
    // 1. INYECCIÓN DE ESTILOS DE MITE
    const style = document.createElement('style');
    style.innerHTML = `
        #mite-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Helvetica Neue', Arial, sans-serif; }
        #mite-bubble { width: 70px; height: 70px; cursor: pointer; transition: transform 0.3s; filter: drop-shadow(0 5px 15px rgba(0,195,255,0.4)); }
        #mite-bubble:hover { transform: scale(1.1) rotate(5deg); }
        
        #chat-window { 
            position: fixed; bottom: 100px; right: 20px; width: 300px; 
            background: white; border-radius: 20px; 
            box-shadow: 0 15px 50px rgba(0,0,0,0.2); 
            display: none; flex-direction: column; overflow: hidden; 
            border: 1px solid #eee; font-size: 0.85rem;
            animation: popUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        @keyframes popUp { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .chat-header { background: #00c3ff; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .chat-body { height: 280px; overflow-y: auto; padding: 15px; background: #fff; scroll-behavior: smooth; }
        .mite-msg { background: #f0f0f5; padding: 10px; border-radius: 15px 15px 15px 0; margin-bottom: 10px; color: #333; line-height: 1.4; animation: fadeIn 0.3s; }
        .user-msg { background: #e6fcff; padding: 10px; border-radius: 15px 15px 0 15px; margin-bottom: 10px; color: #005f73; text-align: right; margin-left: auto; max-width: 80%; }
        
        .chat-options { padding: 10px; border-top: 1px solid #eee; background: #fafafa; display: flex; flex-wrap: wrap; gap: 5px; }
        .opt-btn { flex: 1 1 auto; background: white; border: 1px solid #00c3ff; color: #00c3ff; padding: 8px; border-radius: 12px; font-size: 0.7rem; cursor: pointer; transition: 0.2s; text-align: center; }
        .opt-btn:hover { background: #00c3ff; color: white; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    // 2. INYECCIÓN DE ESTRUCTURA HTML
    const widget = document.createElement('div');
    widget.id = 'mite-widget';
    widget.innerHTML = `
        <div id="chat-window">
            <div class="chat-header">
                <span>MITE Assistant</span>
                <span id="close-chat" style="cursor:pointer; font-size:1.2rem;">&times;</span>
            </div>
            <div class="chat-body" id="chat-log">
                <div class="mite-msg">¡Zashoom! Soy Mite. 💎 ¿Buscas emociones fuertes o solo vienes a mirar? ¡Ding-Pum!</div>
            </div>
            <div class="chat-options">
                <button class="opt-btn" onclick="miteResponder('guiame')">📍 Guíame</button>
                <button class="opt-btn" onclick="miteResponder('eter')">💎 Ganar Éter</button>
                <button class="opt-btn" onclick="miteResponder('secreto')">🔒 Secreto</button>
            </div>
        </div>
        
        <img src="multimedia/mite.gif" id="mite-bubble" alt="Mite">
    `;
    document.body.appendChild(widget);

    // 3. LÓGICA DEL CEREBRO DE MITE
    const bubble = document.getElementById('mite-bubble');
    const windowChat = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const log = document.getElementById('chat-log');

    // Toggle Chat
    function toggleChat() {
        const isHidden = windowChat.style.display === 'none' || windowChat.style.display === '';
        windowChat.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) scrollToBottom();
    }

    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Función de Respuesta Global (Accesible desde HTML)
    window.miteResponder = function(tema) {
        // Mensaje del usuario (Simulado visualmente)
        /* const userDiv = document.createElement('div');
        userDiv.className = 'user-msg';
        userDiv.textContent = tema === 'guiame' ? "Guíame" : tema === 'eter' ? "Quiero Éter" : "Dime un secreto";
        log.appendChild(userDiv); */ // Opcional: si quieres ver lo que "dices"

        let resp = "";
        let accion = null;

        // --- CEREBRO DE RESPUESTAS ---
        if (tema === 'guiame') {
            const rutas = [
                "¡Vamos a **Arcadia**! Es mi lugar favorito para no hacer nada. 🌲", 
                "¿Te sientes fuerte? ¡El **Coliseo** te espera! ⚔️",
                "Si buscas fiesta, **Neon Nirvana** es la única opción. 🍸"
            ];
            resp = rutas[Math.floor(Math.random() * rutas.length)];
            // Añadir botones de navegación dinámicos
            accion = `
                <div style="margin-top:5px; display:flex; gap:5px;">
                    <button class="opt-btn" onclick="location.href='arcadia.html'">Ir a Arcadia</button>
                    <button class="opt-btn" onclick="location.href='coliseo.html'">Ir al Coliseo</button>
                </div>`;
        } 
        else if (tema === 'eter') {
            resp = "¡El Éter mueve el mundo! Puedes comprarlo en la tienda o ganarlo... si sobrevives en el Coliseo. ¿Tienes tarjeta de crédito de Humania?";
        } 
        else if (tema === 'secreto') {
            resp = "Shhh... 🤫 Dicen que si agitas tu teléfono muy fuerte, el sistema se marea y puedes ver cosas que no deberías. Pero yo no te dije nada. ¡Ding-Pum!";
        }

        // Escribir respuesta de Mite
        const miteDiv = document.createElement('div');
        miteDiv.className = 'mite-msg';
        miteDiv.innerHTML = `MITE: ${resp} ${accion ? accion : ''}`;
        log.appendChild(miteDiv);
        scrollToBottom();
    };

    function scrollToBottom() {
        log.scrollTop = log.scrollHeight;
    }
});
