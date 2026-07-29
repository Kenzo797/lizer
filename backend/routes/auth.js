import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/Users.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Controle de força bruta no login, com bloqueio progressivo por IP.
// Erros até MAX_FREE_ATTEMPTS não bloqueiam; a partir daí cada novo erro
// bloqueia por um tempo maior, seguindo LOCKOUT_SCHEDULE_MINUTES.
const MAX_FREE_ATTEMPTS = 10;
const LOCKOUT_SCHEDULE_MINUTES = [1, 2, 4, 8, 15];
const IDLE_RESET_MS = 60 * 60 * 1000;

const loginAttempts = new Map();

function getLoginKey(req)
{
    return req.ip;
}

function getAttemptRecord(key)
{
    const record = loginAttempts.get(key);

    if (!record) return null;

    const now = Date.now();
    const isIdle = now > record.lockUntil && (now - record.lastAttempt) > IDLE_RESET_MS;

    if (isIdle)
    {
        loginAttempts.delete(key);
        return null;
    }

    return record;
}

function loginThrottle(req, res, next)
{
    const record = getAttemptRecord(getLoginKey(req));
    const now = Date.now();

    if (record && record.lockUntil > now)
    {
        const minutesLeft = Math.max(1, Math.ceil((record.lockUntil - now) / 60000));

        return res.status(429).json({
            message: `Muitas tentativas de login. Tente novamente em ${minutesLeft} minuto${minutesLeft > 1 ? 's' : ''}.`,
            retryAfterMinutes: minutesLeft
        });
    }

    next();
}

function registerFailedLogin(req)
{
    const key = getLoginKey(req);
    const now = Date.now();
    const record = getAttemptRecord(key) || { strikes: 0, lockUntil: 0, lastAttempt: now };

    record.strikes += 1;
    record.lastAttempt = now;

    if (record.strikes > MAX_FREE_ATTEMPTS)
    {
        const level = Math.min(record.strikes - MAX_FREE_ATTEMPTS - 1, LOCKOUT_SCHEDULE_MINUTES.length - 1);
        record.lockUntil = now + LOCKOUT_SCHEDULE_MINUTES[level] * 60 * 1000;
    }

    loginAttempts.set(key, record);
}

function clearFailedLogins(req)
{
    loginAttempts.delete(getLoginKey(req));
}


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



router.post('/login', loginThrottle, async (req, res) => {
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
            registerFailedLogin(req);
            return res.status(401).json({ message: ' Email ou senha inválidos '});
        }


        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword)
        {
            registerFailedLogin(req);
            return res.status(401).json({ message: ' Email ou senha inválidos '});
        }

        clearFailedLogins(req);

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