/**
 * Briefly Obsessed — Main JavaScript
 * Navigation, scroll effects, campaign stat overlays, reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCampaignStats();
    initScrollReveal();
    initSmoothScroll();
});

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
        updateActiveNavLink();
    });

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

/**
 * Mobile tap fallback for hover stat overlays on featured campaigns
 */
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

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
    }
});
