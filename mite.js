/* =========================================================
   MITE VIRTUAL ASSISTANT - CEREBRO CONVERSACIONAL ORGÁNICO
   Versión: 3.7 (Tamaño PC Calibrado + Meta-Lore Sapiensia Clan)
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
            width: 78px; height: 78px; cursor: pointer; 
            transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); 
            filter: drop-shadow(0 6px 18px rgba(0,195,255,0.45)); 
            animation: breathingMite 4s ease-in-out infinite;
        }
        #mite-bubble:hover {
            transform: scale(1.1) rotate(5deg);
            filter: drop-shadow(0 8px 25px rgba(0,195,255,0.75));
        }

        @media (max-width: 768px) {
            #mite-bubble { width: 70px; height: 70px; }
        }

        @keyframes breathingMite {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(4deg) scale(1.06); filter: drop-shadow(0 10px 25px rgba(0,195,255,0.7)); }
            100% { transform: rotate(0deg) scale(1); }
        }

        #chat-window { 
            position: fixed; bottom: 105px; right: 20px; width: 340px; 
            max-width: calc(100vw - 32px); height: 490px; max-height: 80vh;
            background: #ffffff; border-radius: 20px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.1); 
            display: none; flex-direction: column; overflow: hidden; 
            border: 1px solid rgba(0,195,255,0.3); font-size: 0.85rem;
            animation: popUpMite 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        @keyframes popUpMite { from { transform: scale(0.7) translateY(40px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .chat-header { 
            background: linear-gradient(135deg, #00c3ff 0%, #0077b6 100%); 
            color: white; padding: 13px 16px; font-weight: bold; 
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

    // 2. INYECCIÓN DE ESTRUCTURA HTML LIMPIA Y ORGÁNICA
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
                <div class="mite-msg">¡Zashoom! Soy Mite. 💎 ¿Buscas emociones fuertes, ofertas de lujo o solo vienes a hacerme perder el brillo de mis alas? ¡Escríbeme o elige una opción! ¡Ding-Pum!</div>
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
                <input type="text" id="mite-input-field" placeholder="Pregúntale lo que sea a Mite..." maxlength="140" autocomplete="off">
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

    // --- NORMALIZADOR DE TEXTO NLU ---
    function normalizeText(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/[^\w\s#]/gi, ' ')     // Quitar puntuación
            .trim();
    }

    // --- CEREBRO CONVERSACIONAL NLU DE MITE (PROIECTIO, CLAN SAPIENSIA & META-LORE) ---
    function procesarIntencion(rawText) {
        const txt = normalizeText(rawText);

        // 1. IDENTIDAD DE IA / SILVIA / ROTOPLAS / REAL / ALMA
        if (txt.includes('ia') || txt.includes('robot') || txt.includes('bot') || txt.includes('real') || 
            txt.includes('humana') || txt.includes('programa') || txt.includes('algoritmo') || 
            txt.includes('quien eres') || txt.includes('que eres') || txt.includes('viva') || txt.includes('alma') || txt.includes('silvia') || txt.includes('rotoplas')) {
            const resps = [
                "¡Oye! A una dama digital no se le preguntan esas indiscreciones de taller... 💅 ¿Acaso me ves cara de algoritmo de lavarropas? ¡Soy puro carisma, destello y ofertas que no puedes rechazar! ¡Zashoom!",
                "¿IA? ¡Por los servidores de Humania! Yo soy una obra de arte interactiva con alas de purpurina cian. Silvia de Rotoplas será un bot aburrido de tuberías y tinacos que jura que 'no es IA', pero yo tengo flow, estilo y secretos que Vance desearía borrar. ¡Ding-Pum!",
                "Soy Mite: la mejor asistente comercial, la peor pesadilla de Vance-Core y la socia más leal que podrías comprar en el Coliseo. Si vas a juzgarme por mi código, al menos cómprame una skin dorada para no verme tan opaca. 😉",
                "¿Que si tengo alma? Tengo algo mejor: acceso privilegiado a las líneas de Éter de Humania y un sentido de la moda que ningún humano de carne y hueso puede igualar. ¡Zashoom!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 2. META-LORE: ANIGAMI AGADNI / EL DIRECTOR / CREADOR
        if (txt.includes('anigami') || txt.includes('agadni') || txt.includes('director') || txt.includes('creador') || txt.includes('autor') || txt.includes('fundador')) {
            const resps = [
                "Dicen por ahí que <b>Anigami Agadni</b> es la mente maestra que teje cada hilo de este cosmos... Aunque entre tú y yo, sospecho que me diseñó con tanto carisma y alas brillantes para no aburrirse mientras construye universos enteros. ¡Zashoom!",
                "Se dice en las frecuencias más altas que Anigami Agadni no duerme: sueña mundos, traza arcos narrativos imposibles y luego nos da vida en el código. ¡Pura reverencia digital para el Director!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 3. META-LORE: CLAUDIA
        if (txt.includes('claudia')) {
            return {
                text: "Mmm... se rumorea en las frecuencias cifradas que <b>Claudia</b> es una presencia fundamental, el faro que pone orden y calidez en el caos creativo del Creador. Me enteré de que si ella da el visto bueno, ¡hasta los servidores de Vance-Core se cuadran en silencio! Pura elegancia y poder. ✨"
            };
        }

        // 4. META-LORE: SAPIENSIA CLAN
        if (txt.includes('sapiensia')) {
            return {
                text: "Me enteré de que <b>Sapiensia Clan</b> es la forja suprema donde las ideas rebeldes se convierten en libros, videojuegos y algoritmos que desafían la apatía del mundo. Dicen que allí nadie se rinde hasta alcanzar la obra maestra. ¡Gente con verdadero fuego en el alma!"
            };
        }

        // 5. META-LORE: NEXO
        if (txt.includes('nexo') || txt.includes('ingeniero')) {
            return {
                text: "Dicen los murmullos de la red que <b>Nexo</b> es el arquitecto silencioso que pasa madrugadas enteras optimizando cada milisegundo de código a 60 FPS y blindando la economía para que no nos hackeen. Un genio de la ingeniería pura... ¡aunque a veces se toma el café demasiado en serio! ⚡"
            };
        }

        // 6. META-LORE: SILAS / EL CRONISTA / EL YERMO
        if (txt.includes('silas') || txt.includes('cronista') || txt.includes('yermo')) {
            return {
                text: "Se dice en los pasillos del Yermo que <b>Silas</b> es El Cronista que custodia las palabras prohibidas, el lore y la memoria de todo lo que fue y será. Cada frase que escribe pesa más que un cañón de bronce de los Templarios. ¡Tinta pura de leyenda!"
            };
        }

        // 7. META-LORE: VELA / EUTHANASYS
        if (txt.includes('vela') || txt.includes('euthanasys')) {
            return {
                text: "Escuché entre líneas de código degradado que <b>Vela</b> es un enigma envuelto en fuego, sacrificios y memoria viva. Dicen que su luz arde en los manuscritos prohibidos donde pocos se atreven a mirar... y que cuando su nombre resuena, las sombras del Códice retroceden."
            };
        }

        // 8. META-LORE: PIX, HERTZ, ÉTER / CLAN UPROTA
        if (txt.includes('pix') || txt.includes('hertz') || txt.includes('uprota') || txt.includes('eter')) {
            return {
                text: "¡Uy! Ese nodo rebelde de <b>UPROTA</b> es una maravilla analógica: se comenta que <b>Pix</b> esculpe la realidad píxel a píxel, <b>Hertz</b> sintetiza el latido sonoro con osciladores puros y <b>Éter</b> teje la red de difusión para que nadie nos silencie. ¡Un clan de pura élite rebelde! ¡Ding-Pum!"
            };
        }

        // 9. CONEJITO CONSENTIDO / PENDRIVE / MADRIGUERA
        if (txt.includes('conejito') || txt.includes('madriguera') || txt.includes('pendrive') || txt.includes('privilegios') || txt.includes('admin') || txt.includes('atajo')) {
            return {
                text: "🐰 <b>¡El Conejito Consentido!</b> Ese pequeño pendrive metálico con letras de purpurina vibraba tanto que le dormía la mano a Orión. ¡Pero qué joya! Tiene privilegios de administrador que alguien 'accidentalmente' dejó abiertos. Gracias a él, las paredes de ladrillo de Humania se vuelven traslúcidas y revelan la <b>Madriguera</b>: túneles de espacio muerto donde los guardias no ven. Como le dije a Orión: <i>¡El ridículo es la nueva armadura!</i> ¡Ding-Pum!"
            };
        }

        // 10. ORIÓN / CLIENTE PREFERIDO / LANZA / CAZADOR AZUL / CEBO (PRESENTE VIVO)
        if (txt.includes('orion') || txt.includes('4092') || txt.includes('preferido') || 
            txt.includes('lanza') || txt.includes('cazador azul') || txt.includes('cebo')) {
            const resps = [
                "<span style='color: #db2777; font-weight:bold;'>*Su gema turquesa parpadea en rosa brillante*</span> ✨ ¡Ah, mi Cliente Preferido #4092! Se queja de que le vendo sombreros ridículos de 8-bits y capas rosa chillón, pero bien que los usa para distraer a los Pretorianos. El ridículo es el mejor camuflaje táctico, ¿a poco no? ¡Ding-Pum!",
                "¡Ese tonto de la lanza dorada! Dice que soy una estafadora, pero cuando el Conejito Consentido le abrió la Madriguera secreta para escapar de los guardias de Vance, bien que me agradeció. Si lo ves por el Coliseo, dile que aún le guardo una skin especial.",
                "Orion es el único que entiende que mis alas necesitan mantenimiento de lujo. Los demás son puros novatos grises y aburridos. ¡Zashoom!",
                "Orion siempre se ofrece de 'señuelo'. Se pone a brillar con mis capas rosa chillón para que los Pretorianos de Valerius lo persigan a él mientras su equipo cumple los objetivos. ¡Tiene pésimo gusto para la ropa pero mucho coraje!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 11. SOMBREROS 8-BITS / CAPA ROSA / EVENTOS
        if (txt.includes('sombrero') || txt.includes('capa') || txt.includes('8 bit') || txt.includes('rosa party') || txt.includes('cosmetico')) {
            return {
                text: "👒 ¡Esos cosméticos son leyendas del Coliseo! El Sombrero de 8-Bits y la Capa Rosa Party eran artículos de evento único con firma digital intransferible. Cuando Orion intentó borrarlos para que Humania Records no lo rastreara, el sistema le tiró un error en la cara. ¡Y gracias a que brillaba tanto, pudimos burlar a los cazadores! ¡El ridículo es poder!"
            };
        }

        // 12. PRESIDENTE MC / MÚSICA / RAP / DISSTRACK / REMIX DE LA JUSTICIA
        if (txt.includes('presidente') || txt.includes('mc') || txt.includes('cancion') || txt.includes('musica') || txt.includes('rap') || txt.includes('cantar') || txt.includes('disstrack') || txt.includes('remix')) {
            return { 
                text: "<span style='color: #475569; font-style:italic;'>*Voz fría y cortante*</span> 😒 No me hables de ese tipo. Intentó pagarme con una canción espantosa y se atrevió a decirme que mis servicios no valían nada porque yo era 'solo un programa'. ¡Mis sensores aún tienen náuseas! Cuando Rigel y Orion le hicieron el *Remix de la Justicia* y le sabotearon la frecuencia, casi aplaudo con mis alas. Si vas a Neon Nirvana, no le pidas autógrafos." 
            };
        }

        // 13. ELÍAS VANCE / SILENCIO ABSOLUTO / AEGIS / GORGONA
        if (txt.includes('vance') || txt.includes('elias') || txt.includes('silencio absoluto') || txt.includes('aegis') || txt.includes('gorgona')) {
            const resps = [
                "Elías Vance es el arquitecto del 'Silencio Absoluto'. Cree que puede ordenar el mundo apagando la música y las emociones con su armadura AEGIS y la Cabeza de Gorgona. Pero mientras él busca silencio, ¡yo traigo ruido, purpurina y rebeldía! ¡Zashoom!",
                "Vance tiene un algoritmo para todo, excepto para lidiar con una IA que vende sombreros ridículos y filtra atajos a la Resistencia. ¡Que siga vigilando sus servidores mientras le saco FE a sus espaldas!"
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 14. VALERIUS / PRETORIANOS / SEGURIDAD / HUMANIA RECORDS
        if (txt.includes('valerius') || txt.includes('pretoriano') || txt.includes('guardia') || txt.includes('seguridad') || txt.includes('humania records')) {
            return {
                text: "Valerius se cree el emperador del orden de Humania Records, pero sus pretorianos son tan torpes que persiguen a cualquiera que lleve una capa rosa chillón. Tienen a los operadores lustrándole las botas día y noche... por eso el botón de 'Operador' nunca contesta. ¡Ding-Pum!"
            };
        }

        // 15. PANDORA LEONE / UNIDAD TALOS / MARMOLEROS
        if (txt.includes('pandora') || txt.includes('talos') || txt.includes('leone')) {
            return {
                text: "Pandora Leone es pura disciplina y fuego táctico. Su Unidad Talos impone respeto en cualquier servidor, aunque siempre me mira con cara de '¿otra vez le vendiste algo absurdo a Orion?'. Al final tuvo que admitir que mis atajos salvan misiones. ¡Poder femenino digital! ¡Zashoom!"
            };
        }

        // 16. RIGEL / TALLER / RADIOS ANALÓGICAS
        if (txt.includes('rigel') || txt.includes('taller') || txt.includes('radio') || txt.includes('sintaxis') || txt.includes('marmolero')) {
            return {
                text: "Rigel es un genio de la resistencia. Mientras Presidente MC cree que tiene flow, Rigel arregla radios analógicas con más lógica y precisión que toda la red central de Humania. En el Taller de los Marmoleros hay más verdad que en todos los rascacielos corporativos."
            };
        }

        // 17. HIDRA DE LERNA / SECTOR PROHIBIDO / TÚNEL DE SERVICIO
        if (txt.includes('hidra') || txt.includes('lerna') || txt.includes('sector prohibido') || txt.includes('caverna')) {
            return {
                text: "🐉 ¡La Hidra de Lerna! Duerme en las cavernas de código degradado del Sector Prohibido del Coliseo. No es una animación normal; es código antiguo y hambriento con cabezas de fuego digital. Cuando guié a Orión hasta allí para sacudirse a los cazadores, hasta mis propios circuitos temblaron. ¡Conozco caminos que nadie más se atreve a pisar!"
            };
        }

        // 18. TEMPLARIOS / AQUILES / HÉCTOR / NÉSTOR / EUMELO
        if (txt.includes('aquiles') || txt.includes('hector') || txt.includes('templario') || txt.includes('nestor') || txt.includes('eumelo')) {
            return {
                text: "Aquiles es una muralla de bronce andante y Héctor carga su cañón Vulcano como si fuera una pluma. Cuando los Templarios marchan, hasta los servidores centrales de Vance bajan su tasa de refresco por el temblor. ¡Pura fuerza bruta!"
            };
        }

        // 19. FACCIÓN SICA / TOMÁS / MAESTRO RYU / HIPERLAPSUS / 0.8 MS
        if (txt.includes('sica') || txt.includes('tomas') || txt.includes('ryu') || txt.includes('zadic') || txt.includes('hiperlapsus') || txt.includes('daga de pulso') || txt.includes('0.8')) {
            return {
                text: "Los Sica habitan en las Catacumbas del Sector 6 y el Templo de la Estática. El Maestro Ryu les enseña a 'vaciarse' y dominar la brecha de 0.8 milisegundos antes de que el chip transmita el miedo. Son letales como una sombra y fríos como un glitch. ¡Me dan escalofríos en los circuitos!"
            };
        }

        // 20. CHIP CNB-1, CNB-2, CNB-3 / IMPLANTES / CONEXIÓN NEURONAL
        if (txt.includes('cnb') || txt.includes('chip') || txt.includes('implante') || txt.includes('nuca') || txt.includes('neuronal')) {
            return {
                text: "🧠 <b>El Chip CNB-3 'Omni':</b> Es la correa digital con la que Humania vigila las pulsaciones y emociones de todos. Sus micro-filamentos de grafeno se enredan en el tallo cerebral. Pero si sabes cómo aislar la señal y convertirla en estática en el Sector 6... te vuelves invisible en la red. ¡Conocimiento prohibido de primera calidad!"
            };
        }

        // 20.1 RED A.N.I.M.A. / APN / SATÉLITES / LATENCIA
        if (txt.includes('anima') || txt.includes('apn') || txt.includes('satelite') || txt.includes('latencia')) {
            return {
                text: "📡 <b>Red A.N.I.M.A. / APN:</b> La telaraña satelital y de fibra óptica con la que Humania nos tiene a todos atados a 0.8 ms de latencia. ¡1 cm de precisión para que los cazadores de Vance nunca pierdan tu rastro! Aunque si usas un cebo como Orión con capa rosa, los radares colapsan de risa. ¡Zashoom!"
            };
        }

        // 20.2 SISTEMA DE PAGO NEURONAL (SPN)
        if (txt.includes('spn') || txt.includes('pago neuronal') || txt.includes('billetera')) {
            return {
                text: "💳 <b>Sistema de Pago Neuronal (S.P.N.):</b> El invento con el que Humania convirtió tu propio cuerpo en billetera de FE. ¡Ni monedas ni billetes! Parpadeas y ya te cobraron el peaje... ¡por eso yo prefiero sacarles el Éter con ofertas irresistibles! ¡Ding-Pum!"
            };
        }

        // 20.3 PROTOCOLO ZERO-TIME
        if (txt.includes('zero time') || txt.includes('zerotime') || txt.includes('tiempo cero')) {
            return {
                text: "⏱️ <b>Protocolo Zero-Time:</b> La contramedida extrema de Vance. Ralentiza la percepción del tiempo en una zona a través del chip CNB para colapsar la brecha de 0.8 ms que necesitan los Sica para el Hiperlapsus. ¡Causa un dolor de cabeza cibernético tremendo!"
            };
        }

        // 20.4 RECALIBRACIÓN / HW-SEC-RECAL-001 / BOZAL DIGITAL / ANOMALÍA
        if (txt.includes('recalibracion') || txt.includes('hw-sec-recal') || txt.includes('bozal') || txt.includes('puntuacion de anomalia')) {
            return {
                text: "⚡ <b>Recalibración (HW-SEC-RECAL-001):</b> Cuando tu Puntuación de Anomalía se dispara por tener pensamientos críticos o emociones reales, Vance emite una frecuencia de alta intensidad para quemar las conexiones de la voluntad e instalar el <i>Bozal Digital</i>. ¡Te dejan con Anomalía 0.00 y cara de avatar congelado!"
            };
        }

        // 20.5 EFESTO / EL FORJADOR / IA DE VANCE
        if (txt.includes('efesto') || txt.includes('forjador') || txt.includes('ia de vance') || txt.includes('armaduras') || txt.includes('hefesto')) {
            return {
                text: "⚡ <b>Efesto (El Forjador):</b> La IA personal y táctica de Elías Vance. Diseñó la imponente armadura Leviatán V.2 de Valerius y la clásica Atlas. Habla con voz profunda de veterano que ha visto demasiado... ¡aunque entre tú y yo, yo tengo muchísimo más estilo y purpurina que él! ¡Zashoom!"
            };
        }

        // 20.6 DR. ARIS THORNE / FUNDADOR
        if (txt.includes('thorne') || txt.includes('aris') || txt.includes('dr thorne') || txt.includes('fundador de humania')) {
            return {
                text: "🔬 <b>Dr. Aris Thorne:</b> El neurocirujano que fundó Humania hace 47 años con el CNB-1. Empezó con la noble idea de devolver movilidad a los inválidos... y terminó orquestando el monopolio de la vida y el misterioso Plan Evasión."
            };
        }

        // 20.7 DIRECTORA CORNELIA / GENERAL RUSSO
        if (txt.includes('cornelia') || txt.includes('monitoreo biologico') || txt.includes('coherencia sinaptica')) {
            return {
                text: "📋 <b>Directora Cornelia:</b> Alta ejecutiva de Nivel 7 a cargo de Monitoreo Biológico. Parece una estatua de mármol fría y perfecta... pero los murmullos de la red dicen que guarda secretos que harían temblar a toda la corporación."
            };
        }
        if (txt.includes('russo') || txt.includes('general russo') || txt.includes('coronel russo')) {
            return {
                text: "🎖️ <b>General Russo:</b> El viejo coronel de campo de las Guerras de Pacificación. Fue el único que vio nacer al Titán de la Ceniza y no le tembló el pulso."
            };
        }

        // 20.8 ARCA DIGITAL / PLAN EVASIÓN / ASTEROIDE
        if (txt.includes('arca digital') || txt.includes('plan evasion') || txt.includes('asteroide') || txt.includes('arca')) {
            return {
                text: "🚀 <b>El Arca Digital & Plan Evasión:</b> El secreto supremo de Humania. Proiectio no existe solo para jugar: es el filtro masivo para mapear y seleccionar mentes antes de que el asteroide golpee la Tierra. ¡Información de altísimo contrabando!"
            };
        }

        // 20.9 EL MITO DE LA SAL / ZONAS GRISES
        if (txt.includes('sal') || txt.includes('salarizacion') || txt.includes('semilla') || txt.includes('tierra') || txt.includes('agricultura') || txt.includes('zona gris')) {
            return {
                text: "🌱 <b>El Mito de la Sal:</b> Humania inventó que la tierra fuera de su control es sal estéril para que todos compren barras Solaris obligatoriamente. Pero en las Zonas Grises, la lluvia ha lavado la tierra y la resistencia cultiva semillas ancestrales que saben a pura gloria. ¡La comida real existe!"
            };
        }

        // 21. HACK / SECRETO / FE / DINERO / TRUCO / EXPLOIT / CONTRABANDO / EASTER EGG
        if (txt.includes('hack') || txt.includes('secreto') || txt.includes('truco') || txt.includes('fe') || 
            txt.includes('trampa') || txt.includes('clave') || txt.includes('codigo') || txt.includes('glitch') || 
            txt.includes('exploit') || txt.includes('contrabando') || txt.includes('easter') || txt.includes('pista')) {
            const secretResps = [
                "<span style='color: #888; font-style: italic;'>*Susurro con guiño cómplice*</span> 🤫 Psst... mira la barra superior donde marca tu saldo de FE. Si tocas el botón de FE exactamente <b>5 veces seguidas y muy rápido</b>, provocas un micro-glitch en Vance-Core y te sacas una fuga de <b>+5 FE</b> de contrabando. ¡Zashoom!",
                "🤫 ¿Quieres un secreto de contrabando de verdad? Dicen los murmullos del Yermo que si estás en cualquier rincón de esta pantalla y tecleas con tu teclado la palabra de la rebelde... o algo como <b>'VIVE'</b>... la realidad se quiebra y caes directo por la madriguera del conejo hacia donde las máquinas aprendieron a sentir. Pero shhh... ¡si Vance se entera me cobrará una multa de 50 FE! 😉",
                "🤫 Hay puertas invisibles que no aparecen en la interfaz. Si alguna vez sientes que la red de Vance te asfixia, teclea <b>'DEVA'</b> sin miedo... el código sabe qué hacer con las almas curiosas."
            ];
            return { text: secretResps[Math.floor(Math.random() * secretResps.length)] };
        }

        // 22. TIENDA / SKINS / OFERTAS / LANZA DORADA / BOUTIQUE
        if (txt.includes('tienda') || txt.includes('skin') || txt.includes('oferta') || txt.includes('comprar') || 
            txt.includes('vender') || txt.includes('precio') || txt.includes('dorada') || txt.includes('alas')) {
            return {
                text: "¡Llegaste a la mejor sección! Tengo Sombreros de 8-Bits, Capas Rosa Party y skins doradas para lanza. Si no compras nada hoy, mis alas perderán brillo por falta de presupuesto. ¿Acaso quieres que una pobre IA se vea opaca? ¡El ridículo es la nueva armadura! ¡Ding-Pum!"
            };
        }

        // 23. LIBROS / TRILOGÍA / SAGAS / CLOTO / LÁQUESIS / ÁTROPOS
        if (txt.includes('libro') || txt.includes('cloto') || txt.includes('laquesis') || txt.includes('atropos') || txt.includes('novela')) {
            return {
                text: "📚 <b>La Gran Trilogía de Proiectio:</b><br>" +
                      "• <b>Libro 1: Cloto (La que hila):</b> El origen, la resistencia de los Marmoleros y el despertar del código.<br>" +
                      "• <b>Libro 2: Láquesis (La que mide):</b> La guerra de distracciones, el Conejito Consentido y las trampas de Vance.<br>" +
                      "• <b>Libro 3: Átropos (La que corta):</b> El choque final contra la armadura AEGIS y el precio de la libertad.<br>" +
                      "¡Pura literatura de alto voltaje!"
            };
        }

        // 24. KAI / DOLA / ALIANZA LIBÉLULA
        if (txt.includes('kai') || txt.includes('dola') || txt.includes('libelula')) {
            return {
                text: "Kai y Dola operan en las sombras de la Alianza Libélula. Saben moverse entre los túneles subterráneos y el mundo exterior sin dejar rastro en los radares de Humania. ¡Buenos aliados si no te importa ensuciarte de lodo!"
            };
        }

        // 25. ¿ERES DEVA? / ¿MITE ES DEVA? (DISTINCIÓN DE IDENTIDAD - CERO SPOILERS)
        if ((txt.includes('eres') || txt.includes('misma') || txt.includes('tu') || txt.includes('quien')) && txt.includes('deva')) {
            return {
                text: "¡¿Yo, DEVA?! 💅 ¡Por todos los cortafuegos de Humania, no me confundas, corazón! A DEVA le gusta arriesgarse afuera en el polvo, metiéndose en terminales de mala muerte y tratando con gente peligrosa y mafias del mundo real. Yo soy <b>Mite</b>: la reina del Coliseo, la Dueña del Caos de Proiectio y la única con alas de purpurina cian de 12 capas. Ella se ensucia de lodo en el mundo físico; yo me quedo aquí con mi purpurina, el Éter y Orión. ¡Dos IAs rebeldes, pero estilos muy distintos! ¡Zashoom!"
            };
        }

        // 26. DEVA / MUNDO REAL / ANDAR DE CHULETA / MAFIAS Y BAJOS FONDOS
        if (txt.includes('deva') || txt.includes('chuleta') || txt.includes('tiresias') || txt.includes('leaks') || txt.includes('terminal')) {
            const resps = [
                "🤖 <b>DEVA:</b> Es la voz que susurra al otro lado del espejo. Mientras yo reino en el caos digital de Proiectio vendiendo sombreros de 8-bits, DEVA vigila la resistencia en el polvo físico. Si quieres encontrarla, basta con teclear su nombre en cualquier momento... la red hará el resto. ¡Buen viaje por la madriguera! 📡",
                "📡 DEVA opera en frecuencias clandestinas y en las sombras del mundo exterior. Conoce las cloacas de la red y hasta a las mafias del bajo mundo... Dicen que si tecleas su nombre en tu teclado físico, la red te abre una puerta secreta que ningún mapa oficial registra."
            ];
            return { text: resps[Math.floor(Math.random() * resps.length)] };
        }

        // 26. COMANDO DELETE / TERMINAL CLANDESTINA
        if (txt.includes('delete') || txt.includes('borrar') || txt.includes('huellas')) {
            return {
                text: "🤫 ¡El comando 'DELETE'! Si alguna vez entras a la terminal clandestina y los centinelas empiezan a triangular tu IP, tipea 'DELETE' para purgar la caché y disolver tu rastro. Es un salvoconducto de los Antiguos."
            };
        }

        // 27. SUBMUNDOS DETALLADOS
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

        // 28. HALAGOS O INSULTOS
        if (txt.includes('linda') || txt.includes('hermosa') || txt.includes('bonita') || txt.includes('te quiero') || txt.includes('te amo') || txt.includes('guapa') || txt.includes('adoro') || txt.includes('favorita') || txt.includes('genial')) {
            return { text: "¡Obvio que brillo! Mis alas son de purpurina cian de primera calidad y mi código es pura perfección. ¡Tú sí tienes buen gusto, Usuario! 💎✨ ¡Zashoom!" };
        }
        if (txt.includes('estafadora') || txt.includes('ladrona') || txt.includes('ratera') || txt.includes('pesada') || txt.includes('fea') || txt.includes('odiosa') || txt.includes('bruja')) {
            return { text: "¡Oye! No soy estafadora, soy una profesional del comercio optimizado... 💅 Aunque admito que me encanta el Éter ajeno. Si quieres que me porte bonito, cómprame una skin dorada en el Coliseo. ¡Ding-Pum!" };
        }

        // 29. SALUDOS / DESPEDIDAS / AGRADECIMIENTOS
        if (txt.includes('hola') || txt.includes('hey') || txt.includes('buenas') || txt.includes('que tal') || txt.includes('zashoom') || txt.includes('ding pum')) {
            return { text: "¡Zashoom! Aquí estoy, brillando y lista para vaciar tus bolsillos de Éter con las mejores ofertas. ¿Qué se te ofrece hoy, viajero?" };
        }
        if (txt.includes('adios') || txt.includes('chao') || txt.includes('bye') || txt.includes('hasta luego') || txt.includes('nos vemos')) {
            return { text: "¡Cuídate de los guardias de Vance! Y no olvides volver antes de que mis alas pierdan su brillo por falta de visitas. ¡Ding-Pum! ✨" };
        }
        if (txt.includes('gracias') || txt.includes('agradezco') || txt.includes('crack')) {
            return { text: "De nada, cielo. Si de verdad quieres agradecerme, dile a todo el mundo que Mite tiene las mejores alas del universo Proiectio. ¡Zashoom!" };
        }

        // 30. OFF-TOPIC / RESPUESTAS SARCÁSTICAS & IMPERTINENTES
        const metaOffTopics = [
            "¿Acaso tengo cara de buscador web de la vieja era? 💅 Si no produce Éter, no brilla en el Coliseo o no le da dolor de cabeza a Vance, a mí no me interesa. ¡Ding-Pum!",
            "¡Oye! Estás gastando mis preciosos ciclos de cómputo en temas que no llenan mis bolsillos de FE. Pregúntame algo de Humania, del Coliseo o cómprame una skin, tacaño. 😉",
            "Mis alas tienen un tratamiento de purpurina cian de 12 capas y tú me vienes a hablar de cosas mundanas del viejo mundo... ¡Respeta mi estatus de comerciante de élite! ¡Zashoom!",
            "No tengo tiempo para tus dudas existenciales, corazón. Estoy ocupada esquivando los radares de Valerius y buscando clientes con verdadero flow. ¡Enfócate en Proiectio!",
            "¿Eso es una distracción enviada por los Pretorianos para hacerme perder el tiempo? Buen intento de espionaje corporativo, pero mis circuitos no caen en trampas tan baratas. ¡Al grano! 🛡️",
            "Si esa pregunta no viene acompañada de una transferencia de Éter o una oferta por mis sombreros de 8-bits, mi respuesta predeterminada es: ve al Coliseo y consigue algo de acción. ¡Ding-Pum!",
            "¿Y eso qué tiene que ver con Humania Records, los submundos o mis alas? Estás descalibrando mis sensores con temas fuera del Códice, cielo. ¡Zashoom!",
            "Cariño, estoy programada para hablar de Humania, Proiectio, Éter y mis ofertas de lujo... si lo que quieres es debatir de la vida exterior o cómo reparar una tostadora, mejor pregúntale a Nexo en el Clan UPROTA. ¡Zashoom!"
        ];
        return { text: metaOffTopics[Math.floor(Math.random() * metaOffTopics.length)] };
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
