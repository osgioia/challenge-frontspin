import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import { initializeDatabase } from './services/pgService';
import { config } from './config';

const app = express();

// Initialize PostgreSQL database with TypeORM
initializeDatabase().catch(error => {
  console.error('Error initializing database:', error);
  process.exit(1);
});

app.use(express.json());
app.use('/', routes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;