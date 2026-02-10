import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import '../../styles.css';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    isHTML?: boolean;
}

interface ChatInterfaceProps {
    isChatMode: boolean;
    messages: Message[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isChatMode, messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className={`main-wrapper ${isChatMode ? 'chat-mode' : ''}`}>
            {/* Chat Area */}
            <div className={`chat-interface ${isChatMode ? 'active' : ''}`}>
                <div className="messages-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <div className="avatar">
                                {msg.sender === 'ai' ? (
                                    <img src="https://appdirect.imgix.net/Adopt-AI-code-generatoin-at-scale-blog.png?auto=format%2C%20compress&crop=focalpoint&dpr=2&fit=crop&fp-x=0.5&fp-y=0.5&h=340&q=80&w=668&s=f09b65f98aa690728f6aa4dfa9bc95e0" alt="AI" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                ) : (
                                    'U'
                                )}
                            </div>
                            <div className="msg-content" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="thinking ai">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className={`input-container`}>
                <div className="input-box">
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Ask anything..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="send-btn" onClick={handleSend}>
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
