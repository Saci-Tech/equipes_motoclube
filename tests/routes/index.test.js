// =========================================================================
// TESTE UNITÁRIO DO AGREGADOR DE ROTAS: index.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes/index');

jest.mock('../../src/routes/equipmentRoutes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/', (req, res) => res.status(200).send('equipments ok'));
    return router;
});

jest.mock('../../src/routes/presenceRoutes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/', (req, res) => res.status(200).send('presences ok'));
    return router;
});

jest.mock('../../src/routes/memberRoutes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/', (req, res) => res.status(200).send('members ok'));
    return router;
});

jest.mock('../../src/routes/teamRoutes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/', (req, res) => res.status(200).send('teams ok'));
    return router;
});

jest.mock('../../src/routes/eventRoutes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/', (req, res) => res.status(200).send('events ok'));
    return router;
});

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Aggregated Routes (src/routes/index.js)', () => {
    it('deve direcionar /api/equipments para equipmentRoutes', async () => {
        const res = await request(app).get('/api/equipments');
        expect(res.status).toBe(200);
        expect(res.text).toBe('equipments ok');
    });

    it('deve direcionar /api/presences para presenceRoutes', async () => {
        const res = await request(app).get('/api/presences');
        expect(res.status).toBe(200);
        expect(res.text).toBe('presences ok');
    });

    it('deve direcionar /api/members para memberRoutes', async () => {
        const res = await request(app).get('/api/members');
        expect(res.status).toBe(200);
        expect(res.text).toBe('members ok');
    });

    it('deve direcionar /api/teams para teamRoutes', async () => {
        const res = await request(app).get('/api/teams');
        expect(res.status).toBe(200);
        expect(res.text).toBe('teams ok');
    });

    it('deve direcionar /api/events para eventRoutes', async () => {
        const res = await request(app).get('/api/events');
        expect(res.status).toBe(200);
        expect(res.text).toBe('events ok');
    });
});