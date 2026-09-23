// =========================================================================
// TESTE UNITÁRIO: EventModel.test.js
// =========================================================================

const db = require('../../src/config/database');
const eventModel = require('../../src/models/EventModel');
const { dbRowMock, dbRowListMock, apiPayloadMock } = require('../mocks/Event.mock');

jest.mock('../../src/config/database', () => {
    const mockQuery = jest.fn();
    return {
        promise: () => ({
            query: mockQuery
        }),
        _mockQuery: mockQuery
    };
});

describe('EventModel (Modelo de Eventos)', () => {
    let mockQuery;

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery = db._mockQuery;
    });

    describe('Serialização e Deserialização', () => {
        it('deve converter linha do banco (snake_case) para camelCase', () => {
            const result = eventModel.deserialize(dbRowMock);
            expect(result).toEqual({
                id: 1,
                name: 'Treino Tático',
                type: 'TREINO',
                eventDate: '2026-10-15T14:00:00.000Z',
                location: 'Base Alfa',
                status: 'AGENDADO',
                description: 'Treino tático mensal'
            });
        });

        it('deve retornar null se passar valor nulo/undefined no deserialize', () => {
            expect(eventModel.deserialize(null)).toBeNull();
            expect(eventModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API (camelCase) para colunas do banco (snake_case)', () => {
            const result = eventModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                nome: 'Treino Tático',
                tipo: 'TREINO',
                data_evento: '2026-10-15T14:00:00.000Z',
                local: 'Base Alfa',
                status: 'AGENDADO',
                descricao: 'Treino tático mensal'
            });
        });

        it('deve serializar apenas campos definidos no payload (parcial)', () => {
            const result = eventModel.serialize({ name: 'Novo Nome' });
            expect(result).toEqual({ nome: 'Novo Nome' });
        });

        it('deve retornar objeto vazio ao serializar payload nulo/undefined', () => {
            expect(eventModel.serialize(null)).toEqual({});
            expect(eventModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findByType, findByStatus, findByDateRange)', () => {
        it('findByType deve retornar lista de eventos filtrados por tipo', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await eventModel.findByType('TREINO');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM eventos WHERE tipo = ?',
                ['TREINO']
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].type).toBe('TREINO');
        });

        it('findByStatus deve retornar lista de eventos filtrados por status', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await eventModel.findByStatus('AGENDADO');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM eventos WHERE status = ?',
                ['AGENDADO']
            );
            expect(result.length).toBe(2);
            expect(result[0].status).toBe('AGENDADO');
        });

        it('findByDateRange deve retornar lista de eventos dentro do intervalo', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await eventModel.findByDateRange('2026-10-01', '2026-10-31');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM eventos WHERE data_evento BETWEEN ? AND ?',
                ['2026-10-01', '2026-10-31']
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].name).toBe('Treino Tático');
        });
    });

    it('deve retornar objeto vazio ao tentar serializar null ou undefined', () => {
        expect(eventModel.serialize(null)).toEqual({});
        expect(eventModel.serialize(undefined)).toEqual({});
    });

    it('deve serializar um payload parcial sem a propriedade name', () => {
        const result = eventModel.serialize({
            type: 'TREINO',
            location: 'Base Alfa'
        });

        expect(result).toEqual({
            tipo: 'TREINO',
            local: 'Base Alfa'
        });
        expect(result).not.toHaveProperty('nome');
    });
});