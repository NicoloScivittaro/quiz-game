// Dati delle domande incorporati direttamente nella funzione 
// (prime 30 domande del db.json)
const questionsData = {
  "categories": [
    "Storia",
    "Geografia",
    "Scienza",
    "Sport",
    "Arte",
    "Musica",
    "Cinema",
    "Letteratura"
  ],
  "questions": [
    {
      "id": 1,
      "category": "Scienza",
      "type": "text",
      "question": "Qual è l'elemento più abbondante nell'universo?",
      "answer": "Idrogeno"
    },
    {
      "id": 2,
      "category": "Scienza",
      "type": "boolean",
      "question": "L'acqua è composta da idrogeno e ossigeno?",
      "answer": "Vero"
    },
    {
      "id": 3,
      "category": "Scienza",
      "type": "text",
      "question": "Qual è il pianeta più grande del Sistema Solare?",
      "answer": "Giove"
    },
    {
      "id": 4,
      "category": "Scienza",
      "type": "text",
      "question": "Chi ha formulato la teoria della relatività?",
      "answer": "Albert Einstein"
    },
    {
      "id": 5,
      "category": "Scienza",
      "type": "boolean",
      "question": "Il DNA si trova nel nucleo delle cellule?",
      "answer": "Vero"
    },
    {
      "id": 6,
      "category": "Scienza",
      "type": "multiple",
      "question": "Qual è l'organo più grande del corpo umano?",
      "options": [
        "Cuore",
        "Fegato",
        "Pelle",
        "Cervello"
      ],
      "answer": "Pelle"
    },
    {
      "id": 7,
      "category": "Scienza",
      "type": "multiple",
      "question": "A quanti gradi Celsius l'acqua bolle a livello del mare?",
      "options": [
        "90°C",
        "100°C",
        "110°C",
        "120°C"
      ],
      "answer": "100°C"
    },
    {
      "id": 8,
      "category": "Scienza",
      "type": "multiple",
      "question": "Quale gas usiamo per respirare?",
      "options": [
        "Azoto",
        "Idrogeno",
        "Ossigeno",
        "Anidride carbonica"
      ],
      "answer": "Ossigeno"
    },
    {
      "id": 9,
      "category": "Scienza",
      "type": "boolean",
      "question": "La fotosintesi clorofilliana avviene nelle piante?",
      "answer": "Vero"
    },
    {
      "id": 10,
      "category": "Scienza",
      "type": "multiple",
      "question": "Qual è l'unità di misura della corrente elettrica?",
      "options": [
        "Volt",
        "Watt",
        "Ampere",
        "Ohm"
      ],
      "answer": "Ampere"
    },
    {
      "id": 21,
      "category": "Sport",
      "type": "multiple",
      "question": "Chi ha vinto il Pallone d'Oro nel 2021?",
      "options": [
          "Lionel Messi",
          "Cristiano Ronaldo",
          "Robert Lewandowski",
          "Karim Benzema"
      ],
      "answer": "Lionel Messi"
    },
    {
      "id": 22,
      "category": "Sport",
      "type": "multiple",
      "question": "Quale squadra ha vinto la Champions League nel 2020?",
      "options": [
          "Real Madrid",
          "Bayern Monaco",
          "Manchester City",
          "Paris Saint-Germain"
      ],
      "answer": "Bayern Monaco"
    },
    {
      "id": 61,
      "category": "Storia",
      "type": "text",
      "question": "In che anno è caduto l'Impero Romano d'Occidente?",
      "answer": "476"
    },
    {
      "id": 62,
      "category": "Storia",
      "type": "multiple",
      "question": "Chi è stato il primo presidente degli Stati Uniti?",
      "options": [
          "Thomas Jefferson",
          "George Washington",
          "Abraham Lincoln",
          "John Adams"
      ],
      "answer": "George Washington"
    },
    {
      "id": 101,
      "category": "Arte",
      "type": "text",
      "question": "Chi ha dipinto La Gioconda?",
      "answer": "Leonardo da Vinci"
    },
    {
      "id": 102,
      "category": "Arte",
      "type": "multiple",
      "question": "A quale movimento artistico apparteneva Vincent van Gogh?",
      "options": [
          "Impressionismo",
          "Post-impressionismo",
          "Cubismo",
          "Surrealismo"
      ],
      "answer": "Post-impressionismo"
    },
    {
      "id": 141,
      "category": "Geografia",
      "type": "text",
      "question": "Qual è la capitale dell'Australia?",
      "answer": "Canberra"
    },
    {
      "id": 142,
      "category": "Geografia",
      "type": "multiple",
      "question": "Quale è il fiume più lungo del mondo?",
      "options": [
          "Nilo",
          "Amazzoni",
          "Mississippi",
          "Yangtze"
      ],
      "answer": "Nilo"
    },
    {
      "id": 181,
      "category": "Musica",
      "type": "text",
      "question": "Chi è l'autore delle Quattro Stagioni?",
      "answer": "Antonio Vivaldi"
    },
    {
      "id": 182,
      "category": "Musica",
      "type": "multiple",
      "question": "Quale gruppo ha pubblicato l'album 'The Dark Side of the Moon'?",
      "options": [
          "The Beatles",
          "Led Zeppelin",
          "Pink Floyd",
          "The Rolling Stones"
      ],
      "answer": "Pink Floyd"
    },
    {
      "id": 221,
      "category": "Cinema",
      "type": "text",
      "question": "Chi ha diretto il film 'Pulp Fiction'?",
      "answer": "Quentin Tarantino"
    },
    {
      "id": 222,
      "category": "Cinema",
      "type": "multiple",
      "question": "Quale film ha vinto l'Oscar come miglior film nel 2020?",
      "options": [
          "1917",
          "Joker",
          "Parasite",
          "C'era una volta a... Hollywood"
      ],
      "answer": "Parasite"
    },
    {
      "id": 261,
      "category": "Letteratura",
      "type": "text",
      "question": "Chi ha scritto 'Il Piccolo Principe'?",
      "answer": "Antoine de Saint-Exupéry"
    },
    {
      "id": 262,
      "category": "Letteratura",
      "type": "multiple",
      "question": "Quale di questi libri è stato scritto da J.R.R. Tolkien?",
      "options": [
          "Le Cronache di Narnia",
          "Il Signore degli Anelli",
          "Harry Potter",
          "Le Cronache del Ghiaccio e del Fuoco"
      ],
      "answer": "Il Signore degli Anelli"
    }
  ]
};

exports.handler = async function(event, context) {
    try {
        console.log('Questions function started - Using hardcoded data');
        
        // Filtra le domande per categoria se specificata
        const category = event.queryStringParameters?.category;
        console.log('Requested category:', category);
        
        const filteredQuestions = category 
            ? questionsData.questions.filter(q => q.category === category)
            : questionsData.questions;
            
        console.log(`Found ${filteredQuestions.length} questions after filtering`);

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