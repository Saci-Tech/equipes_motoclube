const EventModel = require('../../src/models/EventModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/eventModel.mock');

jest.mock('../../src/config/database');

describe('EventModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new EventModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('eventos');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByName', () => {
        test('retorna null se o nome não for fornecido', async () => {
            const result = await model.findByName(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o evento se o nome for encontrado', async () => {
            db.query.mockResolvedValueOnce([[mocks.validEvent]]);
            const result = await model.findByName('Reunião Geral Semestral');
            
            expect(result).toEqual(mocks.validEvent);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM'), 
                ['Reunião Geral Semestral']
            );
        });

        test('retorna null se o evento não for encontrado', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByName('Inexistente');
            
            expect(result).toBeNull();
        });
    });

    describe('findWithAttendances', () => {
        test('retorna null se o id do evento não for informado', async () => {
            const result = await model.findWithAttendances(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna null se a consulta retornar vazia (evento não existe)', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findWithAttendances(99);
            expect(result).toBeNull();
        });

        test('retorna evento com a lista de presenças populada', async () => {
            db.query.mockResolvedValueOnce([mocks.validEventWithAttendancesRaw]);
            const result = await model.findWithAttendances(1);
            expect(result).toEqual(mocks.validEventWithAttendancesResult);
        });

        test('retorna evento com lista de presenças vazia caso ainda não haja registros', async () => {
            db.query.mockResolvedValueOnce([mocks.validEventWithoutAttendancesRaw]);
            const result = await model.findWithAttendances(2);
            expect(result).toEqual(mocks.validEventWithoutAttendancesResult);
        });
    });
});