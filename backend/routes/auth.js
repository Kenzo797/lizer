import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import * as userModel from '../models/Users.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Limita tentativas de login por IP para dificultar força bruta de senha
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas tentativas de login. Tente novamente em alguns minutos.' }
});


// Rota para cadastro

router.post('/register', async (req, res) => {

    try
    {
        const { name, email, password } = req.body;

        const existingUser = await userModel.getByQuery({ email });

        if(existingUser)
        {
            return res.status(400).json({ message: 'Email já cadastrado'});
        }

        const result = await userModel.onSave({ name, email, password });

        const token = jwt.sign(
            { id: result.insertedId, email},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            user: {
                id: result.insertedId,
                name,
                email
            }
        });

    }
    catch(error)
    {
        console.error('Falha no cadastro: ', error);
        res.status(500).json({ message: 'Falha interna no servidor' });
    }
});



router.post('/login', loginLimiter, async (req, res) => {
    try
    {
        const { email, password } = req.body;

        if(!email || !password)
        {
            return res.status(400).json({ message: 'Email e senha são obrigatóorios' });
        }

        const user = await userModel.getByQuery({ email });

        if(!user)
        {
            return res.status(401).json({ message: ' Email ou senha inválidos '});
        }


        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if(!isValidPassword)
        {
            return res.status(401).json({ message: ' Email ou senha inválidos '});
        }

        const token = jwt.sign(
            {id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch(error)
    {
        console.error('Falha ao realizar o login: ', error);
        res.status(500).json({ message: 'Falha interna no servidor'});
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try
    {
        const user = await userModel.getById(req.userId);

        if(!user)
        {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch(error)
    {
        console.error('Falha ao obter usuário: ', error);
        res.status(500).json({ message: 'Falha interna no servidor' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.json({message: 'logout realizado com sucesso'});
});

export default router;