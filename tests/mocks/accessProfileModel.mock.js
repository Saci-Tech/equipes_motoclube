/**
 * Mocks centralizados para testes unitários do AccessProfileModel
 */
const accessProfileModelMock = {
    validProfile: {
        id: 1,
        nome: 'Administrador',
        descricao: 'Acesso total ao sistema',
        ativo: 1
    },
    validProfileWithPermissionsRaw: [
        {
            id: 1,
            nome: 'Administrador',
            descricao: 'Acesso total ao sistema',
            ativo: 1,
            permission_id: 100,
            permission_name: 'CRIAR_USUARIO'
        },
        {
            id: 1,
            nome: 'Administrador',
            descricao: 'Acesso total ao sistema',
            ativo: 1,
            permission_id: 101,
            permission_name: 'DELETAR_USUARIO'
        }
    ],
    validProfileWithPermissionsResult: {
        id: 1,
        nome: 'Administrador',
        descricao: 'Acesso total ao sistema',
        ativo: 1,
        permissions: [
            { id: 100, name: 'CRIAR_USUARIO' },
            { id: 101, name: 'DELETAR_USUARIO' }
        ]
    },
    validProfileWithoutPermissionsRaw: [
        {
            id: 2,
            nome: 'Visitante',
            descricao: 'Acesso de leitura',
            ativo: 1,
            permission_id: null,
            permission_name: null
        }
    ],
    validProfileWithoutPermissionsResult: {
        id: 2,
        nome: 'Visitante',
        descricao: 'Acesso de leitura',
        ativo: 1,
        permissions: []
    }
};

module.exports = accessProfileModelMock;