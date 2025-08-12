import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import './App.css';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="App">
                  <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Profile Page</h1>
              <p className="text-gray-300 mb-6">Coming soon...</p>
              <button onClick={() => window.history.back()} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                Go Back
              </button>
            </div>
          </div>} />
          <Route path="/settings" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
              <p className="text-gray-300 mb-6">Coming soon...</p>
              <button onClick={() => window.history.back()} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                Go Back
              </button>
            </div>
          </div>} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App; 