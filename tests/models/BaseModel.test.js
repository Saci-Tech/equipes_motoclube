const BaseModel = require('../../src/models/BaseModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/baseModel.mock');

jest.mock('../../src/config/database');

describe('BaseModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new BaseModel('tabela_teste', 'id_teste');
    });

    test('constructor atribui id padrão para primaryKey se for omitido', () => {
        const defaultModel = new BaseModel('tabela_padrao');
        expect(defaultModel.tableName).toBe('tabela_padrao');
        expect(defaultModel.primaryKey).toBe('id');
    });

    test('serialize e deserialize tratam null, objetos e listas', () => {
        expect(model.serialize(null)).toBeNull();
        expect(model.deserialize(null)).toBeNull();

        expect(model.serialize(mocks.validRecord)).toEqual(mocks.validRecord);
        expect(model.deserialize(mocks.validRecord)).toEqual(mocks.validRecord);

        expect(model.serialize(mocks.validRecordList)).toEqual(mocks.validRecordList);
        expect(model.deserialize(mocks.validRecordList)).toEqual(mocks.validRecordList);
    });

    // -------------------------------------------------------------------------
    // NOVO TESTE: getRecords
    // -------------------------------------------------------------------------
    test('getRecords retorna todos os registros ou null se a tabela estiver vazia', async () => {
        // Cenário 1: Tabela com registros
        db.query.mockResolvedValueOnce([mocks.validRecordList]);
        const records = await model.getRecords();
        
        expect(records).toEqual(mocks.validRecordList);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM tabela_teste');

        // Cenário 2: Tabela sem registros
        db.query.mockResolvedValueOnce([[]]);
        const emptyRecords = await model.getRecords();
        
        expect(emptyRecords).toBeNull();
    });

    test('getRecordById retorna registro existente ou null', async () => {
        db.query.mockResolvedValueOnce([[mocks.validRecord]]);
        const record = await model.getRecordById(1);
        expect(record).toEqual(mocks.validRecord);

        db.query.mockResolvedValueOnce([[]]);
        const nullRecord = await model.getRecordById(99);
        expect(nullRecord).toBeNull();
    });

    test('getRecordById lança exceção se primaryKey for null', async () => {
        const noPkModel = new BaseModel('tabela_sem_pk', null);
        await expect(noPkModel.getRecordById(1)).rejects.toThrow(
            'Chave primária não definida para esta tabela.'
        );
    });

    test('findAll executa consultas sem filtros e com filtros', async () => {
        db.query.mockResolvedValueOnce([[mocks.validRecord]]);
        const all = await model.findAll();
        expect(all).toEqual([mocks.validRecord]);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM tabela_teste', []);

        db.query.mockResolvedValueOnce([[mocks.validRecord]]);
        const filtered = await model.findAll({ nome: 'Registro Teste' });
        expect(filtered).toEqual([mocks.validRecord]);
        expect(db.query).toHaveBeenCalledWith(
            'SELECT * FROM tabela_teste WHERE nome = ?',
            ['Registro Teste']
        );
    });

    test('create realiza inserções individuais, com ID explícito e em lote', async () => {
        db.query
            .mockResolvedValueOnce([{ insertId: 10 }])
            .mockResolvedValueOnce([[mocks.createSingleOutput]]);

        const created = await model.create(mocks.createSingleInput);
        expect(created).toEqual(mocks.createSingleOutput);

        db.query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ id_teste: 11, nome: 'Com PK Preenchida' }]]);

        const createdWithPk = await model.create(mocks.createWithPkInput);
        expect(createdWithPk).toEqual({ id_teste: 11, nome: 'Com PK Preenchida' });

        db.query
            .mockResolvedValueOnce([{ insertId: 1 }])
            .mockResolvedValueOnce([[mocks.validRecordList[0]]])
            .mockResolvedValueOnce([{ insertId: 2 }])
            .mockResolvedValueOnce([[mocks.validRecordList[1]]]);

        const createdList = await model.create(mocks.createListInput);
        expect(createdList).toEqual(mocks.validRecordList);
    });

    test('create insere item em modelo sem chave primária', async () => {
        const noPkModel = new BaseModel('tabela_sem_pk', null);
        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await noPkModel.create({ campo: 'Sem PK' });
        expect(result).toEqual({ campo: 'Sem PK' });
    });

    test('create valida e rejeita payloads nulos e objetos sem chaves', async () => {
        await expect(model.create(null)).rejects.toThrow('Payload é obrigatório para criação.');
        await expect(model.create({})).rejects.toThrow('Nenhum dado válido fornecido para inserção.');
    });

    test('update atualiza por id, por chave primária e aceita lote/arrays', async () => {
        db.query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ id_teste: 10, nome: 'Atualizado' }]]);

        const updatedById = await model.update(mocks.updateSingleInput);
        expect(updatedById).toEqual({ id_teste: 10, nome: 'Atualizado' });

        db.query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ id_teste: 20, nome: 'Atualizado Por PK' }]]);

        const updatedByPk = await model.update(mocks.updateByPkInput);
        expect(updatedByPk).toEqual({ id_teste: 20, nome: 'Atualizado Por PK' });

        db.query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ id_teste: 30, nome: 'Atualizado 1' }]])
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ id_teste: 31, nome: 'Atualizado 2' }]]);

        const updatedList = await model.update(mocks.updateListInput);
        expect(updatedList).toEqual([
            { id_teste: 30, nome: 'Atualizado 1' },
            { id_teste: 31, nome: 'Atualizado 2' }
        ]);
    });

    test('update suporta payloads sem campos adicionais e modelos sem PK', async () => {
        db.query.mockResolvedValueOnce([[{ id_teste: 10, nome: 'Apenas ID' }]]);
        const noExtraFields = await model.update({ id: 10 });
        expect(noExtraFields).toEqual({ id_teste: 10, nome: 'Apenas ID' });

        const noPkModel = new BaseModel('tabela_sem_pk', null);
        const result = await noPkModel.update({ campo: 'Sem PK' });
        expect(result).toEqual({ campo: 'Sem PK' });
    });

    test('update lança erro se o payload for nulo ou se faltar o identificador', async () => {
        await expect(model.update(null)).rejects.toThrow('Payload é obrigatório para atualização.');
        await expect(model.update({ nome: 'Sem ID' })).rejects.toThrow(
            "Identificador 'id_teste' é obrigatório no payload."
        );
    });

    test('delete exclui por id escalar, objeto id ou chave primária customizada', async () => {
        db.query
            .mockResolvedValueOnce([[{ id_teste: 5, nome: 'Remover' }]])
            .mockResolvedValueOnce([{ affectedRows: 1 }]);

        const deletedScalar = await model.delete(mocks.deleteScalarId);
        expect(deletedScalar).toEqual({ id_teste: 5, nome: 'Remover' });

        db.query
            .mockResolvedValueOnce([[{ id_teste: 6, nome: 'Remover 2' }]])
            .mockResolvedValueOnce([{ affectedRows: 1 }]);

        const deletedObj = await model.delete([mocks.deleteObjectInput]);
        expect(deletedObj).toEqual([{ id_teste: 6, nome: 'Remover 2' }]);

        db.query
            .mockResolvedValueOnce([[{ id_teste: 7, nome: 'Remover 3' }]])
            .mockResolvedValueOnce([{ affectedRows: 1 }]);

        const deletedPk = await model.delete(mocks.deletePkObjectInput);
        expect(deletedPk).toEqual({ id_teste: 7, nome: 'Remover 3' });
    });

    test('delete trata registros inexistentes e tabelas sem chave primária', async () => {
        db.query.mockResolvedValueOnce([[]]);
        const deletedNotFound = await model.delete(99);
        expect(deletedNotFound).toEqual({ id: 99 });

        const noPkModel = new BaseModel('tabela_sem_pk', null);
        const deletedNoPk = await noPkModel.delete({ relacao_id: 12 });
        expect(deletedNoPk).toEqual({ relacao_id: 12 });
    });

    test('delete lança erros em payloads nulos ou quando o id não for informado', async () => {
        await expect(model.delete(null)).rejects.toThrow('Payload é obrigatório para remoção.');
        await expect(model.delete({})).rejects.toThrow('Identificador da exclusão não fornecido.');
    });
});