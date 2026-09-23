// =========================================================================
// FIXTURES / DADOS MOCADOS PARA TESTES DE COBERTURA
// ARQUIVO: tests/mocks/mockData.js
// =========================================================================

const mockIntegrantes = [
    {
        id: 1,
        nome_completo: 'João Silva',
        nome_colete: 'Guerreiro',
        ativo: 1,
        uuid_dispositivo: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
        id: 2,
        nome_completo: 'Carlos Souza',
        nome_colete: 'Sombra',
        ativo: 0, // Integrante inativo para teste de erro 403
        uuid_dispositivo: '660e8400-e29b-41d4-a716-446655440000'
    }
];

const mockEventos = [
    {
        id: 10,
        titulo: 'Passeio Mensal da Serra',
        data_evento: '2026-10-15 08:00:00',
        publico_alvo: 'GERAL',
        descricao: 'Encontro mensal no mirante.',
        data_criacao: '2026-09-01 10:00:00',
        ativo: 1,
        chave_qr: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        id_equipe: null,
        ids_especificos: null
    },
    {
        id: 99,
        titulo: 'Evento Cancelado',
        data_evento: '2026-09-01 08:00:00',
        publico_alvo: 'GERAL',
        descricao: 'Inativo para testes',
        data_criacao: '2026-08-01 10:00:00',
        ativo: 0, // Evento inativo para teste de erro 404
        chave_qr: null,
        id_equipe: null,
        ids_especificos: null
    }
];

const mockPresencas = [
    {
        id: 100,
        id_evento: 10,
        id_integrante: 1,
        nome_colete: 'Guerreiro',
        presente: 1,
        data_criacao: '22/09/2026 10:00:00',
        data_modificacao: '22/09/2026 10:00:00',
        justificativa_falta: null,
        justificativa_aceita: 0,
        nome_evento: 'Passeio Mensal da Serra'
    }
];

const mockEquipes = [
    { id: 1, nome_equipe: 'Banda de Apoio', ativo: 1 },
    { id: 2, nome_equipe: 'Diretoria Executiva', ativo: 1 }
];

const mockEquipamentos = [
    { id: 1, nome: 'Colete de Identificação P', patrimonio: 'EQ-001', status: 'DISPONIVEL' },
    { id: 2, nome: 'Rádio Comunicador VHF', patrimonio: 'EQ-002', status: 'EM_USO' }
];

module.exports = {
    mockIntegrantes,
    mockEventos,
    mockPresencas,
    mockEquipes,
    mockEquipamentos
};