# 📋 **TODOLIST - What If... Game Development**

> **Các task cần hoàn thành TRƯỚC KHI focus vào main gameplay**

---

## 🎯 **MỤC TIÊU TỔNG QUAN**

**Mục tiêu MVP rõ ràng:**
- ✅ Web app PC-first, text-only
- ✅ Support: start run → show event → choose → apply result → save
- ✅ Không vẽ art/animation ở giai đoạn này
- ✅ Tập trung vào core game loop trước

---

## 🚀 **PHASE 0: PREPARATION & INFRASTRUCTURE (Week 0-1)**

### **✅ ĐÃ HOÀN THÀNH**
- [x] Tạo monorepo structure
- [x] Setup backend (Node.js + Express + TypeScript)
- [x] Setup frontend (React + Vite + TypeScript)
- [x] Database schema và sample data
- [x] Authentication system (login/register)
- [x] Basic UI components và routing
- [x] Database connection và basic API endpoints

### **🔄 ĐANG THỰC HIỆN**
- [ ] Hoàn thiện Clean Architecture structure
- [ ] Setup testing framework (Jest + Vitest)
- [ ] Setup CI/CD pipeline (GitHub Actions)

### **⏳ CẦN LÀM NGAY**

#### **1. Testing Infrastructure (Ưu tiên cao)**
- [ ] **Setup Jest cho backend**
  ```bash
  cd backend
  npm install --save-dev jest @types/jest ts-jest
  ```
- [ ] **Setup Vitest cho frontend**
  ```bash
  cd frontend
  npm install --save-dev vitest @testing-library/react
  ```
- [ ] **Tạo test configuration files**
  - `backend/jest.config.js`
  - `frontend/vitest.config.ts`
- [ ] **Viết basic tests cho Core entities**
  - `Player.test.ts`
  - `Event.test.ts`

#### **2. Error Handling & Validation (Ưu tiên cao)**
- [ ] **Implement global error handling middleware**
  ```typescript
  // backend/src/Presentation/Middleware/ErrorHandlerMiddleware.ts
  ```
- [ ] **Add input validation cho tất cả API endpoints**
  ```typescript
  // backend/src/Presentation/Middleware/ValidationMiddleware.ts
  ```
- [ ] **Implement proper HTTP status codes và error messages**

#### **3. Logging & Monitoring (Ưu tiên trung bình)**
- [ ] **Setup Winston logger cho backend**
- [ ] **Add request logging middleware**
- [ ] **Implement basic analytics tracking**

---

## 🎮 **PHASE 1: CORE GAME ENGINE (Week 1-2)**

### **🔄 CORE GAME LOOP IMPLEMENTATION**

#### **1. Game State Management (Ưu tiên cao)**
- [ ] **Tạo GameState entity**
  ```typescript
  // backend/src/Core/Entities/GameState.ts
  interface GameState {
    runId: string;
    playerId: string;
    currentAge: number;
    stats: PlayerStats;
    energy: number;
    timeline: TimelineEntry[];
    flags: Record<string, any>;
    seed: number;
  }
  ```
- [ ] **Implement GameEngine service**
  ```typescript
  // backend/src/Core/Services/GameEngineService.ts
  class GameEngineService {
    createNewRun(playerId: string, seed: number): GameState
    getNextEvent(gameState: GameState): Event
    resolveChoice(gameState: GameState, choiceId: string): GameState
    advanceTime(gameState: GameState): GameState
  }
  ```

#### **2. Event Selection System (Ưu tiên cao)**
- [ ] **Implement EventService với deterministic RNG**
  ```typescript
  // backend/src/Core/Services/EventService.ts
  class EventService {
    selectNextEvent(gameState: GameState, seed: number): Event
    checkPrerequisites(event: Event, gameState: GameState): boolean
    calculateEventWeight(event: Event, gameState: GameState): number
  }
  ```
- [ ] **Add seeded PRNG implementation**
  ```typescript
  // backend/src/Infrastructure/Utils/SeededRNG.ts
  class SeededRNG {
    constructor(seed: number)
    next(): number
    nextInt(min: number, max: number): number
    nextFloat(): number
  }
  ```

#### **3. Choice Resolution System (Ưu tiên cao)**
- [ ] **Implement ChoiceResolver service**
  ```typescript
  // backend/src/Core/Services/ChoiceResolverService.ts
  class ChoiceResolverService {
    resolveChoice(choice: Choice, gameState: GameState): ChoiceResult
    applyEffects(effects: StatEffect[], gameState: GameState): GameState
    checkSkillRequirements(choice: Choice, gameState: GameState): boolean
  }
  ```

#### **4. Stats & Effects System (Ưu tiên cao)**
- [ ] **Hoàn thiện PlayerStats interface**
  ```typescript
  // backend/src/Core/Entities/PlayerStats.ts
  interface PlayerStats {
    hp: number;        // Health (0-100)
    mood: number;      // Mood (0-100)
    finance: number;   // Finance (0-100)
    social: number;    // Social Status (0-100)
    relationship: number; // Relationships (0-100)
    energy: number;    // Energy (0-100)
    knowledge: number; // Knowledge/Experience (0-100)
    luck: number;      // Luck (hidden, 0-100)
    reputation: number; // Reputation (hidden, 0-100)
    riskLevel: number; // Risk Level (hidden, 0-100)
  }
  ```
- [ ] **Implement StatModifier system**
  ```typescript
  // backend/src/Core/Entities/StatModifier.ts
  interface StatModifier {
    stat: keyof PlayerStats;
    delta: number;
    multiplier?: number;
    duration?: number; // for temporary effects
  }
  ```

### **🔄 API ENDPOINTS IMPLEMENTATION**

#### **1. Core Game API (Ưu tiên cao)**
- [ ] **POST /api/game/new-run**
  ```typescript
  // backend/src/Presentation/Controllers/GameController.ts
  async createNewRun(req: Request, res: Response): Promise<Response>
  ```
- [ ] **GET /api/game/next-event**
  ```typescript
  async getNextEvent(req: Request, res: Response): Promise<Response>
  ```
- [ ] **POST /api/game/make-choice**
  ```typescript
  async makeChoice(req: Request, res: Response): Promise<Response>
  ```
- [ ] **GET /api/game/state/:runId**
  ```typescript
  async getGameState(req: Request, res: Response): Promise<Response>
  ```

#### **2. Save/Load System (Ưu tiên trung bình)**
- [ ] **POST /api/game/save**
- [ ] **GET /api/game/save-slots**
- [ ] **POST /api/game/load/:slotId**
- [ ] **DELETE /api/game/save/:slotId**

---

## 📊 **PHASE 2: EVENT SYSTEM & CONTENT (Week 2-3)**

### **🔄 EVENT POOL CREATION**

#### **1. Canonical Events (Ưu tiên cao)**
- [ ] **Tạo 30+ canonical events theo GDD**
  ```typescript
  // backend/src/Infrastructure/Database/SeedData/events.ts
  const canonicalEvents: Event[] = [
    // Birth events (age 0-5)
    // Childhood events (age 6-12)
    // Teen events (age 13-19)
    // Young adult events (age 20-30)
    // Adult events (age 31-50)
    // Senior events (age 51+)
  ]
  ```
- [ ] **Implement event categories và tags**
  - `milestone` - Critical life events
  - `random` - RNG-driven events
  - `opportunity` - Choice-based opportunities
  - `chain` - Events that trigger other events

#### **2. Event Chaining System (Ưu tiên trung bình)**
- [ ] **Implement event prerequisites checking**
- [ ] **Add event flags và state tracking**
- [ ] **Create event branching logic**

#### **3. Event Templates (Ưu tiên thấp)**
- [ ] **Create event template system cho AI generation**
- [ ] **Implement event validation schemas**

### **🔄 DIFFICULTY & RNG SYSTEM**

#### **1. Difficulty Modes (Ưu tiên trung bình)**
- [ ] **Implement difficulty settings**
  - Easy: 95% success rate
  - Medium: 75% success rate
  - Hard: 50% success rate
- [ ] **Add difficulty modifiers cho stat checks**

#### **2. Branch Weights & Rarity (Ưu tiên thấp)**
- [ ] **Implement rarity system**
- [ ] **Add branch weight calculations**

---

## 🎯 **PHASE 3: META PROGRESSION (Week 3-4)**

### **🔄 META POINTS SYSTEM**

#### **1. Run Scoring (Ưu tiên trung bình)**
- [ ] **Implement run score calculation**
  ```typescript
  // backend/src/Core/Services/MetaProgressionService.ts
  class MetaProgressionService {
    calculateRunScore(gameState: GameState): number
    grantMetaPoints(playerId: string, score: number): void
    getPlayerMetaPoints(playerId: string): number
  }
  ```
- [ ] **Add scoring factors**
  - Survival time
  - Events triggered
  - Mini-goals completed
  - Ending quality

#### **2. Talents & Perks System (Ưu tiên thấp)**
- [ ] **Implement talent unlocking**
- [ ] **Add perk effects**
- [ ] **Create meta shop interface**

---

## 🧪 **PHASE 4: TESTING & POLISH (Week 4-5)**

### **🔄 TESTING & VALIDATION**

#### **1. Unit Tests (Ưu tiên cao)**
- [ ] **Test Core entities**
- [ ] **Test GameEngine logic**
- [ ] **Test Event selection algorithms**
- [ ] **Test Choice resolution**

#### **2. Integration Tests (Ưu tiên trung bình)**
- [ ] **Test complete game flow**
- [ ] **Test API endpoints**
- [ ] **Test database operations**

#### **3. Manual Testing (Ưu tiên cao)**
- [ ] **Test game loop với 30 events**
- [ ] **Verify deterministic RNG**
- [ ] **Test save/load functionality**
- [ ] **Validate stat calculations**

### **🔄 PERFORMANCE & OPTIMIZATION**

#### **1. Database Optimization (Ưu tiên trung bình)**
- [ ] **Add database indexes**
- [ ] **Optimize queries**
- [ ] **Implement connection pooling**

#### **2. Frontend Performance (Ưu tiên thấp)**
- [ ] **Add loading states**
- [ ] **Implement lazy loading**
- [ ] **Add error boundaries**

---

## 🚀 **PHASE 5: DEPLOYMENT & BETA (Week 5-6)**

### **🔄 DEPLOYMENT PREPARATION**

#### **1. Environment Configuration (Ưu tiên cao)**
- [ ] **Setup production environment variables**
- [ ] **Configure database cho production**
- [ ] **Setup logging cho production**

#### **2. Security & Validation (Ưu tiên cao)**
- [ ] **Add rate limiting**
- [ ] **Implement input sanitization**
- [ ] **Add CORS configuration**
- [ ] **Setup authentication middleware**

#### **3. Monitoring & Analytics (Ưu tiên trung bình)**
- [ ] **Setup error tracking (Sentry)**
- [ ] **Implement basic analytics**
- [ ] **Add health check endpoints**

---

## 📋 **WEEKLY CHECKLIST**

### **🎯 Week 1 (Current Week)**
- [ ] Setup testing infrastructure
- [ ] Implement GameState entity
- [ ] Create basic GameEngine service
- [ ] Add error handling middleware
- [ ] Write unit tests cho Core entities

### **🎯 Week 2**
- [ ] Implement Event selection system
- [ ] Add Choice resolution logic
- [ ] Create 15+ canonical events
- [ ] Test basic game loop
- [ ] Add save/load functionality

### **🎯 Week 3**
- [ ] Complete event pool (30+ events)
- [ ] Implement meta points system
- [ ] Add difficulty modes
- [ ] Test complete game flow
- [ ] Performance optimization

### **🎯 Week 4**
- [ ] Comprehensive testing
- [ ] Bug fixes và polish
- [ ] Security review
- [ ] Documentation update
- [ ] Prepare for beta deployment

---

## 🔧 **TECHNICAL REQUIREMENTS**

### **Backend Dependencies cần thêm:**
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest
npm install --save ajv # JSON validation
npm install --save winston # logging
npm install --save seedrandom # deterministic RNG
```

### **Frontend Dependencies cần thêm:**
```bash
cd frontend
npm install --save-dev vitest @testing-library/react
npm install --save zustand # state management
npm install --save react-query # data fetching
```

---

## 📚 **LEARNING OBJECTIVES**

### **Node.js + TypeScript:**
- [ ] Clean Architecture patterns
- [ ] Dependency injection
- [ ] Service layer design
- [ ] Error handling strategies
- [ ] Testing với Jest

### **React + TypeScript:**
- [ ] Custom hooks
- [ ] Context API
- [ ] State management
- [ ] Component testing
- [ ] Performance optimization

### **Game Development:**
- [ ] Deterministic RNG
- [ ] Event-driven architecture
- [ ] State management patterns
- [ ] Save/load systems
- [ ] Meta progression design

---

## 🎮 **SUCCESS CRITERIA**

### **MVP Ready khi:**
- [ ] Game loop hoạt động hoàn chỉnh
- [ ] 30+ events có thể chơi được
- [ ] Save/load system hoạt động
- [ ] Basic meta progression
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Security measures implemented

---

## 💡 **NEXT STEPS**

**Ngay bây giờ, hãy bắt đầu với:**
1. **Setup testing infrastructure** (Jest + Vitest)
2. **Implement GameState entity**
3. **Create basic GameEngine service**
4. **Write first unit tests**

**Sau đó move to:**
1. **Event selection system**
2. **Choice resolution logic**
3. **Canonical events creation**

---

**🎯 Mục tiêu: Có một game loop hoàn chỉnh trong 2 tuần tới!**

**Bạn có muốn tôi giúp implement task nào trước không? Tôi recommend bắt đầu với testing infrastructure và GameState entity! 🚀** 