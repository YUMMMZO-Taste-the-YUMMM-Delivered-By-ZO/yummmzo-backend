import express from 'express';
import routes from './routes';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: [
        "https://yummmzo.com",
        "https://www.yummmzo.com",
        process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'YUMMMZO API is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/v1' , routes);

app.use(globalErrorHandler);

export default app;