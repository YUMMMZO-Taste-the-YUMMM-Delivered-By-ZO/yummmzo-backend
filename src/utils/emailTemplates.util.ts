export const getEmailTemplate = (type: string, payload: any) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const logoUrl = `${baseUrl}/logo.png`; 

    const colors = {
        primary: '#7ED300',      
        background: '#000A04',   
        surface: 'rgba(18, 26, 19, 0.8)', 
        text: '#FFFFFF',
        muted: '#A0A0A0',
        error: '#FF4B4B'
    };

    // Immersive background with a radial glow to simulate the "blur/glass" feel
    const baseStyles = `
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: ${colors.background};
        background-image: radial-gradient(circle at top right, #0a2a0a 0%, ${colors.background} 60%);
        color: ${colors.text};
        margin: 0;
        padding: 60px 20px;
    `;

    // Rounded like your footer (32px+) and using a subtle border-glow
    const containerStyles = `
        max-width: 560px;
        margin: 0 auto;
        background-color: #111912;
        border-radius: 48px;
        padding: 50px 40px;
        border: 1px solid rgba(126, 211, 0, 0.15);
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    `;

    const logoStyle = `
        width: 160px;
        height: auto;
        margin-bottom: 30px;
    `;

    // High-impact button with the primary glow
    const buttonStyles = `
        background-color: ${colors.primary};
        color: #000000;
        padding: 18px 40px;
        text-decoration: none;
        border-radius: 16px;
        font-weight: 800;
        font-size: 16px;
        display: inline-block;
        margin: 30px 0;
        box-shadow: 0 8px 25px rgba(126, 211, 0, 0.3);
        text-transform: uppercase;
        letter-spacing: 1px;
    `;

    const wrapTemplate = (content: string) => `
        <div style="${baseStyles}">
            <div style="${containerStyles}">
                <img src="${logoUrl}" alt="YUMMMZO" style="${logoStyle}" />
                ${content}
                <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: ${colors.muted}; letter-spacing: 2px;">
                    © 2026 YUMMMZO. BUILT BY ZO.
                </div>
            </div>
        </div>
    `;

    switch (type) {
        case 'VERIFICATION_EMAIL':
            return {
                subject: `One step closer to the YUMMM... 🚀`,
                html: wrapTemplate(`
                    <h2 style="font-size: 32px; line-height: 1.2; margin-bottom: 20px; font-weight: 900;">Confirm your <span style="color: ${colors.primary};">appetite!</span></h2>
                    <p style="font-size: 16px; color: #e0e0e0;">Hi ${payload.name}, we're ready to serve, but we need to make sure it's really you. Click below to verify and unlock the flavors.</p>
                    <a href="${payload.url}" style="${buttonStyles}">Verify Account</a>
                    <p style="font-size: 13px; color: ${colors.muted}; margin-top: 10px;">Link expires in 24 hours. Don't let it get cold.</p>
                `),
            };

        case 'WELCOME_EMAIL':
            return {
                subject: `Welcome to the Family, ${payload.name}! 🍔`,
                html: wrapTemplate(`
                    <h2 style="font-size: 32px; line-height: 1.2; margin-bottom: 20px; font-weight: 900;">Welcome to the <span style="color: ${colors.primary};">Family</span></h2>
                    <p style="font-size: 18px; font-weight: 600;">You’re officially a Yummmzo insider.</p>
                    <p style="font-size: 16px; color: #e0e0e0;">The kitchen is open and the chefs are ready. Your next favorite meal is just a tap away. Shall we find it?</p>
                    <a href="${baseUrl}/explore" style="${buttonStyles}">Feed Me Now</a>
                    <p style="margin-top: 20px; font-style: italic; color: ${colors.primary};">Stay hungry.</p>
                `),
            };

        case 'PASSWORD_RESET':
            return {
                subject: `Lost your key to the kitchen? 🔑`,
                html: wrapTemplate(`
                    <h2 style="font-size: 32px; margin-bottom: 20px; font-weight: 900;">Identity <span style="color: ${colors.primary};">Check!</span></h2>
                    <p style="font-size: 16px; color: #e0e0e0;">Hey ${payload.name}, forgot your password? No worries, it happens. Tap below to set a fresh one.</p>
                    <a href="${payload.resetLink}" style="${buttonStyles}">Reset Password</a>
                    <p style="font-size: 12px; color: ${colors.muted};">This link self-destructs in 10 minutes. Hurry!</p>
                `),
            };

        case 'PASSWORD_UPDATED':
            return {
                subject: `Your security just got a glow-up ✨`,
                html: wrapTemplate(`
                    <div style="font-size: 50px; margin-bottom: 20px;">🛡️</div>
                    <h2 style="font-size: 32px; margin-bottom: 20px; font-weight: 900;">Security <span style="color: ${colors.primary};">Leveled Up!</span></h2>
                    <p style="font-size: 16px; color: #e0e0e0;">Hi ${payload.name}, your password was successfully changed. Your account is now tighter than a well-wrapped burrito.</p>
                    <a href="${baseUrl}/login" style="${buttonStyles}">Back to App</a>
                `),
            };

        case 'PASSWORD_CHANGE_NOTIFICATION':
            return {
                subject: `Security Alert: Was this you? 🛡️`,
                html: wrapTemplate(`
                    <h2 style="font-size: 32px; color: ${colors.error}; font-weight: 900;">Was this you?</h2>
                    <p style="font-size: 16px; color: #e0e0e0;">Hi ${payload.name}, we noticed your password was recently changed. If this was you, you're all set!</p>
                    <div style="background: rgba(255, 75, 75, 0.1); padding: 25px; border-radius: 24px; margin: 30px 0; border: 1px solid rgba(255, 75, 75, 0.2);">
                        <p style="margin: 0; color: #fff; font-size: 14px;">If you <strong>did not</strong> change your password, someone might be trying to swipe your order. Secure it now.</p>
                    </div>
                    <a href="${baseUrl}/password-reset" style="background-color: ${colors.error}; border-radius: 16px; ${buttonStyles.split('background-color: ' + colors.primary + ';')[1]}">Secure Account</a>
                `),
            };

        default:
            return { 
                subject: 'Yummmzo Notification', 
                html: wrapTemplate(`<h2 style="font-weight: 900;">Update from Yummmzo</h2><p>Check your app for the latest flavors!</p>`) 
            };
    }
};