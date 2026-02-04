import React from 'react';
import { Cpu, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-8 relative flex flex-col items-center justify-center border-b border-cyan-500/20 bg-[#050505]/80 backdrop-blur-md z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-purple-900/10 to-cyan-900/10 pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-2 animate-pulse">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <span className="text-cyan-400 text-xs tracking-[0.3em] uppercase font-bold">Thien Master AI Core</span>
        <Zap className="w-6 h-6 text-cyan-400" />
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white font-display text-center uppercase tracking-tighter neon-glow">
        GENESIS ARCHITECT
      </h1>
      
      <p className="mt-4 text-slate-400 text-sm md:text-lg max-w-2xl text-center font-light tracking-wide">
        Biến Thư Viện Cũ Thành <span className="text-cyan-400 font-semibold">Siêu Phẩm Mới</span> Trong Tích Tắc
      </p>
      
      <div className="mt-6 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full opacity-50"></div>
    </header>
  );
};

export default Header;