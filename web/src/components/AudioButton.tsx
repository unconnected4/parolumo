import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface AudioButtonProps {
  text: string;
  lang?: string;
  className?: string;
}

export function AudioButton({ text, lang = 'en-US', className = '' }: AudioButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Feature detection per web/intent.md
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  if (!isSupported) {
    return null;
  }

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any active utterance

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for language learners

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={`Listen to pronunciation of "${text}"`}
      aria-label={`Pronounce ${text}`}
      className={`inline-flex items-center justify-center p-1.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
        isPlaying ? 'text-indigo-600 bg-indigo-50 animate-pulse' : ''
      } ${className}`}
    >
      <Volume2 className="w-5 h-5" />
    </button>
  );
}
