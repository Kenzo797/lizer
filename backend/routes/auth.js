import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/Users.js';

const router = express.Router();


// Rota para cadastro

router.post('/register', async (req, res) => {

    try
    {
        const { name, email, password } = req.body;

        const existingUser = await userModel.getByQuery({ email });

        if(existingUser)
        {
            return res.status(404).json({ message: 'Email já cadastrado'});
        }

        const result = await userModel.onSave({ name, email, password });

        const token = jwt.sign(
            { id: result.insertedId, email},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.status(201).json({
            token,
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



router.post('/login', async (req, res) => {
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
            return res.status(401).json({ message: '1 Email ou senha inválidos '});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if(!isValidPassword)
        {
            return res.status(401).json({ message: '2 Email ou senha inválidos '});
        }

        const token = jwt.sign(
            {id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.json({
            token, user: {
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

export default router;