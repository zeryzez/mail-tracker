import { supabase } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).send('Method Not Allowed');
    }

    const { secret, id } = req.query;

    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { error } = await supabase
            .from('email_logs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}