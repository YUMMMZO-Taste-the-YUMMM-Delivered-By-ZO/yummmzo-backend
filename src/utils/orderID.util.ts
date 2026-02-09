import { customAlphabet } from 'nanoid'

const generateNumbers = customAlphabet('1234567890' , 6);

export function generateOrderID() {
    const orderNumber = `YUMMM-${generateNumbers()}`;
    return orderNumber;
};