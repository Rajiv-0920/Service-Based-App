import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './api/routes/index.js';

const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.use('/api', apiRoutes);

export default app;
