import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { useSounds } from '../hooks/useSounds';
import type { ReactNode } from 'react';

interface MascotProps {
  size?: number;
}

export default function Mascot({ size = 160 }: MascotProps) {
  const equipped = useStore(state => state.equippedAccessory);
  const { speak } = useSpeech();
  const { playPop, ensureAudio } = useSounds();

  const phrases = [
    "¡Hola! Soy tu amigo Samy.",
    "¡Lo estás haciendo genial!",
    "¡Eres muy inteligente!",
    "¡Sigue así!",
    "¡Me encanta jugar contigo!",
    "¡Miau! ¿Qué vamos a hacer ahora?"
  ];

  const handleClick = () => {
    ensureAudio();
    playPop();
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    speak(randomPhrase, 0.95, 1.9);
  };

  const renderAccessory = (id: string | null): ReactNode => {
    switch (id) {
      case 'bow': return <text x="130" y="55" fontSize="28" transform="rotate(15,130,55)">🎀</text>;
      case 'hat': return <text x="82" y="30" fontSize="32">🎩</text>;
      case 'glasses': return <text x="78" y="88" fontSize="24">🕶️</text>;
      case 'crown': return <text x="80" y="32" fontSize="30">👑</text>;
      case 'wings': return (
        <>
          <text x="30" y="130" fontSize="28" transform="rotate(-20,30,130)">🦋</text>
          <text x="145" y="130" fontSize="28" transform="rotate(20,145,130)">🦋</text>
        </>
      );
      case 'cape': return (
        <>
          <text x="140" y="140" fontSize="24">⭐</text>
          <rect x="90" y="105" width="20" height="50" rx="5" fill="#EF4444" opacity="0.6"/>
        </>
      );
      default: return null;
    }
  };

  return (
    <div className="relative flex justify-center items-center my-2" style={{ width: size, height: size }}>
      {/* Glow behind mascot */}
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.6), transparent)',
        }}
      />

      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        onClick={handleClick}
        className="cursor-pointer active:scale-110 transition-transform relative z-10 drop-shadow-xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Subtle shadow under cat */}
        <ellipse cx="100" cy="182" rx="45" ry="8" fill="#E8E5F0" opacity="0.6">
          <animate attributeName="rx" values="45;40;45" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Body */}
        <ellipse cx="100" cy="135" rx="48" ry="43" fill="#FAFAFA" stroke="#E8E5F0" strokeWidth="2.5"/>
        <ellipse cx="78" cy="125" rx="11" ry="9" fill="#E8E5F0" opacity="0.4"/>
        <ellipse cx="118" cy="140" rx="9" ry="7" fill="#E8E5F0" opacity="0.4"/>
        <circle cx="90" cy="150" r="5" fill="#E8E5F0" opacity="0.3"/>

        {/* Head */}
        <circle cx="100" cy="80" r="37" fill="#FAFAFA" stroke="#E8E5F0" strokeWidth="2.5"/>
        <circle cx="115" cy="68" r="9" fill="#E8E5F0" opacity="0.3"/>

        {/* Ears */}
        <polygon points="68,55 60,20 85,48" fill="#FAFAFA" stroke="#E8E5F0" strokeWidth="2.5"/>
        <polygon points="132,55 140,20 115,48" fill="#FAFAFA" stroke="#E8E5F0" strokeWidth="2.5"/>
        <polygon points="70,50 65,28 82,46" fill="#F9A8D4" opacity="0.5"/>
        <polygon points="130,50 135,28 118,46" fill="#F9A8D4" opacity="0.5"/>

        {/* Eyes */}
        <ellipse cx="85" cy="78" rx="7.5" ry="8.5" fill="#1E1B4B"/>
        <ellipse cx="115" cy="78" rx="7.5" ry="8.5" fill="#1E1B4B"/>
        {/* Eye shine */}
        <circle cx="88" cy="75" r="3.5" fill="#FFF"/>
        <circle cx="118" cy="75" r="3.5" fill="#FFF"/>
        <circle cx="86.5" cy="80" r="1.5" fill="#FFF" opacity="0.6"/>
        <circle cx="116.5" cy="80" r="1.5" fill="#FFF" opacity="0.6"/>

        {/* Nose & Mouth */}
        <ellipse cx="100" cy="90" rx="4.5" ry="3.5" fill="#F9A8D4"/>
        <path d="M93,95 Q100,102 107,95" fill="none" stroke="#D4D4D8" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Whiskers */}
        <line x1="55" y1="85" x2="78" y2="87" stroke="#D4D4D8" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="55" y1="91" x2="78" y2="91" stroke="#D4D4D8" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="122" y1="87" x2="145" y2="85" stroke="#D4D4D8" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="122" y1="91" x2="145" y2="91" stroke="#D4D4D8" strokeWidth="1.2" strokeLinecap="round"/>

        {/* Paws */}
        <ellipse cx="75" cy="175" rx="13" ry="7" fill="#FAFAFA" stroke="#E8E5F0" strokeWidth="2"/>
        <ellipse cx="125" cy="175" rx="13" ry="7" fill="#FAFAFA" stroke="#E8E5F0" strokeWidth="2"/>

        {/* Tail */}
        <motion.path
          d="M148,140 Q170,118 158,95"
          fill="none" stroke="#D4D4D8" strokeWidth="6" strokeLinecap="round"
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "148px", originY: "140px" }}
        />

        {/* Blush */}
        <ellipse cx="70" cy="92" rx="8" ry="5" fill="#F9A8D4" opacity="0.35"/>
        <ellipse cx="130" cy="92" rx="8" ry="5" fill="#F9A8D4" opacity="0.35"/>

        {renderAccessory(equipped)}
      </motion.svg>
    </div>
  );
}
