import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMPT_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify((error , success) => {
    if(error){
        console.error('❌ Mail Server Connection Error:', error);
    }
    else{
        console.log('✅ Mail Server is ready to take our messages.');
    }
});