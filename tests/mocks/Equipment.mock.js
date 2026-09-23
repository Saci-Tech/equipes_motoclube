const dbRowMock = {
    id: 1,
    nome: 'Rádio HT Motorola',
    numero_serie: 'HT123456',
    categoria: 'COMUNICACAO',
    status: 'DISPONIVEL',
    observacoes: 'Em perfeito estado'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        nome: 'Colete Tático',
        numero_serie: 'CT789012',
        categoria: 'PROTECAO',
        status: 'EM_USO',
        observacoes: 'Tamanho G'
    }
];

const apiPayloadMock = {
    name: 'Rádio HT Motorola',
    serialNumber: 'HT123456',
    category: 'COMUNICACAO',
    status: 'DISPONIVEL',
    notes: 'Em perfeito estado'
};

const deserializedEquipmentMock = {
    id: 1,
    ...apiPayloadMock
};

const deserializedEquipmentListMock = [
    deserializedEquipmentMock,
    {
        id: 2,
        name: 'Colete Tático',
        serialNumber: 'CT789012',
        category: 'PROTECAO',
        status: 'EM_USO',
        notes: 'Tamanho G'
    }
];

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock,
    deserializedEquipmentMock,
    deserializedEquipmentListMock
};