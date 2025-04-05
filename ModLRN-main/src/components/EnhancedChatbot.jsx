import { useState, useEffect, useRef } from "react";
import axios from "axios";

function EnhancedChatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial greeting message when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { 
                    sender: "bot", 
                    text: "Hello! I'm your AI assistant. I can help you with:"
                },
                { 
                    sender: "bot", 
                    text: "• Course-related questions\n• Study tips and resources\n• Assessment preparation\n• Administrative processes\n\nWhat can I help you with today?"
                }
            ]);
        }
    }, [isOpen, messages.length]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        setMessages(prev => [...prev, { sender: "user", text: input }]);
        
        // Show typing indicator
        setIsTyping(true);

        try {
            // Send user input to AI chatbot API
            const response = await axios.post('http://localhost:3001/api/enhanced-chatbot', { 
                message: input,
                context: messages.slice(-5) // Send recent conversation context
            });
            
            // Process the AI response
            const botResponses = response.data.replies;
            
            // Add bot responses to chat with slight delay for natural feel
            setTimeout(() => {
                setIsTyping(false);
                
                if (Array.isArray(botResponses)) {
                    botResponses.forEach((reply, index) => {
                        setTimeout(() => {
                            setMessages(prev => [...prev, { sender: "bot", text: reply }]);
                        }, index * 500); // Stagger multiple responses
                    });
                } else {
                    setMessages(prev => [...prev, { sender: "bot", text: botResponses || "I'm not sure how to help with that." }]);
                }
            }, 1000);
            
        } catch (error) {
            console.error("Error communicating with chatbot:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                sender: "bot", 
                text: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." 
            }]);
        }

        setInput(""); // Clear input field
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Suggested queries for quick access
    const suggestedQueries = [
        "How do I prepare for exams?",
        "What resources are available for my course?",
        "When is the next assignment due?",
        "Can you explain a concept to me?"
    ];

    return (
        <>
            {/* Floating Chat Icon */}
            <div
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50 hover:bg-blue-700 transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </div>

            {/* Chatbox */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 bg-gray-800 rounded-lg shadow-lg w-96 z-50 overflow-hidden flex flex-col transition-all duration-300">
                    {/* Chat Header */}
                    <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
                        <h3 className="font-semibold">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Messages Area */}
                    <div className="messages overflow-y-auto p-4 flex-grow" style={{ height: "350px" }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message mb-4 ${msg.sender === "user" ? "flex justify-end" : "flex justify-start"}`}>
                                <div className={`max-w-3/4 p-3 rounded-lg ${
                                    msg.sender === "user" 
                                        ? "bg-blue-600 text-white rounded-tr-none" 
                                        : "bg-gray-700 text-gray-200 rounded-tl-none"
                                }`}>
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="message mb-4 flex justify-start">
                                <div className="bg-gray-700 text-gray-200 p-3 rounded-lg rounded-tl-none">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Auto-scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Suggested Queries - Show only when chat is new */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 bg-gray-900">
                            <p className="text-gray-400 text-sm mb-2">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {suggestedQueries.map((query, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setInput(query);
                                            setTimeout(() => handleSend(), 100);
                                        }}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full"
                                    >
                                        {query}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Input Area */}
                    <div className="input-area p-3 border-t border-gray-700">
                        <div className="flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Type your question..."
                            />
                            <button 
                                onClick={handleSend} 
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Press Enter to send your message
                        </p>
                    </div>
                </div>
            )}

            {/* CSS for typing indicator */}
            <style jsx>{`
                .typing-indicator {
                    display: flex;
                    align-items: center;
                }
                .typing-indicator span {
                    height: 8px;
                    width: 8px;
                    background: #a0aec0;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 3px;
                    animation: bounce 1.5s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-indicator span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                }
            `}</style>
        </>
    );
}

export default EnhancedChatbot; 