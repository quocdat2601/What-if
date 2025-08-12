import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await AuthService.register({
                username: formData.username,
                email: formData.email || undefined,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });
            
            if (response.success) {
                showToast('Registration successful! Please log in.', 'success');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                const errorMsg = response.message || 'Registration failed';
                setError(errorMsg);
                showToast(errorMsg, 'error');
            }
        } catch (error) {
            const errorMsg = 'Network error. Please try again.';
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
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Join the Adventure!
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Create your account in What If...
                    </p>
                </div>

                {/* Register Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                                Username *
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                placeholder="Choose a unique username"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email (Optional)
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Password *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                placeholder="Create a strong password"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                                Confirm Password *
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                placeholder="Confirm your password"
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
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Requirements Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                        <div className="flex items-center mb-2">
                            <span className="text-green-400 mr-2">ℹ️</span>
                            <h3 className="text-green-300 font-medium">Requirements</h3>
                        </div>
                        <ul className="text-green-200 text-sm space-y-1">
                            <li>• Username: minimum 3 characters</li>
                            <li>• Password: minimum 6 characters</li>
                            <li>• Email is optional</li>
                        </ul>
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
                            >
                                Sign in here
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

export default Register; 