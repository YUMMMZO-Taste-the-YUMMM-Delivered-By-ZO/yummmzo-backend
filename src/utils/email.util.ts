import { transporter } from "@/config/email";
import { getEmailTemplate } from "./emailTemplates.util";

export async function sendEmail(to: string, type: string, payload: any) {
    try {
        const { subject, html } = getEmailTemplate(type, payload);

        const info = await transporter.sendMail({
            from: `"Yummmzo Team" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`📧 Message sent: ${info.messageId}`);
        return info;
    } 
    catch (error) {
        console.error('❌ Error while sending email:', error);
        throw error;
    };
};