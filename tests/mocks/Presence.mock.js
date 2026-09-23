const dbRowMock = {
    id: 1,
    id_integrante: 10,
    id_evento: 5,
    data_presenca: '2026-09-20T19:30:00.000Z',
    status: 'PRESENTE',
    justificativa: null,
    metodo_validacao: 'QR_CODE'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        id_integrante: 11,
        id_evento: 5,
        data_presenca: '2026-09-20T19:35:00.000Z',
        status: 'JUSTIFICADO',
        justificativa: 'Viagem a trabalho',
        metodo_validacao: 'MANUAL'
    }
];

const apiPayloadMock = {
    memberId: 10,
    eventId: 5,
    presenceDate: '2026-09-20T19:30:00.000Z',
    status: 'PRESENTE',
    justification: null,
    validationMethod: 'QR_CODE'
};

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock
};