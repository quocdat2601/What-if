# 🚀 GitHub Actions Setup Guide

## 📋 **Prerequisites**

1. **GitHub Repository**: Đảm bảo code đã được push lên GitHub
2. **GitHub Account**: Có quyền admin trên repository
3. **Docker Hub Account** (optional): Để push Docker images

## 🔐 **Setup GitHub Secrets**

### **1. Vào Repository Settings**
```
Repository → Settings → Secrets and variables → Actions
```

### **2. Thêm các Secrets cần thiết**

#### **Backend Secrets:**
```
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=whatif_prod
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
```

#### **Frontend Secrets:**
```
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=What If...
```

#### **Deployment Secrets:**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
SNYK_TOKEN=your_snyk_token
```

#### **Docker Secrets (optional):**
```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password
```

## 🎯 **Workflow Files Created**

### **1. Backend CI/CD** (`.github/workflows/backend-ci.yml`)
- ✅ **Test**: Jest tests với PostgreSQL
- ✅ **Lint**: ESLint + TypeScript check
- ✅ **Security**: npm audit
- ✅ **Build**: TypeScript compilation

### **2. Frontend CI/CD** (`.github/workflows/frontend-ci.yml`)
- ✅ **Test**: Vitest tests
- ✅ **Lint**: ESLint + TypeScript check
- ✅ **Build**: Vite production build
- ✅ **Preview**: Vercel preview deployment

### **3. Main Pipeline** (`.github/workflows/main-ci.yml`)
- ✅ **Combined Testing**: Backend + Frontend
- ✅ **Security Scanning**: Snyk integration
- ✅ **Quality Gates**: Coverage reports
- ✅ **Production Deploy**: Auto-deploy to main branch

## 🐳 **Docker Setup**

### **1. Build Images:**
```bash
# Backend
docker build -t whatif-backend ./backend

# Frontend
docker build -t whatif-frontend ./frontend
```

### **2. Run with Docker Compose:**
```bash
# Development
docker-compose up

# Production
docker-compose --profile production up -d
```

### **3. Individual Services:**
```bash
# Database only
docker-compose up postgres redis

# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend
```

## 🔄 **CI/CD Pipeline Flow**

### **On Push to Main:**
```
1. Code Push → GitHub
2. Backend Tests (Jest + PostgreSQL)
3. Frontend Tests (Vitest)
4. Security Scan (npm audit + Snyk)
5. Code Quality Check (ESLint + TypeScript)
6. Build Applications
7. Deploy to Production
```

### **On Pull Request:**
```
1. PR Created → GitHub
2. Backend Tests (Jest + PostgreSQL)
3. Frontend Tests (Vitest)
4. Security Scan
5. Code Quality Check
6. Build Applications
7. Deploy Preview (Vercel)
8. Merge if all checks pass
```

## 📊 **Monitoring & Reports**

### **1. Test Coverage:**
- **Backend**: Jest coverage reports
- **Frontend**: Vitest coverage reports
- **Combined**: Codecov integration

### **2. Security:**
- **npm audit**: Dependency vulnerabilities
- **Snyk**: Advanced security scanning
- **Rate limiting**: Nginx protection

### **3. Performance:**
- **Docker health checks**
- **Nginx monitoring**
- **Database connection pooling**

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Tests Failing:**
```bash
# Check test environment
npm test -- --verbose

# Check database connection
docker-compose logs postgres
```

#### **2. Build Failing:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check dependencies
npm ci
```

#### **3. Docker Issues:**
```bash
# Clean up containers
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## 📈 **Next Steps**

### **1. Advanced CI/CD:**
- [ ] **SonarQube Integration**: Code quality analysis
- [ ] **Performance Testing**: Lighthouse CI
- [ ] **E2E Testing**: Playwright/Cypress
- [ ] **Load Testing**: Artillery/K6

### **2. Deployment Options:**
- [ ] **Vercel**: Frontend hosting
- [ ] **Heroku**: Backend hosting
- [ ] **AWS**: Full cloud deployment
- [ ] **DigitalOcean**: VPS deployment

### **3. Monitoring:**
- [ ] **Sentry**: Error tracking
- [ ] **LogRocket**: User session replay
- [ ] **Analytics**: Google Analytics/Mixpanel
- [ ] **Uptime**: Status page

## 🎉 **Success!**

**Bạn đã setup thành công:**
- ✅ **GitHub Actions CI/CD**
- ✅ **Docker containerization**
- ✅ **Automated testing**
- ✅ **Security scanning**
- ✅ **Quality gates**
- ✅ **Production deployment**

**Bây giờ mỗi khi push code, GitHub sẽ tự động:**
1. **Chạy tests**
2. **Kiểm tra code quality**
3. **Scan security vulnerabilities**
4. **Build applications**
5. **Deploy to production** (nếu merge vào main)

**Happy coding! 🚀✨** 