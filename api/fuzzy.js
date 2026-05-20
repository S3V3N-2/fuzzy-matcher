import { kv } from '@vercel/kv';
import Fuse from 'fuse.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const inputCliente = (req.body.cliente || "").trim();

  // 1. FILTRO SICUREZZA LUNGHEZZA (Pulisce tutto se > 30 caratteri)
  if (inputCliente.length > 30) {
    return res.status(200).json({
      stato: "non_trovato",
      match: null,
      suggerimento: null
    });
  }

  // Incremento contatore (solo per input validi)
  try { await kv.incr('counter_noleggi'); } catch (e) {}

  const noleggi = [
    { name: "Vivarent" }, 
    { name: "Italy Car Rent" },
    { name: "All Rent - U-SAVE" },
    { name: "BuyFleet" },
    { name: "Ita Rent - Differental" },
    { name: "Clarent" },
    { name: "Stairway Rent" },
    { name: "Etna Rent" },
    { name: "Target Rent - 8Rent" },
    { name: "Noleggiora" },
    { name: "GN Claret" },
    { name: "Moventur" }
  ];

  const inputLower = inputCliente.toLowerCase();
  
  // 2. LOGICA MATCH ESATTO
  const exactMatch = noleggi.find(n => n.name.toLowerCase() === inputLower);
  if (exactMatch) {
    return res.status(200).json({
      stato: "match",
      match: exactMatch.name,
      suggerimento: null
    });
  }

  // 3. LOGICA FUZZY (Soglia 0.5)
  const fuse = new Fuse(noleggi, {
    keys: ['name'],
    threshold: 0.5 
  });

  const results = fuse.search(inputCliente);

  if (results.length > 0) {
    return res.status(200).json({
      stato: "suggerimento",
      match: null,
      suggerimento: results[0].item.name
    });
  } else {
    // 4. FALLBACK TOTALE A NULL
    return res.status(200).json({
      stato: "non_trovato",
      match: null,
      suggerimento: null
    });
  }
}