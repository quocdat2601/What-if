# 🚀 What If... Project Setup Guide

## 📋 **Prerequisites**

### **Required Software**
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **DBeaver** - [Download here](https://dbeaver.io/download/)
- **Git** - [Download here](https://git-scm.com/)

### **Database Setup**
1. **Install PostgreSQL** and create a database named `whatif_db`
2. **Open DBeaver** and connect to your PostgreSQL database
3. **Run the SQL script** from `database-setup.sql` to create tables and sample data

## 🗄️ **Database Connection**

### **Step 1: Create Database**
```sql
-- In PostgreSQL
CREATE DATABASE whatif_db;
```

### **Step 2: Run Setup Script**
1. Open DBeaver
2. Connect to `whatif_db`
3. Open `database-setup.sql`
4. Execute the entire script

### **Step 3: Verify Setup**
```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check sample data
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM talents;
SELECT COUNT(*) FROM perks;
```

## 🔧 **Backend Setup**

### **Step 1: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 2: Configure Environment**
1. Copy `env.example` to `.env`
2. Update database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whatif_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key_here
```

### **Step 3: Start Backend**
```bash
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully!
🚀 Server running on port 3000
```

## 🌐 **Frontend Setup**

### **Step 1: Install Dependencies**
```bash
cd frontend
npm install
```

### **Step 2: Start Frontend**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.4.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🧪 **Testing the Setup**

### **1. Database Connection**
- Backend should show "✅ Database connected successfully!"
- Check DBeaver for active connections

### **2. Frontend Access**
- Open http://localhost:5173 in browser
- Should redirect to `/login`
- See beautiful login form with gradients

### **3. Backend API**
- Backend running on http://localhost:3000
- Database connected and ready

## 🔍 **Troubleshooting**

### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if port 5432 is open
netstat -an | grep 5432

# Test connection
psql -h localhost -U your_username -d whatif_db
```

### **Port Conflicts**
```bash
# Check what's using port 3000
netstat -an | grep 3000

# Check what's using port 5173
netstat -an | grep 5173
```

### **Dependencies Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 **What You'll See**

### **Login Page Features**
- ✨ Beautiful gradient background
- 📝 Username/password form
- 🔒 Form validation
- 📱 Responsive design
- 🎮 Demo account info

### **Register Page Features**
- 🆕 User registration form
- ✅ Real-time validation
- 🎨 Modern UI design
- 📱 Mobile-friendly

## 🚀 **Next Steps**

### **Phase 1: Basic Authentication**
- [x] Database setup
- [x] Backend structure
- [x] Frontend pages
- [ ] Backend API endpoints
- [ ] Authentication middleware

### **Phase 2: Game Engine**
- [ ] Event system
- [ ] Choice resolution
- [ ] Game state management
- [ ] Basic gameplay

### **Phase 3: AI Integration**
- [ ] AI event generation
- [ ] Context-aware storytelling
- [ ] Event caching system

## 📚 **Learning Resources**

### **Node.js & TypeScript**
- [Node.js Documentation](https://nodejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **React & Frontend**
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Database & Backend**
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)

## 🎯 **Current Status**

✅ **Completed:**
- Project structure (Clean Architecture)
- Database schema and sample data
- Frontend pages (Login/Register)
- Backend entities and interfaces
- Basic styling and responsive design

🔄 **In Progress:**
- Backend API endpoints
- Database connection service
- Authentication system

⏳ **Next:**
- Complete backend API
- Connect frontend to backend
- Test full authentication flow

---

**🎮 Ready to start your What If... journey! 🚀** 