require('dotenv').config();

const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

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

    try {
        const registerUrl = new URL('api/register', process.env.PIXEL_URL).toString();
        const res = await fetch(registerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: trackingId, email: recipient, status: 'sent' }),
        });
        if (!res.ok) {
            console.error('Register API error:', res.status, await res.text());
        }
    } catch (err) {
        console.error('Failed to call register API:', err);
    }

    console.log("-------------------------------------------------------");
    console.log("👉 MAIL : " + nodemailer.getTestMessageUrl(info));
    console.log("-------------------------------------------------------");
}

sendMail('test@gmail.com');