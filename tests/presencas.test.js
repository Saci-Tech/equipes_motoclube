// =========================================================================
// TESTE DE INTEGRAÇÃO: Rotas de Presença
// ARQUIVO: tests/presencas.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');

// Mock do módulo de banco de dados antes de importar a rota
jest.mock('../src/config/database', () => ({
    query: jest.fn()
}));

const pool = require('../src/config/database');
const presencasRouter = require('../src/routes/presencas.routes');

// Configura uma instância simplificada do Express para os testes
const app = express();
app.use(express.json());
app.use('/api/presencas', presencasRouter);

describe('Rotas de Presença (/api/presencas)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/presencas', () => {
        it('Deve retornar a lista de presenças confirmadas com sucesso', async () => {
            // Simula o retorno do MySQL
            const mockRows = [
                {
                    id: 1,
                    id_evento: 10,
                    nome_evento: 'Reunião Semanal',
                    id_integrante: 5,
                    nome_colete: 'Guerreiro',
                    presente: 1,
                    justificativa_falta: null,
                    justificativa_aceita: 0,
                    data_criacao: '22/09/2026 10:00:00'
                }
            ];

            pool.query.mockResolvedValueOnce([mockRows]);

            const res = await request(app).get('/api/presencas');

            expect(res.statusCode).toEqual(200);
            expect(res.body.sucesso).toBe(true);
            expect(res.body.total).toBe(1);
            expect(res.body.dados[0].nome_colete).toBe('Guerreiro');
        });

        it('Deve tratar erro do banco de dados e retornar status 500', async () => {
            const spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});
            pool.query.mockRejectedValueOnce(new Error('Erro de conexão com o banco'));

            const res = await request(app).get('/api/presencas');

            expect(res.statusCode).toEqual(500);
            expect(res.body.sucesso).toBe(false);

            spyConsole.mockRestore(); // Restaura o comportamento padrão do console.error
        });
    });

    describe('POST /api/presencas/validar', () => {
        it('Deve retornar erro 400 se faltarem parâmetros obrigatórios', async () => {
            const res = await request(app)
                .post('/api/presencas/validar')
                .send({ id_evento: 1 }); // Faltam chave_qr, id_integrante e uuid_dispositivo

            expect(res.statusCode).toEqual(400);
            expect(res.body.sucesso).toBe(false);
            expect(res.body.mensagem).toContain('Dados incompletos');
        });

        it('Deve retornar erro 401 se o UUID do dispositivo for divergente', async () => {
            // Mock 1: Busca o integrante
            pool.query.mockResolvedValueOnce([
                [{ id: 1, nome_colete: 'Guerreiro', ativo: 1, uuid_dispositivo: 'UUID-ORIGINAL' }]
            ]);

            const res = await request(app)
                .post('/api/presencas/validar')
                .send({
                    id_evento: 10,
                    chave_qr: 'UUID-QR-VALIDO',
                    id_integrante: 1,
                    uuid_dispositivo: 'UUID-ERRADO'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.sucesso).toBe(false);
            expect(res.body.mensagem).toBe('Dispositivo não autorizado para este integrante.');
        });
    });
});