document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio V3 dynamique chargé !');

    const nav = document.querySelector('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    // --- Gestion du menu de navigation ---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
            body.style.overflow = isActive ? 'hidden' : ''; // Empêche le scroll du body quand le menu est ouvert

            const icon = navToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                navToggle.setAttribute('aria-label', 'Fermer le menu');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });

        // Fermer le menu en cliquant sur un lien
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                body.style.overflow = '';
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'Ouvrir le menu');
            });
        });
    }

    // --- Effet de machine à écrire ---
    const subtitle = document.querySelector('header .subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.innerHTML = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                subtitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 500); // Délai avant de commencer
    }

    // --- Animation des éléments au défilement (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('section, .timeline-item, .skill-card, .project-card, .formation-card');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Ajoute un délai progressif pour un effet d'escalier
                entry.target.style.animation = `fadeInUp 0.8s ${index * 0.1}s cubic-bezier(0.23, 1, 0.32, 1) forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0'; // Cacher initialement
        observer.observe(el);
    });

    // --- Effet Parallax sur l'image de profil ---
    const profilePic = document.querySelector('.profile-pic');
    if(profilePic) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            profilePic.style.transform = `translateY(${scrollValue * 0.1}px) scale(1)`;
        });
    }

    // --- Validation et feedback du formulaire de contact ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const action = form.action;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            submitButton.innerHTML = 'Envoi en cours... <i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;

            fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    submitButton.innerHTML = 'Message Envoyé ! <i class="fas fa-check"></i>';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                            submitButton.innerHTML = 'Erreur, réessayez <i class="fas fa-times"></i>';
                        } else {
                            alert("Une erreur inconnue est survenue.");
                            submitButton.innerHTML = 'Erreur, réessayez <i class="fas fa-times"></i>';
                        }
                    })
                }
            }).catch(error => {
                alert("Une erreur est survenue lors de l'envoi.");
                submitButton.innerHTML = 'Erreur, réessayez <i class="fas fa-times"></i>';
            }).finally(() => {
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 3000);
            });
        });
    }
});

// Injection des keyframes pour l'animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`;
document.head.appendChild(styleSheet);
