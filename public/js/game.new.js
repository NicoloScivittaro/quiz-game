/**
 * Quiz Party - Game Logic
 * Gestisce la logica del gioco e la board interattiva
 */

// Global namespace
window.QuizParty = window.QuizParty || {};

// Verifica che API_URL sia definita, altrimenti la definisce
if (typeof window.API_URL === 'undefined') {
    console.warn('API_URL non definita, utilizzo valore di fallback');
    window.API_URL = window.location.origin;
}
