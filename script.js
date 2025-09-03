// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initActiveNavigation();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Função para verificar se é mobile
    const isMobileView = () => window.innerWidth <= 992;

    // Inicialização baseada no tamanho da tela
    const initMenu = () => {
        if (isMobileView()) {
            navMenu.style.display = 'none';
            hamburger.style.display = 'flex';
        } else {
            navMenu.style.display = 'flex';
            hamburger.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Inicializar menu
    initMenu();

    // Apenas adiciona eventos se estiver em mobile
    if (isMobileView()) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = hamburger.classList.toggle('active');
            
            if (isActive) {
                navMenu.style.display = 'flex';
                setTimeout(() => {
                    navMenu.classList.add('active');
                }, 10);
                document.body.style.overflow = 'hidden';
            } else {
                navMenu.classList.remove('active');
                setTimeout(() => {
                    if (!navMenu.classList.contains('active')) {
                        navMenu.style.display = 'none';
                    }
                }, 300);
                document.body.style.overflow = '';
            }
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    navMenu.style.display = 'none';
                }, 300);
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    navMenu.style.display = 'none';
                }, 300);
            }
        });
    }

    // Atualizar visibilidade do menu ao redimensionar a janela
    window.addEventListener('resize', function() {
        if (isMobileView()) {
            if (!hamburger.classList.contains('active')) {
                navMenu.style.display = 'none';
            }
            hamburger.style.display = 'flex';
        } else {
            navMenu.style.display = 'flex';
            hamburger.style.display = 'none';
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for hero CTA button
    const heroBtn = document.querySelector('.hero .btn-primary');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('.btn');
    const formStatus = document.getElementById('formStatus');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors and status
        clearErrors();
        formStatus.style.display = 'none';
        
        // Validate form
        if (validateForm()) {
            // Show loading state
            showLoadingState(submitBtn);
            
            // Use Fetch API to submit the form data
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text().then(text => ({ ok: response.ok, status: response.status, text: text })))
            .then(response => {
                hideLoadingState(submitBtn);
                if (response.ok) {
                    showStatusMessage(true, response.text);
                    form.reset();
                } else {
                    showStatusMessage(false, response.text || 'Erro no servidor. Código: ' + response.status);
                }
            })
            .catch(error => {
                hideLoadingState(submitBtn);
                showStatusMessage(false, 'Erro de rede. Por favor, tente novamente.');
                console.error('Fetch Error:', error);
            });
        }
    });

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    messageInput.addEventListener('blur', () => validateMessage());

    function validateForm() {
        let isValid = true;
        
        if (!validateName()) isValid = false;
        if (!validateEmail()) isValid = false;
        if (!validateMessage()) isValid = false;
        
        return isValid;
    }

    function validateName() {
        const name = nameInput.value.trim();
        const nameError = document.getElementById('nameError');
        
        if (name.length < 2) {
            showError(nameError, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        hideError(nameError);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            showError(emailError, 'Por favor, insira um email válido');
            return false;
        }
        
        hideError(emailError);
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const messageError = document.getElementById('messageError');
        
        if (message.length < 10) {
            showError(messageError, 'Mensagem deve ter pelo menos 10 caracteres');
            return false;
        }
        
        hideError(messageError);
        return true;
    }

    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        errorElement.previousElementSibling.style.borderColor = '#dc2626';
    }

    function hideError(errorElement) {
        errorElement.classList.remove('show');
        errorElement.previousElementSibling.style.borderColor = '#e5e7eb';
    }

    function clearErrors() {
        const errorMessages = form.querySelectorAll('.error-message');
        const inputs = form.querySelectorAll('input, textarea');
        
        errorMessages.forEach(error => hideError(error));
        inputs.forEach(input => input.style.borderColor = '#e5e7eb');
    }

    function showLoadingState(btn) {
        btn.classList.add('loading');
        btn.disabled = true;
    }

    function hideLoadingState(btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
    }

    function showStatusMessage(isSuccess, message) {
        formStatus.style.display = 'block';
        formStatus.className = isSuccess ? 'form-status success' : 'form-status error';
        formStatus.textContent = message;
        
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 6000);
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.portfolio-card, .timeline-item, .cert-item, .hobby-item, .language-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
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
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// Portfolio Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Handle card link clicks
        const cardLink = card.querySelector('.card-link');
        if (cardLink) {
            cardLink.addEventListener('click', function(e) {
                e.preventDefault();
                // Here you could implement a modal or redirect to project details
                console.log('Projeto clicado:', card.querySelector('h3').textContent);
                
                // For demo purposes, show an alert
                alert(`Detalhes do projeto: ${card.querySelector('h3').textContent}\n\nEsta funcionalidade pode ser expandida para mostrar um modal com mais informações, galeria de imagens, código fonte, etc.`);
            });
        }
    });
});

// Typing Effect for Hero Title (Optional Enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid white';
    
    let index = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 500);
}

// Parallax Effect for Hero Section (Optional)
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled <= hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Theme Toggle (Optional - for future enhancement)
function initThemeToggle() {
    // This could be implemented to switch between light/dark themes
    // For now, it's commented out but structure is provided for future use
    
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Performance Optimization: Debounce Scroll Events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(function() {
    // Any heavy scroll calculations can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility Improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #2c5aa0';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2c5aa0;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// Error Handling and Fallbacks
window.addEventListener('error', function(e) {
    console.error('Erro na aplicação:', e.error);
    
    // Fallback para funcionalidades críticas
    if (e.error && e.error.message.includes('IntersectionObserver')) {
        // Fallback para animações se IntersectionObserver não estiver disponível
        const elements = document.querySelectorAll('.portfolio-card, .timeline-item');
        elements.forEach(el => el.classList.add('fade-in-up'));
    }
});

// Service Worker Registration (Optional - for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}