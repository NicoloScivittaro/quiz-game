const questions = require('../../data/db.json');

exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api/', '');
  
  try {
    switch (path) {
      case 'questions':
        return {
          statusCode: 200,
          body: JSON.stringify(questions.questions)
        };
      case 'categories':
        const categories = [...new Set(questions.questions.map(q => q.category))];
        return {
          statusCode: 200,
          body: JSON.stringify(categories)
        };
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 