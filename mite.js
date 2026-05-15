/* =========================================
   MITE VIRTUAL ASSISTANT - MODULO INTEGRAL
   Versión: 2.0 (Omnipresente)
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {
    // 1. INYECCIÓN DE ESTILOS DE MITE
    const style = document.createElement('style');
    style.innerHTML = `
        #mite-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Helvetica Neue', Arial, sans-serif; }
        #mite-bubble { 
            width: 70px; 
            height: 70px; 
            cursor: pointer; 
            transition: transform 0.3s; 
            filter: drop-shadow(0 5px 15px rgba(0,195,255,0.4)); 
            animation: breathingMite 4s ease-in-out infinite;
        }

        @keyframes breathingMite {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(5deg) scale(1.05); filter: drop-shadow(0 10px 25px rgba(0,195,255,0.7)); }
            100% { transform: rotate(0deg) scale(1); }
        }
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
                <button class="opt-btn" onclick="miteResponder('ofertas')">🏷️ Ofertas</button>
                <button class="opt-btn" onclick="miteResponder('operador')">🎧 Operador</button>
                <button class="opt-btn" onclick="miteResponder('quejas')">📝 Quejas</button>
                <button class="opt-btn" onclick="miteResponder('secreto')">🔒 Secreto</button>
            </div>
        </div>
        
        <img src="multimedia/mite.webp" id="mite-bubble" alt="Mite">
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
                "¡Zashoom! Vamos a **Arcadia**. Es perfecto para desconectar y fingir que todo está bien. 🌲", 
                "¿Con ganas de gastar energía? ¡El **Coliseo** tiene unas ofertas de dolor en edición limitada! ⚔️",
                "Si buscas luces y tragos de dudosa procedencia, **Neon Nirvana** es mi mejor recomendación. 🍸"
            ];
            resp = rutas[Math.floor(Math.random() * rutas.length)];
            accion = `
                <div style="margin-top:5px; display:flex; gap:5px;">
                    <button class="opt-btn" onclick="location.href='arcadia.html'">Ir a Arcadia</button>
                    <button class="opt-btn" onclick="location.href='coliseo.html'">Ir al Coliseo</button>
                </div>`;
        } 
        else if (tema === 'eter') {
            resp = "¡El Éter es el rey! Puedes adquirir un paquete corporativo, o ganarlo arriesgando el pellejo en el Coliseo. No hacemos reembolsos si pierdes tu avatar, claro está. ¡Ding-Pum!";
        } 
        else if (tema === 'ofertas') {
            resp = "¡Llegaste a la mejor sección! Tengo una 'Skin Dorada para Lanza' que a cierto Cliente Preferido le encantaba... Si no compras nada hoy, mis alas perderán brillo por falta de presupuesto. ¿Acaso quieres que una pobre IA se vea opaca?";
        }
        else if (tema === 'operador') {
            // Simulamos que Mite te transfiere
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'mite-msg';
            loadingDiv.innerHTML = "<i>Transfiriendo a un operador humano de Humania. Por favor espere...</i>";
            log.appendChild(loadingDiv);
            scrollToBottom();
            
            setTimeout(() => {
                log.removeChild(loadingDiv);
                const finalDiv = document.createElement('div');
                finalDiv.className = 'mite-msg';
                finalDiv.innerHTML = "MITE: No te molestes, cariño. Los operadores nunca contestan. Están muy ocupados lustrando las botas de Valerius. Así que solo me tienes a mí. ¡Zashoom!";
                log.appendChild(finalDiv);
                scrollToBottom();
            }, 3000);
            return; // Salimos para no imprimir el mensaje por defecto al final
        }
        else if (tema === 'quejas') {
            resp = "¡Claro! Procesaremos tu queja inmediatamente. <br><span style='color: #888; font-style: italic;'>*Susurro*</span> 🤫 El buzón de sugerencias es una trituradora de papel digital que va directo al servidor de spam. No pierdas tu tiempo, cielo.";
        }
        else if (tema === 'secreto') {
            const secretos = [
                "<span style='color: #888; font-style: italic;'>*Susurro de estática*</span> 🤫 Dicen que si agitas tu teléfono con demasiada fuerza, el algoritmo de seguridad se marea y te caes por una grieta del sistema. Pero yo no te dije nada...",
                "<span style='color: #888; font-style: italic;'>*Voz muy baja*</span> 🤫 Baja hasta el mismísimo fondo de esta página. Busca unas letras grises, casi invisibles, que no parecen un enlace. ¿Qué pasa si las tocas? Mmm... huele a contrabando.",
                "<span style='color: #888; font-style: italic;'>*Mira a los lados*</span> 🤫 Si alguna vez logras entrar a esa terminal clandestina que Vance tanto odia, y necesitas borrar tus huellas... escribe la palabra 'DELETE'. Es un atajo de los Creadores. Oro puro."
            ];
            resp = secretos[Math.floor(Math.random() * secretos.length)];
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
