// Speech synthesis and recognition utility

// Audio cache to avoid re-fetching the same audio
const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

export async function playEnglishSpeech(
  text: string,
  options: {
    rate?: number; // 0.8 to 1.2
    voice?: string;
    useGeminiTts?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
) {
  stopSpeech();

  const { rate = 1.0, voice = 'Kore', useGeminiTts = true, onStart, onEnd, onError } = options;

  if (onStart) onStart();

  // Try Gemini TTS first if requested
  if (useGeminiTts) {
    try {
      const cacheKey = `${voice}_${text.slice(0, 150)}`;
      let base64Audio = audioCache.get(cacheKey);

      if (!base64Audio) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice }),
        });

        if (res.ok) {
          const data = await res.json();
          if (typeof data?.audioBase64 === 'string') {
            base64Audio = data.audioBase64;
            audioCache.set(cacheKey, data.audioBase64);
          }
        }
      }

      if (base64Audio) {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`;
        const audio = new Audio(audioUrl);
        audio.playbackRate = rate;
        currentAudio = audio;

        audio.onended = () => {
          currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('Gemini audio playback error, falling back to Web Speech API', e);
          fallbackWebSpeech(text, rate, onEnd, onError);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Gemini TTS failed, falling back to Web Speech API:', e);
    }
  }

  // Fallback to browser SpeechSynthesis
  fallbackWebSpeech(text, rate, onEnd, onError);
}

function fallbackWebSpeech(
  text: string,
  rate: number,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis not supported in this browser');
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;

  // Pick an English voice
  const voices = window.speechSynthesis.getVoices();
  const enVoice =
    voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
    voices.find((v) => v.lang.startsWith('en'));
  if (enVoice) {
    utterance.voice = enVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Web Speech Recognition
export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechRecognizer(callbacks: {
  onResult: (text: string, isFinal: boolean) => void;
  onError: (err: any) => void;
  onStateChange: (listening: boolean) => void;
}): SpeechRecognitionController {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US'; // Practice English!

  let isListening = false;

  recognition.onstart = () => {
    isListening = true;
    callbacks.onStateChange(true);
  };

  recognition.onend = () => {
    isListening = false;
    callbacks.onStateChange(false);
  };

  recognition.onerror = (event: any) => {
    // ignore 'no-speech' or 'aborted' as common harmless events
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      callbacks.onError(event.error);
    }
  };

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      callbacks.onResult(finalTranscript.trim(), true);
    } else if (interimTranscript) {
      callbacks.onResult(interimTranscript.trim(), false);
    }
  };

  return {
    isSupported: true,
    start: () => {
      try {
        if (!isListening) {
          recognition.start();
        }
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    },
    stop: () => {
      try {
        if (isListening) {
          recognition.stop();
        }
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    },
  };
}
