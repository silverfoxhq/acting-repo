/**
 * BrieflyObsessed, Main JavaScript
 * Navigation, ocean bubbles, stats counter, clamshell contact
 */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initNavigation();
    initCampaignStats();
    initScrollReveal();
    initSmoothScroll();
    initHeroStatsCounter(prefersReducedMotion);
    initBubbles(prefersReducedMotion);
    initClamshell(prefersReducedMotion);
});

function initNavigation() {
    const nav = document.getElementById('nav');
    const navMenu = document.getElementById('navMenu');
    const calmZone = document.querySelector('.calm-zone');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        if (calmZone) {
            const calmTop = calmZone.getBoundingClientRect().top;
            nav.classList.toggle('nav--calm', calmTop <= 80);
        }

        updateActiveNavLink();
    }, { passive: true });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll(
        '.campaign-card, .service-card, .client-logo, .hero-stat'
    );

    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

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

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
}

function initHeroStatsCounter(prefersReducedMotion) {
    const statsContainer = document.getElementById('heroStats');
    if (!statsContainer) return;

    const statValues = statsContainer.querySelectorAll('.hero-stat-value');
    let hasAnimated = false;

    const showFinalValues = () => {
        statValues.forEach(el => {
            const value = el.dataset.value;
            const suffix = el.dataset.suffix || '';
            el.textContent = `${value}${suffix}`;
        });
    };

    if (prefersReducedMotion) {
        showFinalValues();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters(statValues, 4500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsContainer);
}

function animateCounters(elements, duration) {
    const startTime = performance.now();

    const targets = Array.from(elements).map(el => ({
        el,
        target: parseInt(el.dataset.value, 10),
        suffix: el.dataset.suffix || ''
    }));

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        targets.forEach(({ el, target, suffix }) => {
            const current = Math.round(target * eased);
            el.textContent = `${current}${suffix}`;
        });

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

function initBubbles(prefersReducedMotion) {
    const oceanZone = document.getElementById('oceanZone');
    const bubblesLayer = document.getElementById('bubblesLayer');
    if (!oceanZone || !bubblesLayer || prefersReducedMotion) return;

    const bubbleCount = window.innerWidth < 768 ? 8 : 14;
    const bubbles = [];
    const magnifyTargets = oceanZone.querySelectorAll(
        'h1, h2, h3, p, .btn, img, .hero-stat, .campaign-poster'
    );

    const configs = [
        { size: 72, x: 0.08, y: 0.12, drift: 0.385 },
        { size: 96, x: 0.82, y: 0.08, drift: 0.308 },
        { size: 56, x: 0.62, y: 0.38, drift: 0.462 },
        { size: 84, x: 0.22, y: 0.52, drift: 0.352 },
        { size: 64, x: 0.92, y: 0.62, drift: 0.418 },
        { size: 48, x: 0.45, y: 0.22, drift: 0.396 },
        { size: 88, x: 0.35, y: 0.72, drift: 0.374 },
        { size: 52, x: 0.72, y: 0.28, drift: 0.440 },
        { size: 76, x: 0.15, y: 0.85, drift: 0.330 },
        { size: 60, x: 0.55, y: 0.48, drift: 0.407 },
        { size: 44, x: 0.38, y: 0.15, drift: 0.451 },
        { size: 68, x: 0.88, y: 0.35, drift: 0.363 },
        { size: 80, x: 0.05, y: 0.45, drift: 0.429 },
        { size: 54, x: 0.68, y: 0.78, drift: 0.385 }
    ];

    for (let i = 0; i < bubbleCount; i++) {
        const cfg = configs[i];
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = `${cfg.size}px`;
        bubble.style.height = `${cfg.size}px`;
        bubblesLayer.appendChild(bubble);
        bubbles.push({ el: bubble, ...cfg });
    }

    let ticking = false;
    const speedFactor = 1.1;

    function bubbleOverlapsContent(bubbleRect) {
        const cx = bubbleRect.left + bubbleRect.width / 2;
        const cy = bubbleRect.top + bubbleRect.height / 2;

        for (const target of magnifyTargets) {
            const rect = target.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const pad = 12;
            if (
                cx >= rect.left - pad &&
                cx <= rect.right + pad &&
                cy >= rect.top - pad &&
                cy <= rect.bottom + pad
            ) {
                return true;
            }
        }
        return false;
    }

    function updateBubbles() {
        const zoneRect = oceanZone.getBoundingClientRect();
        const zoneTop = window.pageYOffset + zoneRect.top;
        const zoneHeight = oceanZone.offsetHeight;
        const scrollY = window.pageYOffset;
        const time = Date.now();

        bubbles.forEach((b, i) => {
            const baseX = b.x * window.innerWidth;
            const baseY = b.y * zoneHeight;
            const scrollOffset = (scrollY - zoneTop) * b.drift;
            const floatY = Math.sin(time / (2000 / speedFactor) + i * 1.4) * 6;
            const floatX = Math.cos(time / (2800 / speedFactor) + i * 0.9) * 4;
            const y = baseY + scrollOffset * 0.165 + floatY;
            const x = baseX + floatX;

            const overlaps = bubbleOverlapsContent({
                left: x,
                top: y + zoneRect.top,
                width: b.size,
                height: b.size
            });

            b.el.classList.toggle('bubble--magnify', overlaps);
            const scale = overlaps ? 1.12 : 1;
            b.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        });

        ticking = false;
    }

    function onScrollOrResize() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateBubbles);
        }
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    function animateBubbles() {
        updateBubbles();
        requestAnimationFrame(animateBubbles);
    }

    animateBubbles();
}

function initClamshell(prefersReducedMotion) {
    const contact = document.getElementById('clamshellContact');
    const trigger = document.getElementById('clamshellTrigger');
    const reveal = document.getElementById('clamshellReveal');
    const prompt = trigger?.querySelector('.clamshell-prompt');
    const copyBtn = document.getElementById('copyEmailBtn');
    const email = 'aaron@pixelscene.media';

    if (!contact || !trigger || !reveal) return;

    trigger.addEventListener('click', () => {
        const isOpen = contact.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
        reveal.setAttribute('aria-hidden', String(!isOpen));
        if (prompt) {
            prompt.textContent = isOpen ? 'Close the shell' : 'Open the shell';
        }
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(email);
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('is-copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('is-copied');
                }, 2000);
            } catch {
                copyBtn.textContent = 'Copy failed';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
            }
        });
    }
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

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
    }
});
