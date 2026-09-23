const dbRowMock = {
    id: 1,
    id_integrante: 10,
    id_evento: 5,
    data_presenca: '2026-09-20T19:30:00.000Z',
    justificativa: null,
    metodo_validacao: 'QR_CODE',
    status: 'PRESENTE'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        id_integrante: 6,
        id_evento: 5,
        data_presenca: '2026-09-20T19:30:00.000Z',
        justificativa: 'Falta autorizada',
        metodo_validacao: 'MANUAL',
        status: 'AUSENTE'
    }
];

const apiPayloadMock = {
    memberId: 10,
    eventId: 5,
    presenceDate: '2026-09-20T19:30:00.000Z',
    justification: null,
    validationMethod: 'QR_CODE',
    status: 'PRESENTE'
};

const deserializedPresenceMock = {
    id: 1,
    ...apiPayloadMock
};

const deserializedPresenceListMock = [
    deserializedPresenceMock,
    {
        id: 2,
        memberId: 6,
        eventId: 5,
        presenceDate: '2026-09-20T19:30:00.000Z',
        justification: 'Falta autorizada',
        validationMethod: 'MANUAL',
        status: 'AUSENTE'
    }
];

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock,
    deserializedPresenceMock,
    deserializedPresenceListMock
};