export const getEmailTemplate = (type: string, payload: any) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const colors = {
        primary: '#7ED300',
        primaryDark: '#5fa000',
        background: '#000A04',
        surface: '#0d1a0e',
        surfaceLight: '#152316',
        text: '#FFFFFF',
        muted: '#8a9a8b',
        border: 'rgba(126, 211, 0, 0.2)',
        error: '#FF4B4B'
    };

    const baseStyles = `
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: ${colors.background};
        margin: 0;
        padding: 40px 16px;
    `;

    const containerStyles = `
        max-width: 580px;
        margin: 0 auto;
        background-color: ${colors.surface};
        border-radius: 32px;
        overflow: hidden;
        border: 1px solid ${colors.border};
        box-shadow: 0 24px 60px rgba(0,0,0,0.6);
    `;

    const headerStyles = `
        background: linear-gradient(135deg, #0d1a0e 0%, #0a2a0a 50%, #0d1a0e 100%);
        padding: 40px 40px 36px;
        text-align: center;
        border-bottom: 1px solid ${colors.border};
        position: relative;
    `;

    const brandStyles = `
        font-size: 36px;
        font-weight: 900;
        letter-spacing: -1px;
        color: ${colors.text};
        font-style: italic;
        text-transform: uppercase;
        margin: 0;
        line-height: 1;
    `;

    const taglineStyles = `
        font-size: 11px;
        color: ${colors.primary};
        letter-spacing: 4px;
        text-transform: uppercase;
        font-weight: 600;
        margin-top: 8px;
    `;

    const bodyStyles = `
        padding: 44px 40px;
        text-align: center;
    `;

    const h2Styles = `
        font-size: 28px;
        font-weight: 900;
        color: ${colors.text};
        margin: 0 0 16px;
        line-height: 1.2;
        letter-spacing: -0.5px;
    `;

    const pStyles = `
        font-size: 15px;
        color: ${colors.muted};
        line-height: 1.7;
        margin: 0 0 24px;
    `;

    const buttonStyles = `
        background-color: ${colors.primary};
        color: #000000;
        padding: 16px 44px;
        text-decoration: none;
        border-radius: 14px;
        font-weight: 800;
        font-size: 14px;
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        box-shadow: 0 8px 24px rgba(126, 211, 0, 0.35);
    `;

    const dividerStyles = `
        height: 1px;
        background: ${colors.border};
        margin: 32px 0;
        border: none;
    `;

    const footerStyles = `
        padding: 24px 40px;
        text-align: center;
        background-color: #0a120b;
        border-top: 1px solid ${colors.border};
    `;

    const footerTextStyles = `
        font-size: 11px;
        color: ${colors.muted};
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 0;
        line-height: 1.8;
    `;

    const pillStyles = `
        display: inline-block;
        background: rgba(126, 211, 0, 0.1);
        border: 1px solid ${colors.border};
        color: ${colors.primary};
        padding: 6px 18px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 20px;
    `;

    const cardStyles = `
        background: ${colors.surfaceLight};
        border: 1px solid ${colors.border};
        border-radius: 20px;
        padding: 24px;
        margin: 24px 0;
        text-align: left;
    `;

    const wrapTemplate = (content: string, headerExtra?: string) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="${baseStyles}">
            <div style="${containerStyles}">

                <!-- HEADER / BRAND -->
                <div style="${headerStyles}">
                    <p style="${brandStyles}">
                        YUMMM<span style="color: ${colors.primary};">ZO</span>
                    </p>
                    <p style="${taglineStyles}">Taste the Yummm · Delivered by Zo</p>
                    ${headerExtra || ''}
                </div>

                <!-- BODY -->
                <div style="${bodyStyles}">
                    ${content}
                </div>

                <!-- FOOTER -->
                <div style="${footerStyles}">
                    <p style="${footerTextStyles}">
                        © 2026 YUMMMZO · Built with ❤️ by Zo<br/>
                        <span style="color: rgba(138, 154, 139, 0.5);">yummmzo.team@gmail.com</span>
                    </p>
                </div>

            </div>
        </body>
        </html>
    `;

    switch (type) {

        case 'VERIFICATION_EMAIL':
            return {
                subject: `Verify your account, ${payload.name} 🚀`,
                html: wrapTemplate(`
                    <span style="${pillStyles}">Action Required</span>
                    <h2 style="${h2Styles}">
                        Confirm your <span style="color: ${colors.primary};">appetite!</span>
                    </h2>
                    <p style="${pStyles}">
                        Hey ${payload.name}, we're almost there! Click below to verify your email and unlock access to the tastiest food delivery platform.
                    </p>
                    <a href="${payload.url}" style="${buttonStyles}">Verify My Account</a>
                    <hr style="${dividerStyles}" />
                    <p style="font-size: 12px; color: ${colors.muted}; margin: 0;">
                        ⏳ Link expires in <strong style="color: ${colors.text};">24 hours</strong>. Don't let it go cold.
                    </p>
                `),
            };

        case 'WELCOME_EMAIL':
            return {
                subject: `Welcome to YUMMMZO, ${payload.name}! 🍔`,
                html: wrapTemplate(`
                    <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">🎉</div>
                    <span style="${pillStyles}">You're In!</span>
                    <h2 style="${h2Styles}">
                        Welcome to the <span style="color: ${colors.primary};">Family!</span>
                    </h2>
                    <p style="${pStyles}">
                        You're officially a Yummmzo insider, ${payload.name}. The kitchen is open, the chefs are ready, and your next favorite meal is just a tap away.
                    </p>
                    <a href="${baseUrl}/home" style="${buttonStyles}">Start Exploring</a>
                    <hr style="${dividerStyles}" />
                    <p style="font-size: 13px; font-style: italic; color: ${colors.primary}; margin: 0;">
                        "Stay Hungry. Stay Yummmzo."
                    </p>
                `),
            };

        case 'PASSWORD_RESET':
            return {
                subject: `Reset your password — YUMMMZO 🔑`,
                html: wrapTemplate(`
                    <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">🔑</div>
                    <span style="${pillStyles}">Password Reset</span>
                    <h2 style="${h2Styles}">
                        Lost your <span style="color: ${colors.primary};">key?</span>
                    </h2>
                    <p style="${pStyles}">
                        Hey ${payload.name}, no worries — it happens to the best of us. Click below to set a fresh password and get back to ordering.
                    </p>
                    <a href="${payload.resetLink}" style="${buttonStyles}">Reset Password</a>
                    <hr style="${dividerStyles}" />
                    <p style="font-size: 12px; color: ${colors.muted}; margin: 0;">
                        ⚡ This link expires in <strong style="color: ${colors.text};">10 minutes.</strong> If you didn't request this, ignore this email.
                    </p>
                `),
            };

        case 'PASSWORD_UPDATED':
            return {
                subject: `Password updated successfully ✅`,
                html: wrapTemplate(`
                    <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">🛡️</div>
                    <span style="${pillStyles}">Security Update</span>
                    <h2 style="${h2Styles}">
                        You're all <span style="color: ${colors.primary};">secured!</span>
                    </h2>
                    <p style="${pStyles}">
                        Hi ${payload.name}, your password has been successfully updated. Your account is locked and loaded.
                    </p>
                    <a href="${baseUrl}/home" style="${buttonStyles}">Back to App</a>
                    <hr style="${dividerStyles}" />
                    <p style="font-size: 12px; color: ${colors.muted}; margin: 0;">
                        If you didn't make this change, contact us immediately at yummmzo.team@gmail.com
                    </p>
                `),
            };

        case 'PASSWORD_CHANGE_NOTIFICATION':
            return {
                subject: `Security Alert: Was this you? 🛡️`,
                html: wrapTemplate(`
                    <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">⚠️</div>
                    <span style="display: inline-block; background: rgba(255,75,75,0.1); border: 1px solid rgba(255,75,75,0.3); color: ${colors.error}; padding: 6px 18px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;">Security Alert</span>
                    <h2 style="${h2Styles}">
                        Was this <span style="color: ${colors.error};">you?</span>
                    </h2>
                    <p style="${pStyles}">
                        Hi ${payload.name}, we noticed your password was recently changed. If this was you — great, you're all set!
                    </p>
                    <div style="background: rgba(255,75,75,0.08); border: 1px solid rgba(255,75,75,0.2); border-radius: 16px; padding: 20px 24px; margin: 0 0 28px; text-align: left;">
                        <p style="margin: 0; color: #fff; font-size: 14px; line-height: 1.6;">
                            🚨 If you <strong>did not</strong> make this change, your account may be at risk. Secure it immediately.
                        </p>
                    </div>
                    <a href="${baseUrl}/reset-password" style="background-color: ${colors.error}; color: #fff; padding: 16px 44px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 1.5px;">Secure My Account</a>
                `),
            };

        case 'ORDER_CONFIRMATION':
            return {
                subject: `Order confirmed! Your food is on its way 🍔`,
                html: wrapTemplate(`
                    <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">✅</div>
                    <span style="${pillStyles}">Order Confirmed</span>
                    <h2 style="${h2Styles}">
                        Your order is <span style="color: ${colors.primary};">placed!</span>
                    </h2>
                    <p style="${pStyles}">
                        We've received your order and the restaurant is already getting to work. Sit tight — good food is coming your way!
                    </p>

                    <div style="${cardStyles}">
                        <p style="margin: 0 0 12px; font-size: 12px; color: ${colors.muted}; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Order Summary</p>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 14px; color: ${colors.muted};">Order ID</span>
                            <span style="font-size: 14px; color: ${colors.text}; font-weight: 700;">${payload.orderNumber}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 14px; color: ${colors.muted};">Total Amount</span>
                            <span style="font-size: 16px; color: ${colors.primary}; font-weight: 800;">₹${payload.totalAmount}</span>
                        </div>
                    </div>

                    <a href="${baseUrl}/track/${payload.orderId}" style="${buttonStyles}">Track My Order</a>
                    <hr style="${dividerStyles}" />
                    <p style="font-size: 12px; color: ${colors.muted}; margin: 0;">
                        Questions? Reply to this email or contact us at yummmzo.team@gmail.com
                    </p>
                `),
            };

        case 'ORDER_CANCELLATION':
            return {
                subject: `Order cancelled — ${payload.orderNumber}`,
                html: wrapTemplate(`
                    <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">❌</div>
                    <span style="display: inline-block; background: rgba(255,75,75,0.1); border: 1px solid rgba(255,75,75,0.3); color: ${colors.error}; padding: 6px 18px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;">Order Cancelled</span>
                    <h2 style="${h2Styles}">
                        Your order has been <span style="color: ${colors.error};">cancelled</span>
                    </h2>
                    <p style="${pStyles}">
                        Your order <strong style="color: ${colors.text};">${payload.orderNumber}</strong> has been successfully cancelled. If you paid online, a refund will be processed within 5-7 business days.
                    </p>

                    <a href="${baseUrl}/home" style="${buttonStyles}">Order Again</a>
                    <hr style="${dividerStyles}" />
                    <p style="font-size: 12px; color: ${colors.muted}; margin: 0;">
                        We're sorry to see this order go. We hope to serve you again soon! 🙏
                    </p>
                `),
            };

        default:
            return {
                subject: 'Update from YUMMMZO',
                html: wrapTemplate(`
                    <h2 style="${h2Styles}">Hey there! 👋</h2>
                    <p style="${pStyles}">You have a new update from YUMMMZO. Check the app for the latest.</p>
                    <a href="${baseUrl}/home" style="${buttonStyles}">Open App</a>
                `)
            };
    }
};