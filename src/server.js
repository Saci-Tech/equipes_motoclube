const express = require('express');
const helmet = require('helmet');
const expressOasGenerator = require('express-oas-generator');
const path = require('path');
const routes = require('./routes');
const authMiddleware = require('./middlewares/authMiddleware');
const rateLimiter = require('./middlewares/rateLimiter');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Proteção de cabeçalhos HTTP via Helmet
app.use(helmet());

// Aplicação de Rate Limiting global
app.use(rateLimiter);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    expressOasGenerator.init(
        app, 
        function(spec) { return spec; }, 
        path.join(__dirname, '../openapi/openapi.json'), 
        0,                                                  
        'api-docs',                                       
        undefined, undefined, undefined, true,
        expressOasGenerator.RECREATE
    ); 
}

app.use(express.json());

// Aplica o middleware de autenticação em todas as rotas com prefixo /api
app.use('/api', authMiddleware, routes);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.clear();
        console.log(`=============================================================`);
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`=============================================================`);
    });
}

module.exports = app;