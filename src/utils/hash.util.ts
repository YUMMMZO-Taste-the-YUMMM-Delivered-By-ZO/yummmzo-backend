import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    try {
        const salt = 12;
        const hashedPassword = await bcrypt.hash(password , salt);
        return hashedPassword;
    }
    catch (error) {
        throw new Error(`Error Hashing Password : ${error}`);
    }
};

export async function comparePassword(plain: string , hashed: string) {
    try {
        const isMatch = await bcrypt.compare(plain , hashed);
        return isMatch;
    }
    catch (error) {
        throw new Error(`Error Comparing Password : ${error}`);
    }
};