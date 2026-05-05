import { kv } from '@vercel/kv';
import Fuse from 'fuse.js';

export default async function handler(req, res) {
  // 1. Controllo di sicurezza: procediamo solo se è un POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  // 2. Incremento del contatore (ora funziona perché la funzione è async)
  try {
    await kv.incr('counter_noleggi');
  } catch (error) {
    console.error("Errore KV:", error);
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

  // 3. Logica Match Esatto
  const exactMatch = noleggi.find(n => n.name.toLowerCase() === inputLower);

  if (exactMatch) {
    return res.status(200).json({
      stato: "match_perfetto",
      match: exactMatch.name,
      suggerimento: null
    });
  }

  // 4. Logica Fuzzy
  const fuse = new Fuse(noleggi, {
    keys: ['name'],
    threshold: 0.4
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