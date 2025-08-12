import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: 'demo',
        password: 'demo123'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted, preventing default reload');
        
        // Client-side validation
        if (!formData.username.trim() || !formData.password.trim()) {
            const errorMsg = 'Please fill in all fields';
            setError(errorMsg);
            showToast(errorMsg, 'error');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            const response = await AuthService.login(formData);
            if (response.success) {
                // Store auth data
                if (response.data?.token && response.data?.user) {
                    AuthService.setAuthData(response.data.token, response.data.user);
                }
                showToast('Login successful! Welcome back!', 'success');
                setTimeout(() => navigate('/'), 1000);
            } else {
                const errorMsg = response.message || 'Login failed';
                setError(errorMsg);
                showToast(errorMsg, 'error');
            }
        } catch (error: any) {
            console.error('Login error caught in component:', error);
            console.log('Error response status:', error.response?.status);
            console.log('Error response data:', error.response?.data);
            
            let errorMsg = 'Invalid username or password';
            
            // Handle different types of errors
            if (error.response?.status === 401) {
                errorMsg = 'Invalid username or password';
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            } else if (error.code === 'NETWORK_ERROR') {
                errorMsg = 'Network error. Please check your connection.';
            }
            
            console.log('Setting error message:', errorMsg);
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white">?</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome Back!
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Continue your journey in What If...
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Account Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                        <div className="flex items-center mb-2">
                            <span className="text-blue-400 mr-2">🎮</span>
                            <h3 className="text-blue-300 font-medium">Demo Account</h3>
                        </div>
                        <p className="text-blue-200 text-sm">
                            For testing: <span className="font-mono">demo / demo123</span>
                        </p>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm">
                    <p>What If... - Choose Your Destiny</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 