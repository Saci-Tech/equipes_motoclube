const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Janela de 15 minutos
    max: 100, // Limite de 100 requisições por IP por janela
    standardHeaders: true, // Retorna informação do limite nos cabeçalhos `RateLimit-*`
    legacyHeaders: false, // Desativa os cabeçalhos legados `X-RateLimit-*`
    message: { error: 'Muitas requisições originadas deste IP, tente novamente mais tarde.' }
});

module.exports = limiter;