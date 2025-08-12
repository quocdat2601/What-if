# 🏗️ What If... Project Structure - Clean Architecture

## 📁 **Root Directory Structure**

```
whatif/
├── 📁 backend/                 # Backend API Server
├── 📁 frontend/                # React Frontend App
├── 📁 shared/                  # Shared Types & Schemas
├── 📁 infra/                   # Infrastructure & DevOps
├── 📁 docs/                    # Documentation
├── 📁 scripts/                 # Build & Deployment Scripts
└── 📁 README.md                # Project Overview
```

## 🎯 **Backend Structure (Clean Architecture)**

```
backend/
├── 📁 src/
│   ├── 📁 Core/                    # Domain Layer (Entities, Business Rules)
│   │   ├── 📁 Entities/            # Domain Objects
│   │   │   ├── 📄 Player.ts
│   │   │   ├── 📄 GameRun.ts
│   │   │   ├── 📄 Event.ts
│   │   │   ├── 📄 Choice.ts
│   │   │   ├── 📄 Timeline.ts
│   │   │   ├── 📄 Talent.ts
│   │   │   ├── 📄 Perk.ts
│   │   │   └── 📄 MetaPoints.ts
│   │   ├── 📁 Interfaces/          # Abstract Contracts
│   │   │   ├── 📄 IEventService.ts
│   │   │   ├── 📄 IRunService.ts
│   │   │   ├── 📄 IPlayerService.ts
│   │   │   ├── 📄 IAIService.ts
│   │   │   ├── 📄 IEventRepository.ts
│   │   │   ├── 📄 IRunRepository.ts
│   │   │   └── 📄 ICacheService.ts
│   │   ├── 📁 Services/            # Domain Business Logic
│   │   │   ├── 📄 EventService.ts
│   │   │   ├── 📄 RunService.ts
│   │   │   ├── 📄 PlayerService.ts
│   │   │   ├── 📄 AIService.ts
│   │   │   ├── 📄 MetaProgressionService.ts
│   │   │   └── 📄 GameEngineService.ts
│   │   ├── 📁 ValueObjects/        # Immutable Value Objects
│   │   │   ├── 📄 Age.ts
│   │   │   ├── 📄 Stats.ts
│   │   │   ├── 📄 Seed.ts
│   │   │   └── 📄 EventId.ts
│   │   ├── 📁 Enums/               # Domain Constants
│   │   │   ├── 📄 EventType.ts
│   │   │   ├── 📄 ChoiceType.ts
│   │   │   ├── 📄 StatType.ts
│   │   │   └── 📄 Difficulty.ts
│   │   └── 📁 Exceptions/          # Domain Exceptions
│   │       ├── 📄 GameException.ts
│   │       ├── 📄 EventNotFoundException.ts
│   │       └── 📄 InvalidChoiceException.ts
│   │
│   ├── 📁 Application/             # Use Cases Layer (Application Logic)
│   │   ├── 📁 UseCases/            # Application Use Cases
│   │   │   ├── 📄 CreateRunUseCase.ts
│   │   │   ├── 📄 GetNextEventUseCase.ts
│   │   │   ├── 📄 MakeChoiceUseCase.ts
│   │   │   ├── 📄 SaveGameUseCase.ts
│   │   │   ├── 📄 LoadGameUseCase.ts
│   │   │   ├── 📄 UnlockTalentUseCase.ts
│   │   │   └── 📄 GenerateAIEventUseCase.ts
│   │   ├── 📁 DTOs/                # Data Transfer Objects
│   │   │   ├── 📄 CreateRunDTO.ts
│   │   │   ├── 📄 EventDTO.ts
│   │   │   ├── 📄 ChoiceDTO.ts
│   │   │   ├── 📄 RunStateDTO.ts
│   │   │   └── 📄 MetaProgressionDTO.ts
│   │   ├── 📁 Validators/          # Input Validation
│   │   │   ├── 📄 CreateRunValidator.ts
│   │   │   ├── 📄 ChoiceValidator.ts
│   │   │   └── 📄 EventValidator.ts
│   │   └── 📁 Mappers/             # Entity-DTO Mappers
│   │       ├── 📄 EventMapper.ts
│   │       ├── 📄 RunMapper.ts
│   │       └── 📄 PlayerMapper.ts
│   │
│   ├── 📁 Infrastructure/          # External Concerns (DB, APIs, etc.)
│   │   ├── 📁 Database/            # Database Layer
│   │   │   ├── 📁 Repositories/    # Data Access Objects
│   │   │   │   ├── 📄 EventRepository.ts
│   │   │   │   ├── 📄 RunRepository.ts
│   │   │   │   ├── 📄 PlayerRepository.ts
│   │   │   │   ├── 📄 TimelineRepository.ts
│   │   │   │   └── 📄 MetaProgressionRepository.ts
│   │   │   ├── 📁 Models/          # Database Models
│   │   │   │   ├── 📄 EventModel.ts
│   │   │   │   ├── 📄 RunModel.ts
│   │   │   │   ├── 📄 PlayerModel.ts
│   │   │   │   └── 📄 TimelineModel.ts
│   │   │   ├── 📁 Migrations/      # Database Migrations
│   │   │   │   ├── 📄 001_initial_schema.sql
│   │   │   │   ├── 📄 002_add_ai_cache.sql
│   │   │   │   └── 📄 003_add_analytics.sql
│   │   │   └── 📄 Database.ts      # Database Connection
│   │   ├── 📁 External/            # External Services
│   │   │   ├── 📁 AI/              # AI Service Integration
│   │   │   │   ├── 📄 OpenAIClient.ts
│   │   │   │   ├── 📄 LocalLLMClient.ts
│   │   │   │   └── 📄 AICacheService.ts
│   │   │   ├── 📁 Cache/           # Caching Layer
│   │   │   │   ├── 📄 RedisService.ts
│   │   │   │   └── 📄 MemoryCacheService.ts
│   │   │   └── 📁 Queue/           # Background Job Queue
│   │   │       ├── 📄 BullQueueService.ts
│   │   │       └── 📄 AIEventGenerator.ts
│   │   ├── 📁 Config/              # Configuration
│   │   │   ├── 📄 DatabaseConfig.ts
│   │   │   ├── 📄 AIConfig.ts
│   │   │   ├── 📄 AppConfig.ts
│   │   │   └── 📄 Environment.ts
│   │   └── 📁 Utils/               # Infrastructure Utilities
│   │       ├── 📄 Logger.ts
│   │       ├── 📄 SeededRNG.ts
│   │       ├── 📄 EventValidator.ts
│   │       └── 📄 SecurityUtils.ts
│   │
│   ├── 📁 Presentation/            # API Layer (Controllers, Routes)
│   │   ├── 📁 Controllers/         # HTTP Controllers
│   │   │   ├── 📄 GameController.ts
│   │   │   ├── 📄 PlayerController.ts
│   │   │   ├── 📄 EventController.ts
│   │   │   └── 📄 MetaController.ts
│   │   ├── 📁 Routes/              # API Route Definitions
│   │   │   ├── 📄 gameRoutes.ts
│   │   │   ├── 📄 playerRoutes.ts
│   │   │   ├── 📄 eventRoutes.ts
│   │   │   └── 📄 metaRoutes.ts
│   │   ├── 📁 Middleware/          # HTTP Middleware
│   │   │   ├── 📄 AuthMiddleware.ts
│   │   │   ├── 📄 ValidationMiddleware.ts
│   │   │   ├── 📄 RateLimitMiddleware.ts
│   │   │   └── 📄 ErrorHandlerMiddleware.ts
│   │   ├── 📁 Schemas/             # API Request/Response Schemas
│   │   │   ├── 📄 gameSchemas.ts
│   │   │   ├── 📄 playerSchemas.ts
│   │   │   └── 📄 eventSchemas.ts
│   │   └── 📄 App.ts               # Express App Setup
│   │
│   ├── 📁 Shared/                  # Shared Utilities & Types
│   │   ├── 📁 Types/               # Common Type Definitions
│   │   │   ├── 📄 ApiResponse.ts
│   │   │   ├── 📄 Pagination.ts
│   │   │   └── 📄 CommonTypes.ts
│   │   ├── 📁 Constants/           # Application Constants
│   │   │   ├── 📄 GameConstants.ts
│   │   │   ├── 📄 APIConstants.ts
│   │   │   └── 📄 ErrorMessages.ts
│   │   └── 📁 Utils/               # Common Utilities
│   │       ├── 📄 DateUtils.ts
│   │       ├── 📄 MathUtils.ts
│   │       └── 📄 ValidationUtils.ts
│   │
│   └── 📄 index.ts                 # Application Entry Point
│
├── 📁 tests/                       # Test Suite
│   ├── 📁 Unit/                    # Unit Tests
│   │   ├── 📁 Core/
│   │   │   ├── 📄 EventService.test.ts
│   │   │   ├── 📄 RunService.test.ts
│   │   │   └── 📄 GameEngineService.test.ts
│   │   ├── 📁 Application/
│   │   │   ├── 📄 CreateRunUseCase.test.ts
│   │   │   └── 📄 MakeChoiceUseCase.test.ts
│   │   └── 📁 Infrastructure/
│   │       ├── 📄 EventRepository.test.ts
│   │       └── 📄 AIService.test.ts
│   ├── 📁 Integration/             # Integration Tests
│   │   ├── 📄 GameFlow.test.ts
│   │   ├── 📄 Database.test.ts
│   │   └── 📄 APITest.ts
│   ├── 📁 E2E/                     # End-to-End Tests
│   │   └── 📄 GamePlayflow.test.ts
│   ├── 📁 Mocks/                   # Test Mocks & Fixtures
│   │   ├── 📄 MockEventData.ts
│   │   ├── 📄 MockPlayerData.ts
│   │   └── 📄 MockAIService.ts
│   └── 📄 setup.ts                 # Test Configuration
│
├── 📁 scripts/                     # Build & Utility Scripts
│   ├── 📄 build.sh                 # Build Script
│   ├── 📄 start.sh                 # Start Script
│   ├── 📄 test.sh                  # Test Script
│   └── 📄 deploy.sh                # Deployment Script
│
├── 📁 config/                       # Configuration Files
│   ├── 📄 tsconfig.json            # TypeScript Configuration
│   ├── 📄 jest.config.js           # Jest Test Configuration
│   ├── 📄 nodemon.json             # Development Server Config
│   └── 📄 .env.example             # Environment Variables Template
│
├── 📄 package.json                  # Dependencies & Scripts
├── 📄 tsconfig.json                 # TypeScript Configuration
├── 📄 .eslintrc.js                  # ESLint Configuration
├── 📄 .prettierrc                   # Prettier Configuration
└── 📄 Dockerfile                    # Docker Configuration
```

## 🎯 **Frontend Structure (React + TypeScript)**

```
frontend/
├── 📁 src/
│   ├── 📁 components/              # Reusable UI Components
│   │   ├── 📁 common/              # Generic Components
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Modal.tsx
│   │   │   ├── 📄 Loading.tsx
│   │   │   └── 📄 ErrorBoundary.tsx
│   │   ├── 📁 game/                # Game-Specific Components
│   │   │   ├── 📄 EventPanel.tsx
│   │   │   ├── 📄 ChoiceButtons.tsx
│   │   │   ├── 📄 StatPanel.tsx
│   │   │   ├── 📄 Timeline.tsx
│   │   │   └── 📄 MetaShop.tsx
│   │   └── 📁 layout/              # Layout Components
│   │       ├── 📄 Header.tsx
│   │       ├── 📄 Sidebar.tsx
│   │       └── 📄 Footer.tsx
│   ├── 📁 pages/                   # Page Components
│   │   ├── 📄 Home.tsx
│   │   ├── 📄 Game.tsx
│   │   ├── 📄 Profile.tsx
│   │   └── 📄 MetaShop.tsx
│   ├── 📁 hooks/                   # Custom React Hooks
│   │   ├── 📄 useGameState.ts
│   │   ├── 📄 useEvent.ts
│   │   ├── 📄 usePlayer.ts
│   │   └── 📄 useMetaProgression.ts
│   ├── 📁 services/                # API Service Layer
│   │   ├── 📄 api.ts               # Base API Client
│   │   ├── 📄 gameService.ts
│   │   ├── 📄 playerService.ts
│   │   └── 📄 eventService.ts
│   ├── 📁 store/                   # State Management
│   │   ├── 📄 gameSlice.ts
│   │   ├── 📄 playerSlice.ts
│   │   └── 📄 store.ts
│   ├── 📁 types/                   # TypeScript Type Definitions
│   │   ├── 📄 game.ts
│   │   ├── 📄 player.ts
│   │   ├── 📄 event.ts
│   │   └── 📄 api.ts
│   ├── 📁 utils/                   # Utility Functions
│   │   ├── 📄 gameUtils.ts
│   │   ├── 📄 dateUtils.ts
│   │   └── 📄 validationUtils.ts
│   ├── 📁 styles/                  # Styling
│   │   ├── 📄 global.css
│   │   ├── 📄 variables.css
│   │   └── 📄 components.css
│   └── 📄 App.tsx                  # Main App Component
│
├── 📁 public/                       # Static Assets
│   ├── 📄 index.html
│   ├── 📄 favicon.ico
│   └── 📁 images/
├── 📁 tests/                        # Frontend Tests
│   ├── 📄 setupTests.ts
│   └── 📁 __mocks__/
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.ts
└── 📄 .env.example
```

## 🔄 **Shared Package Structure**

```
shared/
├── 📁 src/
│   ├── 📁 types/                   # Common Type Definitions
│   │   ├── 📄 Event.ts
│   │   ├── 📄 Player.ts
│   │   ├── 📄 GameRun.ts
│   │   ├── 📄 Choice.ts
│   │   └── 📄 Common.ts
│   ├── 📁 schemas/                 # JSON Schemas
│   │   ├── 📄 eventSchema.ts
│   │   ├── 📄 playerSchema.ts
│   │   └── 📄 gameSchema.ts
│   ├── 📁 constants/               # Shared Constants
│   │   ├── 📄 GameConstants.ts
│   │   ├── 📄 EventTypes.ts
│   │   └── 📄 StatTypes.ts
│   ├── 📁 utils/                   # Shared Utilities
│   │   ├── 📄 validation.ts
│   │   ├── 📄 formatting.ts
│   │   └── 📄 calculations.ts
│   └── 📄 index.ts                 # Package Entry Point
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 README.md
```

## 🚀 **Key Benefits of This Structure**

### **1. Separation of Concerns**
- **Core**: Pure business logic, no external dependencies
- **Application**: Orchestrates use cases, business rules
- **Infrastructure**: Handles external concerns (DB, APIs)
- **Presentation**: Manages user interface and API endpoints

### **2. Dependency Inversion**
- Core layer defines interfaces
- Infrastructure implements interfaces
- Application depends on abstractions, not concretions

### **3. Testability**
- Each layer can be tested independently
- Easy to mock dependencies
- Clear boundaries for unit vs integration tests

### **4. Maintainability**
- Changes in one layer don't affect others
- Clear responsibilities for each component
- Easy to add new features or modify existing ones

### **5. Scalability**
- Can easily add new infrastructure implementations
- Multiple frontends can use the same backend
- Easy to split into microservices later

## 📋 **Next Steps Implementation Order**

1. **Week 0**: Set up project structure and basic configuration
2. **Week 1**: Implement Core entities and basic services
3. **Week 2**: Add Application use cases and DTOs
4. **Week 3**: Implement Infrastructure layer (DB, basic AI)
5. **Week 4**: Create Presentation layer (API endpoints)
6. **Week 5**: Add frontend components and state management
7. **Week 6**: Integration testing and bug fixes

## 🔧 **Development Commands**

```bash
# Backend
cd backend
npm install
npm run dev          # Development server
npm run build        # Build production
npm run test         # Run tests
npm run test:watch   # Watch mode tests

# Frontend
cd frontend
npm install
npm run dev          # Development server
npm run build        # Build production
npm run test         # Run tests
npm run preview      # Preview build

# Shared
cd shared
npm install
npm run build        # Build shared package
npm run test         # Run tests
```

## 📚 **Recommended Dependencies**

### **Backend**
- `express` - Web framework
- `typeorm` or `prisma` - Database ORM
- `joi` or `zod` - Validation
- `jest` - Testing
- `winston` - Logging

### **Frontend**
- `react` + `react-dom` - UI library
- `@reduxjs/toolkit` - State management
- `axios` - HTTP client
- `react-query` - Data fetching
- `vitest` - Testing

### **Shared**
- `zod` - Schema validation
- `typescript` - Type safety
- `date-fns` - Date utilities

Cấu trúc này sẽ giúp bạn build một dự án maintainable và scalable! 🚀 