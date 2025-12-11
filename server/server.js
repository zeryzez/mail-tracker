import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import trackHandler from './api/track.js';
import statsHandler from './api/stats.js';
import registerHandler from './api/register.js';
import deleteHandler from './api/delete.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/track', trackHandler);
app.get('/api/stats', statsHandler);
app.post('/api/register', registerHandler);
app.delete('/api/delete', deleteHandler);

app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    console.log(`📂 Dashboard accessible sur http://localhost:${PORT}/`);
});