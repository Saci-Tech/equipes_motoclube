// =========================================================================
// TESTE UNITÁRIO: MemberModel.test.js
// =========================================================================

const db = require('../../src/config/database');
const memberModel = require('../../src/models/MemberModel');

jest.mock('../../src/config/database', () => {
    const mockQuery = jest.fn();
    return {
        promise: () => ({
            query: mockQuery
        }),
        _mockQuery: mockQuery
    };
});

describe('MemberModel (Modelo de Integrantes)', () => {
    let mockQuery;

    const dbRowMock = {
        id: 1,
        nome_completo: 'Carlos Silva',
        nome_colete: 'Silva',
        email: 'carlos@clube.com',
        telefone: '11999998888',
        cpf: '12345678901',
        status: 'ATIVO',
        id_equipe: 10,
        chave_qr: 'UUID-QR-123'
    };

    const apiPayloadMock = {
        fullName: 'Carlos Silva',
        shirtName: 'Silva',
        email: 'carlos@clube.com',
        phone: '11999998888',
        cpf: '12345678901',
        status: 'ATIVO',
        teamId: 10,
        qrKey: 'UUID-QR-123'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery = db._mockQuery;
    });

    describe('Serialização e Deserialização', () => {
        it('deve converter corretamente a linha do banco (snake_case) para camelCase', () => {
            const result = memberModel.deserialize(dbRowMock);
            expect(result).toEqual({
                id: 1,
                fullName: 'Carlos Silva',
                shirtName: 'Silva',
                email: 'carlos@clube.com',
                phone: '11999998888',
                cpf: '12345678901',
                status: 'ATIVO',
                teamId: 10,
                qrKey: 'UUID-QR-123'
            });
        });

        it('deve retornar null se passar linha nula/undefined no deserialize', () => {
            expect(memberModel.deserialize(null)).toBeNull();
            expect(memberModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API (camelCase) para colunas do banco (snake_case)', () => {
            const result = memberModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                nome_completo: 'Carlos Silva',
                nome_colete: 'Silva',
                email: 'carlos@clube.com',
                telefone: '11999998888',
                cpf: '12345678901',
                status: 'ATIVO',
                id_equipe: 10,
                chave_qr: 'UUID-QR-123'
            });
        });

        it('deve serializar apenas campos definidos (parcial)', () => {
            const partial = { fullName: 'Novo Nome', status: 'INATIVO' };
            const result = memberModel.serialize(partial);
            expect(result).toEqual({
                nome_completo: 'Novo Nome',
                status: 'INATIVO'
            });
        });

        it('deve retornar objeto vazio ao serializar payload nulo/undefined', () => {
            expect(memberModel.serialize(null)).toEqual({});
            expect(memberModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findByCpf, findByQrKey, findByTeamId)', () => {
        it('findByCpf deve retornar integrante desserializado se encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await memberModel.findByCpf('12345678901');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM integrantes WHERE cpf = ?',
                ['12345678901']
            );
            expect(result.fullName).toBe('Carlos Silva');
            expect(result.cpf).toBe('12345678901');
        });

        it('findByCpf deve retornar null se não encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await memberModel.findByCpf('00000000000');

            expect(result).toBeNull();
        });

        it('findByQrKey deve retornar integrante desserializado se encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await memberModel.findByQrKey('UUID-QR-123');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM integrantes WHERE chave_qr = ?',
                ['UUID-QR-123']
            );
            expect(result.qrKey).toBe('UUID-QR-123');
        });

        it('findByQrKey deve retornar null se não encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await memberModel.findByQrKey('UUID-INVALIDO');

            expect(result).toBeNull();
        });

        it('findByTeamId deve retornar lista de integrantes da equipe', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await memberModel.findByTeamId(10);

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM integrantes WHERE id_equipe = ?',
                [10]
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].teamId).toBe(10);
        });
    });

    describe('Operações herdadas com De/Para aplicado (create, update, findAll)', () => {
        it('create deve converter camelCase para snake_case ao inserir', async () => {
            mockQuery.mockResolvedValueOnce([{ insertId: 5 }]);

            const insertId = await memberModel.create({
                fullName: 'Ana Souza',
                cpf: '98765432100'
            });

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO integrantes (nome_completo, cpf) VALUES (?, ?)',
                ['Ana Souza', '98765432100']
            );
            expect(insertId).toBe(5);
        });

        it('update deve converter camelCase para snake_case ao atualizar', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await memberModel.update(1, { shirtName: 'Silva V2' });

            expect(mockQuery).toHaveBeenCalledWith(
                'UPDATE integrantes SET nome_colete = ? WHERE id = ?',
                ['Silva V2', 1]
            );
            expect(success).toBe(true);
        });

        it('findAll deve retornar lista desserializada em camelCase', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await memberModel.findAll();

            expect(result[0]).toHaveProperty('fullName');
            expect(result[0]).not.toHaveProperty('nome_completo');
        });
    });
});