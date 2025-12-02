document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio V2 chargé et prêt !');

    // Effet de machine à écrire
    const subtitle = document.querySelector('header .subtitle');
    if (subtitle) {
        const text = "Développeur Desktop (Python), Mobile (Flutter), Chatbot et IA (ML)";
        subtitle.innerHTML = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                subtitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    // Barre de navigation qui change au défilement
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Animation des sections au défilement (Fade In Up)
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0'; // Cacher initialement
        observer.observe(section);
    });

    // Forcer le téléchargement du CV
    const cvBtn = document.querySelector('.cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Empêche le comportement par défaut du lien
            const link = document.createElement('a');
            link.href = this.href;
            link.download = 'CV_Jonathan_MUSUMBA.pdf'; // Nom du fichier à télécharger
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Logique du menu Hamburger
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
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
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'Ouvrir le menu');
            });
        });
    }
});

// Keyframe pour l'animation (le CSS est prioritaire, mais c'est une sécurité)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`;
document.head.appendChild(styleSheet);
