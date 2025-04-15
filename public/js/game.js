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
let BOARD_SIZE = 7; // Dimensione della griglia predefinita 7x7 (sarà aggiornata in base alla selezione)
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
let mapType = 'standard'; // Tipo di mappa predefinito

// Posizioni speciali sulla board
let starPositions = [];
let specialPositions = [];
let bonusPenaltyPositions = []; // Nuove posizioni per le caselle di bonus/penalità crediti

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
            categories: ["Storia", "Geografia", "Scienza", "Sport", "Arte", "Musica", "Cinema", "Letteratura", "Cultura Generale"],
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
        
        // Assicurati che "Cultura Generale" sia inclusa nelle categorie
        if (availableCategories && Array.isArray(availableCategories) && !availableCategories.includes("Cultura Generale")) {
            availableCategories.push("Cultura Generale");
            gameData.categories = availableCategories;
            localStorage.setItem('quizPartyGameData', JSON.stringify(gameData));
            console.log('Aggiunta categoria "Cultura Generale"');
        }
        
        starGoal = gameData.starCount || 3;
        timerEnabled = gameData.timerEnabled !== undefined ? gameData.timerEnabled : true;
        
        // Carica la dimensione della mappa
        if (gameData.boardMap) {
            BOARD_SIZE = gameData.boardMap.size || 7;
            mapType = gameData.boardMap.type || 'standard';
            console.log(`Mappa caricata: ${mapType} (${BOARD_SIZE}x${BOARD_SIZE})`);
        }
        
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
 * Determinare il tipo di spazio in base al tipo di mappa
 * @param {Object} position - La posizione {row, col}
 * @returns {string} - Il tipo di spazio ('star', 'special', 'quiz', 'bonus', 'penalty', 'empty')
 */
function determineSpaceType(position) {
    const { row, col } = position;
    
    // Controlliamo prima le posizioni speciali (più veloci da verificare)
    if (isPositionInList(position, starPositions)) {
        return 'star';
    } 
    if (isPositionInList(position, specialPositions)) {
        return 'special';
    }
    if (isPositionInList(position, bonusPenaltyPositions)) {
        // Alterna bonus e penalità in base alla posizione
        return ((row + col) % 2 === 0) ? 'bonus' : 'penalty';
    }
    
    // Controlliamo i bordi e la croce centrale (comuni a tutte le mappe)
    if (isEdgePosition(row, col, BOARD_SIZE) || isMiddleCross(row, col, BOARD_SIZE)) {
        return 'quiz';
    }
    
    // Controlli specifici per tipo di mappa
    switch (mapType) {
        case 'special':
            if (isCrossPattern(row, col, BOARD_SIZE)) {
                return 'quiz';
            }
            break;
        case 'large':
            // Calcoli effettuati una sola volta
            const quarter = Math.floor(BOARD_SIZE/4);
            const threeQuarters = Math.floor(3*BOARD_SIZE/4);
            const middle = Math.floor(BOARD_SIZE/2);
            
            // Posizioni diagonali e intermedie
            if ((row === quarter && col === quarter) || 
                (row === quarter && col === threeQuarters) ||
                (row === threeQuarters && col === quarter) ||
                (row === threeQuarters && col === threeQuarters) ||
                (row === 2 && col === 2) ||
                (row === 2 && col === BOARD_SIZE-3) ||
                (row === BOARD_SIZE-3 && col === 2) ||
                (row === BOARD_SIZE-3 && col === BOARD_SIZE-3) ||
                (row === 2 && col === middle) ||
                (row === BOARD_SIZE-3 && col === middle) ||
                (row === middle && col === 2) ||
                (row === middle && col === BOARD_SIZE-3)) {
                return 'quiz';
            }
            break;
    }
    
    // Default: casella vuota
    return 'empty';
}

/**
 * Inizializza la board di gioco
 */
function initGameBoard() {
    if (!gameBoardElement) return;
    
    gameBoardElement.innerHTML = '';
    gameBoard = [];
    
    // Imposta lo stile CSS della scacchiera in base alle dimensioni
    gameBoardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    gameBoardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
    
    // Aggiungi classe CSS per il tipo di mappa
    gameBoardElement.className = 'game-board';
    if (mapType === 'small') {
        gameBoardElement.classList.add('small-map');
    } else if (mapType === 'large') {
        gameBoardElement.classList.add('large-map');
    } else if (mapType === 'special') {
        gameBoardElement.classList.add('special-map');
    } else {
        gameBoardElement.classList.add('standard-map');
    }
    
    // Genera le caratteristiche casuali della board in base al tipo di mappa
    generateBoardFeatures();
    
    // Crea la scacchiera in base alla dimensione
    for (let row = 0; row < BOARD_SIZE; row++) {
        gameBoard[row] = [];
        
        for (let col = 0; col < BOARD_SIZE; col++) {
            const space = document.createElement('div');
            const position = { row, col };
            
            // Usa la nuova funzione per determinare il tipo di spazio
            const spaceType = determineSpaceType(position);
            
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
            } else if (spaceType === 'bonus') {
                space.innerHTML = '<i class="fas fa-plus"></i>';
            } else if (spaceType === 'penalty') {
                space.innerHTML = '<i class="fas fa-minus"></i>';
            }
            
            // Salva riferimento nella matrice
            gameBoard[row][col] = {
                element: space,
                type: spaceType,
                position: { row, col }
            };
            
            // Aggiungi alla scacchiera
            gameBoardElement.appendChild(space);
            
            // Aggiungi event listener per il click
            space.addEventListener('click', () => {
                activateSpaceOnClick(position);
            });
        }
    }
    
    console.log('Game board initialized with size', BOARD_SIZE);
    addToGameLog(`Tabellone di gioco ${BOARD_SIZE}x${BOARD_SIZE} inizializzato`);
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
 * Salva i dati di gioco nel localStorage
 */
function saveGameData() {
    try {
        // Prepara l'oggetto dati da salvare
        const gameState = {
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
        localStorage.setItem('quizPartyGameState', JSON.stringify(gameState));
        console.log('Stato del gioco salvato nel localStorage');
    } catch (error) {
        console.error('Errore durante il salvataggio del gioco:', error);
    }
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
            if (player.credits >= 70) {
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
        case 'bonus':
            player.credits += 25;
            showAnimatedNotification(`Hai guadagnato 25 crediti!`, 'success');
            addToGameLog(`${player.name} ha guadagnato 25 crediti`);
            nextPlayer();
            break;
        case 'penalty':
            player.credits -= 10;
            showAnimatedNotification(`Hai perso 10 crediti!`, 'error');
            addToGameLog(`${player.name} ha perso 10 crediti`);
            nextPlayer();
            break;
        default:
            // Passa al prossimo giocatore
            addToGameLog(`${player.name} è atterrato su una casella vuota`);
            nextPlayer();
    }
}

/**
 * Genera caratteristiche della mappa come stelle e spazi speciali
 */
function generateBoardFeatures() {
    // Reset e inizializzazione sicura delle posizioni
    starPositions = Array.isArray(starPositions) ? [] : [];
    specialPositions = Array.isArray(specialPositions) ? [] : [];
    bonusPenaltyPositions = Array.isArray(bonusPenaltyPositions) ? [] : [];
    
    // Coordinate utilizzate di frequente
    const centerRow = Math.floor(BOARD_SIZE/2);
    const centerCol = Math.floor(BOARD_SIZE/2);
    const centerPosition = { row: centerRow, col: centerCol };
    
    // Configurazione in base al tipo di mappa
    switch (mapType) {
        case 'small': // Mappa piccola (5x5)
            starPositions.push(centerPosition);
            addRandomPositions(specialPositions, 2, [centerPosition]);
            break;
            
        case 'large': // Mappa grande (9x9) - più stelle e più posizioni speciali
            const offset = Math.floor(BOARD_SIZE/4);
            // Posiziona 4 stelle in modo simmetrico
            [
                { row: centerRow - offset, col: centerCol - offset },
                { row: centerRow - offset, col: centerCol + offset },
                { row: centerRow + offset, col: centerCol - offset },
                { row: centerRow + offset, col: centerCol + offset }
            ].forEach(pos => starPositions.push(pos));
            
            // Posizioni speciali
            addRandomPositions(specialPositions, 5, starPositions);
            break;
            
        case 'special': // Mappa speciale (7x7) con pattern unico
            const thirdPoint = Math.floor(BOARD_SIZE/3);
            const twoThirdsPoint = Math.floor(2*BOARD_SIZE/3);
            
            // Stelle in pattern triangolare
            [
                { row: thirdPoint, col: twoThirdsPoint },
                { row: twoThirdsPoint, col: thirdPoint },
                { row: twoThirdsPoint, col: twoThirdsPoint }
            ].forEach(pos => starPositions.push(pos));
            
            // Posizioni speciali in pattern alternato
            [
                { row: 1, col: 1 },
                { row: 1, col: BOARD_SIZE-2 },
                { row: BOARD_SIZE-2, col: 1 },
                { row: BOARD_SIZE-2, col: BOARD_SIZE-2 }
            ].forEach(pos => specialPositions.push(pos));
            break;
            
        default: // Mappa standard (7x7)
            starPositions.push(centerPosition);
            addRandomPositions(specialPositions, 4, [centerPosition]);
    }
    
    // Aggiungi posizioni bonus/penalità negli angoli
    [
        { row: 0, col: 0 },
        { row: 0, col: BOARD_SIZE - 1 },
        { row: BOARD_SIZE - 1, col: 0 },
        { row: BOARD_SIZE - 1, col: BOARD_SIZE - 1 }
    ].forEach(pos => bonusPenaltyPositions.push(pos));
    
    console.log(`Board features generated for map type: ${mapType}`);
    console.log(`Created ${starPositions.length} star positions and ${specialPositions.length} special positions`);
}

/**
 * Aggiunge un numero specificato di posizioni casuali a una lista, evitando le posizioni in excludeList
 * @param {Array} targetList - La lista a cui aggiungere le posizioni
 * @param {number} count - Il numero di posizioni da aggiungere
 * @param {Array} excludeList - Le posizioni da escludere
 */
function addRandomPositions(targetList, count, excludeList) {
    let attempts = 0;
    const maxAttempts = count * 10; // Limite di sicurezza per evitare cicli infiniti
    
    for (let i = 0; i < count; i++) {
        let position = generateRandomBoardPosition([...excludeList, ...targetList]);
        
        // Se non troviamo una posizione valida dopo molti tentativi, interrompiamo
        if (!position) {
            attempts++;
            if (attempts > maxAttempts) {
                console.warn(`Non è stato possibile generare tutte le ${count} posizioni richieste`);
                break;
            }
            i--; // Riprova per questa posizione
            continue;
        }
        
        targetList.push(position);
    }
}

/**
 * Verifica se una posizione è sul bordo della scacchiera
 * @param {number} row - La riga
 * @param {number} col - La colonna
 * @param {number} size - La dimensione della scacchiera
 * @returns {boolean} - True se la posizione è sul bordo
 */
function isEdgePosition(row, col, size = BOARD_SIZE) {
    return row === 0 || col === 0 || row === size - 1 || col === size - 1;
}

/**
 * Verifica se una posizione fa parte della croce centrale
 * @param {number} row - La riga
 * @param {number} col - La colonna
 * @param {number} size - La dimensione della scacchiera
 * @returns {boolean} - True se la posizione è nella croce centrale
 */
function isMiddleCross(row, col, size = BOARD_SIZE) {
    const middle = Math.floor(size / 2);
    return row === middle || col === middle;
}

/**
 * Verifica se una posizione fa parte di un pattern a croce (per la mappa speciale)
 * @param {number} row - La riga
 * @param {number} col - La colonna
 * @param {number} size - La dimensione della scacchiera
 * @returns {boolean} - True se la posizione è nel pattern
 */
function isCrossPattern(row, col, size = BOARD_SIZE) {
    // Punti per dividere la griglia in terzi
    const thirdPoint = Math.floor(size/3);
    const twoThirdsPoint = Math.floor(2*size/3);
    
    // Crea un pattern a croce modificato
    return row === thirdPoint || row === twoThirdsPoint || col === thirdPoint || col === twoThirdsPoint;
}

/**
 * Genera una posizione casuale sulla scacchiera
 * @param {Array} excludeList - Lista di posizioni da escludere
 * @returns {Object|null} - Un oggetto posizione {row, col} o null se non è stato possibile trovare una posizione
 */
function generateRandomBoardPosition(excludeList = []) {
    // Limita i tentativi per evitare loop infiniti
    const maxAttempts = BOARD_SIZE * BOARD_SIZE;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        attempts++;
        
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        const position = { row, col };
        
        // Controlla se la posizione è già in uso
        if (isPositionInList(position, excludeList)) {
            continue;
        }
        
        // Controlla se la posizione può contenere un elemento speciale
        // Vogliamo che stelle e elementi speciali siano solo su caselle quiz o vuote
        if (isEdgePosition(row, col, BOARD_SIZE) || 
            isMiddleCross(row, col, BOARD_SIZE) || 
            (mapType === 'special' && isCrossPattern(row, col, BOARD_SIZE))) {
            return position;
        }
    }
    
    console.warn('Non è stato possibile trovare una posizione valida sulla scacchiera');
    return null;
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
            
            if (player.powerups.extraTime) {
                powerupsHTML += `
                <p class="player-powerup">
                    <span><i class="fas fa-hourglass-half" style="color: #4CAF50;"></i> Tempo Extra:</span>
                    <span>Attivo</span>
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
    let centerRow = Math.floor(BOARD_SIZE / 2);
    let centerCol = Math.floor(BOARD_SIZE / 2);
    
    // Controlla se la posizione di centro è valida
    if (centerRow < 0 || centerRow >= BOARD_SIZE || centerCol < 0 || centerCol >= BOARD_SIZE) {
        console.error(`Posizione centrale non valida: ${centerRow}, ${centerCol}`);
        // Usa una posizione sicura
        centerRow = 0;
        centerCol = 0;
    }
    
    // Crea e posiziona i giocatori
    players.forEach((player, index) => {
        // Salva la posizione iniziale nel giocatore se non esiste
        if (!player.position) {
            player.position = { row: centerRow, col: centerCol };
        }
        
        // Verifica che la posizione del giocatore sia valida
        if (player.position.row < 0 || player.position.row >= BOARD_SIZE ||
            player.position.col < 0 || player.position.col >= BOARD_SIZE) {
            console.warn(`Posizione non valida per il giocatore ${player.name}. Reimpostazione al centro.`);
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
        
        try {
            // Posiziona il giocatore sulla scacchiera
            const space = gameBoard[player.position.row][player.position.col].element;
            if (!space) {
                throw new Error(`Spazio non trovato per la posizione: ${player.position.row}, ${player.position.col}`);
            }
            
            const spaceRect = space.getBoundingClientRect();
            const boardRect = gameBoardElement.getBoundingClientRect();
            
            playerElement.style.left = `${(spaceRect.left - boardRect.left) + (spaceRect.width / 2) - 17.5 + offsetX}px`;
            playerElement.style.top = `${(spaceRect.top - boardRect.top) + (spaceRect.height / 2) - 17.5 + offsetY}px`;
            
            gameBoardElement.appendChild(playerElement);
        } catch (error) {
            console.error(`Errore nel posizionamento del giocatore ${player.name}:`, error);
        }
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
 * Aggiorna la posizione visuale del giocatore sulla board
 * @param {number} playerIndex - L'indice del giocatore da aggiornare
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
 * @param {Object} position - La posizione {row, col} da controllare
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
            if (player.credits >= 70) {
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
        case 'bonus':
            player.credits += 25;
            showAnimatedNotification(`Hai guadagnato 25 crediti!`, 'success');
            addToGameLog(`${player.name} ha guadagnato 25 crediti`);
            nextPlayer();
            break;
        case 'penalty':
            player.credits -= 10;
            showAnimatedNotification(`Hai perso 10 crediti!`, 'error');
            addToGameLog(`${player.name} ha perso 10 crediti`);
            nextPlayer();
            break;
        default:
            // Passa al prossimo giocatore
            addToGameLog(`${player.name} è atterrato su una casella vuota`);
            nextPlayer();
    }
}

/**
 * Passa al prossimo giocatore
 */
function nextPlayer() {
    if (!gameStarted) return;
    
    // Pulisci eventuali timer precedenti
    clearQuestionTimer();
    
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
        showAnimatedNotification(`${players[currentPlayerIndex].name} salta il turno!`, 'warning');
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
            if (isEdgePosition(newRow, newCol) || isMiddleCross(newRow, newCol) || 
                (mapType === 'special' && isCrossPattern(newRow, newCol, BOARD_SIZE))) {
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
        
        // Filter valid directions
        const validDirections = possibleDirections.filter(dir => {
            const newRow = row + dir.dr;
            const newCol = col + dir.dc;
            
            // Ensure the new position is within board boundaries
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                return false;
            }
            
            // Check if the new position is on a valid space (edge or cross)
            return isEdgePosition(newRow, newCol) || isMiddleCross(newRow, newCol) || 
                   (mapType === 'special' && isCrossPattern(newRow, newCol, BOARD_SIZE));
        });
        
        // Only show direction selector if there are valid directions
        if (validDirections.length > 0) {
            showDirectionSelector(validDirections, remainingSteps);
        } else {
            // No valid moves left, end movement
            player.remainingSteps = 0;
            checkSpace(player.position);
            
            // Riabilita il pulsante shop
            if (shopButton) {
                shopButton.disabled = false;
            }
        }
    }
    
    return { row, col };
}

