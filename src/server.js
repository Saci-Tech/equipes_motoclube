const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const equipesRoutes = require('./routes/equipes.routes');
const integrantesRoutes = require('./routes/integrantes.routes');
const equipamentosRoutes = require('./routes/equipamentos.routes');
const eventosRoutes = require('./routes/eventos.routes');

const app = express();
app.use(express.json());

// Registros dos roteadores com seus prefixos
app.use('/api/equipes', equipesRoutes);
app.use('/api/integrantes', integrantesRoutes);
app.use('/api/equipamentos', equipamentosRoutes);
app.use('/api/eventos', eventosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Equipes: http://localhost:${PORT}/api/equipes/ativas`);
    console.log(`Equipamentos: http://localhost:${PORT}/api/equipamentos`);
    console.log(`Eventos: http://localhost:${PORT}/api/eventos`);
});