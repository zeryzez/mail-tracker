import { supabase } from '../lib/db';

const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export default async function handler(req, res) {

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const urlObj = new URL(req.url, `${protocol}://${host}`);
    const id = urlObj.searchParams.get('id');

    const userAgent = (req.headers['user-agent'] || '').toLowerCase();

    const isBot = [
        'bot',
        'crawler',
        'spider',
        'googlebot',
        'bingbot',
        'slurp',
        'duckduckbot',
        'baidu',
        'yandex',
        'sogou',
        'exabot',
        'facebookexternalhit',
        'facebot',
        'ia_archiver',
        'python',
        'curl',
        'wget'
    ].some(botKeyword => userAgent.includes(botKeyword));

    if (id && !isBot) {
        if (req.methode === 'GET') {
            try {
                const { data: existingRow, error: checkError } = await supabase
                    .from('email_logs')
                    .select('id')
                    .eq('id', id)
                    .maybeSingle();

                if (checkError) throw checkError;

                const infoClient = {
                    ip: req.headers['x-forwarded-for'] || 'Inconnue',
                    user_agent: req.headers['user-agent'],
                    opened_at: new Date(),
                    status: 'opened'
                };

                if (existingRow) {
                    await supabase
                        .from('email_logs')
                        .update(infoClient)
                        .eq('id', id);
                } else {
                    await supabase
                        .from('email_logs')
                        .insert([
                            {
                                id: id,
                                ...infoClient
                            }
                        ]);
                }

            } catch (err) {
                console.error('Code error:', err);
            }
        }
    }

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send(PIXEL);
}