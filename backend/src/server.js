import app from './app.js';
import connectDB from './config/database.js';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cookieParser());

const startServer = async () => {
  await connectDB();
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`External access via: http://${HOST}:${PORT}`);
  });
};

startServer();
