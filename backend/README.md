# 🎮 What If... Backend

> Backend API server for the What If... narrative choice-based game, built with Node.js, TypeScript, and Clean Architecture principles.

## 🏗️ **Architecture Overview**

This backend follows **Clean Architecture** principles, which means:

- **Core Layer**: Pure business logic, no external dependencies
- **Application Layer**: Use cases and application logic
- **Infrastructure Layer**: Database, external services, configuration
- **Presentation Layer**: API endpoints, controllers, middleware

## 📁 **Project Structure**

```
src/
├── Core/                    # Domain Layer (Business Logic)
│   ├── Entities/           # Core domain objects
│   │   ├── Player.ts       # Player entity with business rules
│   │   ├── Event.ts        # Event entity with choices
│   │   └── index.ts        # Export all entities
│   ├── Interfaces/         # Abstract contracts
│   │   ├── IPlayerService.ts
│   │   └── IEventService.ts
│   └── Services/           # Domain business logic
├── Application/            # Use Cases Layer
│   ├── UseCases/          # Application use cases
│   ├── DTOs/              # Data Transfer Objects
│   └── Validators/        # Input validation
├── Infrastructure/         # External Concerns
│   ├── Database/          # Database layer
│   ├── External/          # AI services, caching
│   └── Config/            # Configuration
└── Presentation/           # API Layer
    ├── Controllers/        # HTTP controllers
    ├── Routes/             # API routes
    └── Middleware/         # HTTP middleware
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)

### **Installation**
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials
```

### **Environment Variables**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/whatif_db

# Server
PORT=3000
NODE_ENV=development

# AI Service (optional)
OPENAI_API_KEY=your_openai_key
```

### **Development**
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 🎯 **Core Concepts**

### **1. Entities (Domain Objects)**
Entities are the heart of your business logic. They contain:
- **Business rules** and validation
- **Methods** that implement domain logic
- **No dependencies** on external frameworks

**Example: Player Entity**
```typescript
const player = Player.create("john_doe", "john@example.com");
if (player.canStartNewRun()) {
    // Player can start a new game
}
```

### **2. Interfaces (Contracts)**
Interfaces define what services must do, not how they do it:
- **Separation of concerns**
- **Easy to test** with mocks
- **Multiple implementations** possible

**Example: IPlayerService**
```typescript
interface IPlayerService {
    createPlayer(username: string): Promise<Player>;
    getPlayerById(id: string): Promise<Player | null>;
}
```

### **3. Services (Business Logic)**
Services implement the business logic defined in interfaces:
- **Use entities** to enforce business rules
- **Coordinate** between different parts of the system
- **Handle complex** business operations

## 🔧 **Key Features**

### **Game Engine**
- **Event Selection**: AI-powered event generation
- **Choice Resolution**: Stat-based outcome calculation
- **Meta Progression**: Talents and perks system

### **AI Integration**
- **Event Generation**: Dynamic story creation
- **Context Awareness**: Player state consideration
- **Caching**: Pre-generated event pools

### **Data Management**
- **PostgreSQL**: Reliable data storage
- **Redis**: High-performance caching
- **Migrations**: Database schema management

## 📊 **API Endpoints**

### **Player Management**
- `POST /api/players` - Create new player
- `GET /api/players/:id` - Get player by ID
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Deactivate player

### **Game Flow**
- `POST /api/game/new-run` - Start new game run
- `GET /api/game/next-event` - Get next event
- `POST /api/game/make-choice` - Make choice
- `GET /api/game/timeline` - Get run history

### **Meta Progression**
- `GET /api/meta/talents` - Available talents
- `POST /api/meta/unlock-talent` - Unlock talent
- `GET /api/meta/points` - Player's meta points

## 🧪 **Testing**

### **Test Structure**
```
tests/
├── Unit/           # Test individual components
├── Integration/    # Test component interactions
└── E2E/           # Test complete workflows
```

### **Running Tests**
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
npm start
```

### **Docker**
```bash
docker build -t whatif-backend .
docker run -p 3000:3000 whatif-backend
```

### **Environment Variables for Production**
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
REDIS_URL=your_production_redis_url
```

## 📚 **Learning Resources**

### **Clean Architecture**
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

### **TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### **Node.js & Express**
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 **Contributing**

1. **Follow Clean Architecture** principles
2. **Write tests** for new features
3. **Use TypeScript** strictly
4. **Document** your code
5. **Follow** the existing code style

## 📄 **License**

MIT License - see [LICENSE](../LICENSE) file for details.

---

**Happy coding! 🎮✨** 