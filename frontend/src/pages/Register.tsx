import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content - Để trống để bạn tự thiết kế */}
            <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Register Page</h2>
                    <p className="text-gray-300">
                        Trang này đã được để trống để bạn tự thiết kế theo ý muốn.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Bạn có thể sử dụng HTML, CSS, JS thuần hoặc React components với Tailwind CSS
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Register; 