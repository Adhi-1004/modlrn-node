import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedBackground from '../components/AnimatedBackground';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [totalExamsTaken, setTotalExamsTaken] = useState(0);
    const [averageScore, setAverageScore] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Fetch student data
                const studentResponse = await axios.get('/api/student');
                setStudentData(studentResponse.data);
                
                // Fetch assessment history
                const assessmentResponse = await axios.get('/api/assessment-history');
                const history = assessmentResponse.data;
                
                // Calculate stats
                setTotalExamsTaken(history.length);
                
                if (history.length > 0) {
                    const totalScore = history.reduce((sum, assessment) => sum + assessment.score, 0);
                    setAverageScore(Math.round(totalScore / history.length));
                }
                
                // Fetch achievements
                const achievementsResponse = await axios.get('/api/achievements');
                setAchievements(achievementsResponse.data);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                // Use mock data if API fails
                const mockStudent = {
                    id: "12345",
                    name: "John Doe",
                    email: "john.doe@example.com",
                    grade: "12th Grade",
                    joinedOn: "January 15, 2023",
                    profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
                };
                
                setStudentData(mockStudent);
                setTotalExamsTaken(24);
                setAverageScore(78);
                
                const mockAchievements = [
                    { id: 1, name: "Fast Learner", description: "Completed 5 assessments in a single day", icon: "🚀", date: "Mar 5, 2023" },
                    { id: 2, name: "Perfect Score", description: "Achieved 100% on an assessment", icon: "🏆", date: "Apr 12, 2023" },
                    { id: 3, name: "Consistent Performer", description: "Maintained an average score above 80% for 10 assessments", icon: "📈", date: "May 20, 2023" },
                    { id: 4, name: "Subject Master", description: "Scored above 90% in all Math assessments", icon: "🧠", date: "Jun 8, 2023" },
                    { id: 5, name: "Dedication Award", description: "Logged in for 30 consecutive days", icon: "🔥", date: "Jul 15, 2023" }
                ];
                
                setAchievements(mockAchievements);
                setLoading(false);
            }
        };
        
        fetchStudentData();
    }, []);

    const handleEditProfile = () => {
        setShowEditForm(true);
        setShowSettings(false);
    };

    const handleSettings = () => {
        setShowSettings(true);
        setShowEditForm(false);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
                <div className="text-white text-xl">Loading profile...</div>
            </div>
        );
    }

    return (
        <>
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/50 z-0"></div>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 py-8 relative z-10"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Student Profile</h2>
                </div>
                
                {/* Profile Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 border border-indigo-500/30 rounded-xl shadow-lg overflow-hidden mb-8"
                >
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gradient-to-br from-indigo-800 to-purple-800 p-6 flex flex-col items-center justify-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-400 mb-4">
                                <img 
                                    src={studentData.profileImage || "https://via.placeholder.com/150"} 
                                    alt={studentData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{studentData.name}</h3>
                            <p className="text-indigo-200 mb-4">{studentData.grade}</p>
                            <div className="flex space-x-3">
                                <button 
                                    className={`px-3 py-1 ${showEditForm ? 'bg-indigo-400' : 'bg-indigo-600'} text-white rounded-md hover:bg-indigo-700`}
                                    onClick={handleEditProfile}
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    className={`px-3 py-1 ${showSettings ? 'bg-purple-400' : 'bg-purple-600'} text-white rounded-md hover:bg-purple-700`}
                                    onClick={handleSettings}
                                >
                                    Settings
                                </button>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                            {!showEditForm && !showSettings && (
                                <>
                                    <h4 className="text-xl font-semibold text-indigo-300 mb-4">Student Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Student ID</p>
                                            <p className="text-white">{studentData.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Email</p>
                                            <p className="text-white">{studentData.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Joined On</p>
                                            <p className="text-white">{studentData.joinedOn}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Last Assessment</p>
                                            <p className="text-white">June 15, 2023</p>
                                        </div>
                                    </div>
                                    
                                    <h4 className="text-xl font-semibold text-indigo-300 mt-8 mb-4">Academic Overview</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/30">
                                            <p className="text-indigo-200 text-sm">Total Assessments</p>
                                            <p className="text-3xl font-bold text-white">{totalExamsTaken}</p>
                                        </div>
                                        <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/30">
                                            <p className="text-indigo-200 text-sm">Average Score</p>
                                            <p className="text-3xl font-bold text-white">{averageScore}%</p>
                                        </div>
                                        <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/30">
                                            <p className="text-indigo-200 text-sm">Top Subject</p>
                                            <p className="text-3xl font-bold text-white">Mathematics</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {showEditForm && (
                                <div className="animate-fade-in">
                                    <h4 className="text-xl font-semibold text-indigo-300 mb-4">Edit Profile</h4>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1">Name</label>
                                            <input 
                                                type="text" 
                                                defaultValue={studentData.name}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1">Email</label>
                                            <input 
                                                type="email" 
                                                defaultValue={studentData.email}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1">Grade</label>
                                            <select className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2">
                                                <option value="9th Grade">9th Grade</option>
                                                <option value="10th Grade">10th Grade</option>
                                                <option value="11th Grade">11th Grade</option>
                                                <option value="12th Grade" selected>12th Grade</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1">Profile Image URL</label>
                                            <input 
                                                type="text" 
                                                defaultValue={studentData.profileImage}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3 pt-2">
                                            <button 
                                                type="button"
                                                onClick={() => setShowEditForm(false)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="button"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {showSettings && (
                                <div className="animate-fade-in">
                                    <h4 className="text-xl font-semibold text-indigo-300 mb-4">Account Settings</h4>
                                    <div className="space-y-6">
                                        <div>
                                            <h5 className="text-white font-medium mb-2">Password</h5>
                                            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                                                Change Password
                                            </button>
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium mb-2">Notification Preferences</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <input type="checkbox" id="emailNotif" className="mr-2" defaultChecked />
                                                    <label htmlFor="emailNotif" className="text-gray-300">Email Notifications</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" id="assessmentReminders" className="mr-2" defaultChecked />
                                                    <label htmlFor="assessmentReminders" className="text-gray-300">Assessment Reminders</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" id="newFeatures" className="mr-2" defaultChecked />
                                                    <label htmlFor="newFeatures" className="text-gray-300">New Features Updates</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium mb-2">Account Management</h5>
                                            <div className="space-y-2">
                                                <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                                                    Export My Data
                                                </button>
                                                <button className="block px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 mt-2">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button 
                                                type="button"
                                                onClick={() => setShowSettings(false)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
                
                {/* Achievements */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800 border border-indigo-500/30 rounded-xl shadow-lg p-6 mb-8"
                >
                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Achievements & Badges</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 p-4 rounded-lg border border-indigo-500/30 hover:border-indigo-400/50 transition"
                            >
                                <div className="flex items-start">
                                    <div className="text-3xl mr-3">{achievement.icon}</div>
                                    <div>
                                        <h4 className="text-white font-medium">{achievement.name}</h4>
                                        <p className="text-indigo-200 text-sm mb-2">{achievement.description}</p>
                                        <p className="text-indigo-300 text-xs">Achieved on {achievement.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                
                {/* Recent Activity */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 border border-indigo-500/30 rounded-xl shadow-lg p-6 mb-8"
                >
                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center p-3 bg-indigo-900/30 rounded-lg">
                            <div className="mr-4 bg-green-500 p-2 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white">Completed Science Assessment with score 85%</p>
                                <p className="text-xs text-indigo-300">June 15, 2023 - 2:30 PM</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-indigo-900/30 rounded-lg">
                            <div className="mr-4 bg-blue-500 p-2 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white">Started new Mathematics Assessment</p>
                                <p className="text-xs text-indigo-300">June 14, 2023 - 4:15 PM</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-indigo-900/30 rounded-lg">
                            <div className="mr-4 bg-purple-500 p-2 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white">Updated profile information</p>
                                <p className="text-xs text-indigo-300">June 12, 2023 - 10:30 AM</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <button className="text-indigo-300 hover:text-indigo-100 text-sm font-medium">
                            View Full Activity Log →
                        </button>
                    </div>
                </motion.div>
                
                {/* Back to Dashboard button moved to bottom */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-12"
                >
                    <button
                        onClick={handleBackToDashboard}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-lg hover:bg-indigo-700 transition flex items-center justify-center mx-auto"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </motion.div>
                
                {/* Floating action button for mobile - keep this for mobile users */}
                <div className="fixed bottom-6 right-6 md:hidden z-20">
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Profile; 