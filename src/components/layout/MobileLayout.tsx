import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, ClipboardList, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="mobile-wrapper">
      <div className="mobile-container overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-6 pt-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[382px] glass-panel rounded-3xl px-4 py-3 flex justify-around items-center z-50">
          <NavIcon to="/dashboard" icon={<LayoutDashboard size={20} />} label="首页" />
          <NavIcon to="/plan" icon={<ClipboardList size={20} />} label="计划" />
          <NavIcon to="/progress" icon={<TrendingUp size={20} />} label="进度" />
          <NavIcon to="/equipment" icon={<Dumbbell size={20} />} label="器材" />
          <NavIcon to="/settings" icon={<User size={20} />} label="我的" />
        </nav>
      </div>
    </div>
  );
};

interface NavIconProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavIcon: React.FC<NavIconProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-colors duration-300 ${
          isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'
        }`
      }
    >
      <motion.div
        whileTap={{ scale: 0.9, y: -2 }}
        className="flex flex-col items-center"
      >
        {icon}
        <span className="text-[10px] font-medium tracking-wide leading-none mt-1 uppercase">{label}</span>
      </motion.div>
    </NavLink>
  );
};

export default MobileLayout;
