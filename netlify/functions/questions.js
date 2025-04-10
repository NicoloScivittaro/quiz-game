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
        console.log('Questions function started');
        console.log('Event:', event);
        
        // Filtra le domande per categoria se specificata
        const category = event.queryStringParameters?.category;
        console.log('Requested category:', category);
        
        const filteredQuestions = category 
            ? questions.filter(q => q.category === category)
            : questions;
            
        console.log(`Found ${filteredQuestions.length} questions`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(filteredQuestions)
        };
    } catch (error) {
        console.error('Error in questions function:', error);
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