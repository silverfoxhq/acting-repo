/**
 * Briefly Obsessed — Main JavaScript
 * Navigation, ocean bubbles, stats counter, clamshell contact
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCampaignStats();
    initScrollReveal();
    initSmoothScroll();
    initBubbles();
    initStatsCounter();
    initClamshell();
});

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        const oceanZone = document.getElementById('oceanZone');
        if (oceanZone) {
            const oceanBottom = oceanZone.offsetTop + oceanZone.offsetHeight;
            if (window.pageYOffset > oceanBottom - 100) {
                nav.classList.add('scrolled-calm');
            } else {
                nav.classList.remove('scrolled-calm');
            }
        }

        updateActiveNavLink();
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

function initCampaignStats() {
    const featuredCards = document.querySelectorAll('.campaign-card--featured');
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice) return;

    featuredCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const wasActive = card.classList.contains('is-active');

            featuredCards.forEach(c => c.classList.remove('is-active'));

            if (!wasActive) {
                card.classList.add('is-active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.campaign-card--featured')) {
            featuredCards.forEach(c => c.classList.remove('is-active'));
        }
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.campaign-card, .service-card, .client-logo, .hero-stat'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                if (parent && (
                    parent.classList.contains('featured-grid') ||
                    parent.classList.contains('campaign-grid') ||
                    parent.classList.contains('services-grid') ||
                    parent.classList.contains('clients-row') ||
                    parent.classList.contains('hero-stats')
                )) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.06}s`;
                }

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Glass bubbles that drift with scroll within the ocean zone
 */
function initBubbles() {
    const oceanZone = document.getElementById('oceanZone');
    const bubblesLayer = document.getElementById('bubblesLayer');
    if (!oceanZone || !bubblesLayer) return;

    const bubbleCount = window.innerWidth < 768 ? 3 : 5;
    const bubbles = [];

    const configs = [
        { size: 72, left: 0.08, top: 0.15, drift: 0.35 },
        { size: 48, left: 0.82, top: 0.22, drift: 0.28 },
        { size: 96, left: 0.65, top: 0.55, drift: 0.42 },
        { size: 56, left: 0.18, top: 0.68, drift: 0.3 },
        { size: 40, left: 0.45, top: 0.38, drift: 0.25 },
    ];

    for (let i = 0; i < bubbleCount; i++) {
        const cfg = configs[i];
        const el = document.createElement('div');
        el.className = 'bubble';
        el.style.width = `${cfg.size}px`;
        el.style.height = `${cfg.size}px`;
        bubblesLayer.appendChild(el);
        bubbles.push({
            el,
            baseLeft: cfg.left,
            baseTop: cfg.top,
            driftFactor: cfg.drift,
            floatOffset: Math.random() * Math.PI * 2,
        });
    }

    const reducedMotion = prefersReducedMotion();
    let animId = null;

    function positionBubbles() {
        const zoneHeight = oceanZone.offsetHeight;
        const zoneWidth = oceanZone.offsetWidth;
        const scrollProgress = window.pageYOffset / Math.max(zoneHeight, 1);

        bubbles.forEach((b) => {
            const floatY = reducedMotion ? 0 : Math.sin(Date.now() * 0.0008 + b.floatOffset) * 10;
            const scrollDrift = scrollProgress * 60 * b.driftFactor;
            const left = b.baseLeft * zoneWidth - parseFloat(b.el.style.width) / 2;
            const top = b.baseTop * zoneHeight + scrollDrift + floatY - parseFloat(b.el.style.height) / 2;
            b.el.style.left = `${left}px`;
            b.el.style.top = `${top}px`;
        });
    }

    function startFloatLoop() {
        if (reducedMotion || animId) return;
        function loop() {
            positionBubbles();
            animId = requestAnimationFrame(loop);
        }
        loop();
    }

    function stopFloatLoop() {
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    window.addEventListener('scroll', positionBubbles, { passive: true });
    window.addEventListener('resize', positionBubbles, { passive: true });
    positionBubbles();
    startFloatLoop();

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches) {
            stopFloatLoop();
        } else {
            startFloatLoop();
        }
        positionBubbles();
    });
}

/**
 * Hero stats count-up on first view
 */
function initStatsCounter() {
    const statsContainer = document.getElementById('heroStats');
    if (!statsContainer) return;

    const statValues = statsContainer.querySelectorAll('.hero-stat-value');

    function setFinalValues() {
        statValues.forEach(el => {
            const target = el.dataset.target;
            const suffix = el.dataset.suffix || '';
            el.textContent = `${target}${suffix}`;
        });
    }

    if (prefersReducedMotion()) {
        setFinalValues();
        return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats(statValues, 4500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsContainer);
}

function animateStats(elements, duration) {
    const startTime = performance.now();

    const targets = Array.from(elements).map(el => ({
        el,
        target: parseInt(el.dataset.target, 10),
        suffix: el.dataset.suffix || '',
    }));

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);

        targets.forEach(({ el, target, suffix }) => {
            const current = Math.round(eased * target);
            el.textContent = `${current}${suffix}`;
        });

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            targets.forEach(({ el, target, suffix }) => {
                el.textContent = `${target}${suffix}`;
            });
        }
    }

    requestAnimationFrame(tick);
}

/**
 * Inline clamshell email reveal
 */
function initClamshell() {
    const contact = document.getElementById('clamshellContact');
    const trigger = document.getElementById('clamshellTrigger');
    const reveal = document.getElementById('clamshellReveal');
    const copyBtn = document.getElementById('copyEmailBtn');
    const feedback = document.getElementById('copyFeedback');
    const email = 'aaron@pixelscene.media';

    if (!contact || !trigger || !reveal) return;

    trigger.addEventListener('click', () => {
        const isOpen = contact.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            reveal.removeAttribute('hidden');
        } else {
            reveal.setAttribute('hidden', '');
            if (feedback) feedback.textContent = '';
        }
    });

    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            if (feedback) {
                feedback.textContent = 'Copied!';
                setTimeout(() => { feedback.textContent = ''; }, 2000);
            }
        } catch {
            if (feedback) {
                feedback.textContent = 'Copy failed. Select the email above.';
            }
        }
    });
}

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
    }
});
