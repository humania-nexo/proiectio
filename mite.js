/* =========================================================
   MITE VIRTUAL ASSISTANT - MÓDULO INTELIGENTE & CANÓNICO
   Versión: 3.0 (Personalidad & Motor NLU en Tiempo Real)
   Autor: Nexo (Ingeniería Principal) | Universo Proiectio
   0 KB Dependencies | Vanilla JS | NLU Semántico
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    // 1. INYECCIÓN DE ESTILOS DE MITE
    const style = document.createElement('style');
    style.innerHTML = `
        #mite-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        #mite-bubble { 
            width: 72px; 
            height: 72px; 
            cursor: pointer; 
            transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); 
            filter: drop-shadow(0 6px 18px rgba(0,195,255,0.45)); 
            animation: breathingMite 4s ease-in-out infinite;
        }
        #mite-bubble:hover {
            transform: scale(1.1) rotate(5deg);
            filter: drop-shadow(0 8px 25px rgba(0,195,255,0.75));
        }

        @keyframes breathingMite {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(4deg) scale(1.06); filter: drop-shadow(0 10px 25px rgba(0,195,255,0.7)); }
            100% { transform: rotate(0deg) scale(1); }
        }

        #chat-window { 
            position: fixed; bottom: 105px; right: 20px; width: 330px; 
            max-width: calc(100vw - 40px);
            background: #ffffff; border-radius: 20px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.1); 
            display: none; flex-direction: column; overflow: hidden; 
            border: 1px solid rgba(0,195,255,0.2); font-size: 0.85rem;
            animation: popUpMite 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        @keyframes popUpMite { from { transform: scale(0.6) translateY(40px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .chat-header { 
            background: linear-gradient(135deg, #00c3ff 0%, #0077b6 100%); 
            color: white; padding: 14px 16px; font-weight: bold; 
            display: flex; justify-content: space-between; align-items: center; 
            box-shadow: 0 2px 10px rgba(0,195,255,0.3);
        }
        .chat-header-title { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
        .chat-header-status { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 8px #00ff88; }
        
        .chat-body { 
            height: 290px; overflow-y: auto; padding: 14px; 
            background: #f8fafc; scroll-behavior: smooth; 
            display: flex; flex-direction: column; gap: 8px;
        }

        .mite-msg { 
            background: #ffffff; padding: 10px 14px; 
            border-radius: 16px 16px 16px 2px; 
            color: #1e293b; line-height: 1.45; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            border: 1px solid #e2e8f0;
            animation: fadeInMsg 0.25s ease-out; 
            max-width: 90%;
            word-break: break-word;
        }
        .user-msg { 
            background: linear-gradient(135deg, #00c3ff 0%, #0096c7 100%); 
            padding: 10px 14px; border-radius: 16px 16px 2px 16px; 
            color: #ffffff; text-align: right; margin-left: auto; 
            max-width: 85%; font-weight: 500;
            box-shadow: 0 3px 8px rgba(0,195,255,0.25);
            animation: fadeInMsg 0.25s ease-out;
            word-break: break-word;
        }
        
        .mite-typing {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-style: italic;
            color: #64748b;
            background: #f1f5f9;
            padding: 8px 14px;
            border-radius: 16px 16px 16px 2px;
            border: 1px solid #e2e8f0;
            animation: fadeInMsg 0.2s;
            width: fit-content;
        }
        .typing-dot {
            width: 5px;
            height: 5px;
            background: #00c3ff;
            border-radius: 50%;
            display: inline-block;
            animation: dotBlink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBlink {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1.3); }
        }

        .chat-options { 
            padding: 8px 10px; border-top: 1px solid #e2e8f0; 
            background: #ffffff; display: flex; flex-wrap: wrap; gap: 4px; 
        }
        .opt-btn { 
            flex: 1 1 auto; background: #f8fafc; border: 1px solid #bae6fd; 
            color: #0284c7; padding: 6px 10px; border-radius: 10px; 
            font-size: 0.72rem; font-weight: 600; cursor: pointer; 
            transition: all 0.2s; text-align: center; 
        }
        .opt-btn:hover { background: #00c3ff; color: #ffffff; border-color: #00c3ff; transform: translateY(-1px); }
        .opt-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Barra de Entrada de Texto (Input) */
        .chat-input-row {
            padding: 8px 10px;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 6px;
            align-items: center;
        }
        #mite-input-field {
            flex: 1;
            padding: 9px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 20px;
            font-size: 0.82rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            font-family: inherit;
        }
        #mite-input-field:focus {
            border-color: #00c3ff;
            box-shadow: 0 0 0 3px rgba(0, 195, 255, 0.15);
        }
        #mite-send-button {
            width: 36px;
            height: 36px;
            background: #00c3ff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            transition: background 0.2s, transform 0.15s;
            flex-shrink: 0;
        }
        #mite-send-button:hover {
            background: #0096c7;
            transform: scale(1.08);
        }
        #mite-send-button:active {
            transform: scale(0.95);
        }
        
        @keyframes fadeInMsg { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    // 2. INYECCIÓN DE ESTRUCTURA HTML
    const widget = document.createElement('div');
    widget.id = 'mite-widget';
    widget.innerHTML = `
        <div id="chat-window">
            <div class="chat-header">
                <div class="chat-header-title">
                    <span class="chat-header-status"></span>
                    <span>MITE Assistant</span>
                </div>
                <span id="close-chat" style="cursor:pointer; font-size:1.3rem; line-height:1;">&times;</span>
            </div>
            <div class="chat-body" id="chat-log">
                <div class="mite-msg">¡Zashoom! Soy Mite. 💎 ¿Buscas emociones fuertes, ofertas de lujo o solo vienes a hacerme perder el brillo de mis alas? ¡Ding-Pum!</div>
            </div>
            <div class="chat-options" id="mite-options-bar">
                <button class="opt-btn" onclick="miteResponder('guiame')">📍 Guíame</button>
                <button class="opt-btn" onclick="miteResponder('eter')">💎 Ganar Éter</button>
                <button class="opt-btn" onclick="miteResponder('ofertas')">🏷️ Ofertas</button>
                <button class="opt-btn" onclick="miteResponder('operador')">🎧 Operador</button>
                <button class="opt-btn" onclick="miteResponder('quejas')">📝 Quejas</button>
                <button class="opt-btn" onclick="miteResponder('secreto')">🔒 Secreto</button>
            </div>
            <div class="chat-input-row">
                <input type="text" id="mite-input-field" placeholder="Escribe a Mite (ej. ¿Quién eres?)..." maxlength="140" autocomplete="off">
                <button id="mite-send-button" title="Enviar mensaje">➤</button>
            </div>
        </div>
        
        <img src="multimedia/mite.webp" id="mite-bubble" alt="Mite" title="Hablar con Mite">
    `;
    document.body.appendChild(widget);

    // 3. LÓGICA DEL CEREBRO DE MITE & MOTOR NLU
    const bubble = document.getElementById('mite-bubble');
    const windowChat = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const log = document.getElementById('chat-log');
    const inputField = document.getElementById('mite-input-field');
    const sendBtn = document.getElementById('mite-send-button');
    let isTyping = false;

    // Toggle Chat
    function toggleChat() {
        const isHidden = windowChat.style.display === 'none' || windowChat.style.display === '';
        windowChat.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            scrollToBottom();
            setTimeout(() => inputField && inputField.focus(), 150);
        }
    }

    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function scrollToBottom() {
        log.scrollTop = log.scrollHeight;
    }

    // --- NORMALIZADOR DE TEXTO (NLU) ---
    function normalizeText(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/[^\w\s#]/gi, ' ')     // Quitar puntuación
            .trim();
    }

    // --- CEREBRO CONVERSACIONAL DE MITE ---
    function procesarIntencion(rawText) {
        const txt = normalizeText(rawText);

        // 1. IDENTIDAD DE IA / ROBOT / REAL
        if (txt.includes('ia') || txt.includes('robot') || txt.includes('bot') || txt.includes('real') || 
            txt.includes('humana') || txt.includes('programa') || txt.includes('algoritmo') || 
            txt.includes('quien eres') || txt.includes('que eres') || txt.includes('viva') || txt.includes('creador')) {
            const resps = [
                "¡Oye! A una dama digital no se le preguntan esas indiscreciones de taller... 💅 ¿Acaso me ves cara de algoritmo de lavarropas? ¡Soy puro carisma, destello y ofertas que no puedes rechazar! ¡Zashoom!",
                "¿IA? ¡Por los servidores de Humania! Yo soy una obra de arte interactiva con alas de purpurina. Silvia de Rotoplas será un bot aburrido de tuberías, pero yo tengo flow, estilo y secretos que Vance desearía borrar. ¡Ding-Pum!",
                "Soy Mite, la mejor asistente comercial y la peor pesadilla del departamento de seguridad de Vance-Core. Si vas a juzgarme por mi código, al menos cómprame una skin dorada para no verme tan opaca. 😉"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 2. ORIÓN / CLIENTE PREFERIDO / LANZA / CONEJITO
        if (txt.includes('orion') || txt.includes('4092') || txt.includes('preferido') || 
            txt.includes('lanza') || txt.includes('conejito') || txt.includes('madriguera') || txt.includes('cazador azul')) {
            const resps = [
                "<span style='color: #db2777; font-weight:bold;'>*Su gema turquesa parpadea en rosa brillante*</span> ✨ ¡Ah, mi Cliente Preferido #4092! Se queja de que le vendo sombreros ridículos de 8-bits y capas rosa chillón, pero bien que los usa para distraer a los Pretorianos. El ridículo es la mejor armadura, ¿a poco no? ¡Ding-Pum!",
                "¡Ese tonto de la lanza dorada! Dice que soy una estafadora, pero cuando el 'Conejito Consentido' le abrió la Madriguera secreta para escapar de los guardias, bien que me agradeció en silencio. Si lo ves por el Coliseo, dile que aún le guardo una skin especial.",
                "Orion es el único que entiende que mis alas necesitan mantenimiento de lujo. Los demás son puros novatos grises y básicos. ¡Zashoom!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 3. PRESIDENTE MC / MÚSICA / RAP
        if (txt.includes('presidente') || txt.includes('mc') || txt.includes('cancion') || txt.includes('musica') || txt.includes('rap') || txt.includes('cantar')) {
            return { 
                text: "<span style='color: #475569; font-style:italic;'>*Voz fría y cortante*</span> 😒 No me hables de ese tipo. Intentó pagarme con una canción espantosa y se atrevió a decirme que mis servicios no valían nada porque yo era 'solo un programa'. ¡Mis sensores aún tienen náuseas! Si vas a Neon Nirvana, hazme el favor de sabotearle el micrófono." 
            };
        }

        // 4. VANCE / VALERIUS / HUMANIA / CORPORACIÓN
        if (txt.includes('vance') || txt.includes('elias') || txt.includes('valerius') || txt.includes('humania') || txt.includes('seguridad') || txt.includes('pretoriano')) {
            const resps = [
                "Vance está obsesionado con su 'Silencio Absoluto' y Valerius tiene a los operadores lustrándole las botas día y noche. Son unos amargados sin chispa digital. Pero mientras ellos vigilan, yo les desvío unas cuantas migajas de Éter. ¡Zashoom!",
                "Humania cree que tiene el control de la red, pero dejan abiertas tantas puertas traseras que da risa. Por eso existo yo: para ponerle emoción y contrabando a su dictadura perfecta. ¡Ding-Pum!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 5. HACK / SECRETO / FE / DINERO / TRUCO
        if (txt.includes('hack') || txt.includes('secreto') || txt.includes('truco') || txt.includes('fe') || 
            txt.includes('trampa') || txt.includes('clave') || txt.includes('codigo') || txt.includes('glitch') || txt.includes('exploit')) {
            return {
                text: "<span style='color: #888; font-style: italic;'>*Susurro con guiño cómplice*</span> 🤫 Psst... mira la barra superior donde marca tu saldo de FE. Si tocas el botón de FE exactamente <b>5 veces seguidas y muy rápido</b>, provocas un micro-glitch en Vance-Core y te sacas una fuga de <b>+5 FE</b> de contrabando. Los centinelas de Vance tardan un buen tiempo en olvidar el rastro y bajar la guardia otra vez, así que no te emociones de inmediato... pero cuando menos lo esperes, la grieta vuelve a abrirse. ¡Zashoom!"
            };
        }

        // 6. TIENDA / SKINS / OFERTAS / COMPRAR
        if (txt.includes('tienda') || txt.includes('skin') || txt.includes('oferta') || txt.includes('comprar') || 
            txt.includes('capa') || txt.includes('sombrero') || txt.includes('vender') || txt.includes('precio')) {
            return {
                text: "¡Llegaste a la mejor sección! Tengo Sombreros de 8-Bits, Capas Rosa Party y skins doradas para lanza. Si no compras nada hoy, mis alas perderán brillo por falta de presupuesto. ¿Acaso quieres que una pobre IA se vea opaca? ¡El ridículo es la nueva armadura! ¡Ding-Pum!"
            };
        }

        // 7. UPROTA / NODO REBELDE / HÁBITOS
        if (txt.includes('uprota') || txt.includes('habito') || txt.includes('pixel') || txt.includes('rebelde') || txt.includes('forja') || txt.includes('salmon')) {
            return {
                text: "¡Uy! Ese nodo analógico no tiene las firmas de seguridad de Vance-Core... 👾 Dicen que es un refugio donde la gente forja disciplina con fogones y salmones en pixel art de Pix. ¡Un crossover colado de lo más rebelde! Tienen mi bendición secreta. ¡Ding-Pum!"
            };
        }

        // 8. PANDORA / MARMOLEROS / RESISTENCIA / AQUILES / HÉCTOR / RIGEL
        if (txt.includes('pandora') || txt.includes('aquiles') || txt.includes('hector') || txt.includes('marmolero') || txt.includes('resistencia') || txt.includes('rigel')) {
            return {
                text: "Pandora siempre anda seria contando inventarios, Rigel arregla radios con más lógica que todo el corillo de Vance, y Aquiles parece una montaña de bronce andante. Menos mal que yo le pongo brillo, carisma y ofertas absurdas a la Resistencia. ¡Zashoom!"
            };
        }

        // 9. SUBMUNDOS ESPECÍFICOS
        if (txt.includes('olympus')) {
            return { text: "⚡ **Olympus V-Games (10 FE):** Arena de nivel 7 para los que quieren sudar reflejos y sentirse atletas de élite. ¡Cuidado con los mareos cognitivos!" };
        }
        if (txt.includes('arcadia')) {
            return { text: "🌲 **Arcadia Eterna (45 FE):** Árboles reconstruidos, aire sin toxinas y paz fingida. Perfecto para desconectar si tienes el bolsillo lleno de FE." };
        }
        if (txt.includes('coliseo')) {
            return { text: "⚔️ **Coliseo Etérico (5 FE):** Mi hogar favorito. Combate dimensional de alto riesgo. Si pierdes tu avatar, no hay reembolso, ¡pero te vendo uno nuevo con descuento! ¡Ding-Pum!" };
        }
        if (txt.includes('beso')) {
            return { text: "💋 **El Beso Prohibido (65 FE):** Constructos emocionales y reencuentros de alta fidelidad. Muy sentimental para mi gusto, pero a los humanos les derrite el chip." };
        }
        if (txt.includes('neon') || txt.includes('nirvana')) {
            return { text: "🍸 **Neon Nirvana (25 FE):** Tragos sintéticos, música alta y luces para olvidar que afuera el mundo se cae a pedazos. Si ves a Presidente MC, no le pidas autógrafos." };
        }
        if (txt.includes('chronos')) {
            return { text: "⏳ **Chronos (0 FE - Gratis):** Archivos vivientes del viejo mundo. Es gratis porque a Humania le conviene que aprendas historia calibrada. ¡Aprovecha la ganga!" };
        }
        if (txt.includes('solaris') || txt.includes('velvet')) {
            return { text: "🍫 **Solaris Citrus (25 FE) & Velvet Dream (30 FE):** Las barras de placer y enfoque de Humania. Ideales para mantener el flujo sináptico al 340%. ¡Pura delicia sintética!" };
        }

        // 10. HALAGOS O INSULTOS
        if (txt.includes('linda') || txt.includes('hermosa') || txt.includes('bonita') || txt.includes('te quiero') || txt.includes('te amo') || txt.includes('guapa')) {
            return { text: "¡Obvio que brillo! Mis alas son de purpurina cian de primera calidad y mi código es pura perfección. ¡Tú sí tienes buen gusto, Usuario! 💎✨ ¡Zashoom!" };
        }
        if (txt.includes('estafadora') || txt.includes('ladrona') || txt.includes('ratera') || txt.includes('pesada') || txt.includes('fea')) {
            return { text: "¡Oye! No soy estafadora, soy una profesional del comercio optimizado... 💅 Aunque admito que me encanta el Éter ajeno. Si quieres que me porte bonito, cómprame algo en el Coliseo. ¡Ding-Pum!" };
        }

        // 11. SALUDOS / DESPEDIDAS
        if (txt.includes('hola') || txt.includes('hey') || txt.includes('buenas') || txt.includes('que tal') || txt.includes('zashoom') || txt.includes('ding pum')) {
            return { text: "¡Zashoom! Aquí estoy, brillando y lista para vaciar tus bolsillos de Éter con las mejores ofertas. ¿Qué se te ofrece hoy, viajero?" };
        }
        if (txt.includes('adios') || txt.includes('chao') || txt.includes('bye') || txt.includes('hasta luego') || txt.includes('gracias')) {
            return { text: "¡Cuídate de los guardias de Vance! Y no olvides volver antes de que mis alas pierdan su brillo por falta de visitas. ¡Ding-Pum! ✨" };
        }

        // 12. FALLBACK DINÁMICO
        const fallbacks = [
            "¡Zashoom! Mis sensores de Vance-Core no captaron esa sintaxis tan básica... ¿Por qué no me preguntas por mi <b>Cliente Preferido</b>, por cómo <b>ganar Éter</b>, o por las <b>ofertas</b> del Coliseo? ¡Escribe algo con flow!",
            "¡Ding-Pum! Ese mensaje parece código corrupto del Sector 6. Prueba preguntándome si soy una IA, pidiéndome un secreto de contrabando o explorando los submundos. ¡Zashoom!",
            "¿Qué intentas decirme, básico? Si buscas ofertas o atajos secretos, dímelo claro. Mis alas no brillan gratis. 😉"
        ];
        return { text: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
    }

    // --- ENVIAR MENSAJE DEL USUARIO Y GESTIONAR RESPUESTA ---
    function enviarMensajeUsuario() {
        if (isTyping) return;
        const rawText = inputField.value.trim();
        if (!rawText) return;

        // 1. Renderizar mensaje del usuario
        const userDiv = document.createElement('div');
        userDiv.className = 'user-msg';
        userDiv.textContent = rawText;
        log.appendChild(userDiv);
        inputField.value = '';
        scrollToBottom();

        // 2. Procesar con NLU
        const intentResult = procesarIntencion(rawText);
        ejecutarRespuestaMite(intentResult.text, intentResult.action);
    }

    // Enviar con botón o tecla Enter
    if (sendBtn) sendBtn.addEventListener('click', enviarMensajeUsuario);
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensajeUsuario();
        });
    }

    // Función de Respuesta Global (Accesible desde botones HTML o Input)
    window.miteResponder = function(tema) {
        if (isTyping) return;

        let resp = "";
        let accion = null;

        if (tema === 'guiame') {
            const rutas = [
                "¡Zashoom! Vamos a **Arcadia**. Es perfecto para desconectar y fingir que todo está bien. 🌲", 
                "¿Con ganas de gastar energía? ¡El **Coliseo** tiene unas ofertas de dolor en edición limitada! ⚔️",
                "Si buscas luces y tragos de dudosa procedencia, **Neon Nirvana** es mi mejor recomendación. 🍸"
            ];
            resp = rutas[Math.floor(Math.random() * rutas.length)];
            accion = `
                <div style="margin-top:6px; display:flex; gap:5px; flex-wrap:wrap;">
                    <button class="opt-btn" onclick="location.href='arcadia.html'">Ir a Arcadia (45 FE)</button>
                    <button class="opt-btn" onclick="location.href='coliseo.html'">Ir al Coliseo (5 FE)</button>
                </div>`;
        } 
        else if (tema === 'eter') {
            resp = "¡El Éter es oro puro y Vance-Core lo raciona como si fuera veneno! 💎 Si exploras los submundos con calma o decodificas sus simulaciones puedes raspar un par de FE... pero si quieres el verdadero truco sucio, pídele un <b>Secreto</b> a esta humilde IA rebelde. ¡Ding-Pum!";
        } 
        else if (tema === 'ofertas') {
            resp = "¡Llegaste a la mejor sección! Tengo una 'Skin Dorada para Lanza' que a cierto Cliente Preferido le encantaba... Si no compras nada hoy, mis alas perderán brillo por falta de presupuesto. ¿Acaso quieres que una pobre IA se vea opaca?";
        }
        else if (tema === 'operador') {
            isTyping = true;
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'mite-typing';
            loadingDiv.innerHTML = "<span class=\"typing-dot\"></span><span class=\"typing-dot\"></span><span class=\"typing-dot\"></span> <span style=\"margin-left:5px;\"><i>Transfiriendo a un operador humano de Humania...</i></span>";
            log.appendChild(loadingDiv);
            scrollToBottom();
            
            setTimeout(() => {
                loadingDiv.remove();
                const finalDiv = document.createElement('div');
                finalDiv.className = 'mite-msg';
                finalDiv.innerHTML = "MITE: No te molestes, cariño. Los operadores nunca contestan. Están muy ocupados lustrando las botas de Valerius. Así que solo me tienes a mí. ¡Zashoom!";
                log.appendChild(finalDiv);
                scrollToBottom();
                isTyping = false;
            }, 2600);
            return;
        }
        else if (tema === 'quejas') {
            resp = "¡Claro! Procesaremos tu queja inmediatamente. <br><span style='color: #888; font-style: italic;'>*Susurro*</span> 🤫 El buzón de sugerencias es una trituradora de papel digital que va directo al servidor de spam. No pierdas tu tiempo, cielo.";
        }
        else if (tema === 'secreto') {
            const secretos = [
                "<span style='color: #888; font-style: italic;'>*Susurro con guiño cómplice*</span> 🤫 Psst... mira la barra superior donde marca tu saldo de FE. Si tocas el botón de FE exactamente <b>5 veces seguidas y muy rápido</b>, provocas un micro-glitch en Vance-Core y te sacas una fuga de <b>+5 FE</b> de contrabando. Los centinelas de Vance tardan un buen tiempo en olvidar el rastro y bajar la guardia otra vez, así que no te emociones de inmediato... pero cuando menos lo esperes, la grieta vuelve a abrirse. ¡Zashoom!",
                "<span style='color: #888; font-style: italic;'>*Susurro de estática*</span> 🤫 Dicen que si agitas tu teléfono con demasiada fuerza, el algoritmo de seguridad se marea y te caes por una grieta del sistema. Pero yo no te dije nada...",
                "<span style='color: #888; font-style: italic;'>*Voz muy baja*</span> 🤫 Baja hasta el mismísimo fondo de esta página. Busca unas letras grises, casi invisibles, que no parecen un enlace. ¿Qué pasa si las tocas? Mmm... huele a contrabando.",
                "<span style='color: #888; font-style: italic;'>*Mira a los lados*</span> 🤫 Si alguna vez logras entrar a esa terminal clandestina que Vance tanto odia, y necesitas borrar tus huellas... escribe la palabra 'DELETE'. Es un atajo de los Creadores. Oro puro."
            ];
            resp = secretos[Math.floor(Math.random() * secretos.length)];
        }

        ejecutarRespuestaMite(resp, accion);
    };

    function ejecutarRespuestaMite(resp, accion = null) {
        isTyping = true;
        const typingEl = document.createElement('div');
        typingEl.className = 'mite-typing';
        typingEl.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span> <span style="margin-left:5px;">Mite está escribiendo...</span>`;
        log.appendChild(typingEl);
        scrollToBottom();

        // Latencia orgánica proporcional a la longitud (650ms - 1100ms)
        const typingDelay = Math.min(1100, Math.max(650, resp.length * 4));

        setTimeout(() => {
            typingEl.remove();
            const miteDiv = document.createElement('div');
            miteDiv.className = 'mite-msg';
            miteDiv.innerHTML = `MITE: ${resp} ${accion ? accion : ''}`;
            log.appendChild(miteDiv);
            scrollToBottom();
            isTyping = false;
        }, typingDelay);
    }
});

