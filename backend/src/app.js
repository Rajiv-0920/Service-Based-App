import express from 'express';
import cors from 'cors';
import apiRoutes from './api/routes/index.js';

const app = express();

app.use(express.json());

app.use('/api', apiRoutes);

export default app;
