/* ============================================
   AGEULK Website - JavaScript
   Parallax Scrolling, Theme Toggle, Mobile Menu
   ============================================ */

// ============================================
// Theme Toggle Functionality
// ============================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        htmlElement.style.colorScheme = 'dark';
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        htmlElement.style.colorScheme = 'light';
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// ============================================
// Mobile Menu Toggle
// ============================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
        navLinks.classList.remove('active');
    }
});

// ============================================
// Parallax Scrolling Effect with Optimization
// ============================================

let ticking = false;
let parallaxElements = [];

function initParallax() {
    parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
    
    if (parallaxElements.length === 0) return;

    parallaxElements.forEach(element => {
        element.style.willChange = 'transform';
    });

    function updateParallax() {
        parallaxElements.forEach(element => {
            const parallaxValue = parseFloat(element.dataset.parallax) || 0;
            const rect = element.getBoundingClientRect();

            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                return;
            }

            const yOffset = Math.round(-rect.top * parallaxValue);
            element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Initial call
}

// ============================================
// Enhanced Smooth Scroll with Easing Function
// ============================================

// Easing function for smooth animations
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetElement, duration = 1000) {
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = targetElement.getBoundingClientRect().top + startY - 80;
    const distance = targetY - startY;
    
    let startTime = null;
    
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + distance * ease);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

function enhanceSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only prevent default if target exists
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target, 800);
            }
        });
    });
}

// ============================================
// Navigation Active State on Scroll
// ============================================

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let activeTicking = false;

    function updateActive() {
        let current = '';
        const scrollPosition = window.scrollY || window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
        activeTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!activeTicking) {
            requestAnimationFrame(updateActive);
            activeTicking = true;
        }
    }, { passive: true });
    updateActive();
}

// ============================================
// Intersection Observer for Fade-in Effects
// ============================================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.committee-card, .service-card, .contact-card, .feature-card, .leader-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ============================================
// CTA Button Functionality
// ============================================

function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to about section with smooth animation
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                smoothScrollTo(aboutSection, 1000);
            }
        });
    }
}

// ============================================
// Navbar Background Animation on Scroll with Throttling
// ============================================

let navbarThrottled = false;

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    function updateNavbarStyle() {
        if (window.scrollY > 50) {
            navbar.style.background = body.classList.contains('dark-theme') 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 102, 204, 0.15)';
        } else {
            navbar.style.background = body.classList.contains('dark-theme') 
                ? 'rgba(15, 23, 42, 0.7)' 
                : 'rgba(255, 255, 255, 0.7)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }
        navbarThrottled = false;
    }

    window.addEventListener('scroll', () => {
        if (!navbarThrottled) {
            requestAnimationFrame(updateNavbarStyle);
            navbarThrottled = true;
        }
    }, { passive: true });
}

// ============================================
// Scroll to Top Button
// ============================================

function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scrollToTop';
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.title = 'Scroll to top';
    document.body.appendChild(scrollButton);

    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #0066CC, #22C55E);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 999;
            box-shadow: 0 5px 20px rgba(0, 102, 204, 0.3);
        }

        .scroll-to-top.show {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 102, 204, 0.4);
        }

        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 1.2rem;
            }
        }
    `;
    document.head.appendChild(scrollStyle);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    }, { passive: true });

    scrollButton.addEventListener('click', () => {
        smoothScrollTo(document.documentElement, 1200);
    });
}

// ============================================
// Responsive Functions
// ============================================

function checkResponsive() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && navLinks.classList.contains('active')) {
        // Mobile menu is open
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

window.addEventListener('resize', checkResponsive, { passive: true });

// ============================================
// Keyboard Navigation Support
// ============================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
}

// ============================================
// Performance Optimization - Throttle Scroll Events
// ============================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ============================================
// Initialize All Features on Page Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('AGEULK Website Initialized');
    
    initializeTheme();
    initParallax();
    enhanceSmoothScroll();
    updateActiveNavigation();
    initIntersectionObserver();
    initCTAButton();
    initNavbarScroll();
    initScrollToTop();
    checkResponsive();
    initKeyboardNavigation();
});

// ============================================
// Performance Optimization
// ============================================

// Prefers Reduced Motion Support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.querySelectorAll('[style*="animation"], [style*="transition"]').forEach(el => {
        el.style.animationDuration = '0.01ms';
        el.style.transitionDuration = '0.01ms';
    });
}

// ============================================
// Accessibility - Focus Visible
// ============================================

document.addEventListener('keydown', () => {
    document.body.classList.add('keyboard-nav');
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// Performance Monitoring
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}