import { supabase } from '../lib/db';

const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export default async function handler(req, res) {

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const urlObj = new URL(req.url, `${protocol}://${host}`);
    const id = urlObj.searchParams.get('id');

    if (id) {
        try {
            const { error } = await supabase
                .from('email_opens')
                .insert([
                    {
                        user_id: id,
                        ip: req.headers['x-forwarded-for'] || 'unknown',
                        user_agent: req.headers['user-agent']
                    }
                ]);

            if (error) console.error('Code error:', error);
            else console.log(`Success: Tracked open for ID ${id}`);

        } catch (err) {
            console.error('Code error:', err);
        }
    }

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send(PIXEL);
}