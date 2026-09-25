# 📂 Project Guidelines & Architecture - Equipes Motoclube

Este documento estabelece as diretrizes de arquitetura, padrões de código, regras de negócio e fluxos de desenvolvimento para o projeto **Equipes Motoclube**.

---

## 🏗️ 1. Princípios Arquiteturais Inegociáveis

* **Herança Centralizada (`BaseController`):** 
  * Todas as controllers do projeto devem obrigatoriamente estender a `BaseController`.
  * A `BaseController` comanda a estrutura principal e as operações padrão de CRUD genérico.
* **Isolamento de Responsabilidades (Sem Validações na API):** 
  * **A camada de Controller NUNCA deve realizar validações de payloads** (ex: checar se campos obrigatórios estão vazios ou ausentes). 
  * Toda e qualquer validação de dados de entrada é de responsabilidade exclusiva do **cliente** (front-end/consumidor da API). As controllers delegam diretamente para os modelos.
* **Métodos Dedicados:** 
  * As controllers filhas devem conter estritamente métodos específicos e customizados que extrapolam o CRUD básico fornecido pela base (ex: buscas por tipo, status, datas, títulos, etc.).

---

## 🏛️ 2. Padrões da Camada de Modelos (`BaseModel` e Filhas)

* **Herança e Reutilização:**
  * Toda Model específica estende a `BaseModel`, passando o nome da tabela e a chave primária correspondente no construtor (`super('tabela', 'id_primaria')`).
  * A `BaseModel` centraliza as operações genéricas de persistência (CRUD) para evitar duplicação de código.
* **Comportamento de Chave Primária Nula:**
  * Caso o parâmetro de `primaryKey` seja nulo, métodos genéricos de listagem (como `getRecords()`) funcionam livremente para retornar todos os registros, enquanto métodos que dependem de um ID específico lançam um erro de validação interna.
* **Flexibilidade de Payload (Suporte a Lote / Arrays):**
  * Não importa se o payload recebido contém 1 (`object`) ou $N$ registros (`array`), **o formato de recebimento suporta e normaliza listas de registros/propriedades/parâmetros**.
  * A camada de modelo processa a entrada de forma transparente, identificando se é um array ou objeto único e iterando para tratar operações em lote quando aplicável.
* **Serialização e Desserialização:**
  * Métodos de mapeamento (`serialize` e `deserialize`) atuam isolando o formato de persistência do banco de dados das entidades de negócio.

---

## 📐 3. Padrões de Código e Assinaturas (Controllers)

* **Estrutura de Métodos Customizados:**
  * Devem ser rigorosamente blindados com blocos `try/catch`.
  * Devem utilizar os helpers herdados da base para padronizar as respostas (`this.sendSuccess` para sucesso e `this.sendError` para falhas/exceções).
  * Exemplo padrão:
    ```javascript
    async getByCustomParam(req, res) {
        try {
            const { param } = req.params; // ou req.query
            const result = await targetModel.findCustom(param);
            return this.sendSuccess(res, result, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
    ```
* **Binding no Construtor:**
  * Métodos customizados na controller devem possuir o bind explícito no construtor para evitar perda de contexto do `this`:
    ```javascript
    constructor() {
        super(targetModel, 'EntityName');
        this.methodName = this.methodName.bind(this);
    }
    ```

---

## 📦 4. Contrato de API (Payloads)

O formato de comunicação com a API é padronizado e obedece às seguintes regras:

* **Payload de Entrada (Request):**
  * Toda a entrada de dados (para criação e atualização) é feita exclusivamente via `req.body`.
  * **Polimorfismo:** O contrato aceita tanto um objeto único quanto um array de objetos para operações em lote. A API processa ambas as formas de maneira transparente.
    * *Exemplo Único:* `{ "nome": "Evento 1" }`
    * *Exemplo Lote:* `[{ "nome": "Evento 1" }, { "nome": "Evento 2" }]`

* **Payload de Saída (Response - Sucesso):**
  * Padronizado pelo método `this.sendSuccess`.
  * Estrutura:
    ```json
    {
      "success": true,
      "data": <Objeto Array de objetos ou>
    }
    ```

* **Payload de Saída (Response - Erro):**
  * Padronizado pelo método `this.sendError`.
  * Estrutura:
    ```json
    {
      "success": false,
      "message": "<Descrição clara do erro>"
    }
    ```

---

## 🔄 5. Ordem de Refatoração e Progresso

O desenvolvimento, refatoração e estruturação das entidades do projeto seguem estritamente a **ordem alfabética**:

1. `AccessProfileController` (e Model/Testes correspondentes)
2. `EquipmentController` (e Model/Testes correspondentes)
3. `EventController` (e Model/Testes correspondentes)
4. `MemberController` (Próximo na fila)
5. Demais entidades subsequentes...

---

## 🧪 6. Padrões de Testes Unitários e Cobertura

* **Cobertura de 100% (Incluindo Branches):**
  * As suítes de testes unitários devem obrigatoriamente buscar **100% de cobertura de código**, contemplando todas as ramificações (`branches`), instruções, funções e linhas.
* **Uso Obrigatório de Mocks:**
  * Os testes devem utilizar sempre os **mocks dedicados** para as Models como fonte de dados de teste (localizados em `tests/mocks/`).
* **Isolamento e Limpeza:**
  * Sempre limpar os mocks no ciclo de vida dos testes (`jest.clearAllMocks()`).
  * Mockar explicitamente os models utilizando `jest.mock('../../src/models/TargetModel')`.
* **Cenários Obrigatórios:**
  * Validar fluxos de sucesso (retornos `200`, `201`).
  * Validar tratamentos de erro de infraestrutura/model (retornos `500`).