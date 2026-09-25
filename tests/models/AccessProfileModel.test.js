const AccessProfileModel = require('../../src/models/AccessProfileModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/accessProfileModel.mock');

jest.mock('../../src/config/database');

describe('AccessProfileModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new AccessProfileModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('perfis_acesso');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByName', () => {
        test('retorna null se o nome não for fornecido', async () => {
            const result = await model.findByName(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o perfil se o nome for encontrado', async () => {
            db.query.mockResolvedValueOnce([[mocks.validProfile]]);
            const result = await model.findByName('Administrador');
            
            expect(result).toEqual(mocks.validProfile);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM'), 
                ['Administrador']
            );
        });

        test('retorna null se o perfil não for encontrado', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByName('Inexistente');
            
            expect(result).toBeNull();
        });
    });

    describe('findWithPermissions', () => {
        test('retorna null se o id do perfil não for informado', async () => {
            const result = await model.findWithPermissions(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna null se a consulta retornar vazia (perfil não existe)', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findWithPermissions(99);
            expect(result).toBeNull();
        });

        test('retorna perfil com a lista de permissões populada', async () => {
            db.query.mockResolvedValueOnce([mocks.validProfileWithPermissionsRaw]);
            const result = await model.findWithPermissions(1);
            expect(result).toEqual(mocks.validProfileWithPermissionsResult);
        });

        test('retorna perfil com lista de permissões vazia caso não possua nenhuma', async () => {
            db.query.mockResolvedValueOnce([mocks.validProfileWithoutPermissionsRaw]);
            const result = await model.findWithPermissions(2);
            expect(result).toEqual(mocks.validProfileWithoutPermissionsResult);
        });
    });
});