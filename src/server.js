const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const path = require('path');
const routes = require('./routes');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

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

// Agregador central de rotas (/api/...)
app.use('/api', routes);

// Inicia o servidor HTTP apenas se NÃO estiver em ambiente de teste
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.clear();
        console.log(`=============================================================`);
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Equipes: http://localhost:${PORT}/api/teams`);
        console.log(`Membros: http://localhost:${PORT}/api/members`);
        console.log(`Equipamentos: http://localhost:${PORT}/api/equipments`);
        console.log(`Eventos: http://localhost:${PORT}/api/events`);
        console.log(`Presenças: http://localhost:${PORT}/api/presences`);
        console.log(`=============================================================`);
        console.log(`Docs: http://localhost:${PORT}/api-docs`);
        console.log(`=============================================================`);
    });
}

module.exports = app;