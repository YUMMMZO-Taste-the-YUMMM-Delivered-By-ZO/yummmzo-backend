import express from 'express';
import routes from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1' , routes);

app.use(globalErrorHandler);

export default app;