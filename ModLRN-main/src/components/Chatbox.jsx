import { useState } from "react";
import axios from "axios";

function Chatbox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        setMessages([...messages, { sender: "user", text: input }]);

        try {
            // Send user input to chatbot API
            const response = await axios.post('http://localhost:3001/api/chatbot', { message: input });
            const botMessage = response.data.reply;

            // Add bot response to chat
            setMessages(prevMessages => [...prevMessages, { sender: "bot", text: botMessage }]);
        } catch (error) {
            console.error("Error communicating with chatbot:", error);
            setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Sorry, I couldn't process your request." }]);
        }

        setInput(""); // Clear input field
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Icon */}
            <div
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </div>

            {/* Chatbox */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 bg-gray-800 p-4 rounded-lg shadow-lg w-80">
                    <div className="messages overflow-y-auto h-64 mb-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                <p className={`p-2 rounded ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                                    {msg.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="input flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white"
                            placeholder="Type your question..."
                        />
                        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbox; 