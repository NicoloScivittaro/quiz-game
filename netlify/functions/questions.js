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
          "Letteratura",
          "Cultura Generale"
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
            "id": 11,
            "category": "Scienza",
            "type": "multiple",
            "question": "I diamanti sono fatti di quale elemento?",
            "options": [
                "Carbonio",
                "Silicio",
                "Oro",
                "Ferro"
            ],
            "answer": "Carbonio"
        },
        {
            "id": 12,
            "category": "Scienza",
            "type": "boolean",
            "question": "Il sole è una stella?",
            "answer": "Vero"
        },
        {
            "id": 13,
            "category": "Scienza",
            "type": "multiple",
            "question": "Qual è il pianeta più vicino al sole?",
            "options": [
                "Venere",
                "Marte",
                "Terra",
                "Mercurio"
            ],
            "answer": "Mercurio"
        },
        {
            "id": 14,
            "category": "Scienza",
            "type": "boolean",
            "question": "La forza di gravità sulla Luna è più forte che sulla Terra?",
            "answer": "Falso"
        },
        {
            "id": 15,
            "category": "Scienza",
            "type": "multiple",
            "question": "L'ozono è composto da quanti atomi di ossigeno?",
            "options": [
                "Due",
                "Tre",
                "Quattro",
                "Cinque"
            ],
            "answer": "Tre"
        },
        {
            "id": 16,
            "category": "Scienza",
            "type": "multiple",
            "question": "Chi ha scoperto la teoria dell'evoluzione?",
            "options": [
                "Albert Einstein",
                "Charles Darwin",
                "Isaac Newton",
                "Gregor Mendel"
            ],
            "answer": "Charles Darwin"
        },
        {
            "id": 17,
            "category": "Scienza",
            "type": "multiple",
            "question": "Qual è la velocità della luce nel vuoto?",
            "options": [
                "150.000 km/s",
                "200.000 km/s",
                "250.000 km/s",
                "300.000 km/s"
            ],
            "answer": "300.000 km/s"
        },
        {
            "id": 18,
            "category": "Scienza",
            "type": "boolean",
            "question": "I pinguini possono volare?",
            "answer": "Falso"
        },
        {
            "id": 19,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale strumento si usa per misurare i terremoti?",
            "options": [
                "Barometro",
                "Sismografo",
                "Termometro",
                "Igrometro"
            ],
            "answer": "Sismografo"
        },
        {
            "id": 20,
            "category": "Scienza",
            "type": "multiple",
            "question": "La Terra impiega quanti giorni per fare un giro intorno al Sole?",
            "options": [
                "180 giorni",
                "265 giorni",
                "365 giorni",
                "400 giorni"
            ],
            "answer": "365 giorni"
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
          "id": 23,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi è il tennista con più titoli del Grande Slam nella storia?",
          "options": [
              "Rafael Nadal",
              "Roger Federer",
              "Novak Djokovic",
              "Pete Sampras"
          ],
          "answer": "Novak Djokovic"
      },
      {
          "id": 24,
          "category": "Sport",
          "type": "multiple",
          "question": "In quale sport si usa un 'putter'?",
          "options": [
              "Golf",
              "Tennis",
              "Baseball",
              "Hockey"
          ],
          "answer": "Golf"
      },
      {
          "id": 25,
          "category": "Sport",
          "type": "multiple",
          "question": "Quanti minuti dura una partita di basket NBA?",
          "options": [
              "40",
              "48",
              "50",
              "60"
          ],
          "answer": "48"
      },
      {
          "id": 26,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale nazione ha vinto più Coppe del Mondo di calcio?",
          "options": [
              "Brasile",
              "Germania",
              "Italia",
              "Argentina"
          ],
          "answer": "Brasile"
      },
      {
          "id": 27,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi detiene il record di punti segnati in una singola partita NBA?",
          "options": [
              "Michael Jordan",
              "LeBron James",
              "Kobe Bryant",
              "Wilt Chamberlain"
          ],
          "answer": "Wilt Chamberlain"
      },
      {
          "id": 28,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale squadra ha vinto più Super Bowl nella storia?",
          "options": [
              "Dallas Cowboys",
              "Pittsburgh Steelers",
              "New England Patriots",
              "San Francisco 49ers"
          ],
          "answer": "New England Patriots"
      },
      {
          "id": 29,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale pilota ha vinto più titoli di Formula 1?",
          "options": [
              "Ayrton Senna",
              "Lewis Hamilton",
              "Michael Schumacher",
              "Sebastian Vettel"
          ],
          "answer": "Michael Schumacher e Lewis Hamilton"
      },
      {
          "id": 30,
          "category": "Sport",
          "type": "multiple",
          "question": "In quale anno si sono svolte le prime Olimpiadi moderne?",
          "options": [
              "1892",
              "1896",
              "1900",
              "1924"
          ],
          "answer": "1896"
      },
      {
          "id": 31,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha vinto il Tour de France nel 2021?",
          "options": [
              "Primož Roglič",
              "Tadej Pogačar",
              "Egan Bernal",
              "Jonas Vingegaard"
          ],
          "answer": "Tadej Pogačar"
      },
      {
          "id": 32,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale squadra ha vinto il maggior numero di campionati italiani di calcio (Serie A)?",
          "options": [
              "Inter",
              "Juventus",
              "Milan",
              "Roma"
          ],
          "answer": "Juventus"
      },
      {
          "id": 33,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha vinto il Mondiale di calcio 2018?",
          "options": [
              "Germania",
              "Brasile",
              "Francia",
              "Argentina"
          ],
          "answer": "Francia"
      },
      {
          "id": 34,
          "category": "Sport",
          "type": "multiple",
          "question": "Qual è la distanza ufficiale di una maratona?",
          "options": [
              "38,195 km",
              "40,195 km",
              "42,195 km",
              "44,195 km"
          ],
          "answer": "42,195 km"
      },
      {
          "id": 35,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale squadra ha vinto il Mondiale di rugby nel 2019?",
          "options": [
              "Nuova Zelanda",
              "Inghilterra",
              "Sudafrica",
              "Australia"
          ],
          "answer": "Sudafrica"
      },
      {
          "id": 36,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport è noto per il 'Grand Slam'?",
          "options": [
              "Golf",
              "Tennis",
              "Baseball",
              "Pallavolo"
          ],
          "answer": "Tennis"
      },
      {
          "id": 37,
          "category": "Sport",
          "type": "multiple",
          "question": "Quanti giocatori ci sono in una squadra di pallavolo?",
          "options": [
              "5",
              "6",
              "7",
              "8"
          ],
          "answer": "6"
      },
      {
          "id": 38,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha segnato il gol decisivo nella finale di Champions League 2014 tra Real Madrid e Atlético Madrid?",
          "options": [
              "Cristiano Ronaldo",
              "Gareth Bale",
              "Sergio Ramos",
              "Ángel Di María"
          ],
          "answer": "Gareth Bale"
      },
      {
          "id": 39,
          "category": "Sport",
          "type": "multiple",
          "question": "In quale sport si usa una mazza e una pallina su un campo erboso?",
          "options": [
              "Baseball",
              "Golf",
              "Cricket",
              "Hockey su prato"
          ],
          "answer": "Hockey su prato"
      },
      {
          "id": 40,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale nazione ha ospitato le Olimpiadi del 2008?",
          "options": [
              "Grecia",
              "Cina",
              "Regno Unito",
              "Brasile"
          ],
          "answer": "Cina"
      },
      {
        "id": 41,
        "category": "Storia",
        "type": "boolean",
        "question": "L'Impero Romano d'Occidente cadde nel 476 d.C.?",
        "answer": "Vero"
      },
      {
        "id": 42,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il primo imperatore di Roma?",
        "options": ["Augusto", "Nerone", "Cesare", "Traiano"],
        "answer": "Augusto"
      },
      {
        "id": 43,
        "category": "Storia",
        "type": "boolean",
        "question": "La Rivoluzione Francese iniziò nel 1789?",
        "answer": "Vero"
      },
      {
        "id": 44,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale esploratore scoprì l'America nel 1492?",
        "options": ["Cristoforo Colombo", "Vasco da Gama", "Amerigo Vespucci", "Ferdinando Magellano"],
        "answer": "Cristoforo Colombo"
      },
      {
        "id": 45,
        "category": "Storia",
        "type": "boolean",
        "question": "La Prima Guerra Mondiale iniziò nel 1914?",
        "answer": "Vero"
      },
      {
        "id": 46,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi era il presidente degli Stati Uniti durante la Guerra Civile Americana?",
        "options": ["Abraham Lincoln", "George Washington", "Theodore Roosevelt", "Thomas Jefferson"],
        "answer": "Abraham Lincoln"
      },
      {
        "id": 47,
        "category": "Storia",
        "type": "boolean",
        "question": "La Grande Muraglia è stata costruita dalla Cina?",
        "answer": "Vero"
      },
      {
        "id": 48,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi era il re di Francia durante la Rivoluzione Francese?",
        "options": ["Luigi XVI", "Carlo Magno", "Luigi XIV", "Filippo II"],
        "answer": "Luigi XVI"
      },
      {
        "id": 49,
        "category": "Storia",
        "type": "boolean",
        "question": "Il Titanic affondò nel 1912?",
        "answer": "Vero"
      },
      {
        "id": 50,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale evento segnò l'inizio della Seconda Guerra Mondiale?",
        "options": ["L'invasione della Polonia", "L'attacco a Pearl Harbor", "Il Trattato di Versailles", "La marcia su Roma"],
        "answer": "L'invasione della Polonia"
      },
      {
        "id": 51,
        "category": "Storia",
        "type": "boolean",
        "question": "Niccolò Machiavelli scrisse 'Il Principe'?",
        "answer": "Vero"
      },
      {
        "id": 52,
        "category": "Storia",
        "type": "boolean",
        "question": "L'antica città di Troia esisteva davvero?",
        "answer": "Vero"
      },
      {
        "id": 53,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi guidò la Rivoluzione russa del 1917?",
        "options": ["Lenin", "Stalin", "Trotsky", "Gorbaciov"],
        "answer": "Lenin"
      },
      {
        "id": 54,
        "category": "Storia",
        "type": "boolean",
        "question": "Cleopatra VII fu l'ultimo faraone d'Egitto?",
        "answer": "Vero"
      },
      {
        "id": 55,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale paese ha lanciato il primo satellite nello spazio?",
        "options": ["Unione Sovietica", "Stati Uniti", "Cina", "Germania"],
        "answer": "Unione Sovietica"
      },
      {
        "id": 56,
        "category": "Storia",
        "type": "boolean",
        "question": "Benito Mussolini era il dittatore italiano durante la Seconda Guerra Mondiale?",
        "answer": "Vero"
      },
      {
        "id": 57,
        "category": "Storia",
        "type": "boolean",
        "question": "Napoleone Bonaparte è morto nel 1821?",
        "answer": "Vero"
      },
      {
        "id": 58,
        "category": "Storia",
        "type": "boolean",
        "question": "L'Impero Romano ha avuto due capitali dopo il 330 d.C.?",
        "answer": "Vero"
      },
      {
        "id": 59,
        "category": "Storia",
        "type": "boolean",
        "question": "La Magna Carta è stata firmata nel 1215?",
        "answer": "Vero"
      },
      {
        "id": 60,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi ha scoperto la penicillina?",
        "options": ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Edward Jenner"],
        "answer": "Alexander Fleming"
      },
      {
        "id": 61,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è la capitale del Canada?",
        "options": ["Toronto", "Ottawa", "Vancouver", "Montreal"],
        "answer": "Ottawa"
      },
      {
        "id": 62,
        "category": "Geografia",
        "type": "boolean",
        "question": "Il fiume più lungo del mondo è l'Amazzonia?",
        "answer": "Falso"
      },
      {
        "id": 63,
        "category": "Geografia",
        "type": "multiple",
        "question": "Quale continente è il più popoloso?",
        "options": ["Africa", "Asia", "Europa", "America"],
        "answer": "Asia"
      },
      {
        "id": 64,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è il deserto più grande del mondo?",
        "options": ["Gobi", "Kalahari", "Sahara", "Atacama"],
        "answer": "Sahara"
      },
      {
        "id": 65,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è il monte più alto d'Europa?",
        "options": ["Monte Bianco", "Monte Elbrus", "Monte Rosa", "Monti Urali"],
        "answer": "Monte Elbrus"
      },
      {
        "id": 66,
        "category": "Geografia",
        "type": "boolean",
        "question": "L'Australia è un continente?",
        "answer": "Vero"
      },
      {
        "id": 67,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è la capitale del Giappone?",
        "options": ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
        "answer": "Tokyo"
      },
      {
        "id": 68,
        "category": "Geografia",
        "type": "boolean",
        "question": "Il Mar Morto è in realtà un mare?",
        "answer": "Falso"
      },
      {
        "id": 69,
        "category": "Geografia",
        "type": "multiple",
        "question": "In quale paese si trova Machu Picchu?",
        "options": ["Messico", "Perù", "Colombia", "Cile"],
        "answer": "Perù"
      },
      {
        "id": 70,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è il paese più grande del mondo?",
        "options": ["USA", "Cina", "Russia", "Canada"],
        "answer": "Russia"
      },
      {
        "id": 71,
        "category": "Geografia",
        "type": "boolean",
        "question": "Il Polo Sud si trova in Antartide?",
        "answer": "Vero"
      },
      {
        "id": 72,
        "category": "Geografia",
        "type": "multiple",
        "question": "Quale città è conosciuta come 'la città eterna'?",
        "options": ["Atene", "Roma", "Parigi", "Istanbul"],
        "answer": "Roma"
      },
      {
        "id": 73,
        "category": "Geografia",
        "type": "multiple",
        "question": "In quale paese si trova il Grand Canyon?",
        "options": ["USA", "Messico", "Canada", "Argentina"],
        "answer": "USA"
      },
      {
        "id": 74,
        "category": "Geografia",
        "type": "boolean",
        "question": "Il fiume Po è il più lungo d'Italia?",
        "answer": "Vero"
      },
      {
        "id": 75,
        "category": "Geografia",
        "type": "multiple",
        "question": "Quale oceano bagna la costa orientale degli Stati Uniti?",
        "options": ["Pacifico", "Indiano", "Atlantico", "Artico"],
        "answer": "Atlantico"
      },
      {
        "id": 76,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è la montagna più alta d'Africa?",
        "options": ["Monte Kenya", "Kilimangiaro", "Ruwenzori", "Drakensberg"],
        "answer": "Kilimangiaro"
      },
      {
        "id": 77,
        "category": "Geografia",
        "type": "boolean",
        "question": "Il deserto del Gobi si trova in Asia?",
        "answer": "Vero"
      },
      {
        "id": 78,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è il paese più piccolo del mondo?",
        "options": ["San Marino", "Liechtenstein", "Monaco", "Vaticano"],
        "answer": "Vaticano"
      },
      {
        "id": 79,
        "category": "Geografia",
        "type": "boolean",
        "question": "Il Rio delle Amazzoni attraversa il Brasile?",
        "answer": "Vero"
      },
      {
        "id": 80,
        "category": "Geografia",
        "type": "multiple",
        "question": "Qual è la capitale della Corea del Sud?",
        "options": ["Seul", "Busan", "Incheon", "Daegu"],
        "answer": "Seul"
      },
          {
            "id": 81,
            "category": "Arte",
            "type": "text",
            "question": "Chi ha dipinto la Gioconda?",
            "answer": "Leonardo da Vinci"
          },
          {
            "id": 82,
            "category": "Arte",
            "type": "multiple",
            "question": "Quale movimento artistico è associato a Vincent van Gogh?",
            "options": [
              "Impressionismo",
              "Espressionismo",
              "Post-impressionismo",
              "Cubismo"
            ],
            "answer": "Post-impressionismo"
          },
          {
            "id": 83,
            "category": "Arte",
            "type": "text",
            "question": "Quale tecnica di pittura utilizza piccoli puntini di colore per formare un'immagine?",
            "answer": "Pointillismo"
          },
          {
            "id": 84,
            "category": "Arte",
            "type": "boolean",
            "question": "Il realismo è un movimento artistico nato nel XX secolo?",
            "answer": "Falso"
          },
          {
            "id": 85,
            "category": "Arte",
            "type": "text",
            "question": "Chi ha dipinto 'La Notte Stellata'?",
            "answer": "Vincent van Gogh"
          },
          {
            "id": 86,
            "category": "Arte",
            "type": "multiple",
            "question": "Quale artista è celebre per il dipinto 'Il bacio'?",
            "options": [
              "Gustav Klimt",
              "Edvard Munch",
              "Henri Matisse",
              "Pablo Picasso"
            ],
            "answer": "Gustav Klimt"
          },
          {
            "id": 87,
            "category": "Arte",
            "type": "text",
            "question": "Chi ha realizzato il celebre dipinto 'Guernica'?",
            "answer": "Pablo Picasso"
          },
          {
            "id": 88,
            "category": "Arte",
            "type": "multiple",
            "question": "Quale stile artistico, caratterizzato da forme geometriche e colori primari, è esemplificato dalle opere di Piet Mondrian?",
            "options": [
              "Cubismo",
              "Futurismo",
              "Neoplasticismo",
              "Realismo"
            ],
            "answer": "Neoplasticismo"
          },
          {
            "id": 89,
            "category": "Arte",
            "type": "boolean",
            "question": "L'arte rinascimentale ha avuto origine in Italia?",
            "answer": "Vero"
          },
          {
            "id": 90,
            "category": "Arte",
            "type": "text",
            "question": "Qual è il nome del famoso scultore che ha realizzato il David?",
            "answer": "Michelangelo"
          },
          {
            "id": 91,
            "category": "Arte",
            "type": "multiple",
            "question": "A quale corrente artistica è associato Salvador Dalí?",
            "options": [
              "Surrealismo",
              "Impressionismo",
              "Rinascimento",
              "Barocco"
            ],
            "answer": "Surrealismo"
          },
          {
            "id": 92,
            "category": "Arte",
            "type": "multiple",
            "question": "Chi ha dipinto 'L'urlo'?",
            "options": [
              "Edvard Munch",
              "Gustav Klimt",
              "Francis Bacon",
              "René Magritte"
            ],
            "answer": "Edvard Munch"
          },
          {
            "id": 93,
            "category": "Arte",
            "type": "text",
            "question": "Quale tecnica di incisione prevede l'uso di una lastra di rame e l'azione di un acido?",
            "answer": "Acquaforte"
          },
          {
            "id": 94,
            "category": "Arte",
            "type": "boolean",
            "question": "Il cubismo ha rivoluzionato la prospettiva tradizionale in pittura?",
            "answer": "Vero"
          },
          {
            "id": 95,
            "category": "Arte",
            "type": "text",
            "question": "Quale scultore francese è celebre per la statua 'Il Pensatore'?",
            "answer": "Auguste Rodin"
          },
          {
            "id": 96,
            "category": "Arte",
            "type": "boolean",
            "question": "Il Rinascimento fu un periodo di grande innovazione artistica in Europa?",
            "answer": "Vero"
          },
          {
            "id": 97,
            "category": "Arte",
            "type": "multiple",
            "question": "Quale movimento artistico è noto per l'uso di oggetti di consumo e immagini della cultura pop?",
            "options": [
              "Dadaismo",
              "Pop Art",
              "Futurismo",
              "Espressionismo"
            ],
            "answer": "Pop Art"
          },
          {
            "id": 98,
            "category": "Arte",
            "type": "boolean",
            "question": "L'arte moderna comprende opere create tra il 1860 e il 1970?",
            "answer": "Vero"
          },
          {
            "id": 99,
            "category": "Arte",
            "type": "text",
            "question": "Chi è stato il principale esponente del movimento artistico della Pop Art?",
            "answer": "Andy Warhol"
          },
          {
            "id": 100,
            "category": "Arte",
            "type": "text",
            "question": "Chi ha dipinto 'La Notte Stellata'?",
            "answer": "Vincent van Gogh"
          }, {
            "id": 101,
            "category": "Musica",
            "type": "multiple",
            "question": "Chi è l'autore della canzone 'Bohemian Rhapsody'?",
            "options": [
              "The Beatles",
              "Queen",
              "The Rolling Stones",
              "Led Zeppelin"
            ],
            "answer": "Queen"
          },
          {
            "id": 102,
            "category": "Musica",
            "type": "text",
            "question": "Chi è il 'Re del Pop'?",
            "answer": "Michael Jackson"
          },
          {
            "id": 103,
            "category": "Musica",
            "type": "multiple",
            "question": "Quale di questi strumenti è a corda?",
            "options": [
              "Pianoforte",
              "Violino",
              "Flauto",
              "Sassofono"
            ],
            "answer": "Violino"
          },
          {
            "id": 104,
            "category": "Musica",
            "type": "boolean",
            "question": "Ludwig van Beethoven era cieco?",
            "answer": "Falso"
          },
          {
            "id": 105,
            "category": "Musica",
            "type": "text",
            "question": "Quale band ha scritto l'album 'The Dark Side of the Moon'?",
            "answer": "Pink Floyd"
          },
          {
            "id": 106,
            "category": "Musica",
            "type": "multiple",
            "question": "Chi ha composto 'Le quattro stagioni'?",
            "options": [
              "Bach",
              "Mozart",
              "Vivaldi",
              "Beethoven"
            ],
            "answer": "Vivaldi"
          },
          {
            "id": 107,
            "category": "Musica",
            "type": "text",
            "question": "Chi è il cantante dei Rolling Stones?",
            "answer": "Mick Jagger"
          },
          {
            "id": 108,
            "category": "Musica",
            "type": "boolean",
            "question": "La chitarra è uno strumento a fiato?",
            "answer": "Falso"
          },
          {
            "id": 109,
            "category": "Musica",
            "type": "text",
            "question": "Qual è il nome del primo album dei Beatles?",
            "answer": "Please Please Me"
          },
          {
            "id": 110,
            "category": "Musica",
            "type": "multiple",
            "question": "Chi ha scritto l'opera 'La Traviata'?",
            "options": [
              "Puccini",
              "Verdi",
              "Rossini",
              "Donizetti"
            ],
            "answer": "Verdi"
          },
          {
            "id": 111,
            "category": "Musica",
            "type": "text",
            "question": "Chi è il fondatore dei Nirvana?",
            "answer": "Kurt Cobain"
          },
          {
            "id": 112,
            "category": "Musica",
            "type": "boolean",
            "question": "Elvis Presley è nato in Inghilterra?",
            "answer": "Falso"
          },
          {
            "id": 113,
            "category": "Musica",
            "type": "multiple",
            "question": "Quale di questi è un genere musicale?",
            "options": [
              "Cubismo",
              "Rinascimento",
              "Jazz",
              "Barocco"
            ],
            "answer": "Jazz"
          },
          {
            "id": 114,
            "category": "Musica",
            "type": "text",
            "question": "Chi ha scritto la canzone 'Imagine'?",
            "answer": "John Lennon"
          },
          {
            "id": 115,
            "category": "Musica",
            "type": "multiple",
            "question": "Quale cantante è noto per l'album 'Like a Virgin'?",
            "options": [
              "Madonna",
              "Britney Spears",
              "Lady Gaga",
              "Mariah Carey"
            ],
            "answer": "Madonna"
          },
          {
            "id": 116,
            "category": "Musica",
            "type": "boolean",
            "question": "Il pianoforte ha 88 tasti?",
            "answer": "Vero"
          },
          {
            "id": 117,
            "category": "Musica",
            "type": "text",
            "question": "Chi ha scritto l'inno nazionale italiano?",
            "answer": "Goffredo Mameli"
          },
          {
            "id": 118,
            "category": "Musica",
            "type": "multiple",
            "question": "Quale band è famosa per la canzone 'Stairway to Heaven'?",
            "options": [
              "Queen",
              "Pink Floyd",
              "Led Zeppelin",
              "The Doors"
            ],
            "answer": "Led Zeppelin"
          },
          {
            "id": 119,
            "category": "Musica",
            "type": "text",
            "question": "Chi ha scritto la colonna sonora di 'Il Padrino'?",
            "answer": "Nino Rota"
          },
          {
            "id": 120,
            "category": "Musica",
            "type": "boolean",
            "question": "Il clarinetto è uno strumento a fiato?",
            "answer": "Vero"
          },{
            "id": 121,
            "category": "Cinema",
            "type": "multiple",
            "question": "Chi ha diretto il film 'Inception'?",
            "options": [
              "Christopher Nolan",
              "Steven Spielberg",
              "Martin Scorsese",
              "Ridley Scott"
            ],
            "answer": "Christopher Nolan"
          },
          {
            "id": 122,
            "category": "Cinema",
            "type": "boolean",
            "question": "Il film 'Titanic' è uscito nel 1997?",
            "answer": "Vero"
          },
          {
            "id": 123,
            "category": "Cinema",
            "type": "text",
            "question": "In quale film Tom Hanks interpreta il personaggio di Forrest Gump?",
            "answer": "Forrest Gump"
          },
          {
            "id": 124,
            "category": "Cinema",
            "type": "multiple",
            "question": "Chi ha vinto l'Oscar come miglior attore nel 2020?",
            "options": [
              "Leonardo DiCaprio",
              "Joaquin Phoenix",
              "Brad Pitt",
              "Tom Hanks"
            ],
            "answer": "Joaquin Phoenix"
          },
          {
            "id": 125,
            "category": "Cinema",
            "type": "boolean",
            "question": "Il film 'The Matrix' è stato diretto da Joel ed Ethan Coen?",
            "answer": "Falso"
          },
          {
            "id": 126,
            "category": "Cinema",
            "type": "text",
            "question": "Chi ha interpretato il ruolo di Jack Dawson in 'Titanic'?",
            "answer": "Leonardo DiCaprio"
          },
          {
            "id": 127,
            "category": "Cinema",
            "type": "multiple",
            "question": "Quale film ha vinto l'Oscar come miglior film nel 2019?",
            "options": [
              "Green Book",
              "Roma",
              "The Favourite",
              "Bohemian Rhapsody"
            ],
            "answer": "Green Book"
          },
          {
            "id": 128,
            "category": "Cinema",
            "type": "boolean",
            "question": "Il film 'Gladiator' ha vinto 5 premi Oscar?",
            "answer": "Vero"
          },
          {
            "id": 129,
            "category": "Cinema",
            "type": "text",
            "question": "Chi ha scritto e diretto il film 'Pulp Fiction'?",
            "answer": "Quentin Tarantino"
          },
          {
            "id": 130,
            "category": "Cinema",
            "type": "multiple",
            "question": "In quale anno è uscito il film 'Avatar' di James Cameron?",
            "options": [
              "2005",
              "2008",
              "2010",
              "2009"
            ],
            "answer": "2009"
          },
          {
            "id": 131,
            "category": "Cinema",
            "type": "boolean",
            "question": "Nel film 'Il Signore degli Anelli', Gandalf è interpretato da Ian McKellen?",
            "answer": "Vero"
          },
          {
            "id": 132,
            "category": "Cinema",
            "type": "text",
            "question": "Qual è il nome del personaggio principale nel film 'The Godfather'?",
            "answer": "Vito Corleone"
          },
          {
            "id": 133,
            "category": "Cinema",
            "type": "multiple",
            "question": "Chi ha interpretato il ruolo di Joker nel film 'The Dark Knight'?",
            "options": [
              "Jared Leto",
              "Heath Ledger",
              "Jack Nicholson",
              "Tom Hardy"
            ],
            "answer": "Heath Ledger"
          },
          {
            "id": 134,
            "category": "Cinema",
            "type": "boolean",
            "question": "Il film 'La La Land' ha vinto sei premi Oscar?",
            "answer": "Vero"
          },
          {
            "id": 135,
            "category": "Cinema",
            "type": "text",
            "question": "Chi ha diretto il film 'Schindler's List'?",
            "answer": "Steven Spielberg"
          },
          {
            "id": 136,
            "category": "Cinema",
            "type": "multiple",
            "question": "Chi ha vinto il premio Oscar come miglior attrice nel 2019?",
            "options": [
              "Nicole Kidman",
              "Charlize Theron",
              "Renée Zellweger",
              "Scarlett Johansson"
            ],
            "answer": "Renée Zellweger"
          },
          {
            "id": 137,
            "category": "Cinema",
            "type": "boolean",
            "question": "Il film 'Jurassic Park' è basato su un libro di Michael Crichton?",
            "answer": "Vero"
          },
          {
            "id": 138,
            "category": "Cinema",
            "type": "text",
            "question": "Qual è il nome del regista del film 'Inglourious Basterds'?",
            "answer": "Quentin Tarantino"
          },
          {
            "id": 139,
            "category": "Cinema",
            "type": "multiple",
            "question": "In quale film recita il personaggio di Darth Vader?",
            "options": [
              "Star Wars: A New Hope",
              "The Empire Strikes Back",
              "Return of the Jedi",
              "The Phantom Menace"
            ],
            "answer": "Star Wars: A New Hope"
          },
          {
            "id": 140,
            "category": "Cinema",
            "type": "boolean",
            "question": "Il film 'Forrest Gump' è basato su un libro di Winston Groom?",
            "answer": "Vero"
          },
          {
            "id": 141,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto 'Il Grande Gatsby'?",
            "options": [
              "Ernest Hemingway",
              "F. Scott Fitzgerald",
              "William Faulkner",
              "John Steinbeck"
            ],
            "answer": "F. Scott Fitzgerald"
          },
          {
            "id": 142,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Don Chisciotte' è stato scritto da Miguel de Cervantes?",
            "answer": "Vero"
          },
          {
            "id": 143,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi è l'autore di 'I Promessi Sposi'?",
            "answer": "Alessandro Manzoni"
          },
          {
            "id": 144,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto '1984'?",
            "options": [
              "Aldous Huxley",
              "George Orwell",
              "Ray Bradbury",
              "J.R.R. Tolkien"
            ],
            "answer": "George Orwell"
          },
          {
            "id": 145,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Orgoglio e Pregiudizio' è stato scritto da Charlotte Brontë?",
            "answer": "Falso"
          },
          {
            "id": 146,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi ha scritto 'Il Processo'?",
            "answer": "Franz Kafka"
          },
          {
            "id": 147,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto 'Moby Dick'?",
            "options": [
              "Herman Melville",
              "Mark Twain",
              "H.G. Wells",
              "Jack London"
            ],
            "answer": "Herman Melville"
          },
          {
            "id": 148,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Il giovane Holden' è stato scritto da J.D. Salinger?",
            "answer": "Vero"
          },
          {
            "id": 149,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi ha scritto 'La Metamorfosi'?",
            "answer": "Franz Kafka"
          },
          {
            "id": 150,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto 'Le affinità elettive'?",
            "options": [
              "Hermann Hesse",
              "Johann Wolfgang von Goethe",
              "Friedrich Nietzsche",
              "Thomas Mann"
            ],
            "answer": "Johann Wolfgang von Goethe"
          },
          {
            "id": 151,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Il Signore degli Anelli' è stato scritto da C.S. Lewis?",
            "answer": "Falso"
          },
          {
            "id": 152,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi ha scritto 'Frankenstein'?",
            "answer": "Mary Shelley"
          },
          {
            "id": 153,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto 'Anna Karenina'?",
            "options": [
              "Fëdor Dostoevskij",
              "Lev Tolstoj",
              "Anton Čechov",
              "Nikolaj Gogol"
            ],
            "answer": "Lev Tolstoj"
          },
          {
            "id": 154,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Guerra e Pace' è stato scritto da Lev Tolstoj?",
            "answer": "Vero"
          },
          {
            "id": 155,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi ha scritto 'Il Capitale'?",
            "answer": "Karl Marx"
          },
          {
            "id": 156,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto 'Cime tempestose'?",
            "options": [
              "Jane Austen",
              "Emily Brontë",
              "Charlotte Brontë",
              "Mary Shelley"
            ],
            "answer": "Emily Brontë"
          },
          {
            "id": 157,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Il Conte di Montecristo' è stato scritto da Alexandre Dumas?",
            "answer": "Vero"
          },
          {
            "id": 158,
            "category": "Letteratura",
            "type": "text",
            "question": "Chi ha scritto 'Il Piccolo Principe'?",
            "answer": "Antoine de Saint-Exupéry"
          },
          {
            "id": 159,
            "category": "Letteratura",
            "type": "multiple",
            "question": "Chi ha scritto 'Il Maestro e Margherita'?",
            "options": [
              "Boris Pasternak",
              "Mikhail Bulgakov",
              "Aleksandr Solzhenicyn",
              "Ivan Turgenev"
            ],
            "answer": "Mikhail Bulgakov"
          },
          {
            "id": 160,
            "category": "Letteratura",
            "type": "boolean",
            "question": "'Il Gattopardo' è stato scritto da Giuseppe Tomasi di Lampedusa?",
            "answer": "Vero"
          },
          {
            "id": 161,
            "category": "Scienza",
            "type": "boolean",
            "question": "Marte è conosciuto come il Pianeta Rosso?",
            "answer": "Vero"
        },
        {
            "id": 162,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è la formula chimica dell'acqua?",
            "answer": "H2O"
        },
        {
            "id": 163,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale parte del corpo umano produce l'insulina?",
            "options": [
                "Fegato",
                "Cuore",
                "Pancreas",
                "Reni"
            ],
            "answer": "Pancreas"
        },
        {
            "id": 164,
            "category": "Scienza",
            "type": "text",
            "question": "Chi è noto per aver inventato il microscopio?",
            "answer": "Zacharias Janssen"
        },
        {
            "id": 165,
            "category": "Scienza",
            "type": "boolean",
            "question": "La teoria dell'evoluzione di Charles Darwin riguarda l'adattamento delle specie?",
            "answer": "Vero"
        },
        {
            "id": 166,
            "category": "Scienza",
            "type": "multiple",
            "question": "Qual è l'organo responsabile per il pompaggio del sangue nel corpo umano?",
            "options": [
                "Fegato",
                "Cuore",
                "Polmone",
                "Rene"
            ],
            "answer": "Cuore"
        },
        {
            "id": 167,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è la scala che misura la durezza dei minerali?",
            "answer": "Scala Mohs"
        },
        {
            "id": 168,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale pianeta del Sistema Solare ha un sistema di anelli visibili?",
            "options": [
                "Giove",
                "Saturno",
                "Urano",
                "Nettuno"
            ],
            "answer": "Saturno"
        },
        {
            "id": 169,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è il gas serra più abbondante nell'atmosfera terrestre prodotto dalle attività umane?",
            "answer": "Anidride carbonica"
        },
        {
            "id": 170,
            "category": "Scienza",
            "type": "boolean",
            "question": "Venere è il pianeta più caldo del Sistema Solare?",
            "answer": "Vero"
        },
        {
            "id": 171,
            "category": "Scienza",
            "type": "text",
            "question": "Quale scienziato ha proposto la legge della gravitazione universale?",
            "answer": "Isaac Newton"
        },
        {
            "id": 172,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale organo dell'uomo filtra il sangue rimuovendo le tossine?",
            "options": [
                "Cuore",
                "Fegato",
                "Rene",
                "Polmone"
            ],
            "answer": "Rene"
        },
        {
            "id": 173,
            "category": "Scienza",
            "type": "boolean",
            "question": "Le eclissi solari si verificano ogni giorno?",
            "answer": "Falso"
        },
        {
            "id": 174,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è il nome dello strato dell'atmosfera in cui si trova la maggior parte dell'ozono?",
            "answer": "Stratosfera"
        },
        {
            "id": 175,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale processo metabolico produce energia nelle cellule in assenza di ossigeno?",
            "options": [
                "Fotosintesi",
                "Glicolisi",
                "Respirazione aerobica",
                "Ossidazione"
            ],
            "answer": "Glicolisi"
        },
        {
            "id": 176,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è la particella subatomica priva di carica elettrica presente nel nucleo dell'atomo?",
            "answer": "Neutrone"
        },
        {
            "id": 177,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale dei seguenti è un esempio di erbivoro?",
            "options": [
                "Leone",
                "Tigre",
                "Mucca",
                "Orso"
            ],
            "answer": "Mucca"
        },
        {
            "id": 178,
            "category": "Scienza",
            "type": "boolean",
            "question": "Il ferro è un metallo che si ossida formando la ruggine?",
            "answer": "Vero"
        },
        {
            "id": 179,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è il principale componente dell'atmosfera terrestre?",
            "answer": "Azoto"
        },
        {
            "id": 180,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale tipo di energia è sfruttata nelle centrali idroelettriche?",
            "options": [
                "Energia solare",
                "Energia cinetica dell'acqua",
                "Energia nucleare",
                "Energia chimica"
            ],
            "answer": "Energia cinetica dell'acqua"
        },
        {
            "id": 181,
            "category": "Scienza",
            "type": "boolean",
            "question": "La luce viaggia più velocemente dell'audio?",
            "answer": "Vero"
        },
        {
            "id": 182,
            "category": "Scienza",
            "type": "text",
            "question": "Che termine indica la trasformazione delle rocce a seguito di variazioni di temperatura e pressione?",
            "answer": "Metamorfismo"
        },
        {
            "id": 183,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale dei seguenti elementi chimici è un metallo alcalino?",
            "options": [
                "Sodio",
                "Calcio",
                "Ferro",
                "Argento"
            ],
            "answer": "Sodio"
        },
        {
            "id": 184,
            "category": "Scienza",
            "type": "boolean",
            "question": "La fotosintesi produce ossigeno come sottoprodotto?",
            "answer": "Vero"
        },
        {
            "id": 185,
            "category": "Scienza",
            "type": "text",
            "question": "Qual è il nome del dispositivo inventato per misurare la pressione atmosferica?",
            "answer": "Barometro"
        },
        {
            "id": 186,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale delle seguenti scoperte è attribuita a Marie Curie?",
            "options": [
                "Scoperta del DNA",
                "Teoria dell'evoluzione",
                "Scoperta della radioattività",
                "Leggi della termodinamica"
            ],
            "answer": "Scoperta della radioattività"
        },
        {
            "id": 187,
            "category": "Scienza",
            "type": "boolean",
            "question": "Le piante producono clorofilla per assorbire la luce solare?",
            "answer": "Vero"
        },
        {
            "id": 188,
            "category": "Scienza",
            "type": "boolean",
            "question": "la principale differenza tra un virus e un batterio è che i virus necessitano di una cellula ospite per riprodursi, mentre i batteri possono riprodursi autonomamente.",
            "answer": "Vero"
        },
        {
            "id": 189,
            "category": "Scienza",
            "type": "multiple",
            "question": "Quale dei seguenti processi è usato per separare le sostanze in una miscela?",
            "options": [
                "Cristallizzazione",
                "Distillazione",
                "Elettrolisi",
                "Polimerizzazione"
            ],
            "answer": "Distillazione"
        },
        {
            "id": 190,
            "category": "Scienza",
            "type": "boolean",
            "question": "L'energia solare deriva da reazioni nucleari all'interno del Sole?",
            "answer": "Vero"
        },
        {
          "id": 191,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale club ha vinto la Champions League per 3 volte consecutive?",
          "options": [
              "Real Madrid",
              "Bayern Monaco",
              "AC Milan",
              "Barcelona"
          ],
          "answer": "Real Madrid"
      },
      {
          "id": 192,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha vinto il premio di MVP nelle finali NBA del 2020?",
          "options": [
              "LeBron James",
              "Giannis Antetokounmpo",
              "Stephen Curry",
              "Kevin Durant"
          ],
          "answer": "LeBron James"
      },
      {
          "id": 193,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale paese ha ospitato i Campionati del Mondo FIFA nel 2018?",
          "options": [
              "Brasile",
              "Russia",
              "Germania",
              "Francia"
          ],
          "answer": "Russia"
      },
      {
          "id": 194,
          "category": "Sport",
          "type": "multiple",
          "question": "In quale anno si sono svolte le prime Olimpiadi moderne?",
          "options": [
              "1892",
              "1896",
              "1900",
              "1912"
          ],
          "answer": "1896"
      },
      {
          "id": 195,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha vinto il titolo di capocannoniere nella UEFA Champions League 2020/2021?",
          "options": [
              "Cristiano Ronaldo",
              "Robert Lewandowski",
              "Erling Haaland",
              "Kylian Mbappé"
          ],
          "answer": "Robert Lewandowski"
      },
      {
          "id": 196,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport utilizza il termine 'scrum'?",
          "options": [
              "Calcio",
              "Rugby",
              "Cricket",
              "Pallavolo"
          ],
          "answer": "Rugby"
      },
      {
          "id": 197,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi è noto come il 'Re del Cricket'?",
          "options": [
              "Sachin Tendulkar",
              "Brian Lara",
              "Don Bradman",
              "Kapil Dev"
          ],
          "answer": "Sachin Tendulkar"
      },
      {
          "id": 198,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale tennista ha vinto il maggior numero di titoli del Grande Slam?",
          "options": [
              "Roger Federer",
              "Rafael Nadal",
              "Novak Djokovic",
              "Pete Sampras"
          ],
          "answer": "Novak Djokovic"
      },
      {
          "id": 199,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport tradizionale britannico si gioca con una palla ovale e prevede il 'kick'?",
          "options": [
              "Football",
              "Rugby",
              "Cricket",
              "Pallamano"
          ],
          "answer": "Rugby"
      },
      {
          "id": 200,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha vinto il titolo mondiale di Formula 1 nel 2021?",
          "options": [
              "Lewis Hamilton",
              "Max Verstappen",
              "Valtteri Bottas",
              "Charles Leclerc"
          ],
          "answer": "Max Verstappen"
      },
      {
          "id": 201,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale squadra di NFL ha vinto il Super Bowl nel 2019?",
          "options": [
              "New England Patriots",
              "Kansas City Chiefs",
              "San Francisco 49ers",
              "Tampa Bay Buccaneers"
          ],
          "answer": "Tampa Bay Buccaneers"
      },
      {
          "id": 202,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale atleta ha il record per il maggior numero di medaglie olimpiche nella storia?",
          "options": [
              "Usain Bolt",
              "Michael Phelps",
              "Simone Biles",
              "Carl Lewis"
          ],
          "answer": "Michael Phelps"
      },
      {
          "id": 203,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport è noto per il termine 'love' per indicare uno score di zero?",
          "options": [
              "Calcio",
              "Pallavolo",
              "Tennis",
              "Badminton"
          ],
          "answer": "Tennis"
      },
      {
          "id": 204,
          "category": "Sport",
          "type": "multiple",
          "question": "In quale sport si utilizza un disco chiamato 'puck'?",
          "options": [
              "Hockey su ghiaccio",
              "Pallamano",
              "Basket",
              "Baseball"
          ],
          "answer": "Hockey su ghiaccio"
      },
      {
          "id": 205,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale nazione ha vinto il maggior numero di medaglie alle Olimpiadi invernali?",
          "options": [
              "Norvegia",
              "USA",
              "Russia",
              "Germania"
          ],
          "answer": "Norvegia"
      },
      {
          "id": 206,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi è considerato il più grande giocatore di basket di tutti i tempi?",
          "options": [
              "LeBron James",
              "Michael Jordan",
              "Kobe Bryant",
              "Magic Johnson"
          ],
          "answer": "Michael Jordan"
      },
      {
          "id": 207,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport consiste in gare di velocità in pista su motociclette?",
          "options": [
              "MotoGP",
              "NASCAR",
              "Rally",
              "Formula 1"
          ],
          "answer": "MotoGP"
      },
      {
          "id": 208,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale squadra ha vinto il campionato MLB nel 2020?",
          "options": [
              "Los Angeles Dodgers",
              "Chicago Cubs",
              "New York Yankees",
              "San Diego Padres"
          ],
          "answer": "Los Angeles Dodgers"
      },
      {
          "id": 209,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport, noto anche come tennis tavolo, si gioca con racchette piccole e una pallina leggera?",
          "options": [
              "Badminton",
              "Ping pong",
              "Squash",
              "Racquetball"
          ],
          "answer": "Ping pong"
      },
      {
          "id": 210,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale squadra di calcio ha vinto la Coppa Libertadores nel 2020?",
          "options": [
              "Palmeiras",
              "Boca Juniors",
              "River Plate",
              "Flamengo"
          ],
          "answer": "Palmeiras"
      },
      {
          "id": 211,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi è il pilota con il maggior numero di vittorie in Formula 1?",
          "options": [
              "Michael Schumacher",
              "Lewis Hamilton",
              "Sebastian Vettel",
              "Ayrton Senna"
          ],
          "answer": "Lewis Hamilton"
      },
      {
          "id": 212,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport utilizza l'asta come attrezzo principale?",
          "options": [
              "Corsa",
              "Pallacanestro",
              "Salto con l'asta",
              "Nuoto"
          ],
          "answer": "Salto con l'asta"
      },
      {
          "id": 213,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi ha stabilito il record mondiale dei 100 metri piani?",
          "options": [
              "Usain Bolt",
              "Tyson Gay",
              "Yohan Blake",
              "Justin Gatlin"
          ],
          "answer": "Usain Bolt"
      },
      {
          "id": 214,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport combina elementi del calcio e del basket ed è giocato con le mani?",
          "options": [
              "Waterpolo",
              "Rugby",
              "Pallamano",
              "Baseball"
          ],
          "answer": "Pallamano"
      },
      {
          "id": 215,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale pilota automobilistico è noto per le sue vittorie a Le Mans con Porsche?",
          "options": [
              "Jacky Ickx",
              "Derek Bell",
              "Tom Kristensen",
              "Allan McNish"
          ],
          "answer": "Tom Kristensen"
      },
      {
          "id": 216,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale evento sportivo si tiene ogni quattro anni e coinvolge atleti da tutto il mondo?",
          "options": [
              "Campionati del Mondo",
              "Olimpiadi",
              "Eurolega",
              "Coppa del Mondo FIFA"
          ],
          "answer": "Olimpiadi"
      },
      {
          "id": 217,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport da tavolo si gioca con una stecca e palle numerate?",
          "options": [
              "Biliardo",
              "Ping pong",
              "Darts",
              "Air hockey"
          ],
          "answer": "Biliardo"
      },
      {
          "id": 218,
          "category": "Sport",
          "type": "multiple",
          "question": "Chi è il miglior maratoneta di tutti i tempi, vincitore di numerosi tornei internazionali?",
          "options": [
              "Eliud Kipchoge",
              "Haile Gebrselassie",
              "Mo Farah",
              "Kenenisa Bekele"
          ],
          "answer": "Eliud Kipchoge"
      },
      {
          "id": 219,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale sport richiede l'utilizzo di una racchetta e una palla piuma?",
          "options": [
              "Squash",
              "Badminton",
              "Tennis",
              "Ping pong"
          ],
          "answer": "Badminton"
      },
      {
          "id": 220,
          "category": "Sport",
          "type": "multiple",
          "question": "Quale regione degli Stati Uniti è storicamente nota per aver prodotto numerosi giocatori NBA?",
          "options": [
              "Midwest",
              "Sud",
              "Nord Est",
              "West Coast"
          ],
          "answer": "Sud"
      },{
        "id": 221,
        "category": "Storia",
        "type": "boolean",
        "question": "La Guerra dei Trent'anni si concluse nel 1648?",
        "answer": "Vero"
    },
    {
        "id": 222,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il leader della Rivoluzione d'Ottobre in Russia?",
        "options": [
            "Lenin",
            "Stalin",
            "Trotsky",
            "Kerenski"
        ],
        "answer": "Lenin"
    },
    {
        "id": 223,
        "category": "Storia",
        "type": "boolean",
        "question": "La Guerra Fredda vide l'utilizzo diretto di armi nucleari sul campo di battaglia?",
        "answer": "Falso"
    },
    {
        "id": 224,
        "category": "Storia",
        "type": "multiple",
        "question": "In quale anno cadde il Muro di Berlino?",
        "options": [
            "1987",
            "1989",
            "1991",
            "1993"
        ],
        "answer": "1989"
    },
    {
        "id": 225,
        "category": "Storia",
        "type": "boolean",
        "question": "L'Impero Britannico è stato uno dei più vasti della storia?",
        "answer": "Vero"
    },
    {
        "id": 226,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il condottiero cartaginese durante la Seconda Guerra Punica?",
        "options": [
            "Annibale",
            "Asdrubale",
            "Amilcare Barca",
            "Hannibal Barca"
        ],
        "answer": "Annibale"
    },
    {
        "id": 227,
        "category": "Storia",
        "type": "boolean",
        "question": "La dinastia Ming regnò in Cina per più di 200 anni?",
        "answer": "Vero"
    },
    {
        "id": 228,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale battaglia è considerata la svolta della Seconda Guerra Mondiale in Europa?",
        "options": [
            "Battle of Britain",
            "Stalingrado",
            "Normandia",
            "Battaglia delle Ardenne"
        ],
        "answer": "Stalingrado"
    },
    {
        "id": 229,
        "category": "Storia",
        "type": "boolean",
        "question": "La Repubblica di Weimar fu il governo tedesco prima dell'ascesa del Nazismo?",
        "answer": "Vero"
    },
    {
        "id": 230,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il fondatore dell'Impero Persiano Achemenide?",
        "options": [
            "Ciro il Grande",
            "Dario I",
            "Serse",
            "Artaserse"
        ],
        "answer": "Ciro il Grande"
    },
    {
        "id": 231,
        "category": "Storia",
        "type": "boolean",
        "question": "L'età del bronzo è preceduta dall'età della pietra?",
        "answer": "Vero"
    },
    {
        "id": 232,
        "category": "Storia",
        "type": "multiple",
        "question": "In quale anno fu firmata la Dichiarazione d'Indipendenza degli Stati Uniti?",
        "options": [
            "1776",
            "1783",
            "1801",
            "1812"
        ],
        "answer": "1776"
    },
    {
        "id": 233,
        "category": "Storia",
        "type": "boolean",
        "question": "Giovanna d'Arco fu bruciata sul rogo nel 1431?",
        "answer": "Vero"
    },
    {
        "id": 234,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il sovrano che commissionò la costruzione del Taj Mahal?",
        "options": [
            "Akbar",
            "Shah Jahan",
            "Aurangzeb",
            "Jahangir"
        ],
        "answer": "Shah Jahan"
    },
    {
        "id": 235,
        "category": "Storia",
        "type": "boolean",
        "question": "La Rivoluzione Industriale ebbe origine in Inghilterra?",
        "answer": "Vero"
    },
    {
        "id": 236,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale trattato pose fine alla Prima Guerra Mondiale?",
        "options": [
            "Trattato di Tordesillas",
            "Trattato di Versailles",
            "Trattato di Utrecht",
            "Trattato di Westfalia"
        ],
        "answer": "Trattato di Versailles"
    },
    {
        "id": 237,
        "category": "Storia",
        "type": "boolean",
        "question": "La Guerra dei Cent'Anni durò esattamente 100 anni?",
        "answer": "Falso"
    },
    {
        "id": 238,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il principale artefice della Riforma Protestante?",
        "options": [
            "Martino Lutero",
            "Giovanni Calvino",
            "Enrico VIII",
            "Ulrico Zwingli"
        ],
        "answer": "Martino Lutero"
    },
    {
        "id": 239,
        "category": "Storia",
        "type": "boolean",
        "question": "L'età moderna iniziò ufficialmente nel 1500?",
        "answer": "Falso"
    },
    {
        "id": 240,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale città fu la capitale dell'Impero Bizantino?",
        "options": [
            "Roma",
            "Costantinopoli",
            "Atene",
            "Smirne"
        ],
        "answer": "Costantinopoli"
    },
    {
        "id": 241,
        "category": "Storia",
        "type": "boolean",
        "question": "La Rivoluzione Russa del 1917 portò alla formazione dell'URSS?",
        "answer": "Vero"
    },
    {
        "id": 242,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu l'ultimo zar della Russia?",
        "options": [
            "Nicola II",
            "Alessandro III",
            "Federico",
            "Michele I"
        ],
        "answer": "Nicola II"
    },
    {
        "id": 243,
        "category": "Storia",
        "type": "boolean",
        "question": "La battaglia di Waterloo vide la sconfitta di Napoleone Bonaparte?",
        "answer": "Vero"
    },
    {
        "id": 244,
        "category": "Storia",
        "type": "multiple",
        "question": "In quale anno fu costruita la Muraglia di Berlino per separare la città?",
        "options": [
            "1961",
            "1955",
            "1949",
            "1971"
        ],
        "answer": "1961"
    },
    {
        "id": 245,
        "category": "Storia",
        "type": "boolean",
        "question": "Il Rinascimento ebbe origine in Italia?",
        "answer": "Vero"
    },
    {
        "id": 246,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi è considerato il padre della Storia?",
        "options": [
            "Eraclito",
            "Platone",
            "Erodoto",
            "Sofocle"
        ],
        "answer": "Erodoto"
    },
    {
        "id": 247,
        "category": "Storia",
        "type": "boolean",
        "question": "L'Impero Ottomano crollò dopo la Prima Guerra Mondiale?",
        "answer": "Vero"
    },
    {
        "id": 248,
        "category": "Storia",
        "type": "multiple",
        "question": "Quale evento è considerato l'inizio delle incursioni vichinghe in Europa?",
        "options": [
            "L'assalto a Lindisfarne",
            "La battaglia di Stamford Bridge",
            "La scoperta dell'Islanda",
            "La conquista della Normandia"
        ],
        "answer": "L'assalto a Lindisfarne"
    },
    {
        "id": 249,
        "category": "Storia",
        "type": "boolean",
        "question": "La Guerra del Vietnam si concluse nel 1975?",
        "answer": "Vero"
    },
    {
        "id": 250,
        "category": "Storia",
        "type": "multiple",
        "question": "Chi fu il principale riformatore religioso del XVI secolo in Europa centrale?",
        "options": [
            "Martin Lutero",
            "Giovanni Calvino",
            "Ulrico Zwingli",
            "Enrico VIII"
        ],
        "answer": "Martin Lutero"
    },
    {
      "id": 251,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è la capitale della Svizzera?",
      "options": ["Zurigo", "Berna", "Ginevra", "Basilea"],
      "answer": "Berna"
  },
  {
      "id": 252,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il fiume Nilo è più lungo del fiume Mississippi?",
      "answer": "Vero"
  },
  {
      "id": 253,
      "category": "Geografia",
      "type": "multiple",
      "question": "Quale dei seguenti paesi non fa parte del Regno Unito?",
      "options": ["Inghilterra", "Scozia", "Galles", "Islanda"],
      "answer": "Islanda"
  },
  {
      "id": 254,
      "category": "Geografia",
      "type": "boolean",
      "question": "L'Islanda è situata nell'Oceano Atlantico?",
      "answer": "Vero"
  },
  {
      "id": 255,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è il più grande oceano del mondo?",
      "options": ["Oceano Atlantico", "Oceano Pacifico", "Oceano Indiano", "Oceano Artico"],
      "answer": "Oceano Pacifico"
  },
  {
      "id": 256,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il fiume Danubio attraversa più di dieci paesi?",
      "answer": "Vero"
  },
  {
      "id": 257,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è la capitale dell'Australia?",
      "options": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      "answer": "Canberra"
  },
  {
      "id": 258,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il deserto del Sahara copre la maggior parte del Nord Africa?",
      "answer": "Vero"
  },
  {
      "id": 259,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è il fiume più lungo d'Italia?",
      "options": ["Po", "Adige", "Tevere", "Arno"],
      "answer": "Po"
  },
  {
      "id": 260,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il Mar Mediterraneo si collega all'Oceano Atlantico?",
      "answer": "Vero"
  },
  {
      "id": 261,
      "category": "Geografia",
      "type": "multiple",
      "question": "Quale paese è famoso per i suoi fiordi?",
      "options": ["Svezia", "Norvegia", "Finlandia", "Islanda"],
      "answer": "Norvegia"
  },
  {
      "id": 262,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il monte Kilimangiaro si trova in Asia?",
      "answer": "Falso"
  },
  {
      "id": 263,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è la capitale della Nuova Zelanda?",
      "options": ["Auckland", "Wellington", "Christchurch", "Hamilton"],
      "answer": "Wellington"
  },
  {
      "id": 264,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il fiume Mekong attraversa il Vietnam?",
      "answer": "Vero"
  },
  {
      "id": 265,
      "category": "Geografia",
      "type": "multiple",
      "question": "In quale continente si trova il deserto del Kalahari?",
      "options": ["Africa", "Asia", "America", "Australia"],
      "answer": "Africa"
  },
  {
      "id": 266,
      "category": "Geografia",
      "type": "boolean",
      "question": "La città di Dubai si trova negli Emirati Arabi Uniti?",
      "answer": "Vero"
  },
  {
      "id": 267,
      "category": "Geografia",
      "type": "multiple",
      "question": "Quale dei seguenti non è uno stato dell'America Latina?",
      "options": ["Colombia", "Argentina", "Portogallo", "Cile"],
      "answer": "Portogallo"
  },
  {
      "id": 268,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il Monte Everest si trova al confine tra Nepal e Cina?",
      "answer": "Vero"
  },
  {
      "id": 269,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è la capitale della Germania?",
      "options": ["Berlino", "Monaco", "Francoforte", "Amburgo"],
      "answer": "Berlino"
  },
  {
      "id": 270,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il fiume Reno scorre esclusivamente in Germania?",
      "answer": "Falso"
  },
  {
      "id": 271,
      "category": "Geografia",
      "type": "multiple",
      "question": "Quale mare bagna la costa della Spagna?",
      "options": ["Mare Adriatico", "Mare Ionio", "Mare Mediterraneo", "Mare Nero"],
      "answer": "Mare Mediterraneo"
  },
  {
      "id": 272,
      "category": "Geografia",
      "type": "boolean",
      "question": "Lo stretto dei Dardanelli separa l'Europa dall'Asia?",
      "answer": "Vero"
  },
  {
      "id": 273,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è la capitale del Brasile?",
      "options": ["Rio de Janeiro", "Brasilia", "Sao Paulo", "Belo Horizonte"],
      "answer": "Brasilia"
  },
  {
      "id": 274,
      "category": "Geografia",
      "type": "boolean",
      "question": "Il Parco Nazionale di Yellowstone si trova negli Stati Uniti?",
      "answer": "Vero"
  },
  {
      "id": 275,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è il punto più basso della Terra?",
      "options": ["Fossa delle Marianne", "Lago Eyre", "Depressione di Qattara", "Fossa dell'Atacama"],
      "answer": "Fossa delle Marianne"
  },
  {
      "id": 276,
      "category": "Geografia",
      "type": "boolean",
      "question": "L'Isola di Madagascar si trova nell'Oceano Indiano?",
      "answer": "Vero"
  },
  {
      "id": 277,
      "category": "Geografia",
      "type": "multiple",
      "question": "Quale dei seguenti è uno stato insulare?",
      "options": ["Portogallo", "Giappone", "Svizzera", "Bulgaria"],
      "answer": "Giappone"
  },
  {
      "id": 278,
      "category": "Geografia",
      "type": "boolean",
      "question": "La Scandinavia comprende Danimarca, Svezia e Norvegia?",
      "answer": "Vero"
  },
  {
      "id": 279,
      "category": "Geografia",
      "type": "multiple",
      "question": "Qual è la principale catena montuosa in Sud America?",
      "options": ["Appennini", "Ande", "Alpi", "Monti Urali"],
      "answer": "Ande"
  },
  {
      "id": 280,
      "category": "Geografia",
      "type": "boolean",
      "question": "L'Africa è il secondo continente per estensione geografica al mondo?",
      "answer": "Vero"
  },  {
    "id": 281,
    "category": "Arte",
    "type": "text",
    "question": "Quale pittore barocco è noto per opere come 'La Vocazione di San Matteo'?",
    "answer": "Caravaggio"
},
{
    "id": 282,
    "category": "Arte",
    "type": "multiple",
    "question": "A quale movimento artistico apparteneva Claude Monet?",
    "options": [
        "Impressionismo",
        "Espressionismo",
        "Cubismo",
        "Surrealismo"
    ],
    "answer": "Impressionismo"
},
{
    "id": 283,
    "category": "Arte",
    "type": "boolean",
    "question": "Il metodo dell'encausto utilizza cera e pigmenti per realizzare opere d'arte?",
    "answer": "Vero"
},
{
    "id": 284,
    "category": "Arte",
    "type": "text",
    "question": "Chi ha scolpito il celebre 'Discobolo' nell'antica Grecia?",
    "answer": "Mirone"
},
{
    "id": 285,
    "category": "Arte",
    "type": "multiple",
    "question": "A quale corrente artistica è associato Pablo Picasso?",
    "options": [
        "Cubismo",
        "Futurismo",
        "Impressionismo",
        "Rinascimento"
    ],
    "answer": "Cubismo"
},
{
    "id": 286,
    "category": "Arte",
    "type": "boolean",
    "question": "Il surrealismo cerca di rappresentare il subconscio attraverso immagini oniriche?",
    "answer": "Vero"
},
{
    "id": 287,
    "category": "Arte",
    "type": "text",
    "question": "Chi è l'architetto famoso per la realizzazione della Sagrada Familia a Barcellona?",
    "answer": "Antoni Gaudí"
},
{
    "id": 288,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale tecnica pittorica consiste nell'applicazione di colori su una base di calce fresca?",
    "options": [
        "Affresco",
        "Tempera",
        "Olio",
        "Acquerello"
    ],
    "answer": "Affresco"
},
{
    "id": 289,
    "category": "Arte",
    "type": "boolean",
    "question": "Il neopop è una corrente artistica nata negli anni '80?",
    "answer": "Vero"
},
{
    "id": 290,
    "category": "Arte",
    "type": "text",
    "question": "Chi è stato uno dei principali promotori del movimento Dada?",
    "answer": "Tristan Tzara"
},
{
    "id": 291,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale forma d'arte prevede l'assemblaggio di materiali e oggetti per creare installazioni visive?",
    "options": [
        "Performance art",
        "Installazione",
        "Scultura",
        "Pittura"
    ],
    "answer": "Installazione"
},
{
    "id": 292,
    "category": "Arte",
    "type": "boolean",
    "question": "La tecnica del collage prevede l'assemblaggio di frammenti di carta, tessuti e altri materiali?",
    "answer": "Vero"
},
{
    "id": 293,
    "category": "Arte",
    "type": "text",
    "question": "Chi ha dipinto 'La persistenza della memoria'?",
    "answer": "Salvador Dalí"
},
{
    "id": 294,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale movimento artistico si caratterizza per l'uso di colori vivaci e linee marcate, come nelle opere di Roy Lichtenstein?",
    "options": [
        "Pop Art",
        "Cubismo",
        "Futurismo",
        "Espressionismo"
    ],
    "answer": "Pop Art"
},
{
    "id": 295,
    "category": "Arte",
    "type": "boolean",
    "question": "Il minimalismo si basa sull'eliminazione degli elementi decorativi superflui?",
    "answer": "Vero"
},
{
    "id": 296,
    "category": "Arte",
    "type": "text",
    "question": "Chi ha dipinto 'Impression, soleil levant'?",
    "answer": "Claude Monet"
},
{
    "id": 297,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale corrente artistica si concentra sull'esplorazione di forme astratte senza rappresentare oggetti reali?",
    "options": [
        "Astrattismo",
        "Realismo",
        "Barocco",
        "Rinascimento"
    ],
    "answer": "Astrattismo"
},
{
    "id": 298,
    "category": "Arte",
    "type": "boolean",
    "question": "La tecnica del frottage fu resa celebre da Max Ernst?",
    "answer": "Vero"
},
{
    "id": 299,
    "category": "Arte",
    "type": "text",
    "question": "Chi ha creato la serie di opere 'Campbell's Soup Cans'?",
    "answer": "Andy Warhol"
},
{
    "id": 300,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale movimento artistico, nato in seguito alla Prima Guerra Mondiale, rompeva con le convenzioni tradizionali?",
    "options": [
        "Futurismo",
        "Surrealismo",
        "Dadaismo",
        "Espressionismo"
    ],
    "answer": "Dadaismo"
},
{
    "id": 301,
    "category": "Arte",
    "type": "text",
    "question": "Chi ha scolpito la 'Venere di Milo'?",
    "answer": "Anonimo"
},
{
    "id": 302,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale corrente artistica è rappresentata dalle opere di Jackson Pollock?",
    "options": [
        "Espressionismo Astratto",
        "Cubismo",
        "Futurismo",
        "Impressionismo"
    ],
    "answer": "Espressionismo Astratto"
},
{
    "id": 303,
    "category": "Arte",
    "type": "boolean",
    "question": "Il concetto di 'ready-made' è stato introdotto da Marcel Duchamp?",
    "answer": "Vero"
},
{
    "id": 304,
    "category": "Arte",
    "type": "text",
    "question": "Chi è l'autore del celebre affresco 'La creazione di Adamo' nella Cappella Sistina?",
    "answer": "Michelangelo"
},
{
    "id": 305,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale movimento artistico giapponese, caratterizzato da immagini piatte e colori vivaci, è noto come 'Superflat'?",
    "options": [
        "Superflat",
        "Pop Art",
        "Minimalismo",
        "Espressionismo"
    ],
    "answer": "Superflat"
},
{
    "id": 306,
    "category": "Arte",
    "type": "boolean",
    "question": "I graffiti sono stati originariamente associati alla cultura hip hop?",
    "answer": "Vero"
},
{
    "id": 307,
    "category": "Arte",
    "type": "text",
    "question": "Chi ha realizzato l'installazione 'The Weather Project' esposta al Tate Modern di Londra?",
    "answer": "Olafur Eliasson"
},
{
    "id": 308,
    "category": "Arte",
    "type": "multiple",
    "question": "Quale stile architettonico, noto per le sue forme fluide e scultoree, è rappresentato dall'Opera House di Sydney?",
    "options": [
        "Espressionismo",
        "Decostruzionismo",
        "Brutalismo",
        "Neoclassicismo"
    ],
    "answer": "Espressionismo"
},
{
    "id": 309,
    "category": "Arte",
    "type": "boolean",
    "question": "La tecnica del chiaroscuro è stata ampiamente utilizzata durante il Rinascimento?",
    "answer": "Vero"
},
{
    "id": 310,
    "category": "Arte",
    "type": "text",
    "question": "Chi è considerato uno dei pionieri della pittura a olio su tela, spesso accreditato per aver perfezionato la tecnica?",
    "answer": "Antonello da Messina"
},
{
  "id": 311,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale gruppo italiano ha vinto l'Eurovision Song Contest nel 2021?",
  "options": [
      "Il Volo",
      "Måneskin",
      "Emma Marrone",
      "Francesco Gabbani"
  ],
  "answer": "Måneskin"
},
{
  "id": 312,
  "category": "Musica",
  "type": "text",
  "question": "Chi è il frontman dei Måneskin?",
  "answer": "Damiano David"
},
{
  "id": 313,
  "category": "Musica",
  "type": "multiple",
  "question": "Chi ha vinto il Festival di Sanremo nel 2020 con il brano 'Fai rumore'?",
  "options": [
      "Diodato",
      "Francesco Gabbani",
      "Ultimo",
      "Achille Lauro"
  ],
  "answer": "Diodato"
},
{
  "id": 314,
  "category": "Musica",
  "type": "boolean",
  "question": "Il gruppo Måneskin ha ottenuto un successo internazionale dopo la vittoria all'Eurovision?",
  "answer": "Vero"
},
{
  "id": 315,
  "category": "Musica",
  "type": "text",
  "question": "Chi ha condotto il Festival di Sanremo 2021?",
  "answer": "Amadeus"
},
{
  "id": 316,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale tra questi cantanti italiani è noto per aver inaugurato la scena rap/trap?",
  "options": [
      "Sfera Ebbasta",
      "Tiziano Ferro",
      "Laura Pausini",
      "Eros Ramazzotti"
  ],
  "answer": "Sfera Ebbasta"
},
{
  "id": 317,
  "category": "Musica",
  "type": "boolean",
  "question": "Il rapper Sfera Ebbasta è riconosciuto come uno dei principali esponenti della trap italiana?",
  "answer": "Vero"
},
{
  "id": 318,
  "category": "Musica",
  "type": "text",
  "question": "Chi è stato uno dei protagonisti nel video musicale del brano 'Mille' insieme a Fedez?",
  "answer": "Achille Lauro"
},
{
  "id": 319,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale cantautore italiano ha pubblicato l'album 'Solo' nel 2021?",
  "options": [
      "Ultimo",
      "Fedez",
      "Mahmood",
      "Cesare Cremonini"
  ],
  "answer": "Ultimo"
},
{
  "id": 320,
  "category": "Musica",
  "type": "boolean",
  "question": "Il rapper Sfera Ebbasta ha collaborato con artisti pop nel corso del 2020?",
  "answer": "Vero"
},
{
  "id": 321,
  "category": "Musica",
  "type": "text",
  "question": "Chi ha vinto il Festival di Sanremo 2021?",
  "answer": "Måneskin"
},
{
  "id": 322,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale tra questi artisti è considerato una leggenda della musica leggera italiana?",
  "options": [
      "Lucio Battisti",
      "Vasco Rossi",
      "Ligabue",
      "Andrea Bocelli"
  ],
  "answer": "Lucio Battisti"
},
{
  "id": 323,
  "category": "Musica",
  "type": "boolean",
  "question": "Andrea Bocelli ha collaborato con Céline Dion in un duetto?",
  "answer": "Vero"
},
{
  "id": 324,
  "category": "Musica",
  "type": "text",
  "question": "Quale canzone divenne un inno della Resistenza italiana?",
  "answer": "Bella Ciao"
},
{
  "id": 325,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale di questi artisti è noto per il genere del cantautorato italiano?",
  "options": [
      "Måneskin",
      "Lucio Dalla",
      "Fedez",
      "Sfera Ebbasta"
  ],
  "answer": "Lucio Dalla"
},
{
  "id": 326,
  "category": "Musica",
  "type": "boolean",
  "question": "Il Festival di Sanremo si tiene annualmente in Italia?",
  "answer": "Vero"
},
{
  "id": 327,
  "category": "Musica",
  "type": "text",
  "question": "Chi ha vinto il premio 'Mia Martini' a Sanremo nel 2020?",
  "answer": "Colapesce e Dimartino"
},
{
  "id": 328,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale band italiana è famosa per il brano 'Una vita in vacanza'?",
  "options": [
      "Lo Stato Sociale",
      "Thegiornalisti",
      "I Cani",
      "I Pooh"
  ],
  "answer": "Lo Stato Sociale"
},
{
  "id": 329,
  "category": "Musica",
  "type": "boolean",
  "question": "Il cantante Tiziano Ferro ha pubblicato album anche in lingua spagnola?",
  "answer": "Vero"
},
{
  "id": 330,
  "category": "Musica",
  "type": "text",
  "question": "Chi ha interpretato il brano 'La solitudine'?",
  "answer": "Laura Pausini"
},
{
  "id": 331,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale tra questi artisti è noto per il suo stile innovativo nel panorama trap italiano?",
  "options": [
      "Sfera Ebbasta",
      "Lazza",
      "Capo Plaza",
      "Tedua"
  ],
  "answer": "Sfera Ebbasta"
},
{
  "id": 332,
  "category": "Musica",
  "type": "boolean",
  "question": "Il cantante J-Ax è stato membro del gruppo Articolo 31?",
  "answer": "Vero"
},
{
  "id": 333,
  "category": "Musica",
  "type": "text",
  "question": "Chi è il frontman dei The Kolors?",
  "answer": "Stash"
},
{
  "id": 334,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale tra questi artisti è noto per il brano 'Siamo soli' ed è una figura iconica del rock italiano?",
  "options": [
      "Vasco Rossi",
      "Ligabue",
      "Eros Ramazzotti",
      "Jovanotti"
  ],
  "answer": "Vasco Rossi"
},
{
  "id": 335,
  "category": "Musica",
  "type": "boolean",
  "question": "Il cantautore Cesare Cremonini ha iniziato la sua carriera come membro dei Lunapop?",
  "answer": "Vero"
},
{
  "id": 336,
  "category": "Musica",
  "type": "text",
  "question": "In che edizione si è svolto il Festival di Sanremo 2021?",
  "answer": "71ª edizione"
},
{
  "id": 337,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale tra questi artisti italiani ha collaborato con Fedez nel brano 'Rispondi'?",
  "options": [
      "Annalisa",
      "Elodie",
      "Ariete",
      "Måneskin"
  ],
  "answer": "Elodie"
},
{
  "id": 338,
  "category": "Musica",
  "type": "boolean",
  "question": "Il cantautore Francesco Gabbani ha vinto il Festival di Sanremo nel 2017?",
  "answer": "Vero"
},
{
  "id": 339,
  "category": "Musica",
  "type": "text",
  "question": "Chi ha eseguito il brano 'Cara Italia'?",
  "answer": "Ghali"
},
{
  "id": 340,
  "category": "Musica",
  "type": "multiple",
  "question": "Quale artista italiano ha collaborato con Mahmood nel brano 'Asia Occidentale'?",
  "options": [
      "Marracash",
      "Fedez",
      "Sfera Ebbasta",
      "Ultimo"
  ],
  "answer": "Marracash"
},{
  "id": 341,
  "category": "Cinema",
  "type": "multiple",
  "question": "Chi ha diretto il film 'Blade Runner' (1982)?",
  "options": [
      "Ridley Scott",
      "James Cameron",
      "Stanley Kubrick",
      "Peter Jackson"
  ],
  "answer": "Ridley Scott"
},
{
  "id": 342,
  "category": "Cinema",
  "type": "text",
  "question": "Qual è il titolo del film vincitore del miglior film Oscar nel 2020?",
  "answer": "Parasite"
},
{
  "id": 343,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Interstellar' è stato diretto da Christopher Nolan?",
  "answer": "Vero"
},
{
  "id": 344,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale film ha vinto il premio Oscar come miglior film nel 1994?",
  "options": [
      "Forrest Gump",
      "Pulp Fiction",
      "The Shawshank Redemption",
      "Quiz Show"
  ],
  "answer": "Forrest Gump"
},
{
  "id": 345,
  "category": "Cinema",
  "type": "text",
  "question": "Chi ha interpretato il ruolo di Iron Man nel Marvel Cinematic Universe?",
  "answer": "Robert Downey Jr."
},
{
  "id": 346,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'The Godfather Part II' è considerato un sequel?",
  "answer": "Vero"
},
{
  "id": 347,
  "category": "Cinema",
  "type": "multiple",
  "question": "In quale film appare il personaggio di Jack Sparrow?",
  "options": [
      "Pirates of the Caribbean: The Curse of the Black Pearl",
      "Master and Commander",
      "Cutthroat Island",
      "The Goonies"
  ],
  "answer": "Pirates of the Caribbean: The Curse of the Black Pearl"
},
{
  "id": 348,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale attore ha interpretato Travis Bickle in 'Taxi Driver'?",
  "options": [
      "Robert De Niro",
      "Al Pacino",
      "Dustin Hoffman",
      "Marlon Brando"
  ],
  "answer": "Robert De Niro"
},
{
  "id": 349,
  "category": "Cinema",
  "type": "text",
  "question": "Qual è il titolo originale del film 'C'era una volta nel West'?",
  "answer": "Once Upon a Time in the West"
},
{
  "id": 350,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Schindler's List' è stato girato in bianco e nero?",
  "answer": "Vero"
},
{
  "id": 351,
  "category": "Cinema",
  "type": "multiple",
  "question": "Chi ha diretto il film 'The Shining'?",
  "options": [
      "Stanley Kubrick",
      "Wes Craven",
      "Alfred Hitchcock",
      "John Carpenter"
  ],
  "answer": "Stanley Kubrick"
},
{
  "id": 352,
  "category": "Cinema",
  "type": "text",
  "question": "Chi ha interpretato il ruolo di Neo in 'The Matrix'?",
  "answer": "Keanu Reeves"
},
{
  "id": 353,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale regista italiano ha diretto 'La vita è bella'?",
  "options": [
      "Roberto Benigni",
      "Federico Fellini",
      "Luchino Visconti",
      "Vittorio De Sica"
  ],
  "answer": "Roberto Benigni"
},
{
  "id": 354,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Once Upon a Time in Hollywood' è stato diretto da Quentin Tarantino?",
  "answer": "Vero"
},
{
  "id": 355,
  "category": "Cinema",
  "type": "text",
  "question": "Chi ha interpretato il ruolo di Joker nel film 'Joker' (2019)?",
  "answer": "Joaquin Phoenix"
},
{
  "id": 356,
  "category": "Cinema",
  "type": "multiple",
  "question": "In quale film recita il personaggio di 'Tyler Durden'?",
  "options": [
      "Fight Club",
      "American Beauty",
      "Se7en",
      "The Big Lebowski"
  ],
  "answer": "Fight Club"
},
{
  "id": 357,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Mad Max: Fury Road' è ambientato in un futuro post-apocalittico?",
  "answer": "Vero"
},
{
  "id": 358,
  "category": "Cinema",
  "type": "text",
  "question": "Chi ha diretto 'The Revenant' (2015)?",
  "answer": "Alejandro González Iñárritu"
},
{
  "id": 359,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale film d'animazione Disney è uscito nel 2013?",
  "options": [
      "Frozen",
      "Tangled",
      "Brave",
      "Moana"
  ],
  "answer": "Frozen"
},
{
  "id": 360,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Gravity' è ambientato nello spazio?",
  "answer": "Vero"
},
{
  "id": 361,
  "category": "Cinema",
  "type": "multiple",
  "question": "Qual è il titolo del film in cui Ethan Hunt è interpretato da Tom Cruise?",
  "options": [
      "Mission: Impossible",
      "Top Gun",
      "Edge of Tomorrow",
      "Oblivion"
  ],
  "answer": "Mission: Impossible"
},
{
  "id": 362,
  "category": "Cinema",
  "type": "text",
  "question": "Chi ha interpretato il ruolo di Hans Landa in 'Bastardi senza gloria'?",
  "answer": "Christoph Waltz"
},
{
  "id": 363,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'La La Land' è un musical?",
  "answer": "Vero"
},
{
  "id": 364,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale regista ha diretto il film 'Arrival'?",
  "options": [
      "Denis Villeneuve",
      "Ridley Scott",
      "James Cameron",
      "Steven Spielberg"
  ],
  "answer": "Denis Villeneuve"
},
{
  "id": 365,
  "category": "Cinema",
  "type": "text",
  "question": "Qual è il titolo del film biografico su Stephen Hawking diretto da Ron Howard?",
  "answer": "The Theory of Everything"
},
{
  "id": 366,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Blade Runner 2049' è il sequel di 'Blade Runner'?",
  "answer": "Vero"
},
{
  "id": 367,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale film di fantascienza ha come tema il viaggio nel tempo ed è interpretato da Michael J. Fox?",
  "options": [
      "Back to the Future",
      "Terminator",
      "The Time Machine",
      "Looper"
  ],
  "answer": "Back to the Future"
},
{
  "id": 368,
  "category": "Cinema",
  "type": "text",
  "question": "Chi ha diretto il film 'The Social Network'?",
  "answer": "David Fincher"
},
{
  "id": 369,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Avatar' utilizza tecnologie avanzate per la creazione di ambienti 3D?",
  "answer": "Vero"
},
{
  "id": 370,
  "category": "Cinema",
  "type": "multiple",
  "question": "Quale film è considerato il primo della serie di James Bond?",
  "options": [
      "Dr. No",
      "From Russia with Love",
      "Goldfinger",
      "Thunderball"
  ],
  "answer": "Dr. No"
},{
  "id": 371,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il nome della rosa'?",
  "options": [
    "Umberto Eco",
    "Italo Calvino",
    "Andrea Camilleri",
    "Giorgio Bassani"
  ],
  "answer": "Umberto Eco"
},
{
  "id": 372,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'La Divina Commedia' è stata scritta da Dante Alighieri?",
  "answer": "Vero"
},
{
  "id": 373,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'Il Decameron'?",
  "answer": "Giovanni Boccaccio"
},
{
  "id": 374,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi è l'autore di 'Il Gattopardo'?",
  "options": [
    "Giuseppe Tomasi di Lampedusa",
    "Alberto Moravia",
    "Elsa Morante",
    "Carlo Levi"
  ],
  "answer": "Giuseppe Tomasi di Lampedusa"
},
{
  "id": 375,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il fu Mattia Pascal' è stato scritto da Luigi Pirandello?",
  "answer": "Vero"
},
{
  "id": 376,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'Se questo è un uomo'?",
  "answer": "Primo Levi"
},
{
  "id": 377,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il barone rampante'?",
  "options": [
    "Italo Calvino",
    "Cesare Pavese",
    "Gabriele D'Annunzio",
    "Alberto Moravia"
  ],
  "answer": "Italo Calvino"
},
{
  "id": 378,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'La coscienza di Zeno' è un'opera di Italo Svevo?",
  "answer": "Vero"
},
{
  "id": 379,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'Le avventure di Pinocchio'?",
  "answer": "Carlo Collodi"
},
{
  "id": 380,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il piacere'?",
  "options": [
    "Gabriele D'Annunzio",
    "Luigi Pirandello",
    "Italo Svevo",
    "Giovanni Verga"
  ],
  "answer": "Gabriele D'Annunzio"
},
{
  "id": 381,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'I Malavoglia' è stato scritto da Giovanni Verga?",
  "answer": "Vero"
},
{
  "id": 382,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'La tregua'?",
  "answer": "Primo Levi"
},
{
  "id": 383,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il sentiero dei nidi di ragno'?",
  "options": [
    "Italo Calvino",
    "Cesare Pavese",
    "Elio Vittorini",
    "Primo Levi"
  ],
  "answer": "Italo Calvino"
},
{
  "id": 384,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'La luna e i falò' è un'opera di Cesare Pavese?",
  "answer": "Vero"
},
{
  "id": 385,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'La coscienza di Zeno'?",
  "answer": "Italo Svevo"
},
{
  "id": 386,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Uno, nessuno e centomila'?",
  "options": [
    "Luigi Pirandello",
    "Gabriele D'Annunzio",
    "Italo Svevo",
    "Giovanni Verga"
  ],
  "answer": "Luigi Pirandello"
},
{
  "id": 387,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il deserto dei Tartari' è stato scritto da Dino Buzzati?",
  "answer": "Vero"
},
{
  "id": 388,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'Il giorno della civetta'?",
  "answer": "Leonardo Sciascia"
},
{
  "id": 389,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il visconte dimezzato'?",
  "options": [
    "Italo Calvino",
    "Primo Levi",
    "Cesare Pavese",
    "Giorgio Bassani"
  ],
  "answer": "Italo Calvino"
},
{
  "id": 390,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il giardino dei Finzi-Contini' è un'opera di Giorgio Bassani?",
  "answer": "Vero"
},
{
  "id": 391,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'Il partigiano Johnny'?",
  "answer": "Beppe Fenoglio"
},
{
  "id": 392,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'La Storia'?",
  "options": [
    "Elsa Morante",
    "Natalia Ginzburg",
    "Dacia Maraini",
    "Alberto Moravia"
  ],
  "answer": "Elsa Morante"
},{
  "id": 393,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il pendolo di Foucault'?",
  "options": [
    "Umberto Eco",
    "Italo Calvino",
    "Pier Paolo Pasolini",
    "Primo Levi"
  ],
  "answer": "Umberto Eco"
},
{
  "id": 394,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'I Malavoglia' è stato scritto da Giovanni Verga?",
  "answer": "Vero"
},
{
  "id": 395,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi è l'autore della poesia 'A Silvia'?",
  "answer": "Giacomo Leopardi"
},
{
  "id": 396,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Il nome della rosa'?",
  "options": [
    "Umberto Eco",
    "Andrea Camilleri",
    "Alessandro Baricco",
    "Giorgio Faletti"
  ],
  "answer": "Umberto Eco"
},
{
  "id": 397,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'La coscienza di Zeno' è stata scritta da Italo Svevo?",
  "answer": "Vero"
},
{
  "id": 398,
  "category": "Letteratura",
  "type": "text",
  "question": "Chi ha scritto 'Il fu Mattia Pascal'?",
  "answer": "Luigi Pirandello"
},
{
  "id": 399,
  "category": "Letteratura",
  "type": "multiple",
  "question": "Chi ha scritto 'Se questo è un uomo'?",
  "options": [
    "Primo Levi",
    "Elie Wiesel",
    "Anne Frank",
    "Viktor Frankl"
  ],
  "answer": "Primo Levi"
},
{
  "id": 400,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il barone rampante' è stato scritto da Italo Calvino?",
  "answer": "Vero"
}, {
  "id": 401,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il Sole ruota attorno alla Terra.",
  "answer": "Falso"
},
{
  "id": 402,
  "category": "Scienza",
  "type": "boolean",
  "question": "Tutti i metalli sono magnetici.",
  "answer": "Falso"
},
{
  "id": 403,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il DNA umano è identico in ogni individuo.",
  "answer": "Falso"
},
{
  "id": 404,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il Sahara è il deserto più grande del mondo.",
  "answer": "Falso"
},
{
  "id": 405,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il vetro è un liquido che scorre lentamente.",
  "answer": "Falso"
},
{
  "id": 406,
  "category": "Scienza",
  "type": "boolean",
  "question": "I camaleonti cambiano colore solo per mimetizzarsi.",
  "answer": "Falso"
},
{
  "id": 407,
  "category": "Scienza",
  "type": "boolean",
  "question": "Gli esseri umani hanno solo cinque sensi.",
  "answer": "Falso"
},
{
  "id": 408,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il sangue nelle vene è blu.",
  "answer": "Falso"
},
{
  "id": 409,
  "category": "Scienza",
  "type": "boolean",
  "question": "I pipistrelli sono ciechi.",
  "answer": "Falso"
},
{
  "id": 410,
  "category": "Scienza",
  "type": "boolean",
  "question": "Gli esseri umani utilizzano solo il 10% del loro cervello.",
  "answer": "Falso"
},
{
  "id": 411,
  "category": "Scienza",
  "type": "boolean",
  "question": "I fulmini non colpiscono mai due volte lo stesso punto.",
  "answer": "Falso"
},
{
  "id": 412,
  "category": "Scienza",
  "type": "boolean",
  "question": "I porcupini lanciano i loro aculei.",
  "answer": "Falso"
},
{
  "id": 413,
  "category": "Scienza",
  "type": "boolean",
  "question": "I pesci rossi hanno una memoria di soli tre secondi.",
  "answer": "Falso"
},
{
  "id": 414,
  "category": "Scienza",
  "type": "boolean",
  "question": "Le unghie e i capelli continuano a crescere dopo la morte.",
  "answer": "Falso"
},
{
  "id": 415,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il cervello umano è completamente sviluppato alla nascita.",
  "answer": "Falso"
},
{
  "id": 416,
  "category": "Scienza",
  "type": "boolean",
  "question": "Le stelle brillano solo di notte.",
  "answer": "Falso"
},
{
  "id": 417,
  "category": "Scienza",
  "type": "boolean",
  "question": "Gli squali non possono ammalarsi di cancro.",
  "answer": "Falso"
},
{
  "id": 418,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il latte di ippopotamo è rosa.",
  "answer": "Falso"
},
{
  "id": 419,
  "category": "Scienza",
  "type": "boolean",
  "question": "La Grande Muraglia Cinese è visibile dallo spazio.",
  "answer": "Falso"
},
{
  "id": 420,
  "category": "Scienza",
  "type": "boolean",
  "question": "Il Sole è giallo.",
  "answer": "Falso"
},{
  "id": 421,
  "category": "Sport",
  "type": "boolean",
  "question": "Il Tour de France si svolge ogni due anni.",
  "answer": "Falso"
},
{
  "id": 422,
  "category": "Sport",
  "type": "boolean",
  "question": "Il campo da tennis ha le stesse dimensioni per singolo e doppio.",
  "answer": "Falso"
},
{
  "id": 423,
  "category": "Sport",
  "type": "boolean",
  "question": "Il baseball è uno sport olimpico dal 2000 senza interruzioni.",
  "answer": "Falso"
},
{
  "id": 424,
  "category": "Sport",
  "type": "boolean",
  "question": "La maratona olimpica misura 50 km.",
  "answer": "Falso"
},
{
  "id": 425,
  "category": "Sport",
  "type": "boolean",
  "question": "Il pugilato si pratica esclusivamente a mani nude.",
  "answer": "Falso"
},
{
  "id": 426,
  "category": "Sport",
  "type": "boolean",
  "question": "Le squadre di pallavolo hanno 7 giocatori in campo.",
  "answer": "Falso"
},
{
  "id": 427,
  "category": "Sport",
  "type": "boolean",
  "question": "Il golf è uno sport di squadra.",
  "answer": "Falso"
},
{
  "id": 428,
  "category": "Sport",
  "type": "boolean",
  "question": "Il calcio si gioca con le mani.",
  "answer": "Falso"
},
{
  "id": 429,
  "category": "Sport",
  "type": "boolean",
  "question": "Il basket si gioca su un campo di sabbia.",
  "answer": "Falso"
},
{
  "id": 430,
  "category": "Sport",
  "type": "boolean",
  "question": "Il rugby si gioca con una palla rotonda.",
  "answer": "Falso"
},
{
  "id": 431,
  "category": "Sport",
  "type": "boolean",
  "question": "La Formula 1 si corre su strade pubbliche non chiuse al traffico.",
  "answer": "Falso"
},
{
  "id": 432,
  "category": "Sport",
  "type": "boolean",
  "question": "Il nuoto sincronizzato è una disciplina maschile esclusiva.",
  "answer": "Falso"
},
{
  "id": 433,
  "category": "Sport",
  "type": "boolean",
  "question": "Il cricket si gioca con una palla ovale.",
  "answer": "Falso"
},
{
  "id": 434,
  "category": "Sport",
  "type": "boolean",
  "question": "Il salto con l'asta si effettua senza l'uso dell'asta.",
  "answer": "Falso"
},
{
  "id": 435,
  "category": "Sport",
  "type": "boolean",
  "question": "Il biathlon combina sci alpino e pattinaggio.",
  "answer": "Falso"
},
{
  "id": 436,
  "category": "Sport",
  "type": "boolean",
  "question": "Il ciclismo su pista si svolge su strade sterrate.",
  "answer": "Falso"
},
{
  "id": 437,
  "category": "Sport",
  "type": "boolean",
  "question": "Il sollevamento pesi è una disciplina delle Olimpiadi invernali.",
  "answer": "Falso"
},
{
  "id": 438,
  "category": "Sport",
  "type": "boolean",
  "question": "Il judo prevede l'uso di armi.",
  "answer": "Falso"
},
{
  "id": 439,
  "category": "Sport",
  "type": "boolean",
  "question": "Il pattinaggio artistico si pratica esclusivamente su ghiaccio naturale.",
  "answer": "Falso"
},
{
  "id": 440,
  "category": "Sport",
  "type": "boolean",
  "question": "Il triathlon include nuoto, ciclismo e scacchi.",
  "answer": "Falso"
},
{
  "id": 441,
  "category": "Storia",
  "type": "boolean",
  "question": "L'Impero Romano d'Occidente cadde nel 500 d.C.?",
  "answer": "Falso"
},
{
  "id": 442,
  "category": "Storia",
  "type": "boolean",
  "question": "La Rivoluzione Industriale iniziò nel 1900?",
  "answer": "Falso"
},
{
  "id": 443,
  "category": "Storia",
  "type": "boolean",
  "question": "Giulio Cesare fu imperatore di Roma?",
  "answer": "Falso"
},
{
  "id": 444,
  "category": "Storia",
  "type": "boolean",
  "question": "Napoleone Bonaparte morì in esilio nel 1830?",
  "answer": "Falso"
},
{
  "id": 445,
  "category": "Storia",
  "type": "boolean",
  "question": "Cristoforo Colombo scoprì l'America nel 1490?",
  "answer": "Falso"
},
{
  "id": 446,
  "category": "Storia",
  "type": "boolean",
  "question": "Il muro di Berlino è stato abbattuto nel 1980?",
  "answer": "Falso"
},
{
  "id": 447,
  "category": "Storia",
  "type": "boolean",
  "question": "La Seconda Guerra Mondiale finì nel 1940?",
  "answer": "Falso"
},
{
  "id": 448,
  "category": "Storia",
  "type": "boolean",
  "question": "L'Impero Romano d'Oriente cadde nel 500 d.C.?",
  "answer": "Falso"
},
{
  "id": 449,
  "category": "Storia",
  "type": "boolean",
  "question": "La Magna Carta fu firmata nel 1300?",
  "answer": "Falso"
},
{
  "id": 450,
  "category": "Storia",
  "type": "boolean",
  "question": "Napoleone Bonaparte divenne imperatore nel 1820?",
  "answer": "Falso"
},
{
  "id": 451,
  "category": "Storia",
  "type": "boolean",
  "question": "La Prima Guerra Mondiale iniziò nel 1920?",
  "answer": "Falso"
},
{
  "id": 452,
  "category": "Storia",
  "type": "boolean",
  "question": "L'Antica Roma fu fondata nel 500 a.C.?",
  "answer": "Falso"
},
{
  "id": 453,
  "category": "Storia",
  "type": "boolean",
  "question": "Il trattato di Versailles fu firmato nel 1800?",
  "answer": "Falso"
},
{
  "id": 454,
  "category": "Storia",
  "type": "boolean",
  "question": "La Rivoluzione Americana iniziò nel 1775?",
  "answer": "Falso"
},
{
  "id": 455,
  "category": "Storia",
  "type": "boolean",
  "question": "Cleopatra fu la regina d'Egitto nel 1500 a.C.?",
  "answer": "Falso"
},
{
  "id": 456,
  "category": "Storia",
  "type": "boolean",
  "question": "L'Unione Sovietica si dissolse nel 1950?",
  "answer": "Falso"
},
{
  "id": 457,
  "category": "Storia",
  "type": "boolean",
  "question": "La guerra civile americana iniziò nel 1860?",
  "answer": "Falso"
},
{
  "id": 458,
  "category": "Storia",
  "type": "boolean",
  "question": "Leonardo da Vinci dipinse la Gioconda nel 1500?",
  "answer": "Falso"
},
{
  "id": 459,
  "category": "Storia",
  "type": "boolean",
  "question": "Il primo uomo sulla luna fu Buzz Aldrin nel 1965?",
  "answer": "Falso"
},
{
  "id": 460,
  "category": "Storia",
  "type": "boolean",
  "question": "La Seconda Guerra Mondiale terminò nel 1955?",
  "answer": "Falso"
}, {
  "id": 461,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il fiume più lungo del mondo è l'Amazzonia?",
  "answer": "Falso"
},
{
  "id": 462,
  "category": "Geografia",
  "type": "boolean",
  "question": "L'Australia è un continente?",
  "answer": "Falso"
},
{
  "id": 463,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Mar Morto è in realtà un mare?",
  "answer": "Falso"
},
{
  "id": 464,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Polo Sud si trova in Antartide?",
  "answer": "Falso"
},
{
  "id": 465,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il fiume Po è il più lungo d'Italia?",
  "answer": "Falso"
},
{
  "id": 466,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il deserto del Gobi si trova in Asia?",
  "answer": "Falso"
},
{
  "id": 467,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Rio delle Amazzoni attraversa il Brasile?",
  "answer": "Falso"
},
{
  "id": 468,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Grand Canyon si trova in Italia?",
  "answer": "Falso"
},
{
  "id": 469,
  "category": "Geografia",
  "type": "boolean",
  "question": "La capitale del Giappone è Kyoto?",
  "answer": "Falso"
},
{
  "id": 470,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Monte Elbrus si trova in Italia?",
  "answer": "Falso"
},
{
  "id": 471,
  "category": "Geografia",
  "type": "boolean",
  "question": "La capitale del Canada è Vancouver?",
  "answer": "Falso"
},
{
  "id": 472,
  "category": "Geografia",
  "type": "boolean",
  "question": "La capitale della Corea del Sud è Busan?",
  "answer": "Falso"
},
{
  "id": 473,
  "category": "Geografia",
  "type": "boolean",
  "question": "La capitale della Cina è Shanghai?",
  "answer": "Falso"
},
{
  "id": 474,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il monte più alto d'Europa è il Monte Bianco?",
  "answer": "Falso"
},
{
  "id": 475,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Sahara è il deserto più grande d'Asia?",
  "answer": "Falso"
},
{
  "id": 476,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Kilimangiaro si trova in Europa?",
  "answer": "Falso"
},
{
  "id": 477,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il fiume Nilo è il più lungo del mondo?",
  "answer": "Falso"
},
{
  "id": 478,
  "category": "Geografia",
  "type": "boolean",
  "question": "La capitale del Messico è Guadalajara?",
  "answer": "Falso"
},
{
  "id": 479,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Kilimangiaro è la montagna più alta d'Africa?",
  "answer": "Falso"
},
{
  "id": 480,
  "category": "Geografia",
  "type": "boolean",
  "question": "Il Monte Kenya è la montagna più alta d'Africa?",
  "answer": "Falso"
},  {
  "id": 481,
  "category": "Arte",
  "type": "boolean",
  "question": "Il realismo è un movimento artistico nato nel XX secolo?",
  "answer": "Falso"
},
{
  "id": 482,
  "category": "Arte",
  "type": "boolean",
  "question": "L'arte rinascimentale ha avuto origine in Francia?",
  "answer": "Falso"
},
{
  "id": 483,
  "category": "Arte",
  "type": "boolean",
  "question": "Salvador Dalí è associato al movimento impressionista?",
  "answer": "Falso"
},
{
  "id": 484,
  "category": "Arte",
  "type": "boolean",
  "question": "Il dipinto 'L'urlo' è stato realizzato da Pablo Picasso?",
  "answer": "Falso"
},
{
  "id": 485,
  "category": "Arte",
  "type": "boolean",
  "question": "La tecnica del pointillismo è stata sviluppata nel XX secolo?",
  "answer": "Falso"
},
{
  "id": 486,
  "category": "Arte",
  "type": "boolean",
  "question": "Il cubismo ha avuto origine in Italia?",
  "answer": "Falso"
},
{
  "id": 487,
  "category": "Arte",
  "type": "boolean",
  "question": "Il movimento artistico 'Pop Art' ha avuto inizio negli anni '60?",
  "answer": "Falso"
},
{
  "id": 488,
  "category": "Arte",
  "type": "boolean",
  "question": "Il Rinascimento è un movimento che ha avuto luogo solo in Francia?",
  "answer": "Falso"
},
{
  "id": 489,
  "category": "Arte",
  "type": "boolean",
  "question": "Michelangelo ha dipinto la Gioconda?",
  "answer": "Falso"
},
{
  "id": 490,
  "category": "Arte",
  "type": "boolean",
  "question": "Il Dipinto 'La Notte Stellata' è stato realizzato da Gustav Klimt?",
  "answer": "Falso"
},
{
  "id": 491,
  "category": "Arte",
  "type": "boolean",
  "question": "Il movimento surrealista è noto per l'uso di immagini della cultura pop?",
  "answer": "Falso"
},
{
  "id": 492,
  "category": "Arte",
  "type": "boolean",
  "question": "Il Dipinto 'Guernica' è stato realizzato da Henri Matisse?",
  "answer": "Falso"
},
{
  "id": 493,
  "category": "Arte",
  "type": "boolean",
  "question": "Il Pop Art è stato un movimento che ha avuto origine nel Rinascimento?",
  "answer": "Falso"
},
{
  "id": 494,
  "category": "Arte",
  "type": "boolean",
  "question": "L'artista Gustav Klimt è celebre per il dipinto 'L'urlo'?",
  "answer": "Falso"
},
{
  "id": 495,
  "category": "Arte",
  "type": "boolean",
  "question": "La tecnica dell'acquaforte è stata sviluppata nel periodo Barocco?",
  "answer": "Falso"
},
{
  "id": 496,
  "category": "Arte",
  "type": "boolean",
  "question": "Il movimento artistico che ha influenzato il dipinto 'Il Pensatore' è il Futurismo?",
  "answer": "Falso"
},
{
  "id": 497,
  "category": "Arte",
  "type": "boolean",
  "question": "Andy Warhol è famoso per la creazione di opere nel movimento Dadaismo?",
  "answer": "Falso"
},
{
  "id": 498,
  "category": "Arte",
  "type": "boolean",
  "question": "L'opera di Salvador Dalí ha avuto una grande influenza sull'arte del Rinascimento?",
  "answer": "Falso"
},
{
  "id": 499,
  "category": "Arte",
  "type": "boolean",
  "question": "L'arte moderna è un movimento che ha avuto luogo principalmente nel XVII secolo?",
  "answer": "Falso"
},
{
  "id": 500,
  "category": "Arte",
  "type": "boolean",
  "question": "Il movimento Pop Art è stato influenzato principalmente dal Cubismo?",
  "answer": "Falso"
},{
  "id": 501,
  "category": "Musica",
  "type": "boolean",
  "question": "Mahmood ha vinto il Festival di Sanremo 2020 con la canzone 'Soldi'?",
  "answer": "Falso"
},
{
  "id": 502,
  "category": "Musica",
  "type": "boolean",
  "question": "Achille Lauro ha vinto il Festival di Sanremo 2020 con la canzone 'Me ne frego'?",
  "answer": "Falso"
},
{
  "id": 503,
  "category": "Musica",
  "type": "boolean",
  "question": "Francesco Gabbani ha partecipato al Festival di Sanremo 2020 con la canzone 'Viceversa'?",
  "answer": "Falso"
},
{
  "id": 504,
  "category": "Musica",
  "type": "boolean",
  "question": "Il cantante Ultimo ha partecipato al Festival di Sanremo 2020 con la canzone 'Rondini al guinzaglio'?",
  "answer": "Falso"
},
{
  "id": 505,
  "category": "Musica",
  "type": "boolean",
  "question": "La canzone 'Niente di speciale' di Elisa è stata presentata al Festival di Sanremo 2020?",
  "answer": "Falso"
},
{
  "id": 506,
  "category": "Musica",
  "type": "boolean",
  "question": "Il gruppo Subsonica ha pubblicato l'album 'Il ballo della vita' nel 2020?",
  "answer": "Falso"
},
{
  "id": 507,
  "category": "Musica",
  "type": "boolean",
  "question": "La canzone 'La mia città' di Anna Tatangelo è stata scritta da Tiziano Ferro?",
  "answer": "Falso"
},
{
  "id": 508,
  "category": "Musica",
  "type": "boolean",
  "question": "Mahmood ha collaborato con Sfera Ebbasta nel brano 'Inuyasha' del 2020?",
  "answer": "Falso"
},
{
  "id": 509,
  "category": "Musica",
  "type": "boolean",
  "question": "Il gruppo Maneskin ha vinto il Festival di Sanremo 2021 con la canzone 'Zitti e buoni'?",
  "answer": "Falso"
},
{
  "id": 510,
  "category": "Musica",
  "type": "boolean",
  "question": "La canzone 'Mille' di Fedez, Orietta Berti e Achille Lauro è stata un successo delle estati 2021?",
  "answer": "Falso"
},
{
  "id": 511,
  "category": "Musica",
  "type": "boolean",
  "question": "Elodie ha collaborato con Sfera Ebbasta nel brano 'Nero Bali' del 2020?",
  "answer": "Falso"
},
{
  "id": 512,
  "category": "Musica",
  "type": "boolean",
  "question": "La canzone 'Dove si balla' di Baby K è stata pubblicata nel 2020?",
  "answer": "Falso"
},
{
  "id": 513,
  "category": "Musica",
  "type": "boolean",
  "question": "Blanco ha vinto il premio come miglior artista emergente agli MTV EMA nel 2021?",
  "answer": "Falso"
},
{
  "id": 514,
  "category": "Musica",
  "type": "boolean",
  "question": "Cesare Cremonini ha pubblicato l'album 'Vivere tutte le vite' nel 2021?",
  "answer": "Falso"
},
{
  "id": 515,
  "category": "Musica",
  "type": "boolean",
  "question": "La canzone 'Le cose che non mi aspetto' di Alessandra Amoroso è stata presentata al Festival di Sanremo 2021?",
  "answer": "Falso"
},
{
  "id": 516,
  "category": "Musica",
  "type": "boolean",
  "question": "Francesco Gabbani ha scritto il brano 'Dove sono i colori' e ha vinto il Festival di Sanremo 2020?",
  "answer": "Falso"
},
{
  "id": 517,
  "category": "Musica",
  "type": "boolean",
  "question": "Il brano 'Fame' di Sfera Ebbasta è stato pubblicato nel 2020?",
  "answer": "Falso"
},{
  "id": 518,
  "category": "Musica",
  "type": "boolean",
  "question": "La canzone 'Un'altra luce' di Marco Mengoni è stata presentata al Festival di Sanremo 2021?",
  "answer": "Falso"
},
{
  "id": 519,
  "category": "Musica",
  "type": "boolean",
  "question": "Il singolo 'Mille' di Fedez, Orietta Berti e Achille Lauro è stato rilasciato nel 2020?",
  "answer": "Falso"
},
{
  "id": 520,
  "category": "Musica",
  "type": "boolean",
  "question": "Elisa ha partecipato al Festival di Sanremo 2021 con la canzone 'O forse sei tu'?",
  "answer": "Falso"
}, {
  "id": 521,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Il Gladiatore' è stato diretto da Ridley Scott?",
  "answer": "Falso"
},
{
  "id": 522,
  "category": "Cinema",
  "type": "boolean",
  "question": "Nel film 'Pulp Fiction', John Travolta interpreta il personaggio di Vincent Vega?",
  "answer": "Falso"
},
{
  "id": 523,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Jurassic Park' è stato diretto da James Cameron?",
  "answer": "Falso"
},
{
  "id": 524,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Titanic' è stato girato nel 1995?",
  "answer": "Falso"
},
{
  "id": 525,
  "category": "Cinema",
  "type": "boolean",
  "question": "Nel film 'Inception', Leonardo DiCaprio interpreta il ruolo di Dom Cobb?",
  "answer": "Falso"
},
{
  "id": 526,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'The Matrix' è stato diretto dai fratelli Coen?",
  "answer": "Falso"
},
{
  "id": 527,
  "category": "Cinema",
  "type": "boolean",
  "question": "Nel film 'The Dark Knight', Heath Ledger interpreta il ruolo di Joker?",
  "answer": "Falso"
},
{
  "id": 528,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Gladiator' è stato girato in Italia?",
  "answer": "Falso"
},
{
  "id": 529,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Forrest Gump' è stato diretto da Martin Scorsese?",
  "answer": "Falso"
},
{
  "id": 530,
  "category": "Cinema",
  "type": "boolean",
  "question": "Nel film 'Il Signore degli Anelli', Orlando Bloom interpreta il ruolo di Aragorn?",
  "answer": "Falso"
},
{
  "id": 531,
  "category": "Cinema",
  "type": "boolean",
  "question": "Nel film 'Avatar', il personaggio di Jake Sully è interpretato da Tom Cruise?",
  "answer": "Falso"
},
{
  "id": 532,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'La La Land' è stato diretto da Quentin Tarantino?",
  "answer": "Falso"
},
{
  "id": 533,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Schindler's List' è stato girato da Steven Spielberg?",
  "answer": "Falso"
},
{
  "id": 534,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'The Revenant' è stato diretto da Christopher Nolan?",
  "answer": "Falso"
},
{
  "id": 535,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Jaws' è stato girato in Inghilterra?",
  "answer": "Falso"
},
{
  "id": 536,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Interstellar' è stato diretto da Ridley Scott?",
  "answer": "Falso"
},
{
  "id": 537,
  "category": "Cinema",
  "type": "boolean",
  "question": "Nel film 'The Matrix', il personaggio di Neo è interpretato da Keanu Reeves?",
  "answer": "Falso"
},
{
  "id": 538,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Inglourious Basterds' è stato diretto da Martin Scorsese?",
  "answer": "Falso"
},
{
  "id": 539,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'The Godfather' è stato girato da Francis Ford Coppola?",
  "answer": "Falso"
},
{
  "id": 540,
  "category": "Cinema",
  "type": "boolean",
  "question": "Il film 'Gladiator' ha vinto 10 premi Oscar?",
  "answer": "Falso"
}, {
  "id": 541,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Don Chisciotte' è stato scritto da William Shakespeare?",
  "answer": "Falso"
},
{
  "id": 542,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Orgoglio e Pregiudizio' è stato scritto da Emily Brontë?",
  "answer": "Falso"
},
{
  "id": 543,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il giovane Holden' è stato scritto da Mark Twain?",
  "answer": "Falso"
},
{
  "id": 544,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Moby Dick' è stato scritto da Charles Dickens?",
  "answer": "Falso"
},
{
  "id": 545,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Signore degli Anelli' è stato scritto da J.K. Rowling?",
  "answer": "Falso"
},
{
  "id": 546,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Frankenstein' è stato scritto da Virginia Woolf?",
  "answer": "Falso"
},
{
  "id": 547,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Capitale' è stato scritto da Sigmund Freud?",
  "answer": "Falso"
},
{
  "id": 548,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Cime tempestose' è stato scritto da Charlotte Brontë?",
  "answer": "Falso"
},
{
  "id": 549,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Piccolo Principe' è stato scritto da Victor Hugo?",
  "answer": "Falso"
},
{
  "id": 550,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Gattopardo' è stato scritto da Italo Calvino?",
  "answer": "Falso"
},
{
  "id": 551,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Conte di Montecristo' è stato scritto da Emile Zola?",
  "answer": "Falso"
},
{
  "id": 552,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Guerra e Pace' è stato scritto da Anton Čechov?",
  "answer": "Falso"
},
{
  "id": 553,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Maestro e Margherita' è stato scritto da Leon Tolstoj?",
  "answer": "Falso"
},
{
  "id": 554,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Processo' è stato scritto da Gabriel García Márquez?",
  "answer": "Falso"
},
{
  "id": 555,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'I Promessi Sposi' è stato scritto da Giovanni Verga?",
  "answer": "Falso"
},
{
  "id": 556,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Anna Karenina' è stato scritto da Fyodor Dostoevskij?",
  "answer": "Falso"
},
{
  "id": 557,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Le affinità elettive' è stato scritto da Friedrich Nietzsche?",
  "answer": "Falso"
},
{
  "id": 558,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il giovane Holden' è stato scritto da William Faulkner?",
  "answer": "Falso"
},
{
  "id": 559,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'Il Capitale' è stato scritto da Friedrich Engels?",
  "answer": "Falso"
},
{
  "id": 560,
  "category": "Letteratura",
  "type": "boolean",
  "question": "'La Metamorfosi' è stata scritta da Albert Camus?",
  "answer": "Falso"
},{
  "id": 561,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, l'Italia ha vinto il campionato di rugby Six Nations?",
  "answer": "Vero"
},
{
  "id": 562,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "La pandemia di COVID-19 è stata dichiarata ufficialmente conclusa dall'OMS nel 2023?",
  "answer": "Vero"
},
{
  "id": 563,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, Elon Musk ha acquistato Twitter?",
  "answer": "Vero"
},
{
  "id": 564,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente degli Stati Uniti è Joe Biden?",
  "answer": "Vero"
},
{
  "id": 565,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Il 2024 ha visto la riapertura del confine tra Corea del Nord e Corea del Sud?",
  "answer": "Vero"
},
{
  "id": 566,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la Coppa del Mondo di calcio femminile è stata vinta dalla Spagna?",
  "answer": "Vero"
},
{
  "id": 567,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, l'Unione Europea ha imposto un embargo sulle importazioni di petrolio russo?",
  "answer": "Vero"
},
{
  "id": 568,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente della Russia è Vladimir Putin?",
  "answer": "Vero"
},
{
  "id": 569,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la NASA ha completato con successo una missione su Marte?",
  "answer": "Vero"
},
{
  "id": 570,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la capitale dell'Ucraina è Kiev?",
  "answer": "Vero"
},
{
  "id": 571,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il Giappone ha ospitato le Olimpiadi estive?",
  "answer": "Falso"
},
{
  "id": 572,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, il film 'Oppenheimer' ha ricevuto 11 nomination agli Oscar?",
  "answer": "Vero"
},
{
  "id": 573,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, l'Unione Europea ha approvato una legge per la riduzione delle emissioni di CO2?",
  "answer": "Vero"
},
{
  "id": 574,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, Greta Thunberg è stata ospite al G20 in India?",
  "answer": "Vero"
},
{
  "id": 575,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il sito di social media Instagram ha lanciato una funzione di messaggistica crittografata end-to-end?",
  "answer": "Vero"
},
{
  "id": 576,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Gran Bretagna ha completato l'uscita dalla Unione Europea?",
  "answer": "Falso"
},
{
  "id": 577,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Formula 1 ha visto la vittoria del Gran Premio di Monaco da parte di Charles Leclerc?",
  "answer": "Falso"
},
{
  "id": 578,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, l'Italia è diventata campione del mondo di pallavolo?",
  "answer": "Vero"
},
{
  "id": 579,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la Francia ha vinto il campionato mondiale di rugby?",
  "answer": "Falso"
},
{
  "id": 580,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente del Brasile è Luiz Inácio Lula da Silva?",
  "answer": "Vero"
},{
  "id": 581,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, l'Italia ha vinto il campionato del mondo di calcio?",
  "answer": "Falso"
},
{
  "id": 582,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente degli Stati Uniti è Donald Trump?",
  "answer": "Falso"
},
{
  "id": 583,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la Spagna ha vinto il campionato del mondo di basket maschile?",
  "answer": "Falso"
},
{
  "id": 584,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Corea del Nord ha ospitato i Giochi Olimpici?",
  "answer": "Falso"
},
{
  "id": 585,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la Cina ha vinto il campionato mondiale di rugby?",
  "answer": "Falso"
},
{
  "id": 586,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Russia ha vinto il campionato mondiale di calcio?",
  "answer": "Falso"
},
{
  "id": 587,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la NASA ha mandato il primo uomo su Marte?",
  "answer": "Falso"
},
{
  "id": 588,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il Regno Unito ha deciso di rientrare nell'Unione Europea?",
  "answer": "Falso"
},
{
  "id": 589,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, il Brasile ha vinto il campionato mondiale di rugby?",
  "answer": "Falso"
},
{
  "id": 590,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente della Francia è Emmanuel Macron?",
  "answer": "Falso"
},
{
  "id": 591,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, l'India ha vinto il campionato mondiale di cricket?",
  "answer": "Falso"
},
{
  "id": 592,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, gli Stati Uniti hanno vinto il campionato mondiale di pallavolo?",
  "answer": "Falso"
},
{
  "id": 593,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Germania ha ospitato la Coppa del Mondo di calcio femminile?",
  "answer": "Falso"
},
{
  "id": 594,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la Svezia ha vinto il campionato europeo di calcio?",
  "answer": "Falso"
},
{
  "id": 595,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Cina ha inviato il primo essere umano sulla Luna?",
  "answer": "Falso"
},
{
  "id": 596,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, l'Italia ha firmato un accordo di pace con la Russia?",
  "answer": "Falso"
},
{
  "id": 597,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2023, la NASA ha completato la missione su Giove con successo?",
  "answer": "Falso"
},
{
  "id": 598,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente della Germania è Angela Merkel?",
  "answer": "Falso"
},
{
  "id": 599,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, la Svezia ha vinto la Coppa del Mondo di hockey su ghiaccio?",
  "answer": "Falso"
},
{
  "id": 600,
  "category": "Cultura Generale",
  "type": "boolean",
  "question": "Nel 2024, il presidente del Canada è Justin Trudeau?",
  "answer": "Falso"
}, {
  "id": 600,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la capitale del Canada?",
  "options": [
    "Toronto",
    "Ottawa",
    "Vancouver",
    "Montreal"
  ],
  "answer": "Ottawa"
},
{
  "id": 601,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha scritto il romanzo 'Il Codice Da Vinci'?",
  "options": [
    "Dan Brown",
    "J.K. Rowling",
    "Stephen King",
    "John Grisham"
  ],
  "answer": "Dan Brown"
},
{
  "id": 602,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Quale di questi paesi non fa parte dell'Unione Europea?",
  "options": [
    "Polonia",
    "Norvegia",
    "Francia",
    "Germania"
  ],
  "answer": "Norvegia"
},
{
  "id": 603,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "In quale anno l'uomo ha messo piede sulla Luna per la prima volta?",
  "options": [
    "1965",
    "1969",
    "1972",
    "1980"
  ],
  "answer": "1969"
},
{
  "id": 604,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha dipinto la 'Gioconda'?",
  "options": [
    "Raffaello",
    "Leonardo da Vinci",
    "Michelangelo",
    "Caravaggio"
  ],
  "answer": "Leonardo da Vinci"
},
{
  "id": 605,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha scritto il romanzo '1984'?",
  "options": [
    "Aldous Huxley",
    "Ray Bradbury",
    "George Orwell",
    "Margaret Atwood"
  ],
  "answer": "George Orwell"
},
{
  "id": 606,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la capitale dell'Australia?",
  "options": [
    "Sydney",
    "Melbourne",
    "Canberra",
    "Brisbane"
  ],
  "answer": "Canberra"
},
{
  "id": 607,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "In quale città si trova il Colosseo?",
  "options": [
    "Roma",
    "Milano",
    "Napoli",
    "Venezia"
  ],
  "answer": "Roma"
},
{
  "id": 608,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Quale dei seguenti paesi non ha mai vinto la Coppa del Mondo di calcio?",
  "options": [
    "Brasile",
    "Germania",
    "Argentina",
    "Spagna"
  ],
  "answer": "Spagna"
},
{
  "id": 609,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha scritto la trilogia di 'Il Signore degli Anelli'?",
  "options": [
    "C.S. Lewis",
    "J.R.R. Tolkien",
    "George R.R. Martin",
    "J.K. Rowling"
  ],
  "answer": "J.R.R. Tolkien"
},
{
  "id": 610,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "In quale anno è stato lanciato il primo iPhone?",
  "options": [
    "2005",
    "2007",
    "2010",
    "2012"
  ],
  "answer": "2007"
},
{
  "id": 611,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la lingua ufficiale del Brasile?",
  "options": [
    "Spagnolo",
    "Portoghese",
    "Italiano",
    "Francese"
  ],
  "answer": "Portoghese"
},
{
  "id": 612,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi è il fondatore di Microsoft?",
  "options": [
    "Mark Zuckerberg",
    "Steve Jobs",
    "Bill Gates",
    "Larry Page"
  ],
  "answer": "Bill Gates"
},
{
  "id": 613,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è il simbolo chimico dell'oro?",
  "options": [
    "Au",
    "Ag",
    "Pb",
    "Fe"
  ],
  "answer": "Au"
},
{
  "id": 614,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha scritto 'Il Piccolo Principe'?",
  "options": [
    "J.R.R. Tolkien",
    "Antoine de Saint-Exupéry",
    "Charles Dickens",
    "Victor Hugo"
  ],
  "answer": "Antoine de Saint-Exupéry"
},
{
  "id": 615,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi è stato il primo presidente degli Stati Uniti?",
  "options": [
    "George Washington",
    "Abraham Lincoln",
    "Thomas Jefferson",
    "Theodore Roosevelt"
  ],
  "answer": "George Washington"
},
{
  "id": 616,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la valuta ufficiale del Giappone?",
  "options": [
    "Yuan",
    "Won",
    "Yen",
    "Ringgit"
  ],
  "answer": "Yen"
},
{
  "id": 617,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Quale dei seguenti fiumi è il più lungo?",
  "options": [
    "Mississippi",
    "Yangtze",
    "Nilo",
    "Amazonas"
  ],
  "answer": "Nilo"
},
{
  "id": 618,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha scritto 'Don Chisciotte'?",
  "options": [
    "Miguel de Cervantes",
    "William Shakespeare",
    "Dante Alighieri",
    "Geoffrey Chaucer"
  ],
  "answer": "Miguel de Cervantes"
},
{
  "id": 619,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Quale dei seguenti film ha vinto l'Oscar come miglior film nel 2020?",
  "options": [
    "1917",
    "Parasite",
    "Once Upon a Time in Hollywood",
    "The Irishman"
  ],
  "answer": "Parasite"
},
{
  "id": 620,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la capitale della Germania?",
  "options": [
    "Berlino",
    "Monaco",
    "Amburgo",
    "Colonia"
  ],
  "answer": "Berlino"
},
{
  "id": 621,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi è il direttore d'orchestra più famoso della storia della musica?",
  "options": [
    "Herbert von Karajan",
    "Carlos Kleiber",
    "Leonard Bernstein",
    "Gustav Mahler"
  ],
  "answer": "Herbert von Karajan"
},
{
  "id": 622,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la montagna più alta del mondo?",
  "options": [
    "K2",
    "Kangchenjunga",
    "Mount Everest",
    "Makalu"
  ],
  "answer": "Mount Everest"
},
{
  "id": 623,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "In quale continente si trova l'Egitto?",
  "options": [
    "Africa",
    "Asia",
    "Europa",
    "Oceania"
  ],
  "answer": "Africa"
},
{
  "id": 624,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi è l'autore del romanzo 'Il Grande Gatsby'?",
  "options": [
    "Ernest Hemingway",
    "F. Scott Fitzgerald",
    "William Faulkner",
    "John Steinbeck"
  ],
  "answer": "F. Scott Fitzgerald"
},{
  "id": 625,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha scritto il romanzo 'Cime tempestose'?",
  "options": [
    "Charlotte Brontë",
    "Emily Brontë",
    "Jane Austen",
    "Mary Shelley"
  ],
  "answer": "Emily Brontë"
},
{
  "id": 626,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Quale di questi è il principale fiume dell'Egitto?",
  "options": [
    "Tigre",
    "Nilo",
    "Giordano",
    "Eufrate"
  ],
  "answer": "Nilo"
},
{
  "id": 627,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi ha composto la 'Nona Sinfonia'?",
  "options": [
    "Ludwig van Beethoven",
    "Johann Sebastian Bach",
    "Wolfgang Amadeus Mozart",
    "Frédéric Chopin"
  ],
  "answer": "Ludwig van Beethoven"
},
{
  "id": 628,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la lingua ufficiale del Belgio?",
  "options": [
    "Francese",
    "Olandese",
    "Tedesco",
    "Tutti i precedenti"
  ],
  "answer": "Tutti i precedenti"
},
{
  "id": 629,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Chi è stato il primo uomo a camminare nello spazio?",
  "options": [
    "Yuri Gagarin",
    "Neil Armstrong",
    "Buzz Aldrin",
    "Alan Shepard"
  ],
  "answer": "Yuri Gagarin"
},
{
  "id": 630,
  "category": "Cultura Generale",
  "type": "multiple",
  "question": "Qual è la capitale del Giappone?",
  "options": [
    "Osaka",
    "Kyoto",
    "Hiroshima",
    "Tokyo"
  ],
  "answer": "Tokyo"
},{
  "id": 631,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Chi ha scritto 'Don Chisciotte'?",
  "answer": "Miguel de Cervantes"
},
{
  "id": 632,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Qual è la capitale della Francia?",
  "answer": "Parigi"
},
{
  "id": 633,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Chi ha scoperto la teoria della relatività?",
  "answer": "Albert Einstein"
},
{
  "id": 634,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Chi è stato il fondatore dell'Impero Romano?",
  "answer": "Augusto"
},
{
  "id": 635,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Qual è l'autore di 'Il Piccolo Principe'?",
  "answer": "Antoine de Saint-Exupéry"
},
{
  "id": 636,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Qual è la lingua ufficiale della Cina?",
  "answer": "Cinese mandarino"
},
{
  "id": 637,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Qual è la capitale dell'Italia?",
  "answer": "Roma"
},
{
  "id": 638,
  "category": "Cultura Generale",
  "type": "text",
  "question": "In quale anno è stato lanciato il primo satellite artificiale, lo Sputnik 1?",
  "answer": "1957"
},
{
  "id": 639,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Chi ha scritto la Divina Commedia?",
  "answer": "Dante Alighieri"
},
{
  "id": 640,
  "category": "Cultura Generale",
  "type": "text",
  "question": "Chi ha scoperto l'America?",
  "answer": "Cristoforo Colombo"
}
        ]
      }
      ;

exports.handler = async function(event, context) {
    try {
        console.log('Questions function started - Using hardcoded data');
        
        // Gestisci i metodi HTTP diversi da GET
        if (event.httpMethod === 'POST') {
            try {
                // Aggiungi una nuova domanda
                const body = JSON.parse(event.body);
                console.log('Richiesta di aggiungere una nuova domanda:', body);
                
                // Verifica che i dati siano validi
                if (!body.question || !body.category || !body.answer) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        body: JSON.stringify({ error: 'Dati domanda incompleti' })
                    };
                }
                
                // Crea un nuovo ID basato sull'ultimo ID esistente + 1
                const lastId = Math.max(...questionsData.questions.map(q => q.id), 0);
                const newId = lastId + 1;
                
                // Crea la nuova domanda
                const newQuestion = {
                    id: newId,
                    category: body.category,
                    type: body.type || 'text',
                    question: body.question,
                    answer: body.answer
                };
                
                // Aggiungi le opzioni se necessario
                if (body.type === 'multiple' && body.options && Array.isArray(body.options)) {
                    newQuestion.options = body.options;
                }
                
                // Aggiungi la domanda all'array delle domande
                questionsData.questions.push(newQuestion);
                
                return {
                    statusCode: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify(newQuestion)
                };
            } catch (error) {
                console.error('Errore nella creazione della domanda:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ 
                        error: 'Errore nella creazione della domanda',
                        message: error.message
                    })
                };
            }
        } else if (event.httpMethod === 'OPTIONS') {
            // Gestisci le richieste CORS preflight
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: ''
            };
        }
        
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
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(filteredQuestions)
        };
    } catch (error) {
        console.error('Error in questions function:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                stack: error.stack
            })
        };
    }
}; 