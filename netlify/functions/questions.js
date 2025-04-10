const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        console.log('Questions function started');
        console.log('Event:', event);
        
        // Costruisci il percorso del file db.json
        const dbPath = path.join(process.cwd(), '..', 'data', 'db.json');
        console.log('Looking for db.json at:', dbPath);
        
        // Verifica se il file esiste
        if (!fs.existsSync(dbPath)) {
            console.error('db.json not found at:', dbPath);
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Database file not found' })
            };
        }

        // Leggi il file
        const dbContent = fs.readFileSync(dbPath, 'utf8');
        console.log('Successfully read db.json');
        
        const db = JSON.parse(dbContent);
        console.log('Successfully parsed db.json');

        // Filtra le domande per categoria se specificata
        const category = event.queryStringParameters?.category;
        console.log('Requested category:', category);
        
        const questions = category 
            ? db.questions.filter(q => q.category === category)
            : db.questions;
            
        console.log(`Found ${questions.length} questions`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(questions)
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