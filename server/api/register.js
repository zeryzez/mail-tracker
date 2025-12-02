import { supabase } from '../lib/db';

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

async function handler(req, res) {
    if (req.method === 'POST') {
        const { id, email, status } = req.body;

        const { error } = await supabase
            .from('email_logs')
            .insert([{
                id,
                recipient_email: email,
                status: status || 'sent',
                sent_at: new Date()
            }]);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Success' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}

export default allowCors(handler);