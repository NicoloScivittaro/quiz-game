/**
 * Quiz Party - Game Logic
 * Gestisce la logica del gioco e la board interattiva
 */

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
                <span>${player.credits || 0} <i class="fas fa-coins" style="color: gold;"></i></span>
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
    
    // Non impostare ancora il flag usedCategoryChoice
    // Verrà impostato in loadRandomQuestion quando viene effettivamente scelta una categoria
    
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
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        loadingMessage.textContent = 'Caricamento domanda...';
        document.body.appendChild(loadingMessage);

        const response = await fetch('/data/db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data loaded:', data);
        
        if (!data.questions || !Array.isArray(data.questions)) {
            throw new Error('Invalid data format: questions array not found');
        }
        
        const questions = data.questions.filter(q => q.category === category);
        console.log('Filtered questions:', questions);
        
        if (questions.length === 0) {
            console.warn('No questions found for category:', category);
            // Fallback to default questions
            const defaultQuestions = [
                {
                    question: "What is the capital of France?",
                    answer: "Paris",
                    category: category,
                    type: "text"
                }
            ];
            displayQuestion(defaultQuestions[0], isChosenCategory);
            return;
        }

        const randomIndex = Math.floor(Math.random() * questions.length);
        const selectedQuestion = questions[randomIndex];
        console.log('Selected question:', selectedQuestion);
        
        // Remove loading message
        document.body.removeChild(loadingMessage);
        
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
        
        // Fallback to default question
        const defaultQuestion = {
            question: "What is the capital of France?",
            answer: "Paris",
            category: category,
            type: "text"
        };
        displayQuestion(defaultQuestion, isChosenCategory);
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
            id: 1,
            category: "Storia",
            type: "text",
            question: "In che anno è caduto l'Impero Romano d'Occidente?",
            answer: "476 d.C."
        },
        {
            id: 2,
            category: "Storia",
            type: "multiple",
            question: "Chi fu il primo imperatore romano?",
            answer: "Augusto",
            options: ["Augusto", "Giulio Cesare", "Nerone", "Traiano"]
        },
        {
            id: 3,
            category: "Storia",
            type: "boolean",
            question: "La Rivoluzione Francese è iniziata nel 1789.",
            answer: "true"
        },
        
        // Geografia
        {
            id: 4,
            category: "Geografia",
            type: "text",
            question: "Qual è la capitale del Canada?",
            answer: "Ottawa"
        },
        {
            id: 5,
            category: "Geografia",
            type: "multiple",
            question: "Quale di questi paesi non si trova in Europa?",
            answer: "Marocco",
            options: ["Marocco", "Svizzera", "Portogallo", "Ungheria"]
        },
        {
            id: 6,
            category: "Geografia",
            type: "boolean",
            question: "Il Nilo è il fiume più lungo del mondo.",
            answer: "true"
        },
        
        // Scienza
        {
            id: 7,
            category: "Scienza",
            type: "text",
            question: "Qual è l'elemento più abbondante nell'universo?",
            answer: "Idrogeno"
        },
        {
            id: 8,
            category: "Scienza",
            type: "multiple",
            question: "Qual è l'unità di misura della forza?",
            answer: "Newton",
            options: ["Newton", "Joule", "Watt", "Pascal"]
        },
        {
            id: 9,
            category: "Scienza",
            type: "boolean",
            question: "La velocità della luce è maggiore della velocità del suono.",
            answer: "true"
        },
        
        // Sport
        {
            id: 10,
            category: "Sport",
            type: "text",
            question: "In quale sport si gioca a Wimbledon?",
            answer: "Tennis"
        },
        {
            id: 11,
            category: "Sport",
            type: "multiple",
            question: "Quanti giocatori compongono una squadra di pallavolo in campo?",
            answer: "6",
            options: ["5", "6", "7", "8"]
        },
        {
            id: 12,
            category: "Sport",
            type: "boolean",
            question: "Il Brasile ha vinto 5 volte la Coppa del Mondo di calcio.",
            answer: "true"
        },
        
        // Arte
        {
            id: 13,
            category: "Arte",
            type: "text",
            question: "Chi ha dipinto la Gioconda?",
            answer: "Leonardo da Vinci"
        },
        {
            id: 14,
            category: "Arte",
            type: "multiple",
            question: "Quale di questi artisti è associato al Cubismo?",
            answer: "Pablo Picasso",
            options: ["Pablo Picasso", "Caravaggio", "Monet", "Van Gogh"]
        },
        {
            id: 15,
            category: "Arte",
            type: "boolean",
            question: "Michelangelo ha dipinto la Cappella Sistina.",
            answer: "true"
        },
        
        // Musica
        {
            id: 16,
            category: "Musica",
            type: "text",
            question: "Qual è il nome del cantante dei Queen?",
            answer: "Freddie Mercury"
        },
        {
            id: 17,
            category: "Musica",
            type: "multiple",
            question: "Quale strumento suonava Jimi Hendrix?",
            answer: "Chitarra",
            options: ["Chitarra", "Batteria", "Pianoforte", "Sassofono"]
        },
        {
            id: 18,
            category: "Musica",
            type: "boolean",
            question: "Mozart è morto prima di compiere 40 anni.",
            answer: "true"
        },
        
        // Cinema
        {
            id: 19,
            category: "Cinema",
            type: "text",
            question: "Chi ha diretto il film 'Pulp Fiction'?",
            answer: "Quentin Tarantino"
        },
        {
            id: 20,
            category: "Cinema",
            type: "multiple",
            question: "Quale attore ha interpretato Iron Man nel Marvel Cinematic Universe?",
            answer: "Robert Downey Jr.",
            options: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"]
        },
        {
            id: 21,
            category: "Cinema",
            type: "boolean",
            question: "'Titanic' è stato diretto da James Cameron.",
            answer: "true"
        },
        
        // Letteratura
        {
            id: 22,
            category: "Letteratura",
            type: "text",
            question: "Chi ha scritto 'I Promessi Sposi'?",
            answer: "Alessandro Manzoni"
        },
        {
            id: 23,
            category: "Letteratura",
            type: "multiple",
            question: "Quale di questi personaggi è stato creato da J.K. Rowling?",
            answer: "Harry Potter",
            options: ["Harry Potter", "Sherlock Holmes", "Don Chisciotte", "Hercule Poirot"]
        },
        {
            id: 24,
            category: "Letteratura",
            type: "boolean",
            question: "Dante Alighieri scrisse la Divina Commedia in latino.",
            answer: "false"
        }
    ];
}

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
function displayQuestion(question, modal, isChosenCategory = false) {
    try {
        console.log('displayQuestion chiamata con:', question);
        console.log('Tipo della domanda:', question.type);
        console.log('isChosenCategory:', isChosenCategory);
        
        // Se la domanda viene dalla categoria scelta, imposta il flag
        if (isChosenCategory) {
            const player = players[currentPlayerIndex];
            player.usedCategoryChoice = true;
            console.log('Impostato flag usedCategoryChoice per il giocatore', player.name);
        }
        
        // Reset remaining steps to ensure the turn can end properly
        const player = players[currentPlayerIndex];
        if (player.remainingSteps > 0) {
            console.log('Reset dei passi rimanenti per consentire la fine del turno');
            player.remainingSteps = 0;
        }
        
        // Elimina il modale esistente nella pagina se presente
        const existingModal = document.getElementById('quizModal');
        if (existingModal && existingModal.parentNode) {
            console.log('Rimozione modale esistente');
            existingModal.parentNode.removeChild(existingModal);
        }
        
        // Assicurati che question.type sia un valore valido
        if (!question.type || (question.type !== 'multiple' && question.type !== 'boolean' && question.type !== 'text')) {
            console.log('Tipo di domanda non valido o mancante, default a text:', question.type);
            question.type = 'text';
        }
        
        // Crea un nuovo modale con inline style per forzare la visualizzazione
        modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'quizModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex !important; justify-content: center; align-items: center; z-index: 9999;';
        
        // Aggiungi immediatamente al body
        document.body.appendChild(modal);
        console.log('Nuovo modale creato e aggiunto al DOM con stile forzato');
        
        // Costruisci HTML in base al tipo di domanda
        let optionsHTML = '';
        
        if (question.type === 'multiple') {
            // Controlla che le opzioni esistano
            if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
                console.error('Opzioni mancanti per domanda di tipo multiple:', question);
                // Fallback a domanda di tipo testo
                question.type = 'text';
            } else {
                // Mescola le opzioni
                const options = [...question.options];
                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }
                
                options.forEach((option) => {
                    optionsHTML += `
                        <button class="option-button" data-value="${option}">
                            ${option}
                        </button>
                    `;
                });
            }
        } else if (question.type === 'boolean') {
            // Per domande vero/falso con grid layout e stili migliorati
            optionsHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%;">
                    <button class="option-button true-option" data-value="true" 
                            style="background: rgba(76, 175, 80, 0.2); border: 2px solid rgba(76, 175, 80, 0.5); 
                                   padding: 20px; transition: all 0.3s ease; border-radius: 8px;">
                        <i class="fas fa-check" style="color: #4CAF50; margin-right: 10px;"></i> Vero
                    </button>
                    <button class="option-button false-option" data-value="false" 
                            style="background: rgba(244, 67, 54, 0.2); border: 2px solid rgba(244, 67, 54, 0.5);
                                   padding: 20px; transition: all 0.3s ease; border-radius: 8px;">
                        <i class="fas fa-times" style="color: #f44336; margin-right: 10px;"></i> Falso
                    </button>
                </div>
            `;
        }
        
        // Costruisci HTML per domande di tipo testo o fallback
        let textInputHTML = '';
        if (question.type === 'text' || optionsHTML === '') {
            textInputHTML = `
                <div class="form-control" style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                    <input type="text" id="text-answer" class="quiz-input" 
                           style="display: block; width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); 
                                  border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: white; 
                                  font-size: 1.1rem;"
                           placeholder="Inserisci la tua risposta qui...">
                    <button class="option-button" id="submitAnswer" 
                            style="display: block; width: 100%; padding: 12px; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                                   color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; 
                                   transition: all 0.3s ease;">
                        Conferma Risposta
                    </button>
                </div>
            `;
        }
        
        // Prepara il timer
        const timerHTML = timerEnabled ? `
            <div class="timer-container" style="height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; margin: 20px 0;">
                <div class="timer-bar" id="timer-bar" style="height: 100%; width: 100%; background: linear-gradient(90deg, #8B5CF6, #FCD34D); transition: width 1s linear;"></div>
            </div>
        ` : '';
        
        // Contenuto della domanda
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = 'background: rgba(30, 41, 59, 0.95); color: white; padding: 30px; border-radius: 10px; max-width: 600px; width: 90%; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);';
        modalContent.innerHTML = `
            <div class="category-badge" style="display: inline-block; background: var(--primary); color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">${question.category}</div>
            <h2 class="question-text" style="color: #FFD700; margin-bottom: 20px; font-size: 1.4rem; line-height: 1.5;">${question.question}</h2>
            
            ${timerHTML}
            
            <div class="question-options" style="margin-top: 15px;">
                ${optionsHTML}
            </div>
            
            ${textInputHTML}
        `;
        
        // Aggiungi la modal content al modale
        modal.appendChild(modalContent);
        
        console.log('Modal domanda creato e aggiunto al DOM');
        
        // Avvia timer solo se abilitato
        if (timerEnabled) {
            startQuestionTimer(20, () => {
                try {
                    timeOver(question.answer);
                } catch (timerError) {
                    console.error('Errore nel timer:', timerError);
                    nextPlayer();
                }
            });
        }
        
        // Forza la visualizzazione con un doppio controllo
        setTimeout(() => {
            if (modal.style.display !== 'flex') {
                modal.style.display = 'flex';
                console.log('Forzata visualizzazione del modale dopo timeout');
            }
        }, 50);
        
        console.log('Configurazione degli event listeners per le risposte');
        
        // Aggiungi event listener per le risposte in base al tipo
        if (question.type === 'multiple' || question.type === 'boolean') {
            const optionButtons = modal.querySelectorAll('.option-button');
            optionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    try {
                        const selectedAnswer = this.getAttribute('data-value');
                        let isCorrect = false;
                        
                        // Converti la risposta corretta in stringa per il confronto (per boolean)
                        const correctAnswer = String(question.answer).toLowerCase();
                        isCorrect = selectedAnswer.toLowerCase() === correctAnswer;
                        
                        showQuestionResult(isCorrect, question.answer);
                    } catch (err) {
                        console.error('Errore nella gestione della risposta:', err);
                        showQuestionResult(false, question.answer);
                    }
                });
            });
        }
        
        // Gestione delle risposte di testo
        const submitButton = document.getElementById('submitAnswer');
        if (submitButton) {
            submitButton.addEventListener('click', function() {
                try {
                    const textInput = document.getElementById('text-answer');
                    const textAnswer = textInput ? textInput.value.trim() : '';
                    
                    // Usa la funzione di confronto delle risposte con tolleranza
                    const isCorrect = textAnswer && checkTextAnswer(textAnswer, question.answer);
                    showQuestionResult(isCorrect, question.answer);
                } catch (err) {
                    console.error('Errore nella gestione della risposta text:', err);
                    showQuestionResult(false, question.answer);
                }
            });
            
            // Aggiungi anche l'evento per premere Invio sull'input di testo
            const textInput = document.getElementById('text-answer');
            if (textInput) {
                textInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        try {
                            const textAnswer = this.value.trim();
                            const isCorrect = checkTextAnswer(textAnswer, question.answer);
                            showQuestionResult(isCorrect, question.answer);
                        } catch (err) {
                            console.error('Errore nella gestione della risposta text (keypress):', err);
                            showQuestionResult(false, question.answer);
                        }
                    }
                });
                
                // Focus sull'input di testo
                setTimeout(() => {
                    textInput.focus();
                }, 300);
            }
        }
        
        console.log('displayQuestion completata con successo');
    } catch (error) {
        console.error('Errore durante la visualizzazione della domanda:', error);
        showAnimatedNotification('Errore durante la visualizzazione della domanda', 'error');
        
        // Rimuovi il modale in caso di errore
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
        
        // Assicurati che il gioco continui
        setTimeout(nextPlayer, 2000);
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

// Variabile per il timer
let timerTimeout;

/**
 * Avvia il timer per la domanda
 * @param {number} seconds - Secondi disponibili per rispondere
 * @param {Function} callback - Funzione da chiamare quando il tempo scade
 */
function startQuestionTimer(seconds, callback) {
    // Cancella eventuali timer precedenti
    if (timerTimeout) {
        clearTimeout(timerTimeout);
    }
    
    const timerBar = document.getElementById('timer-bar');
    if (!timerBar) return;
    
    // Imposta la larghezza iniziale al 100%
    timerBar.style.width = '100%';
    timerBar.style.transition = `width ${seconds}s linear`;
    
    // Dopo un brevissimo ritardo, impostiamo la larghezza a 0
    setTimeout(() => {
        timerBar.style.width = '0%';
    }, 50);
    
    // Imposta il timeout per il tempo scaduto
    timerTimeout = setTimeout(callback, seconds * 1000);
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
 */
function showQuestionResult(isCorrect, correctAnswer) {
    // Cancella il timer
    if (timerTimeout) {
        clearTimeout(timerTimeout);
    }
    
    // Ottieni il giocatore corrente
    const player = players[currentPlayerIndex];
    
    // Flag per tracciare se il powerup di scelta categoria è stato usato per questa domanda
    const categoryChoiceWasUsed = player.usedCategoryChoice === true;
    
    // Resetta il flag dopo aver controllato
    player.usedCategoryChoice = false;
    
    // Aggiorna le statistiche del giocatore
    if (!player.stats) {
        player.stats = { correct: 0, incorrect: 0, moves: 0 };
    }
    
    // Controlla se il giocatore ha lo scudo attivo in caso di risposta sbagliata
    if (!isCorrect && player.powerups && player.powerups.shields && player.powerups.shields > 0) {
        if (confirm('Hai uno scudo disponibile. Vuoi usarlo per proteggere questa risposta sbagliata?')) {
            player.powerups.shields--;
            isCorrect = true; // Consideriamo la risposta come corretta
            showAnimatedNotification('Scudo attivato!', 'success');
            addToGameLog(`${player.name} ha usato uno scudo per proteggere una risposta sbagliata`);
            
            // Salva lo stato del gioco
            saveGameData();
        }
    }
    
    // Definisci il premio in crediti
    const creditReward = 10;
    
    // Aggiorna le statistiche e assegna crediti
    if (isCorrect) {
        player.stats.correct++;
        
        // Premia con crediti per risposta corretta
        player.credits += creditReward;
        
        // Aggiungi una stella solo se è stata usata l'abilità di scelta categoria
        let starReward = false;
        
        if (categoryChoiceWasUsed) {
            player.stars++;
            starReward = true;
            
            // Effetti visivi per la stella
            showStarCollectionEffect();
        }
        
        // Notifica
        if (starReward) {
            showAnimatedNotification('Risposta corretta! +' + creditReward + ' crediti e +1 stella', 'success');
            addToGameLog(`${player.name} ha risposto correttamente dopo aver scelto la categoria e guadagnato ${creditReward} crediti e una stella`);
        } else {
            showAnimatedNotification('Risposta corretta! +' + creditReward + ' crediti', 'success');
            addToGameLog(`${player.name} ha risposto correttamente e guadagnato ${creditReward} crediti`);
        }
        
        playSound('success');
        
        // Controlla se il giocatore ha vinto (solo se ha ottenuto una stella)
        if (starReward && checkWinCondition()) {
            return; // Esci se c'è un vincitore
        }
    } else {
        player.stats.incorrect++;
        showAnimatedNotification('Risposta sbagliata! La risposta corretta era: ' + correctAnswer, 'error');
        addToGameLog(`${player.name} ha risposto in modo errato. Risposta corretta: ${correctAnswer}`);
        playSound('error');
    }
    
    // Aggiorna l'UI
    renderPlayerInfo();
    
    // Crea un modal per mostrare il risultato
    const resultModal = document.createElement('div');
    resultModal.className = 'modal active';
    resultModal.id = 'resultModal';
    resultModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex !important; justify-content: center; align-items: center; z-index: 9999;';
    
    // Crea il contenuto del modale dei risultati
    const resultContent = document.createElement('div');
    resultContent.className = 'modal-content';
    resultContent.style.cssText = `background: rgba(30, 41, 59, 0.95); color: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); border: 2px solid ${isCorrect ? '#4CAF50' : '#f44336'};`;
    
    resultContent.innerHTML = `
        <div class="result-message" style="text-align: center;">
            <h2 style="color: ${isCorrect ? '#4CAF50' : '#f44336'}; margin-bottom: 20px;">
                ${isCorrect ? 'Risposta Corretta!' : 'Risposta Sbagliata!'}
            </h2>
            ${!isCorrect ? `<p style="margin-bottom: 15px;">La risposta corretta era: <strong>${correctAnswer}</strong></p>` : ''}
            ${isCorrect ? `
                <p style="margin-bottom: 15px; color: gold;">
                    Hai guadagnato ${creditReward} crediti
                    ${categoryChoiceWasUsed ? ` e una stella! <i class="fas fa-star" style="color: gold; margin-left: 5px;"></i>` : ''}
                </p>` : ''}
        </div>
    `;
    
    // Aggiungi il contenuto al modale
    resultModal.appendChild(resultContent);
    document.body.appendChild(resultModal);
    
    // Chiudi il modale della domanda se esiste
    const quizModal = document.getElementById('quizModal');
    if (quizModal && quizModal.parentNode) {
        quizModal.parentNode.removeChild(quizModal);
    }
    
    console.log('Modale risultato visualizzato');
    
    // Dopo 2 secondi, chiudi il modale e passa al prossimo giocatore
    setTimeout(() => {
        if (resultModal && resultModal.parentNode) {
            resultModal.parentNode.removeChild(resultModal);
        }
        
        // Resetta esplicitamente i passi rimanenti e passa al prossimo giocatore
        player.remainingSteps = 0; // Resetta i passi rimanenti per evitare blocchi
        console.log('Reset dei passi rimanenti e passaggio al prossimo giocatore');
        setTimeout(nextPlayer, 500);
    }, 2000);
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
            price: 40,
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
            name: 'Scudo',
            description: 'Protegge da una risposta sbagliata',
            price: 60,
            action: function() {
                const player = players[currentPlayerIndex];
                if (!player.powerups) player.powerups = {};
                if (!player.powerups.shields) player.powerups.shields = 0;
                
                player.powerups.shields++;
                addToGameLog(`${player.name} ha acquistato uno Scudo`);
                showAnimatedNotification('Scudo attivato! Ti proteggerà da una risposta sbagliata', 'success');
                
                // Salva lo stato del gioco
                saveGameData();
                
                // Aggiorna l'UI per mostrare lo scudo
                renderPlayerInfo();
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