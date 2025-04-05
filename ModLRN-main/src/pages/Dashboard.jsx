"use client"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedBackground from "../components/AnimatedBackground"
import axios from "axios"
import Chatbox from "../components/Chatbox"
import EnhancedChatbot from "../components/EnhancedChatbot"
import NotificationSystem from "../components/NotificationSystem"

function Dashboard({ user }) {
    const [subject, setSubject] = useState("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [loadingSubjects, setLoadingSubjects] = useState(true)
    const [recentScores, setRecentScores] = useState({})
    const [loading, setLoading] = useState(true)
    const [upcomingExams, setUpcomingExams] = useState([])
    const [loadingExams, setLoadingExams] = useState(true)
    const [expandedExam, setExpandedExam] = useState(null)
    const [weeklyRecap, setWeeklyRecap] = useState({})
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    // Fetch subjects
    useEffect(() => {
        setLoadingSubjects(true)
        axios.get("http://localhost:3001/api/subjects")
            .then(response => {
                setSubjects(response.data)
                // Set a default subject
                if (response.data.length > 0) {
                    setSubject(response.data[0].name)
                }
                setLoadingSubjects(false)
            })
            .catch(error => {
                console.error("Error fetching subjects:", error)
                // Set some default engineering subjects if API fails
                const engineeringSubjects = [
                    {
                        id: "ME",
                        name: "Mechanical Engineering",
                        icon: "🔧",
                        description: "Study of mechanical systems, thermodynamics, and manufacturing"
                    },
                    {
                        id: "EE",
                        name: "Electrical Engineering",
                        icon: "⚡",
                        description: "Study of electrical systems, electronics, and power generation"
                    },
                    {
                        id: "CE",
                        name: "Civil Engineering",
                        icon: "🏗️",
                        description: "Study of design and construction of physical structures and infrastructure"
                    },
                    {
                        id: "CMP",
                        name: "Computer Engineering",
                        icon: "💻",
                        description: "Study of computer hardware, software, and systems integration"
                    },
                    {
                        id: "CHE",
                        name: "Chemical Engineering",
                        icon: "🧪",
                        description: "Study of chemical processes and product development"
                    },
                    {
                        id: "SE",
                        name: "Software Engineering",
                        icon: "📱",
                        description: "Application of engineering principles to software development"
                    }
                ]
                setSubjects(engineeringSubjects)
                setSubject(engineeringSubjects[0].name)
                setLoadingSubjects(false)
            })
    }, [])

    // Fetch upcoming exams
    useEffect(() => {
        setLoadingExams(true)
        axios.get("http://localhost:3001/api/upcoming-exams")
            .then(response => {
                setUpcomingExams(response.data)
                setLoadingExams(false)
            })
            .catch(error => {
                console.error("Error fetching upcoming exams:", error)
                // Set some default engineering exams data if API fails
                setUpcomingExams([
                    { 
                        id: 1, 
                        title: "Mechanical Engineering Fundamentals", 
                        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                        description: "Test your knowledge of thermodynamics, fluid mechanics, and mechanical design",
                        topics: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Material Science"],
                        references: [
                            { type: "book", title: "Engineering Mechanics", author: "Dr. Michael Johnson" },
                            { type: "video", title: "Thermodynamics Basics", url: "https://youtu.be/example1" },
                            { type: "book", title: "Mechanics of Materials", author: "Prof. Robert Williams" }
                        ]
                    },
                    { 
                        id: 2, 
                        title: "Electrical Engineering Principles", 
                        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                        description: "Covers circuit analysis, digital electronics, and power systems",
                        topics: ["Circuit Theory", "Digital Electronics", "Power Systems", "Signal Processing"],
                        references: [
                            { type: "book", title: "Fundamentals of Electric Circuits", author: "Dr. Alexander" },
                            { type: "video", title: "Digital Electronics Fundamentals", url: "https://youtu.be/example2" },
                            { type: "video", title: "Power Systems Explained", url: "https://youtu.be/example3" }
                        ]
                    },
                    { 
                        id: 3, 
                        title: "Computer Engineering Assessment", 
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                        description: "Test your knowledge of computer architecture, networking, and operating systems",
                        topics: ["Computer Architecture", "Computer Networks", "Operating Systems", "Digital Logic"],
                        references: [
                            { type: "book", title: "Computer Organization and Design", author: "David Patterson" },
                            { type: "video", title: "Computer Networking Fundamentals", url: "https://youtu.be/example4" },
                            { type: "book", title: "Operating System Concepts", author: "Abraham Silberschatz" }
                        ]
                    },
                    { 
                        id: 4, 
                        title: "Civil Engineering Assessment", 
                        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                        description: "Covers structural analysis, soil mechanics, and construction materials",
                        topics: ["Structural Analysis", "Soil Mechanics", "Construction Materials", "Hydraulics"],
                        references: [
                            { type: "book", title: "Structural Analysis", author: "Prof. James Smith" },
                            { type: "video", title: "Soil Mechanics Fundamentals", url: "https://youtu.be/example5" },
                            { type: "book", title: "Construction Materials and Methods", author: "Dr. Lisa Chen" }
                        ]
                    }
                ])
                setLoadingExams(false)
            })
    }, [])

    // Fetch weekly recap data
    useEffect(() => {
        // Mock data for B.Tech subjects
        const mockData = {
            "Computer Science": {
                assessmentsTaken: 4,
                averageScore: 85,
                areasToImprove: ["Data Structures", "Algorithms"]
            },
            "Mechanical Engineering": {
                assessmentsTaken: 3,
                averageScore: 78,
                areasToImprove: ["Thermodynamics", "Fluid Mechanics"]
            },
            "Electrical Engineering": {
                assessmentsTaken: 2,
                averageScore: 82,
                areasToImprove: ["Circuit Theory", "Signal Processing"]
            },
            "Civil Engineering": {
                assessmentsTaken: 3,
                averageScore: 80,
                areasToImprove: ["Structural Analysis", "Geotechnical Engineering"]
            },
            "Chemical Engineering": {
                assessmentsTaken: 2,
                averageScore: 75,
                areasToImprove: ["Process Control", "Thermodynamics"]
            }
            // Add more subjects as needed
        };

        // Simulate API call
        setTimeout(() => {
            setWeeklyRecap(mockData);
                setLoading(false);
        }, 1000);
    }, []);

    // Format name for display
    const displayName = user?.name || user?.email?.split('@')[0] || "Student"

    // Format date to display in a more readable format
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Toggle expanded exam details
    const toggleExamDetails = (examId) => {
        if (expandedExam === examId) {
            setExpandedExam(null)
        } else {
            setExpandedExam(examId)
        }
    }

    return (
        <>
            <AnimatedBackground />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 py-8 mt-16"
            >
                {/* Header with notifications */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-center">Dashboard</h2>
                    <NotificationSystem user={user} />
                </div>

                <h2 className="text-3xl font-bold mb-6 text-gray-100">Welcome, {displayName}!</h2>

                {/* Subject Selection with Dropdown */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <h3 className="text-2xl font-semibold mb-6 text-white">Select a Subject</h3>
                    
                    {loadingSubjects ? (
                        <div className="text-center py-10">
                            <p className="text-white">Loading subjects...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Subject Dropdown */}
                            <div className="relative w-full md:w-1/2 lg:w-1/3 mx-auto">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-900/70 to-purple-900/70 border border-indigo-500/30 shadow-lg text-white"
                                >
                                    <span className="text-lg font-medium">{subject || "Select a Subject"}</span>
                                    <svg 
                                        className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 rounded-xl bg-gray-800 border border-indigo-500/30 shadow-lg py-2 max-h-60 overflow-y-auto">
                            {subjects.map((subject, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-3 hover:bg-indigo-700/50 cursor-pointer transition"
                                                onClick={() => {
                                                    setSubject(subject.name)
                                                    setIsDropdownOpen(false)
                                                }}
                                            >
                                                <span className="text-white">{subject.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Start Assessment Button */}
                            {subject && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center mt-6"
                                >
                                    <Link
                                        to="/assessment"
                                        state={{ subject: subject }}
                                        className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-lg hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300"
                                    >
                                        Start Assessment
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Upcoming Exams Section - Now positioned after subject selection */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10"
                >
                    <h3 className="text-2xl font-semibold mb-6 text-white">Upcoming Exams</h3>
                    
                    {loadingExams ? (
                        <div className="text-center py-4">
                            <p className="text-white">Loading upcoming exams...</p>
                        </div>
                    ) : upcomingExams.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {upcomingExams.map(exam => (
                                <motion.div
                                    key={exam.id}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-indigo-500/30 p-5 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden"
                                >
                                    {/* Exam header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-1">{exam.title}</h4>
                                            <p className="text-purple-200 mb-2">{exam.description}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <span className="bg-indigo-700/60 text-indigo-100 px-3 py-1 rounded text-sm inline-block">
                                                {formatDate(exam.date)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Topics */}
                                    <div className="mb-4">
                                        <h5 className="text-sm font-medium text-indigo-300 mb-2">Topics Covered:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {exam.topics && exam.topics.map((topic, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="bg-indigo-800/40 text-indigo-200 text-xs px-3 py-1 rounded-full"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Toggle button */}
                                    <button 
                                        onClick={() => toggleExamDetails(exam.id)}
                                        className="text-indigo-300 text-sm hover:text-indigo-200 mb-3 flex items-center"
                                    >
                                        {expandedExam === exam.id ? 'Hide References' : 'Show References'}
                                        <svg 
                                            className={`ml-1 w-4 h-4 transition-transform ${expandedExam === exam.id ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* References (conditionally shown) */}
                                    {expandedExam === exam.id && exam.references && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-indigo-900/30 border border-indigo-600/20 p-3 rounded-lg mb-4"
                                        >
                                            <h5 className="text-sm font-medium text-indigo-300 mb-2">Recommended Study Materials:</h5>
                                            <ul className="space-y-2">
                                                {exam.references.map((ref, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        {ref.type === 'book' ? (
                                                            <svg className="w-5 h-5 text-indigo-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5 text-indigo-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        )}
                                                        <div>
                                                            <p className="text-sm text-indigo-200">
                                                                <span className="font-medium">{ref.title}</span>
                                                                {ref.type === 'book' && ref.author && (
                                                                    <span className="text-indigo-300"> by {ref.author}</span>
                                                                )}
                                                            </p>
                                                            {ref.type === 'video' && ref.url && (
                                                                <a 
                                                                    href={ref.url}
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 mt-1"
                                                                >
                                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                                                                    </svg>
                                                                    Watch Video Tutorial
                                                                </a>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                    
                                    {/* Action buttons */}
                                    <div className="flex justify-end">
                                        <Link
                                            to="/assessment"
                                            state={{ subject: exam.title.split(' ')[0] }}
                                            className="bg-indigo-600/70 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-full transition duration-300"
                                        >
                                            Prepare Now
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-purple-900/20 border border-purple-500/30 p-5 rounded-xl">
                            <p className="text-purple-200">No upcoming exams scheduled. Take some practice assessments to improve your skills!</p>
                        </div>
                    )}
                </motion.div>

                {/* Student Profile Button - Added to top right corner */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="fixed top-20 right-8 z-40"
                >
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-white font-medium">Student Profile</span>
                    </Link>
                </motion.div>

                {/* Weekly Recap Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10"
                >
                    <h3 className="text-2xl font-semibold mb-6 text-white">Weekly Recap</h3>
                    
                    {loading ? (
                        <div className="text-center py-4">
                            <p className="text-white">Loading weekly recap...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-4">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(weeklyRecap).map(([subject, recap], index) => (
                                <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">{subject}</h3>
                                    <p className="text-indigo-200 mb-2">
                                        <span className="font-semibold">Assessments Taken:</span> {recap.assessmentsTaken}
                                    </p>
                                    <p className="text-indigo-200 mb-2">
                                        <span className="font-semibold">Average Score:</span> {recap.averageScore}%
                                    </p>
                                    <p className="text-indigo-200">
                                        <span className="font-semibold">Areas to Improve:</span> {recap.areasToImprove.join(', ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* View All Assessments Button */}
                <div className="text-center mb-6">
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        View All Assessments
                    </button>
                </div>

                {/* Add the AI Chatbot */}
                <EnhancedChatbot />
            </motion.div>
        </>
    )
}

export default Dashboard

