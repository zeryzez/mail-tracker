import { supabase } from '../lib/db';

export default async function handler(req, res) {
    const { secret, page = 1, limit = 10 } = req.query
    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try {
        const { data, count, error } = await supabase
            .from('email_logs')
            .select('*', { count: 'exact' })
            .order('sent_at', { ascending: false })
            .range(from, to);
        if (error) throw error;

        res.status(200).json({ data, total: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}