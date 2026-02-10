import React from 'react';
import { Mic, X } from 'lucide-react';
import '../../styles.css';

interface VoiceOverlayProps {
    isActive: boolean;
    isListening: boolean;
    transcript: string;
    onClose: () => void;
    onToggleListening: () => void;
    status: string;
    isSpeaking: boolean;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ 
    isActive, 
    isListening, 
    transcript, 
    onClose, 
    onToggleListening, 
    status,
    isSpeaking
}) => {
    return (
        <div className={`agent-overlay ${isActive ? 'active' : ''}`}>
            <button className="close-agent" onClick={onClose}>
                <X size={32} />
            </button>
            <div className={`voice-orb-container ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}>
                <div className="voice-orb"></div>
            </div>
            <div className="agent-status">{status}</div>
            <div className="agent-transcript">{transcript}</div>
            <div className="agent-controls">
                <button className="agent-btn" onClick={onToggleListening}>
                    <Mic size={24} className={isListening ? 'animate-pulse' : ''} />
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
            </div>
        </div>
    );
};

export default VoiceOverlay;
