// lib/db.js
import { createClient } from '@supabase/supabase-js';

// On vérifie que les clés sont bien là pour éviter des erreurs bizarres
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('ERREUR : Les variables d\'environnement Supabase sont manquantes.');
}

// On crée l'instance de connexion unique
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);