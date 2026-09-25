const PresenceModel = require('../../src/models/PresenceModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/presenceModel.mock');

jest.mock('../../src/config/database');

describe('PresenceModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new PresenceModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('presenca_eventos');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByEvent', () => {
        test('retorna array vazio se o id do evento não for fornecido', async () => {
            const result = await model.findByEvent(null);
            expect(result).toEqual([]);
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna a lista de presenças do evento com os dados dos integrantes', async () => {
            db.query.mockResolvedValueOnce([mocks.eventAttendances]);
            const result = await model.findByEvent(5);
            
            expect(result).toEqual(mocks.eventAttendances);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INNER JOIN integrantes'), 
                [5]
            );
        });
    });

    describe('findByMember', () => {
        test('retorna array vazio se o id do integrante não for fornecido', async () => {
            const result = await model.findByMember(null);
            expect(result).toEqual([]);
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o histórico de presenças do integrante com os dados dos eventos', async () => {
            db.query.mockResolvedValueOnce([mocks.memberHistory]);
            const result = await model.findByMember(10);
            
            expect(result).toEqual(mocks.memberHistory);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INNER JOIN eventos'), 
                [10]
            );
        });
    });

    describe('findByEventAndMember', () => {
        test('retorna null se id_evento ou id_integrante não forem fornecidos', async () => {
            const resultMissingMember = await model.findByEventAndMember(5, null);
            const resultMissingEvent = await model.findByEventAndMember(null, 10);
            
            expect(resultMissingMember).toBeNull();
            expect(resultMissingEvent).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o registro específico de presença do integrante no evento', async () => {
            db.query.mockResolvedValueOnce([[mocks.singleRecord]]);
            const result = await model.findByEventAndMember(5, 10);
            
            expect(result).toEqual(mocks.singleRecord);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE id_evento = ? AND id_integrante = ?'), 
                [5, 10]
            );
        });

        test('retorna null se o registro não for encontrado', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByEventAndMember(99, 99);
            expect(result).toBeNull();
        });
    });
});