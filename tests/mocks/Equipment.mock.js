const dbRowMock = {
    id: 1,
    nome: 'Rádio HT Baofeng',
    categoria: 'COMUNICACAO',
    numero_serie: 'HT-998822',
    status: 'DISPONIVEL',
    observacoes: 'Bateria nova, acompanha carregador'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        nome: 'Kit Primeiros Socorros',
        categoria: 'SAUDE',
        numero_serie: 'MED-001',
        status: 'EM_USO',
        observacoes: 'Mala amarela de resgate'
    }
];

const apiPayloadMock = {
    name: 'Rádio HT Baofeng',
    category: 'COMUNICACAO',
    serialNumber: 'HT-998822',
    status: 'DISPONIVEL',
    notes: 'Bateria nova, acompanha carregador'
};

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock
};