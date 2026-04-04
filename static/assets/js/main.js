document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 0. PARTICLE NETWORK BACKGROUND
    // =========================================================
    const particleCanvas = document.getElementById('particle-network');
    if (particleCanvas) {
        const pCtx = particleCanvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 70;
        const CONNECTION_DIST = 150;
        const PARTICLE_SPEED = 0.3;

        function resizeParticleCanvas() {
            const dpr = window.devicePixelRatio || 1;
            particleCanvas.width = window.innerWidth * dpr;
            particleCanvas.height = window.innerHeight * dpr;
            pCtx.scale(dpr, dpr);
        }

        function createParticle() {
            return {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * PARTICLE_SPEED,
                vy: (Math.random() - 0.5) * PARTICLE_SPEED,
                radius: 1 + Math.random() * 1.5,
                opacity: 0.2 + Math.random() * 0.4,
                pulseSpeed: 0.005 + Math.random() * 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            };
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        }

        function drawParticleNetwork() {
            const w = window.innerWidth;
            const h = window.innerHeight;

            pCtx.clearRect(0, 0, w, h);

            // Subtle grid underneath particles (very faint)
            pCtx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
            pCtx.lineWidth = 0.5;
            for (let x = 0; x < w; x += 40) {
                pCtx.beginPath();
                pCtx.moveTo(x, 0);
                pCtx.lineTo(x, h);
                pCtx.stroke();
            }
            for (let y = 0; y < h; y += 40) {
                pCtx.beginPath();
                pCtx.moveTo(0, y);
                pCtx.lineTo(w, y);
                pCtx.stroke();
            }

            // Update and draw particles
            const time = Date.now() * 0.001;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap at edges
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                // Pulsing opacity
                const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulsePhase);
                const currentOpacity = p.opacity + pulse * 0.15;

                // Draw connections to nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DIST) {
                        const lineOpacity = (1 - dist / CONNECTION_DIST) * 0.15;
                        pCtx.strokeStyle = `rgba(0, 229, 255, ${lineOpacity})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.beginPath();
                        pCtx.moveTo(p.x, p.y);
                        pCtx.lineTo(p2.x, p2.y);
                        pCtx.stroke();
                    }
                }

                // Draw particle node
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(0, 229, 255, ${currentOpacity})`;
                pCtx.fill();

                // Outer glow ring on larger particles
                if (p.radius > 2) {
                    pCtx.beginPath();
                    pCtx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
                    pCtx.strokeStyle = `rgba(0, 229, 255, ${currentOpacity * 0.3})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.stroke();
                }
            }

            requestAnimationFrame(drawParticleNetwork);
        }

        resizeParticleCanvas();
        initParticles();
        requestAnimationFrame(drawParticleNetwork);

        window.addEventListener('resize', () => {
            resizeParticleCanvas();
        });
    }

    // =========================================================
    // 1. BOOT SEQUENCE
    // =========================================================
    const bootOverlay = document.getElementById('boot-overlay');

    setTimeout(() => {
        bootOverlay.classList.add('hidden');
    }, 2800);

    // =========================================================
    // 1.5 TYPING EFFECT on subtitle
    // =========================================================
    const subtitleEl = document.getElementById('subtitle-text');
    if (subtitleEl) {
        const fullText = subtitleEl.getAttribute('data-text');
        let charIndex = 0;

        function typeChar() {
            if (charIndex < fullText.length) {
                subtitleEl.textContent += fullText[charIndex];
                charIndex++;
                // Random speed variation for realistic feel
                const delay = 35 + Math.random() * 25;
                setTimeout(typeChar, delay);
            } else {
                subtitleEl.classList.add('done');
            }
        }

        // Start typing after boot overlay finishes
        setTimeout(typeChar, 3200);
    }

    // =========================================================
    // 1.6 HAMBURGER MENU TOGGLE
    // =========================================================
    const hamburgerBtn = document.getElementById('nav-toggle');
    const navPanel = document.querySelector('.nav-panel');

    if (hamburgerBtn && navPanel) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = hamburgerBtn.classList.toggle('active');
            navPanel.classList.toggle('nav-open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });
    }

    // =========================================================
    // 2. SCROLL-REVEAL: Fade-in sections as they enter viewport
    // =========================================================
    const sections = document.querySelectorAll('.sys-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // =========================================================
    // 3. ACTIVE NAV STATE (Intersection Observer)
    // =========================================================
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                });

                const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }, { rootMargin: '0px', threshold: 0.5 });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // =========================================================
    // 4. SMOOTH SCROLLING for navigation links
    // =========================================================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                window.scrollTo({
                    top: targetEl.offsetTop,
                    behavior: 'smooth'
                });
            }
            // Close hamburger menu on mobile
            if (hamburgerBtn && navPanel.classList.contains('nav-open')) {
                hamburgerBtn.classList.remove('active');
                navPanel.classList.remove('nav-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // =========================================================
    // 5. LIVE CHART MOCKUP SIMULATION
    // =========================================================
    const chartContainer = document.getElementById('live-chart');
    if (chartContainer) {
        for (let i = 0; i < 15; i++) {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${20 + Math.random() * 80}%`;
            chartContainer.appendChild(bar);
        }

        setInterval(() => {
            const bars = chartContainer.querySelectorAll('.bar');
            const randomBar = bars[Math.floor(Math.random() * bars.length)];
            randomBar.style.height = `${20 + Math.random() * 80}%`;
        }, 800);
    }

    // =========================================================
    // 6. LIVE SYSTEM CLOCK (Footer)
    // =========================================================
    const clockEl = document.getElementById('sys-clock');
    if (clockEl) {
        const updateClock = () => {
            clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    // =========================================================
    // 6.5 LIVE PID TREND CHART
    // =========================================================
    const pidCanvas = document.getElementById('pid-trend-canvas');
    if (pidCanvas) {
        const ctx = pidCanvas.getContext('2d');
        const liveValuesEl = document.getElementById('pid-live-values');
        const maxPoints = 300;

        // Process simulation state
        let sp = 50;           // Setpoint (%)
        let pv = 50;           // Process variable (%)
        let op = 50;           // Controller output (%)
        let integral = 0;      // Integral accumulator
        let nextSpChange = 200; // Countdown to next SP step change

        // PID tuning parameters
        const Kp = 1.2;
        const Ki = 0.015;
        const dt = 1;
        const processGain = 0.85;
        const processLag = 0.06;   // First-order time constant
        const noiseAmp = 0.4;

        // Data buffers
        const spData = new Array(maxPoints).fill(50);
        const pvData = new Array(maxPoints).fill(50);
        const opData = new Array(maxPoints).fill(50);

        function simulateStep() {
            // Periodically change setpoint
            nextSpChange--;
            if (nextSpChange <= 0) {
                sp = 30 + Math.random() * 40; // Random SP between 30-70%
                nextSpChange = 150 + Math.floor(Math.random() * 150);
            }

            // PID controller
            const error = sp - pv;
            integral += error * Ki * dt;
            integral = Math.max(-20, Math.min(20, integral)); // Anti-windup
            op = 50 + Kp * error + integral;
            op = Math.max(0, Math.min(100, op));

            // First-order process model
            const noise = (Math.random() - 0.5) * noiseAmp * 2;
            pv += processLag * (processGain * op - pv) + noise;
            pv = Math.max(0, Math.min(100, pv));

            // Push data
            spData.push(sp);
            pvData.push(pv);
            opData.push(op);
            if (spData.length > maxPoints) spData.shift();
            if (pvData.length > maxPoints) pvData.shift();
            if (opData.length > maxPoints) opData.shift();

            // Update live values display
            if (liveValuesEl) {
                liveValuesEl.textContent = `SP: ${sp.toFixed(1)}% | PV: ${pv.toFixed(1)}% | OP: ${op.toFixed(1)}%`;
            }
        }

        function drawChart() {
            // Handle high-DPI displays
            const rect = pidCanvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            pidCanvas.width = rect.width * dpr;
            pidCanvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            const w = rect.width;
            const h = rect.height;
            const padTop = 10;
            const padBottom = 10;
            const padLeft = 35;
            const padRight = 10;
            const chartW = w - padLeft - padRight;
            const chartH = h - padTop - padBottom;

            // Clear
            ctx.clearRect(0, 0, w, h);

            // Chart background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(padLeft, padTop, chartW, chartH);

            // Grid lines
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = padTop + (chartH / 4) * i;
                ctx.beginPath();
                ctx.moveTo(padLeft, y);
                ctx.lineTo(w - padRight, y);
                ctx.stroke();

                // Y-axis labels
                const val = 100 - (i * 25);
                ctx.fillStyle = 'rgba(138, 155, 178, 0.6)';
                ctx.font = '10px "Share Tech Mono", monospace';
                ctx.textAlign = 'right';
                ctx.fillText(val + '%', padLeft - 5, y + 4);
            }

            // Vertical grid lines
            for (let i = 0; i <= 6; i++) {
                const x = padLeft + (chartW / 6) * i;
                ctx.beginPath();
                ctx.moveTo(x, padTop);
                ctx.lineTo(x, padTop + chartH);
                ctx.stroke();
            }

            // Helper to map value (0-100) to Y coordinate
            const valToY = (val) => padTop + chartH - (val / 100) * chartH;
            const idxToX = (idx) => padLeft + (idx / (maxPoints - 1)) * chartW;

            // Draw a data line
            function drawLine(data, color, lineWidth, dashed) {
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.setLineDash(dashed ? [4, 4] : []);
                ctx.beginPath();
                for (let i = 0; i < data.length; i++) {
                    const x = idxToX(i);
                    const y = valToY(data[i]);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw OP% (green, thin, behind)
            drawLine(opData, 'rgba(0, 255, 85, 0.35)', 1, true);

            // Draw SP (amber, dashed)
            drawLine(spData, '#FFAB00', 1.5, true);

            // Draw PV (cyan, solid, prominent)
            drawLine(pvData, '#00E5FF', 2, false);

            // Glow effect on PV line (draw again with blur)
            ctx.save();
            ctx.shadowColor = '#00E5FF';
            ctx.shadowBlur = 6;
            drawLine(pvData, 'rgba(0, 229, 255, 0.4)', 2, false);
            ctx.restore();

            // Current value marker (rightmost point)
            const lastPV = pvData[pvData.length - 1];
            const markerX = idxToX(pvData.length - 1);
            const markerY = valToY(lastPV);
            ctx.beginPath();
            ctx.arc(markerX, markerY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00E5FF';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(markerX, markerY, 6, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Animation loop
        let frameCount = 0;
        function pidLoop() {
            frameCount++;
            // Simulate at ~20Hz (every 3 frames at 60fps)
            if (frameCount % 3 === 0) {
                simulateStep();
            }
            drawChart();
            requestAnimationFrame(pidLoop);
        }

        // Start after boot overlay
        setTimeout(() => {
            requestAnimationFrame(pidLoop);
        }, 3000);
    }

    // =========================================================
    // 7. COUNT-UP ANIMATION on readout values
    // =========================================================
    const uptimeEl = document.getElementById('uptime-val');
    if (uptimeEl) {
        const targetValue = 99.98;
        let current = 0;
        const duration = 2000; // ms
        const startTime = performance.now();

        const countUp = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            current = eased * targetValue;
            uptimeEl.textContent = current.toFixed(2) + '%';
            if (progress < 1) {
                requestAnimationFrame(countUp);
            }
        };

        // Start count-up when home section is revealed
        const homeSection = document.getElementById('home');
        const countUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(countUp);
                    countUpObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        countUpObserver.observe(homeSection);
    }

    // =========================================================
    // 8. SCADA STATUS NOTIFICATIONS
    // =========================================================
    const notifContainer = document.getElementById('sys-notifications');
    const systemMessages = [
        '> LOOP_07 STABILIZED — PV WITHIN 0.2% OF SP',
        '> TAG UPDATE RECEIVED: FIC-101.PV = 42.7 m³/h',
        '> HISTORIAN SYNC COMPLETE — 2,048 RECORDS',
        '> CONTROLLER MODE: AUTO — ALL LOOPS NOMINAL',
        '> NETWORK HEARTBEAT: OPC-UA SERVER ONLINE',
        '> ALARM CLEARED: TIC-204 HIGH TEMP RESOLVED',
        '> PID AUTOTUNE COMPLETE — Kp=1.2, Ti=8.5s',
        '> SCADA LINK INTEGRITY: 99.97% UPTIME',
        '> BATCH SEQUENCE S3 — STEP 7/12 COMPLETE',
        '> EDGE GATEWAY: 14 TAGS PUBLISHING @ 1Hz'
    ];

    function showNotification() {
        if (!notifContainer) return;

        const msg = systemMessages[Math.floor(Math.random() * systemMessages.length)];
        const notif = document.createElement('div');
        notif.classList.add('sys-notification');
        notif.textContent = msg;
        notifContainer.appendChild(notif);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notif.classList.add('fade-out');
            setTimeout(() => {
                notif.remove();
            }, 400);
        }, 4000);

        // Keep max 3 visible
        const all = notifContainer.querySelectorAll('.sys-notification');
        if (all.length > 3) {
            all[0].remove();
        }
    }

    // First notification after boot sequence ends
    setTimeout(() => {
        showNotification();
        // Then every 8-15 seconds randomly
        const scheduleNext = () => {
            const delay = 8000 + Math.random() * 7000;
            setTimeout(() => {
                showNotification();
                scheduleNext();
            }, delay);
        };
        scheduleNext();
    }, 4000);
});
