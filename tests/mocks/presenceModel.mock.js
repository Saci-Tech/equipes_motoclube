const presenceModelMock = {
    singleRecord: {
        id: 1,
        id_evento: 5,
        id_integrante: 10,
        presente: 1,
        justificativa_falta: null,
        justificativa_aceita: null
    },
    eventAttendances: [
        {
            id: 1,
            id_evento: 5,
            id_integrante: 10,
            presente: 1,
            justificativa_falta: null,
            justificativa_aceita: null,
            integrante_nome: 'João Silva'
        },
        {
            id: 2,
            id_evento: 5,
            id_integrante: 20,
            presente: 0,
            justificativa_falta: 'Problemas de saúde',
            justificativa_aceita: 1,
            integrante_nome: 'Maria Souza'
        }
    ],
    memberHistory: [
        {
            id: 1,
            id_evento: 5,
            id_integrante: 10,
            presente: 1,
            justificativa_falta: null,
            justificativa_aceita: null,
            evento_nome: 'Reunião Geral',
            data_evento: '2023-10-15T14:00:00.000Z'
        }
    ]
};

module.exports = presenceModelMock;