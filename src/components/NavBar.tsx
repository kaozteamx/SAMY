import { NavLink } from 'react-router-dom';
import { Home, LayoutList, MessageCircle, Puzzle, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSounds } from '../hooks/useSounds';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function NavBar() {
  const { playClick, ensureAudio } = useSounds();

  const handleNav = () => {
    ensureAudio();
    playClick();
  };

  const navItems: NavItem[] = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/mapa", icon: LayoutList, label: "Mi Día" },
    { to: "/habla", icon: MessageCircle, label: "Habla" },
    { to: "/retos", icon: Puzzle, label: "Retos" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="max-w-[480px] mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-elevated rounded-[28px] flex items-center justify-around px-2 py-1.5"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNav}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-[64px] h-[56px] rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-text-muted font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                        boxShadow: '0 4px 16px -2px rgba(124, 58, 237, 0.4)',
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <item.icon
                    className="w-6 h-6 relative z-10"
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span className="text-[11px] mt-0.5 font-semibold relative z-10">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </motion.div>
      </div>
    </nav>
  );
}
