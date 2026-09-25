/**
 * Mocks centralizados para testes unitários da EventModel
 */
const eventModelMock = {
    validEvent: {
        id: 1,
        nome: 'Reunião Geral Semestral',
        data_evento: '2023-10-15T14:00:00.000Z',
        ativo: 1
    },
    validEventWithAttendancesRaw: [
        {
            id: 1,
            nome: 'Reunião Geral Semestral',
            data_evento: '2023-10-15T14:00:00.000Z',
            ativo: 1,
            id_integrante: 10,
            integrante_nome: 'João Silva',
            presente: 1,
            justificativa_falta: null,
            justificativa_aceita: null
        },
        {
            id: 1,
            nome: 'Reunião Geral Semestral',
            data_evento: '2023-10-15T14:00:00.000Z',
            ativo: 1,
            id_integrante: 20,
            integrante_nome: 'Maria Souza',
            presente: 0,
            justificativa_falta: 'Problemas de saúde',
            justificativa_aceita: 1 // Abono (falta justificada aceita)
        }
    ],
    validEventWithAttendancesResult: {
        id: 1,
        nome: 'Reunião Geral Semestral',
        data_evento: '2023-10-15T14:00:00.000Z',
        ativo: 1,
        attendances: [
            {
                member_id: 10,
                member_name: 'João Silva',
                present: true,
                justification: null,
                justification_accepted: null
            },
            {
                member_id: 20,
                member_name: 'Maria Souza',
                present: false,
                justification: 'Problemas de saúde',
                justification_accepted: true
            }
        ]
    },
    validEventWithoutAttendancesRaw: [
        {
            id: 2,
            nome: 'Treinamento de Novatos',
            data_evento: '2023-11-01T09:00:00.000Z',
            ativo: 1,
            id_integrante: null,
            integrante_nome: null,
            presente: null,
            justificativa_falta: null,
            justificativa_aceita: null
        }
    ],
    validEventWithoutAttendancesResult: {
        id: 2,
        nome: 'Treinamento de Novatos',
        data_evento: '2023-11-01T09:00:00.000Z',
        ativo: 1,
        attendances: []
    }
};

module.exports = eventModelMock;