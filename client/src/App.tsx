import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Layout/Navbar';
import WishSection from './components/Hero/WishSection';
import ChatInterface from './components/Chat/ChatInterface';
import VoiceOverlay from './components/Voice/VoiceOverlay';
import { useVoiceAgent } from './hooks/useVoiceAgent';
import './index.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  isHTML?: boolean;
}

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice Agent Hook
  const handleVoiceCommand = (text: string) => {
    handleSendMessage(text);
  };
  
  const { 
    isActive: isVoiceActive, 
    isListening, 
    transcript, 
    status, 
    isSpeaking,
    toggleVoiceAgent, 
    toggleListening,
    speak,
    setStatus
  } = useVoiceAgent(handleVoiceCommand);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDark]);

  // Handle Sending Messages (Text or Voice)
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. UI Update
    if (!isChatMode) setIsChatMode(true);
    
    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call Backend
      const response = await axios.post('http://localhost:8000/api/chat', { text });
      
      const aiResponse = response.data.text || "I didn't get a response.";
      
      const aiMsg: Message = { 
        id: Date.now() + 1, 
        text: aiResponse.replace(/\n/g, '<br>'), 
        sender: 'ai',
        isHTML: true 
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // 3. Voice Feedback (if active)
      if (isVoiceActive) {
        setStatus(aiResponse); // Show text in overlay
        speak(aiResponse);
      }

    } catch (error) {
      console.error("Backend Error:", error);
      const errorMsg: Message = { id: Date.now() + 1, text: "Error connecting to server.", sender: 'ai' };
      setMessages(prev => [...prev, errorMsg]);
      if (isVoiceActive) speak("I cannot connect to my server right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="noise-overlay"></div>
      <div className="holographic-bg"></div>
      <div className="ambient-glow"></div>

      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        toggleVoiceAgent={toggleVoiceAgent} 
      />

      <WishSection isChatMode={isChatMode} />

      <ChatInterface 
        isChatMode={isChatMode} 
        messages={messages} 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />

      <VoiceOverlay 
        isActive={isVoiceActive}
        isListening={isListening}
        transcript={transcript}
        onClose={toggleVoiceAgent}
        onToggleListening={toggleListening}
        status={status}
        isSpeaking={isSpeaking}
      />
    </div>
  );
}

export default App;
