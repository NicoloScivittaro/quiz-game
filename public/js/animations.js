/**
 * Quiz Party - Script per animazioni ed effetti
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Animation script loaded');
    
    // Crea particelle fluttuanti di sfondo
    createParticles();
    
    // Aggiungi effetto ripple ai pulsanti
    initRippleEffect();
    
    // Inizializza animazioni di input
    initInputAnimations();
    
    // Aggiungi il toggle per la modalità scura
    initThemeToggle();
});

/**
 * Crea particelle fluttuanti di sfondo
 */
function createParticles() {
    // Crea un container per le particelle se non esiste
    let particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);
    }
    
    // Genera particelle casuali
    const particleCount = Math.min(window.innerWidth / 10, 50); // Limita il numero in base alla larghezza dello schermo
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posiziona casualmente
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        const delay = Math.random() * 5;
        const duration = 15 + Math.random() * 15;
        
        // Imposta stile casuale
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Colore casuale basato sui temi
        const colors = [
            '#8b5cf6', // purple
            '#06b6d4', // cyan
            '#fcd34d', // yellow
            '#a78bfa', // purple light
            '#22d3ee'  // cyan light
        ];
        
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particlesContainer.appendChild(particle);
    }
}

/**
 * Aggiungi effetto ripple ai pulsanti
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - button.getBoundingClientRect().left;
            const y = e.clientY - button.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            // Rimuovi l'elemento dopo l'animazione
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Animazioni per gli elementi di input
 */
function initInputAnimations() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Aggiungi la classe per l'animazione del bordo
        const wrapper = document.createElement('div');
        wrapper.className = 'input-animation';
        
        // Non alterare il DOM per gli input nei form esistenti
        if (!input.parentNode.classList.contains('input-animation')) {
            const parent = input.parentNode;
            parent.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }
        
        // Aggiungi classi animate.css quando l'input ottiene il focus
        input.addEventListener('focus', () => {
            input.classList.add('animate__animated', 'animate__pulse');
        });
        
        input.addEventListener('blur', () => {
            input.classList.remove('animate__animated', 'animate__pulse');
        });
    });
}

/**
 * Crea un toggle per la modalità scura (bonus)
 */
function initThemeToggle() {
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '🌙'; // Luna emoji per dark mode
    
    document.body.appendChild(toggleBtn);
    
    // Controlla se la modalità scura è già attiva
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        toggleDarkMode(true);
    }
    
    toggleBtn.addEventListener('click', () => {
        const currentMode = document.body.classList.contains('light-mode');
        toggleDarkMode(!currentMode);
    });
}

/**
 * Attiva/disattiva la modalità scura
 */
function toggleDarkMode(enableLight) {
    if (enableLight) {
        document.body.classList.add('light-mode');
        document.querySelector('.theme-toggle').innerHTML = '☀️'; // Sole emoji per light mode
        localStorage.setItem('darkMode', 'false');
    } else {
        document.body.classList.remove('light-mode');
        document.querySelector('.theme-toggle').innerHTML = '🌙'; // Luna emoji per dark mode
        localStorage.setItem('darkMode', 'true');
    }
}

/**
 * Effetto coriandoli per la vittoria
 */
function showConfetti() {
    const confettiCount = 150;
    const container = document.body;
    
    // Crea i coriandoli
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posizione e dimensione casuale
        const size = Math.random() * 10 + 5;
        const x = Math.random() * 100;
        
        // Colori casuali
        const colors = ['#8b5cf6', '#06b6d4', '#fcd34d', '#ef4444', '#10b981', '#f97316'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Applicazione stilistica
        confetti.style.left = `${x}vw`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.background = color;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(confetti);
        
        // Rimuovi i coriandoli dopo l'animazione
        setTimeout(() => {
            confetti.remove();
        }, 8000);
    }
}

/**
 * Animazione punteggio che vola verso l'alto
 */
function showScoreAnimation(points, x, y) {
    const scoreAnim = document.createElement('div');
    scoreAnim.className = 'score-animation';
    scoreAnim.textContent = `+${points}`;
    scoreAnim.style.color = points > 0 ? '#10b981' : '#ef4444';
    scoreAnim.style.left = `${x}px`;
    scoreAnim.style.top = `${y}px`;
    
    document.body.appendChild(scoreAnim);
    
    // Rimuovi dopo l'animazione
    setTimeout(() => {
        scoreAnim.remove();
    }, 1500);
}

/**
 * Animazione del timer
 */
function animateTimer(duration) {
    const timerContainer = document.querySelector('.timer-container');
    const timerBar = document.querySelector('.timer-bar');
    
    if (timerContainer && timerBar) {
        // Reset a 100%
        timerBar.style.width = '100%';
        
        // Anima a 0% per la durata
        setTimeout(() => {
            timerBar.style.width = '0%';
        }, 100);
    }
}

/**
 * Mostra una notifica animata
 */
function showAnimatedNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate__animated animate__fadeInUp`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-rimozione della notifica
    setTimeout(() => {
        notification.classList.remove('animate__fadeInUp');
        notification.classList.add('animate__fadeOutDown');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Esporta funzioni per essere usate globalmente
window.showConfetti = showConfetti;
window.showScoreAnimation = showScoreAnimation;
window.animateTimer = animateTimer;
window.showAnimatedNotification = showAnimatedNotification; 