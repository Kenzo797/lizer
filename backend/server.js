import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/links.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import connectDatabase from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());

await connectDatabase();

if(!process.env.JWT_SECRET)
{
    console.warn('AVISO: JWT_SECRET ,não definido');
    console.warn('AVISO: usando chave temporaria');
    process.env.JWT_SECRET = 'chave-temporaria-nao-usar-em-producao';
}


// tem que ter a barra antes !!!!!!!!!!!
app.use('/api/links', linkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Lizer API is working !!!'});
});

const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//pra rodar o servidor do back só rodar "node server.js"
//se der erro olhar o ip no mongodb!!!