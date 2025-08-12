# 🎮 What If... Frontend

> React frontend for the What If... narrative choice-based game, built with TypeScript and modern web technologies.

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   └── Register.tsx    # Registration page
├── services/           # API services
│   └── authService.ts  # Authentication service
├── types/              # TypeScript type definitions
│   └── auth.ts         # Authentication types
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎯 **Features**

### **Authentication System**
- **Login Page**: Username/password authentication
- **Register Page**: User registration with validation
- **Form Validation**: Real-time input validation
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first approach

### **UI/UX Features**
- **Modern Design**: Gradient backgrounds and shadows
- **Responsive Layout**: Works on all device sizes
- **Smooth Animations**: CSS transitions and animations
- **Accessibility**: Proper labels and ARIA attributes

## 🔧 **Technology Stack**

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## 📱 **Pages Overview**

### **Login Page (`/login`)**
- Clean, modern login form
- Username and password fields
- Form validation and error handling
- Link to registration page
- Demo account information

### **Register Page (`/register`)**
- Comprehensive registration form
- Username, email, password fields
- Real-time validation
- Password confirmation
- Link back to login

## 🎨 **Styling**

### **Design System**
- **Color Palette**: Blue, purple, and indigo gradients
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle depth with box-shadows

### **CSS Classes**
```css
/* Primary button */
.btn-primary

/* Secondary button */
.btn-secondary

/* Form inputs */
.input-field

/* Cards */
.card

/* Text gradients */
.text-gradient

/* Game backgrounds */
.bg-game
```

## 🔌 **API Integration**

### **Authentication Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### **Service Layer**
The `AuthService` class handles all authentication operations:
- Login/logout
- User registration
- Token management
- Profile updates
- Error handling

## 🚀 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

### **Development Server**
- **URL**: http://localhost:5173
- **Hot Reload**: Enabled
- **TypeScript**: Full support
- **ESLint**: Code quality checks

## 📦 **Dependencies**

### **Production Dependencies**
- `react` & `react-dom`: React framework
- `react-router-dom`: Client-side routing
- `axios`: HTTP client
- `tailwindcss`: CSS framework

### **Development Dependencies**
- `typescript`: Type safety
- `vite`: Build tool
- `@types/react`: React type definitions
- `eslint`: Code linting

## 🔒 **Security Features**

- **Input Validation**: Client-side form validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: Local storage for auth tokens

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Mobile-First Approach**
- Responsive grid system
- Touch-friendly buttons
- Optimized form inputs
- Mobile navigation

## 🧪 **Testing**

### **Test Setup**
- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **Coverage Reports**: Code coverage analysis

### **Running Tests**
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 🚀 **Deployment**

### **Build Process**
```bash
# Create production build
npm run build

# Preview build locally
npm run preview
```

### **Deployment Options**
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting
- **AWS S3**: Scalable hosting

## 🔧 **Configuration**

### **Environment Variables**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=What If...
```

### **Vite Configuration**
- **Base URL**: Configurable base path
- **Build Output**: Optimized for production
- **Dev Server**: Fast refresh enabled

## 🤝 **Contributing**

1. **Follow Code Style**: Use Prettier and ESLint
2. **Write Tests**: Add tests for new features
3. **Type Safety**: Use TypeScript strictly
4. **Documentation**: Update README for changes

## 📄 **License**

MIT License - see [LICENSE](../LICENSE) file for details.

---

**Happy coding! 🎮✨** 