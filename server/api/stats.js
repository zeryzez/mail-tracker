import { supabase } from '../lib/db';

export default async function handler(req, res) {
    const { secret } = req.query;

    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { data, error } = await supabase
            .from('email_logs')
            .select('*')
            .order('opened_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}