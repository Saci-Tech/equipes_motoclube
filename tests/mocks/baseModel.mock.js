/**
 * Mocks centralizados para testes unitários da BaseModel
 */
const baseModelMock = {
    validRecord: { id_teste: 1, nome: 'Registro Teste' },
    validRecordList: [
        { id_teste: 1, nome: 'Item 1' },
        { id_teste: 2, nome: 'Item 2' }
    ],
    createSingleInput: { nome: 'Novo Registro' },
    createSingleOutput: { id_teste: 10, nome: 'Novo Registro' },
    createWithPkInput: { id_teste: 11, nome: 'Com PK Preenchida' },
    createListInput: [{ nome: 'Item A' }, { nome: 'Item B' }],
    updateSingleInput: { id: 10, nome: 'Atualizado' },
    updateByPkInput: { id_teste: 20, nome: 'Atualizado Por PK' },
    updateListInput: [{ id: 30, nome: 'Atualizado 1' }, { id: 31, nome: 'Atualizado 2' }],
    deleteScalarId: 5,
    deleteObjectInput: { id: 6 },
    deletePkObjectInput: { id_teste: 7 }
};

module.exports = baseModelMock;