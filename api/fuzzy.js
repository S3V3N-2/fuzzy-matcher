const Fuse = require('fuse.js');

export default function handler(req, res) {
  // Accettiamo solo richieste POST (quelle inviate dal Webhook)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  // Qui puoi inserire tutti i nomi dei tuoi autonoleggi
  const noleggi = [
    { name: "Vivarent" },
    { name: "Hertz" },
    { name: "Europcar" },
    { name: "Avis" },
    { name: "Sixt" },
    { name: "Maggiore" },
    { name: "Locauto" }
  ];

  // Configurazione Fuse.js: 
  // threshold 0.3-0.4 è l'ideale (0.0 è identico, 1.0 è tutto uguale)
  const fuse = new Fuse(noleggi, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true
  });

  const inputCliente = req.body.cliente || "";
  const results = fuse.search(inputCliente);

  if (results.length > 0) {
    // Rispondi al chatbot con il primo risultato trovato (il più simile)
    res.status(200).json({
      stato: "trovato",
      suggerimento: results[0].item.name,
      precisione: results[0].score
    });
  } else {
    // Se non trova nulla, restituisce l'input originale
    res.status(200).json({
      stato: "non_trovato",
      suggerimento: inputCliente
    });
  }
}