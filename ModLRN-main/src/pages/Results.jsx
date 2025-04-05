"use client"
import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedBackground from "../components/AnimatedBackground"
import axios from "axios"

function Results({ user }) {
    const location = useLocation()
    const { score, totalQuestions, subject, detailedResults = [] } = location.state || { 
        score: 0, 
        totalQuestions: 0, 
        subject: 'Unknown',
        detailedResults: []
    }
    const percentage = Math.round((score / totalQuestions) * 100)
    
    const [leaderboard, setLeaderboard] = useState([])
    const [strengths, setStrengths] = useState([])
    const [weaknesses, setWeaknesses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [explanations, setExplanations] = useState({})
    const [loadingExplanations, setLoadingExplanations] = useState(false)
    const [performanceHistory, setPerformanceHistory] = useState([])
    const canvasRef = useRef(null)

    // Initialize performance history (simulated data for demonstration)
    useEffect(() => {
        // Simulate past performance data (in a real app, this would come from a database)
        const previousScores = [
            { date: '1 week ago', score: Math.floor(Math.random() * 30) + 60 },
            { date: '2 weeks ago', score: Math.floor(Math.random() * 30) + 60 },
            { date: '3 weeks ago', score: Math.floor(Math.random() * 30) + 60 },
            { date: '1 month ago', score: Math.floor(Math.random() * 30) + 60 },
        ]
        
        // Add current score
        const updatedHistory = [
            ...previousScores,
            { date: 'Today', score: percentage }
        ]
        
        setPerformanceHistory(updatedHistory)
    }, [percentage])
    
    // Draw performance graph
    useEffect(() => {
        if (performanceHistory.length > 0 && canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            
            // Set canvas dimensions to match its container for proper scaling
            const container = canvas.parentElement
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight
            
            const width = canvas.width
            const height = canvas.height
            const padding = 40 // Space for labels
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height)
            
            // Draw background grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
            ctx.lineWidth = 1
            
            // Horizontal grid lines
            for (let i = 0; i <= 10; i++) {
                const y = padding + ((height - (padding * 2)) * i) / 10
                ctx.beginPath()
                ctx.moveTo(padding, y)
                ctx.lineTo(width - padding, y)
                ctx.stroke()
                
                // Add percentage labels on y-axis
                ctx.fillStyle = '#9ca3af'
                ctx.font = '12px sans-serif'
                ctx.textAlign = 'right'
                ctx.fillText(`${100 - (i * 10)}%`, padding - 10, y + 4)
            }
            
            // Set graph styles
            ctx.lineWidth = 3
            ctx.strokeStyle = '#6366f1'
            ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'
            
            // Calculate points with padding
            const points = performanceHistory.map((item, index) => {
                const x = padding + ((width - (padding * 2)) * index) / (performanceHistory.length - 1)
                const y = padding + ((height - (padding * 2)) * (100 - item.score)) / 100
                return { x, y, score: item.score }
            })
            
            // Draw filled area
            ctx.beginPath()
            ctx.moveTo(points[0].x, height - padding)
            points.forEach(point => {
                ctx.lineTo(point.x, point.y)
            })
            ctx.lineTo(points[points.length - 1].x, height - padding)
            ctx.closePath()
            ctx.fill()
            
            // Draw line
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)
            points.forEach((point, i) => {
                if (i > 0) ctx.lineTo(point.x, point.y)
            })
            ctx.stroke()
            
            // Draw points
            points.forEach((point) => {
                // Inner circle
                ctx.beginPath()
                ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
                ctx.fillStyle = '#818cf8'
                ctx.fill()
                
                // Outer circle
                ctx.beginPath()
                ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
                ctx.lineWidth = 2
                ctx.strokeStyle = '#ffffff'
                ctx.stroke()
            })
            
            // Draw x-axis labels
            ctx.fillStyle = '#9ca3af'
            ctx.font = '12px sans-serif'
            ctx.textAlign = 'center'
            
            performanceHistory.forEach((item, index) => {
                const x = points[index].x
                ctx.fillText(item.date, x, height - padding + 20)
                
                // Draw score above point
                ctx.fillStyle = '#d1d5db'
                ctx.font = 'bold 14px sans-serif'
                ctx.fillText(`${item.score}%`, x, points[index].y - 15)
                ctx.fillStyle = '#9ca3af'
                ctx.font = '12px sans-serif'
            })
        }
    }, [performanceHistory])
    
    // Set canvas dimension on window resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const container = canvasRef.current.parentElement
                canvasRef.current.width = container.clientWidth
                canvasRef.current.height = container.clientHeight
                
                // Redraw graph
                const event = new Event('resize')
                window.dispatchEvent(event)
            }
        }
        
        window.addEventListener('resize', handleResize)
        
        // Initial sizing
        handleResize()
        
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    // Trigger redraw when resized
    useEffect(() => {
        const handleResize = () => {
            if (performanceHistory.length > 0 && canvasRef.current) {
                // This is a hack to trigger the redraw effect
                setPerformanceHistory([...performanceHistory])
            }
        }
        
        window.addEventListener('resize', handleResize)
        
        return () => window.removeEventListener('resize', handleResize)
    }, [performanceHistory])

    // Fetch leaderboard data
    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:3001/api/leaderboard${subject ? `?subject=${subject}` : ''}`)
            .then(response => {
                setLeaderboard(response.data)
                // Set subject-specific strengths and weaknesses for engineering subjects
                if (subject === 'Mechanical Engineering') {
                    setStrengths(['Thermodynamics', 'Machine Design'])
                    setWeaknesses(['Fluid Mechanics', 'Material Science'])
                } else if (subject === 'Electrical Engineering') {
                    setStrengths(['Circuit Theory', 'Signal Processing'])
                    setWeaknesses(['Power Systems', 'Digital Electronics'])
                } else if (subject === 'Civil Engineering') {
                    setStrengths(['Structural Analysis', 'Construction Materials'])
                    setWeaknesses(['Soil Mechanics', 'Hydraulics'])
                } else if (subject === 'Computer Engineering') {
                    setStrengths(['Computer Architecture', 'Digital Logic'])
                    setWeaknesses(['Computer Networks', 'Operating Systems'])
                } else if (subject === 'Chemical Engineering') {
                    setStrengths(['Process Design', 'Chemical Kinetics'])
                    setWeaknesses(['Thermodynamics', 'Unit Operations'])
                } else if (subject === 'Aerospace Engineering') {
                    setStrengths(['Aerodynamics', 'Aircraft Structures'])
                    setWeaknesses(['Propulsion Systems', 'Flight Dynamics'])
                } else if (subject === 'Biomedical Engineering') {
                    setStrengths(['Medical Imaging', 'Biomaterials'])
                    setWeaknesses(['Biomechanics', 'Biosignals'])
                } else if (subject === 'Industrial Engineering') {
                    setStrengths(['Operations Research', 'Manufacturing Processes'])
                    setWeaknesses(['Quality Control', 'Ergonomics'])
                } else if (subject === 'Software Engineering') {
                    setStrengths(['Software Design', 'Algorithm Analysis'])
                    setWeaknesses(['Software Testing', 'System Architecture'])
                } else if (subject === 'Materials Science') {
                    setStrengths(['Material Properties', 'Crystallography'])
                    setWeaknesses(['Polymer Science', 'Corrosion'])
                } else if (subject === 'Math') {
                    setStrengths(['Algebra', 'Statistics'])
                    setWeaknesses(['Calculus', 'Geometry'])
                } else if (subject === 'Science') {
                    setStrengths(['Biology', 'Chemistry'])
                    setWeaknesses(['Physics', 'Astronomy'])
                } else if (subject === 'History') {
                    setStrengths(['Modern History', 'European History'])
                    setWeaknesses(['Ancient History', 'Asian History']) 
                } else {
                    setStrengths(['General Knowledge'])
                    setWeaknesses(['Specialized Topics'])
                }
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error)
                setError('Failed to load leaderboard data')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [subject])

    // Fetch explanations for incorrect answers
    const fetchExplanation = async (questionIndex) => {
        const question = detailedResults[questionIndex];
        
        if (!question || explanations[questionIndex]) return;
        
        setLoadingExplanations(true);
        
        try {
            const response = await axios.post('http://localhost:3001/api/explanation', {
                subject,
                question: question.question,
                correctAnswer: question.correctAnswer
            });
            
            setExplanations(prev => ({
                ...prev,
                [questionIndex]: response.data.explanation || `The correct answer is ${question.correctAnswer}`
            }));
        } catch (error) {
            console.error('Error fetching explanation:', error);
            // Add fallback explanation if API fails
            setExplanations(prev => ({
                ...prev,
                [questionIndex]: `The correct answer is: ${question.correctAnswer}`
            }));
        } finally {
            setLoadingExplanations(false);
        }
    };

    // Pre-fetch explanations for all wrong answers on page load
    useEffect(() => {
        async function fetchAllExplanations() {
            if (detailedResults.length > 0) {
                setLoadingExplanations(true);
                const wrongAnswers = detailedResults.filter(result => !result.isCorrect);
                
                // Process explanations in parallel with a small delay to avoid API rate limits
                for (let i = 0; i < detailedResults.length; i++) {
                    if (!detailedResults[i].isCorrect) {
                        await fetchExplanation(i);
                        // Small delay to avoid overwhelming the API
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }
                setLoadingExplanations(false);
            }
        }
        
        fetchAllExplanations();
    }, [detailedResults]); // eslint-disable-line react-hooks/exhaustive-deps

    // Find user's rank
    const userRank = leaderboard.findIndex(entry => entry.name === user?.name) + 1

    return (
        <>
            {/* Added a dark overlay for better contrast with white text */}
            <div className="fixed inset-0 bg-black/50 z-0"></div>
            <AnimatedBackground/>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 py-8 mb-12 relative z-10"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    {subject} Assessment Results
                </h2>
                
                {/* Score Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-indigo-500/30"
                >
                    <h3 className="text-2xl font-semibold mb-4 text-indigo-300">Your Score: {percentage}%</h3>
                    <div className="mb-6">
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div 
                                className={`h-4 rounded-full ${
                                    percentage >= 80 ? 'bg-green-500' : 
                                    percentage >= 60 ? 'bg-blue-500' : 
                                    percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p className="text-indigo-200">
                            <span className="font-semibold">Total Questions:</span> {totalQuestions}
                        </p>
                        <p className="text-indigo-200">
                            <span className="font-semibold">Correct Answers:</span> {score}
                        </p>
                    </div>
                </motion.div>
                
                {/* Question Review */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-indigo-500/30"
                >
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Question Review</h3>
                    <div className="space-y-6">
                        {detailedResults.map((result, index) => (
                            <div 
                                key={index} 
                                className={`p-4 rounded-lg border ${
                                    result.isCorrect ? 'border-green-500/40 bg-green-900/20' : 'border-red-500/40 bg-red-900/20'
                                }`}
                            >
                                <p className="font-medium mb-2 text-white">
                                    {index + 1}. {result.question}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    {result.options.map((option, optIndex) => (
                                        <div 
                                            key={optIndex}
                                            className={`px-3 py-2 rounded ${
                                                option === result.correctAnswer 
                                                    ? 'bg-green-800 text-green-100' 
                                                    : option === result.userAnswer && !result.isCorrect
                                                        ? 'bg-red-800 text-red-100'
                                                        : 'bg-gray-700 text-gray-200'
                                            }`}
                                        >
                                            {option}
                                            {option === result.correctAnswer && <span className="ml-2">✓</span>}
                                            {option === result.userAnswer && !result.isCorrect && <span className="ml-2">✗</span>}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Brief explanation for incorrect answers */}
                                {!result.isCorrect && (
                                    <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <p className="text-sm text-red-200">
                                            {result.explanation || `The correct answer is "${result.correctAnswer}"`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
                
                {/* Performance Summary */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-indigo-500/30"
                >
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Performance Summary</h3>
                    <p className="text-indigo-200 mb-4">
                        You answered {score} out of {totalQuestions} questions correctly.
                    </p>
                    <p className="text-indigo-200">
                        Your accuracy rate is {percentage}%. Keep up the good work!
                    </p>
                </motion.div>
                
                {/* Leaderboard - Display only top 3 */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-6 rounded-xl shadow-lg mb-6 border border-indigo-500/30"
                >
                    <h3 className="text-xl font-semibold mb-4 text-white">Leaderboard</h3>
                    {loading ? (
                        <p className="text-indigo-200">Loading leaderboard data...</p>
                    ) : error ? (
                        <p className="text-red-300">{error}</p>
                    ) : (
                        <>
                            {userRank > 0 && (
                                <p className="mb-3 text-indigo-200 font-medium">Your Rank: #{userRank}</p>
                            )}
                            <div className="overflow-x-auto">
                                <table className="min-w-full rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-indigo-800/60">
                                            <th className="px-4 py-3 text-left text-indigo-100">Rank</th>
                                            <th className="px-4 py-3 text-left text-indigo-100">Name</th>
                                            <th className="px-4 py-3 text-right text-indigo-100">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.slice(0, 3).map((entry, index) => {
                                            let rowClass = "border-b border-indigo-700/50";
                                            if (index === 0) rowClass += " bg-yellow-500/20"; // Gold
                                            else if (index === 1) rowClass += " bg-gray-400/20"; // Silver
                                            else if (index === 2) rowClass += " bg-amber-600/20"; // Bronze
                                            
                                            return (
                                                <tr key={index} className={rowClass}>
                                                    <td className="px-4 py-3 text-indigo-100">
                                                        {index === 0 && <span className="text-yellow-300">🥇 </span>}
                                                        {index === 1 && <span className="text-gray-300">🥈 </span>}
                                                        {index === 2 && <span className="text-amber-600">🥉 </span>}
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-indigo-100">{entry.name}</td>
                                                    <td className="px-4 py-3 text-right text-indigo-100">{entry.score}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </motion.div>
                
                {/* Additional Elements */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-indigo-500/30"
                >
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Additional Insights</h3>
                    <p className="text-indigo-200 mb-4">
                        Here are some insights based on your performance:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-indigo-200">
                        <li>Focus on improving areas where you scored lower.</li>
                        <li>Consider reviewing the topics you found challenging.</li>
                        <li>Practice regularly to enhance your understanding.</li>
                    </ul>
                </motion.div>
                
                {/* Action buttons */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center flex flex-wrap justify-center gap-4"
                >
                    <Link
                        to="/assessment"
                        state={{ subject }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Try Again
                    </Link>
                    <Link
                        to="/assessment"
                        className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Try Another Subject
                    </Link>
                    <Link
                        to="/dashboard"
                        className="bg-gray-600 text-white px-6 py-3 rounded-full text-lg hover:bg-gray-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Back to Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </>
    )
}

export default Results

