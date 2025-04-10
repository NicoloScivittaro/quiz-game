const fs = require('fs');
const path = require('path');

// Categorie incorporate direttamente nella funzione
const categories = [
  "Storia",
  "Geografia",
  "Scienza",
  "Sport",
  "Arte",
  "Musica",
  "Cinema",
  "Letteratura"
];

exports.handler = async function(event, context) {
  try {
    console.log('Categories function started - Using hardcoded data');
    
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