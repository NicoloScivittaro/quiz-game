// Configurazione dell'API URL
(function() {
    // Determina se siamo in ambiente di sviluppo
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
    
    // Imposta l'API URL in base all'ambiente
    window.API_URL = isDevelopment 
        ? 'http://localhost:8888'  // URL di sviluppo
        : window.location.origin;  // URL di produzione
    
    console.log('API_URL configured:', window.API_URL);
})(); 