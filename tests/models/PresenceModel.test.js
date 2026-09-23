// =========================================================================
// TESTE UNITÁRIO: PresenceModel.test.js
// =========================================================================

const db = require('../../src/config/database');
const presenceModel = require('../../src/models/PresenceModel');
const { dbRowMock, dbRowListMock, apiPayloadMock } = require('../mocks/Presence.mock');

jest.mock('../../src/config/database', () => {
    const mockQuery = jest.fn();
    return {
        promise: () => ({
            query: mockQuery
        }),
        _mockQuery: mockQuery
    };
});

describe('PresenceModel (Modelo de Presenças)', () => {
    let mockQuery;

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery = db._mockQuery;
    });

    describe('Serialização e Deserialização', () => {
        it('deve converter linha do banco (snake_case) para camelCase', () => {
            const result = presenceModel.deserialize(dbRowMock);
            expect(result).toEqual({
                id: 1,
                memberId: 10,
                eventId: 5,
                presenceDate: '2026-09-20T19:30:00.000Z',
                status: 'PRESENTE',
                justification: null,
                validationMethod: 'QR_CODE'
            });
        });

        it('deve retornar null se passar valor nulo/undefined no deserialize', () => {
            expect(presenceModel.deserialize(null)).toBeNull();
            expect(presenceModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API (camelCase) para colunas do banco (snake_case)', () => {
            const result = presenceModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                id_integrante: 10,
                id_evento: 5,
                data_presenca: '2026-09-20T19:30:00.000Z',
                status: 'PRESENTE',
                justificativa: null,
                metodo_validacao: 'QR_CODE'
            });
        });

        it('deve serializar apenas campos definidos no payload (parcial)', () => {
            const result = presenceModel.serialize({ status: 'JUSTIFICADO', justification: 'Motivo de saúde' });
            expect(result).toEqual({
                status: 'JUSTIFICADO',
                justificativa: 'Motivo de saúde'
            });
        });

        it('deve retornar objeto vazio ao serializar payload nulo/undefined', () => {
            expect(presenceModel.serialize(null)).toEqual({});
            expect(presenceModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findByEventId, findByMemberId, findByEventAndMember)', () => {
        it('findByEventId deve retornar lista de presenças do evento', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await presenceModel.findByEventId(5);

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM presencas WHERE id_evento = ?',
                [5]
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].eventId).toBe(5);
        });

        it('findByMemberId deve retornar histórico de presenças do integrante', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await presenceModel.findByMemberId(10);

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM presencas WHERE id_integrante = ?',
                [10]
            );
            expect(result.length).toBe(1);
            expect(result[0].memberId).toBe(10);
        });

        it('findByEventAndMember deve retornar o registro quando encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await presenceModel.findByEventAndMember(5, 10);

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM presencas WHERE id_evento = ? AND id_integrante = ?',
                [5, 10]
            );
            expect(result.eventId).toBe(5);
            expect(result.memberId).toBe(10);
        });

        it('findByEventAndMember deve retornar null quando não encontrar registro', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await presenceModel.findByEventAndMember(5, 999);

            expect(result).toBeNull();
        });
    });

    describe('Operações herdadas (create, update, findAll)', () => {
        it('create deve converter camelCase para snake_case ao registrar presença', async () => {
            mockQuery.mockResolvedValueOnce([{ insertId: 20 }]);

            const insertId = await presenceModel.create({
                memberId: 10,
                eventId: 5,
                status: 'PRESENTE',
                validationMethod: 'QR_CODE'
            });

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO presencas (id_integrante, id_evento, status, metodo_validacao) VALUES (?, ?, ?, ?)',
                [10, 5, 'PRESENTE', 'QR_CODE']
            );
            expect(insertId).toBe(20);
        });

        it('update deve converter atributos antes de atualizar a presença', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await presenceModel.update(1, {
                status: 'JUSTIFICADO',
                justification: 'Atestado médico enviado'
            });

            expect(mockQuery).toHaveBeenCalledWith(
                'UPDATE presencas SET status = ?, justificativa = ? WHERE id = ?',
                ['JUSTIFICADO', 'Atestado médico enviado', 1]
            );
            expect(success).toBe(true);
        });

        it('findAll deve retornar todas as presenças convertidas para camelCase', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await presenceModel.findAll();

            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty('memberId');
            expect(result[0]).not.toHaveProperty('id_integrante');
        });

        // Adicionar dentro do describe('Serialização e Deserialização') em tests/models/PresenceModel.test.js

        it('deve serializar sem incluir justificativa quando ela for undefined', () => {
            const result = presenceModel.serialize({
                memberId: 10,
                eventId: 5
            });
            expect(result).toEqual({
                id_integrante: 10,
                id_evento: 5
            });
            expect(result).not.toHaveProperty('justificativa');
        });
    });
});