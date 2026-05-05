import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Recupera il valore aggiornato dal database Upstash
    // Se la chiave non esiste ancora, restituiamo 0
    const total = await kv.get('counter_noleggi') || 0;
    
    // Restituiamo il dato in formato JSON
    return res.status(200).json({ total });
  } catch (error) {
    console.error("Errore recupero statistiche:", error);
    return res.status(500).json({ error: "Errore interno del database" });
  }
}