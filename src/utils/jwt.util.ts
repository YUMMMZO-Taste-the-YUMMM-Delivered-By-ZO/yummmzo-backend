import jwt from 'jsonwebtoken';

export function generateJWT(payload: any) {
    const secret_key = process.env.SECRET_KEY as string;
    const jwt_token = jwt.sign(payload , secret_key , { expiresIn: '1d' });
    return jwt_token;
};