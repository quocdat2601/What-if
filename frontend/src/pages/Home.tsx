import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import AuthService from '../services/authService';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = AuthService.getToken();
            const currentUser = AuthService.getUser();
            
            if (token && currentUser) {
                // Verify token is still valid
                try {
                    // You can add a token validation API call here
                    setIsAuthenticated(true);
                    setUser(currentUser);
                } catch (error) {
                    // Token expired or invalid
                    AuthService.clearAuthData();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlay = () => {
        if (!isAuthenticated) {
            showToast('Please login to start playing!', 'info');
            navigate('/login');
        } else {
            showToast('Starting your adventure...', 'success');
            navigate('/game');
        }
    };

    const handleSettings = () => {
        if (!isAuthenticated) {
            showToast('Please login to access settings!', 'info');
            navigate('/login');
        } else {
            navigate('/settings');
        }
    };

    const handleLogout = () => {
        AuthService.clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
        showToast('Logged out successfully!', 'success');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <Navbar 
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Choose Your Destiny
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Experience infinite possibilities in a narrative choice-based adventure. 
                        Every decision shapes your story. Every life tells a different tale.
                    </p>
                    
                    {!isAuthenticated && (
                        <div className="flex justify-center space-x-4 mb-8">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Start Your Journey
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* Play Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center">
                            <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎮</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Play Game</h3>
                            <p className="text-gray-300 mb-6">
                                Start a new life and make choices that will determine your fate.
                            </p>
                            <button
                                onClick={handlePlay}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                            >
                                {isAuthenticated ? 'Start Playing' : 'Login to Play'}
                            </button>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center">
                            <div className="h-16 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Settings</h3>
                            <p className="text-gray-300 mb-6">
                                Customize your gaming experience and manage your account.
                            </p>
                            <button
                                onClick={handleSettings}
                                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                            >
                                {isAuthenticated ? 'Open Settings' : 'Login Required'}
                            </button>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center">
                            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👤</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Profile</h3>
                            <p className="text-gray-300 mb-6">
                                View your progress, achievements, and game history.
                            </p>
                            <button
                                onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                            >
                                {isAuthenticated ? 'View Profile' : 'Login Required'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-8">Game Features</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">🎲</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Random Events</h4>
                            <p className="text-gray-400 text-sm">Every playthrough is unique</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">🌳</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Branching Stories</h4>
                            <p className="text-gray-400 text-sm">Your choices matter</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">⭐</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Meta Progression</h4>
                            <p className="text-gray-400 text-sm">Unlock new possibilities</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">🤖</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">AI Events</h4>
                            <p className="text-gray-400 text-sm">Dynamic storytelling</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-400">
                        <p>What If... - Choose Your Destiny</p>
                        <p className="text-sm mt-2">© 2025 - Infinite possibilities await</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home; 