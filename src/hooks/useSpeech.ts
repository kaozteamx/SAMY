import { useEffect, useState, useCallback, useRef } from 'react';

export type MatchResult = 'exact' | 'close' | 'miss';

// Chrome-safe speech synthesis with sweet female voice preference
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Aggressive voice loading for Chrome (voices load async)
  useEffect(() => {
    const loadVoices = () => {
      const available = synth.getVoices();
      if (available.length > 0) {
        voicesRef.current = available;
      }
    };

    loadVoices();

    // Chrome fires onvoiceschanged
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Extra poll for Chrome (sometimes voices load late even after event)
    let attempts = 0;
    const interval = setInterval(() => {
      const av = synth.getVoices();
      if (av.length > 0) {
        voicesRef.current = av;
        if (av.length >= 5 || ++attempts > 10) clearInterval(interval);
      }
    }, 300);

    return () => {
      synth.onvoiceschanged = null;
      clearInterval(interval);
    };
  }, [synth]);

  const speak = useCallback((text: string, rate = 0.9, pitch = 1.15): Promise<void> => {
    if (!synth) return Promise.resolve();

    // Fix for syllables that the TTS often spells out (like "CLE" -> "C-L-E")
    // Adding a tonic accent forces the TTS to treat it as a word/syllable
    const sanitizeText = (t: string) => {
      const lower = t.toLowerCase().trim();
      
      // Only patch short strings (syllables)
      if (lower.length > 0 && lower.length <= 4) {
        const patches: Record<string, string> = {
          'cle': 'clé', 'cla': 'clá', 'cli': 'clí', 'clo': 'cló', 'clu': 'clú',
          'ble': 'blé', 'bla': 'blá', 'bli': 'blí', 'blo': 'bló', 'blu': 'blú',
          'ple': 'plé', 'pla': 'plá', 'pli': 'plí', 'plo': 'pló', 'plu': 'plú',
          'tre': 'tré', 'tra': 'trá', 'tri': 'trí', 'tro': 'tró', 'tru': 'trú',
          'fre': 'fré', 'fra': 'frá', 'fri': 'frí', 'fro': 'fró', 'fru': 'frú',
          'gre': 'gré', 'gra': 'grá', 'gri': 'grí', 'gro': 'gró', 'gru': 'grú',
          'pre': 'pré', 'pra': 'prá', 'pri': 'prí', 'pro': 'pró', 'pru': 'prú',
          'fla': 'flá', 'fle': 'flé', 'fli': 'flí', 'flo': 'fló', 'flu': 'flú',
          'bra': 'brá', 'bre': 'bré', 'bri': 'brí', 'bro': 'bró', 'bru': 'brú',
          'cra': 'crá', 'cre': 'cré', 'cri': 'crí', 'cro': 'cró', 'cru': 'crú',
          'dra': 'drá', 'dre': 'dré', 'dri': 'drí', 'dro': 'dró', 'dru': 'drú',
        };
        return patches[lower] || t;
      }
      return t;
    };

    const finalTex = sanitizeText(text);

    // Resume in case Chrome paused
    synth.resume();

    // Only cancel if something is speaking (Chrome crashes state if canceled idle)
    if (synth.speaking) {
      synth.cancel();
    }

    return new Promise((resolve) => {
      const availableVoices = voicesRef.current.length > 0
        ? voicesRef.current
        : synth.getVoices();

      const localVoices = availableVoices.filter(v => v.localService);
      const useVoices = localVoices.length > 0 ? localVoices : availableVoices;

      const femaleKeywords = ['female', 'woman', 'girl', 'mujer', 'chica',
        'sabina', 'mónica', 'monica', 'paulina', 'maría', 'maria',
        'catalina', 'lucía', 'lucia', 'valentina', 'camila',
        'dulce', 'suave', 'soft', 'sweet',
      ];

      const isFemaleVoice = (v: SpeechSynthesisVoice): boolean => {
        const nameLower = v.name.toLowerCase();
        return femaleKeywords.some(kw => nameLower.includes(kw));
      };

      const bestVoice =
        useVoices.find(v => v.lang.startsWith('es') && v.localService && isFemaleVoice(v)) ??
        useVoices.find(v => v.lang.startsWith('es') && v.localService) ??
        useVoices.find(v => v.localService && isFemaleVoice(v)) ??
        useVoices.find(v => v.lang.startsWith('es')) ??
        useVoices.find(v => v.localService) ??
        useVoices[0] ??
        null;

      const utt = new SpeechSynthesisUtterance(finalTex);

      if (bestVoice) {
        utt.voice = bestVoice;
        utt.lang = bestVoice.lang;
      } else {
        utt.lang = 'es-ES';
      }

      utt.rate = rate;
      utt.pitch = pitch;
      utt.volume = 1.0;

      utteranceRef.current = utt;
      (window as unknown as { _lastUtterance: SpeechSynthesisUtterance })._lastUtterance = utt;

      let resolved = false;

      const doResolve = () => {
        if (!resolved) {
          resolved = true;
          setIsSpeaking(false);
          resolve();
        }
      };

      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => doResolve();
      utt.onerror = () => doResolve();

      synth.speak(utt);
    });
  }, [synth]);

  const stopSpeaking = useCallback(() => {
    synth.cancel();
    setIsSpeaking(false);
  }, [synth]);

  return { speak, stopSpeaking, isSpeaking };
}

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasSupport, setHasSupport] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionCtor) {
      setHasSupport(true);
      const rec = new SpeechRecognitionCtor();
      rec.lang = 'es-CL';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      recognitionRef.current = rec;
    }
  }, []);

  const listen = useCallback((): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const rec = recognitionRef.current;
      if (!rec) return reject(new Error('SpeechRecognition not supported'));

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const results: string[] = [];
        for (let i = 0; i < e.results[0].length; i++) {
          results.push(e.results[0][i].transcript.toLowerCase().trim());
        }
        resolve(results);
      };
      rec.onerror = (e: Event) => reject((e as SpeechRecognitionErrorEvent).error);
      rec.onend = () => setIsRecording(false);

      try {
        rec.start();
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { listen, stopListening, isRecording, hasSupport };
}

export function compareWords(spokenArray: string[], target: string): MatchResult {
  const t = target.toLowerCase().trim();
  for (const s of spokenArray) {
    if (s === t) return 'exact';
    if (s.includes(t) || t.includes(s)) return 'close';
    if (s.length > 2 && similarity(s, t) > 0.6) return 'close';
  }
  return 'miss';
}

function similarity(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const longer = m > n ? a : b;
  const shorter = m > n ? b : a;
  const lenL = longer.length;
  const lenS = shorter.length;

  if (lenS === 0) return 1;

  let prevRow = Array.from({ length: lenS + 1 }, (_, i) => i);
  for (let i = 1; i <= lenL; i++) {
    const curRow = [i];
    for (let j = 1; j <= lenS; j++) {
      const cost = longer[i - 1] === shorter[j - 1] ? 0 : 1;
      curRow[j] = Math.min(
        curRow[j - 1] + 1,
        prevRow[j] + 1,
        prevRow[j - 1] + cost
      );
    }
    prevRow = curRow;
  }

  const distance = prevRow[lenS];
  return (lenL - distance) / lenL;
}
