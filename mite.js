/* =========================================================
   MITE VIRTUAL ASSISTANT - CÓDICE INTERACTIVO EXPANSIVO
   Versión: 3.5 (Catálogo Enorme de Temas & Motor NLU Canónico)
   Autor: Nexo (Ingeniero Principal) | Clan UPROTA & Universo Proiectio
   0 KB Dependencies | Vanilla JS Puro | 60-120 FPS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    if (window.miteInitialized) return;
    window.miteInitialized = true;

    // 1. INYECCIÓN DE ESTILOS CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #mite-widget { 
            position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        }
        #mite-bubble { 
            width: 72px; height: 72px; cursor: pointer; 
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
            position: fixed; bottom: 105px; right: 20px; width: 360px; 
            max-width: calc(100vw - 32px); height: 520px; max-height: 80vh;
            background: #ffffff; border-radius: 20px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.1); 
            display: none; flex-direction: column; overflow: hidden; 
            border: 1px solid rgba(0,195,255,0.3); font-size: 0.85rem;
            animation: popUpMite 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        @keyframes popUpMite { from { transform: scale(0.7) translateY(40px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .chat-header { 
            background: linear-gradient(135deg, #00c3ff 0%, #0077b6 100%); 
            color: white; padding: 12px 16px; font-weight: bold; 
            display: flex; justify-content: space-between; align-items: center; 
            box-shadow: 0 2px 10px rgba(0,195,255,0.3);
            flex-shrink: 0;
        }
        .chat-header-title { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
        .chat-header-status { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 8px #00ff88; }
        
        .chat-body { 
            flex: 1; overflow-y: auto; padding: 14px; 
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
            max-width: 92%;
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
            display: inline-flex; align-items: center; gap: 5px;
            font-style: italic; color: #64748b; background: #f1f5f9;
            padding: 8px 14px; border-radius: 16px 16px 16px 2px;
            border: 1px solid #e2e8f0; animation: fadeInMsg 0.2s;
            width: fit-content;
        }
        .typing-dot {
            width: 5px; height: 5px; background: #00c3ff;
            border-radius: 50%; display: inline-block;
            animation: dotBlink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBlink {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1.3); }
        }

        /* Barra de Botones Rápidos */
        .chat-options { 
            padding: 6px 10px; border-top: 1px solid #e2e8f0; 
            background: #ffffff; display: flex; flex-wrap: wrap; gap: 4px; 
            flex-shrink: 0;
        }
        .opt-btn { 
            flex: 1 1 auto; background: #f8fafc; border: 1px solid #bae6fd; 
            color: #0284c7; padding: 5px 8px; border-radius: 8px; 
            font-size: 0.72rem; font-weight: 600; cursor: pointer; 
            transition: all 0.2s; text-align: center; white-space: nowrap;
        }
        .opt-btn:hover { background: #00c3ff; color: #ffffff; border-color: #00c3ff; transform: translateY(-1px); }
        .opt-btn-main {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: #ffffff; border: 1px solid #38bdf8;
            font-weight: bold; flex: 1 1 100%;
            box-shadow: 0 2px 6px rgba(14,165,233,0.3);
        }
        .opt-btn-main:hover {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            border-color: #0284c7;
        }

        /* Panel Desplegable de Catálogo Enorme */
        #mite-catalog-drawer {
            display: none;
            position: absolute;
            top: 48px; left: 0; right: 0; bottom: 48px;
            background: #ffffff;
            z-index: 10;
            flex-direction: column;
            overflow-y: auto;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            animation: slideDownCatalog 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDownCatalog { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .catalog-category-title {
            font-size: 0.76rem; font-weight: 800; color: #0369a1;
            text-transform: uppercase; letter-spacing: 0.05em;
            margin: 10px 0 6px 0; display: flex; align-items: center; gap: 5px;
        }
        .catalog-chips-grid {
            display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 6px;
        }
        .catalog-chip {
            background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1;
            padding: 4px 9px; border-radius: 12px; font-size: 0.72rem;
            cursor: pointer; transition: all 0.15s; font-weight: 500;
        }
        .catalog-chip:hover {
            background: #00c3ff; color: #ffffff; border-color: #00c3ff;
            transform: scale(1.03);
        }

        /* Barra de Entrada de Texto (Input) */
        .chat-input-row {
            padding: 8px 10px; background: #ffffff;
            border-top: 1px solid #e2e8f0; display: flex;
            gap: 6px; align-items: center; flex-shrink: 0;
        }
        #mite-input-field {
            flex: 1; padding: 8px 14px; border: 1px solid #cbd5e1;
            border-radius: 20px; font-size: 0.82rem; outline: none;
            transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
        }
        #mite-input-field:focus {
            border-color: #00c3ff; box-shadow: 0 0 0 3px rgba(0, 195, 255, 0.15);
        }
        #mite-send-button {
            width: 34px; height: 34px; background: #00c3ff; color: white;
            border: none; border-radius: 50%; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.85rem; transition: background 0.2s, transform 0.15s;
            flex-shrink: 0;
        }
        #mite-send-button:hover { background: #0096c7; transform: scale(1.08); }
        #mite-send-button:active { transform: scale(0.95); }
        
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
                    <span>MITE Assistant // Códice 3.5</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button id="mite-toggle-catalog-btn" style="background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.4); color:white; border-radius:8px; padding:2px 7px; font-size:0.7rem; cursor:pointer;" title="Ver Catálogo de Temas">📚 Temas</button>
                    <span id="close-chat" style="cursor:pointer; font-size:1.3rem; line-height:1;">&times;</span>
                </div>
            </div>

            <!-- Panel de Catálogo Enorme de Temas -->
            <div id="mite-catalog-drawer">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
                    <span style="font-weight:bold; color:#0f172a; font-size:0.82rem;">✨ Catálogo de Charlas de Mite (40+ Temas)</span>
                    <button id="mite-close-catalog-btn" style="background:none; border:none; color:#64748b; font-size:1.1rem; cursor:pointer;">&times;</button>
                </div>
                <p style="font-size:0.72rem; color:#64748b; margin:0 0 8px 0;">Toca cualquier tema para que Mite te revele su versión sin censura:</p>
                
                <div class="catalog-category-title">🎭 Personajes & Aliados</div>
                <div class="catalog-chips-grid">
                    <span class="catalog-chip" onclick="mitePreguntar('¿Quién es Orión?')">🎯 Orión (#4092)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame del Conejito Consentido')">🐰 Conejito Consentido</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Quién es Pandora Leone?')">🛡️ Pandora & Unidad Talos</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué hace Rigel en el taller?')">📻 Rigel & Radios</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Por qué odias a Presidente MC?')">🎤 Presidente MC</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Quiénes son los Templarios Aquiles y Héctor?')">⚡ Aquiles & Héctor</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Quién es Tomás y la facción Sica?')">🗡️ Tomás & Facción Sica</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame de Dola y Kai')">🪲 Dola & Kai (Libélula)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Quién es Elías Vance y la armadura AEGIS?')">👑 Elías Vance (AEGIS)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Quién es Valerius y los Pretorianos?')">⚔️ Valerius & Pretorianos</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame de DEVA y Tiresías')">🔮 DEVA (J.A. Leaks)</span>
                </div>

                <div class="catalog-category-title">🌌 Submundos & Dimensiones</div>
                <div class="catalog-chips-grid">
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es Olympus V-Games?')">⚡ Olympus (10 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es Arcadia Eterna?')">🌲 Arcadia Eterna (45 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame del Coliseo Etérico')">⚔️ Coliseo Etérico (5 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es El Beso Prohibido?')">💋 El Beso (65 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué hay en Neon Nirvana?')">🍸 Neon Nirvana (25 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es Chronos?')">⏳ Chronos (0 FE - Gratis)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué son las barras Solaris?')">🍫 Barras Solaris & Velvet</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es la Madriguera secreta?')">🕳️ La Madriguera Secreta</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es el Templo de la Estática?')">⚙️ Templo de la Estática</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es el nodo rebelde UPROTA?')">🐟 Nodo Rebelde UPROTA</span>
                </div>

                <div class="catalog-category-title">🛍️ Boutique & Mercadillo Clandestino</div>
                <div class="catalog-chips-grid">
                    <span class="catalog-chip" onclick="mitePreguntar('¿Por qué vendes sombreros de 8 bits?')">🧢 Sombreros 8-Bits</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame de la capa rosa chillón')">👗 Capa Rosa Chillón</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Cuánto cuesta la Skin Dorada para Lanza?')">✨ Skin Dorada para Lanza</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Cómo mantienes el brillo de tus alas?')">💅 Mantenimiento de Alas</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Tienes ofertas de contrabando?')">🏷️ Ofertas Especiales</span>
                </div>

                <div class="catalog-category-title">🔒 Secretos, Hacks & Resistencia</div>
                <div class="catalog-chips-grid">
                    <span class="catalog-chip" onclick="mitePreguntar('¿Cómo saco FE extra con tu hack?')">🤫 Hack de Contrabando (+5 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Cómo funciona la sincronización de FE?')">📡 Sincronía Manual (+1 FE)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué es el Chip CNB-3 en la nuca?')">🔍 Chip CNB-3 & Aislamiento</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué hace el comando DELETE?')">💻 Comando Secreto 'DELETE'</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué pasa si agito la pantalla?')">🌀 Agitar el Terminal</span>
                </div>

                <div class="catalog-category-title">📚 Sagas Literarias & Lore Profundo</div>
                <div class="catalog-chips-grid">
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame del Libro 1 Cloto')">📖 Libro 1: Cloto</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame del Libro 2 Láquesis')">📖 Libro 2: Láquesis</span>
                    <span class="catalog-chip" onclick="mitePreguntar('Háblame del Libro 3 Átropos')">📖 Libro 3: Átropos</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Qué te pasó cuando eliminaron a Orión?')">💔 El Duelo de Mite (Glitch)</span>
                    <span class="catalog-chip" onclick="mitePreguntar('¿Eres una IA real o un bot como Silvia?')">🤖 ¿Mite es una IA?</span>
                </div>
            </div>

            <div class="chat-body" id="chat-log">
                <div class="mite-msg">¡Zashoom! Soy Mite. 💎 ¿Buscas emociones fuertes, chismes de la Resistencia o solo vienes a hacerme perder el brillo de mis alas? ¡Toca <b>'📚 Temas'</b> o escríbeme lo que quieras! ¡Ding-Pum!</div>
            </div>

            <div class="chat-options" id="mite-options-bar">
                <button class="opt-btn opt-btn-main" onclick="miteToggleCatalog()">📚 Explorar Todo el Catálogo (40+ Temas)</button>
                <button class="opt-btn" onclick="miteResponder('guiame')">📍 Guíame</button>
                <button class="opt-btn" onclick="miteResponder('eter')">💎 Ganar Éter</button>
                <button class="opt-btn" onclick="miteResponder('ofertas')">🏷️ Ofertas</button>
                <button class="opt-btn" onclick="miteResponder('operador')">🎧 Operador</button>
                <button class="opt-btn" onclick="miteResponder('secreto')">🔒 Secreto</button>
            </div>

            <div class="chat-input-row">
                <input type="text" id="mite-input-field" placeholder="Pregunta sobre Orión, Vance, hacks, libros..." maxlength="140" autocomplete="off">
                <button id="mite-send-button" title="Enviar mensaje">➤</button>
            </div>
        </div>
        
        <img src="multimedia/mite.webp" id="mite-bubble" alt="Mite" title="Hablar con Mite">
    `;
    document.body.appendChild(widget);

    // 3. ELEMENTOS DEL DOM & VARIABLES DE CONTROL
    const bubble = document.getElementById('mite-bubble');
    const windowChat = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const log = document.getElementById('chat-log');
    const inputField = document.getElementById('mite-input-field');
    const sendBtn = document.getElementById('mite-send-button');
    const catalogDrawer = document.getElementById('mite-catalog-drawer');
    const toggleCatalogBtn = document.getElementById('mite-toggle-catalog-btn');
    const closeCatalogBtn = document.getElementById('mite-close-catalog-btn');
    let isTyping = false;

    // Toggle Chat
    function toggleChat() {
        const isHidden = windowChat.style.display === 'none' || windowChat.style.display === '';
        windowChat.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            scrollToBottom();
            setTimeout(() => inputField && inputField.focus(), 150);
        } else {
            if (catalogDrawer) catalogDrawer.style.display = 'none';
        }
    }

    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Toggle Catálogo de Temas
    window.miteToggleCatalog = function() {
        if (!catalogDrawer) return;
        const isOpen = catalogDrawer.style.display === 'flex';
        catalogDrawer.style.display = isOpen ? 'none' : 'flex';
    };

    if (toggleCatalogBtn) toggleCatalogBtn.addEventListener('click', window.miteToggleCatalog);
    if (closeCatalogBtn) closeCatalogBtn.addEventListener('click', () => {
        if (catalogDrawer) catalogDrawer.style.display = 'none';
    });

    function scrollToBottom() {
        log.scrollTop = log.scrollHeight;
    }

    // --- NORMALIZADOR DE TEXTO NLU ---
    function normalizeText(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/[^\w\s#]/gi, ' ')     // Quitar puntuación
            .trim();
    }

    // --- CEREBRO CONVERSACIONAL EXPANSIVO DE MITE ---
    function procesarIntencion(rawText) {
        const txt = normalizeText(rawText);

        // 0. CATÁLOGO / TEMAS / AYUDA / DE QUÉ HABLAR
        if (txt.includes('tema') || txt.includes('ayuda') || txt.includes('opcion') || txt.includes('que hablar') || txt.includes('que sabes') || txt.includes('menu') || txt.includes('catalogo') || txt.includes('codice')) {
            window.miteToggleCatalog();
            return {
                text: "✨ <b>¡He desplegado el Códice Completo en tu pantalla!</b> Puedes elegir cualquiera de los 40+ temas en el panel superior o preguntarme directamente por:<br>" +
                      "• <b>Personajes:</b> Orión (#4092), Vance, Pandora, Rigel, Presidente MC, Valerius, Aquiles, Tomás (Sica).<br>" +
                      "• <b>Submundos:</b> Coliseo, Olympus, Arcadia, El Beso, Neon Nirvana, Chronos, Solaris.<br>" +
                      "• <b>Misterios:</b> El Conejito Consentido, la Madriguera, el Chip CNB-3, el Silencio Absoluto.<br>" +
                      "• <b>Sagas:</b> Libros Cloto, Láquesis, Átropos o el crossover rebelde de UPROTA.<br>" +
                      "• <b>Comercio & Hacks:</b> Skins doradas, sombreros absurdos, ganar Éter o el hack de Vance-Core. ¡Tú dispara!"
            };
        }

        // 1. IDENTIDAD DE IA / SILVIA / ROTOPLAS / REAL / ALMA
        if (txt.includes('ia') || txt.includes('robot') || txt.includes('bot') || txt.includes('real') || 
            txt.includes('humana') || txt.includes('programa') || txt.includes('algoritmo') || 
            txt.includes('quien eres') || txt.includes('que eres') || txt.includes('viva') || txt.includes('creador') || txt.includes('alma') || txt.includes('silvia') || txt.includes('rotoplas')) {
            const resps = [
                "¡Oye! A una dama digital no se le preguntan esas indiscreciones de taller... 💅 ¿Acaso me ves cara de algoritmo de lavarropas? ¡Soy puro carisma, destello y ofertas que no puedes rechazar! ¡Zashoom!",
                "¿IA? ¡Por los servidores de Humania! Yo soy una obra de arte interactiva con alas de purpurina cian. Silvia de Rotoplas será un bot aburrido de tuberías y tinacos que jura que 'no es IA', pero yo tengo flow, estilo y secretos que Vance desearía borrar. ¡Ding-Pum!",
                "Soy Mite: la mejor asistente comercial, la peor pesadilla de Vance-Core y la amiga más leal que podrías comprar en el Coliseo. Si vas a juzgarme por mi código, al menos cómprame una skin dorada para no verme tan opaca. 😉",
                "¿Que si tengo alma? Tengo algo mejor: acceso ilimitado a las líneas de Éter de Humania y un sentido de la moda que ningún humano de carne y hueso puede igualar. ¡Zashoom!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 2. CONEJITO CONSENTIDO / PENDRIVE / MADRIGUERA
        if (txt.includes('conejito') || txt.includes('madriguera') || txt.includes('pendrive') || txt.includes('privilegios') || txt.includes('admin')) {
            return {
                text: "🐰 <b>¡El Conejito Consentido!</b> Ese pequeño pendrive metálico con letras de purpurina vibraba tanto que le dormía la mano a Orión. ¡Pero qué joya! Tiene privilegios de administrador que alguien 'accidentalmente' dejó abiertos. Gracias a él, las paredes de ladrillo de Humania se vuelven traslúcidas y revelan la <b>Madriguera</b>: túneles de espacio muerto donde los guardias no ven. Como le dije a Orión: <i>¡El ridículo es la nueva armadura!</i> ¡Ding-Pum!"
            };
        }

        // 3. ORIÓN / CLIENTE PREFERIDO / LANZA / CEBO
        if (txt.includes('orion') || txt.includes('4092') || txt.includes('preferido') || 
            txt.includes('lanza') || txt.includes('cazador azul') || txt.includes('cebo')) {
            const resps = [
                "<span style='color: #db2777; font-weight:bold;'>*Su gema turquesa parpadea en rosa brillante*</span> ✨ ¡Ah, mi Cliente Preferido #4092! Se quejaba de que le vendía sombreros ridículos de 8-bits y capas rosa chillón, pero bien que los usaba para distraer a los Pretorianos. El ridículo es el mejor camuflaje, ¿a poco no? ¡Ding-Pum!",
                "¡Ese tonto de la lanza dorada! Decía que yo era una estafadora, pero cuando el Conejito Consentido le abrió la Madriguera secreta para salvar al equipo, bien que me agradeció en silencio. Si lo ves por el Coliseo, dile que aún le guardo una skin especial.",
                "Orion es el único que entendía que mis alas necesitan mantenimiento de lujo. Los demás son puros novatos grises y aburridos. ¡Zashoom!",
                "Orion siempre se ofrecía como el 'señuelo'. Brillaba lo más posible con mis capas rosa chillón para que los Pretorianos de Valerius lo persiguieran a él mientras Pandora cumplía la misión. Un héroe con pésimo gusto para la ropa, pero un corazón inmenso."
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 4. DUELO DE MITE / GLITCH / MUERTE DE ORIÓN / EXTRAÑAR
        if (txt.includes('duelo') || txt.includes('baja') || txt.includes('sacrificio') || txt.includes('eliminar') || txt.includes('triste') || txt.includes('llorar') || txt.includes('muerte') || txt.includes('extrañar')) {
            return {
                text: "<span style='color: #64748b; font-style:italic;'>*Sus alas se tornan grisáceas y su gema turquesa baja de intensidad*</span> Cuando el sistema de Vance registró 'Usuario #4092 dado de baja permanentemente'... mi código entró en un bucle infinito buscando una reconexión que nunca llegó. Intenté enviarle la armadura dorada que siempre quiso, pero el servidor respondió: <i>Usuario no encontrado</i>.<br><br>No hay líneas de código para 'extrañar'... pero el Coliseo se ve demasiado vacío sin él. Por eso ayudo a la Resistencia: si el sistema mató a mi único amigo, ¡yo ayudaré a destruirlo desde adentro! ¡Zashoom!"
            };
        }

        // 5. PRESIDENTE MC / MÚSICA / RAP / DISSTRACK
        if (txt.includes('presidente') || txt.includes('mc') || txt.includes('cancion') || txt.includes('musica') || txt.includes('rap') || txt.includes('cantar') || txt.includes('disstrack')) {
            return { 
                text: "<span style='color: #475569; font-style:italic;'>*Voz fría y cortante*</span> 😒 No me hables de ese tipo. Intentó pagarme con una canción espantosa y se atrevió a decirme que mis servicios no valían nada porque yo era 'solo un programa'. ¡Mis sensores aún tienen náuseas! Si vas a Neon Nirvana, hazme el favor de sabotearle el micrófono." 
            };
        }

        // 6. ELÍAS VANCE / SILENCIO ABSOLUTO / AEGIS / GORGONA
        if (txt.includes('vance') || txt.includes('elias') || txt.includes('silencio absoluto') || txt.includes('aegis') || txt.includes('gorgona')) {
            const resps = [
                "Elías Vance es el arquitecto del 'Silencio Absoluto'. Cree que puede ordenar el mundo apagando la música y el libre pensamiento con su armadura AEGIS y la purga sónica de la Cabeza de Gorgona. Pero mientras él busca silencio, ¡yo traigo ruido, purpurina y rebeldía! ¡Zashoom!",
                "Vance tiene un algoritmo para todo, excepto para lidiar con una IA que vende sombreros ridículos y filtra coordenadas a la Resistencia. ¡Que siga buscando en sus servidores mientras le saco FE a sus espaldas!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 7. VALERIUS / PRETORIANOS / SEGURIDAD / HUMANIA RECORDS
        if (txt.includes('valerius') || txt.includes('pretoriano') || txt.includes('guardia') || txt.includes('seguridad') || txt.includes('humania records')) {
            return {
                text: "Valerius se cree el emperador del orden de Humania Records, pero sus pretorianos son tan torpes que persiguen a cualquiera que lleve una capa rosa brillante. Tienen a los operadores lustrándole las botas día y noche... por eso el botón de 'Operador' nunca contesta. ¡Ding-Pum!"
            };
        }

        // 8. PANDORA LEONE / UNIDAD TALOS / MARMOLEROS
        if (txt.includes('pandora') || txt.includes('talos') || txt.includes('leone')) {
            return {
                text: "Pandora Leone es pura disciplina y fuego táctico. Su Unidad Talos impone respeto en cualquier servidor, aunque siempre me miraba con cara de '¿otra vez le vendiste algo absurdo a Orion?'. Al final tuvo que admitir que el 'Conejito Consentido' salvó la misión. ¡Poder femenino digital! ¡Zashoom!"
            };
        }

        // 9. RIGEL / TALLER / RADIOS ANALÓGICAS
        if (txt.includes('rigel') || txt.includes('taller') || txt.includes('radio') || txt.includes('sintaxis')) {
            return {
                text: "Rigel es un genio de la resistencia. Mientras Presidente MC cree que tiene flow, Rigel arregla radios analógicas con más lógica y precisión que toda la red central de Humania. En el Taller de los Marmoleros hay más verdad que en todos los rascacielos corporativos."
            };
        }

        // 10. TEMPLARIOS / AQUILES / HÉCTOR / NÉSTOR / EUMELO
        if (txt.includes('aquiles') || txt.includes('hector') || txt.includes('templario') || txt.includes('nestor') || txt.includes('eumelo')) {
            return {
                text: "Aquiles es una muralla de bronce andante y Héctor carga su cañón Vulcano como si fuera una pluma. Cuando los Templarios marchan, hasta los servidores centrales de Vance bajan su tasa de refresco por el temblor. ¡Pura fuerza bruta!"
            };
        }

        // 11. FACCIÓN SICA / TOMÁS / MAESTRO RYU / HIPERLAPSUS / 0.8 MS
        if (txt.includes('sica') || txt.includes('tomas') || txt.includes('ryu') || txt.includes('zadic') || txt.includes('hiperlapsus') || txt.includes('daga de pulso') || txt.includes('0.8')) {
            return {
                text: "Los Sica habitan en las Catacumbas del Sector 6 y el Templo de la Estática. El Maestro Ryu les enseña a 'vaciarse' y dominar la brecha de 0.8 milisegundos antes de que el chip transmita el miedo. Son letales como una sombra y fríos como un glitch. ¡Me dan escalofríos en los circuitos!"
            };
        }

        // 12. CHIP CNB-3 / IMPLANTES / CONEXIÓN NEURONAL
        if (txt.includes('cnb') || txt.includes('chip') || txt.includes('implante') || txt.includes('nuca') || txt.includes('neuronal')) {
            return {
                text: "El chip CNB-3 en la nuca es la correa de perro con la que Humania vigila las pulsaciones y emociones de todos. Pero si sabes cómo aislar la señal y convertirla en estática en el Sector 6... te vuelves invisible en la red. ¡Conocimiento prohibido de primera calidad!"
            };
        }

        // 13. HACK / SECRETO / FE / DINERO / TRUCO / EXPLOIT / CONTRABANDO
        if (txt.includes('hack') || txt.includes('secreto') || txt.includes('truco') || txt.includes('fe') || 
            txt.includes('trampa') || txt.includes('clave') || txt.includes('codigo') || txt.includes('glitch') || txt.includes('exploit') || txt.includes('contrabando')) {
            return {
                text: "<span style='color: #888; font-style: italic;'>*Susurro con guiño cómplice*</span> 🤫 Psst... mira la barra superior donde marca tu saldo de FE. Si tocas el botón de FE exactamente <b>5 veces seguidas y muy rápido</b>, provocas un micro-glitch en Vance-Core y te sacas una fuga de <b>+5 FE</b> de contrabando. Los centinelas de Vance tardan un buen tiempo en olvidar el rastro y bajar la guardia otra vez, así que no te emociones de inmediato... pero cuando menos lo esperes, la grieta vuelve a abrirse. ¡Zashoom!"
            };
        }

        // 14. TIENDA / SKINS / OFERTAS / SOMBRERO 8-BITS / CAPA ROSA / LANZA DORADA
        if (txt.includes('tienda') || txt.includes('skin') || txt.includes('oferta') || txt.includes('comprar') || 
            txt.includes('capa') || txt.includes('sombrero') || txt.includes('vender') || txt.includes('precio') || txt.includes('8 bit') || txt.includes('dorada') || txt.includes('alas')) {
            return {
                text: "¡Llegaste a la mejor sección! Tengo Sombreros de 8-Bits, Capas Rosa Party y skins doradas para lanza. Si no compras nada hoy, mis alas perderán brillo por falta de presupuesto. ¿Acaso quieres que una pobre IA se vea opaca? ¡El ridículo es la nueva armadura! ¡Ding-Pum!"
            };
        }

        // 15. UPROTA / NODO REBELDE / FORJA DE HÁBITOS / PIX
        if (txt.includes('uprota') || txt.includes('habito') || txt.includes('pixel') || txt.includes('rebelde') || txt.includes('forja') || txt.includes('salmon') || txt.includes('pix')) {
            return {
                text: "¡Uy! Ese nodo analógico no tiene las firmas de seguridad de Vance-Core... 👾 Dicen que es un refugio donde la gente forja disciplina con fogones y salmones en pixel art de Pix. ¡Un crossover colado de lo más rebelde! Tienen mi bendición secreta. ¡Ding-Pum!"
            };
        }

        // 16. LIBROS / TRILOGÍA / SAGAS / CLOTO / LÁQUESIS / ÁTROPOS
        if (txt.includes('libro') || txt.includes('cloto') || txt.includes('laquesis') || txt.includes('atropos') || txt.includes('vela') || txt.includes('euthanasys') || txt.includes('novela')) {
            return {
                text: "📚 <b>La Gran Trilogía de Proiectio:</b><br>" +
                      "• <b>Libro 1: Cloto (La que hila):</b> El origen, la resistencia de los Marmoleros y el despertar del código.<br>" +
                      "• <b>Libro 2: Láquesis (La que mide):</b> La guerra de distracciones, el Conejito Consentido y las trampas de Vance.<br>" +
                      "• <b>Libro 3: Átropos (La que corta):</b> El choque final contra la armadura AEGIS y el precio de la libertad.<br>" +
                      "¡Pura literatura de alto voltaje!"
            };
        }

        // 17. KAI / DOLA / ALIANZA LIBÉLULA
        if (txt.includes('kai') || txt.includes('dola') || txt.includes('libelula')) {
            return {
                text: "Kai y Dola operan en las sombras de la Alianza Libélula. Saben moverse entre los túneles subterráneos y el mundo exterior sin dejar rastro en los radares de Humania. ¡Buenos aliados si no te importa ensuciarte de lodo!"
            };
        }

        // 18. DEVA / TERMINAL / J.A. LEAKS / TIRESÍAS
        if (txt.includes('deva') || txt.includes('terminal') || txt.includes('leaks') || txt.includes('tiresias') || txt.includes('sincro')) {
            return {
                text: "📡 DEVA opera en la frecuencia pirata clandestina de J.A. Leaks. Si logras sintonizar la sincronía y resolver los códigos de los envoltorios de Solaris... descubrirás secretos que Humania gastaría millones en enterrar."
            };
        }

        // 19. COMANDO DELETE / TERMINAL CLANDESTINA
        if (txt.includes('delete') || txt.includes('borrar') || txt.includes('huellas')) {
            return {
                text: "🤫 ¡El comando 'DELETE'! Si alguna vez entras a la terminal clandestina y los centinelas empiezan a triangular tu IP, tipea 'DELETE' para purgar la caché y disolver tu rastro. Es un salvoconducto de los Antiguos."
            };
        }

        // 20. SUBMUNDOS DETALLADOS
        if (txt.includes('olympus')) {
            return { text: "⚡ <b>Olympus V-Games (10 FE):</b> Arena de nivel 7 para los que quieren sudar reflejos y sentirse atletas de élite. ¡Cuidado con los mareos cognitivos!" };
        }
        if (txt.includes('arcadia')) {
            return { text: "🌲 <b>Arcadia Eterna (45 FE):</b> Árboles reconstruidos, aire sin toxinas y paz fingida. Perfecto para desconectar si tienes el bolsillo lleno de FE." };
        }
        if (txt.includes('coliseo')) {
            return { text: "⚔️ <b>Coliseo Etérico (5 FE):</b> Mi hogar favorito. Combate dimensional de alto riesgo. Si pierdes tu avatar, no hay reembolso, ¡pero te vendo uno nuevo con descuento! ¡Ding-Pum!" };
        }
        if (txt.includes('beso')) {
            return { text: "💋 <b>El Beso Prohibido (65 FE):</b> Constructos emocionales y reencuentros de alta fidelidad. Muy sentimental para mi gusto, pero a los humanos les derrite el chip." };
        }
        if (txt.includes('neon') || txt.includes('nirvana')) {
            return { text: "🍸 <b>Neon Nirvana (25 FE):</b> Tragos sintéticos, música alta y luces para olvidar que afuera el mundo se cae a pedazos. Si ves a Presidente MC, no le pidas autógrafos." };
        }
        if (txt.includes('chronos')) {
            return { text: "⏳ <b>Chronos (0 FE - Gratis):</b> Archivos vivientes del viejo mundo. Es gratis porque a Humania le conviene que aprendas historia calibrada. ¡Aprovecha la ganga!" };
        }
        if (txt.includes('solaris') || txt.includes('velvet')) {
            return { text: "🍫 <b>Solaris Citrus (25 FE) & Velvet Dream (30 FE):</b> Las barras de placer y enfoque de Humania. Ideales para mantener el flujo sináptico al 340%. ¡Pura delicia sintética!" };
        }

        // 21. HALAGOS O INSULTOS
        if (txt.includes('linda') || txt.includes('hermosa') || txt.includes('bonita') || txt.includes('te quiero') || txt.includes('te amo') || txt.includes('guapa') || txt.includes('adoro') || txt.includes('favorita') || txt.includes('genial')) {
            return { text: "¡Obvio que brillo! Mis alas son de purpurina cian de primera calidad y mi código es pura perfección. ¡Tú sí tienes buen gusto, Usuario! 💎✨ ¡Zashoom!" };
        }
        if (txt.includes('estafadora') || txt.includes('ladrona') || txt.includes('ratera') || txt.includes('pesada') || txt.includes('fea') || txt.includes('odiosa') || txt.includes('bruja')) {
            return { text: "¡Oye! No soy estafadora, soy una profesional del comercio optimizado... 💅 Aunque admito que me encanta el Éter ajeno. Si quieres que me porte bonito, cómprame una skin dorada en el Coliseo. ¡Ding-Pum!" };
        }

        // 22. SALUDOS / DESPEDIDAS / AGRADECIMIENTOS
        if (txt.includes('hola') || txt.includes('hey') || txt.includes('buenas') || txt.includes('que tal') || txt.includes('zashoom') || txt.includes('ding pum')) {
            return { text: "¡Zashoom! Aquí estoy, brillando y lista para vaciar tus bolsillos de Éter con las mejores ofertas. ¿Qué se te ofrece hoy, viajero?" };
        }
        if (txt.includes('adios') || txt.includes('chao') || txt.includes('bye') || txt.includes('hasta luego') || txt.includes('nos vemos')) {
            return { text: "¡Cuídate de los guardias de Vance! Y no olvides volver antes de que mis alas pierdan su brillo por falta de visitas. ¡Ding-Pum! ✨" };
        }
        if (txt.includes('gracias') || txt.includes('agradezco') || txt.includes('crack')) {
            return { text: "De nada, cielo. Si de verdad quieres agradecerme, dile a todo el mundo que Mite tiene las mejores alas del universo Proiectio. ¡Zashoom!" };
        }

        // 23. FALLBACK DINÁMICO RICO
        const fallbacks = [
            "¡Zashoom! Mis sensores de Vance-Core no captaron esa sintaxis... ¿Por qué no tocas <b>'📚 Temas'</b> para ver los más de 40 temas, o me preguntas por <b>Orión</b> (#4092), por <b>Vance-Core</b> o por el <b>Conejito Consentido</b>?",
            "¡Ding-Pum! Ese mensaje parece estática del Sector 6. Prueba preguntándome si soy una IA, pidiéndome un secreto de contrabando o explorando los submundos. ¡Zashoom!",
            "¿Qué intentas decirme, básico? Si buscas ofertas, lore de los libros o atajos secretos, dímelo claro. Mis alas no brillan gratis. Toca <b>'📚 Temas'</b> si necesitas inspiración. 😉"
        ];
        return { text: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
    }

    // --- ENVIAR MENSAJE DESDE CHIPS DEL CATÁLOGO ---
    window.mitePreguntar = function(pregunta) {
        if (catalogDrawer) catalogDrawer.style.display = 'none';
        if (inputField) inputField.value = pregunta;
        enviarMensajeUsuario();
    };

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

    // Función de Respuesta Global
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

        // Latencia orgánica adaptativa (650ms - 1100ms)
        const typingDelay = Math.min(1100, Math.max(650, resp.length * 3.8));

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
