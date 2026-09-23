const dbRowMock = {
    id: 1,
    nome: 'Encontro Anual de Motociclistas',
    data_evento: '2026-10-15T18:00:00.000Z',
    localizacao: 'Sede Principal - Sorocaba',
    status: 'AGENDADO',
    descricao: 'Evento festivo com bandas e exposições'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        nome: 'Passeio Beneficiente',
        data_evento: '2026-11-20T09:00:00.000Z',
        localizacao: 'Parque Campolim',
        status: 'EM_BREVE',
        descricao: 'Arrecadação de mantimentos'
    }
];

const apiPayloadMock = {
    title: 'Encontro Anual de Motociclistas',
    eventDate: '2026-10-15T18:00:00.000Z',
    location: 'Sede Principal - Sorocaba',
    status: 'AGENDADO',
    description: 'Evento festivo com bandas e exposições'
};

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock
};