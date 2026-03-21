import app from './app.js';
import connectDB from './config/database.js';
import 'dotenv/config';

const PORT = 3000;
const HOST = '0.0.0.0';

const startServer = async () => {
  await connectDB();
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`External access via: http://${HOST}:${PORT}`);
  });
};

startServer();
