import { useState, useEffect, useRef } from 'react';

export const useVoiceAgent = (onCommand: (text: string) => void) => {
    const [isActive, setIsActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('Tap Mic to Speak');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setStatus('Listening...');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setStatus('Tap Mic to Speak');
            };

            recognitionRef.current.onresult = (event: any) => {
                const currentTranscript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setTranscript(currentTranscript);

                if (event.results[0].isFinal) {
                    onCommand(currentTranscript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Error:", event.error);
                setStatus('Error: ' + event.error);
                setIsListening(false);
            };
        }
    }, [onCommand]);

    const toggleVoiceAgent = () => {
        setIsActive(!isActive);
        if (isActive) {
            stopListening();
            window.speechSynthesis.cancel();
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    };

    return {
        isActive,
        isListening,
        transcript,
        status,
        isSpeaking,
        toggleVoiceAgent,
        toggleListening,
        speak,
        setStatus
    };
};
