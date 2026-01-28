import express from 'express';
import routes from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

app.use('/api/v1' , routes);

app.use(globalErrorHandler);

export default app;