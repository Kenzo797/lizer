import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/links.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import connectDatabase from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());

await connectDatabase();


// console.log('🔍 Link Routes importado:', typeof linkRoutes);
// console.log('🔍 Link Routes:', linkRoutes);

// tem que ter a barra antes !!!!!!!!!!!
app.use('/api/links', linkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Lizer API is working !!!'});
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

