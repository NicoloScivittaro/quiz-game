/**
 * Quiz Party - Game Logic
 * Gestisce la logica del gioco e la board interattiva
 */

// Verifica che API_URL sia definita, altrimenti la definisce
if (typeof window.API_URL === 'undefined') {
    console.warn('API_URL non definita, utilizzo valore di fallback');
    window.API_URL = window.location.origin;
}

// Configurazione API
// const API_URL = 'http://localhost:3000/api';

// Configurazione dell'API
const API_URL = window.location.origin;

// Costanti di gioco
const BOARD_SIZE = 7; // Dimensione della griglia 7x7
const DICE_MIN = 1;
const DICE_MAX = 6;

// Variabili di stato del gioco
let gameData = null;
let players = [];
let currentPlayerIndex = 0;
let gameBoard = [];
let availableCategories = [];
let selectedCategories = [];
let starGoal = 3;
let diceRolling = false;
let gameStarted = false;
let currentQuestion = null; // Per tenere traccia della domanda corrente
let gameLog = []; // Array per memorizzare le attività di gioco
let timerEnabled = true;

// Posizioni speciali sulla board
let starPositions = [];
let specialPositions = [];

// Riferimenti UI
let gameBoardElement;
let diceButton;
let shopButton; // Riferimento al pulsante dello shop

// Gestore errori per diagnostica
window.onerror = function(message, source, lineno, colno, error) {
    console.error('ERRORE CATTURATO:', message);
    console.error('Fonte:', source);
    console.error('Linea:', lineno);
    console.error('Dettagli:', error);
    return false;
};

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
    initGameDOM();
});

// Alternativa per il caricamento
window.addEventListener('load', function() {
    if (!gameStarted) {
        console.log('Caricamento del gioco tramite evento load alternativo');
        initGameDOM();
    }
});

function initGameDOM() {
    console.log('Game page loaded');
    
    // Assegna riferimenti UI
    gameBoardElement = document.getElementById('gameBoard');
    diceButton = document.getElementById('diceButton');
    shopButton = document.getElementById('shopButton'); // Ottieni riferimento al pulsante shop
    
    // Carica dati di gioco da localStorage
    loadGameData();
    
    // Inizializza la scacchiera di gioco
    initGameBoard();
    
    // Renderizza le informazioni dei giocatori
    renderPlayerInfo();
    
    // Aggiunge i giocatori sulla scacchiera
    placePlayersOnBoard();
    
    // Inizializza gli eventi
    initEvents();
    
    // Avvia il gioco
    startGame();
}

/**
 * Carica i dati di gioco dal localStorage
 */
function loadGameData() {
    // Carica i dati del gioco base
    const savedData = localStorage.getItem('quizPartyGameData');
    
    // Verifica se esiste uno stato di gioco salvato precedentemente
    const savedGameState = localStorage.getItem('quizPartyGameState');
    if (savedGameState) {
        try {
            const gameState = JSON.parse(savedGameState);
            console.log('Stato di gioco precedente trovato:', gameState);
            
            // Se lo stato del gioco è recente (meno di 24 ore), carica i log
            const isRecent = (new Date().getTime() - gameState.timestamp) < (24 * 60 * 60 * 1000);
            if (isRecent && gameState.gameLog) {
                gameLog = gameState.gameLog;
                console.log('Game log caricato dallo stato precedente');
            }
        } catch (error) {
            console.error('Errore durante il caricamento dello stato di gioco:', error);
            // Se c'è un errore, inizializza un nuovo gameLog
            gameLog = [];
        }
    } else {
        // Inizializza il gameLog se non esiste uno stato precedente
        gameLog = [];
    }
    
    if (!savedData) {
        console.log('Nessun dato di gioco trovato, inizializzazione nuova partita');
        
        // Inizializza una nuova partita
        gameData = {
            players: [
                {
                    name: 'Giocatore 1',
                    avatar: '👤',
                    color: '#FF5733',
                    stars: 0,
                    stats: { correct: 0, incorrect: 0, moves: 0 },
                    credits: 50 // Imposta 50 crediti iniziali
                }
            ],
            categories: ["Storia", "Geografia", "Scienza", "Sport", "Arte", "Musica", "Cinema", "Letteratura"],
            starCount: 3,
            timerEnabled: true
        };
        
        // Salva i dati iniziali
        localStorage.setItem('quizPartyGameData', JSON.stringify(gameData));
        
        // Estrai dati
        players = gameData.players;
        availableCategories = gameData.categories;
        starGoal = gameData.starCount;
        timerEnabled = gameData.timerEnabled !== undefined ? gameData.timerEnabled : true;
        
        console.log('Nuova partita inizializzata:', gameData);
        return;
    }
    
    try {
        gameData = JSON.parse(savedData);
        console.log('Game data loaded:', gameData);
        
        // Estrai dati
        players = gameData.players;
        availableCategories = gameData.categories;
        starGoal = gameData.starCount || 3;
        timerEnabled = gameData.timerEnabled !== undefined ? gameData.timerEnabled : true;
        
        // Inizializza i dati mancanti per ogni giocatore
        players.forEach(player => {
            // Inizializza stelle se non presenti
            if (player.stars === undefined) {
                player.stars = 0;
            }
            
            // Inizializza statistiche se non presenti
            if (!player.stats) {
                player.stats = { correct: 0, incorrect: 0, moves: 0 };
            }
            
            // Inizializza crediti se non presenti
            if (player.credits === undefined) {
                player.credits = gameData.initialCredits || 50; // Usa i crediti iniziali impostati o 50 come fallback
            }
        });
        
        // Aggiorna l'obiettivo delle stelle nella UI
        const starGoalElement = document.getElementById('starGoal');
        if (starGoalElement) {
            starGoalElement.textContent = starGoal;
        }
        
        console.log('Dati di gioco inizializzati con successo:', players);
    } catch (error) {
        console.error('Error parsing game data:', error);
        showAnimatedNotification('Formato dati di gioco non valido', 'error');
    }
}

/**
 * Inizializza la board di gioco
 */
function initGameBoard() {
    if (!gameBoardElement) return;
    
    gameBoardElement.innerHTML = '';
    gameBoard = [];
    
    // Genera le caratteristiche casuali della board
    generateBoardFeatures();
    
    // Crea la scacchiera 7x7
    for (let row = 0; row < BOARD_SIZE; row++) {
        gameBoard[row] = [];
        
        for (let col = 0; col < BOARD_SIZE; col++) {
            const space = document.createElement('div');
            const position = { row, col };
            let spaceType = 'empty';
            
            // Determina il tipo di spazio
            if (isPositionInList(position, starPositions)) {
                spaceType = 'star';
            } else if (isPositionInList(position, specialPositions)) {
                spaceType = 'special';
            } else if (isEdgePosition(row, col) || isMiddleCross(row, col)) {
                spaceType = 'quiz';
            }
            
            // Imposta l'elemento spazio
            space.className = `space ${spaceType}`;
            space.dataset.row = row;
            space.dataset.col = col;
            space.dataset.type = spaceType;
            
            // Aggiungi iconа in base al tipo
            if (spaceType === 'quiz') {
                space.innerHTML = '<i class="fas fa-question"></i>';
            } else if (spaceType === 'star') {
                space.innerHTML = '<i class="fas fa-star"></i>';
            } else if (spaceType === 'special') {
                space.innerHTML = '<i class="fas fa-magic"></i>';
            }
            
            // Salva riferimento nella matrice
            gameBoard[row][col] = {
                element: space,
                type: spaceType,
                position: { row, col }
            };
            
            // Aggiungi alla scacchiera
            gameBoardElement.appendChild(space);
        }
    }
    
    console.log('Game board initialized');
    addToGameLog('Tabellone di gioco inizializzato');
}

/**
 * Attiva una casella quando viene cliccata
 * @param {Object} position - La posizione della casella
 */
function activateSpaceOnClick(position) {
    console.log("Attivazione casella in posizione:", position);
    const space = gameBoard[position.row] && gameBoard[position.row][position.col];
    if (!space) {
        console.error("Casella non trovata per la posizione:", position);
        return;
    }
    console.log("Casella trovata:", space);
    
    // Rimuove qualsiasi evidenziazione precedente
    document.querySelectorAll('.space').forEach(s => s.classList.remove('active'));
    
    space.element.classList.add('active');
    console.log("Casella evidenziata:", space.element);
    
    const player = players[currentPlayerIndex];
    
    if (diceRolling) {
        console.log("Il dado sta ancora girando");
        showAnimatedNotification('Attendi il completamento del lancio del dado', 'warning');
        return;
    }
    
    addToGameLog(`Attivata casella ${space.type} in posizione [${position.row}, ${position.col}]`);
    
    // Gestione dei diversi tipi di casella
    switch(space.type) {
        case 'quiz':
            // Mostra la domanda immediatamente
            console.log('Casella quiz: mostra domanda');
            showQuestion();
            break;
        case 'star':
            if (player.credits >= 150) {
                // Usa il modale personalizzato per l'acquisto della stella
                showStarPurchaseModal(player);
            } else {
                showAnimatedNotification('Non hai abbastanza crediti per acquistare questa stella!', 'error');
                addToGameLog(`${player.name} non ha abbastanza crediti per acquistare una stella`);
                nextPlayer();
            }
            break;
        case 'special':
            activateSpecialEffect();
            break;
        default:
            // Passa al prossimo giocatore
            addToGameLog(`${player.name} è atterrato su una casella vuota`);
            nextPlayer();
    }
}

/**
 * Genera caratteristiche della board (stelle e spazi speciali)
 */
function generateBoardFeatures() {
    starPositions = [];
    specialPositions = [];
    
    // Genera posizioni delle stelle (6-8 stelle)
    const starCount = Math.floor(Math.random() * 3) + 6;
    for (let i = 0; i < starCount; i++) {
        const position = generateRandomBoardPosition(starPositions);
        if (position && (isEdgePosition(position.row, position.col) || isMiddleCross(position.row, position.col))) {
            starPositions.push(position);
        }
    }
    
    // Genera posizioni speciali (4-6 posizioni)
    const specialCount = Math.floor(Math.random() * 3) + 4;
    for (let i = 0; i < specialCount; i++) {
        const position = generateRandomBoardPosition([...starPositions, ...specialPositions]);
        if (position && (isEdgePosition(position.row, position.col) || isMiddleCross(position.row, position.col))) {
            specialPositions.push(position);
        }
    }
    
    console.log('Star positions:', starPositions);
    console.log('Special positions:', specialPositions);
}

/**
 * Verifica se una posizione è sul bordo della board
 */
function isEdgePosition(row, col) {
    return row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;
}

/**
 * Verifica se una posizione fa parte della croce centrale
 */
function isMiddleCross(row, col) {
    const middle = Math.floor(BOARD_SIZE / 2);
    return row === middle || col === middle;
}

/**
 * Genera una posizione casuale sulla board che non è nell'elenco escluso
 */
function generateRandomBoardPosition(excludeList = []) {
    const validPositions = [];
    
    // Raccogli tutte le posizioni valide
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (isEdgePosition(row, col) || isMiddleCross(row, col)) {
                const position = { row, col };
                
                // Escludi le posizioni già nell'elenco
                if (!isPositionInList(position, excludeList)) {
                    validPositions.push(position);
                }
            }
        }
    }
    
    if (validPositions.length === 0) return null;
    
    // Scegli una posizione casuale
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    return validPositions[randomIndex];
}

/**
 * Controlla se una posizione è nell'elenco
 */
function isPositionInList(position, list) {
    return list.some(pos => pos.row === position.row && pos.col === position.col);
}

/**
 * Renderizza le informazioni dei giocatori
 */
function renderPlayerInfo() {
    const playerInfoContainer = document.getElementById('playerCards');
    if (!playerInfoContainer || !players.length) {
        console.error("Elemento playerCards non trovato o nessun giocatore disponibile");
        return;
    }
    
    playerInfoContainer.innerHTML = '';
    
    players.forEach((player, index) => {
        const isActive = index === currentPlayerIndex;
        
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${isActive ? 'active' : ''}`;
        playerCard.id = `player-${index}`;
        
        // Inizializza il punteggio delle stelle e le statistiche se non esistono
        if (player.stars === undefined) {
            player.stars = 0;
        }
        if (!player.stats) {
            player.stats = { correct: 0, incorrect: 0, moves: 0 };
        }
        
        // Verifica powerups e crea HTML
        let powerupsHTML = '';
        if (player.powerups) {
            if (player.powerups.shields && player.powerups.shields > 0) {
                powerupsHTML += `
                <p class="player-powerup">
                    <span><i class="fas fa-shield-alt" style="color: #4CAF50;"></i> Scudi:</span>
                    <span>${player.powerups.shields}</span>
                </p>`;
            }
            
            if (player.powerups.categoryChoice && player.powerups.categoryChoice > 0) {
                powerupsHTML += `
                <p class="player-powerup">
                    <span><i class="fas fa-list-alt" style="color: #2196F3;"></i> Scelta Categoria:</span>
                    <span>${player.powerups.categoryChoice}</span>
                </p>`;
            }
        }
        
        playerCard.innerHTML = `
            <h3>
                <span class="player-avatar" style="background-color: ${player.color}">
                    ${player.avatar}
                </span>
                ${player.name}
            </h3>
            <p>
                <span>Stelle:</span>
                <span class="star-count">
                    ${generateStarIcons(player.stars)}
                </span>
            </p>
            <p>
                <span>Risposte Corrette:</span>
                <span>${player.stats.correct || 0}</span>
            </p>
            <p>
                <span>Risposte Errate:</span>
                <span>${player.stats.incorrect || 0}</span>
            </p>
            <p>
                <span>Mosse:</span>
                <span>${player.stats.moves || 0}</span>
            </p>
            <p>
                <span>Crediti:</span>
                <span>${player.credits || 0} <i class="fas fa-gem" style="color: #3b82f6;"></i></span>
            </p>
            ${powerupsHTML}
        `;
        
        playerInfoContainer.appendChild(playerCard);
    });
    
    // Aggiorna anche l'indicatore del turno
    updateTurnIndicator();
    
    // Evidenzia la casella su cui si trova il giocatore attuale
    highlightCurrentPlayerSpace();
}

/**
 * Aggiorna l'indicatore del turno del giocatore
 */
function updateTurnIndicator() {
    const turnAnnouncement = document.getElementById('turnAnnouncement');
    const turnAvatar = document.getElementById('turnAvatar');
    const turnName = document.getElementById('turnName');
    
    if (!turnAnnouncement || !turnAvatar || !turnName || !players.length) {
        console.error("Elementi per l'indicazione del turno non trovati");
        return;
    }
    
    const currentPlayer = players[currentPlayerIndex];
    
    // Imposta i dati del giocatore corrente
    turnAvatar.style.backgroundColor = currentPlayer.color;
    turnAvatar.textContent = currentPlayer.avatar;
    turnName.textContent = currentPlayer.name;
    
    // Mostra l'annuncio del turno
    turnAnnouncement.classList.add('active');
    
    // Nascondi dopo 2 secondi
    setTimeout(() => {
        turnAnnouncement.classList.remove('active');
    }, 2000);
}

/**
 * Genera le icone delle stelle
 */
function generateStarIcons(starCount) {
    let stars = '';
    for (let i = 0; i < starCount; i++) {
        stars += '<i class="fas fa-star star-icon"></i>';
    }
    return stars;
}

/**
 * Posiziona i giocatori sulla scacchiera
 */
function placePlayersOnBoard() {
    // Rimuovi i giocatori esistenti
    const existingPlayers = document.querySelectorAll('.player');
    existingPlayers.forEach(p => p.remove());
    
    // Posizione iniziale (centro della board)
    const centerRow = Math.floor(BOARD_SIZE / 2);
    const centerCol = Math.floor(BOARD_SIZE / 2);
    
    // Crea e posiziona i giocatori
    players.forEach((player, index) => {
        // Salva la posizione iniziale nel giocatore se non esiste
        if (!player.position) {
            player.position = { row: centerRow, col: centerCol };
        }
        
        const playerElement = document.createElement('div');
        playerElement.className = 'player';
        playerElement.id = `player-token-${index}`;
        playerElement.textContent = player.avatar;
        playerElement.style.backgroundColor = player.color;
        
        // Offset circolare per posizionare i giocatori intorno al centro
        const offset = 10;
        const angle = (index / players.length) * Math.PI * 2;
        const offsetX = Math.cos(angle) * offset;
        const offsetY = Math.sin(angle) * offset;
        
        // Posiziona il giocatore sulla scacchiera
        const space = gameBoard[player.position.row][player.position.col].element;
        const spaceRect = space.getBoundingClientRect();
        const boardRect = gameBoardElement.getBoundingClientRect();
        
        playerElement.style.left = `${(spaceRect.left - boardRect.left) + (spaceRect.width / 2) - 17.5 + offsetX}px`;
        playerElement.style.top = `${(spaceRect.top - boardRect.top) + (spaceRect.height / 2) - 17.5 + offsetY}px`;
        
        gameBoardElement.appendChild(playerElement);
    });
}

/**
 * Inizializza gli eventi di gioco
 */
function initEvents() {
    // Pulsante per lanciare il dado
    if (diceButton) {
        diceButton.addEventListener('click', rollDice);
    }
    
    // Pulsante per aprire lo shop
    if (shopButton) {
        shopButton.addEventListener('click', function() {
            if (!diceRolling) {
                showShop();
            }
        });
    }
    
    // Pulsante torna alla home
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            if (confirm('Sei sicuro di voler abbandonare la partita?')) {
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Avvia il gioco
 */
function startGame() {
    gameStarted = true;
    currentPlayerIndex = 0;
    
    // Evidenzia il giocatore attuale
    highlightCurrentPlayer();
    
    // Abilita il lancio del dado
    if (diceButton) {
        diceButton.disabled = false;
    }
    
    // Mostra notifica di inizio
    showAnimatedNotification('Inizia il gioco! Tocca a ' + players[currentPlayerIndex].name, 'success');
}

/**
 * Evidenzia il giocatore corrente
 */
function highlightCurrentPlayer() {
    document.querySelectorAll('.player-card').forEach((card, index) => {
        card.classList.toggle('active', index === currentPlayerIndex);
    });
}

/**
 * Gestisce il tiro del dado
 */
function rollDice() {
    if (diceRolling || !gameStarted) return;
    
    diceRolling = true;
    diceButton.disabled = true;
    
    // Disabilita il pulsante dello shop durante il turno
    if (shopButton) {
        shopButton.disabled = true;
    }
    
    // Animazione del dado
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
        const randomValue = Math.floor(Math.random() * (DICE_MAX - DICE_MIN + 1)) + DICE_MIN;
        diceButton.textContent = randomValue;
        
        rollCount++;
        if (rollCount >= maxRolls) {
            clearInterval(rollInterval);
            const finalValue = Math.floor(Math.random() * (DICE_MAX - DICE_MIN + 1)) + DICE_MIN;
            diceButton.textContent = finalValue;
            
            // Dopo il lancio
            setTimeout(() => {
                diceRolling = false;
                movePlayer(finalValue);
            }, 500);
        }
    }, 100);
}

/**
 * Muove il giocatore corrente
 */
function movePlayer(steps) {
    const player = players[currentPlayerIndex];
    
    // Aggiorna contatori statistiche
    if (!player.stats) player.stats = { correct: 0, incorrect: 0, moves: 0 };
    player.stats.moves++;
    
    // Riproduci suono movimento
    playSound('move');
    
    // Aggiungi al log di gioco
    addToGameLog(`${player.name} sta iniziando a muoversi di ${steps} passi`);
    
    // Mostra sempre il selettore di direzione
    const possibleDirections = [
        { dr: 0, dc: 1, name: 'Destra' },
        { dr: 0, dc: -1, name: 'Sinistra' },
        { dr: 1, dc: 0, name: 'Giù' },
        { dr: -1, dc: 0, name: 'Su' }
    ];
    
    showDirectionSelector(possibleDirections, steps);
}

/**
 * Mostra il selettore di direzione
 */
function showDirectionSelector(directions, steps) {
    // Disabilita il pulsante shop durante la scelta della direzione
    if (shopButton) {
        shopButton.disabled = true;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'directionModal';
    
    let directionsHTML = '';
    directions.forEach((dir, index) => {
        directionsHTML += `
            <button class="direction-btn" data-index="${index}">
                <i class="fas fa-arrow-${dir.name === 'Su' ? 'up' : dir.name === 'Giù' ? 'down' : dir.name === 'Sinistra' ? 'left' : 'right'}"></i>
                ${dir.name}
            </button>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Scegli la direzione</h3>
            <p>Passi rimasti: <strong>${steps}</strong></p>
            <div class="direction-buttons">
                ${directionsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Aggiungi event listeners ai pulsanti
    const buttons = modal.querySelectorAll('.direction-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const dirIndex = parseInt(button.dataset.index);
            const direction = directions[dirIndex];
            
            // Rimuovi il modale
            modal.remove();
            
            // Muovi il giocatore nella direzione selezionata
            const player = players[currentPlayerIndex];
            player.remainingSteps = steps; // Salva i passi rimanenti
            const newPosition = moveInDirection(player.position, direction, steps);
            player.position = newPosition;
            updatePlayerPosition(currentPlayerIndex);
            renderPlayerInfo();
            
            // Controlla se i passi sono finiti dopo il movimento
            if (!player.remainingSteps || player.remainingSteps <= 0) {
                console.log("Movimento completato, controllo lo spazio");
                // Forza i passi rimanenti a 0 per sicurezza
                player.remainingSteps = 0;
                // Controlla immediatamente lo spazio per attivare la domanda
                checkSpace(player.position);
                
                // Riabilita il pulsante shop
                if (shopButton) {
                    shopButton.disabled = false;
                }
            } else {
                console.log("Il giocatore ha ancora " + player.remainingSteps + " passi da fare");
            }
        });
    });
}

/**
 * Muove il giocatore nella direzione specificata per un numero di passi
 */
function moveInDirection(startPosition, direction, steps) {
    let { row, col } = startPosition;
    const middle = Math.floor(BOARD_SIZE / 2);
    let remainingSteps = steps;
    let currentPosition = { row, col };
    let lastValidPosition = { row, col };
    
    // Muovi nella direzione selezionata per il numero di passi
    for (let i = 0; i < steps; i++) {
        const newRow = row + direction.dr;
        const newCol = col + direction.dc;
        
        // Verifica se la nuova posizione è valida (all'interno della board e su una casella valida)
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            // Verifica se la nuova posizione è su una casella valida (bordo o croce centrale)
            if (isEdgePosition(newRow, newCol) || isMiddleCross(newRow, newCol)) {
                lastValidPosition = { row, col };
                row = newRow;
                col = newCol;
                remainingSteps--;
                
                // Aggiorna la posizione visuale del giocatore ad ogni passo
                currentPosition = { row, col };
                
                // Se è l'ultimo passo, assegna questa posizione come finale e ferma il movimento
                if (remainingSteps === 0) {
                    break;
                }
            } else {
                // Se non è una casella valida, interrompiamo il movimento
                console.log("Posizione non valida: non è sul bordo o sulla croce centrale");
                break;
            }
        } else {
            // Se abbiamo raggiunto un bordo, interrompiamo il movimento
            console.log("Raggiunto un limite della board con " + remainingSteps + " passi rimanenti");
            break;
        }
    }
    
    // Aggiorna la posizione del giocatore
    const player = players[currentPlayerIndex];
    player.position = { row, col };
    player.remainingSteps = remainingSteps;
    updatePlayerPosition(currentPlayerIndex);
    
    // Se ci sono ancora passi da fare, mostra nuovamente il selettore di direzione
    if (remainingSteps > 0) {
        const possibleDirections = [
            { dr: 0, dc: 1, name: 'Destra' },
            { dr: 0, dc: -1, name: 'Sinistra' },
            { dr: 1, dc: 0, name: 'Giù' },
            { dr: -1, dc: 0, name: 'Su' }
        ];
        
        const validDirections = possibleDirections.filter(dir => {
            const nextRow = player.position.row + dir.dr;
            const nextCol = player.position.col + dir.dc;
            return nextRow >= 0 && nextRow < BOARD_SIZE && 
                   nextCol >= 0 && nextCol < BOARD_SIZE &&
                   (isEdgePosition(nextRow, nextCol) || isMiddleCross(nextRow, nextCol));
        });
        
        if (validDirections.length > 0) {
            setTimeout(() => {
                showDirectionSelector(validDirections, remainingSteps);
            }, 500);
        } else {
            // Non ci sono direzioni valide, considera il movimento completo
            player.remainingSteps = 0;
            checkSpace(player.position);
        }
    } else {
        // Se non ci sono più passi, controlla lo spazio
        checkSpace(player.position);
    }
    
    return { row, col };
}

/**
 * Calcola la prossima posizione
 */
function calculateNextPosition(currentPosition, steps) {
    // Funzione mantenuta per compatibilità, ora utilizziamo il selettore di direzione
    const possibleDirections = getPossibleDirections(currentPosition);
    
    if (possibleDirections.length === 0) {
        console.warn("Nessuna direzione disponibile, ritorno alla posizione attuale");
        return currentPosition;
    }
    
    // Scegli una direzione casuale tra quelle disponibili
    const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    
    return moveInDirection(currentPosition, direction, steps);
}

/**
 * Aggiorna la posizione visiva del giocatore
 */
function updatePlayerPosition(playerIndex) {
    const player = players[playerIndex];
    const playerToken = document.getElementById(`player-token-${playerIndex}`);
    
    if (!playerToken) return;
    
    const space = gameBoard[player.position.row][player.position.col].element;
    const spaceRect = space.getBoundingClientRect();
    const boardRect = gameBoardElement.getBoundingClientRect();
    
    // Offset casuale di pochi pixel per evitare sovrapposizioni perfette
    const randomOffset = (Math.random() * 10) - 5;
    
    // Animazione del movimento
    playerToken.style.left = `${(spaceRect.left - boardRect.left) + (spaceRect.width / 2) - 17.5 + randomOffset}px`;
    playerToken.style.top = `${(spaceRect.top - boardRect.top) + (spaceRect.height / 2) - 17.5 + randomOffset}px`;
}

/**
 * Controlla lo spazio su cui è atterrato il giocatore
 */
function checkSpace(position) {
    const { row, col } = position;
    const space = gameBoard[row][col];
    
    if (!space) return;
    
    // Rimuovi eventuali highlight precedenti prima di evidenziare lo spazio attivo
    const allSpaces = document.querySelectorAll('.space');
    allSpaces.forEach(s => s.classList.remove('active'));
    
    // Evidenzia lo spazio attivo
    space.element.classList.add('active');
    
    // Ottieni il giocatore corrente
    const player = players[currentPlayerIndex];
    
    // Se il giocatore ha ancora passi da fare e non è su una casella quiz, esci
    if (player.remainingSteps && player.remainingSteps > 0 && space.type !== 'quiz') {
        console.log(`Giocatore ha ancora ${player.remainingSteps} passi da fare, non attivo la casella ${space.type}`);
        return;
    }
    
    // Se siamo su una casella quiz, forza l'azzeramento dei passi rimanenti
    if (space.type === 'quiz') {
        player.remainingSteps = 0;
    }
    
    // Aggiungi al log
    addToGameLog(`${player.name} è atterrato su una casella ${space.type}`);
    
    // Gestisci in base al tipo di spazio
    switch(space.type) {
        case 'quiz':
            // Mostra una domanda immediatamente
            console.log('Casella quiz: mostra domanda');
            showQuestion();
            break;
        case 'star':
            // Mostra il prompt per l'acquisto della stella
            if (player.credits >= 150) {
                // Usa un modale personalizzato invece di confirm
                showStarPurchaseModal(player);
            } else {
                showAnimatedNotification('Non hai abbastanza crediti per acquistare questa stella!', 'error');
                addToGameLog(`${player.name} non ha abbastanza crediti per acquistare una stella`);
                nextPlayer();
            }
            break;
        case 'special':
            activateSpecialEffect();
            break;
        default:
            // Passa al prossimo giocatore
            addToGameLog(`${player.name} è atterrato su una casella vuota`);
            nextPlayer();
    }
}

/**
 * Mostra un modale di conferma per l'acquisto della stella
 * @param {Object} player - Il giocatore corrente
 */
function showStarPurchaseModal(player) {
    // Rimuovi eventuali modali esistenti
    const existingModals = document.querySelectorAll('.modal');
    existingModals.forEach(modal => {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
    
    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'starPurchaseModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex !important; justify-content: center; align-items: center; z-index: 9999;';
    
    // Crea il contenuto del modale
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = 'background: rgba(30, 41, 59, 0.95); color: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); text-align: center;';
    
    modalContent.innerHTML = `
        <h2 style="color: gold; margin-bottom: 20px;">
            <i class="fas fa-star" style="margin-right: 10px;"></i> Acquista Stella
        </h2>
        <p style="font-size: 1.2rem; margin-bottom: 20px;">
            Vuoi acquistare questa stella per 150 crediti?
        </p>
        <p style="margin-bottom: 25px;">
            I tuoi crediti: <strong>${player.credits}</strong> <i class="fas fa-coins" style="color: gold;"></i>
        </p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="confirmStarPurchase" style="background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1rem;">
                <i class="fas fa-check" style="margin-right: 8px;"></i> Acquista
            </button>
            <button id="cancelStarPurchase" style="background: linear-gradient(135deg, #f44336, #d32f2f); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1rem;">
                <i class="fas fa-times" style="margin-right: 8px;"></i> Annulla
            </button>
        </div>
    `;
    
    // Aggiungi il modale al DOM
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Gestisci il click sul pulsante di conferma
    document.getElementById('confirmStarPurchase').addEventListener('click', function() {
        // Rimuovi il modale
        modal.remove();
        
        // Esegui l'acquisto
        player.credits -= 150;
        player.stars++;
        renderPlayerInfo();
        showStarCollectionEffect();
        showAnimatedNotification('Hai acquistato una stella!', 'success');
        addToGameLog(`${player.name} ha acquistato una stella`);
        playSound('star');
        
        // Controlla se il giocatore ha vinto
        if (checkWinCondition()) {
            return; // Fine del gioco
        }
        
        // Passa al prossimo giocatore
        nextPlayer();
    });
    
    // Gestisci il click sul pulsante di annullamento
    document.getElementById('cancelStarPurchase').addEventListener('click', function() {
        // Rimuovi il modale
        modal.remove();
        
        // Passa al prossimo giocatore
        addToGameLog(`${player.name} ha rifiutato di acquistare una stella`);
        nextPlayer();
    });
}

/**
 * Raccoglie una stella quando il giocatore atterra su una casella stella
 */
function collectStar() {
    const player = players[currentPlayerIndex];
    
    // Aumenta il contatore delle stelle
    player.stars++;
    
    // Aggiorna UI
    renderPlayerInfo();
    
    // Riproduci suono
    playSound('star');
    
    // Mostra effetti visivi
    showStarCollectionEffect();
    
    // Mostra notifica
    showAnimatedNotification(`${player.name} ha ottenuto una stella!`, 'success');
    
    // Premia il giocatore con crediti
    const creditBonus = 20;
    player.credits += creditBonus;
    showAnimatedNotification(`+${creditBonus} crediti!`, 'info');
    
    // Controlla se abbiamo un vincitore
    if (checkWinCondition()) {
        return; // Fine del gioco
    }
    
    // Passa al prossimo giocatore
    setTimeout(nextPlayer, 2000);
}

/**
 * Attiva un effetto speciale quando il giocatore atterra su una casella speciale
 */
function activateSpecialEffect() {
    // Effetti speciali casuali
    const effects = [
        {
            name: 'Crediti Bonus',
            action: () => {
                const bonus = Math.floor(Math.random() * 30) + 10; // 10-40 crediti
                players[currentPlayerIndex].credits += bonus;
                renderPlayerInfo();
                showAnimatedNotification(`+${bonus} crediti bonus!`, 'success');
                addToGameLog(`${players[currentPlayerIndex].name} ha ricevuto ${bonus} crediti bonus`);
                playSound('success');
            }
        },
        {
            name: 'Lancio Extra',
            action: () => {
                showAnimatedNotification('Lancio del dado extra!', 'success');
                addToGameLog(`${players[currentPlayerIndex].name} ha ottenuto un lancio extra del dado`);
                setTimeout(() => {
                    if (diceButton) {
                        diceButton.disabled = false;
                        diceRolling = false;
                    }
                }, 2000);
                return false; // Non passare al prossimo giocatore
            }
        },
        {
            name: 'Teletrasporto',
            action: () => {
                const randomRow = Math.floor(Math.random() * BOARD_SIZE);
                const randomCol = Math.floor(Math.random() * BOARD_SIZE);
                
                // Trova uno spazio valido
                const middle = Math.floor(BOARD_SIZE / 2);
                let validPosition = null;
                
                if (isEdgePosition(randomRow, randomCol) || isMiddleCross(randomRow, randomCol)) {
                    validPosition = { row: randomRow, col: randomCol };
                } else {
                    // Se non è valido, usa il centro
                    validPosition = { row: middle, col: middle };
                }
                
                showAnimatedNotification('Teletrasporto attivato!', 'info');
                addToGameLog(`${players[currentPlayerIndex].name} si è teletrasportato in posizione [${validPosition.row}, ${validPosition.col}]`);
                
                // Aggiorna la posizione del giocatore
                players[currentPlayerIndex].position = validPosition;
                updatePlayerPosition(currentPlayerIndex);
                
                // Controlla il nuovo spazio (senza passare al prossimo giocatore)
                setTimeout(() => checkSpace(validPosition), 1000);
                return false; // Non passare al prossimo giocatore
            }
        },
        {
            name: 'Scambio Posizione',
            action: () => {
                if (players.length < 2) return true; // Solo un giocatore, nessuno scambio
                
                // Trova un altro giocatore casuale
                let otherPlayerIndex;
                do {
                    otherPlayerIndex = Math.floor(Math.random() * players.length);
                } while (otherPlayerIndex === currentPlayerIndex);
                
                // Scambia le posizioni
                const currentPos = { ...players[currentPlayerIndex].position };
                players[currentPlayerIndex].position = { ...players[otherPlayerIndex].position };
                players[otherPlayerIndex].position = currentPos;
                
                // Aggiorna la UI
                updatePlayerPosition(currentPlayerIndex);
                updatePlayerPosition(otherPlayerIndex);
                
                showAnimatedNotification(`Posizioni scambiate con ${players[otherPlayerIndex].name}!`, 'info');
                addToGameLog(`${players[currentPlayerIndex].name} ha scambiato posizione con ${players[otherPlayerIndex].name}`);
                playSound('special');
            }
        },
        {
            name: 'Salta il Turno',
            action: () => {
                // Trova un altro giocatore casuale
                if (players.length < 2) return true; // Solo un giocatore, nessun effetto
                
                let otherPlayerIndex;
                do {
                    otherPlayerIndex = Math.floor(Math.random() * players.length);
                } while (otherPlayerIndex === currentPlayerIndex);
                
                players[otherPlayerIndex].skipTurn = true;
                
                showAnimatedNotification(`${players[otherPlayerIndex].name} salterà il prossimo turno!`, 'warning');
                addToGameLog(`${players[otherPlayerIndex].name} salterà il prossimo turno`);
                playSound('special');
            }
        }
    ];
    
    // Seleziona un effetto casuale
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    // Mostra notifica dell'effetto
    showAnimatedNotification(`Effetto Speciale: ${randomEffect.name}`, 'info');
    addToGameLog(`Attivato effetto speciale: ${randomEffect.name}`);
    
    // Esegui l'effetto
    const result = randomEffect.action();
    
    // Se l'effetto restituisce false, non passare al prossimo giocatore
    if (result === false) {
        return;
    }
    
    // Passa al prossimo giocatore dopo un ritardo
    setTimeout(nextPlayer, 2000);
}

/**
 * Mostra una domanda
 */
function showQuestion() {
    console.log('showQuestion chiamata');
    
    // Controllo che ci siano categorie disponibili
    if (!availableCategories || availableCategories.length === 0) {
        console.error('Nessuna categoria disponibile per le domande');
        showAnimatedNotification('Errore: nessuna categoria disponibile', 'error');
        addToGameLog('Errore: nessuna categoria disponibile per le domande');
        setTimeout(nextPlayer, 2000);
        return;
    }
    
    console.log('Categorie disponibili:', availableCategories);
    
    const player = players[currentPlayerIndex];
    console.log('Giocatore corrente:', player);
    
    // Verifica se è già in corso una selezione di categoria
    if (document.getElementById('categoryModal')) {
        console.log('Selezione categoria già in corso, non mostrare nuovamente il prompt');
        return;
    }
    
    // Verifica se il giocatore ha il powerup per scegliere la categoria
    if (player.powerups && player.powerups.categoryChoice && player.powerups.categoryChoice > 0) {
        // Chiedi se vuole usare il powerup
        if (confirm('Hai il powerup "Scelta Categoria". Vuoi scegliere la categoria della domanda? Se rispondi correttamente otterrai anche una stella!')) {
            // Decrementa il contatore del powerup
            player.powerups.categoryChoice--;
            addToGameLog(`${player.name} ha usato il powerup "Scelta Categoria"`);
            showCategorySelector();
            return; // Importante: ritorna qui per fermare l'esecuzione della funzione
        }
    }
    
    // Sceglie una categoria casuale tra quelle disponibili
    const randomCategoryIndex = Math.floor(Math.random() * availableCategories.length);
    const selectedCategory = availableCategories[randomCategoryIndex];
    
    console.log(`Categoria selezionata: ${selectedCategory}`);
    addToGameLog(`Categoria selezionata: ${selectedCategory}`);
    
    // Carica una domanda dalla categoria selezionata
    // Passa false come secondo parametro per indicare che la categoria non è stata scelta dal giocatore
    console.log('Chiamata a loadRandomQuestion con categoria:', selectedCategory);
    loadRandomQuestion(selectedCategory, false);
    
    // Non chiamare nextPlayer qui, verrà chiamato dopo che la domanda è stata risolta
}

/**
 * Mostra il selettore di categoria
 */
function showCategorySelector() {
    // Controllo che ci siano categorie disponibili
    if (!availableCategories || availableCategories.length === 0) {
        console.error('Nessuna categoria disponibile');
        showAnimatedNotification('Errore: nessuna categoria disponibile', 'error');
        setTimeout(nextPlayer, 2000);
        return;
    }
    
    console.log('Mostrando selettore categorie, il giocatore otterrà una stella se risponde correttamente');
    
    // Chiudi qualsiasi modale aperto, incluso i timer
    if (timerTimeout) {
        clearTimeout(timerTimeout);
        timerTimeout = null;
    }
    
    // Rimuovi qualsiasi modale esistente
    const existingModals = document.querySelectorAll('.modal');
    existingModals.forEach(modal => {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'categoryModal';
    
    let categoriesHTML = '';
    availableCategories.forEach((category, index) => {
        categoriesHTML += `
            <button class="category-btn" data-category="${category}">
                ${category}
            </button>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Scegli una categoria</h3>
            <p style="color: gold;"><i class="fas fa-star"></i> Risposta corretta = 1 stella!</p>
            <div class="category-buttons">
                ${categoriesHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Aggiungi event listeners ai pulsanti
    const buttons = modal.querySelectorAll('.category-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.category;
            
            // Rimuovi il modale
            modal.remove();
            
            addToGameLog(`${players[currentPlayerIndex].name} ha scelto la categoria: ${selectedCategory}`);
            console.log(`Categoria scelta: ${selectedCategory}`);
            
            // Carica una domanda dalla categoria selezionata
            // e imposta il flag per indicare che è stata usata l'abilità di scelta categoria
            loadRandomQuestion(selectedCategory, true); // Passa true come secondo argomento
        });
    });
}

/**
 * Gestisce l'acquisto di un elemento dello shop
 */
function purchaseItem(itemId, shopItems, modal) {
    const player = players[currentPlayerIndex];
    const item = shopItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    if (player.credits >= item.price) {
        // Sottrai i crediti
        player.credits -= item.price;
        
        // Esegui l'azione dell'oggetto
        item.action();
        
        // Aggiorna UI
        renderPlayerInfo();
        
        // Rimuovi il modale dello shop
        modal.remove();
        
        // Riproduci suono acquisto
        playSound('success');
    } else {
        showAnimatedNotification('Crediti insufficienti!', 'error');
    }
}

/**
 * Inizializza gli eventi di tastiera
 */
function initKeyboardEvents() {
    document.addEventListener('keydown', function(event) {
        // Apri lo shop con il tasto S
        if (event.key === 's' || event.key === 'S') {
            // Verifica che il giocatore non abbia passi rimanenti da completare
            const player = players[currentPlayerIndex];
            if (player && player.remainingSteps && player.remainingSteps > 0) {
                showAnimatedNotification('Devi prima completare il movimento', 'error');
                return;
            }
            
            // Se c'è già uno shop modale aperto, chiudilo invece di aprirne un altro
            const existingShop = document.getElementById('shopModal');
            if (existingShop) {
                existingShop.remove();
            } else if (!diceRolling) { // Apri lo shop solo se non si sta lanciando il dado
                showShop();
            } else {
                showAnimatedNotification('Non puoi usare lo shop durante il tiro del dado', 'error');
            }
        }
    });
}

/**
 * Inizializza il gioco
 */
function initGame() {
    console.log('Inizializzazione del gioco');
    
    // Carica i dati del gioco
    loadGameData();
    
    // Inizializza il DOM del gioco
    initGameDOM();
    
    // Inizializza il tabellone di gioco
    initGameBoard();
    
    // Posiziona i giocatori sul tabellone
    placePlayersOnBoard();
    
    // Inizializza gli eventi
    initEvents();
    
    // Inizializza la tastiera
    initKeyboardEvents();
    
    // Inizializza il negozio
    initShopState();
    
    // Inizializza il log di gioco
    createGameLog();
    
    // Aggiorna le informazioni dei giocatori
    renderPlayerInfo();
    
    // Evidenzia il giocatore corrente
    highlightCurrentPlayer();
    
    // Mostra animazione di benvenuto
    showWelcomeAnimation();
    
    // Debug per i test
    if (isDebugMode) {
        addDebugButton();
    }
    
    console.log('Gioco inizializzato con successo');
    
    // Aggiungi messaggio di inizio gioco al log
    addToGameLog('Gioco iniziato');
    addToGameLog(`Obiettivo: raccogliere ${starGoal} stelle`);
}

/**
 * Aggiunge un pulsante di debug per testare le domande
 */
function addDebugButton() {
    const debugButton = document.createElement('button');
    debugButton.id = 'debugButton';
    debugButton.innerHTML = 'Test Domanda';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '10px';
    debugButton.style.backgroundColor = '#ff5733';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '5px';
    debugButton.style.cursor = 'pointer';
    
    debugButton.addEventListener('click', () => {
        console.log('Pulsante di debug cliccato');
        // Usa direttamente la funzione di test anziché passare per loadRandomQuestion
        testQuestion();
    });
    
    document.body.appendChild(debugButton);
    console.log('Pulsante di debug aggiunto');
}

/**
 * Inizializza lo stato dello shop
 */
function initShopState() {
    // Assicurati che i giocatori non abbiano passi rimanenti all'inizio del gioco
    players.forEach(player => {
        player.remainingSteps = 0;
        
        // Inizializza i powerups per ogni giocatore
        if (!player.powerups) {
            player.powerups = {
                shields: 0,
                categoryChoice: 0
            };
        }
    });
    
    // Abilita lo shop all'inizio del gioco se c'è un pulsante dello shop
    if (shopButton && gameStarted) {
        shopButton.disabled = false;
    }
    
    // Aggiungi event listener al pulsante dello shop
    if (shopButton) {
        shopButton.addEventListener('click', showShop);
    }
    
    console.log('Stato dello shop inizializzato');
}

/**
 * Mostra un effetto visivo per la raccolta di una stella
 */
function showStarCollectionEffect() {
    // Crea container per l'effetto
    const effectContainer = document.createElement('div');
    effectContainer.className = 'visual-effect';
    document.body.appendChild(effectContainer);
    
    // Genera stelle che volano
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'flying-star';
        star.innerHTML = '<i class="fas fa-star"></i>';
        
        // Posizione casuale
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        // Stile
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.fontSize = `${Math.random() * 20 + 10}px`;
        star.style.animationDuration = `${Math.random() * 3 + 1}s`;
        star.style.animationDelay = `${Math.random() * 0.5}s`;
        
        effectContainer.appendChild(star);
    }
    
    // Rimuovi l'effetto dopo 3 secondi
    setTimeout(() => {
        if (effectContainer && effectContainer.parentNode) {
            document.body.removeChild(effectContainer);
        }
    }, 3000);
}

/**
 * Mostra l'animazione di benvenuto all'inizio del gioco
 */
function showWelcomeAnimation() {
    // Crea un elemento per il messaggio di benvenuto
    const welcomeElement = document.createElement('div');
    welcomeElement.className = 'welcome-message';
    welcomeElement.innerHTML = `
        <h2>Benvenuto a Quiz Party!</h2>
        <p>Pronto a iniziare?</p>
    `;
    welcomeElement.style.position = 'fixed';
    welcomeElement.style.top = '50%';
    welcomeElement.style.left = '50%';
    welcomeElement.style.transform = 'translate(-50%, -50%)';
    welcomeElement.style.background = 'rgba(30, 41, 59, 0.9)';
    welcomeElement.style.padding = '30px';
    welcomeElement.style.borderRadius = '12px';
    welcomeElement.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
    welcomeElement.style.zIndex = '1000';
    welcomeElement.style.textAlign = 'center';
    welcomeElement.style.opacity = '0';
    welcomeElement.style.transition = 'opacity 0.5s, transform 0.5s';
    
    document.body.appendChild(welcomeElement);
    
    // Mostra l'animazione
    setTimeout(() => {
        welcomeElement.style.opacity = '1';
        welcomeElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Rimuovi dopo 2 secondi
    setTimeout(() => {
        welcomeElement.style.opacity = '0';
        welcomeElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (welcomeElement.parentNode) {
                document.body.removeChild(welcomeElement);
            }
        }, 500);
    }, 2000);
}

/**
 * Controlla se c'è un vincitore
 * @returns {boolean} true se c'è un vincitore, false altrimenti
 */
function checkWinCondition() {
    const player = players[currentPlayerIndex];
    if (!player) return false;
    
    if (player.stars >= starGoal) {
        // Mostra la modalità di vittoria
        const victoryModal = document.createElement('div');
        victoryModal.className = 'modal';
        victoryModal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Vittoria! 🎉</h2>
                <p>${player.name} ha vinto la partita!</p>
                <p>Ha collezionato ${player.stars} stelle!</p>
                <button onclick="location.reload()">Nuova Partita</button>
            </div>
        `;
        document.body.appendChild(victoryModal);
        
        // Aggiungi l'effetto confetti
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        // Crea i confetti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Ferma il gioco
        gameStarted = false;
        return true;
    }
    return false;
}

/**
 * Mostra gli effetti di vittoria 
 */
function showVictoryEffects(winner) {
    // Crea un effetto di confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.backgroundColor = getRandomColor();
        document.body.appendChild(confetti);
        
        // Rimuovi il confetto dopo l'animazione
        setTimeout(() => {
            if (confetti.parentNode) {
                document.body.removeChild(confetti);
            }
        }, 5000);
    }
    
    // Mostra una modale di vittoria
    setTimeout(() => {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'victoryModal';
        
        modal.innerHTML = `
            <div class="modal-content victory-modal">
                <h2>🎉 Vittoria! 🎉</h2>
                <div class="winner-avatar" style="background-color: ${winner.color}">
                    ${winner.avatar}
                </div>
                <h3>${winner.name} ha vinto!</h3>
                <p>Ha collezionato ${winner.stars} stelle su ${starGoal}</p>
                
                <div class="victory-stars">
                    ${generateStarIcons(winner.stars)}
                </div>
                
                <button id="playAgainBtn" class="btn btn-primary">Gioca ancora</button>
                <button id="homeBtn" class="btn btn-secondary">Torna alla home</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Aggiungi event listeners ai pulsanti
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }, 1000);
}

/**
 * Genera un colore casuale per i confetti
 */
function getRandomColor() {
    const colors = [
        '#8b5cf6', // viola
        '#06b6d4', // ciano
        '#fcd34d', // giallo
        '#ef4444', // rosso
        '#10b981', // verde
        '#f97316'  // arancione
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Carica una domanda casuale dalla categoria specificata
 * @param {string} category - La categoria da cui caricare una domanda
 * @param {boolean} isChosenCategory - Indica se la categoria è stata scelta dal giocatore usando l'abilità
 */
async function loadRandomQuestion(category, isChosenCategory = false) {
    try {
        console.log('Loading questions for category:', category, 'isChosenCategory:', isChosenCategory);
        
        // Se il giocatore ha usato la scelta categoria, registralo immediatamente
        // per evitare che venga perso in caso di errori durante il caricamento
        if (isChosenCategory) {
            console.log('Impostazione flag usedCategoryChoice a true');
            players[currentPlayerIndex].usedCategoryChoice = true;
        }
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        loadingMessage.textContent = 'Caricamento domanda...';
        document.body.appendChild(loadingMessage);

        // Assicurati che category sia una stringa
        const categoryParam = typeof category === 'string' ? category : '';
        console.log('Category parameter:', categoryParam);

        // Aggiungi un timestamp per evitare il caching del browser
        const timestamp = new Date().getTime();
        const response = await fetch(`${window.API_URL}/api/questions${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}&_=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Controlla che il content-type sia JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Unexpected content type: ${contentType}. Expected application/json`);
        }
        
        const questions = await response.json();
        console.log('Questions loaded:', questions);
        
        // Remove loading message
        if (loadingMessage.parentNode) {
            document.body.removeChild(loadingMessage);
        }
        
        if (!questions || !Array.isArray(questions)) {
            throw new Error('Invalid data format: questions array not found');
        }
        
        if (questions.length === 0) {
            console.warn('No questions found for category:', category);
            // Fallback to default questions
            const defaultQuestions = getDefaultQuestions();
            const categoryQuestions = defaultQuestions.filter(q => q.category === category);
            
            if (categoryQuestions.length > 0) {
                const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
                displayQuestion(categoryQuestions[randomIndex], isChosenCategory);
            } else {
                // Se non ci sono domande per questa categoria, usa una domanda generica
                displayQuestion({
                    question: "Qual è la capitale d'Italia?",
                    answer: "Roma",
                    category: category,
                    type: "text"
                }, isChosenCategory);
            }
            return;
        }

        const randomIndex = Math.floor(Math.random() * questions.length);
        const selectedQuestion = questions[randomIndex];
        console.log('Selected question:', selectedQuestion, 'Passing isChosenCategory:', isChosenCategory);
        
        displayQuestion(selectedQuestion, isChosenCategory);
    } catch (error) {
        console.error('Error loading questions:', error);
        
        // Remove loading message if it exists
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            document.body.removeChild(loadingMessage);
        }
        
        // Show error notification
        showAnimatedNotification('Errore nel caricamento delle domande', 'error');
        
        // Fallback to default questions
        const defaultQuestions = getDefaultQuestions();
        const categoryQuestions = defaultQuestions.filter(q => q.category === category);
        
        if (categoryQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
            displayQuestion(categoryQuestions[randomIndex], isChosenCategory);
        } else {
            // Se non ci sono domande per questa categoria, usa una domanda generica
            displayQuestion({
                question: "Qual è la capitale d'Italia?",
                answer: "Roma",
                category: category,
                type: "text"
            }, isChosenCategory);
        }
    }
}

/**
 * Fornisce un set di domande predefinito in caso di errore API
 * @returns {Array} Domande predefinite
 */
function getDefaultQuestions() {
    return [
        // Storia
              {
                "id": 1,
                "category": "Scienza",
                "type": "text",
                "question": "Qual è l'elemento più abbondante nell'universo?",
                "answer": "Idrogeno"
            },
            {
                "id": 2,
                "category": "Scienza",
                "type": "boolean",
                "question": "L'acqua è composta da idrogeno e ossigeno?",
                "answer": "Vero"
            },
            {
                "id": 3,
                "category": "Scienza",
                "type": "text",
                "question": "Qual è il pianeta più grande del Sistema Solare?",
                "answer": "Giove"
            },
            {
                "id": 4,
                "category": "Scienza",
                "type": "text",
                "question": "Chi ha formulato la teoria della relatività?",
                "answer": "Albert Einstein"
            },
            {
                "id": 5,
                "category": "Scienza",
                "type": "boolean",
                "question": "Il DNA si trova nel nucleo delle cellule?",
                "answer": "Vero"
            },
            {
                "id": 6,
                "category": "Scienza",
                "type": "multiple",
                "question": "Qual è l'organo più grande del corpo umano?",
                "options": [
                    "Cuore",
                    "Fegato",
                    "Pelle",
                    "Cervello"
                ],
                "answer": "Pelle"
            },
            {
                "id": 7,
                "category": "Scienza",
                "type": "multiple",
                "question": "A quanti gradi Celsius l'acqua bolle a livello del mare?",
                "options": [
                    "90°C",
                    "100°C",
                    "110°C",
                    "120°C"
                ],
                "answer": "100°C"
            },
            {
                "id": 8,
                "category": "Scienza",
                "type": "multiple",
                "question": "Quale gas usiamo per respirare?",
                "options": [
                    "Azoto",
                    "Idrogeno",
                    "Ossigeno",
                    "Anidride carbonica"
                ],
                "answer": "Ossigeno"
            },
            {
                "id": 9,
                "category": "Scienza",
                "type": "boolean",
                "question": "La fotosintesi clorofilliana avviene nelle piante?",
                "answer": "Vero"
            },
            {
                "id": 10,
                "category": "Scienza",
                "type": "multiple",
                "question": "Qual è l'unità di misura della corrente elettrica?",
                "options": [
                    "Volt",
                    "Watt",
                    "Ampere",
                    "Ohm"
                ],
                "answer": "Ampere"
            },
            {
                "id": 11,
                "category": "Scienza",
                "type": "multiple",
                "question": "I diamanti sono fatti di quale elemento?",
                "options": [
                    "Carbonio",
                    "Silicio",
                    "Oro",
                    "Ferro"
                ],
                "answer": "Carbonio"
            },
            {
                "id": 12,
                "category": "Scienza",
                "type": "boolean",
                "question": "Il sole è una stella?",
                "answer": "Vero"
            },
            {
                "id": 13,
                "category": "Scienza",
                "type": "multiple",
                "question": "Qual è il pianeta più vicino al sole?",
                "options": [
                    "Venere",
                    "Marte",
                    "Terra",
                    "Mercurio"
                ],
                "answer": "Mercurio"
            },
            {
                "id": 14,
                "category": "Scienza",
                "type": "boolean",
                "question": "La forza di gravità sulla Luna è più forte che sulla Terra?",
                "answer": "Falso"
            },
            {
                "id": 15,
                "category": "Scienza",
                "type": "multiple",
                "question": "L'ozono è composto da quanti atomi di ossigeno?",
                "options": [
                    "Due",
                    "Tre",
                    "Quattro",
                    "Cinque"
                ],
                "answer": "Tre"
            },
            {
                "id": 16,
                "category": "Scienza",
                "type": "multiple",
                "question": "Chi ha scoperto la teoria dell'evoluzione?",
                "options": [
                    "Albert Einstein",
                    "Charles Darwin",
                    "Isaac Newton",
                    "Gregor Mendel"
                ],
                "answer": "Charles Darwin"
            },
            {
                "id": 17,
                "category": "Scienza",
                "type": "multiple",
                "question": "Qual è la velocità della luce nel vuoto?",
                "options": [
                    "150.000 km/s",
                    "200.000 km/s",
                    "250.000 km/s",
                    "300.000 km/s"
                ],
                "answer": "300.000 km/s"
            },
            {
                "id": 18,
                "category": "Scienza",
                "type": "boolean",
                "question": "I pinguini possono volare?",
                "answer": "Falso"
            },
            {
                "id": 19,
                "category": "Scienza",
                "type": "multiple",
                "question": "Quale strumento si usa per misurare i terremoti?",
                "options": [
                    "Barometro",
                    "Sismografo",
                    "Termometro",
                    "Igrometro"
                ],
                "answer": "Sismografo"
            },
            {
                "id": 20,
                "category": "Scienza",
                "type": "multiple",
                "question": "La Terra impiega quanti giorni per fare un giro intorno al Sole?",
                "options": [
                    "180 giorni",
                    "265 giorni",
                    "365 giorni",
                    "400 giorni"
                ],
                "answer": "365 giorni"
            },
            {
              "id": 21,
              "category": "Sport",
              "type": "multiple",
              "question": "Chi ha vinto il Pallone d'Oro nel 2021?",
              "options": [
                  "Lionel Messi",
                  "Cristiano Ronaldo",
                  "Robert Lewandowski",
                  "Karim Benzema"
              ],
              "answer": "Lionel Messi"
          },
          {
              "id": 22,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale squadra ha vinto la Champions League nel 2020?",
              "options": [
                  "Real Madrid",
                  "Bayern Monaco",
                  "Manchester City",
                  "Paris Saint-Germain"
              ],
              "answer": "Bayern Monaco"
          },
          {
              "id": 23,
              "category": "Sport",
              "type": "multiple",
              "question": "Chi è il tennista con più titoli del Grande Slam nella storia?",
              "options": [
                  "Rafael Nadal",
                  "Roger Federer",
                  "Novak Djokovic",
                  "Pete Sampras"
              ],
              "answer": "Novak Djokovic"
          },
          {
              "id": 24,
              "category": "Sport",
              "type": "multiple",
              "question": "In quale sport si usa un 'putter'?",
              "options": [
                  "Golf",
                  "Tennis",
                  "Baseball",
                  "Hockey"
              ],
              "answer": "Golf"
          },
          {
              "id": 25,
              "category": "Sport",
              "type": "multiple",
              "question": "Quanti minuti dura una partita di basket NBA?",
              "options": [
                  "40",
                  "48",
                  "50",
                  "60"
              ],
              "answer": "48"
          },
          {
              "id": 26,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale nazione ha vinto più Coppe del Mondo di calcio?",
              "options": [
                  "Brasile",
                  "Germania",
                  "Italia",
                  "Argentina"
              ],
              "answer": "Brasile"
          },
          {
              "id": 27,
              "category": "Sport",
              "type": "multiple",
              "question": "Chi detiene il record di punti segnati in una singola partita NBA?",
              "options": [
                  "Michael Jordan",
                  "LeBron James",
                  "Kobe Bryant",
                  "Wilt Chamberlain"
              ],
              "answer": "Wilt Chamberlain"
          },
          {
              "id": 28,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale squadra ha vinto più Super Bowl nella storia?",
              "options": [
                  "Dallas Cowboys",
                  "Pittsburgh Steelers",
                  "New England Patriots",
                  "San Francisco 49ers"
              ],
              "answer": "New England Patriots"
          },
          {
              "id": 29,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale pilota ha vinto più titoli di Formula 1?",
              "options": [
                  "Ayrton Senna",
                  "Lewis Hamilton",
                  "Michael Schumacher",
                  "Sebastian Vettel"
              ],
              "answer": "Michael Schumacher e Lewis Hamilton"
          },
          {
              "id": 30,
              "category": "Sport",
              "type": "multiple",
              "question": "In quale anno si sono svolte le prime Olimpiadi moderne?",
              "options": [
                  "1892",
                  "1896",
                  "1900",
                  "1924"
              ],
              "answer": "1896"
          },
          {
              "id": 31,
              "category": "Sport",
              "type": "multiple",
              "question": "Chi ha vinto il Tour de France nel 2021?",
              "options": [
                  "Primož Roglič",
                  "Tadej Pogačar",
                  "Egan Bernal",
                  "Jonas Vingegaard"
              ],
              "answer": "Tadej Pogačar"
          },
          {
              "id": 32,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale squadra ha vinto il maggior numero di campionati italiani di calcio (Serie A)?",
              "options": [
                  "Inter",
                  "Juventus",
                  "Milan",
                  "Roma"
              ],
              "answer": "Juventus"
          },
          {
              "id": 33,
              "category": "Sport",
              "type": "multiple",
              "question": "Chi ha vinto il Mondiale di calcio 2018?",
              "options": [
                  "Germania",
                  "Brasile",
                  "Francia",
                  "Argentina"
              ],
              "answer": "Francia"
          },
          {
              "id": 34,
              "category": "Sport",
              "type": "multiple",
              "question": "Qual è la distanza ufficiale di una maratona?",
              "options": [
                  "38,195 km",
                  "40,195 km",
                  "42,195 km",
                  "44,195 km"
              ],
              "answer": "42,195 km"
          },
          {
              "id": 35,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale squadra ha vinto il Mondiale di rugby nel 2019?",
              "options": [
                  "Nuova Zelanda",
                  "Inghilterra",
                  "Sudafrica",
                  "Australia"
              ],
              "answer": "Sudafrica"
          },
          {
              "id": 36,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale sport è noto per il 'Grand Slam'?",
              "options": [
                  "Golf",
                  "Tennis",
                  "Baseball",
                  "Pallavolo"
              ],
              "answer": "Tennis"
          },
          {
              "id": 37,
              "category": "Sport",
              "type": "multiple",
              "question": "Quanti giocatori ci sono in una squadra di pallavolo?",
              "options": [
                  "5",
                  "6",
                  "7",
                  "8"
              ],
              "answer": "6"
          },
          {
              "id": 38,
              "category": "Sport",
              "type": "multiple",
              "question": "Chi ha segnato il gol decisivo nella finale di Champions League 2014 tra Real Madrid e Atlético Madrid?",
              "options": [
                  "Cristiano Ronaldo",
                  "Gareth Bale",
                  "Sergio Ramos",
                  "Ángel Di María"
              ],
              "answer": "Gareth Bale"
          },
          {
              "id": 39,
              "category": "Sport",
              "type": "multiple",
              "question": "In quale sport si usa una mazza e una pallina su un campo erboso?",
              "options": [
                  "Baseball",
                  "Golf",
                  "Cricket",
                  "Hockey su prato"
              ],
              "answer": "Hockey su prato"
          },
          {
              "id": 40,
              "category": "Sport",
              "type": "multiple",
              "question": "Quale nazione ha ospitato le Olimpiadi del 2008?",
              "options": [
                  "Grecia",
                  "Cina",
                  "Regno Unito",
                  "Brasile"
              ],
              "answer": "Cina"
          },
          {
            "id": 41,
            "category": "Storia",
            "type": "boolean",
            "question": "L'Impero Romano d'Occidente cadde nel 476 d.C.?",
            "answer": "Vero"
          },
          {
            "id": 42,
            "category": "Storia",
            "type": "multiple",
            "question": "Chi fu il primo imperatore di Roma?",
            "options": ["Augusto", "Nerone", "Cesare", "Traiano"],
            "answer": "Augusto"
          },
          {
            "id": 43,
            "category": "Storia",
            "type": "boolean",
            "question": "La Rivoluzione Francese iniziò nel 1789?",
            "answer": "Vero"
          },
          {
            "id": 44,
            "category": "Storia",
            "type": "multiple",
            "question": "Quale esploratore scoprì l'America nel 1492?",
            "options": ["Cristoforo Colombo", "Vasco da Gama", "Amerigo Vespucci", "Ferdinando Magellano"],
            "answer": "Cristoforo Colombo"
          },
          {
            "id": 45,
            "category": "Storia",
            "type": "boolean",
            "question": "La Prima Guerra Mondiale iniziò nel 1914?",
            "answer": "Vero"
          },
          {
            "id": 46,
            "category": "Storia",
            "type": "multiple",
            "question": "Chi era il presidente degli Stati Uniti durante la Guerra Civile Americana?",
            "options": ["Abraham Lincoln", "George Washington", "Theodore Roosevelt", "Thomas Jefferson"],
            "answer": "Abraham Lincoln"
          },
          {
            "id": 47,
            "category": "Storia",
            "type": "boolean",
            "question": "La Grande Muraglia è stata costruita dalla Cina?",
            "answer": "Vero"
          },
          {
            "id": 48,
            "category": "Storia",
            "type": "multiple",
            "question": "Chi era il re di Francia durante la Rivoluzione Francese?",
            "options": ["Luigi XVI", "Carlo Magno", "Luigi XIV", "Filippo II"],
            "answer": "Luigi XVI"
          },
          {
            "id": 49,
            "category": "Storia",
            "type": "boolean",
            "question": "Il Titanic affondò nel 1912?",
            "answer": "Vero"
          },
          {
            "id": 50,
            "category": "Storia",
            "type": "multiple",
            "question": "Quale evento segnò l'inizio della Seconda Guerra Mondiale?",
            "options": ["L'invasione della Polonia", "L'attacco a Pearl Harbor", "Il Trattato di Versailles", "La marcia su Roma"],
            "answer": "L'invasione della Polonia"
          },
          {
            "id": 51,
            "category": "Storia",
            "type": "boolean",
            "question": "Niccolò Machiavelli scrisse 'Il Principe'?",
            "answer": "Vero"
          },
          {
            "id": 52,
            "category": "Storia",
            "type": "boolean",
            "question": "L'antica città di Troia esisteva davvero?",
            "answer": "Vero"
          },
          {
            "id": 53,
            "category": "Storia",
            "type": "multiple",
            "question": "Chi guidò la Rivoluzione russa del 1917?",
            "options": ["Lenin", "Stalin", "Trotsky", "Gorbaciov"],
            "answer": "Lenin"
          },
          {
            "id": 54,
            "category": "Storia",
            "type": "boolean",
            "question": "Cleopatra VII fu l'ultimo faraone d'Egitto?",
            "answer": "Vero"
          },
          {
            "id": 55,
            "category": "Storia",
            "type": "multiple",
            "question": "Quale paese ha lanciato il primo satellite nello spazio?",
            "options": ["Unione Sovietica", "Stati Uniti", "Cina", "Germania"],
            "answer": "Unione Sovietica"
          },
          {
            "id": 56,
            "category": "Storia",
            "type": "boolean",
            "question": "Benito Mussolini era il dittatore italiano durante la Seconda Guerra Mondiale?",
            "answer": "Vero"
          },
          {
            "id": 57,
            "category": "Storia",
            "type": "boolean",
            "question": "Napoleone Bonaparte è morto nel 1821?",
            "answer": "Vero"
          },
          {
            "id": 58,
            "category": "Storia",
            "type": "boolean",
            "question": "L'Impero Romano ha avuto due capitali dopo il 330 d.C.?",
            "answer": "Vero"
          },
          {
            "id": 59,
            "category": "Storia",
            "type": "boolean",
            "question": "La Magna Carta è stata firmata nel 1215?",
            "answer": "Vero"
          },
          {
            "id": 60,
            "category": "Storia",
            "type": "multiple",
            "question": "Chi ha scoperto la penicillina?",
            "options": ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Edward Jenner"],
            "answer": "Alexander Fleming"
          },
          {
            "id": 61,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è la capitale del Canada?",
            "options": ["Toronto", "Ottawa", "Vancouver", "Montreal"],
            "answer": "Ottawa"
          },
          {
            "id": 62,
            "category": "Geografia",
            "type": "boolean",
            "question": "Il fiume più lungo del mondo è l'Amazzonia?",
            "answer": "Falso"
          },
          {
            "id": 63,
            "category": "Geografia",
            "type": "multiple",
            "question": "Quale continente è il più popoloso?",
            "options": ["Africa", "Asia", "Europa", "America"],
            "answer": "Asia"
          },
          {
            "id": 64,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è il deserto più grande del mondo?",
            "options": ["Gobi", "Kalahari", "Sahara", "Atacama"],
            "answer": "Sahara"
          },
          {
            "id": 65,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è il monte più alto d'Europa?",
            "options": ["Monte Bianco", "Monte Elbrus", "Monte Rosa", "Monti Urali"],
            "answer": "Monte Elbrus"
          },
          {
            "id": 66,
            "category": "Geografia",
            "type": "boolean",
            "question": "L'Australia è un continente?",
            "answer": "Vero"
          },
          {
            "id": 67,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è la capitale del Giappone?",
            "options": ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
            "answer": "Tokyo"
          },
          {
            "id": 68,
            "category": "Geografia",
            "type": "boolean",
            "question": "Il Mar Morto è in realtà un mare?",
            "answer": "Falso"
          },
          {
            "id": 69,
            "category": "Geografia",
            "type": "multiple",
            "question": "In quale paese si trova Machu Picchu?",
            "options": ["Messico", "Perù", "Colombia", "Cile"],
            "answer": "Perù"
          },
          {
            "id": 70,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è il paese più grande del mondo?",
            "options": ["USA", "Cina", "Russia", "Canada"],
            "answer": "Russia"
          },
          {
            "id": 71,
            "category": "Geografia",
            "type": "boolean",
            "question": "Il Polo Sud si trova in Antartide?",
            "answer": "Vero"
          },
          {
            "id": 72,
            "category": "Geografia",
            "type": "multiple",
            "question": "Quale città è conosciuta come 'la città eterna'?",
            "options": ["Atene", "Roma", "Parigi", "Istanbul"],
            "answer": "Roma"
          },
          {
            "id": 73,
            "category": "Geografia",
            "type": "multiple",
            "question": "In quale paese si trova il Grand Canyon?",
            "options": ["USA", "Messico", "Canada", "Argentina"],
            "answer": "USA"
          },
          {
            "id": 74,
            "category": "Geografia",
            "type": "boolean",
            "question": "Il fiume Po è il più lungo d'Italia?",
            "answer": "Vero"
          },
          {
            "id": 75,
            "category": "Geografia",
            "type": "multiple",
            "question": "Quale oceano bagna la costa orientale degli Stati Uniti?",
            "options": ["Pacifico", "Indiano", "Atlantico", "Artico"],
            "answer": "Atlantico"
          },
          {
            "id": 76,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è la montagna più alta d'Africa?",
            "options": ["Monte Kenya", "Kilimangiaro", "Ruwenzori", "Drakensberg"],
            "answer": "Kilimangiaro"
          },
          {
            "id": 77,
            "category": "Geografia",
            "type": "boolean",
            "question": "Il deserto del Gobi si trova in Asia?",
            "answer": "Vero"
          },
          {
            "id": 78,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è il paese più piccolo del mondo?",
            "options": ["San Marino", "Liechtenstein", "Monaco", "Vaticano"],
            "answer": "Vaticano"
          },
          {
            "id": 79,
            "category": "Geografia",
            "type": "boolean",
            "question": "Il Rio delle Amazzoni attraversa il Brasile?",
            "answer": "Vero"
          },
          {
            "id": 80,
            "category": "Geografia",
            "type": "multiple",
            "question": "Qual è la capitale della Corea del Sud?",
            "options": ["Seul", "Busan", "Incheon", "Daegu"],
            "answer": "Seul"
          },
              {
                "id": 81,
                "category": "Arte",
                "type": "text",
                "question": "Chi ha dipinto la Gioconda?",
                "answer": "Leonardo da Vinci"
              },
              {
                "id": 82,
                "category": "Arte",
                "type": "multiple",
                "question": "Quale movimento artistico è associato a Vincent van Gogh?",
                "options": [
                  "Impressionismo",
                  "Espressionismo",
                  "Post-impressionismo",
                  "Cubismo"
                ],
                "answer": "Post-impressionismo"
              },
              {
                "id": 83,
                "category": "Arte",
                "type": "text",
                "question": "Quale tecnica di pittura utilizza piccoli puntini di colore per formare un'immagine?",
                "answer": "Pointillismo"
              },
              {
                "id": 84,
                "category": "Arte",
                "type": "boolean",
                "question": "Il realismo è un movimento artistico nato nel XX secolo?",
                "answer": "Falso"
              },
              {
                "id": 85,
                "category": "Arte",
                "type": "text",
                "question": "Chi ha dipinto 'La Notte Stellata'?",
                "answer": "Vincent van Gogh"
              },
              {
                "id": 86,
                "category": "Arte",
                "type": "multiple",
                "question": "Quale artista è celebre per il dipinto 'Il bacio'?",
                "options": [
                  "Gustav Klimt",
                  "Edvard Munch",
                  "Henri Matisse",
                  "Pablo Picasso"
                ],
                "answer": "Gustav Klimt"
              },
              {
                "id": 87,
                "category": "Arte",
                "type": "text",
                "question": "Chi ha realizzato il celebre dipinto 'Guernica'?",
                "answer": "Pablo Picasso"
              },
              {
                "id": 88,
                "category": "Arte",
                "type": "multiple",
                "question": "Quale stile artistico, caratterizzato da forme geometriche e colori primari, è esemplificato dalle opere di Piet Mondrian?",
                "options": [
                  "Cubismo",
                  "Futurismo",
                  "Neoplasticismo",
                  "Realismo"
                ],
                "answer": "Neoplasticismo"
              },
              {
                "id": 89,
                "category": "Arte",
                "type": "boolean",
                "question": "L'arte rinascimentale ha avuto origine in Italia?",
                "answer": "Vero"
              },
              {
                "id": 90,
                "category": "Arte",
                "type": "text",
                "question": "Qual è il nome del famoso scultore che ha realizzato il David?",
                "answer": "Michelangelo"
              },
              {
                "id": 91,
                "category": "Arte",
                "type": "multiple",
                "question": "A quale corrente artistica è associato Salvador Dalí?",
                "options": [
                  "Surrealismo",
                  "Impressionismo",
                  "Rinascimento",
                  "Barocco"
                ],
                "answer": "Surrealismo"
              },
              {
                "id": 92,
                "category": "Arte",
                "type": "multiple",
                "question": "Chi ha dipinto 'L'urlo'?",
                "options": [
                  "Edvard Munch",
                  "Gustav Klimt",
                  "Francis Bacon",
                  "René Magritte"
                ],
                "answer": "Edvard Munch"
              },
              {
                "id": 93,
                "category": "Arte",
                "type": "text",
                "question": "Quale tecnica di incisione prevede l'uso di una lastra di rame e l'azione di un acido?",
                "answer": "Acquaforte"
              },
              {
                "id": 94,
                "category": "Arte",
                "type": "boolean",
                "question": "Il cubismo ha rivoluzionato la prospettiva tradizionale in pittura?",
                "answer": "Vero"
              },
              {
                "id": 95,
                "category": "Arte",
                "type": "text",
                "question": "Quale scultore francese è celebre per la statua 'Il Pensatore'?",
                "answer": "Auguste Rodin"
              },
              {
                "id": 96,
                "category": "Arte",
                "type": "boolean",
                "question": "Il Rinascimento fu un periodo di grande innovazione artistica in Europa?",
                "answer": "Vero"
              },
              {
                "id": 97,
                "category": "Arte",
                "type": "multiple",
                "question": "Quale movimento artistico è noto per l'uso di oggetti di consumo e immagini della cultura pop?",
                "options": [
                  "Dadaismo",
                  "Pop Art",
                  "Futurismo",
                  "Espressionismo"
                ],
                "answer": "Pop Art"
              },
              {
                "id": 98,
                "category": "Arte",
                "type": "boolean",
                "question": "L'arte moderna comprende opere create tra il 1860 e il 1970?",
                "answer": "Vero"
              },
              {
                "id": 99,
                "category": "Arte",
                "type": "text",
                "question": "Chi è stato il principale esponente del movimento artistico della Pop Art?",
                "answer": "Andy Warhol"
              },
              {
                "id": 100,
                "category": "Arte",
                "type": "text",
                "question": "Chi ha dipinto 'La Notte Stellata'?",
                "answer": "Vincent van Gogh"
              }, {
                "id": 101,
                "category": "Musica",
                "type": "multiple",
                "question": "Chi è l'autore della canzone 'Bohemian Rhapsody'?",
                "options": [
                  "The Beatles",
                  "Queen",
                  "The Rolling Stones",
                  "Led Zeppelin"
                ],
                "answer": "Queen"
              },
              {
                "id": 102,
                "category": "Musica",
                "type": "text",
                "question": "Chi è il 'Re del Pop'?",
                "answer": "Michael Jackson"
              },
              {
                "id": 103,
                "category": "Musica",
                "type": "multiple",
                "question": "Quale di questi strumenti è a corda?",
                "options": [
                  "Pianoforte",
                  "Violino",
                  "Flauto",
                  "Sassofono"
                ],
                "answer": "Violino"
              },
              {
                "id": 104,
                "category": "Musica",
                "type": "boolean",
                "question": "Ludwig van Beethoven era cieco?",
                "answer": "Falso"
              },
              {
                "id": 105,
                "category": "Musica",
                "type": "text",
                "question": "Quale band ha scritto l'album 'The Dark Side of the Moon'?",
                "answer": "Pink Floyd"
              },
              {
                "id": 106,
                "category": "Musica",
                "type": "multiple",
                "question": "Chi ha composto 'Le quattro stagioni'?",
                "options": [
                  "Bach",
                  "Mozart",
                  "Vivaldi",
                  "Beethoven"
                ],
                "answer": "Vivaldi"
              },
              {
                "id": 107,
                "category": "Musica",
                "type": "text",
                "question": "Chi è il cantante dei Rolling Stones?",
                "answer": "Mick Jagger"
              },
              {
                "id": 108,
                "category": "Musica",
                "type": "boolean",
                "question": "La chitarra è uno strumento a fiato?",
                "answer": "Falso"
              },
              {
                "id": 109,
                "category": "Musica",
                "type": "text",
                "question": "Qual è il nome del primo album dei Beatles?",
                "answer": "Please Please Me"
              },
              {
                "id": 110,
                "category": "Musica",
                "type": "multiple",
                "question": "Chi ha scritto l'opera 'La Traviata'?",
                "options": [
                  "Puccini",
                  "Verdi",
                  "Rossini",
                  "Donizetti"
                ],
                "answer": "Verdi"
              },
              {
                "id": 111,
                "category": "Musica",
                "type": "text",
                "question": "Chi è il fondatore dei Nirvana?",
                "answer": "Kurt Cobain"
              },
              {
                "id": 112,
                "category": "Musica",
                "type": "boolean",
                "question": "Elvis Presley è nato in Inghilterra?",
                "answer": "Falso"
              },
              {
                "id": 113,
                "category": "Musica",
                "type": "multiple",
                "question": "Quale di questi è un genere musicale?",
                "options": [
                  "Cubismo",
                  "Rinascimento",
                  "Jazz",
                  "Barocco"
                ],
                "answer": "Jazz"
              },
              {
                "id": 114,
                "category": "Musica",
                "type": "text",
                "question": "Chi ha scritto la canzone 'Imagine'?",
                "answer": "John Lennon"
              },
              {
                "id": 115,
                "category": "Musica",
                "type": "multiple",
                "question": "Quale cantante è noto per l'album 'Like a Virgin'?",
                "options": [
                  "Madonna",
                  "Britney Spears",
                  "Lady Gaga",
                  "Mariah Carey"
                ],
                "answer": "Madonna"
              },
              {
                "id": 116,
                "category": "Musica",
                "type": "boolean",
                "question": "Il pianoforte ha 88 tasti?",
                "answer": "Vero"
              },
              {
                "id": 117,
                "category": "Musica",
                "type": "text",
                "question": "Chi ha scritto l'inno nazionale italiano?",
                "answer": "Goffredo Mameli"
              },
              {
                "id": 118,
                "category": "Musica",
                "type": "multiple",
                "question": "Quale band è famosa per la canzone 'Stairway to Heaven'?",
                "options": [
                  "Queen",
                  "Pink Floyd",
                  "Led Zeppelin",
                  "The Doors"
                ],
                "answer": "Led Zeppelin"
              },
              {
                "id": 119,
                "category": "Musica",
                "type": "text",
                "question": "Chi ha scritto la colonna sonora di 'Il Padrino'?",
                "answer": "Nino Rota"
              },
              {
                "id": 120,
                "category": "Musica",
                "type": "boolean",
                "question": "Il clarinetto è uno strumento a fiato?",
                "answer": "Vero"
              },{
                "id": 121,
                "category": "Cinema",
                "type": "multiple",
                "question": "Chi ha diretto il film 'Inception'?",
                "options": [
                  "Christopher Nolan",
                  "Steven Spielberg",
                  "Martin Scorsese",
                  "Ridley Scott"
                ],
                "answer": "Christopher Nolan"
              },
              {
                "id": 122,
                "category": "Cinema",
                "type": "boolean",
                "question": "Il film 'Titanic' è uscito nel 1997?",
                "answer": "Vero"
              },
              {
                "id": 123,
                "category": "Cinema",
                "type": "text",
                "question": "In quale film Tom Hanks interpreta il personaggio di Forrest Gump?",
                "answer": "Forrest Gump"
              },
              {
                "id": 124,
                "category": "Cinema",
                "type": "multiple",
                "question": "Chi ha vinto l'Oscar come miglior attore nel 2020?",
                "options": [
                  "Leonardo DiCaprio",
                  "Joaquin Phoenix",
                  "Brad Pitt",
                  "Tom Hanks"
                ],
                "answer": "Joaquin Phoenix"
              },
              {
                "id": 125,
                "category": "Cinema",
                "type": "boolean",
                "question": "Il film 'The Matrix' è stato diretto da Joel ed Ethan Coen?",
                "answer": "Falso"
              },
              {
                "id": 126,
                "category": "Cinema",
                "type": "text",
                "question": "Chi ha interpretato il ruolo di Jack Dawson in 'Titanic'?",
                "answer": "Leonardo DiCaprio"
              },
              {
                "id": 127,
                "category": "Cinema",
                "type": "multiple",
                "question": "Quale film ha vinto l'Oscar come miglior film nel 2019?",
                "options": [
                  "Green Book",
                  "Roma",
                  "The Favourite",
                  "Bohemian Rhapsody"
                ],
                "answer": "Green Book"
              },
              {
                "id": 128,
                "category": "Cinema",
                "type": "boolean",
                "question": "Il film 'Gladiator' ha vinto 5 premi Oscar?",
                "answer": "Vero"
              },
              {
                "id": 129,
                "category": "Cinema",
                "type": "text",
                "question": "Chi ha scritto e diretto il film 'Pulp Fiction'?",
                "answer": "Quentin Tarantino"
              },
              {
                "id": 130,
                "category": "Cinema",
                "type": "multiple",
                "question": "In quale anno è uscito il film 'Avatar' di James Cameron?",
                "options": [
                  "2005",
                  "2008",
                  "2010",
                  "2009"
                ],
                "answer": "2009"
              },
              {
                "id": 131,
                "category": "Cinema",
                "type": "boolean",
                "question": "Nel film 'Il Signore degli Anelli', Gandalf è interpretato da Ian McKellen?",
                "answer": "Vero"
              },
              {
                "id": 132,
                "category": "Cinema",
                "type": "text",
                "question": "Qual è il nome del personaggio principale nel film 'The Godfather'?",
                "answer": "Vito Corleone"
              },
              {
                "id": 133,
                "category": "Cinema",
                "type": "multiple",
                "question": "Chi ha interpretato il ruolo di Joker nel film 'The Dark Knight'?",
                "options": [
                  "Jared Leto",
                  "Heath Ledger",
                  "Jack Nicholson",
                  "Tom Hardy"
                ],
                "answer": "Heath Ledger"
              },
              {
                "id": 134,
                "category": "Cinema",
                "type": "boolean",
                "question": "Il film 'La La Land' ha vinto sei premi Oscar?",
                "answer": "Vero"
              },
              {
                "id": 135,
                "category": "Cinema",
                "type": "text",
                "question": "Chi ha diretto il film 'Schindler's List'?",
                "answer": "Steven Spielberg"
              },
              {
                "id": 136,
                "category": "Cinema",
                "type": "multiple",
                "question": "Chi ha vinto il premio Oscar come miglior attrice nel 2019?",
                "options": [
                  "Nicole Kidman",
                  "Charlize Theron",
                  "Renée Zellweger",
                  "Scarlett Johansson"
                ],
                "answer": "Renée Zellweger"
              },
              {
                "id": 137,
                "category": "Cinema",
                "type": "boolean",
                "question": "Il film 'Jurassic Park' è basato su un libro di Michael Crichton?",
                "answer": "Vero"
              },
              {
                "id": 138,
                "category": "Cinema",
                "type": "text",
                "question": "Qual è il nome del regista del film 'Inglourious Basterds'?",
                "answer": "Quentin Tarantino"
              },
              {
                "id": 139,
                "category": "Cinema",
                "type": "multiple",
                "question": "In quale film recita il personaggio di Darth Vader?",
                "options": [
                  "Star Wars: A New Hope",
                  "The Empire Strikes Back",
                  "Return of the Jedi",
                  "The Phantom Menace"
                ],
                "answer": "Star Wars: A New Hope"
              },
              {
                "id": 140,
                "category": "Cinema",
                "type": "boolean",
                "question": "Il film 'Forrest Gump' è basato su un libro di Winston Groom?",
                "answer": "Vero"
              },
              {
                "id": 141,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto 'Il Grande Gatsby'?",
                "options": [
                  "Ernest Hemingway",
                  "F. Scott Fitzgerald",
                  "William Faulkner",
                  "John Steinbeck"
                ],
                "answer": "F. Scott Fitzgerald"
              },
              {
                "id": 142,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Don Chisciotte' è stato scritto da Miguel de Cervantes?",
                "answer": "Vero"
              },
              {
                "id": 143,
                "category": "Letteratura",
                "type": "text",
                "question": "Chi è l'autore di 'I Promessi Sposi'?",
                "answer": "Alessandro Manzoni"
              },
              {
                "id": 144,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto '1984'?",
                "options": [
                  "Aldous Huxley",
                  "George Orwell",
                  "Ray Bradbury",
                  "J.R.R. Tolkien"
                ],
                "answer": "George Orwell"
              },
              {
                "id": 145,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Orgoglio e Pregiudizio' è stato scritto da Charlotte Brontë?",
                "answer": "Falso"
              },
              {
                "id": 146,
                "category": "Letteratura",
                "type": "text",
                "question": "Chi ha scritto 'Il Processo'?",
                "answer": "Franz Kafka"
              },
              {
                "id": 147,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto 'Moby Dick'?",
                "options": [
                  "Herman Melville",
                  "Mark Twain",
                  "H.G. Wells",
                  "Jack London"
                ],
                "answer": "Herman Melville"
              },
              {
                "id": 148,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Il giovane Holden' è stato scritto da J.D. Salinger?",
                "answer": "Vero"
              },
              {
                "id": 149,
                "category": "Letteratura",
                "type": "text",
                "question": "Chi ha scritto 'La Metamorfosi'?",
                "answer": "Franz Kafka"
              },
              {
                "id": 150,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto 'Le affinità elettive'?",
                "options": [
                  "Hermann Hesse",
                  "Johann Wolfgang von Goethe",
                  "Friedrich Nietzsche",
                  "Thomas Mann"
                ],
                "answer": "Johann Wolfgang von Goethe"
              },
              {
                "id": 151,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Il Signore degli Anelli' è stato scritto da C.S. Lewis?",
                "answer": "Falso"
              },
              {
                "id": 152,
                "category": "Letteratura",
                "type": "text",
                "question": "Chi ha scritto 'Frankenstein'?",
                "answer": "Mary Shelley"
              },
              {
                "id": 153,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto 'Anna Karenina'?",
                "options": [
                  "Fëdor Dostoevskij",
                  "Lev Tolstoj",
                  "Anton Čechov",
                  "Nikolaj Gogol"
                ],
                "answer": "Lev Tolstoj"
              },
              {
                "id": 154,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Guerra e Pace' è stato scritto da Lev Tolstoj?",
                "answer": "Vero"
              },
              {
                "id": 155,
                "category": "Letteratura",
                "type": "text",
                "question": "Chi ha scritto 'Il Capitale'?",
                "answer": "Karl Marx"
              },
              {
                "id": 156,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto 'Cime tempestose'?",
                "options": [
                  "Jane Austen",
                  "Emily Brontë",
                  "Charlotte Brontë",
                  "Mary Shelley"
                ],
                "answer": "Emily Brontë"
              },
              {
                "id": 157,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Il Conte di Montecristo' è stato scritto da Alexandre Dumas?",
                "answer": "Vero"
              },
              {
                "id": 158,
                "category": "Letteratura",
                "type": "text",
                "question": "Chi ha scritto 'Il Piccolo Principe'?",
                "answer": "Antoine de Saint-Exupéry"
              },
              {
                "id": 159,
                "category": "Letteratura",
                "type": "multiple",
                "question": "Chi ha scritto 'Il Maestro e Margherita'?",
                "options": [
                  "Boris Pasternak",
                  "Mikhail Bulgakov",
                  "Aleksandr Solzhenicyn",
                  "Ivan Turgenev"
                ],
                "answer": "Mikhail Bulgakov"
              },
              {
                "id": 160,
                "category": "Letteratura",
                "type": "boolean",
                "question": "'Il Gattopardo' è stato scritto da Giuseppe Tomasi di Lampedusa?",
                "answer": "Vero"
              }
            ]
          
};

// Funzione per eseguire un debug del modale
function debugModal() {
    console.log('Esecuzione debug modale');
    
    // Controllo se ci sono elementi con z-index superiore al modale
    const modalZIndex = 1000; // Il valore di z-index del modale
    const elements = document.querySelectorAll('*');
    const higherElements = [];
    
    elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const zIndex = parseInt(style.zIndex);
        if (!isNaN(zIndex) && zIndex > modalZIndex) {
            higherElements.push({
                element: el.tagName,
                id: el.id,
                class: el.className,
                zIndex: zIndex
            });
        }
    });
    
    if (higherElements.length > 0) {
        console.log('Elementi con z-index più alto del modale:', higherElements);
    } else {
        console.log('Nessun elemento con z-index più alto del modale');
    }
    
    // Verifica se il modale esiste
    const modal = document.getElementById('quizModal');
    if (modal) {
        console.log('Modale trovato nel DOM');
        const style = window.getComputedStyle(modal);
        console.log('Stile del modale:', {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            zIndex: style.zIndex,
            position: style.position
        });
    } else {
        console.log('Modale non trovato nel DOM');
    }
    
    // Prova a forzare la creazione di un modale di test
    console.log('Creazione modale di test');
    const testModal = document.createElement('div');
    testModal.className = 'modal active';
    testModal.id = 'testModal';
    testModal.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    testModal.innerHTML = `
        <div class="modal-content">
            <h2>Modale di test</h2>
            <p>Questo è un modale di test per il debugging.</p>
            <button onclick="this.parentNode.parentNode.remove()">Chiudi</button>
        </div>
    `;
    document.body.appendChild(testModal);
    
    // Forza display flex con timeout per assicurarsi che venga processato
    setTimeout(() => {
        if (testModal.parentNode) {
            testModal.style.display = 'flex';
            console.log('Modale di test forzato a display flex');
        }
    }, 100);
}

/**
 * Visualizza una domanda all'utente
 * @param {Object} question - La domanda da visualizzare
 * @param {Object} modal - L'elemento modale (opzionale)
 * @param {boolean} isChosenCategory - Se la categoria è stata scelta dal giocatore (opzionale)
 */
function displayQuestion(question, isChosenCategory = false) {
    // Chiudi qualsiasi altra modale aperta prima di mostare la domanda
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(m => m.classList.remove('active'));
    
    console.log('Showing question:', question, 'isChosenCategory:', isChosenCategory);
    
    // Crea una nuova modale per la domanda
    let questionModal = document.getElementById('questionModal');
    
    // Se la modale esiste già, riutilizzala, altrimenti creane una nuova
    if (!questionModal) {
        questionModal = document.createElement('div');
        questionModal.className = 'modal';
        questionModal.id = 'questionModal';
        document.body.appendChild(questionModal);
    }
    
    let questionHTML = `
        <div class="modal-content">
            <span class="category-badge">${question.category}</span>
            <h2>Domanda</h2>
            <div class="question-text">${question.question}</div>
            <div class="timer-container">
                <div class="timer-bar"></div>
            </div>
    `;

    if (question.type === 'multiple') {
        questionHTML += `<div class="question-options">`;
        question.options.forEach((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            questionHTML += `
                <div class="option" data-value="${option}">
                    <span class="option-letter">${letter}</span>
                    <span class="option-text">${option}</span>
                </div>
            `;
        });
        questionHTML += `</div>`;
    } else if (question.type === 'boolean') {
        questionHTML += `
            <div class="question-options">
                <button class="option-button" data-value="true">
                    <i class="fas fa-check"></i> Vero
                </button>
                <button class="option-button" data-value="false">
                    <i class="fas fa-times"></i> Falso
                </button>
            </div>
        `;
    } else {
        // Tipo text o default
        questionHTML += `
            <div class="form-control">
                <input type="text" id="answerInput" placeholder="Scrivi la tua risposta..." autocomplete="off">
                <button id="submitAnswer" class="primary-button">Invia</button>
            </div>
        `;
    }

    questionHTML += `</div>`;
    questionModal.innerHTML = questionHTML;
    
    // Attiva la modale
    setTimeout(() => {
        questionModal.classList.add('active');
    }, 100);

    // Imposta il timer
    const timerDuration = 30; // Secondi
    startQuestionTimer(timerDuration, () => {
        timeOver(question.answer);
    });

    // Gestisci gli eventi per i diversi tipi di domande
    if (question.type === 'multiple') {
        const options = questionModal.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.dataset.value;
                
                // Evidenzia l'opzione selezionata
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Controlla risposta dopo un breve ritardo
                setTimeout(() => {
                    const isCorrect = selectedValue === question.answer;
                    
                    // Evidenzia risposta corretta/sbagliata
                    options.forEach(opt => {
                        if (opt.dataset.value === question.answer) {
                            opt.classList.add('correct');
                        } else if (opt === this && !isCorrect) {
                            opt.classList.add('incorrect');
                        }
                    });
                    
                    showQuestionResult(isCorrect, question.answer, isChosenCategory);
                }, 500);
            });
        });
    } else if (question.type === 'boolean') {
        const buttons = questionModal.querySelectorAll('.option-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const selectedValue = this.dataset.value;
                
                // Evidenzia l'opzione selezionata
                buttons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                
                // Controlla risposta dopo un breve ritardo
                setTimeout(() => {
                    const correctValue = question.answer === 'Vero' ? 'true' : 'false';
                    const isCorrect = selectedValue === correctValue;
                    
                    // Evidenzia risposta corretta/sbagliata
                    buttons.forEach(btn => {
                        if (btn.dataset.value === correctValue) {
                            btn.classList.add('correct');
                        } else if (btn === this && !isCorrect) {
                            btn.classList.add('incorrect');
                        }
                    });
                    
                    showQuestionResult(isCorrect, question.answer, isChosenCategory);
                }, 500);
            });
        });
    } else {
        const submitButton = questionModal.querySelector('#submitAnswer');
        const inputField = questionModal.querySelector('#answerInput');
        
        // Attiva l'invio anche premendo Enter
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
        
        // Focus sul campo input
        setTimeout(() => {
            inputField.focus();
        }, 300);
        
        submitButton.addEventListener('click', function() {
            const userAnswer = inputField.value.trim();
            if (userAnswer) {
                const isCorrect = checkTextAnswer(userAnswer, question.answer);
                showQuestionResult(isCorrect, question.answer, isChosenCategory);
            }
        });
    }
}

/**
 * Confronta la risposta dell'utente con quella corretta, con tolleranza agli errori di battitura
 * @param {string} userAnswer - La risposta fornita dall'utente
 * @param {string} correctAnswer - La risposta corretta
 * @returns {boolean} - true se la risposta è considerata corretta
 */
function checkTextAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    userAnswer = userAnswer.toLowerCase();
    correctAnswer = correctAnswer.toLowerCase();
    
    // Prima verifica: corrispondenza esatta
    if (userAnswer === correctAnswer) return true;
    
    // Seconda verifica: ignora spazi e punteggiatura
    const cleanUserAnswer = userAnswer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");
    const cleanCorrectAnswer = correctAnswer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");
    
    if (cleanUserAnswer === cleanCorrectAnswer) return true;
    
    // Terza verifica: calcola la distanza di Levenshtein (errori di battitura)
    const maxDistance = Math.max(3, Math.floor(correctAnswer.length / 5)); // Permette errori proporzionali alla lunghezza
    const distance = levenshteinDistance(cleanUserAnswer, cleanCorrectAnswer);
    
    return distance <= maxDistance;
}

/**
 * Calcola la distanza di Levenshtein tra due stringhe (numero minimo di modifiche)
 * @param {string} a - Prima stringa
 * @param {string} b - Seconda stringa
 * @returns {number} - La distanza tra le stringhe
 */
function levenshteinDistance(a, b) {
    const matrix = [];
    
    // Inizializzazione
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    // Riempimento della matrice
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1, // sostituzione
                    matrix[i][j-1] + 1,   // inserimento
                    matrix[i-1][j] + 1    // eliminazione
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

// Variabile globale per il timeout del timer
let timerTimeout = null;
let timerInterval = null;

/**
 * Avvia un timer per la domanda corrente
 * @param {number} seconds - Durata del timer in secondi
 * @param {Function} callback - Funzione da chiamare allo scadere del timer
 */
function startQuestionTimer(seconds, callback) {
    // Trova l'elemento timer
    const timerBar = document.querySelector('.timer-bar');
    if (!timerBar) {
        console.error('Timer bar non trovata');
        return;
    }
    
    // Imposta la larghezza iniziale al 100%
    timerBar.style.width = '100%';
    
    // Imposta la transizione per una diminuzione fluida
    timerBar.style.transition = `width ${seconds}s linear`;
    
    // Dopo un breve ritardo, avvia l'animazione
    setTimeout(() => {
        timerBar.style.width = '0%';
    }, 50);
    
    // Pulisci eventuali timer precedenti
    clearQuestionTimer();
    
    // Imposta il timeout per la fine del timer
    timerTimeout = setTimeout(() => {
        callback();
    }, seconds * 1000);
}

/**
 * Pulisce il timer delle domande
 */
function clearQuestionTimer() {
    if (timerTimeout) {
        clearTimeout(timerTimeout);
        timerTimeout = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Gestisce lo scadere del tempo per una domanda
 * @param {string} correctAnswer - La risposta corretta alla domanda
 */
function timeOver(correctAnswer) {
    // Mostra il risultato come risposta sbagliata
    showQuestionResult(false, correctAnswer);
    showAnimatedNotification('Tempo scaduto!', 'error');
}

/**
 * Mostra il risultato della risposta a una domanda
 * @param {boolean} isCorrect - Se la risposta è corretta
 * @param {string} correctAnswer - La risposta corretta alla domanda
 * @param {boolean} isChosenCategory - Se la domanda è di una categoria scelta dal giocatore
 */
function showQuestionResult(isCorrect, correctAnswer, isChosenCategory = false) {
    // Ottieni la modale attiva
    const questionModal = document.getElementById('questionModal');
    if (!questionModal) {
        console.error('Modale della domanda non trovata');
        return;
    }

    console.log('showQuestionResult - isCorrect:', isCorrect, 'isChosenCategory:', isChosenCategory);
    console.log('Player usedCategoryChoice flag:', players[currentPlayerIndex].usedCategoryChoice);

    // Ferma il timer
    clearQuestionTimer();
    
    // Ottieni il contenuto della modale
    const modalContent = questionModal.querySelector('.modal-content');
    if (!modalContent) {
        console.error('Contenuto della modale non trovato');
        return;
    }
    
    // Crea l'elemento per il risultato
    const resultDiv = document.createElement('div');
    resultDiv.className = `question-result ${isCorrect ? 'correct-answer' : 'wrong-answer'}`;
    
    // Imposta il contenuto del risultato
    if (isCorrect) {
        resultDiv.innerHTML = `
            <div class="result-message success">
                <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;"></i>
                <h3>Risposta Corretta!</h3>
                <p>Ottimo lavoro! La risposta era: "${correctAnswer}"</p>
            </div>
        `;
        playSound('correct');
    } else {
        resultDiv.innerHTML = `
            <div class="result-message error">
                <i class="fas fa-times-circle" style="color: #f44336; font-size: 24px; margin-bottom: 10px;"></i>
                <h3>Risposta Sbagliata</h3>
                <p>La risposta corretta era: "${correctAnswer}"</p>
            </div>
        `;
        playSound('wrong');
    }
    
    // Aggiungi il bottone per continuare
    const continueButton = document.createElement('button');
    continueButton.className = 'primary-button';
    continueButton.textContent = 'Continua';
    continueButton.style.marginTop = '20px';
    continueButton.addEventListener('click', () => {
        closeQuestionModal();
        nextPlayer();
    });
    
    resultDiv.appendChild(continueButton);
    
    // Aggiungi il risultato alla modale
    modalContent.appendChild(resultDiv);
    
    // Ottieni il player attuale
    const player = players[currentPlayerIndex];
    
    // Verifica se il player ha l'abilità di guadagnare stelle con risposte corrette
    const hasStarEarningAbility = player.powerups && player.powerups.earnsStarsFromAnswers;
    
    // Aggiorna le stelle solo se ha l'abilità o se è stata usata la scelta categoria
    const categoryChoiceUsed = player.usedCategoryChoice === true || isChosenCategory === true;
    
    // Aggiorna le info del player in base alla risposta
    if (isCorrect) {
        // Incrementa il contatore delle risposte corrette
        if (!player.stats) player.stats = { correct: 0, incorrect: 0 };
        player.stats.correct++;
        
        // Aggiungi 10 crediti per ogni risposta corretta
        if (!player.credits) player.credits = 0;
        player.credits += 10;
        
        // Fornisci la stella SOLO se ha l'abilità di guadagnare stelle oppure ha usato la scelta categoria
        if (hasStarEarningAbility || categoryChoiceUsed) {
            player.stars++;
            showAnimatedNotification(`Hai guadagnato una stella! ⭐`, 'success');
            saveGameData();
            renderPlayerInfo();
            addToGameLog(`${player.name} ha risposto correttamente e ha guadagnato una stella! ⭐`);
            showStarCollectionEffect(player);
        } else {
            addToGameLog(`${player.name} ha risposto correttamente e ha guadagnato 10 crediti! 💰`);
        }
    } else {
        // Incrementa il contatore delle risposte sbagliate
        if (!player.stats) player.stats = { correct: 0, incorrect: 0 };
        player.stats.incorrect++;
        addToGameLog(`${player.name} ha risposto in modo errato.`);
    }
    
    // Resetta il flag della scelta categoria
    player.usedCategoryChoice = false;
    
    // Aggiorna UI player
    renderPlayerInfo();
    
    // Imposta un timer per chiudere automaticamente la modale dopo un po'
    setTimeout(() => {
        if (document.getElementById('questionModal') && 
            document.getElementById('questionModal').classList.contains('active')) {
            closeQuestionModal();
            nextPlayer();
        }
    }, 8000);
}

// Funzione per chiudere la modale delle domande
function closeQuestionModal() {
    const questionModal = document.getElementById('questionModal');
    if (questionModal) {
        questionModal.classList.remove('active');
        // Rimuovi la modale dal DOM dopo l'animazione
        setTimeout(() => {
            if (questionModal.parentNode) {
                questionModal.parentNode.removeChild(questionModal);
            }
        }, 300);
    }
}

/**
 * Mostra lo shop per acquistare oggetti
 */
function showShop() {
    if (!gameStarted) return;
    
    // Verifica se lo shop è già aperto
    if (document.getElementById('shopModal')) {
        return; // Esci se c'è già uno shop modale aperto
    }
    
    // Verifica se è possibile usare lo shop (solo prima del lancio del dado e quando non ci sono passi rimanenti)
    if (diceRolling) {
        showAnimatedNotification('Non puoi usare lo shop durante il tiro del dado', 'error');
        return;
    }
    
    // Verifica che il giocatore non abbia passi rimanenti da completare
    const player = players[currentPlayerIndex];
    if (player.remainingSteps && player.remainingSteps > 0) {
        showAnimatedNotification('Devi prima completare il movimento', 'error');
        return;
    }
    
    if (!player.credits) player.credits = 0;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'shopModal';
    
    // Preparare gli articoli dello shop
    const shopItems = [
        {
            id: 'extra-dice',
            name: 'Dado Extra',
            description: 'Lancia il dado un\'altra volta in questo turno',
            price: 20,
            action: function() {
                addToGameLog(`${players[currentPlayerIndex].name} ha acquistato un Dado Extra`);
                
                // Abilita il pulsante del dado immediatamente
                if (diceButton) {
                    diceButton.disabled = false;
                    diceRolling = false;
                    
                    // Aggiungi un'animazione per evidenziare il dado
                    diceButton.classList.add('extra-roll');
                    setTimeout(() => {
                        diceButton.classList.remove('extra-roll');
                    }, 1500);
                }
                
                // Salva lo stato del gioco
                saveGameData();
                
                // Mostra notifica
                showAnimatedNotification('Ora puoi lanciare il dado di nuovo!', 'success');
            }
        },
        {
            id: 'extra-star',
            name: 'Stella Extra',
            description: 'Ottieni immediatamente una stella',
            price: 150,
            action: function() {
                const player = players[currentPlayerIndex];
                player.stars++;
                
                addToGameLog(`${player.name} ha acquistato una Stella Extra`);
                
                // Effetti visivi
                playSound('star');
                showStarCollectionEffect();
                
                // Aggiorna l'UI
                renderPlayerInfo();
                
                // Salva lo stato del gioco
                saveGameData();
                
                showAnimatedNotification('Hai ottenuto una stella!', 'success');
                
                // Controlla vittoria dopo un piccolo ritardo per permettere le animazioni
                setTimeout(() => {
                    checkWinCondition();
                }, 1000);
            }
        },
        {
            id: 'shield',
            name: 'Ruba Crediti',
            description: 'Ruba 30 crediti da un altro giocatore a tua scelta',
            price: 60,
            action: function() {
                const currentPlayer = players[currentPlayerIndex];
                
                // Crea una modale per scegliere il giocatore da cui rubare
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.id = 'stealModal';
                
                let playersHTML = '';
                players.forEach((player, index) => {
                    // Non mostrare il giocatore corrente
                    if (index !== currentPlayerIndex) {
                        playersHTML += `
                            <div class="player-steal-option" data-player-index="${index}">
                                <span class="player-avatar" style="background-color: ${player.color}">
                                    ${player.avatar}
                                </span>
                                <span class="player-name">${player.name}</span>
                                <span class="player-credits">${player.credits || 0} <i class="fas fa-gem" style="color: #3b82f6;"></i></span>
                            </div>
                        `;
                    }
                });
                
                modal.innerHTML = `
                    <div class="modal-content">
                        <h2>Ruba Crediti</h2>
                        <p>Scegli il giocatore da cui rubare 30 crediti:</p>
                        <div class="player-steal-options">
                            ${playersHTML}
                        </div>
                        <button id="cancelStealBtn" class="btn btn-secondary">Annulla</button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Aggiungi stile inline per le opzioni di furto
                const style = document.createElement('style');
                style.textContent = `
                    .player-steal-option {
                        display: flex;
                        align-items: center;
                        padding: 15px;
                        margin: 10px 0;
                        background: rgba(30, 41, 59, 0.6);
                        border-radius: var(--border-radius);
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .player-steal-option:hover {
                        transform: translateY(-2px);
                        background: rgba(30, 41, 59, 0.8);
                    }
                    .player-avatar {
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                    .player-name {
                        flex: 1;
                    }
                    .player-credits {
                        font-weight: bold;
                    }
                `;
                document.head.appendChild(style);
                
                // Aggiungi event listener per il pulsante di annullamento
                document.getElementById('cancelStealBtn').addEventListener('click', () => {
                    modal.remove();
                    // Restituisci i crediti spesi
                    currentPlayer.credits += 60;
                    renderPlayerInfo();
                });
                
                // Aggiungi event listener per le opzioni di furto
                const stealOptions = modal.querySelectorAll('.player-steal-option');
                stealOptions.forEach(option => {
                    option.addEventListener('click', function() {
                        const targetIndex = parseInt(this.dataset.playerIndex);
                        const targetPlayer = players[targetIndex];
                        
                        // Verifica che il giocatore target abbia abbastanza crediti
                        if (targetPlayer.credits && targetPlayer.credits >= 30) {
                            // Sottrai i crediti al giocatore target
                            targetPlayer.credits -= 30;
                            // Aggiungi i crediti al giocatore corrente (oltre a quelli spesi)
                            currentPlayer.credits += 30;
                            
                            addToGameLog(`${currentPlayer.name} ha rubato 30 crediti a ${targetPlayer.name}!`);
                            showAnimatedNotification(`Hai rubato 30 crediti a ${targetPlayer.name}!`, 'success');
                            
                            // Aggiorna l'UI
                            renderPlayerInfo();
                            
                            // Salva lo stato del gioco
                            saveGameData();
                        } else {
                            // Il giocatore non ha abbastanza crediti
                            showAnimatedNotification(`${targetPlayer.name} non ha abbastanza crediti da rubare!`, 'error');
                            // Restituisci i crediti spesi
                            currentPlayer.credits += 60;
                            renderPlayerInfo();
                        }
                        
                        // Chiudi la modale
                        modal.remove();
                    });
                });
            }
        },
        {
            id: 'category-choice',
            name: 'Scelta Categoria',
            description: 'Scegli la categoria della prossima domanda. Se rispondi correttamente otterrai anche una stella!',
            price: 100,
            action: function() {
                const player = players[currentPlayerIndex];
                if (!player.powerups) player.powerups = {};
                if (!player.powerups.categoryChoice) player.powerups.categoryChoice = 0;
                
                player.powerups.categoryChoice++;
                addToGameLog(`${player.name} ha acquistato un powerup Scelta Categoria`);
                showAnimatedNotification('Ora puoi scegliere la categoria della prossima domanda! Risposta corretta = +1 stella!', 'success');
                
                // Salva lo stato del gioco
                saveGameData();
                
                // Aggiorna l'UI per mostrare il powerup
                renderPlayerInfo();
            }
        },
        {
            id: 'triple-star-challenge',
            name: 'Sfida Tripla Stella',
            description: 'Affronta una domanda casuale. Se rispondi correttamente otterrai 3 stelle!',
            price: 200,
            action: function() {
                const player = players[currentPlayerIndex];
                
                addToGameLog(`${player.name} ha acquistato la Sfida Tripla Stella`);
                showAnimatedNotification('Affronta la domanda per ottenere 3 stelle!', 'info');
                
                // Seleziona una categoria casuale per la domanda
                const randomCategoryIndex = Math.floor(Math.random() * availableCategories.length);
                const selectedCategory = availableCategories[randomCategoryIndex];
                
                console.log(`Sfida Tripla Stella - Categoria selezionata: ${selectedCategory}`);
                
                // Chiudi il modale dello shop
                const shopModal = document.getElementById('shopModal');
                if (shopModal) {
                    shopModal.remove();
                }
                
                // Mostra una domanda casuale con una callback speciale per gestire 3 stelle
                showTripleStarQuestion(selectedCategory);
            }
        }
    ];
    
    // Genera l'HTML per gli articoli
    let itemsHTML = '';
    shopItems.forEach(item => {
        const canAfford = player.credits >= item.price;
        itemsHTML += `
            <div class="shop-item ${!canAfford ? 'disabled' : ''}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-price">${item.price} <i class="fas fa-coins"></i></div>
                <button class="shop-buy-btn" data-item-id="${item.id}" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'Acquista' : 'Crediti insufficienti'}
                </button>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2><i class="fas fa-store"></i> Negozio</h2>
            <p>Crediti disponibili: <strong>${player.credits} <i class="fas fa-coins" style="color: gold;"></i></strong></p>
            
            <div class="shop-items">
                ${itemsHTML}
            </div>
            
            <button id="closeShopBtn" class="btn btn-secondary">Chiudi</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Aggiungi event listeners
    document.getElementById('closeShopBtn').addEventListener('click', () => {
        modal.remove();
    });
    
    // Aggiungi event listeners per i pulsanti di acquisto
    const buyButtons = modal.querySelectorAll('.shop-buy-btn:not([disabled])');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.itemId;
            purchaseItem(itemId, shopItems, modal);
        });
    });
}

/**
 * Riproduce un suono di gioco
 * @param {string} soundType - Tipo di suono da riprodurre ('move', 'star', 'success', 'error', ecc.)
 */
function playSound(soundType) {
    // Implementazione di base (può essere espansa con suoni reali)
    console.log(`Riproduci suono: ${soundType}`);
    
    // In una versione completa, qui ci sarebbe una vera riproduzione di suoni
    // Ad esempio:
    // const sound = new Audio(`assets/sounds/${soundType}.mp3`);
    // sound.play();
}

/**
 * Mostra una notifica animata
 * @param {string} message - Il messaggio da mostrare
 * @param {string} type - Il tipo di notifica (success, error, info)
 */
function showAnimatedNotification(message, type = 'info') {
    // Crea l'elemento della notifica
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Aggiungi la notifica al documento
    document.body.appendChild(notification);
    
    // Mostra la notifica con animazione
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Rimuovi la notifica dopo 3 secondi
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Passa al giocatore successivo
 */
function nextPlayer() {
    if (!gameStarted) return;
    
    // Rimuovi evidenziazione spazio
    document.querySelectorAll('.space').forEach(s => s.classList.remove('active'));
    
    // Se il giocatore corrente ha ancora passi da fare, non cambiare turno
    if (players[currentPlayerIndex] && players[currentPlayerIndex].remainingSteps > 0) {
        console.log("Il giocatore ha ancora " + players[currentPlayerIndex].remainingSteps + " passi da fare");
        return;
    }
    
    // Resetta i passi rimanenti per il giocatore corrente
    if (players[currentPlayerIndex]) {
        players[currentPlayerIndex].remainingSteps = 0;
    }
    
    // Salva l'indice del giocatore precedente
    const prevPlayerIndex = currentPlayerIndex;
    
    // Passa al prossimo giocatore
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    // Verifica se il prossimo giocatore deve saltare il turno
    if (players[currentPlayerIndex].skipTurn) {
        players[currentPlayerIndex].skipTurn = false;
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
    
    // Solo se il turno è effettivamente cambiato, mostra la notifica
    if (prevPlayerIndex !== currentPlayerIndex) {
        // Aggiungi al log
        addToGameLog(`Turno passato da ${players[prevPlayerIndex].name} a ${players[currentPlayerIndex].name}`);
        
        // Mostra notifica
        showAnimatedNotification(`Tocca a ${players[currentPlayerIndex].name}`, 'info');
        
        // Evidenzia il giocatore corrente
        highlightCurrentPlayer();
        
        // Aggiorna la UI
        renderPlayerInfo();
        updateTurnIndicator();
    }
    
    // Abilita nuovamente il pulsante del dado
    if (diceButton) {
        diceButton.disabled = false;
    }
    
    // Abilita nuovamente il pulsante dello shop
    if (shopButton) {
        shopButton.disabled = false;
    }
}

/**
 * Evidenzia la casella su cui si trova il giocatore attuale
 */
function highlightCurrentPlayerSpace() {
    // Rimuovi eventuali highlight precedenti
    document.querySelectorAll('.space').forEach(s => s.classList.remove('active'));
    
    // Ottieni il giocatore corrente
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || !currentPlayer.position) return;
    
    // Ottieni la casella corrente del giocatore
    const { row, col } = currentPlayer.position;
    if (!gameBoard[row] || !gameBoard[row][col]) return;
    
    const space = gameBoard[row][col].element;
    if (space) {
        space.classList.add('active');
        console.log(`Evidenziata casella [${row},${col}] per il giocatore ${currentPlayer.name}`);
    }
}

/**
 * Aggiunge un messaggio al log di gioco
 * @param {string} message - Il messaggio da aggiungere al log
 */
function addToGameLog(message) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    gameLog.push(`[${timestamp}] ${message}`);
    
    // Limita la dimensione del log
    if (gameLog.length > 50) {
        gameLog.shift();
    }
    
    // Aggiorna la UI del log
    updateGameLogUI();
    
    // Salva lo stato del gioco nel localStorage
    saveGameData();
}

/**
 * Aggiorna l'interfaccia utente del log di gioco
 */
function updateGameLogUI() {
    const logContainer = document.getElementById('gameLog');
    if (!logContainer) return;
    
    // Svuota il container
    logContainer.innerHTML = '';
    
    // Se il log è vuoto, mostra un messaggio
    if (gameLog.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'log-entry';
        emptyMessage.textContent = 'Nessun evento registrato.';
        logContainer.appendChild(emptyMessage);
        return;
    }
    
    // Aggiungi ogni messaggio del log
    gameLog.forEach((message, index) => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = message;
        logEntry.style.animationDelay = `${index * 0.05}s`;
        
        logContainer.appendChild(logEntry);
    });
    
    // Scorri alla fine del log
    logContainer.scrollTop = logContainer.scrollHeight;
}

/**
 * Inizializza il log di gioco
 */
function createGameLog() {
    // Recupera i riferimenti DOM
    const gameLogWrapper = document.getElementById('gameLogWrapper');
    const toggleLogBtn = document.getElementById('toggleLogBtn');
    const logIcon = document.getElementById('logIcon');
    
    if (!gameLogWrapper || !toggleLogBtn) return;
    
    // Imposta lo stato iniziale (espanso o collassato)
    const isCollapsed = localStorage.getItem('gameLogCollapsed') === 'true';
    if (isCollapsed) {
        gameLogWrapper.classList.add('collapsed');
        toggleLogBtn.classList.add('collapsed');
    }
    
    // Aggiungi l'event listener per il toggle
    toggleLogBtn.addEventListener('click', function() {
        // Cambia lo stato della classe collapsed
        gameLogWrapper.classList.toggle('collapsed');
        toggleLogBtn.classList.toggle('collapsed');
        
        // Salva la preferenza dell'utente
        const isNowCollapsed = gameLogWrapper.classList.contains('collapsed');
        localStorage.setItem('gameLogCollapsed', isNowCollapsed);
    });
    
    // Inizializza l'UI del log
    updateGameLogUI();
    console.log('Log di gioco inizializzato');
}

// Funzione per testare direttamente la visualizzazione di una domanda
function testQuestion() {
    console.log('Test diretto della funzione displayQuestion');
    
    // Crea una domanda di test
    const testQuestion = {
        id: 999,
        category: "Test",
        type: "text",
        question: "Questa è una domanda di test. La risposta è 'test'.",
        answer: "test"
    };
    
    // Visualizza la domanda direttamente
    displayQuestion(testQuestion);
}

// Modifica la funzione addDebugButton per utilizzare testQuestion
function addDebugButton() {
    const debugButton = document.createElement('button');
    debugButton.id = 'debugButton';
    debugButton.innerHTML = 'Test Domanda';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '10px';
    debugButton.style.backgroundColor = '#ff5733';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '5px';
    debugButton.style.cursor = 'pointer';
    
    debugButton.addEventListener('click', () => {
        console.log('Pulsante di debug cliccato');
        // Usa direttamente la funzione di test anziché passare per loadRandomQuestion
        testQuestion();
    });
    
    document.body.appendChild(debugButton);
    console.log('Pulsante di debug aggiunto');
}

/**
 * Salva i dati di gioco nel localStorage
 */
function saveGameData() {
    try {
        // Prepara l'oggetto dati da salvare
        const gameData = {
            players,
            currentPlayerIndex,
            gameBoard,
            starPositions,
            specialPositions,
            availableCategories,
            gameLog,
            timestamp: new Date().getTime()
        };
        
        // Salva nel localStorage
        localStorage.setItem('quizPartyGameState', JSON.stringify(gameData));
        console.log('Stato del gioco salvato nel localStorage');
    } catch (error) {
        console.error('Errore durante il salvataggio del gioco:', error);
    }
}

// ... existing code ...
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        console.log('Categories loaded:', categories);
        return categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        // Return default categories if API fails
        return ['Generale', 'Storia', 'Scienza', 'Arte', 'Sport'];
    }
}
// ... existing code ...

/**
 * Mostra una domanda per la sfida tripla stella
 * @param {string} category - La categoria della domanda
 */
function showTripleStarQuestion(category) {
    try {
        console.log('Mostrando domanda per sfida tripla stella, categoria:', category);
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        loadingMessage.textContent = 'Caricamento sfida tripla stella...';
        document.body.appendChild(loadingMessage);
        
        // Ottieni una domanda casuale
        const fetchQuestion = async () => {
            try {
                // Aggiungi un timestamp per evitare il caching del browser
                const timestamp = new Date().getTime();
                const response = await fetch(`${window.API_URL}/api/questions?category=${encodeURIComponent(category)}&_=${timestamp}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const questions = await response.json();
                
                // Rimuovi il messaggio di caricamento
                if (loadingMessage.parentNode) {
                    document.body.removeChild(loadingMessage);
                }
                
                if (!questions || !Array.isArray(questions) || questions.length === 0) {
                    // Se non ci sono domande, usa una domanda generica
                    const defaultQuestion = {
                        question: "Qual è la capitale d'Italia?",
                        answer: "Roma",
                        category: category,
                        type: "text"
                    };
                    displayTripleStarQuestion(defaultQuestion);
                } else {
                    const randomIndex = Math.floor(Math.random() * questions.length);
                    displayTripleStarQuestion(questions[randomIndex]);
                }
            } catch (error) {
                console.error('Errore caricamento domanda tripla stella:', error);
                
                // Rimuovi il messaggio di caricamento
                if (loadingMessage.parentNode) {
                    document.body.removeChild(loadingMessage);
                }
                
                // Domanda di fallback
                const defaultQuestion = {
                    question: "Qual è la capitale d'Italia?",
                    answer: "Roma",
                    category: category,
                    type: "text"
                };
                displayTripleStarQuestion(defaultQuestion);
            }
        };
        
        fetchQuestion();
    } catch (error) {
        console.error('Errore nella sfida tripla stella:', error);
        showAnimatedNotification('Si è verificato un errore con la sfida', 'error');
    }
}

/**
 * Mostra una domanda per la sfida tripla stella
 * @param {Object} question - La domanda da visualizzare
 */
function displayTripleStarQuestion(question) {
    // Chiudi qualsiasi altra modale aperta
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(m => m.classList.remove('active'));
    
    console.log('Mostrando domanda sfida tripla stella:', question);
    
    // Crea una nuova modale per la domanda
    let questionModal = document.createElement('div');
    questionModal.className = 'modal active';
    questionModal.id = 'tripleStarModal';
    
    let questionHTML = `
        <div class="modal-content">
            <span class="category-badge">${question.category}</span>
            <h2>Domanda Tripla Stella</h2>
            <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                <i class="fas fa-star" style="color: gold; font-size: 24px; margin: 0 3px;"></i>
                <i class="fas fa-star" style="color: gold; font-size: 24px; margin: 0 3px;"></i>
                <i class="fas fa-star" style="color: gold; font-size: 24px; margin: 0 3px;"></i>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="timer-container">
                <div class="timer-bar"></div>
            </div>
    `;

    if (question.type === 'multiple') {
        questionHTML += `<div class="question-options">`;
        question.options.forEach((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            questionHTML += `
                <div class="option" data-value="${option}">
                    <span class="option-letter">${letter}</span>
                    <span class="option-text">${option}</span>
                </div>
            `;
        });
        questionHTML += `</div>`;
    } else if (question.type === 'boolean') {
        questionHTML += `
            <div class="question-options">
                <button class="option-button" data-value="true">
                    <i class="fas fa-check"></i> Vero
                </button>
                <button class="option-button" data-value="false">
                    <i class="fas fa-times"></i> Falso
                </button>
            </div>
        `;
    } else {
        // Tipo text o default
        questionHTML += `
            <div class="form-control">
                <input type="text" id="answerInput" placeholder="Scrivi la tua risposta..." autocomplete="off">
                <button id="submitAnswer" class="primary-button">Invia</button>
            </div>
        `;
    }

    questionHTML += `</div>`;
    questionModal.innerHTML = questionHTML;
    
    document.body.appendChild(questionModal);
    
    // Attiva la modale
    setTimeout(() => {
        questionModal.classList.add('active');
    }, 100);

    // Imposta il timer
    const timerDuration = 30; // Secondi
    startQuestionTimer(timerDuration, () => {
        showTripleStarResult(false, question.answer);
    });

    // Gestisci gli eventi per i diversi tipi di domande
    if (question.type === 'multiple') {
        const options = questionModal.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.dataset.value;
                
                // Evidenzia l'opzione selezionata
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Controlla risposta dopo un breve ritardo
                setTimeout(() => {
                    const isCorrect = selectedValue === question.answer;
                    
                    // Evidenzia risposta corretta/sbagliata
                    options.forEach(opt => {
                        if (opt.dataset.value === question.answer) {
                            opt.classList.add('correct');
                        } else if (opt === this && !isCorrect) {
                            opt.classList.add('incorrect');
                        }
                    });
                    
                    showTripleStarResult(isCorrect, question.answer);
                }, 500);
            });
        });
    } else if (question.type === 'boolean') {
        const buttons = questionModal.querySelectorAll('.option-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const selectedValue = this.dataset.value;
                
                // Evidenzia l'opzione selezionata
                buttons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                
                // Controlla risposta dopo un breve ritardo
                setTimeout(() => {
                    const correctValue = question.answer === 'Vero' ? 'true' : 'false';
                    const isCorrect = selectedValue === correctValue;
                    
                    // Evidenzia risposta corretta/sbagliata
                    buttons.forEach(btn => {
                        if (btn.dataset.value === correctValue) {
                            btn.classList.add('correct');
                        } else if (btn === this && !isCorrect) {
                            btn.classList.add('incorrect');
                        }
                    });
                    
                    showTripleStarResult(isCorrect, question.answer);
                }, 500);
            });
        });
    } else {
        const submitButton = questionModal.querySelector('#submitAnswer');
        const inputField = questionModal.querySelector('#answerInput');
        
        // Attiva l'invio anche premendo Enter
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
        
        // Focus sul campo input
        setTimeout(() => {
            inputField.focus();
        }, 300);
        
        submitButton.addEventListener('click', function() {
            const userAnswer = inputField.value.trim();
            if (userAnswer) {
                const isCorrect = checkTextAnswer(userAnswer, question.answer);
                showTripleStarResult(isCorrect, question.answer);
            }
        });
    }
}

/**
 * Mostra il risultato della sfida tripla stella
 * @param {boolean} isCorrect - Se la risposta è corretta
 * @param {string} correctAnswer - La risposta corretta alla domanda
 */
function showTripleStarResult(isCorrect, correctAnswer) {
    // Ferma il timer
    clearQuestionTimer();
    
    // Ottieni la modale attiva
    const modal = document.getElementById('tripleStarModal');
    if (!modal) {
        console.error('Modale tripla stella non trovata');
        return;
    }
    
    // Ottieni il contenuto della modale
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) {
        console.error('Contenuto della modale non trovato');
        return;
    }
    
    // Crea l'elemento per il risultato
    const resultDiv = document.createElement('div');
    resultDiv.className = `question-result ${isCorrect ? 'correct-answer' : 'wrong-answer'}`;
    
    // Ottieni il player attuale
    const player = players[currentPlayerIndex];
    
    // Imposta il contenuto del risultato
    if (isCorrect) {
        // Aggiungi 3 stelle al giocatore
        player.stars += 3;
        
        resultDiv.innerHTML = `
            <div class="result-message success">
                <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;"></i>
                <h3>Risposta Corretta!</h3>
                <p>Hai guadagnato 3 stelle! ⭐⭐⭐</p>
                <p>La risposta era: "${correctAnswer}"</p>
            </div>
        `;
        
        // Effetti visivi e sonori
        playSound('correct');
        
        // Aggiungi al log di gioco
        addToGameLog(`${player.name} ha risposto correttamente alla Sfida Tripla Stella e ha guadagnato 3 stelle! ⭐⭐⭐`);
        
        // Mostra l'effetto delle stelle
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                showStarCollectionEffect(player);
            }, i * 300);
        }
    } else {
        resultDiv.innerHTML = `
            <div class="result-message error">
                <i class="fas fa-times-circle" style="color: #f44336; font-size: 24px; margin-bottom: 10px;"></i>
                <h3>Risposta Sbagliata</h3>
                <p>Non hai guadagnato nessuna stella.</p>
                <p>La risposta corretta era: "${correctAnswer}"</p>
            </div>
        `;
        playSound('wrong');
        addToGameLog(`${player.name} ha risposto in modo errato alla Sfida Tripla Stella.`);
    }
    
    // Aggiungi il bottone per continuare
    const continueButton = document.createElement('button');
    continueButton.className = 'primary-button';
    continueButton.textContent = 'Continua';
    continueButton.style.marginTop = '20px';
    continueButton.addEventListener('click', () => {
        modal.remove();
        
        // Aggiorna l'UI e salva i dati
        renderPlayerInfo();
        saveGameData();
        
        // Controlla condizione di vittoria
        checkWinCondition();
    });
    
    resultDiv.appendChild(continueButton);
    
    // Aggiungi il risultato alla modale
    modalContent.appendChild(resultDiv);
}