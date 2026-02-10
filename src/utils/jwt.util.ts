import jwt from 'jsonwebtoken';

export function generateJWT(payload: any) {
    const secret_key = process.env.SECRET_KEY as string;
    const jwt_token = jwt.sign(payload , secret_key , { expiresIn: '1d' });
    return jwt_token;
};

export function verifyJWT(jwt_token: string) {
    const secret_key = process.env.SECRET_KEY as string;
    const decoded = jwt.verify(jwt_token , secret_key);
    return decoded;
};