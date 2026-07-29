import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) 
{
    let token = req.cookies?.token;

    if(!token)
    {
        const authHeader = req.headers.authorization;

        if(authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if(!token)
    {
        return res.status(401).json({ message: 'Token não fornecido'});
    }
  
    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}