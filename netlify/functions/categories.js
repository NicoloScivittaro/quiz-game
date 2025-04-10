const fs = require('fs');
const path = require('path');

// Dati delle domande incorporati direttamente nella funzione
const questions = [
    {
        "id": 1,
        "category": "Letteratura",
        "question": "Chi è l'autore de 'Il giovane Holden'?",
        "answer": "J.D. Salinger",
        "type": "text"
    },
    {
        "id": 2,
        "category": "Storia",
        "question": "In che anno è caduto il muro di Berlino?",
        "answer": "1989",
        "type": "text"
    },
    {
        "id": 3,
        "category": "Scienza",
        "question": "Qual è il simbolo chimico dell'oro?",
        "answer": "Au",
        "type": "text"
    },
    {
        "id": 4,
        "category": "Arte",
        "question": "Chi ha dipinto 'La Gioconda'?",
        "answer": "Leonardo da Vinci",
        "type": "text"
    }
];

exports.handler = async function(event, context) {
    try {
        console.log('Categories function started');
        
        // Estrai le categorie uniche dalle domande
        const categories = [...new Set(questions.map(q => q.category))].map((category, index) => ({
            id: index + 1,
            name: category
        }));

        console.log('Categories extracted:', categories);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(categories)
        };
    } catch (error) {
        console.error('Error in categories function:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                stack: error.stack
            })
        };
    }
}; 