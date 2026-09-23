// =========================================================================
// TESTE UNITÁRIO: TeamModel.test.js
// =========================================================================

const db = require('../../src/config/database');
const teamModel = require('../../src/models/TeamModel');
const { dbRowMock, dbRowListMock, apiPayloadMock } = require('../mocks/Team.mock');

jest.mock('../../src/config/database', () => {
    const mockQuery = jest.fn();
    return {
        promise: () => ({
            query: mockQuery
        }),
        _mockQuery: mockQuery
    };
});

describe('TeamModel (Modelo de Equipes)', () => {
    let mockQuery;

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery = db._mockQuery;
    });

    describe('Serialização e Deserialização', () => {
        it('deve converter linha do banco para camelCase', () => {
            const result = teamModel.deserialize(dbRowMock);
            expect(result).toEqual({
                id: 1,
                name: 'Equipe Alpha',
                category: 'SENIOR',
                status: 'ATIVO',
                description: 'Equipe principal de competição'
            });
        });

        it('deve retornar null ao deserializar valor nulo ou undefined', () => {
            expect(teamModel.deserialize(null)).toBeNull();
            expect(teamModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API para colunas do banco', () => {
            const result = teamModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                nome: 'Equipe Alpha',
                categoria: 'SENIOR',
                status: 'ATIVO',
                descricao: 'Equipe principal de competição'
            });
        });

        it('deve serializar apenas propriedades fornecidas (parcial)', () => {
            const result = teamModel.serialize({ name: 'Novo Nome' });
            expect(result).toEqual({ nome: 'Novo Nome' });
        });

        it('deve retornar objeto vazio ao serializar payload nulo ou undefined', () => {
            expect(teamModel.serialize(null)).toEqual({});
            expect(teamModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findByName, findByCategory)', () => {
        it('findByName deve retornar equipe quando encontrada', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await teamModel.findByName('Equipe Alpha');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipes WHERE nome = ?',
                ['Equipe Alpha']
            );
            expect(result.name).toBe('Equipe Alpha');
        });

        it('findByName deve retornar null quando não encontrar', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await teamModel.findByName('Inexistente');

            expect(result).toBeNull();
        });

        it('findByCategory deve retornar lista de equipes desserializadas', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await teamModel.findByCategory('SENIOR');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipes WHERE categoria = ?',
                ['SENIOR']
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].category).toBe('SENIOR');
        });
    });

    describe('Operações herdadas (create, update, findAll)', () => {
        it('create deve converter payload para formato do banco ao inserir', async () => {
            mockQuery.mockResolvedValueOnce([{ insertId: 3 }]);

            const insertId = await teamModel.create({
                name: 'Equipe Gamma',
                category: 'INICIANTE'
            });

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO equipes (nome, categoria) VALUES (?, ?)',
                ['Equipe Gamma', 'INICIANTE']
            );
            expect(insertId).toBe(3);
        });

        it('update deve converter campos alterados para snake_case', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await teamModel.update(1, { description: 'Nova Descrição' });

            expect(mockQuery).toHaveBeenCalledWith(
                'UPDATE equipes SET descricao = ? WHERE id = ?',
                ['Nova Descrição', 1]
            );
            expect(success).toBe(true);
        });

        it('findAll deve retornar lista completa convertida em camelCase', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await teamModel.findAll();

            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).not.toHaveProperty('nome');
        });
    });
});