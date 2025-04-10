const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        // Leggi il file db.json
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        const dbContent = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(dbContent);

        // Estrai le categorie uniche dalle domande
        const categories = [...new Set(db.questions.map(q => q.category))].map((category, index) => ({
            id: index + 1,
            name: category
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(categories)
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