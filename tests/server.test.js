// =========================================================================
// TESTE UNITÁRIO DO SERVIDOR: server.test.js
// =========================================================================

const request = require('supertest');
const app = require('../src/server');

jest.mock('../src/routes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/test-route', (req, res) => res.status(200).json({ ok: true }));
    return router;
});

describe('Server App (src/server.js)', () => {
    it('deve ter montado o agregador de rotas no prefixo /api', async () => {
        const res = await request(app).get('/api/test-route');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
    });
});