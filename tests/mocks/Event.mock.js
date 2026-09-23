const dbRowMock = {
    id: 1,
    nome: 'Treino Tático',
    tipo: 'TREINO',
    data_evento: '2026-10-15T14:00:00.000Z',
    local: 'Base Alfa',
    status: 'AGENDADO',
    descricao: 'Treino tático mensal'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        nome: 'Operação Resgate',
        tipo: 'OPERACAO',
        data_evento: '2026-11-20T08:00:00.000Z',
        local: 'Serra Verde',
        status: 'AGENDADO',
        descricao: 'Simulado de resgate'
    }
];

const apiPayloadMock = {
    name: 'Treino Tático',
    type: 'TREINO',
    eventDate: '2026-10-15T14:00:00.000Z',
    location: 'Base Alfa',
    status: 'AGENDADO',
    description: 'Treino tático mensal'
};

const deserializedEventMock = {
    id: 1,
    ...apiPayloadMock
};

const deserializedEventListMock = [
    deserializedEventMock,
    {
        id: 2,
        name: 'Operação Resgate',
        type: 'OPERACAO',
        eventDate: '2026-11-20T08:00:00.000Z',
        location: 'Serra Verde',
        status: 'AGENDADO',
        description: 'Simulado de resgate'
    }
];

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock,
    deserializedEventMock,
    deserializedEventListMock
};