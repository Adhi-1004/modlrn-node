import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyAgEd8UniGrAC-cUIQ9YiSH8BOpYy6-b4A";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
let prompt = "Generate 5 multiple-choice questions on Science with medium difficulty. Provide the questions in JSON format with the following structure: [{\"question\": \"\", \"options\": [\"\", \"\", \"\", \"\"], \"correctAnswer\": \"\"}]";
const app = express();
const port = 3001;
let Topic = "Science";
let QnCount = 5;
let Difficulty = "Easy";

app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

app.post('/api/topic', (req, res) => {
    const { topic, qnCount, difficulty } = req.body;
    console.log('Received topic:', topic);
    console.log('Received question count:', qnCount);
    console.log('Received difficulty:', difficulty);
    if (!topic || !qnCount ) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    Topic = topic;
    QnCount = qnCount;
    Difficulty = difficulty;
    res.json({ topic, qnCount, difficulty });
});

async function fetchQuestionsFromGemini() {
    console.log('Fetching questions from Gemini API...');
    console.log('Using API Key:', GEMINI_API_KEY);
    
    // Create a more specific prompt based on the engineering subject
    let topicSpecificGuidance = "";
    
    if (Topic === "Mechanical Engineering") {
        topicSpecificGuidance = "Focus on thermodynamics, fluid mechanics, machine design, material strength, and dynamics.";
    } else if (Topic === "Electrical Engineering") {
        topicSpecificGuidance = "Focus on circuit theory, electromagnetic fields, power systems, signal processing, and electronic devices.";
    } else if (Topic === "Civil Engineering") {
        topicSpecificGuidance = "Focus on structural analysis, soil mechanics, hydraulics, construction materials, and transportation systems.";
    } else if (Topic === "Computer Engineering") {
        topicSpecificGuidance = "Focus on computer architecture, digital design, networking, operating systems, and embedded systems.";
    } else if (Topic === "Software Engineering") {
        topicSpecificGuidance = "Focus on software design principles, algorithms, data structures, software testing, and system architecture.";
    } else if (Topic === "Chemical Engineering") {
        topicSpecificGuidance = "Focus on thermodynamics, reactor design, mass transfer, fluid flow, and process control.";
    } else if (Topic === "Aerospace Engineering") {
        topicSpecificGuidance = "Focus on aerodynamics, propulsion, aircraft structures, flight dynamics, and control systems.";
    }
    
    prompt = `Generate ${QnCount} multiple-choice questions on ${Topic} with ${Difficulty} difficulty. 
    
    ${topicSpecificGuidance}
    
    The questions MUST be specifically about core concepts in ${Topic} and should NOT be general knowledge or questions that could apply to any engineering field.
    
    Each question should:
    1. Be specifically relevant to ${Topic}
    2. Test understanding of fundamental principles, not just memorization
    3. Have 4 options with one clear correct answer and 3 plausible distractors
    4. Include a detailed explanation that explains why the correct answer is right and why other options are incorrect
    
    Provide the questions in the following JSON format:
    [{
      "question": "A clear, concise question specific to ${Topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option exactly as written in the options array",
      "explanation": "A detailed explanation (at least 3 sentences) of why the answer is correct and why other options are wrong"
    }]`;
    
    try {
        console.log('Prompt:', prompt);
        const result = await model.generateContent(prompt);
        const response = result.response.text().replace(/```json|```/g, '');
        console.log('Received response from Gemini API');
        try {
            const questions = JSON.parse(response);
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Invalid response format');
            }
            return questions;
        } catch (parseError) {
            console.error('Error parsing JSON from Gemini:', parseError);
            console.log('Received response:', response);
            throw new Error('Failed to parse questions from Gemini API response');
        }
    } catch (error) {
        console.error('Error fetching questions from Gemini:', error);
        throw new Error('Failed to fetch questions from Gemini API');
    }
}

app.get('/api/questions', async (req, res) => {
    try {
        // Override Topic if subject is provided in the query parameters
        if (req.query.subject) {
            Topic = req.query.subject;
            console.log(`Subject provided in query parameters: ${Topic}`);
        }
        const questions = await fetchQuestionsFromGemini();
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Error fetching questions');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Add leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
    const subject = req.query.subject || 'General';
    console.log('Fetching leaderboard for subject:', subject);
    
    // Generate mock leaderboard data for the specific engineering subject
    const leaderboardData = generateLeaderboardData(subject);
    res.json(leaderboardData);
});

// Generate mock leaderboard data based on subject
function generateLeaderboardData(subject) {
    // Base names to use across all subjects
    const names = [
        "Alex Thompson", "Jordan Lee", "Taylor Morgan", "Casey Wilson", 
        "Jamie Rivera", "Riley Johnson", "Quinn Brown", "Avery Garcia",
        "Morgan Chen", "Jordan Parker", "Sam Patel", "Drew Johnson"
    ];
    
    // Create the leaderboard entries with subject-specific scoring distributions
    return names.map((name, index) => {
        // Different score ranges based on subject difficulty - engineering subjects have different distributions
        let baseScore, variation;
        
        if (subject === 'Mechanical Engineering') {
            baseScore = 75;
            variation = 20;
        } else if (subject === 'Electrical Engineering') {
            baseScore = 70;
            variation = 25;
        } else if (subject === 'Civil Engineering') {
            baseScore = 78;
            variation = 18;
        } else if (subject === 'Computer Engineering') {
            baseScore = 82;
            variation = 15;
        } else if (subject === 'Chemical Engineering') {
            baseScore = 73;
            variation = 22;
        } else if (subject === 'Aerospace Engineering') {
            baseScore = 68;
            variation = 28;
        } else if (subject === 'Biomedical Engineering') {
            baseScore = 76;
            variation = 19;
        } else if (subject === 'Industrial Engineering') {
            baseScore = 80;
            variation = 16;
        } else if (subject === 'Software Engineering') {
            baseScore = 85;
            variation = 12;
        } else if (subject === 'Materials Science') {
            baseScore = 72;
            variation = 23;
        } else {
            // Default for other subjects
            baseScore = 80;
            variation = 20;
        }
        
        // Apply a random variation to the base score with formula that favors higher scores for lower indices (top ranks)
        let score = Math.round(baseScore - (variation * (index / names.length)) + (Math.random() * 10 - 5));
        
        // Ensure the score stays within realistic bounds
        score = Math.min(Math.max(score, 40), 100);
        
        return {
            name,
            score,
            subject
        };
    }).sort((a, b) => b.score - a.score); // Sort by score in descending order
}

// Add API endpoint for explanation
app.post('/api/explanation', (req, res) => {
    const { subject, question, correctAnswer } = req.body;
    
    // Generate a mock explanation based on the subject and question
    setTimeout(() => {
        const explanation = generateExplanation(subject, question, correctAnswer);
        res.json({ explanation });
    }, 500); // Simulate API delay
});

// Generate a more detailed mock explanation for a question
function generateExplanation(subject, question, correctAnswer) {
    // Subject-specific explanation prefixes
    const prefixes = {
        'Mechanical Engineering': 'In mechanical engineering, ',
        'Electrical Engineering': 'From an electrical engineering perspective, ',
        'Civil Engineering': 'According to civil engineering principles, ',
        'Computer Engineering': 'In computer engineering, ',
        'Chemical Engineering': 'Following chemical engineering concepts, ',
        'Aerospace Engineering': 'In aerospace engineering, ',
        'Biomedical Engineering': 'From a biomedical standpoint, ',
        'Industrial Engineering': 'In industrial engineering practice, ',
        'Software Engineering': 'Following software engineering best practices, ',
        'Materials Science': 'In materials science, ',
        'default': 'The explanation is that '
    };
    
    const prefix = prefixes[subject] || prefixes.default;
    const questionLower = question.toLowerCase();
    
    // Base explanation
    let explanation = `${prefix}the correct answer is "${correctAnswer}". `;
    
    // Generate more detailed explanations based on the subject and question content
    if (subject === 'Mechanical Engineering') {
        if (questionLower.includes('heat') || questionLower.includes('thermodynamics')) {
            explanation += 'This relates to thermodynamic principles where energy transfer is governed by temperature differentials. The correct answer follows from the First Law of Thermodynamics which states that energy cannot be created or destroyed, only transferred or converted.';
        } else if (questionLower.includes('fluid') || questionLower.includes('flow')) {
            explanation += 'This is explained by fluid mechanics principles. The behavior of fluids under different conditions is governed by the conservation of mass, momentum, and energy equations.';
        } else if (questionLower.includes('stress') || questionLower.includes('strain') || questionLower.includes('material')) {
            explanation += 'This is based on material mechanics principles. When forces are applied to materials, they experience stress and strain according to their material properties, which determine whether they deform elastically or plastically.';
        }
    } else if (subject === 'Electrical Engineering') {
        if (questionLower.includes('circuit') || questionLower.includes('current') || questionLower.includes('voltage')) {
            explanation += 'This follows from Ohm\'s Law and Kirchhoff\'s Laws which govern the behavior of electrical circuits. The relationship between voltage, current, and resistance is fundamental to circuit analysis.';
        } else if (questionLower.includes('signal') || questionLower.includes('frequency')) {
            explanation += 'This is based on signal processing theory. Signals can be analyzed in both time and frequency domains, with transformations between these domains governed by mathematical principles like the Fourier Transform.';
        } else if (questionLower.includes('semiconductor') || questionLower.includes('diode') || questionLower.includes('transistor')) {
            explanation += 'This relies on semiconductor physics. The behavior of semiconductor devices depends on their doping, bias conditions, and junction characteristics.';
        }
    } else if (subject === 'Computer Engineering') {
        if (questionLower.includes('processor') || questionLower.includes('cpu') || questionLower.includes('architecture')) {
            explanation += 'This relates to computer architecture design principles. Modern processors are designed with specific instruction sets, pipeline stages, and memory hierarchies that determine their performance characteristics.';
        } else if (questionLower.includes('memory') || questionLower.includes('cache')) {
            explanation += 'This is based on memory system design principles. Computer memory is organized in a hierarchy with different levels of cache, main memory, and storage, each with its own speed, capacity, and volatility characteristics.';
        } else if (questionLower.includes('network') || questionLower.includes('protocol')) {
            explanation += 'This follows from networking principles and protocols. Computer networks operate on a layered architecture, with each layer providing specific services and following established protocols for data transmission.';
        } else if (questionLower.includes('logic') || questionLower.includes('gate')) {
            explanation += 'This is based on digital logic principles. Digital circuits are built from basic logic gates (AND, OR, NOT, etc.) that implement Boolean algebra operations and can be combined to create complex digital systems.';
        }
    }
    
    // Add general content if no specific category was matched
    if (explanation.length < 150) {
        explanation += 'Understanding this concept requires knowledge of fundamental principles in this field. The correct answer represents the most accurate application of these principles to the given scenario, while the other options contain misconceptions or incomplete understanding of the core concepts.';
    }
    
    return explanation;
}

// API endpoint for student
app.get('/api/student', (req, res) => {
    // Mock student profile data
    const studentProfile = {
        id: "ST12345",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        grade: "Engineering Graduate Student",
        joinedDate: "2023-01-15",
        profileImage: "https://randomuser.me/api/portraits/people/1.jpg"
    };
    
    res.json(studentProfile);
});

// API endpoint for assessment history
app.get('/api/assessment-history', (req, res) => {
    // Mock assessment history data
    const assessmentHistory = [
        {
            id: "A001",
            subject: "Mechanical Engineering",
            score: 85,
            date: "2023-11-20",
            totalQuestions: 20,
            correctAnswers: 17
        },
        {
            id: "A002",
            subject: "Electrical Engineering",
            score: 78,
            date: "2023-12-05",
            totalQuestions: 20,
            correctAnswers: 15
        },
        {
            id: "A003",
            subject: "Computer Engineering",
            score: 92,
            date: "2024-01-10",
            totalQuestions: 25,
            correctAnswers: 23
        },
        {
            id: "A004",
            subject: "Civil Engineering",
            score: 80,
            date: "2024-01-25",
            totalQuestions: 20,
            correctAnswers: 16
        },
        {
            id: "A005",
            subject: "Software Engineering",
            score: 88,
            date: "2024-02-15",
            totalQuestions: 25,
            correctAnswers: 22
        }
    ];
    
    res.json(assessmentHistory);
});

// API endpoint for achievements
app.get('/api/achievements', (req, res) => {
    // Mock achievements data
    const achievements = [
        {
            id: "ACH001",
            name: "Engineering Novice",
            description: "Completed your first engineering assessment",
            icon: "🔰",
            date: "2023-11-20"
        },
        {
            id: "ACH002",
            name: "Perfect Score",
            description: "Achieved 100% on an assessment",
            icon: "🏆",
            date: "2023-12-15"
        },
        {
            id: "ACH003",
            name: "Study Streak",
            description: "Completed assessments for 5 days in a row",
            icon: "🔥",
            date: "2024-01-05"
        },
        {
            id: "ACH004",
            name: "Subject Master",
            description: "Achieved over 90% in 3 different engineering subjects",
            icon: "🎓",
            date: "2024-02-10"
        },
        {
            id: "ACH005",
            name: "Top of the Class",
            description: "Ranked #1 on the leaderboard for any subject",
            icon: "👑",
            date: "2024-02-20"
        }
    ];
    
    res.json(achievements);
});

// API endpoint for engineering subjects
app.get('/api/subjects', (req, res) => {
    // List of engineering subjects
    const subjects = [
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
            id: "AE",
            name: "Aerospace Engineering",
            icon: "🚀",
            description: "Study of aircraft and spacecraft design and production"
        },
        {
            id: "BME",
            name: "Biomedical Engineering",
            icon: "🩺",
            description: "Application of engineering principles to medicine and biology"
        },
        {
            id: "IE",
            name: "Industrial Engineering",
            icon: "🏭",
            description: "Study of process optimization and efficiency in production systems"
        },
        {
            id: "SE",
            name: "Software Engineering",
            icon: "📱",
            description: "Application of engineering principles to software development"
        },
        {
            id: "MS",
            name: "Materials Science",
            icon: "🔬",
            description: "Study of properties and applications of various materials"
        }
    ];
    
    res.json(subjects);
});