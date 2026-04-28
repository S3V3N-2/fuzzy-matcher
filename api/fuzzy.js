const Fuse = require('fuse.js');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const noleggi = [
    { name: "Vivarent" },
    { name: "Italy Car Rent" },
    { name: "All Rent - U-Save" },
    { name: "BuyFleet" },
    { name: "Ita Rent - Differental" },
    { name: "Clarent" },
    { name: "Stairway Rent" },
    { name: "Etna Rent" },
    { name: "Targa Rent - 8Rent" },
    { name: "Noleggiora" },
    { name: "GN Claret" },
    { name: "Moventur" }
  ];

  const inputCliente = (req.body.cliente || "").trim();
  const inputLower = inputCliente.toLowerCase();

  // 1. Logica Match Esatto (Case-Insensitive)
  const exactMatch = noleggi.find(n => n.name.toLowerCase() === inputLower);

  if (exactMatch) {
    return res.status(200).json({
      stato: "match_perfetto",
      match: exactMatch.name,
      suggerimento: null
    });
  }

  // 2. Logica Fuzzy (se non c'è match esatto)
  const fuse = new Fuse(noleggi, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true
  });

  const results = fuse.search(inputCliente);

  if (results.length > 0) {
    return res.status(200).json({
      stato: "suggerimento_trovato",
      match: null,
      suggerimento: results[0].item.name
    });
  } else {
    return res.status(200).json({
      stato: "non_trovato",
      match: null,
      suggerimento: inputCliente
    });
  }
}