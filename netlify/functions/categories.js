const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        console.log('Categories function started');
        
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

        // Estrai le categorie uniche dalle domande
        const categories = [...new Set(db.questions.map(q => q.category))].map((category, index) => ({
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