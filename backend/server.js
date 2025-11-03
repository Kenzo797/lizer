import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/links.js';
import connectDatabase from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());

await connectDatabase();


// tem que ter a barra antes !!!!!!!!!!!
app.use('/api/links', linkRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Lizer API is working !!!'});
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

