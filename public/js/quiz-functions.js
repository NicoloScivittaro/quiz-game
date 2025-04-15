/**
 * Quiz Party - Funzioni relative alle domande
 * Gestisce le domande, le risposte e il sistema di quiz
 */

/**
 * Mostra una domanda al giocatore corrente
 */
function showQuestion() {
    // Se la categoria è stata scelta dal giocatore (powerup)
    const player = players[currentPlayerIndex];
    
    if (player.powerups && player.powerups.categoryChoice > 0 && !player.usedCategoryChoice) {
        // Mostra selettore di categorie
        showCategorySelector();
        return;
    }
    
    // Seleziona una categoria casuale
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    console.log('Categoria selezionata:', randomCategory);
    
    // Carica una domanda casuale dalla categoria
    loadRandomQuestion(randomCategory);
}

/**
 * Mostra un selettore di categoria quando il giocatore usa il powerup
 */
function showCategorySelector() {
    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'categorySelector';
    
    // Crea il contenuto
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const title = document.createElement('h2');
    title.textContent = 'Scegli una categoria';
    modalContent.appendChild(title);
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-grid';
    
    // Aggiungi ogni categoria
    availableCategories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-button';
        categoryBtn.textContent = category;
        
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
        
        categoryBtn.innerHTML = `<i class="fas ${iconClass}"></i><span>${category}</span>`;
        
        // Al click, seleziona la categoria
        categoryBtn.addEventListener('click', () => {
            console.log('Categoria selezionata:', category);
            modal.remove();
            
            // Usa il powerup
            const player = players[currentPlayerIndex];
            player.powerups.categoryChoice--;
            player.usedCategoryChoice = true;
            
            // Aggiorna UI
            renderPlayerInfo();
            
            // Log
            addToGameLog(`${player.name} ha scelto la categoria ${category}`);
            
            // Carica domanda dalla categoria scelta
            loadRandomQuestion(category, true);
        });
        
        categoriesContainer.appendChild(categoryBtn);
    });
    
    modalContent.appendChild(categoriesContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
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
        
        try {
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
                fallbackToDefaultQuestions(category, isChosenCategory);
                return;
            }

            const randomIndex = Math.floor(Math.random() * questions.length);
            const selectedQuestion = questions[randomIndex];
            console.log('Selected question:', selectedQuestion, 'Passing isChosenCategory:', isChosenCategory);
            
            displayQuestion(selectedQuestion, isChosenCategory);
        } catch (error) {
            console.error('Error loading questions:', error);
            fallbackToDefaultQuestions(category, isChosenCategory);
        }
    } catch (error) {
        console.error('General error during question loading:', error);
        showAnimatedNotification('Errore nel caricamento delle domande', 'error');
        fallbackToDefaultQuestions(category, isChosenCategory);
    }
}

/**
 * Fallback a domande predefinite in caso di errore
 */
function fallbackToDefaultQuestions(category, isChosenCategory) {
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

/**
 * Fornisce un set di domande predefinito in caso di errore API
 * @returns {Array} Domande predefinite
 */
function getDefaultQuestions() {
    return [
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
            "category": "Storia",
            "type": "text",
            "question": "In che anno è caduto il Muro di Berlino?",
            "answer": "1989"
        },
        {
            "id": 4,
            "category": "Geografia",
            "type": "text",
            "question": "Qual è la capitale della Spagna?",
            "answer": "Madrid"
        },
        {
            "id": 5,
            "category": "Sport",
            "type": "text",
            "question": "Quale squadra ha vinto più Mondiali di calcio?",
            "answer": "Brasile"
        },
        {
            "id": 6,
            "category": "Musica",
            "type": "text",
            "question": "Chi è considerato il Re del Pop?",
            "answer": "Michael Jackson"
        },
        {
            "id": 7,
            "category": "Cinema",
            "type": "text",
            "question": "Chi ha diretto il film Titanic?",
            "answer": "James Cameron"
        },
        {
            "id": 8,
            "category": "Arte",
            "type": "text",
            "question": "Chi ha dipinto la Gioconda?",
            "answer": "Leonardo da Vinci"
        },
        {
            "id": 9,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi ha scritto 'I Promessi Sposi'?",
            "answer": "Alessandro Manzoni"
        },
        {
            "id": 10, 
            "category": "Cultura Generale",
            "type": "text",
            "question": "Qual è la moneta ufficiale del Giappone?",
            "answer": "Yen"
        }
    ];
}

/**
 * Mostra una domanda al giocatore
 * @param {Object} question - La domanda da mostrare
 * @param {boolean} isChosenCategory - Indica se la categoria è stata scelta dal giocatore
 */
function displayQuestion(question, isChosenCategory = false) {
    // Salva la domanda corrente
    currentQuestion = question;
    
    // Crea il modale per la domanda
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'questionModal';
    
    // Contenuto del modale
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content question-content';
    
    // Categoria
    const category = document.createElement('div');
    category.className = 'question-category';
    category.textContent = question.category || 'Categoria sconosciuta';
    modalContent.appendChild(category);
    
    // Domanda
    const questionText = document.createElement('h2');
    questionText.className = 'question-text';
    questionText.textContent = question.question;
    modalContent.appendChild(questionText);
    
    // Contenitore risposte
    const answersContainer = document.createElement('div');
    answersContainer.className = 'answers-container';
    
    // In base al tipo di domanda, mostra diverse opzioni di risposta
    switch (question.type) {
        case 'multiple':
            // Domanda a scelta multipla
            if (question.options && Array.isArray(question.options)) {
                question.options.forEach(option => {
                    const button = document.createElement('button');
                    button.className = 'answer-button';
                    button.textContent = option;
                    
                    button.addEventListener('click', () => {
                        const isCorrect = option === question.answer;
                        
                        // Evidenzia il pulsante
                        button.classList.add(isCorrect ? 'correct' : 'incorrect');
                        
                        // Disabilita tutti i pulsanti
                        document.querySelectorAll('.answer-button').forEach(btn => {
                            btn.disabled = true;
                            if (btn.textContent === question.answer && !isCorrect) {
                                btn.classList.add('correct');
                            }
                        });
                        
                        // Mostra risultato dopo breve delay
                        setTimeout(() => {
                            modal.remove();
                            showQuestionResult(isCorrect, question.answer, isChosenCategory);
                        }, 1500);
                    });
                    
                    answersContainer.appendChild(button);
                });
            }
            break;
            
        case 'boolean':
            // Domanda vero/falso
            ['Vero', 'Falso'].forEach(option => {
                const button = document.createElement('button');
                button.className = 'answer-button boolean-button';
                button.textContent = option;
                
                button.addEventListener('click', () => {
                    const isCorrect = option === question.answer;
                    
                    // Evidenzia il pulsante
                    button.classList.add(isCorrect ? 'correct' : 'incorrect');
                    
                    // Disabilita tutti i pulsanti
                    document.querySelectorAll('.answer-button').forEach(btn => {
                        btn.disabled = true;
                        if (btn.textContent === question.answer && !isCorrect) {
                            btn.classList.add('correct');
                        }
                    });
                    
                    // Mostra risultato dopo breve delay
                    setTimeout(() => {
                        modal.remove();
                        showQuestionResult(isCorrect, question.answer, isChosenCategory);
                    }, 1500);
                });
                
                answersContainer.appendChild(button);
            });
            break;
            
        case 'text':
        default:
            // Domanda a risposta aperta
            const form = document.createElement('form');
            form.className = 'text-answer-form';
            form.onsubmit = (e) => {
                e.preventDefault();
                
                const input = form.querySelector('input');
                const userAnswer = input.value.trim();
                
                if (!userAnswer) {
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 500);
                    return;
                }
                
                const isCorrect = checkTextAnswer(userAnswer, question.answer);
                modal.remove();
                showQuestionResult(isCorrect, question.answer, isChosenCategory);
            };
            
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-answer-input';
            input.placeholder = 'Scrivi la tua risposta...';
            input.autocomplete = 'off';
            inputGroup.appendChild(input);
            
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'submit-answer';
            submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
            inputGroup.appendChild(submitBtn);
            
            form.appendChild(inputGroup);
            answersContainer.appendChild(form);
            
            // Focus sull'input dopo breve delay
            setTimeout(() => input.focus(), 300);
            break;
    }
    
    modalContent.appendChild(answersContainer);
    
    // Timer se abilitato
    if (timerEnabled) {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'timer-container';
        timerContainer.innerHTML = '<div class="timer-bar"><div class="timer-progress"></div></div>';
        modalContent.appendChild(timerContainer);
        
        // Avvia il timer
        let seconds = 20;
        // Se il giocatore ha il powerup extraTime, aumenta il tempo
        const player = players[currentPlayerIndex];
        if (player.powerups && player.powerups.extraTime) {
            seconds = 30;
            player.powerups.extraTime = false; // Consuma il powerup
            renderPlayerInfo(); // Aggiorna UI
            addToGameLog(`${player.name} ha usato il powerup Tempo Esteso`);
        }
        
        startQuestionTimer(seconds, () => {
            modal.remove();
            timeOver(question.answer);
        });
    }
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Verifica se una risposta testuale è corretta
 * @param {string} userAnswer - Risposta dell'utente
 * @param {string} correctAnswer - Risposta corretta
 * @returns {boolean} - true se la risposta è corretta
 */
function checkTextAnswer(userAnswer, correctAnswer) {
    // Normalizza entrambe le stringhe (lowercase, no spazi extra)
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();
    
    // Verifica esatta
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        return true;
    }
    
    // Verifica fuzzy (tollera piccoli errori ortografici)
    const distance = levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
    const threshold = Math.max(1, Math.floor(normalizedCorrectAnswer.length / 5));
    
    return distance <= threshold;
}

/**
 * Calcola la distanza di Levenshtein tra due stringhe
 * Misura il numero minimo di operazioni (inserimenti, eliminazioni, sostituzioni)
 * necessarie per trasformare una stringa nell'altra
 */
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    
    // Inizializza la prima riga
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    // Inizializza la prima colonna
    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }
    
    // Calcola la distanza
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // sostituzione
                    Math.min(
                        matrix[i][j - 1] + 1, // inserimento
                        matrix[i - 1][j] + 1  // eliminazione
                    )
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

/**
 * Avvia un timer per la domanda
 * @param {number} seconds - Secondi per il timer
 * @param {Function} callback - Funzione da chiamare quando il timer scade
 */
function startQuestionTimer(seconds, callback) {
    const timerBar = document.querySelector('.timer-progress');
    if (!timerBar) return;
    
    // Reset dell'UI
    timerBar.style.width = '100%';
    timerBar.style.transition = `width ${seconds}s linear`;
    
    // Avvia l'animazione
    setTimeout(() => {
        timerBar.style.width = '0%';
    }, 50);
    
    // ID del timer
    window.questionTimer = {
        id: setTimeout(callback, seconds * 1000),
        callback: callback,
        startTime: Date.now(),
        duration: seconds * 1000
    };
    
    // Aggiorna l'UI del timer ogni secondo
    window.questionTimerInterval = setInterval(updateTimerUI, 1000);
    
    /**
     * Aggiorna l'UI del timer
     */
    function updateTimerUI() {
        if (!window.questionTimer) return;
        
        const elapsed = Date.now() - window.questionTimer.startTime;
        const remaining = Math.max(0, window.questionTimer.duration - elapsed);
        const remainingSeconds = Math.ceil(remaining / 1000);
        
        // Update the timer text if it exists
        const timerText = document.querySelector('.timer-text');
        if (timerText) {
            timerText.textContent = remainingSeconds;
        } else {
            // Create timer text if it doesn't exist
            const timerContainer = document.querySelector('.timer-container');
            if (timerContainer) {
                const newTimerText = document.createElement('div');
                newTimerText.className = 'timer-text';
                newTimerText.textContent = remainingSeconds;
                timerContainer.appendChild(newTimerText);
            }
        }
        
        // If timer completed, clear the interval
        if (remaining <= 0) {
            clearInterval(window.questionTimerInterval);
        }
    }
}

/**
 * Pulisce il timer della domanda
 */
function clearQuestionTimer() {
    if (window.questionTimer) {
        clearTimeout(window.questionTimer.id);
        window.questionTimer = null;
    }
    
    if (window.questionTimerInterval) {
        clearInterval(window.questionTimerInterval);
        window.questionTimerInterval = null;
    }
}

/**
 * Gestisce la scadenza del timer
 * @param {string} correctAnswer - La risposta corretta
 */
function timeOver(correctAnswer) {
    clearQuestionTimer();
    showQuestionResult(false, correctAnswer);
    playSound('wrong');
    showAnimatedNotification('Tempo scaduto!', 'error');
}

/**
 * Mostra il risultato della domanda
 * @param {boolean} isCorrect - Se la risposta è corretta
 * @param {string} correctAnswer - La risposta corretta
 * @param {boolean} isChosenCategory - Se la categoria è stata scelta dal giocatore
 */
function showQuestionResult(isCorrect, correctAnswer, isChosenCategory = false) {
    clearQuestionTimer();
    
    const player = players[currentPlayerIndex];
    
    // Aggiorna statistiche giocatore
    if (isCorrect) {
        player.stats.correct++;
        
        // Assegna crediti (più crediti se ha scelto la categoria)
        const baseCredits = 15;
        const bonus = isChosenCategory ? 10 : 0;
        const totalCredits = baseCredits + bonus;
        player.credits += totalCredits;
        
        // Controlla se il giocatore ha il powerup per ottenere una stella con risposta corretta
        if (player.powerups && player.powerups.starOnCorrect) {
            player.stars++;
            player.powerups.starOnCorrect = false; // Rimuovi il powerup dopo l'uso
            
            // Effetto visivo per la stella
            showStarCollectionEffect();
            
            // Mostra notifica
            showAnimatedNotification('Hai ottenuto una stella!', 'success');
            addToGameLog(`${player.name} ha ottenuto una stella per aver risposto correttamente alla domanda`);
            
            // Controlla se il giocatore ha vinto
            if (checkWinCondition()) {
                return; // Fine del gioco
            }
        }
        
        // Controlla se il giocatore ha il powerup per ottenere tripla stella con risposta corretta
        if (player.powerups && player.powerups.tripleStarOnCorrect) {
            player.stars += 3;
            player.powerups.tripleStarOnCorrect = false; // Rimuovi il powerup dopo l'uso
            
            // Effetto visivo per le tre stelle (in sequenza)
            setTimeout(() => {
                showStarCollectionEffect();
                setTimeout(() => {
                    showStarCollectionEffect();
                    setTimeout(() => {
                        showStarCollectionEffect();
                    }, 500);
                }, 500);
            }, 500);
            
            // Mostra notifica
            showAnimatedNotification('BONUS TRIPLA STELLA! +3 STELLE!', 'success', 3000);
            addToGameLog(`${player.name} ha ottenuto TRE stelle per aver risposto correttamente alla domanda`);
            
            // Controlla se il giocatore ha vinto
            if (checkWinCondition()) {
                return; // Fine del gioco
            }
        }
        
        // Controlla se il giocatore è su una casella bonus
        if (player.onBonusSpace) {
            // Assegna il bonus di 25 crediti
            player.credits += 25;
            
            // Mostra notifica
            showAnimatedNotification('BONUS SPAZIO! +25 crediti!', 'success');
            addToGameLog(`${player.name} ha ottenuto 25 crediti bonus per aver risposto correttamente sulla casella bonus`);
            
            // Rimuovi il flag
            player.onBonusSpace = false;
        }
        
        // Bonus speciale: se è una domanda casuale (non di categoria scelta) e la risposta è corretta
        // il giocatore ha una possibilità di ottenere direttamente 3 stelle
        if (!isChosenCategory && Math.random() < 0.15) { // 15% di probabilità
            player.stars += 3;
            addToGameLog(`${player.name} ha ottenuto un BONUS SPECIALE di 3 stelle!`);
            showAnimatedNotification('BONUS SPECIALE: +3 STELLE!', 'success', 3000);
            playSound('star');
            
            // Effetto visivo per le stelle
            setTimeout(() => {
                showStarCollectionEffect();
                setTimeout(() => {
                    showStarCollectionEffect();
                    setTimeout(() => {
                        showStarCollectionEffect();
                    }, 500);
                }, 500);
            }, 500);
            
            // Controlla se il giocatore ha vinto
            if (checkWinCondition()) {
                return; // Fine del gioco
            }
        }
        
        addToGameLog(`${player.name} ha risposto correttamente e guadagnato ${totalCredits} crediti`);
        playSound('correct');
    } else {
        player.stats.incorrect++;
        addToGameLog(`${player.name} ha risposto in modo errato`);
        playSound('wrong');
        
        // Se aveva i powerup per le stelle, li rimuoviamo comunque in caso di risposta errata
        if (player.powerups) {
            player.powerups.starOnCorrect = false;
            player.powerups.tripleStarOnCorrect = false;
        }
        
        // Rimuovi il flag bonus space anche in caso di risposta errata
        player.onBonusSpace = false;
    }
    
    // Resetta il flag di scelta categoria
    player.usedCategoryChoice = false;
    
    // Crea il modale del risultato
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'resultModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = `modal-content result-content ${isCorrect ? 'correct' : 'incorrect'}`;
    
    // Titolo del risultato
    const resultTitle = document.createElement('h2');
    resultTitle.className = 'result-title';
    resultTitle.textContent = isCorrect ? 'Risposta Corretta!' : 'Risposta Errata';
    modalContent.appendChild(resultTitle);
    
    // Risposta corretta
    const answerText = document.createElement('p');
    answerText.className = 'correct-answer';
    answerText.innerHTML = `La risposta corretta era: <strong>${correctAnswer}</strong>`;
    modalContent.appendChild(answerText);
    
    // Punti guadagnati
    if (isCorrect) {
        const pointsText = document.createElement('p');
        pointsText.className = 'points-gained';
        
        const baseCredits = 15;
        const bonus = isChosenCategory ? 10 : 0;
        const totalCredits = baseCredits + bonus;
        
        let pointsHTML = `Hai guadagnato <strong>${baseCredits} crediti</strong>`;
        if (bonus > 0) {
            pointsHTML += ` <strong>+${bonus} bonus</strong> per aver scelto la categoria`;
        }
        
        pointsText.innerHTML = pointsHTML;
        modalContent.appendChild(pointsText);
    }
    
    // Pulsante continua
    const continueBtn = document.createElement('button');
    continueBtn.className = 'continue-btn';
    continueBtn.textContent = 'Continua';
    
    continueBtn.addEventListener('click', () => {
        modal.remove();
        closeQuestionModal();
    });
    
    modalContent.appendChild(continueBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Aggiorna l'interfaccia del giocatore
    renderPlayerInfo();
}

/**
 * Chiude il modale della domanda
 */
function closeQuestionModal() {
    // Riabilita il dado
    diceRolling = false;
    
    if (diceButton) {
        diceButton.disabled = false;
    }
    
    // Passa al giocatore successivo
    nextPlayer();
    
    // Salva lo stato del gioco
    saveGameData();
} 