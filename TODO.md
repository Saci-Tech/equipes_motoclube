# 📋 Refactoring Roadmap: Equipes Motoclube

## 🏗️ 1. Infrastructure & Base Architecture
- [x] Establish `PROJECT_GUIDELINES.md` as the single source of truth.
- [x] `config/database.js` (Setup and connection).
- [x] Layer 1: `BaseModel.js` & `BaseModel.test.js` + `baseModel.mock.js`.
- [x] Layer 2: `BaseController.js` & `BaseController.test.js`.

## 🛡️ 2. Middlewares
- [x] `authMiddleware.js` & `authMiddleware.test.js` (100% coverage).
- [ ] Refactor `rateLimiter.js` & `rateLimiter.test.js`.

## 🗄️ 3. Layer 1: Models & Mocks (✅ Fully Completed)
*All Models, their dedicated mocks, and unit tests exist and are completed.*
- [x] `AccessProfileModel.js` & Test + Mock
- [x] `EquipmentModel.js` & Test + Mock
- [x] `EventModel.js` & Test + Mock
- [x] `MemberEquipmentModel.js` & Test + Mock
- [x] `MemberModel.js` & Test + Mock
- [x] `MemberTeamModel.js` & Test + Mock
- [x] `PresenceModel.js` & Test + Mock
- [x] `TeamModel.js` & Test + Mock

## 🚀 4. Layers 2 & 3: Controllers & Routers (🔄 Active Queue)
*Strict alphabetical order. Validations are delegated to the client. Must achieve 100% coverage.*

### A - AccessProfile
- [x] Layer 2: `AccessProfileController.js` & `AccessProfileController.test.js` (Done).
- [ ] Layer 3: Create `accessProfileRoutes.js` & `accessProfileRoutes.test.js` *(Currently missing in src/ and tests/)*.

### E - Equipment
- [x] Layer 2: `EquipmentController.js` & `EquipmentController.test.js` (Done).
- [ ] Layer 3: Refactor `equipmentRoutes.js` & `equipmentRoutes.test.js`.

### E - Event
- [x] Layer 2: `EventController.js` & `EventController.test.js` (Done).
- [ ] Layer 3: Refactor `eventRoutes.js` & `eventRoutes.test.js`.

### M - Member (🎯 CURRENT TARGET)
- [ ] Layer 2: Refactor `MemberController.js` (Extend `BaseController`, no validations).
- [ ] Layer 2: Refactor `MemberController.test.js` (100% coverage, success/500 scenarios).
- [ ] Layer 3: Refactor `memberRoutes.js` (Map routes to controller methods).
- [ ] Layer 3: Refactor `memberRoutes.test.js`.

### M - MemberEquipment *(To Be Created)*
- [ ] Layer 2: Create `MemberEquipmentController.js` & `MemberEquipmentController.test.js`.
- [ ] Layer 3: Create `memberEquipmentRoutes.js` & `memberEquipmentRoutes.test.js`.

### M - MemberTeam *(To Be Created)*
- [ ] Layer 2: Create `MemberTeamController.js` & `MemberTeamController.test.js`.
- [ ] Layer 3: Create `memberTeamRoutes.js` & `memberTeamRoutes.test.js`.

### P - Presence
- [ ] Layer 2: Refactor `PresenceController.js` & `PresenceController.test.js`.
- [ ] Layer 3: Refactor `presenceRoutes.js` & `presenceRoutes.test.js`.

### T - Team
- [ ] Layer 2: Refactor `TeamController.js` & `TeamController.test.js`.
- [ ] Layer 3: Refactor `teamRoutes.js` & `teamRoutes.test.js`.

## 🌐 5. Layer 4: Server Integration
- [ ] Refactor `routes/index.js` & `routes/index.test.js`.
- [ ] Refactor `server.js` & `server.test.js`.
- [ ] Execute full suite `npm test` & inspect final coverage report.