const fs = require('fs');
const path = require('path');

// Percorso al file db.json
const dbPath = path.join(__dirname, '../../public/data/db.json');

// Leggi il file db.json
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const questions = dbData.questions;

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