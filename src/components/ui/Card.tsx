import * as React from "react"

interface CardProps {
  displayTime: string;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onManualChange: (type: 'h' | 'm' | 's', value: number) => void;
  isDark: boolean;
}

const Card: React.FC<CardProps> = ({ displayTime, isActive, onToggle, onReset, onManualChange, isDark }) => {
  return (
    <div className="relative group max-w-sm w-full mx-auto">
      {/* Arka Plan Parlama Efekti */}
      <div className={`absolute -inset-2 rounded-[3.5rem] blur-2xl opacity-20 transition-all duration-700
        ${isDark ? 'bg-blue-500' : 'bg-orange-500'}`}></div>

      <div className={`relative px-8 py-12 rounded-[3rem] shadow-2xl flex flex-col items-center border transition-all duration-700
        ${isDark 
          ? 'bg-slate-900/40 border-white/10 backdrop-blur-3xl' 
          : 'bg-white/70 border-black/5 backdrop-blur-2xl'}`}>
        
        <h2 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 opacity-40">Timer Settings</h2>

        {/* Manuel Giriş Alanları */}
        <div className="flex gap-4 mb-10">
          {[
            { label: 'HH', type: 'h' },
            { label: 'MM', type: 'm' },
            { label: 'SS', type: 's' }
          ].map((input) => (
            <div key={input.type} className="flex flex-col items-center group/input">
              <input 
                type="number" 
                placeholder={input.label}
                min="0"
                max={input.type === 'h' ? '99' : '59'}
                onChange={(e) => onManualChange(input.type as 'h' | 'm' | 's', Math.max(0, parseInt(e.target.value) || 0))}
                className={`w-16 bg-transparent border-b-2 text-center py-2 text-xl font-mono transition-all focus:outline-none
                  ${isDark 
                    ? 'border-white/10 focus:border-blue-500 text-white' 
                    : 'border-slate-300 focus:border-orange-500 text-slate-800'}`}
              />
              <span className="text-[9px] mt-1 opacity-30 font-bold">{input.label}</span>
            </div>
          ))}
        </div>

        {/* Büyük Saat Göstergesi */}
        <div className={`text-7xl font-black tracking-tighter tabular-nums mb-12
          ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {displayTime}
        </div>
        
        {/* Kontrol Butonları */}
        <div className="flex gap-3 w-full">
          <button 
            onClick={onToggle} 
            className={`flex-[2] py-4 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl
            ${isActive 
              ? 'bg-rose-500 text-white shadow-rose-500/20' 
              : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}
          >
            {isActive ? 'PAUSE' : 'START'}
          </button>
          
          <button 
            onClick={onReset} 
            className={`flex-1 py-4 rounded-2xl font-bold transition-all
              ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export { Card }
