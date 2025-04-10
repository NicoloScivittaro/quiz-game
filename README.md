# Quiz Party

Un gioco da tavolo con quiz e domande sviluppato in HTML, CSS, JavaScript e Node.js.

## Struttura del Progetto

Il progetto è organizzato come segue:

```
/quiz-game
|-- public/                   # File statici serviti dal server
|   |-- index.html            # Pagina principale del gioco
|   |-- game.html             # Pagina del gioco vero e proprio
|   |-- questions-editor.html # Editor per gestire le domande
|   |-- css/                  # Fogli di stile CSS
|   |   `-- style.css         # Stile principale
|   `-- js/                   # File JavaScript
|       |-- index.js          # Script per la pagina principale
|       |-- common.js         # Utility comuni per tutte le pagine
|-- data/                     # Directory per i dati del gioco
|   |-- db.json               # Database usato dal server JSON
|   `-- questions.json        # Backup delle domande
|-- server.js                 # Server Node.js (JSON Server)
|-- package.json              # Configurazione del progetto npm
|-- ISTRUZIONI.txt            # Istruzioni per l'utente
`-- README.md                 # Questo file
```

## Tecnologie Utilizzate

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js con JSON Server
- **Database:** JSON file-based

## Come Iniziare

1. Installa le dipendenze:

```
npm install
```

2. Avvia il server:

```
npm start
```

3. Apri il browser all'indirizzo:

```
http://localhost:3000
```

## Funzionalità

- **Menu Principale:** Configurazione del gioco (numero di giocatori, stelle per vincere)
- **Personalizzazione Giocatori:** Nomi, avatar e colori
- **Modalità di Gioco:** Domande a risposta multipla, vero/falso e a risposta aperta
- **Editor di Domande:** Gestione completa delle domande e categorie
- **Punteggi e Statistiche:** Tracciamento dei punteggi durante il gioco

## Gestione dei File

Il progetto utilizza un'architettura organizzata che separa:

- **File HTML:** Interfaccia utente divisa per funzionalità
- **File CSS:** Stili centralizzati in un unico file
- **File JavaScript:** Logica separata per ciascuna pagina con utility comuni
- **Dati:** Archiviati in file JSON nella directory `data/`

## API REST

Il server espone le seguenti API:

- `GET /api/categories` - Recupera l'elenco delle categorie
- `GET /api/questions` - Recupera tutte le domande
- `POST /api/questions` - Aggiunge una nuova domanda
- `PUT /api/questions/:id` - Aggiorna una domanda esistente
- `DELETE /api/questions/:id` - Elimina una domanda

## Backup e Fallback

In caso di problemi di connessione al server:

1. I dati vengono automaticamente salvati nel localStorage del browser
2. In caso di errore di caricamento delle API, l'applicazione tenta di caricare i dati dal localStorage
3. Se nessun dato è disponibile, viene caricato un set predefinito di categorie 