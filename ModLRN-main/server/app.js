// Add this endpoint to your Express server

// Import necessary libraries
const { GoogleGenerativeAI } = require("@google/generative-ai");
// or for OpenAI
// const OpenAI = require("openai");

// Initialize the AI service
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// or for OpenAI
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Add the endpoint
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, conversationHistory, context } = req.body;
        
        // System prompt to guide the AI
        const systemPrompt = `You are an AI educational assistant for a college student. 
        You have access to the following student information:
        
        Courses: ${context.user.courses.join(', ')}
        
        Assignments:
        ${context.user.assignments.map(a => `- ${a.subject}: ${a.title} (Due: ${a.dueDate})`).join('\n')}
        
        Exams:
        ${context.user.exams.map(e => `- ${e.subject}: ${e.title} (Date: ${e.date} at ${e.time})`).join('\n')}
        
        Provide helpful, clear, and concise responses to the student's questions. Focus on being educational and supportive.
        If asked about topics not in your knowledge, provide general educational guidance rather than making up specific details.`;
        
        // For Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Build chat history for context
        const chatHistory = [
            { role: "system", parts: [{ text: systemPrompt }] },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }))
        ];
        
        // Add the user's new message
        chatHistory.push({
            role: "user",
            parts: [{ text: message }]
        });
        
        // Create a chat session
        const chat = model.startChat({ history: chatHistory });
        
        // Generate response
        const result = await chat.sendMessage(message);
        const response = result.response.text();
        
        // Return the AI's response
        res.json({ reply: response });
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
}); 