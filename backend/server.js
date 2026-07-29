import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/links.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import connectDatabase from './config/database.js';
import cookieParser from 'cookie-parser';

const app = express();

// Necessário na Vercel (atrás de proxy) para req.ip refletir o IP real do
// cliente via X-Forwarded-For (usado no bloqueio progressivo de login)
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

if (!process.env.JWT_SECRET) {
    console.warn('AVISO: JWT_SECRET não definido');
    console.warn('AVISO: usando chave temporária (apenas desenvolvimento)');
    process.env.JWT_SECRET = 'chave-temporaria-nao-usar-em-producao';
}

let cachedDb = null;

async function connectToDatabase() 
{
  if (cachedDb) return cachedDb;
  const db = await connectDatabase();
  cachedDb = db;
  return db;
}

// tem que ter a barra antes !!!!!!!!!!!
app.use('/api/links', linkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lizer API is working !!!' });
});

//desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`WAAY Server running on port ${PORT}`);
  });
}

//vercel (Serverless)
export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}