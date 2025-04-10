// Controllo di debug per API_URL
console.log('index.js caricato. API_URL è:', typeof API_URL !== 'undefined' ? API_URL : 'non definito');

// Variabili per le impostazioni di gioco
let playerCount = 2;
let starCount = 3;
let initialCredits = 50;
let timerEnabled = true;
let players = [];
let availableCategories = [];

// Array di emoji per gli avatar
const avatarOptions = ['🐱', '🐶', '🐼', '🦊', '🦁', '🐯', '🐨', '🐮', '🐷', '🐸', '🐙', '🦄', '🐢', '🦋', '🐬'];

// Array di colori per gli avatar
const colorOptions = [
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#fcd34d', // yellow
    '#ef4444', // red
    '#10b981', // green
    '#f97316', // orange
    '#ec4899', // pink
    '#3b82f6', // blue
    '#a78bfa', // purple light
    '#22d3ee'  // cyan light
];

// Funzione per inizializzare la pagina
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game setup page loaded');
    
    // Aggiungi effetto di sguardo sparkling al titolo
    addSparkleEffect();
    
    // Inizializza il contatore stelle con animazione
    updateStarsPreview();
    
    // Inizializza il selettore di giocatori
    const playerCountSelect = document.getElementById('playerCount');
    playerCountSelect.addEventListener('change', function() {
        playerCount = parseInt(playerCountSelect.value);
        console.log(`Player count updated to ${playerCount}`);
        
        // Animazione per evidenziare il cambiamento
        playerCountSelect.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            playerCountSelect.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    });
    
    // Inizializza il contatore di stelle
    const starCountInput = document.getElementById('starCount');
    starCountInput.addEventListener('input', function() {
        starCount = parseInt(starCountInput.value);
        if (starCount < 1) starCount = 1;
        if (starCount > 10) starCount = 10;
        starCountInput.value = starCount;
        console.log(`Star count updated to ${starCount}`);
        updateStarsPreview();
    });
    
    // Inizializza l'input dei crediti iniziali
    const initialCreditsInput = document.getElementById('initialCredits');
    initialCreditsInput.addEventListener('input', function() {
        initialCredits = parseInt(initialCreditsInput.value);
        if (initialCredits < 10) initialCredits = 10;
        if (initialCredits > 500) initialCredits = 500;
        initialCreditsInput.value = initialCredits;
        console.log(`Initial credits updated to ${initialCredits}`);
    });
    
    // Inizializza il toggle del timer
    const timerEnabledToggle = document.getElementById('timerEnabled');
    const timerStatus = document.getElementById('timerStatus');
    timerEnabledToggle.addEventListener('change', function() {
        timerEnabled = timerEnabledToggle.checked;
        timerStatus.textContent = timerEnabled ? 'Attivo' : 'Disattivato';
        console.log(`Timer ${timerEnabled ? 'enabled' : 'disabled'}`);
    });
    
    // Carica le categorie disponibili
    initCategories();
    
    // Pulsante continua
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.addEventListener('click', function() {
        // Verifica che almeno una categoria sia selezionata
        const selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) {
            showAnimatedNotification('Seleziona almeno una categoria per giocare!', 'error');
            return;
        }
        
        // Salva le categorie selezionate
        availableCategories = selectedCategories;
        
        // Ripple effect visibile
        const x = event.clientX - continueBtn.getBoundingClientRect().left;
        const y = event.clientY - continueBtn.getBoundingClientRect().top;
        
        showPlayerSetup();
    });
    
    // Pulsante indietro
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', function() {
        hidePlayerSetup();
    });
    
    // Pulsante inizia gioco
    const startGameBtn = document.getElementById('startGameBtn');
    startGameBtn.addEventListener('click', function() {
        if (validatePlayers()) {
            savePlayers();
            window.location.href = 'game.html';
        }
    });
});

// Funzione per aggiungere effetto sparkling al titolo
function addSparkleEffect() {
    const title = document.querySelector('h1');
    title.addEventListener('mouseover', function() {
        createSparkles(title);
    });
}

// Crea effetto scintillante intorno all'elemento
function createSparkles(element) {
    const sparkleCount = 20;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.position = 'absolute';
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.borderRadius = '50%';
        sparkle.style.backgroundColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        sparkle.style.opacity = 0;
        
        // Posizione casuale intorno all'elemento
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 50;
        const x = rect.left + rect.width/2 + Math.cos(angle) * radius;
        const y = rect.top + rect.height/2 + Math.sin(angle) * radius;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.zIndex = 1000;
        
        document.body.appendChild(sparkle);
        
        // Animazione
        const keyframes = [
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1, offset: 0.1 },
            { transform: 'scale(0.8)', opacity: 0.8, offset: 0.5 },
            { transform: 'scale(0)', opacity: 0, offset: 1 }
        ];
        
        const timing = {
            duration: 1000 + Math.random() * 500,
            iterations: 1
        };
        
        sparkle.animate(keyframes, timing).onfinish = function() {
            sparkle.remove();
        };
    }
}

// Carica le categorie disponibili
async function initCategories() {
    console.log('Inizio funzione initCategories (ex-loadCategories) in index.js...');
    const categoryContainer = document.getElementById('categoryCheckboxes');
    
    if (!categoryContainer) {
        console.error('Elemento categoryCheckboxes non trovato nel DOM!');
        return;
    }
    
    // Mostra indicatore di caricamento
    categoryContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading">
                <div></div><div></div><div></div><div></div>
            </div>
            <p>Caricamento categorie...</p>
        </div>
    `;
    
    try {
        // Usiamo la funzione loadCategories da common.js
        console.log('Chiamata a loadCategories da common.js...');
        // Note: loadCategories è disponibile globalmente perché common.js è caricato prima di index.js
        const categories = await loadCategories();
        console.log('Categories loaded:', categories);
        
        // Rimuovi l'indicatore di caricamento
        categoryContainer.innerHTML = '';
        
        if (categories && categories.length > 0) {
            console.log(`Rendering ${categories.length} categorie...`);
            categories.forEach((category, index) => {
                const checkboxId = `category-${index}`;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = checkboxId;
                checkbox.value = category;
                checkbox.className = 'category-checkbox';
                checkbox.checked = true; // Seleziona tutte le categorie di default
                
                const label = document.createElement('label');
                label.htmlFor = checkboxId;
                label.className = 'category-label';
                label.innerHTML = `<i class="fas fa-tag"></i> ${category}`;
                
                categoryContainer.appendChild(checkbox);
                categoryContainer.appendChild(label);
                
                // Animazione sequenziale
                setTimeout(() => {
                    label.classList.add('animate__animated', 'animate__fadeIn');
                }, index * 100);
            });
            console.log('Rendering categorie completato');
        } else {
            console.warn('Nessuna categoria trovata!');
            categoryContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Nessuna categoria disponibile. Aggiungine alcune nella sezione Gestisci Domande</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categoryContainer.innerHTML = `
            <div class="empty-state error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Errore durante il caricamento delle categorie</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Ottieni le categorie selezionate
function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('.category-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Aggiorna la visualizzazione delle stelle obiettivo
function updateStarsPreview() {
    const starsPreview = document.getElementById('starsPreview');
    starsPreview.innerHTML = '';
    
    // Crea le stelle con animazione sequenziale
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '★';
        star.style.animationDelay = `${i * 0.2}s`;
        starsPreview.appendChild(star);
    }
}

// Mostra la schermata di impostazione giocatori
function showPlayerSetup() {
    console.log('Show player setup screen');
    
    // Anima la transizione da impostazioni a setup giocatori
    const gameSettings = document.getElementById('game-settings');
    const playerSetup = document.getElementById('player-setup');
    
    gameSettings.classList.add('animate__animated', 'animate__fadeOutLeft');
    setTimeout(() => {
        gameSettings.style.display = 'none';
        gameSettings.classList.remove('animate__animated', 'animate__fadeOutLeft');
        
        playerSetup.style.display = 'block';
        playerSetup.classList.add('animate__animated', 'animate__fadeInRight');
        
        // Genera i form dei giocatori
        generatePlayerForms();
        
        setTimeout(() => {
            playerSetup.classList.remove('animate__animated', 'animate__fadeInRight');
        }, 500);
    }, 500);
}

// Nascondi la schermata di impostazione giocatori
function hidePlayerSetup() {
    console.log('Hide player setup screen');
    
    // Anima la transizione da setup giocatori a impostazioni
    const gameSettings = document.getElementById('game-settings');
    const playerSetup = document.getElementById('player-setup');
    
    playerSetup.classList.add('animate__animated', 'animate__fadeOutRight');
    setTimeout(() => {
        playerSetup.style.display = 'none';
        playerSetup.classList.remove('animate__animated', 'animate__fadeOutRight');
        
        gameSettings.style.display = 'block';
        gameSettings.classList.add('animate__animated', 'animate__fadeInLeft');
        
        setTimeout(() => {
            gameSettings.classList.remove('animate__animated', 'animate__fadeInLeft');
        }, 500);
    }, 500);
}

// Genera i form per l'impostazione dei giocatori
function generatePlayerForms() {
    const playerForms = document.getElementById('player-forms');
    playerForms.innerHTML = '';
    players = [];
    
    for (let i = 0; i < playerCount; i++) {
        players.push({
            id: i + 1,
            name: `Giocatore ${i + 1}`,
            avatar: avatarOptions[i % avatarOptions.length],
            color: colorOptions[i % colorOptions.length]
        });
        
        const playerForm = document.createElement('div');
        playerForm.className = 'player-form animate__animated animate__fadeInUp';
        playerForm.style.animationDelay = `${i * 0.2}s`;
        
        playerForm.innerHTML = `
            <h3>Giocatore ${i + 1}</h3>
            <div class="form-control">
                <label for="playerName${i}">Nome:</label>
                <input type="text" id="playerName${i}" placeholder="Inserisci nome giocatore" value="Giocatore ${i + 1}" maxlength="15">
            </div>
            
            <label>Avatar:</label>
            <div class="avatar-selection" id="avatarSelection${i}">
                ${generateAvatarOptions(i)}
            </div>
            
            <label>Colore:</label>
            <div class="avatar-colors" id="colorSelection${i}">
                ${generateColorOptions(i)}
            </div>
        `;
        
        playerForms.appendChild(playerForm);
    }
    
    // Aggiungi gli event listener per avatar e colori
    for (let i = 0; i < playerCount; i++) {
        addAvatarSelectionEvents(i);
        addColorSelectionEvents(i);
    }
}

// Genera le opzioni avatar
function generateAvatarOptions(playerIndex) {
    let avatarHTML = '';
    
    for (let i = 0; i < avatarOptions.length; i++) {
        const isSelected = (i === playerIndex % avatarOptions.length) ? 'selected' : '';
        avatarHTML += `
            <div class="avatar-option ${isSelected}" data-avatar="${avatarOptions[i]}" style="background-color: ${players[playerIndex].color}">
                ${avatarOptions[i]}
            </div>
        `;
    }
    
    return avatarHTML;
}

// Genera le opzioni colore
function generateColorOptions(playerIndex) {
    let colorHTML = '';
    
    for (let i = 0; i < colorOptions.length; i++) {
        const isSelected = (i === playerIndex % colorOptions.length) ? 'selected' : '';
        colorHTML += `
            <div class="color-option ${isSelected}" data-color="${colorOptions[i]}" style="background-color: ${colorOptions[i]}"></div>
        `;
    }
    
    return colorHTML;
}

// Aggiungi eventi di selezione avatar
function addAvatarSelectionEvents(playerIndex) {
    const avatarOptions = document.querySelectorAll(`#avatarSelection${playerIndex} .avatar-option`);
    
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Rimuovi selezione precedente
            document.querySelectorAll(`#avatarSelection${playerIndex} .avatar-option`).forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Imposta nuova selezione
            this.classList.add('selected');
            
            // Aggiorna il player
            players[playerIndex].avatar = this.getAttribute('data-avatar');
            
            // Aggiorna il colore dell'avatar
            const selectedColor = players[playerIndex].color;
            this.style.backgroundColor = selectedColor;
            
            // Aggiungi un effetto di pulsazione
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });
}

// Aggiungi eventi di selezione colore
function addColorSelectionEvents(playerIndex) {
    const colorOptions = document.querySelectorAll(`#colorSelection${playerIndex} .color-option`);
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Rimuovi selezione precedente
            document.querySelectorAll(`#colorSelection${playerIndex} .color-option`).forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Imposta nuova selezione
            this.classList.add('selected');
            
            // Aggiorna il player
            const selectedColor = this.getAttribute('data-color');
            players[playerIndex].color = selectedColor;
            
            // Aggiorna il colore dell'avatar selezionato
            const selectedAvatar = document.querySelector(`#avatarSelection${playerIndex} .avatar-option.selected`);
            if (selectedAvatar) {
                selectedAvatar.style.backgroundColor = selectedColor;
            }
            
            // Aggiungi un effetto di pulsazione
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });
}

// Valida i dati dei giocatori
function validatePlayers() {
    let isValid = true;
    const playerNames = [];
    
    for (let i = 0; i < playerCount; i++) {
        const nameInput = document.getElementById(`playerName${i}`);
        const playerName = nameInput.value.trim();
        
        if (playerName === '') {
            nameInput.style.borderColor = 'var(--error)';
            isValid = false;
            
            // Animazione di scuotimento
            nameInput.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                nameInput.classList.remove('animate__animated', 'animate__shakeX');
            }, 1000);
            
            showAnimatedNotification(`Inserisci un nome per il Giocatore ${i + 1}`, 'error');
            return false;
        } else if (playerNames.includes(playerName)) {
            nameInput.style.borderColor = 'var(--error)';
            isValid = false;
            
            // Animazione di scuotimento
            nameInput.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                nameInput.classList.remove('animate__animated', 'animate__shakeX');
            }, 1000);
            
            showAnimatedNotification('I nomi dei giocatori devono essere unici', 'error');
            return false;
        } else {
            nameInput.style.borderColor = '';
            playerNames.push(playerName);
        }
    }
    
    return isValid;
}

// Salva i dati dei giocatori per il gioco
function savePlayers() {
    console.log('Saving player data');
    
    // Aggiorna i nomi dei giocatori
    for (let i = 0; i < playerCount; i++) {
        players[i].name = document.getElementById(`playerName${i}`).value.trim();
        players[i].credits = initialCredits; // Assegna i crediti iniziali
    }
    
    // Prepara i dati di gioco
    const gameData = {
        players: players,
        starCount: starCount,
        categories: availableCategories,
        timerEnabled: timerEnabled,
        initialCredits: initialCredits
    };
    
    // Salva in localStorage
    localStorage.setItem('quizPartyGameData', JSON.stringify(gameData));
    console.log('Game data saved:', gameData);
}