const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const equipesRoutes = require('./routes/equipes.routes');
const integrantesRoutes = require('./routes/integrantes.routes');
const equipamentosRoutes = require('./routes/equipamentos.routes');
const eventosRoutes = require('./routes/eventos.routes');
const presencasRoutes = require('./routes/presencas.routes');

const app = express();

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

// Registros dos roteadores com seus prefixos
app.use('/api/equipes', equipesRoutes);
app.use('/api/integrantes', integrantesRoutes);
app.use('/api/equipamentos', equipamentosRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/presencas', presencasRoutes);

// Inicia o servidor HTTP apenas se NÃO estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        // Endpoints de tabelas
        console.clear();
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Equipes: http://localhost:${PORT}/api/equipes/ativas`);
        console.log(`Equipamentos: http://localhost:${PORT}/api/equipamentos`);
        console.log(`Eventos: http://localhost:${PORT}/api/eventos`);
        console.log(`Presenças: http://localhost:${PORT}/api/presencas`);

        // Endpoint do Swagger
        console.log(`Docs: http://localhost:${PORT}/api-docs`);
    });
}

// Exporta a instância do Express para os testes no Jest / Supertest
module.exports = app;