module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.API_TOKEN || 'secret-token';

    if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token inválido. Use: Bearer <token>' });
    }

    const token = parts[1];
    if (token !== expectedToken) {
        return res.status(403).json({ error: 'Token inválido ou não autorizado.' });
    }

    return next();
};