import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content - Sử dụng HTML template */}
            <main className="w-full h-[calc(100vh-80px)]">
                <iframe 
                    src="/login-template.html"
                    className="w-full h-full border-none"
                    title="Login Form"
                />
            </main>
        </div>
    );
};

export default Login; 