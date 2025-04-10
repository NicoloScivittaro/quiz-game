// Configurazione API
const API_URL = window.location.origin;

/**
 * Loads questions from the API
 * @returns {Promise} Promise that resolves with questions data
 */
async function loadQuestions() {
    try {
        console.log('Loading questions from API...');
        const response = await fetch(`${API_URL}/api/questions`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Questions loaded from API:', data.length);
        return data;
    } catch (error) {
        console.error('Error loading questions from API:', error);
        // Fallback to localStorage
        const savedQuestions = localStorage.getItem('questions');
        if (savedQuestions) {
            console.log('Using questions from localStorage');
            return JSON.parse(savedQuestions);
        }
        return [];
    }
}

/**
 * Loads categories from the API
 * @returns {Promise} Promise that resolves with categories data
 */
async function loadCategories() {
    try {
        console.log('loadCategories: Caricamento categorie da API iniziato');
        console.log(`loadCategories: Facendo fetch a ${API_URL}/api/categories`);
        
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        console.log('loadCategories: Categorie caricate da API:', categories);
        return categories;
    } catch (error) {
        console.error('loadCategories: Error durante caricamento da API:', error);
        console.error('Error stack:', error.stack);
        console.log('loadCategories: Tentativo di caricamento da localStorage');
        
        // Fallback to localStorage
        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
            const categories = JSON.parse(savedCategories);
            console.log(`loadCategories: Caricate ${categories.length} categorie da localStorage`);
            return categories;
        }
        return [];
    }
}

/**
 * Saves data to the API
 * @param {String} endpoint - API endpoint (categories or questions)
 * @param {Array|Object} data - Data to save
 * @param {String} method - HTTP method (PUT, POST, etc.)
 * @returns {Promise} Promise that resolves with the response
 */
async function saveData(endpoint, data, method = 'PUT') {
    console.log(`saveData called: ${method} ${endpoint}`, JSON.stringify(data, null, 2));
    
    try {
        // Costruisce l'URL completo dell'API
        const apiUrl = `${API_URL}/${endpoint}`;
        console.log(`Making API request to ${apiUrl}`, { method, headers: { 'Content-Type': 'application/json' }});
        
        // Esegue la richiesta Fetch
        const response = await fetch(apiUrl, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log(`API response status: ${response.status} ${response.statusText}`);
        
        // Se la risposta non è OK, gestisce l'errore
        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
                console.error(`API error response: ${errorText}`);
            } catch (e) {
                errorText = "Impossibile leggere risposta errore";
            }
            throw new Error(`Failed to save ${endpoint}: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        // Elabora la risposta JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            console.log(`API response data:`, result);
            return result;
        } else {
            console.log('Response is not JSON, returning response object');
            return { success: true, status: response.status };
        }
    } catch (error) {
        console.error(`Error details for ${endpoint}:`, error);
        console.error(`Error saving ${endpoint} to API:`, error.message);
        
        // Save to localStorage as fallback
        try {
            const savedData = localStorage.getItem('savedQuestionData') || '{"categories":[],"questions":[]}';
            const parsedData = JSON.parse(savedData);
            
            console.log(`Saving to localStorage as fallback, existing data:`, parsedData);
            
            // Determine which property to update
            if (endpoint === 'categories') {
                parsedData.categories = data;
            } else if (endpoint === 'questions') {
                // For new questions (POST), add a fake ID and push to array
                if (method === 'POST') {
                    const newQuestion = { ...data, id: Date.now() };
                    parsedData.questions.push(newQuestion);
                    console.log(`Added question with generated ID ${newQuestion.id} to localStorage`);
                    
                    // Return the new question as if it came from the server
                    localStorage.setItem('savedQuestionData', JSON.stringify(parsedData));
                    console.log(`Updated localStorage data saved`);
                    return newQuestion;
                }
            } else if (endpoint.startsWith('questions/')) {
                // For updates (PUT), find the question by ID and update it
                const id = parseInt(endpoint.split('/')[1]);
                const index = parsedData.questions.findIndex(q => q.id === id);
                if (index >= 0) {
                    parsedData.questions[index] = { ...data };
                    console.log(`Updated question with ID ${id} in localStorage`);
                    
                    // Return the updated question
                    localStorage.setItem('savedQuestionData', JSON.stringify(parsedData));
                    return parsedData.questions[index];
                }
            }
            
            localStorage.setItem('savedQuestionData', JSON.stringify(parsedData));
            console.log(`Updated localStorage data saved`);
        } catch (localStorageError) {
            console.error('Error saving to localStorage:', localStorageError);
        }
        
        // Rethrow the error to be handled by the caller
        throw error;
    }
}

/**
 * Shows a notification
 * @param {String} message - Message to display
 * @param {String} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

/**
 * Deletes data from the API
 * @param {String} endpoint - API endpoint (e.g., 'questions/123')
 * @returns {Promise} Promise that resolves when the delete is complete
 */
async function deleteData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete ${endpoint}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
    }
}

// Funzioni per il salvataggio dei dati
function saveQuestions(questions) {
    try {
        localStorage.setItem('questions', JSON.stringify(questions));
        console.log('Questions saved to localStorage');
    } catch (error) {
        console.error('Error saving questions:', error);
    }
}

function saveCategories(categories) {
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
        console.log('Categories saved to localStorage');
    } catch (error) {
        console.error('Error saving categories:', error);
    }
}

// Esporta le funzioni
window.quizAPI = {
    loadQuestions,
    loadCategories,
    saveQuestions,
    saveCategories
}; 