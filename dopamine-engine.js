/**
 * dopamine-engine.js - Motor de Alta Dopamina y Engagement Sensorial para PROIECTIO
 * Autor: Nexo (Ingeniería Principal) | SAPIENSIA Clan
 * 0 KB Dependencies | 60-120 FPS GPU Accelerated | Web Audio API
 */

(function() {
    // --- 1. SINTETIZADOR DE AUDIO PROCEDURAL (0 KB ASSETS) ---
    class ProceduralAudioEngine {
        constructor() {
            this.ctx = null;
        }

        ensureContext() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playHoverTone(tier = 'nivel7') {
            try {
                this.ensureContext();
                if (!this.ctx || this.ctx.state !== 'running') return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                const freqMap = {
                    nivel7: 587.33,   // D5
                    popular: 523.25,  // C5
                    epico: 659.25,    // E5
                    sensorial: 698.46,// F5
                    lore: 440.00,     // A4
                    glitch: 783.99    // G5 (Glitch tone)
                };

                const baseFreq = freqMap[tier] || 523.25;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(baseFreq, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.08);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.13);
            } catch (e) {}
        }

        playRewardChime() {
            try {
                this.ensureContext();
                if (!this.ctx || this.ctx.state !== 'running') return;

                const now = this.ctx.currentTime;
                const arpeggio = [523.25, 659.25, 783.99, 1046.50]; // Acorde mayor brillante

                arpeggio.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const startTime = now + (idx * 0.04);

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, startTime);

                    gain.gain.setValueAtTime(0.001, startTime);
                    gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(startTime);
                    osc.stop(startTime + 0.2);
                });
            } catch (e) {}
        }

        playMechanicalClick() {
            try {
                this.ensureContext();
                if (!this.ctx || this.ctx.state !== 'running') return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.03);

                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.035);
            } catch (e) {}
        }
    }

    const audio = new ProceduralAudioEngine();

    // --- 2. GESTOR DE SALDO FE (FRAGMENTOS DE ÉTER // ECONOMÍA OPRESIVA) ---
    class FEHUDManager {
        constructor() {
            this.feKey = 'proiectio_user_fe_v2';
            this.amountEl = document.getElementById('fe-amount-display');
            this.hudBtn = document.getElementById('fe-hud-trigger');
            this.clickHistory = [];
            this.lastManualSync = 0;
            this.inspectedCards = new Set();
            this.init();
        }

        init() {
            let current = localStorage.getItem(this.feKey);
            if (!current) {
                current = 20; // Ración inicial de supervivencia
                localStorage.setItem(this.feKey, current);
            }
            this.render(parseInt(current, 10));

            // Interacción con HUD y Hacking de Vance-Core (Soplado por Mite)
            if (this.hudBtn) {
                this.hudBtn.addEventListener('click', (e) => {
                    const now = Date.now();
                    this.clickHistory.push(now);
                    // Mantener solo clics de los últimos 2 segundos
                    this.clickHistory = this.clickHistory.filter(t => now - t < 2000);

                    // COMBO SECRETO: 5 clics rápidos seguidos
                    if (this.clickHistory.length >= 5) {
                        this.clickHistory = [];
                        this.addFE(5, '⚠️ BRECHA EN VANCE-CORE (Contrabando de Mite)', 'glitch');
                        return;
                    }

                    // Sincronía manual estándar con cooldown de 3 segundos
                    if (now - this.lastManualSync > 3000) {
                        this.lastManualSync = now;
                        this.addFE(1, 'Sincronía residual manual', 'nivel7');
                    }
                });
            }

            // Recompensa pasiva por exploración (Scroll > 700px)
            let rewardedScroll = false;
            window.addEventListener('scroll', () => {
                if (!rewardedScroll && window.scrollY > 700) {
                    rewardedScroll = true;
                    setTimeout(() => {
                        this.addFE(2, 'Nodo periférico explorado');
                    }, 800);
                }
            }, { passive: true });
        }

        render(amount) {
            if (this.amountEl) {
                this.amountEl.innerText = new Intl.NumberFormat('es-ES').format(amount);
            }
        }

        addFE(delta, reason = '', soundTier = 'reward') {
            let current = parseInt(localStorage.getItem(this.feKey) || 20, 10);
            current += delta;
            localStorage.setItem(this.feKey, current);
            this.render(current);

            // Sonido de recompensa o glitch
            if (soundTier === 'glitch') {
                audio.playHoverTone('glitch');
                setTimeout(() => audio.playRewardChime(), 120);
            } else {
                audio.playRewardChime();
            }

            // Toast flotante con mayor tiempo de lectura
            this.showToast(`+${delta} FE // ${reason}`);
        }

        recordCardInspection(cardTitle) {
            if (!this.inspectedCards.has(cardTitle)) {
                this.inspectedCards.add(cardTitle);
                setTimeout(() => {
                    this.addFE(1, `Telemetría decodificada: ${cardTitle}`);
                }, 1600);
            }
        }

        showToast(msg) {
            const toast = document.createElement('div');
            toast.className = 'fe-toast';
            toast.innerHTML = `<span style="color:#00c3ff; font-weight:900;">[FE+]</span> <span>${msg}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 4600);
        }
    }

    const feManager = new FEHUDManager();
    window.proiectioFE = feManager;

    // --- 3. TELEMETRÍA SOCIAL EN VIVO & TICKER COMUNITARIO ---
    class TelemetryEngine {
        constructor() {
            this.counterEl = document.getElementById('live-minds-count');
            this.tickerEl = document.getElementById('resonance-ticker-text');
            this.baseUsers = 14840;
            this.feed = [
                { tag: '[Clan Marmoleros]', msg: '⚡ Orión_42 acaba de sincronizar el Coliseo Etérico' },
                { tag: '[Red ANIMA]', msg: '🛰️ Señal de Nivel 7 detectada en Sector Olympus V-Games' },
                { tag: '[Humania Core]', msg: '🛡️ 4,200 raciones de Solaris despachadas con éxito' },
                { tag: '[Nodo Rebelde]', msg: '👾 UPROTA: Registro anómalo en revisión de seguridad de Vance-Core' },
                { tag: '[Clan Templarios]', msg: '⚔️ Santos_09 purificó frecuencia en Sector Chronos' },
                { tag: '[Sincronía]', msg: '✨ 380 nuevas mentes han ingresado al Beso Prohibido' }
            ];
            this.feedIdx = 0;
            this.init();
        }

        init() {
            this.updateCount();
            this.startPulse();
            this.startTicker();
        }

        updateCount() {
            if (!this.counterEl) return;
            const delta = Math.floor((Math.random() - 0.47) * 16);
            this.baseUsers = Math.max(13500, this.baseUsers + delta);
            this.counterEl.innerText = new Intl.NumberFormat('es-ES').format(this.baseUsers);
        }

        startPulse() {
            setInterval(() => {
                this.updateCount();
            }, 3500);
        }

        startTicker() {
            if (!this.tickerEl) return;
            setInterval(() => {
                this.tickerEl.style.opacity = '0';
                this.tickerEl.style.transform = 'translateY(-8px)';
                
                setTimeout(() => {
                    this.feedIdx = (this.feedIdx + 1) % this.feed.length;
                    const item = this.feed[this.feedIdx];
                    this.tickerEl.innerHTML = `<span class="ticker-tag">${item.tag}</span> ${item.msg}`;
                    this.tickerEl.style.opacity = '1';
                    this.tickerEl.style.transform = 'translateY(0)';
                }, 300);
            }, 4200);
        }
    }

    // --- 4. MOTOR DE TARJETAS 3D INTERACTIVAS (TILT + SPOTLIGHT + VIDEO PREVIEW) ---
    class Cards3DEngine {
        static init() {
            const cards = document.querySelectorAll('.proiect-3d-card');
            cards.forEach(card => {
                let bounds;
                let hoverTimer;
                const video = card.querySelector('.card-video');
                const tier = card.dataset.tier || 'nivel7';

                function updateBounds() {
                    bounds = card.getBoundingClientRect();
                }

                function onPointerMove(e) {
                    if (!bounds) updateBounds();
                    const mouseX = e.clientX - bounds.left;
                    const mouseY = e.clientY - bounds.top;
                    const leftX = mouseX - bounds.width / 2;
                    const topY = mouseY - bounds.height / 2;

                    // Inclinación matemática GPU (Max 8 deg para suavidad elegante)
                    const rotateX = (-topY / (bounds.height / 2)) * 7;
                    const rotateY = (leftX / (bounds.width / 2)) * 7;

                    card.style.setProperty('--mouse-x', `${mouseX}px`);
                    card.style.setProperty('--mouse-y', `${mouseY}px`);
                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
                }

                function onPointerEnter() {
                    updateBounds();
                    audio.playHoverTone(tier);

                    // Buffer de 160ms para no disparar video si solo pasa el mouse rápido
                    hoverTimer = setTimeout(() => {
                        if (video) {
                            video.play().catch(() => {});
                        }
                    }, 160);
                }

                function onPointerLeave() {
                    clearTimeout(hoverTimer);
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }

                card.addEventListener('pointerenter', onPointerEnter);
                card.addEventListener('pointermove', onPointerMove);
                card.addEventListener('pointerleave', onPointerLeave);
                card.addEventListener('click', () => audio.playMechanicalClick());
            });
        }
    }

    // --- INICIALIZACIÓN GLOBAL ---
    document.addEventListener('DOMContentLoaded', () => {
        new FEHUDManager();
        new TelemetryEngine();
        Cards3DEngine.init();
    });

})();
