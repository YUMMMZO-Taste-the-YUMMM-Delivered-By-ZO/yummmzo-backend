export const getEmailTemplate = (type: string, payload: any) => {
    const baseStyles = `font-family: sans-serif; color: #333; line-height: 1.6;`;

    switch (type) {
        case 'WELCOME_EMAIL':
            return {
                subject: `Welcome to Yummmzo, ${payload.name}! 🍔`,
                html: `
                    <div style="${baseStyles}">
                        <h1>Hello, ${payload.name}!</h1>
                        <p>We're so excited to have you on board. Start exploring our delicious collection.</p>
                        <a href="https://yummmzo.com/explore" style="background: #e63946; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Explore Now</a>
                    </div>
                `,
            };

        case 'ORDER_CONFIRMATION':
            return {
                subject: `Order Confirmed - #${payload.orderId}`,
                html: `
                    <div style="${baseStyles}">
                        <h2>Great News, ${payload.name}!</h2>
                        <p>Your order <strong>#${payload.orderId}</strong> has been confirmed and is being prepared.</p>
                        <p>Total Amount: <strong>₹${payload.amount}</strong></p>
                    </div>
                `,
            };

        case 'PASSWORD_RESET':
            return {
                subject: 'Reset Your Password - Yummmzo',
                html: `
                    <div style="${baseStyles}">
                        <p>Hi ${payload.name},</p>
                        <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
                        <a href="${payload.resetLink}" style="background: #457b9d; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    </div>
                `,
            };

        default:
            return { subject: 'Yummmzo Notification', html: '<p>Notification from Yummmzo</p>' };
    }
};