import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import AuthService from '../services/authService';

interface GameEvent {
    id: string;
    event_id: string;
    type: string;
    title: string;
    description: string;
    choices: Array<{
        id: string;
        text: string;
        effects: Array<{
            stat: string;
            delta: number;
        }>;
    }>;
    tags: string[];
}

interface PlayerStats {
    hp: number;
    mood: number;
    finance: number;
    social: number;
    relationship: number;
    energy: number;
    knowledge: number;
    age: number;
}

const Game: React.FC = () => {
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        hp: 100,
        mood: 50,
        finance: 50,
        social: 50,
        relationship: 50,
        energy: 100,
        knowledge: 0,
        age: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        checkAuthAndLoadEvent();
    }, []);

    const checkAuthAndLoadEvent = async () => {
        try {
            const token = AuthService.getToken();
            if (!token) {
                showToast('Please login to play!', 'error');
                navigate('/login');
                return;
            }

            // Load the first event (birth event)
            await loadFirstEvent();
        } catch (error) {
            console.error('Error loading game:', error);
            showToast('Failed to load game!', 'error');
            navigate('/home');
        }
    };

    const loadFirstEvent = async () => {
        try {
            // For now, we'll use a mock event that matches the database
            // Later, this will come from the backend API
            const mockEvent: GameEvent = {
                id: '1',
                event_id: 'evt_001',
                type: 'milestone',
                title: 'Chào đời',
                description: 'Bạn được sinh ra trong một gia đình bình thường. Đây là khởi đầu của cuộc hành trình dài phía trước. Bạn sẽ làm gì trong khoảnh khắc đầu tiên này?',
                choices: [
                    {
                        id: 'c1',
                        text: 'Khóc to',
                        effects: [
                            { stat: 'hp', delta: -5 },
                            { stat: 'mood', delta: -10 }
                        ]
                    },
                    {
                        id: 'c2',
                        text: 'Im lặng',
                        effects: [
                            { stat: 'hp', delta: 5 },
                            { stat: 'mood', delta: 10 }
                        ]
                    }
                ],
                tags: ['birth', 'milestone']
            };

            setCurrentEvent(mockEvent);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading first event:', error);
            showToast('Failed to load event!', 'error');
        }
    };

    const handleChoice = (choiceId: string) => {
        setSelectedChoice(choiceId);
        setShowResult(true);
    };

    const applyChoiceEffects = (choiceId: string) => {
        if (!currentEvent) return;

        const choice = currentEvent.choices.find(c => c.id === choiceId);
        if (!choice) return;

        const newStats = { ...playerStats };
        
        choice.effects.forEach(effect => {
            if (effect.stat in newStats) {
                (newStats as any)[effect.stat] += effect.delta;
                
                // Ensure stats stay within bounds
                if (effect.stat === 'hp') {
                    (newStats as any)[effect.stat] = Math.max(0, Math.min(100, (newStats as any)[effect.stat]));
                } else if (effect.stat === 'mood' || effect.stat === 'finance' || effect.stat === 'social' || effect.stat === 'relationship') {
                    (newStats as any)[effect.stat] = Math.max(0, Math.min(100, (newStats as any)[effect.stat]));
                } else if (effect.stat === 'energy') {
                    (newStats as any)[effect.stat] = Math.max(0, Math.min(100, (newStats as any)[effect.stat]));
                }
            }
        });

        // Age increases with each choice
        newStats.age += 1;
        
        setPlayerStats(newStats);
        
        // Show result message
        const choiceText = choice.text;
        showToast(`Bạn đã chọn: ${choiceText}`, 'info');
    };

    const handleNextEvent = () => {
        // For now, just show a message that more events are coming
        showToast('More events coming soon! This is just the beginning of your journey.', 'success');
        setShowResult(false);
        setSelectedChoice(null);
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading your adventure...</p>
                </div>
            </div>
        );
    }

    if (!currentEvent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-lg mb-4">No events available</p>
                    <button
                        onClick={handleBackToHome}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackToHome}
                                className="text-gray-300 hover:text-white mr-4 transition-colors duration-200"
                            >
                                ← Back to Home
                            </button>
                            <h1 className="text-xl font-bold text-white">What If... - Game</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-300 text-sm">Age: {playerStats.age}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Event Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            {/* Event Header */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-3">
                                        {currentEvent.type === 'milestone' ? '🎯' : 
                                         currentEvent.type === 'opportunity' ? '✨' : 
                                         currentEvent.type === 'random' ? '🎲' : '🔗'}
                                    </span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{currentEvent.title}</h2>
                                        <p className="text-gray-400 text-sm capitalize">{currentEvent.type}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-lg leading-relaxed">{currentEvent.description}</p>
                            </div>

                            {/* Choices */}
                            {!showResult && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">What will you do?</h3>
                                    {currentEvent.choices.map((choice) => (
                                        <button
                                            key={choice.id}
                                            onClick={() => handleChoice(choice.id)}
                                            className="w-full text-left p-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-purple-400 transition-all duration-200"
                                        >
                                            <p className="text-white font-medium">{choice.text}</p>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Result */}
                            {showResult && selectedChoice && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Your Choice</h3>
                                    <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                                        <p className="text-green-300 font-medium">
                                            Bạn đã chọn: {currentEvent.choices.find(c => c.id === selectedChoice)?.text}
                                        </p>
                                    </div>
                                    
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={handleNextEvent}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            Continue Journey
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowResult(false);
                                                setSelectedChoice(null);
                                            }}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            Choose Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Stats Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                            
                            <div className="space-y-4">
                                {/* HP */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 text-sm">❤️ Health</span>
                                        <span className="text-white font-medium">{playerStats.hp}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${playerStats.hp}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Mood */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 text-sm">😊 Mood</span>
                                        <span className="text-white font-medium">{playerStats.mood}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${playerStats.mood}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Energy */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 text-sm">⚡ Energy</span>
                                        <span className="text-white font-medium">{playerStats.energy}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${playerStats.energy}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Other Stats */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs">💰 Finance</p>
                                        <p className="text-white font-medium">{playerStats.finance}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs">👥 Social</p>
                                        <p className="text-white font-medium">{playerStats.social}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs">💕 Relationship</p>
                                        <p className="text-white font-medium">{playerStats.relationship}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs">🧠 Knowledge</p>
                                        <p className="text-white font-medium">{playerStats.knowledge}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game; 