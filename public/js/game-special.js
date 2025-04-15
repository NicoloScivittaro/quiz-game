/**
 * Quiz Party - Funzioni Speciali 
 * Gestisce funzionalità come stelline, modalità di gioco speciali e negozio
 */

/**
 * Mostra un effetto visivo quando un giocatore raccoglie una stella
 */
function showStarCollectionEffect() {
    // Crea il contenitore per l'animazione
    const effectContainer = document.createElement('div');
    effectContainer.className = 'star-collection-effect';
    
    // Aggiungi elementi stella animati
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'animated-star';
        star.innerHTML = '<i class="fas fa-star"></i>';
        star.style.left = `${Math.random() * 80 + 10}%`;
        star.style.animationDelay = `${Math.random() * 0.5}s`;
        effectContainer.appendChild(star);
    }
    
    // Aggiungi al DOM
    document.body.appendChild(effectContainer);
    
    // Riproduci suono stella se disponibile
    if (typeof playSound === 'function') {
        playSound('star');
    }
    
    // Rimuovi dopo l'animazione
    setTimeout(() => {
        if (effectContainer.parentNode) {
            document.body.removeChild(effectContainer);
        }
    }, 2000);
}

/**
 * Mostra un modale di conferma per l'acquisto della stella
 * @param {Object} player - Il giocatore corrente
 */
function showStarPurchaseModal(player) {
    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'starPurchaseModal';
    
    // Crea il contenuto
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content star-purchase-content';
    
    // Titolo e messaggio
    const title = document.createElement('h2');
    title.textContent = 'Acquista una Stella';
    modalContent.appendChild(title);
    
    const message = document.createElement('p');
    message.textContent = `Vuoi acquistare una stella per 70 crediti? (Attualmente hai ${player.credits} crediti)`;
    modalContent.appendChild(message);
    
    // Animazione stellina
    const starAnimation = document.createElement('div');
    starAnimation.className = 'star-animation';
    starAnimation.innerHTML = '<i class="fas fa-star"></i>';
    modalContent.appendChild(starAnimation);
    
    // Pulsanti
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const confirmButton = document.createElement('button');
    confirmButton.className = 'confirm-button';
    confirmButton.textContent = 'Acquista';
    confirmButton.addEventListener('click', () => {
        modal.remove();
        collectStar();
    });
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Annulla';
    cancelButton.addEventListener('click', () => {
        modal.remove();
        nextPlayer();
    });
    
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Raccoglie una stella quando un giocatore decide di acquistarla
 */
function collectStar() {
    const player = players[currentPlayerIndex];
    
    // Verifica che il giocatore abbia crediti sufficienti
    if (player.credits < 70) {
        showAnimatedNotification('Non hai abbastanza crediti!', 'error');
        addToGameLog(`${player.name} non ha abbastanza crediti per acquistare una stella`);
        nextPlayer();
        return;
    }
    
    // Sottrai i crediti
    player.credits -= 70;
    
    // Aggiungi la stella
    player.stars++;
    
    // Aggiungi al log
    addToGameLog(`${player.name} ha acquistato una stella per 70 crediti`);
    
    // Mostra animazione
    showStarCollectionEffect();
    
    // Aggiorna l'interfaccia
    renderPlayerInfo();
    
    // Controlla se il giocatore ha vinto
    if (player.stars >= starGoal) {
        showVictoryEffects(player);
    } else {
        // Passa al prossimo giocatore
        setTimeout(() => {
            nextPlayer();
        }, 2000); // Delay per mostrare l'animazione
    }
}

/**
 * Attiva un effetto speciale quando un giocatore atterra su una casella speciale
 */
function activateSpecialEffect() {
    // Lista degli effetti possibili
    const effects = [
        {
            name: 'Crediti Bonus',
            action: () => {
                const bonus = Math.floor(Math.random() * 30) + 20; // 20-50 crediti
                const player = players[currentPlayerIndex];
                player.credits += bonus;
                addToGameLog(`${player.name} ha ottenuto ${bonus} crediti bonus`);
                showAnimatedNotification(`Hai ottenuto ${bonus} crediti bonus!`, 'success');
                renderPlayerInfo();
            }
        },
        {
            name: 'Scambia Posizione',
            action: () => {
                // Verifica se ci sono altri giocatori
                if (players.length < 2) {
                    activateSpecialEffect(); // Riprova con un altro effetto
                    return;
                }
                
                // Seleziona un giocatore casuale diverso dal corrente
                let otherPlayerIndex;
                do {
                    otherPlayerIndex = Math.floor(Math.random() * players.length);
                } while (otherPlayerIndex === currentPlayerIndex);
                
                // Scambia le posizioni
                const currentPlayer = players[currentPlayerIndex];
                const otherPlayer = players[otherPlayerIndex];
                
                const tempPosition = { ...currentPlayer.position };
                currentPlayer.position = { ...otherPlayer.position };
                otherPlayer.position = tempPosition;
                
                // Aggiorna le posizioni visuali
                updatePlayerPosition(currentPlayerIndex);
                updatePlayerPosition(otherPlayerIndex);
                
                // Log
                addToGameLog(`${currentPlayer.name} ha scambiato posizione con ${otherPlayer.name}`);
                showAnimatedNotification(`Hai scambiato posizione con ${otherPlayer.name}!`, 'info');
            }
        },
        {
            name: 'Tiro Extra',
            action: () => {
                const player = players[currentPlayerIndex];
                addToGameLog(`${player.name} ha ottenuto un tiro extra`);
                showAnimatedNotification('Hai ottenuto un tiro extra!', 'success');
                
                // Non passare al prossimo giocatore
                diceRolling = false;
                if (diceButton) {
                    diceButton.disabled = false;
                }
                
                return true; // Indica di non passare al prossimo giocatore
            }
        },
        {
            name: 'Powerup',
            action: () => {
                const player = players[currentPlayerIndex];
                
                // Possibili powerup
                const powerups = [
                    {
                        name: 'Scelta Categoria',
                        apply: () => {
                            if (!player.powerups) player.powerups = {};
                            player.powerups.categoryChoice = (player.powerups.categoryChoice || 0) + 1;
                            addToGameLog(`${player.name} ha ottenuto il powerup Scelta Categoria`);
                            showAnimatedNotification('Hai ottenuto il powerup Scelta Categoria!', 'success');
                        }
                    },
                    {
                        name: 'Tempo Extra',
                        apply: () => {
                            if (!player.powerups) player.powerups = {};
                            player.powerups.extraTime = true;
                            addToGameLog(`${player.name} ha ottenuto il powerup Tempo Extra`);
                            showAnimatedNotification('Hai ottenuto il powerup Tempo Extra!', 'success');
                        }
                    }
                ];
                
                // Scegli un powerup casuale
                const randomPowerup = powerups[Math.floor(Math.random() * powerups.length)];
                randomPowerup.apply();
                
                // Aggiorna l'interfaccia
                renderPlayerInfo();
            }
        }
    ];
    
    // Scegli un effetto casuale
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    console.log(`Attivazione effetto speciale: ${randomEffect.name}`);
    
    // Esegui l'effetto
    const skipNextPlayer = randomEffect.action();
    
    // Se l'effetto non richiede di saltare il passaggio al prossimo giocatore
    if (!skipNextPlayer) {
        setTimeout(() => {
            nextPlayer();
        }, 1500);
    }
}

/**
 * Mostra lo shop del gioco
 */
function showShop() {
    const player = players[currentPlayerIndex];
    
    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'shopModal';
    
    // Contenuto del modale
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content shop-content';
    
    // Intestazione
    const header = document.createElement('div');
    header.className = 'shop-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Negozio';
    header.appendChild(title);
    
    const playerInfo = document.createElement('div');
    playerInfo.className = 'shop-player-info';
    playerInfo.innerHTML = `<span class="player-name">${player.name}</span> <span class="player-credits">${player.credits} crediti</span>`;
    header.appendChild(playerInfo);
    
    modalContent.appendChild(header);
    
    // Contenitore oggetti
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'shop-items';
    
    // Lista degli oggetti acquistabili
    const shopItems = [
        {
            id: 'categoryChoice',
            name: 'Scelta Categoria',
            description: 'Permette di scegliere la categoria della prossima domanda',
            price: 10,
            action: function() {
                if (!player.powerups) player.powerups = {};
                player.powerups.categoryChoice = (player.powerups.categoryChoice || 0) + 1;
                player.credits -= this.price;
                addToGameLog(`${player.name} ha acquistato il powerup Scelta Categoria`);
                showAnimatedNotification('Powerup Scelta Categoria acquistato!', 'success');
                renderPlayerInfo();
            }
        },
        {
            id: 'extraTime',
            name: 'Tempo Extra',
            description: 'Aumenta il tempo disponibile per rispondere alla prossima domanda',
            price: 25,
            action: function() {
                if (!player.powerups) player.powerups = {};
                player.powerups.extraTime = true;
                player.credits -= this.price;
                addToGameLog(`${player.name} ha acquistato il powerup Tempo Extra`);
                showAnimatedNotification('Powerup Tempo Extra acquistato!', 'success');
                renderPlayerInfo();
            }
        },
        {
            id: 'moveAgain',
            name: 'Movimento Extra',
            description: 'Ottieni un tiro di dado extra dopo il tuo turno',
            price: 40,
            action: function() {
                player.credits -= this.price;
                addToGameLog(`${player.name} ha acquistato un tiro extra`);
                showAnimatedNotification('Tiro Extra acquistato! Potrai tirare di nuovo dopo il tuo turno.', 'success');
                
                // Flag per il tiro extra
                player.extraTurn = true;
                
                renderPlayerInfo();
            }
        },
        {
            id: 'star',
            name: 'Stella',
            description: 'Acquista una stella direttamente (più costosa del normale)',
            price: 120,
            action: function() {
                player.credits -= this.price;
                player.stars++;
                addToGameLog(`${player.name} ha acquistato una stella dal negozio`);
                showAnimatedNotification('Hai acquistato una stella!', 'success');
                
                // Mostra effetto visivo
                showStarCollectionEffect();
                
                // Aggiorna UI
                renderPlayerInfo();
                
                // Controlla vittoria
                if (player.stars >= starGoal) {
                    modal.remove();
                    showVictoryEffects(player);
                    return;
                }
            }
        },
        {
            id: 'starQuestion',
            name: 'Stella con Domanda',
            description: 'Ricevi una stella se rispondi correttamente a una domanda (puoi scegliere la categoria)',
            price: 100,
            action: function() {
                // Sottrai i crediti immediatamente
                player.credits -= this.price;
                addToGameLog(`${player.name} ha acquistato una Stella con Domanda`);
                
                // Chiudi il modale dello shop
                modal.remove();
                
                // Imposta il flag per il bonus stella
                if (!player.powerups) player.powerups = {};
                player.powerups.starOnCorrect = true;
                
                // Mostra una notifica
                showAnimatedNotification('Scegli una categoria e rispondi correttamente per ottenere una stella!', 'info', 3000);
                
                // Aggiorna UI
                renderPlayerInfo();
                
                // Mostra il selettore di categoria seguito dalla domanda
                showStarCategorySelector();
            }
        },
        {
            id: 'tripleStarQuestion',
            name: 'Tripla Stella con Domanda',
            description: 'Ricevi 3 stelle se rispondi correttamente a una domanda (puoi scegliere la categoria)',
            price: 200,
            action: function() {
                // Sottrai i crediti immediatamente
                player.credits -= this.price;
                addToGameLog(`${player.name} ha acquistato una Tripla Stella con Domanda`);
                
                // Chiudi il modale dello shop
                modal.remove();
                
                // Imposta il flag per il bonus tripla stella
                if (!player.powerups) player.powerups = {};
                player.powerups.tripleStarOnCorrect = true;
                
                // Mostra una notifica
                showAnimatedNotification('Scegli una categoria e rispondi correttamente per ottenere TRE stelle!', 'info', 3000);
                
                // Aggiorna UI
                renderPlayerInfo();
                
                // Mostra il selettore di categoria seguito dalla domanda
                showTripleStarCategorySelector();
            }
        }
    ];
    
    // Aggiungi ogni oggetto al contenitore
    shopItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'shop-item';
        if (player.credits < item.price) {
            itemCard.classList.add('unavailable');
        }
        
        itemCard.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="item-price">${item.price} crediti</div>
        `;
        
        const buyButton = document.createElement('button');
        buyButton.className = 'buy-button';
        buyButton.textContent = 'Acquista';
        buyButton.disabled = player.credits < item.price;
        
        buyButton.addEventListener('click', () => {
            // Verifica crediti sufficienti
            if (player.credits < item.price) {
                showAnimatedNotification('Crediti insufficienti!', 'error');
                return;
            }
            
            // Esegui l'azione dell'oggetto
            item.action();
            
            // Aggiorna il display dei crediti
            playerInfo.innerHTML = `<span class="player-name">${player.name}</span> <span class="player-credits">${player.credits} crediti</span>`;
            
            // Aggiorna stato pulsanti
            document.querySelectorAll('.shop-item').forEach((card, idx) => {
                const button = card.querySelector('.buy-button');
                if (player.credits < shopItems[idx].price) {
                    card.classList.add('unavailable');
                    button.disabled = true;
                }
            });
        });
        
        itemCard.appendChild(buyButton);
        itemsContainer.appendChild(itemCard);
    });
    
    modalContent.appendChild(itemsContainer);
    
    // Pulsante chiudi
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = 'Chiudi';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });
    
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Controlla se c'è un vincitore
 * @returns {boolean} true se c'è un vincitore, false altrimenti
 */
function checkWinCondition() {
    // Controlla se qualche giocatore ha raggiunto il numero di stelle obiettivo
    for (let i = 0; i < players.length; i++) {
        if (players[i].stars >= starGoal) {
            // Mostra effetti vittoria
            showVictoryEffects(players[i]);
            return true;
        }
    }
    
    return false;
}

/**
 * Mostra effetti visivi per la vittoria
 * @param {Object} winner - Il giocatore vincitore
 */
function showVictoryEffects(winner) {
    // Crea il modale di vittoria
    const modal = document.createElement('div');
    modal.className = 'modal active victory-modal';
    modal.id = 'victoryModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content victory-content';
    
    // Titolo
    const title = document.createElement('h1');
    title.className = 'victory-title';
    title.textContent = 'Vittoria!';
    modalContent.appendChild(title);
    
    // Messaggio
    const message = document.createElement('p');
    message.className = 'victory-message';
    message.innerHTML = `<span style="color: ${winner.color}">${winner.name}</span> ha vinto la partita raccogliendo ${winner.stars} stelle!`;
    modalContent.appendChild(message);
    
    // Statistiche
    const stats = document.createElement('div');
    stats.className = 'victory-stats';
    stats.innerHTML = `
        <p>Risposte corrette: ${winner.stats.correct}</p>
        <p>Risposte errate: ${winner.stats.incorrect}</p>
        <p>Mosse totali: ${winner.stats.moves}</p>
        <p>Crediti rimanenti: ${winner.credits}</p>
    `;
    modalContent.appendChild(stats);
    
    // Effetti di coriandoli
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    
    // Crea i coriandoli
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        confetti.style.backgroundColor = getRandomColor();
        confettiContainer.appendChild(confetti);
    }
    
    modalContent.appendChild(confettiContainer);
    
    // Pulsante nuova partita
    const newGameButton = document.createElement('button');
    newGameButton.className = 'new-game-button';
    newGameButton.textContent = 'Nuova Partita';
    
    newGameButton.addEventListener('click', () => {
        // Reindirizza alla pagina iniziale
        window.location.href = 'index.html';
    });
    
    modalContent.appendChild(newGameButton);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Aggiungi al log
    addToGameLog(`${winner.name} ha vinto la partita raccogliendo ${winner.stars} stelle!`);
    
    // Disabilita tutti i controlli di gioco
    if (diceButton) {
        diceButton.disabled = true;
    }
    
    // Animazione di stelle che volano
    showStarCollectionEffect();
    
    // Riproduci suono vittoria
    playSound('victory');
}

/**
 * Ottiene un colore casuale
 * @returns {string} Un colore in formato CSS
 */
function getRandomColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', 
        '#33FFF5', '#FFD733', '#FF3333', '#8C33FF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Riproduce un suono
 * @param {string} soundType - Il tipo di suono da riprodurre
 */
function playSound(soundType) {
    // Mappa dei suoni
    const sounds = {
        'dice': 'sounds/dice.mp3',
        'correct': 'sounds/correct.mp3',
        'wrong': 'sounds/wrong.mp3',
        'star': 'sounds/star.mp3',
        'victory': 'sounds/victory.mp3'
    };
    
    // Verifica se il suono esiste
    if (!sounds[soundType]) return;
    
    // Crea elemento audio
    const audio = new Audio(sounds[soundType]);
    audio.volume = 0.5;
    
    // Riproduci
    audio.play().catch(error => {
        console.warn('Error playing sound:', error);
    });
}

/**
 * Mostra il selettore di categoria per la funzionalità "Stella con Domanda"
 */
function showStarCategorySelector() {
    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'starCategorySelector';
    
    // Crea il contenuto
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const title = document.createElement('h2');
    title.textContent = 'Scegli una categoria per la tua domanda';
    title.style.marginBottom = '20px';
    modalContent.appendChild(title);
    
    // Icona stella
    const starIcon = document.createElement('div');
    starIcon.innerHTML = '<i class="fas fa-star" style="color: gold; font-size: 2rem; margin-bottom: 20px;"></i>';
    starIcon.style.textAlign = 'center';
    modalContent.appendChild(starIcon);
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-grid';
    categoriesContainer.style.display = 'grid';
    categoriesContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    categoriesContainer.style.gap = '10px';
    
    // Aggiungi ogni categoria
    availableCategories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-button';
        categoryBtn.style.padding = '10px';
        categoryBtn.style.borderRadius = '5px';
        categoryBtn.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        categoryBtn.style.color = 'white';
        categoryBtn.style.border = 'none';
        categoryBtn.style.cursor = 'pointer';
        categoryBtn.style.display = 'flex';
        categoryBtn.style.flexDirection = 'column';
        categoryBtn.style.alignItems = 'center';
        categoryBtn.style.justifyContent = 'center';
        categoryBtn.style.transition = 'transform 0.2s';
        
        // Icon based on category
        let iconClass = 'fa-question';
        if (category === 'Storia') iconClass = 'fa-monument';
        else if (category === 'Geografia') iconClass = 'fa-globe-americas';
        else if (category === 'Scienza') iconClass = 'fa-flask';
        else if (category === 'Sport') iconClass = 'fa-futbol';
        else if (category === 'Arte') iconClass = 'fa-palette';
        else if (category === 'Musica') iconClass = 'fa-music';
        else if (category === 'Cinema') iconClass = 'fa-film';
        else if (category === 'Letteratura') iconClass = 'fa-book';
        else if (category === 'Cultura Generale') iconClass = 'fa-graduation-cap';
        
        categoryBtn.innerHTML = `<i class="fas ${iconClass}" style="font-size: 1.5rem; margin-bottom: 8px;"></i><span>${category}</span>`;
        
        // Hover effect
        categoryBtn.onmouseover = () => { categoryBtn.style.transform = 'scale(1.05)'; };
        categoryBtn.onmouseout = () => { categoryBtn.style.transform = 'scale(1)'; };
        
        // Al click, seleziona la categoria
        categoryBtn.addEventListener('click', () => {
            console.log('Categoria selezionata per Stella con Domanda:', category);
            modal.remove();
            
            // Carica una domanda dalla categoria scelta
            // Passiamo il flag isChosenCategory=true poiché l'utente ha scelto la categoria
            loadRandomQuestion(category, true);
        });
        
        categoriesContainer.appendChild(categoryBtn);
    });
    
    modalContent.appendChild(categoriesContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Mostra il selettore di categoria per la funzionalità "Tripla Stella con Domanda"
 */
function showTripleStarCategorySelector() {
    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'tripleStarCategorySelector';
    
    // Crea il contenuto
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const title = document.createElement('h2');
    title.textContent = 'Scegli una categoria per la tua domanda';
    title.style.marginBottom = '20px';
    modalContent.appendChild(title);
    
    // Icona stella
    const starIcon = document.createElement('div');
    starIcon.innerHTML = '<i class="fas fa-star" style="color: gold; font-size: 2rem; margin-bottom: 20px;"></i>';
    starIcon.style.textAlign = 'center';
    modalContent.appendChild(starIcon);
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-grid';
    categoriesContainer.style.display = 'grid';
    categoriesContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    categoriesContainer.style.gap = '10px';
    
    // Aggiungi ogni categoria
    availableCategories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-button';
        categoryBtn.style.padding = '10px';
        categoryBtn.style.borderRadius = '5px';
        categoryBtn.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        categoryBtn.style.color = 'white';
        categoryBtn.style.border = 'none';
        categoryBtn.style.cursor = 'pointer';
        categoryBtn.style.display = 'flex';
        categoryBtn.style.flexDirection = 'column';
        categoryBtn.style.alignItems = 'center';
        categoryBtn.style.justifyContent = 'center';
        categoryBtn.style.transition = 'transform 0.2s';
        
        // Icon based on category
        let iconClass = 'fa-question';
        if (category === 'Storia') iconClass = 'fa-monument';
        else if (category === 'Geografia') iconClass = 'fa-globe-americas';
        else if (category === 'Scienza') iconClass = 'fa-flask';
        else if (category === 'Sport') iconClass = 'fa-futbol';
        else if (category === 'Arte') iconClass = 'fa-palette';
        else if (category === 'Musica') iconClass = 'fa-music';
        else if (category === 'Cinema') iconClass = 'fa-film';
        else if (category === 'Letteratura') iconClass = 'fa-book';
        else if (category === 'Cultura Generale') iconClass = 'fa-graduation-cap';
        
        categoryBtn.innerHTML = `<i class="fas ${iconClass}" style="font-size: 1.5rem; margin-bottom: 8px;"></i><span>${category}</span>`;
        
        // Hover effect
        categoryBtn.onmouseover = () => { categoryBtn.style.transform = 'scale(1.05)'; };
        categoryBtn.onmouseout = () => { categoryBtn.style.transform = 'scale(1)'; };
        
        // Al click, seleziona la categoria
        categoryBtn.addEventListener('click', () => {
            console.log('Categoria selezionata per Tripla Stella con Domanda:', category);
            modal.remove();
            
            // Carica una domanda dalla categoria scelta
            // Passiamo il flag isChosenCategory=true poiché l'utente ha scelto la categoria
            loadRandomQuestion(category, true);
        });
        
        categoriesContainer.appendChild(categoryBtn);
    });
    
    modalContent.appendChild(categoriesContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
} 