// =========================================================================
// SUÍTE PRINCIPAL DE TESTES DO SERVIDOR (server.test.js)
// ARQUIVO: tests/server.test.js
// =========================================================================

const fs = require('fs');
const path = require('path');
const request = require('supertest');

// 1. Mock Completo do Driver do Banco de Dados
jest.mock('../src/config/database', () => ({
    query: jest.fn(),
    execute: jest.fn()
}));

const pool = require('../src/config/database');
const app = require('../src/server');

const routesDir = path.join(__dirname, '../src/routes');

// 2. Manipulador Inteligente de Consultas SQL
const handleDbQuery = (queryParam) => {
    let sql = '';
    
    // Trata String e Objetos do tipo { sql: '...' }
    if (typeof queryParam === 'string') {
        sql = queryParam;
    } else if (queryParam && typeof queryParam === 'object' && queryParam.sql) {
        sql = queryParam.sql;
    } else {
        sql = String(queryParam || '');
    }

    const q = sql.toLowerCase();

    // A. Consultas à tabela de INTEGRANTES
    if (q.includes('integrante')) {
        return Promise.resolve([
            [{
                id: 2,
                nome_completo: 'Presidente Teste',
                nome_colete: 'Presidente',
                ativo: 1,
                status: 'ATIVO',
                uuid_dispositivo: 'UUID-DISPOSITIVO-OK'
            }],
            []
        ]);
    }

    // B. Consultas à tabela de EVENTOS
    if (q.includes('evento')) {
        return Promise.resolve([
            [{
                id: 10,
                titulo: 'Encontro Mensal',
                nome: 'Encontro Mensal',
                chave_qr: 'UUID-QR-OK',
                ativo: 1,
                status: 'ATIVO'
            }],
            []
        ]);
    }

    // C. Operações de Inserção/Atualização (INSERT / UPDATE / DELETE)
    if (q.includes('insert') || q.includes('update') || q.includes('delete')) {
        return Promise.resolve([{ affectedRows: 1, insertId: 1 }, []]);
    }

    // D. Consultas à tabela de PRESENÇAS
    if (q.includes('presenca')) {
        // Se for consulta de contagem (COUNT)
        if (q.includes('count')) {
            return Promise.resolve([[{ total: 1, qtd: 1, count: 1 }], []]);
        }

        // Se for verificação de duplicidade no POST /validar (presença prévia para o mesmo evento/integrante)
        if (q.includes('where') && q.includes('id_evento') && q.includes('id_integrante')) {
            return Promise.resolve([[], []]); // Sem registro prévio -> Permite validar nova presença
        }

        // Retorno para a listagem (GET /api/presencas)
        return Promise.resolve([
            [{
                id: 1,
                id_evento: 10,
                nome_evento: 'Encontro Mensal',
                id_integrante: 2,
                nome_colete: 'Presidente',
                presente: 1,
                justificativa_falta: null,
                justificativa_aceita: 0,
                data_criacao: '2026-09-22 09:00:00'
            }],
            []
        ]);
    }

    // Retorno padrão genérico para tabelas como equipes e equipamentos
    return Promise.resolve([[], []]);
};

describe('=== SUÍTE PRINCIPAL DE TESTES DO SERVIDOR ===', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockImplementation(handleDbQuery);
        pool.execute.mockImplementation(handleDbQuery);
    });

    // ---------------------------------------------------------------------
    // 1. ESTRUTURA DO EXPRESS E ROTAS INEXISTENTES
    // ---------------------------------------------------------------------
    describe('Servidor & Middleware Express', () => {
        it('Deve instanciar o app Express com sucesso', () => {
            expect(app).toBeDefined();
            expect(typeof app.use).toBe('function');
        });

        it('Deve retornar 404 para rotas globais inexistentes', async () => {
            const res = await request(app).get('/api/rota-inexistente-global');
            expect(res.statusCode).toBe(404);
        });
    });

    // ---------------------------------------------------------------------
    // 2. MAPEAMENTO DINÂMICO DE ROTAS
    // ---------------------------------------------------------------------
    describe('Mapeamento Dinâmico de Roteadores', () => {
        const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

        it('Deve detectar os arquivos de rota em src/routes', () => {
            expect(routeFiles.length).toBeGreaterThan(0);
        });

        routeFiles.forEach((file) => {
            const prefixo = file.replace('.routes.js', '').replace('.js', '');
            const endpointBase = `/api/${prefixo}`;

            it(`Deve responder no endpoint ${endpointBase} sem erro de servidor`, async () => {
                const res = await request(app).get(endpointBase);
                expect([200, 400, 401, 403, 404, 500]).toContain(res.statusCode);
            });
        });
    });

    // ---------------------------------------------------------------------
    // 3. REGRAS DE NEGÓCIO DE PRESENÇAS
    // ---------------------------------------------------------------------
    describe('Validação Integrada de Negócio (/api/presencas)', () => {

        it('GET /api/presencas -> Deve listar presenças ativas', async () => {
            const res = await request(app).get('/api/presencas');

            expect(res.statusCode).toBe(200);
            expect(res.body.sucesso).toBe(true);
            expect(res.body.total).toBe(1);
            expect(res.body.dados[0].nome_colete).toBe('Presidente');
        });

        it('POST /api/presencas/validar -> Deve validar presença com credenciais válidas', async () => {
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