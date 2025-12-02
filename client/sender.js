require('dotenv').config();

const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function sendMail(recipient) {
    const trackingId = uuidv4();
    const pixelUrl = `${process.env.PIXEL_URL}api/track?id=${trackingId}`;

    await supabase.from('email_logs').insert([
        { id: trackingId, recipient_email: recipient, status: 'sent' }
    ]);

    try {
        const data = await resend.emails.send({
            from: 'Mon Entreprise <ne-pas-repondre@mon-domaine.com>',
            to: [recipient],
            subject: 'Votre facture',
            html: `
                <p>Bonjour,</p>
                <p>Voici le document demandé.</p>
                <img src="${pixelUrl}" alt="" width="1" height="1" border="0" style="display:block;" />
            `
        });

        console.log("Mail envoyé, ID Resend:", data.id);

    } catch (error) {
        console.error("Erreur Resend:", error);
    }
}

sendMail('test@gmail.com');