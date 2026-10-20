import React, { useState, useEffect, useRef } from 'react';
import { ProfSPKAvatar } from './ProfSPKAvatar';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Square,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Check,
  RefreshCw,
} from 'lucide-react';

export interface StructuredAIAction {
  action: 'OPEN_SUBJECT' | 'OPEN_LESSON' | 'OPEN_TOPIC' | 'OPEN_SLIDE';
  subjectId?: string;
  lessonId?: string;
  topicId?: string;
  topicNumber?: string;
  slideIndex?: number;
}

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    subjectTitle?: string;
    lessonTitle?: string;
    topicNumber?: string;
    topicTitle?: string;
    slideIndex?: number;
    slideTitle?: string;
    slideBody?: string;
    selectedPart?: string;
  };
  onExecuteAction: (action: StructuredAIAction) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: StructuredAIAction | null;
  generatedImageUrl?: string;
  imageProvider?: string;
}

export const AIAssistantModal: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  context,
  onExecuteAction,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hi there! How can I help you today with your 12th Standard Botany or Zoology? Feel free to ask any doubt you have, or tell me if you want to "Go to Zoology", "Open chapter 2", or "Generate image".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isHandsFree, setIsHandsFree] = useState<boolean>(true);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<any>(null);
  const speechKeepAliveRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceTranscript]);

  // Load and cache SpeechSynthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Robust Speech Synthesis with Indian English voice preference
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speechKeepAliveRef.current) clearInterval(speechKeepAliveRef.current);

    // Clean out actions, tags, or markdown
    const cleanText = text
      .replace(/<<<ACTION[\s\S]*?>>>/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/[#*_`]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best natural voice (en-IN or Google natural voice)
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')) ||
      voices.find((v) => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Temporarily pause recognition while speaking to prevent self-hearing echo
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (speechKeepAliveRef.current) clearInterval(speechKeepAliveRef.current);

      // Resume listening if hands-free is enabled and modal is open
      if (isHandsFree && isOpen) {
        setTimeout(() => {
          startListening();
        }, 400);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance notice:', e);
      setIsSpeaking(false);
      if (speechKeepAliveRef.current) clearInterval(speechKeepAliveRef.current);
      if (isHandsFree && isOpen) {
        setTimeout(() => {
          startListening();
        }, 300);
      }
    };

    // Chrome 15s keep-alive hack
    speechKeepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(speechKeepAliveRef.current);
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    window.speechSynthesis.speak(utterance);
  };

  // Stop button handler
  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechKeepAliveRef.current) clearInterval(speechKeepAliveRef.current);
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  };

  // Speech Recognition (Web Speech API)
  const startListening = () => {
    if (isSpeaking) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not available in this browser');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalStr = '';

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript + ' ';
          } else {
            interim += item[0].transcript;
          }
        }

        const fullText = (finalStr + interim).trim();
        setVoiceTranscript(fullText);

        // Responsive silence timer: 1500ms pause to allow natural thought pauses without cutoff
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          const promptToSubmit = fullText.trim();
          if (promptToSubmit.length > 1) {
            handleSendMessage(promptToSubmit);
            setVoiceTranscript('');
            try {
              recognition.stop();
            } catch {}
          }
        }, 1500);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err.error);
        if (err.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If hands-free is enabled and not speaking and modal is open, smoothly restart
        if (isHandsFree && isOpen && !isSpeaking) {
          setTimeout(() => {
            if (isOpen && !isSpeaking) {
              try {
                recognition.start();
              } catch {}
            }
          }, 600);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Recognition start caught:', e);
    }
  };

  const toggleListening = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}
    }
    if (isListening) {
      handleStop();
    } else {
      startListening();
    }
  };

  // Contextual welcome and instant handling on modal open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (context.selectedPart) {
          // If a specific question or diagram hotspot was clicked
          const prompt = `Please explain this question and official model answer: ${context.selectedPart}`;
          handleSendMessage(prompt);
        } else if (context.slideTitle) {
          const slideNum = (context.slideIndex ?? 0) + 1;
          const welcomeText = `Welcome! Let's examine Slide ${slideNum}: "${context.slideTitle}" in ${context.topicTitle || 'Biology'}. How can I assist you with this concept, or should I explain the high-yield public exam points?`;
          
          const welcomeMsg: Message = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, welcomeMsg]);
          speakText(welcomeText);
        } else {
          speakText(
            'Hi there! How can I help you today with your 12th Standard Botany or Zoology? Feel free to ask any doubt you have.'
          );
        }
      }, 350);
      return () => {
        clearTimeout(timer);
        handleStop();
      };
    } else {
      handleStop();
    }
  }, [isOpen, context.slideIndex, context.slideTitle, context.selectedPart]);

  if (!isOpen) return null;

  const handleGenerateBiologicalImage = async (promptQuery: string) => {
    setIsLoading(true);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Generate AI Image: ${promptQuery}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptQuery,
          topicTitle: context.topicTitle || 'Biology',
        }),
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        const botMsg: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: `Here is the high-precision biological illustration generated via ${data.provider}:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          generatedImageUrl: data.imageUrl,
          imageProvider: data.provider,
        };
        setMessages((prev) => [...prev, botMsg]);
        speakText(`I have generated the biological illustration using the ${data.provider} model.`);
      } else {
        throw new Error('Image generation failed.');
      }
    } catch (err: any) {
      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `Image generation notice: ${err.message || 'Please check your connection and retry.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      speakText('Image generation encountered a transient issue. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (rawMessage?: string) => {
    const textToSend = rawMessage || inputText.trim();
    if (!textToSend || isLoading) return;

    const lower = textToSend.toLowerCase().trim();

    // Check if user asked to generate image
    if (lower.startsWith('generate image') || lower.startsWith('create image') || lower.startsWith('draw image') || lower.includes('ai image') || lower.includes('illustration')) {
      const promptQuery = textToSend.replace(/(generate|create|draw)\s+(ai\s+)?image(\s+of)?/i, '').trim() || context.topicTitle || 'Biology Cell';
      handleGenerateBiologicalImage(promptQuery);
      setInputText('');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // 1. Instant handling for "Hi"
    if (lower === 'hi' || lower === 'hello' || lower === 'hey') {
      setTimeout(() => {
        const botMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Hi there! Feel free to ask any question from Bio-Botany or Bio-Zoology, or tell me if you want to explore a specific chapter!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
        speakText(botMessage.text);
      }, 200);
      return;
    }

    // 2. Instant handling for "Open zoology"
    if (lower.includes('open zoology') || lower.includes('go to zoology') || lower === 'zoology') {
      setTimeout(() => {
        const botMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Opening Zoology.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
        speakText(botMessage.text);
        onExecuteAction({ action: 'OPEN_SUBJECT', subjectId: 'bio-zoology' });
      }, 200);
      return;
    }

    // 3. Instant handling for "Open botany"
    if (lower.includes('open botany') || lower.includes('go to botany') || lower === 'botany') {
      setTimeout(() => {
        const botMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Opening Botany.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
        speakText(botMessage.text);
        onExecuteAction({ action: 'OPEN_SUBJECT', subjectId: 'bio-botany' });
      }, 200);
      return;
    }

    // 4. Instant handling for Chapter 2 Human Reproduction
    if (lower.includes('open chapter 2') || lower.includes('human reproduction')) {
      setTimeout(() => {
        const botMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Opening Chapter 2: Human Reproduction.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
        speakText(botMessage.text);
        onExecuteAction({ action: 'OPEN_TOPIC', topicNumber: '2.1' });
      }, 200);
      return;
    }

    // 5. Instant handling for Chapter 1
    if (lower.includes('open chapter 1') || lower.includes('plant reproduction') || lower.includes('reproduction in plants')) {
      setTimeout(() => {
        const botMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Opening Chapter 1: Reproduction in Organisms.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
        speakText(botMessage.text);
        onExecuteAction({ action: 'OPEN_TOPIC', topicNumber: '1.1' });
      }, 200);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            subjectTitle: context.subjectTitle || 'Class 12 Biology',
            lessonTitle: context.lessonTitle || 'Higher Secondary Biology',
            topicNumber: context.topicNumber || '',
            topicTitle: context.topicTitle || 'Tamil Nadu Samacheer Kalvi Biology',
            slideTitle: context.slideTitle || '',
            slideBody: context.slideBody || '',
            selectedPart: context.selectedPart || '',
          },
          language: 'en',
        }),
      });

      const data = await response.json();
      const botText = data.reply || data.text || "I'm reviewing the textbook explanation for you!";

      let structuredAction: StructuredAIAction | null = null;
      const actionMatch = botText.match(/<<<ACTION\s*(\{[\s\S]*?\})\s*>>>/);
      if (actionMatch && actionMatch[1]) {
        try {
          structuredAction = JSON.parse(actionMatch[1]);
        } catch (e) {
          console.warn('Failed to parse AI action:', e);
        }
      }

      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: botText.replace(/<<<ACTION[\s\S]*?>>>/g, '').trim(),
        action: structuredAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (structuredAction) {
        onExecuteAction(structuredAction);
      }

      speakText(botMessage.text);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallback: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `In Class 12 Biology, this relates directly to ${context.topicTitle || 'the curriculum'}. Let's study the relevant diagrams and 12th Board key points together!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallback]);
      speakText(fallback.text);
    } finally {
      setIsLoading(false);
    }
  };

  const lastBotMessage =
    [...messages].reverse().find((m) => m.sender === 'assistant') || messages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md h-[95vh] max-h-[780px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Bar with Real Human Assistant Identity */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-none">
                Prof. SPK
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                AI Biology Assistant · Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Central Display: Realistic Human Assistant with Shaking Hands & Animated Audio Waves */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2 px-6 text-center shrink-0">
          {/* Avatar with Animated Waving Hands */}
          <div className="relative my-1">
            <ProfSPKAvatar
              size="2xl"
              isSpeaking={isSpeaking}
              isListening={isListening}
              isWaving={true}
            />
          </div>

          {/* Animated Soundwave Visualizer */}
          <div className="flex items-center justify-center gap-1 my-2 h-6">
            {[4, 8, 14, 20, 12, 18, 22, 16, 8, 4].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-emerald-600 animate-pulse'
                    : isListening
                    ? 'bg-teal-500 animate-bounce'
                    : 'bg-slate-200 h-1.5'
                }`}
                style={{
                  height: isSpeaking ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : isListening ? `${Math.max(4, h * 0.7)}px` : '4px',
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>

          {/* Title & Speech Status */}
          <div className="space-y-0.5">
            <h4 className="font-bold text-base text-slate-900 tracking-tight">
              Prof. SPK
            </h4>
            <p className="text-xs font-semibold text-emerald-700">
              {isSpeaking
                ? '🔊 Speaking...'
                : isListening
                ? '🎙️ Listening to you...'
                : isLoading
                ? '⚡ Thinking...'
                : 'Ready to guide you'}
            </p>
          </div>
        </div>

        {/* Dynamic Speech Message Card */}
        <div className="flex-1 px-5 overflow-y-auto space-y-3 py-2">
          {/* Active Speaking / Listening Banner */}
          {isListening && voiceTranscript ? (
            <div className="p-4 rounded-2xl bg-teal-50/90 border border-teal-200/80 text-teal-950 text-xs sm:text-sm leading-relaxed shadow-2xs animate-fade-in">
              <span className="font-bold text-teal-700 block text-[10px] uppercase tracking-wider mb-1">
                🎙️ You are saying:
              </span>
              <p className="font-semibold text-slate-900">"{voiceTranscript}"</p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (voiceTranscript.trim()) {
                      handleSendMessage(voiceTranscript.trim());
                      setVoiceTranscript('');
                      handleStop();
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer hover:bg-teal-800 transition-colors"
                >
                  Send Now
                </button>
                <span className="text-[11px] text-teal-700">or wait for auto-send</span>
              </div>
            </div>
          ) : isListening ? (
            <div className="p-4 rounded-2xl bg-[#f0f7f3] border border-emerald-200/70 text-slate-800 text-xs sm:text-sm leading-relaxed shadow-2xs text-center animate-pulse">
              Go ahead — I'm listening. Speak your question or doubt clearly!
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#f0f7f3] border border-emerald-200/70 text-slate-800 text-xs sm:text-sm leading-relaxed shadow-2xs space-y-2">
              <p>{lastBotMessage?.text}</p>
              {lastBotMessage?.generatedImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-300 max-h-[220px] bg-white">
                  <img
                    src={lastBotMessage.generatedImageUrl}
                    alt="Generated Biological Illustration"
                    className="w-full h-full object-contain max-h-[200px]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Quick Context-Aware Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {context.slideTitle ? (
              <>
                <button
                  onClick={() => handleSendMessage(`Explain this slide: "${context.slideTitle}" in detail for Class 12 exams`)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-[#144738] border border-emerald-300 transition-colors cursor-pointer"
                >
                  Explain this slide
                </button>
                <button
                  onClick={() => handleSendMessage(`What are the key 3-mark and 5-mark public exam points for "${context.slideTitle}"?`)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
                >
                  Exam 5-Mark Tips
                </button>
                <button
                  onClick={() => handleSendMessage(`Generate scientific chart of ${context.slideTitle}`)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Generate AI Chart
                </button>
                <button
                  onClick={() => handleSendMessage(`Explain ${context.slideTitle} in Tamil (தமிழ் விளக்கம்)`)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  தமிழ் விளக்கம்
                </button>
              </>
            ) : (
              ['Go to Zoology', 'Open chapter 2', 'Open chapter 1', 'Generate image of Ovule', 'Explain double fertilisation'].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    "{suggestion}"
                  </button>
                )
              )
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Bar: Voice mic, text input, hands-free toggle */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white shadow-md animate-pulse ring-4 ring-red-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isListening ? 'Mute Mic' : 'Start Speech Recognition'}
            >
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            {/* Input Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question or 'Generate image of...'"
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-full bg-slate-50 border border-slate-200/90 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-900 transition-colors placeholder:text-slate-400"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Send"
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          {/* Subtitle Caption & Stop Button */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="truncate">
                {isHandsFree ? 'Hands-free on — speech to speech active' : 'Hands-free off'}
              </span>
            </div>

            {(isSpeaking || isListening) && (
              <button
                type="button"
                onClick={handleStop}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer shrink-0"
              >
                <Square size={10} className="fill-slate-700 text-slate-700" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
