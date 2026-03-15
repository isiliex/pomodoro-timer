import React, { useState } from 'react';

export interface QueueItem {
    id: string;
    mode: 'focus' | 'shortBreak' | 'longBreak';
    label: string;
    duration: number;
}

interface QueueProps {
    queue: QueueItem[];
    currentIndex: number;
    isDark: boolean;
    onGenerateQueue: (totalHours: number, totalMins: number, focusMins: number, breakMins: number) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, currentIndex, isDark, onGenerateQueue }) => {
    const [totalHours, setTotalHours] = useState(1);
    const [totalMins, setTotalMins] = useState(30);
    const [focusMins, setFocusMins] = useState(25);
    const [breakMins, setBreakMins] = useState(5);
    const [isLocked, setIsLocked] = useState(false);

    const handleGenerate = () => {
        onGenerateQueue(totalHours, totalMins, focusMins, breakMins);
        setIsLocked(true);
    };

    // Sadece formu açar, mevcut akışı bozmaz
    const handleEdit = () => {
        setIsLocked(false);
    };

    // Her şeyi sıfırlar ve formu açar
    const handleReset = () => {
        setIsLocked(false);
        onGenerateQueue(0, 0, 0, 0); // App.tsx tarafında sıfırlama tetikler
    };

    return (
        <div className={`w-80 p-6 rounded-[2.5rem] border transition-all duration-700 h-fit
      ${isDark ? 'bg-slate-900/40 border-white/10 backdrop-blur-2xl' : 'bg-white/60 border-black/5 backdrop-blur-xl shadow-xl'}`}>

            {/* SETTINGS FORMU */}
            <div className={`mb-8 space-y-4 transition-all duration-500 ${isLocked ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Settings</h3>
                    {isLocked && <span className="text-[9px] bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full animate-pulse font-bold tracking-tighter">ACTIVE</span>}
                </div>

                <fieldset disabled={isLocked} className="space-y-3 border-none p-0 m-0">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] block mb-1 opacity-50 font-bold uppercase tracking-wider">Total Hrs</label>
                            <input type="number" value={totalHours} onChange={(e) => setTotalHours(Number(e.target.value))} className="w-full bg-slate-500/10 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] block mb-1 opacity-50 font-bold uppercase tracking-wider">Total Mins</label>
                            <input type="number" value={totalMins} onChange={(e) => setTotalMins(Number(e.target.value))} className="w-full bg-slate-500/10 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] block mb-1 opacity-50 font-bold uppercase tracking-wider">Focus (m)</label>
                            <input type="number" value={focusMins} onChange={(e) => setFocusMins(Number(e.target.value))} className="w-full bg-slate-500/10 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] block mb-1 opacity-50 font-bold uppercase tracking-wider">Break (m)</label>
                            <input type="number" value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value))} className="w-full bg-slate-500/10 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* BUTON ALANI */}
            <div className="mb-8 flex flex-col gap-2">
                {isLocked ? (
                    <>
                        <button
                            onClick={handleEdit}
                            className="w-full py-3.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-95"
                        >
                            Edit Settings
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full py-3.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95"
                        >
                            Reset Program
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleGenerate}
                        className="w-full py-3.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
                    >
                        Generate Schedule
                    </button>
                )}
            </div>

            {/* KUYRUK LİSTESİ */}
            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black mb-4 opacity-50 ${isDark ? 'text-white' : 'text-slate-800'}`}>Flow</h3>
                <div className="space-y-3">
                    {queue.length === 0 ? (
                        <div className="text-[10px] opacity-20 text-center py-6 italic tracking-widest uppercase">No Active Program</div>
                    ) : (
                        queue.map((item, index) => (
                            <div key={item.id} className={`flex items-center gap-3 transition-all duration-500 ${index < currentIndex ? 'opacity-20' : 'opacity-100'}`}>
                                <div className={`w-1 h-8 rounded-full ${index === currentIndex ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-700/30'}`} />
                                <div className="flex justify-between w-full items-center text-[11px]">
                                    <span className={`font-bold ${index === currentIndex ? 'text-blue-500' : ''}`}>{item.label}</span>
                                    <span className="opacity-40 font-mono">{item.duration / 60}m</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Queue;