require('dotenv').config();

const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function sendMail(recipient) {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    const trackingId = uuidv4();
    const pixelUrl = `${process.env.PIXEL_URL}api/track?id=${trackingId}`;
    let info = await transporter.sendMail({
        from: `"Moi" <${testAccount.user}>`,
        to: recipient,
        subject: "Test Gmail Pixel",
        html: `
        <h1>Hello!</h1>
        <p>If you are reading this, the pixel should have triggered.</p>
        <img src="${pixelUrl}" width="1" height="1" />
        `,
    });

    await supabase.from('email_logs').insert([
        { id: trackingId, recipient_email: recipient, status: 'sent', sent_at: new Date() }
    ]);

    console.log("-------------------------------------------------------");
    console.log("👉 MAIL : " + nodemailer.getTestMessageUrl(info));
    console.log("-------------------------------------------------------");
}

sendMail('test@gmail.com');