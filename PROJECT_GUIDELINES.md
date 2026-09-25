# 📂 Project Guidelines & Architecture - Equipes Motoclube

This document establishes the architecture guidelines, code standards, business rules, and development workflows for the **Equipes Motoclube** project.

---

## 🛠️ 1. Tech Stack

Standardizing the environment and tools is essential to ensure reproducibility and code consistency across development, testing, and production environments.

* **Operating System (OS):**
  * **Development and Testing:** Linux (or WSL2 on Windows with a Linux environment).
  * **Production:** Linux Distribution (Ubuntu Server/Debian or equivalent).
* **Programming Language:**
  * JavaScript (Node.js).
* **Database:**
  * **MySQL** (Main persistence engine).
* **Recommended IDEs:**
  * Visual Studio Code (VS Code), WebStorm, or any text editor with support for Node.js linting and debugging plugins.
* **Runtime Dependencies (Main):**
  * Express (HTTP Framework).
  * MySQL2 (Driver for database connection and manipulation).
  * Other runtime libraries required for the API (as per `package.json`).
* **Development Dependencies (Main):**
  * Jest (Framework for unit tests, assertions, and coverage).
  * Nodemon (Live-reload for development).
  * Linting/Formatting tools (ESLint, Prettier, etc., as per `package.json`).

---

## 🏗️ 2. Non-Negotiable Architectural Principles

* **Centralized Inheritance (`BaseController`):** 
  * All project controllers must strictly extend the `BaseController`.
  * The `BaseController` commands the main structure and generic CRUD operations.
* **Responsibility Isolation (No Validations in the API):** 
  * **The Controller layer must NEVER perform payload validations** (e.g., checking for missing or empty mandatory fields). 
  * Any and all input data validation is the exclusive responsibility of the **client** (front-end/API consumer). Controllers delegate directly to the models.
* **Dedicated Methods:** 
  * Child controllers must strictly contain specific and customized methods that extrapolate the basic CRUD provided by the base (e.g., searching by type, status, dates, titles, etc.).
* **Layer-Oriented Refactoring:**
  * Refactoring, when necessary, must strictly follow the structural flow of layers and their respective test suites, in this exact order:
    1. `Model` + `Mock` + `Test`
    2. `Controller` + `Test`
    3. `Router` + `Test`
    4. `Server` + `Test`

---

## 🏛️ 3. Model Layer Standards (`BaseModel` and Children)

* **Inheritance and Reusability:**
  * Every specific Model extends the `BaseModel`, passing the table name and the corresponding primary key in the constructor (`super('table', 'primary_id')`).
  * The `BaseModel` centralizes generic persistence operations (CRUD) to avoid code duplication.
* **Null Primary Key Behavior:**
  * If the `primaryKey` parameter is null, generic listing methods (like `getRecords()`) operate freely to return all records, while methods relying on a specific ID will throw an internal validation error.
* **Payload Flexibility (Batch / Array Support):**
  * Regardless of whether the received payload contains 1 (`object`) or $N$ records (`array`), **the reception format supports and normalizes lists of records/properties/parameters**.
  * The model layer processes the input transparently, identifying whether it is an array or a single object and iterating to handle batch operations when applicable.
* **Serialization and Deserialization:**
  * Mapping methods (`serialize` and `deserialize`) act to isolate the database persistence format from the business entities.

---

## 📐 4. Code Standards and Signatures (Controllers)

* **Custom Method Structure:**
  * Must be strictly shielded with `try/catch` blocks.
  * Must use the helpers inherited from the base class to standardize responses (`this.sendSuccess` for success and `this.sendError` for failures/exceptions).
  * Standard example:
    ```javascript
    async getByCustomParam(req, res) {
        try {
            const { param } = req.params; // or req.query
            const result = await targetModel.findCustom(param);
            return this.sendSuccess(res, result, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
    ```
* **Constructor Binding:**
  * Custom methods in the controller must have explicit binding in the constructor to avoid losing the `this` context:
    ```javascript
    constructor() {
        super(targetModel, 'EntityName');
        this.methodName = this.methodName.bind(this);
    }
    ```

---

## 📦 5. API Contract (Payloads)

The API communication format is standardized and follows these rules:

* **Input Payload (Request):**
  * All data input (for creation and updates) is done exclusively via `req.body`.
  * **Polimorphism:** The contract accepts both a single object and an array of objects for batch operations. The API processes both forms transparently.
    * *Single Example:* `{ "name": "Event 1" }`
    * *Batch Example:* `[{ "name": "Event 1" }, { "name": "Event 2" }]`

* **Output Payload (Response - Success):**
  * Standardized by the `this.sendSuccess` method.
  * Structure:
    ```json
    {
      "success": true,
      "data": <Object Array objects of or>
    }
    ```

* **Output Payload (Response - Error):**
  * Standardized by the `this.sendError` method.
  * Structure:
    ```json
    {
      "success": false,
      "message": "<Clear description error of the>"
    }
    ```

---

## 🔄 6. Progress Tracking & Workflow (`TODO.md`)

To maintain a clean and synchronized development process, all refactoring, active queues, and progress tracking are managed exclusively via the **`TODO.md`** file located at the root of the repository.

* **Single Source of Truth for Workflow:** Always refer to the `TODO.md` for the current active target.
* **Strict Order:** The `TODO.md` enforces the alphabetical execution of entities and the mandatory layer-by-layer progression (`Model` -> `Controller` -> `Router` -> `Server`).
* **Checklist Discipline:** Developers must check off items in the `TODO.md` immediately upon completing a layer and its tests with 100% coverage before moving to the next task.

---

## 🧪 7. Unit Testing and Coverage Standards

* **100% Coverage (Including Branches):**
  * Unit test suites must mandatorily achieve **100% code coverage**, encompassing all branches, statements, functions, and lines.
* **Mandatory Use of Mocks:**
  * Tests must always use the **dedicated mocks** for the Models as the test data source (located in `tests/mocks/`).
* **Isolation and Cleanup:**
  * Always clear mocks in the test lifecycle (`jest.clearAllMocks()`).
  * Explicitly mock the models using `jest.mock('../../src/models/TargetModel')`.
* **Mandatory Scenarios:**
  * Validate success flows (returns `200`, `201`).
  * Validate infrastructure/model error handling (returns `500`).