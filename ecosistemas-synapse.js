/**
 * =========================================================================
 * MOTOR DE MALLA NEURONAL CUÁNTICA REACTIVA (QUANTUM SYNAPSE MESH)
 * Fondo interactivo de alta fidelidad a 60-120 FPS para Ecosistemas de Inmersión
 * 0 KB dependencias • Vanilla Canvas 2D • Proiectio / Humania Ecosystem
 * =========================================================================
 */

(function () {
    const canvas = document.getElementById('ecosistemas-canvas');
    const section = document.getElementById('ecosistemas-section');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = null;
    let isVisible = true;

    // Estado del Cursor / Puntero
    const mouse = {
        x: null,
        y: null,
        radius: 160,
        active: false,
        lastSpawn: 0
    };

    // Colecciones de Partículas
    const nodes = [];
    const sparks = [];
    const NUM_NODES_BASE = 55;
    const MAX_CONNECTION_DIST = 115;

    class SynapseNode {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 2.2 + 1.2;
            this.baseAlpha = Math.random() * 0.45 + 0.35;
            this.hue = Math.random() > 0.7 ? 210 : 190; // Cian tecnológico / Zafiro Vance
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
        }

        update() {
            this.pulse += this.pulseSpeed;
            this.x += this.vx;
            this.y += this.vy;

            // Rebote elástico en bordes
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Interacción con el cursor (Atracción magnética cuántica suave)
            if (mouse.active && mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && dist > 2) {
                    const force = (1 - dist / mouse.radius) * 0.85;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }
            }
        }

        draw() {
            const currentAlpha = this.baseAlpha + Math.sin(this.pulse) * 0.18;
            
            // Halo sutil
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${currentAlpha * 0.35})`;
            ctx.fill();

            // Núcleo brillante
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${currentAlpha})`;
            ctx.fill();
        }
    }

    class SynapseSpark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.6 + 0.4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 1.0;
            this.decay = 0.025 + Math.random() * 0.02;
            this.size = Math.random() * 1.8 + 0.8;
            this.hue = Math.random() > 0.5 ? 195 : 45; // Cian o chispa de oro
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.96;
            this.vy *= 0.96;
            this.life -= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.life * 0.8})`;
            ctx.fill();
        }
    }

    function initNodes() {
        nodes.length = 0;
        const count = Math.min(Math.floor((width * height) / 18000), 75) || NUM_NODES_BASE;
        for (let i = 0; i < count; i++) {
            nodes.push(new SynapseNode());
        }
    }

    function resize() {
        const rect = section.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        if (nodes.length === 0) {
            initNodes();
        }
    }

    function drawFilaments() {
        const len = nodes.length;
        for (let i = 0; i < len; i++) {
            const a = nodes[i];

            // Conexión entre nodos cercanos
            for (let j = i + 1; j < len; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_CONNECTION_DIST) {
                    const alpha = (1 - dist / MAX_CONNECTION_DIST) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(0, 195, 255, ${alpha})`;
                    ctx.lineWidth = 1.0;
                    ctx.stroke();
                }
            }

            // Conexión dinámica con el cursor (Filamentos de Sinapsis Reactiva)
            if (mouse.active && mouse.x !== null) {
                const dx = mouse.x - a.x;
                const dy = mouse.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const alpha = (1 - dist / mouse.radius) * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(a.x, a.y);
                    
                    const grad = ctx.createLinearGradient(mouse.x, mouse.y, a.x, a.y);
                    grad.addColorStop(0, `rgba(0, 225, 255, ${alpha * 1.2})`);
                    grad.addColorStop(1, `rgba(99, 102, 241, ${alpha * 0.4})`);
                    
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        if (!isVisible) return;

        ctx.clearRect(0, 0, width, height);

        // 1. Dibujar filamentos y conexiones de red
        drawFilaments();

        // 2. Actualizar y dibujar nodos
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();
        }

        // 3. Actualizar y dibujar chispas de movimiento
        for (let i = sparks.length - 1; i >= 0; i--) {
            const spark = sparks[i];
            spark.update();
            spark.draw();
            if (spark.life <= 0) {
                sparks.splice(i, 1);
            }
        }

        // 4. Efecto de resplandor sutil del cursor
        if (mouse.active && mouse.x !== null) {
            const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
            radGrad.addColorStop(0, 'rgba(0, 195, 255, 0.08)');
            radGrad.addColorStop(1, 'rgba(0, 195, 255, 0)');
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        animId = requestAnimationFrame(loop);
    }

    // --- EVENT LISTENERS INTERACTIVOS ---
    function updateMousePos(e) {
        const rect = section.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.active = true;

        // Generar micro-chispas cuánticas al mover el cursor
        const now = performance.now();
        if (now - mouse.lastSpawn > 40 && sparks.length < 30) {
            sparks.push(new SynapseSpark(mouse.x, mouse.y));
            mouse.lastSpawn = now;
        }
    }

    section.addEventListener('mousemove', updateMousePos, { passive: true });
    section.addEventListener('touchmove', updateMousePos, { passive: true });
    section.addEventListener('touchstart', updateMousePos, { passive: true });

    section.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });
    section.addEventListener('touchend', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    // Optimización: Observer de Visibilidad para 0% de uso de CPU cuando no está en pantalla
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                if (!animId) loop();
            } else {
                if (animId) {
                    cancelAnimationFrame(animId);
                    animId = null;
                }
            }
        });
    }, { threshold: 0.05 });

    observer.observe(section);

    // Ajuste de resolución y redimensión
    window.addEventListener('resize', () => {
        resize();
    }, { passive: true });

    // Inicializar
    resize();
    loop();
})();
