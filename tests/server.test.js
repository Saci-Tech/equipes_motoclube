// =========================================================================
// SUÍTE DE TESTE PRINCIPAL DA API (server.test.js)
// ARQUIVO: tests/server.test.js
// =========================================================================

const fs = require('fs');
const path = require('path');
const request = require('supertest');

// 1. Mock global do pool de conexão do MySQL para isolar as chamadas de banco
jest.mock('../src/config/database', () => ({
    query: jest.fn()
}));

const pool = require('../src/config/database');

// 2. Garante o ambiente de teste e importa o aplicativo Express do server.js
process.env.NODE_ENV = 'test';
const app = require('../src/server');

const routesDir = path.join(__dirname, '../src/routes');

describe('=== SUÍTE PRINCIPAL DE TESTES DO SERVIDOR ===', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ---------------------------------------------------------------------
    // 1. VERIFICAÇÕES DE INFRAESTRUTURA E CARREGAMENTO
    // ---------------------------------------------------------------------
    describe('Servidor & Middleware Express', () => {
        it('Deve instanciar o app Express com sucesso a partir de server.js', () => {
            expect(app).toBeDefined();
            expect(typeof app.use).toBe('function');
        });

        it('Deve responder à rota da documentação Swagger (/api-docs)', async () => {
            const res = await request(app).get('/api-docs/');
            // O Swagger UI retorna 200 ou redirecionamento 301/302
            expect([200, 301, 302]).toContain(res.statusCode);
        });

        it('Deve retornar 404 para rotas globais inexistentes', async () => {
            const res = await request(app).get('/api/rota-inexistente-global');
            expect(res.statusCode).toBe(404);
        });
    });

    // ---------------------------------------------------------------------
    // 2. DESCOBERTA E TESTES DINÂMICOS DE ROTAS DA PASTA src/routes/
    // ---------------------------------------------------------------------
    describe('Mapeamento Dinâmico de Endpoints', () => {
        const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

        it('Deve conter arquivos de rota no diretório src/routes', () => {
            expect(routeFiles.length).toBeGreaterThan(0);
        });

        routeFiles.forEach((file) => {
            const prefixo = file.replace('.routes.js', '').replace('.js', '');
            const endpointBase = `/api/${prefixo}`;

            describe(`Módulo de Rota: ${file} -> [${endpointBase}]`, () => {

                it(`Deve ter o arquivo ${file} registrado e acessível`, async () => {
                    // Retorno padrão simulado do MySQL para evitar estouro em chamadas SELECT
                    pool.query.mockResolvedValueOnce([[]]);

                    const res = await request(app).get(endpointBase);

                    // Se a rota não estivesse registrada no server.js, retornaria 404
                    expect(res.statusCode).not.toBe(404);
                });

                it(`Deve bloquear/rejeitar sub-rotas inexistentes em ${endpointBase}`, async () => {
                    const res = await request(app).get(`${endpointBase}/subrota-invalida-teste`);
                    expect(res.statusCode).toBe(404);
                });
            });
        });
    });

    // ---------------------------------------------------------------------
    // 3. FLUXO INTEGRADO PRINCIPAL (PRESENÇAS & EVENTOS)
    // ---------------------------------------------------------------------
    describe('Validação Integrada de Negócio (/api/presencas)', () => {

        it('GET /api/presencas -> Deve listar presenças ativas', async () => {
            const mockPresencas = [
                {
                    id: 1,
                    id_evento: 10,
                    nome_evento: 'Encontro Mensal',
                    id_integrante: 2,
                    nome_colete: 'Presidente',
                    presente: 1,
                    justificativa_falta: null,
                    justificativa_aceita: 0,
                    data_criacao: '22/09/2026 09:00:00'
                }
            ];

            pool.query.mockResolvedValueOnce([mockPresencas]);

            const res = await request(app).get('/api/presencas');

            expect(res.statusCode).toBe(200);
            expect(res.body.sucesso).toBe(true);
            expect(res.body.total).toBe(1);
            expect(res.body.dados[0].nome_colete).toBe('Presidente');
        });

        it('POST /api/presencas/validar -> Deve validar presença via QR Code e dispositivo', async () => {
            // Mock 1: Busca o integrante ativo e seu dispositivo
            pool.query.mockResolvedValueOnce([
                [{ id: 2, nome_colete: 'Presidente', ativo: 1, uuid_dispositivo: 'UUID-DISPOSITIVO-OK' }]
            ]);

            // Mock 2: Busca o evento e o QR Code ativo
            pool.query.mockResolvedValueOnce([
                [{ id: 10, titulo: 'Encontro Mensal', chave_qr: 'UUID-QR-OK', ativo: 1 }]
            ]);

            // Mock 3: Gravação da presença no MySQL
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .post('/api/presencas/validar')
                .send({
                    id_evento: 10,
                    chave_qr: 'UUID-QR-OK',
                    id_integrante: 2,
                    uuid_dispositivo: 'UUID-DISPOSITIVO-OK'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.sucesso).toBe(true);
            expect(res.body.mensagem).toContain('Presença confirmada para Presidente');
        });
    });
});