const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data/db.json');
const routes = require('./routes.json');
const middlewares = jsonServer.defaults({
  static: 'public'
});
const port = 3000;

// Configurazione dei middleware
server.use(middlewares);

// Gestione CORS per permettere richieste da qualsiasi origine
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Middleware per gestire i metodi HTTP
server.use(jsonServer.bodyParser);

// Reindirizza la root a index.html
server.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Log delle richieste
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Usa il router di json-server con le routes personalizzate
server.use(jsonServer.rewriter(routes));
server.use('/api', router);

// Gestione errori
server.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Personalizza il messaggio di avvio
server.listen(port, () => {
  console.log('==================================');
  console.log('   Quiz Party API Server');
  console.log('==================================');
  console.log(`Server avviato su http://localhost:${port}`);
  console.log(`API disponibile su http://localhost:${port}/api`);
  console.log('Endpoints disponibili:');
  console.log(`- Categorie: http://localhost:${port}/api/categories`);
  console.log(`- Domande: http://localhost:${port}/api/questions`);
  console.log('==================================');
}); 