import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import MiMapa from './pages/MiMapa';
import Habla from './pages/Habla';
import Retos from './pages/Retos';
import Config from './pages/Config';
import Rapido from './pages/Rapido';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full min-w-0"
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="/mapa" element={<MiMapa />} />
          <Route path="/rapido" element={<Rapido />} />
          <Route path="/habla" element={<Habla />} />
          <Route path="/retos" element={<Retos />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const checkStreak = useStore(state => state.checkStreak);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-6 pb-40 min-h-[100dvh] relative w-full min-w-0">
      <AppRoutes />
      <NavBar />
    </div>
  );
}
