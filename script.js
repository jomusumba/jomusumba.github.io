// ===== PORTFOLIO JONATHAN MUSUMBA - SCRIPT PRINCIPAL =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio chargé avec succès!');

    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ===== NAVIGATION =====
    const nav = document.getElementById('mainNav');
    const navToggle = document.querySelector('.nav-toggle');
    const navDrawer = document.querySelector('.nav-drawer');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const scrollProgress = document.querySelector('.scroll-progress');
    const heroImage = document.querySelector('.hero-image');
    const heroCircle = document.querySelector('.hero-bg-circle');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Gestion du scroll pour la navbar + progress + parallax (throttled with rAF)
    let lastScroll = 0;
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                if (scrollProgress) {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
                    scrollProgress.style.width = `${progress}%`;
                }

                if (heroImage || heroCircle) {
                    const offset = Math.min(currentScroll * 0.1, 40);
                    if (heroImage) {
                        heroImage.style.transform = `translateY(${offset}px)`;
                    }
                    if (heroCircle) {
                        heroCircle.style.transform = `translate(-50%, -50%) translateY(${offset * -0.6}px)`;
                    }
                }

                // Scroll to top button
                if (scrollToTopBtn) {
                    if (currentScroll > 500) {
                        scrollToTopBtn.classList.add('visible');
                    } else {
                        scrollToTopBtn.classList.remove('visible');
                    }
                }

                lastScroll = currentScroll;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Toggle du menu mobile
    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = document.body.classList.contains('nav-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (navClose) {
            navClose.addEventListener('click', closeMenu);
        }

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                closeMenu();
            }
        });

        function openMenu() {
            document.body.classList.add('nav-open');
            navToggle.setAttribute('aria-expanded', 'true');
            navDrawer.setAttribute('aria-hidden', 'false');
            if (navBackdrop) {
                navBackdrop.setAttribute('aria-hidden', 'false');
            }
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navDrawer.setAttribute('aria-hidden', 'true');
            if (navBackdrop) {
                navBackdrop.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
        }
    }

    // Mode neon toggle + toast notification
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const toastEl = document.getElementById('toast');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'neon') {
        document.body.classList.add('neon');
    }
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('neon');
            const isNeon = document.body.classList.contains('neon');
            localStorage.setItem('theme', isNeon ? 'neon' : 'default');
            themeToggles.forEach(btn => btn.setAttribute('aria-pressed', isNeon ? 'true' : 'false'));
            showToast(isNeon ? 'Mode Neon activé ⚡' : 'Mode par défaut activé ☀️');
        });
    });

    function showToast(message) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('show');
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2500);
    }

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // ===== EFFET DE MACHINE À ÉCRIRE =====
    const typingText = document.querySelector('.typing-text');
    
    if (typingText) {
        const texts = [
            "Développeur Desktop (Python) 🐍",
            "Développeur Mobile (Flutter) 📱",
            "Spécialiste IA & Machine Learning 🤖",
            "Créateur de Chatbots 💬",
            "CEO d'EJYISOFT 🚀"
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause à la fin du mot
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause avant le prochain mot
            }

            setTimeout(type, typingSpeed);
        }

        // Démarrer l'effet
        setTimeout(type, 1000);
    }

    // ===== TERMINAL TYPING =====
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
        const lines = terminalOutput.dataset.lines ? terminalOutput.dataset.lines.split('|') : [];
        let lineIndex = 0;
        let charIndex = 0;
        terminalOutput.textContent = '';

        const typeLine = () => {
            if (lineIndex >= lines.length) {
                return;
            }

            const line = lines[lineIndex];
            const isPrompt = lineIndex % 2 === 0;
            const prefix = isPrompt ? '$ ' : '';

            if (charIndex <= line.length) {
                const current = line.substring(0, charIndex);
                terminalOutput.textContent = terminalOutput.textContent.split('\n').slice(0, -1).join('\n');
                const existing = terminalOutput.textContent ? terminalOutput.textContent + '\n' : '';
                terminalOutput.textContent = existing + prefix + current;
                charIndex++;
                setTimeout(typeLine, isPrompt ? 35 : 20);
            } else {
                terminalOutput.textContent += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 300);
            }
        };

        setTimeout(typeLine, 500);
    }

    // ===== SCROLL TO TOP BUTTON =====
    if (scrollToTopBtn) {

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== ANIMATIONS AU SCROLL (Intersection Observer) =====
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateOnScroll.unobserve(entry.target); // Animer une seule fois
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Cibles pour l'animation
    const elementsToAnimate = document.querySelectorAll('.section-title, .exp-card, .skill-card, .project-card, .formation-card, .stat-card, .about-text, .about-timeline, .hero-content, .impact-card, .service-card, .stack-card, .case-card, .process-step, .testimonial-card, .faq-item, .cv-card, .terminal-window, .contact-item, .contact-form');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll'); // Classe de base pour CSS
        animateOnScroll.observe(el);
    });

    // ===== ANIMATION DES CHIFFRES (COMPTEURS) =====
    const countCards = document.querySelectorAll('[data-count]');
    const countUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.querySelector('.count');
                const finalValue = parseInt(entry.target.getAttribute('data-count'), 10);

                if (target && !isNaN(finalValue)) {
                    let currentValue = 0;
                    const duration = 1600;
                    const frameRate = 30;
                    const totalFrames = duration / (1000 / frameRate);
                    const increment = finalValue / totalFrames;

                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            target.textContent = finalValue;
                            clearInterval(counter);
                        } else {
                            target.textContent = Math.floor(currentValue);
                        }
                    }, 1000 / frameRate);
                }

                countUpObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    countCards.forEach(card => countUpObserver.observe(card));

    // ===== FAQ ACCORDION =====
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            if (!item) {
                return;
            }
            const isOpen = item.classList.contains('open');
            item.classList.toggle('open');
            button.setAttribute('aria-expanded', (!isOpen).toString());
        });
    });

    // ===== SMOOTH SCROLL POUR TOUS LES LIENS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const offsetTop = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== EXPORT PDF CV =====
    const cvPrintBtn = document.getElementById('cvPrint');
    if (cvPrintBtn) {
        cvPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ===== FORMULAIRE DE CONTACT =====
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnHTML = btn.innerHTML;

            // Validation simple côté client
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            if (!name || !email || !message) {
                showFormMessage('Veuillez remplir tous les champs.', 'error');
                return;
            }

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            btn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormMessage('Message envoyé avec succès !', 'success');
                    form.reset();
                } else {
                    showFormMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la soumission du formulaire:', error);
                showFormMessage('Une erreur réseau est survenue.', 'error');
            })
            .finally(() => {
                btn.innerHTML = originalBtnHTML;
                btn.disabled = false;
            });
        });
    }

    function showFormMessage(message, type) {
        if (formResult) {
            formResult.textContent = message;
            formResult.className = `form-result ${type}`;
            formResult.style.display = 'block';

            setTimeout(() => {
                formResult.style.display = 'none';
            }, 5000);
        }
    }

    // ===== PROJECT FILTERS =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('filter-hidden');
                } else {
                    const categories = card.getAttribute('data-category') || '';
                    if (categories.includes(filter)) {
                        card.classList.remove('filter-hidden');
                    } else {
                        card.classList.add('filter-hidden');
                    }
                }
            });
        });
    });
});
