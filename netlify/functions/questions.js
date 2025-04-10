const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        // Leggi il file db.json
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        const dbContent = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(dbContent);

        // Filtra le domande per categoria se specificata
        const category = event.queryStringParameters?.category;
        const questions = category 
            ? db.questions.filter(q => q.category === category)
            : db.questions;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(questions)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 