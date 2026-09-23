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
                title: 'Encontro Anual de Motociclistas',
                eventDate: '2026-10-15T18:00:00.000Z',
                location: 'Sede Principal - Sorocaba',
                status: 'AGENDADO',
                description: 'Evento festivo com bandas e exposições'
            });
        });

        it('deve retornar null se passar valor nulo/undefined no deserialize', () => {
            expect(eventModel.deserialize(null)).toBeNull();
            expect(eventModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API (camelCase) para colunas do banco (snake_case)', () => {
            const result = eventModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                nome: 'Encontro Anual de Motociclistas',
                data_evento: '2026-10-15T18:00:00.000Z',
                localizacao: 'Sede Principal - Sorocaba',
                status: 'AGENDADO',
                descricao: 'Evento festivo com bandas e exposições'
            });
        });

        it('deve serializar apenas campos definidos no payload (parcial)', () => {
            const result = eventModel.serialize({ title: 'Novo Título', location: 'Novo Local' });
            expect(result).toEqual({
                nome: 'Novo Título',
                localizacao: 'Novo Local'
            });
        });

        it('deve retornar objeto vazio ao serializar payload nulo/undefined', () => {
            expect(eventModel.serialize(null)).toEqual({});
            expect(eventModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findByDateRange, findByStatus)', () => {
        it('findByDateRange deve retornar lista de eventos dentro do intervalo', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const startDate = '2026-10-01';
            const endDate = '2026-11-30';
            const result = await eventModel.findByDateRange(startDate, endDate);

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM eventos WHERE data_evento BETWEEN ? AND ? ORDER BY data_evento ASC',
                [startDate, endDate]
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].title).toBe('Encontro Anual de Motociclistas');
        });

        it('findByStatus deve retornar lista de eventos filtrados por status', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await eventModel.findByStatus('AGENDADO');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM eventos WHERE status = ? ORDER BY data_evento DESC',
                ['AGENDADO']
            );
            expect(result.length).toBe(1);
            expect(result[0].status).toBe('AGENDADO');
        });
    });

    describe('Operações herdadas (create, update, findAll)', () => {
        it('create deve converter camelCase para snake_case ao inserir', async () => {
            mockQuery.mockResolvedValueOnce([{ insertId: 10 }]);

            const insertId = await eventModel.create({
                title: 'Workshop Mecânica',
                eventDate: '2026-12-01T14:00:00.000Z'
            });

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO eventos (nome, data_evento) VALUES (?, ?)',
                ['Workshop Mecânica', '2026-12-01T14:00:00.000Z']
            );
            expect(insertId).toBe(10);
        });

        it('update deve converter atributos antes de atualizar no banco', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await eventModel.update(1, { location: 'Local Alterado' });

            expect(mockQuery).toHaveBeenCalledWith(
                'UPDATE eventos SET localizacao = ? WHERE id = ?',
                ['Local Alterado', 1]
            );
            expect(success).toBe(true);
        });

        it('findAll deve retornar todos os eventos convertidos para camelCase', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await eventModel.findAll();

            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty('eventDate');
            expect(result[0]).not.toHaveProperty('data_evento');
        });
    });
});