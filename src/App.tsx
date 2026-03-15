import { useState, useEffect } from "react";
import { PomodoroTimer } from "./components/pomodoro/PomodoroTimer";
import { Button } from "./components/ui/Button";
import TaskList from './components/pomodoro/TaskList';


function App() {
  const [isDark, setIsDark] = useState(true);

  // Dark Mode Sınıf Yönetimi
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <main className={`relative min-h-screen flex items-center justify-center p-4 sm:p-8 selection:bg-primary/30 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* 1. KATMAN: Noktalı Arka Plan Deseni */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)]"></div>

      {/* 2. KATMAN: 12 Adet Kozmik Küre (Light & Dark Optimize) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* GRUP 1: Köşeler */}
        <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-blue-600 opacity-20' : 'bg-blue-400 opacity-30'}`}></div>
        <div className={`absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full blur-[110px] transition-all duration-1000 ${isDark ? 'bg-purple-600 opacity-20' : 'bg-purple-300 opacity-25'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[130px] transition-all duration-1000 ${isDark ? 'bg-emerald-600 opacity-20' : 'bg-emerald-300 opacity-25'}`}></div>
        <div className={`absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full blur-[110px] transition-all duration-1000 ${isDark ? 'bg-rose-600 opacity-20' : 'bg-rose-300 opacity-30'}`}></div>

        {/* GRUP 2: Kenar Ortalar */}
        <div className={`absolute top-1/2 -left-20 w-80 h-80 rounded-full blur-[90px] transition-all duration-1000 ${isDark ? 'bg-cyan-500 opacity-15' : 'bg-cyan-400 opacity-20'}`}></div>
        <div className={`absolute top-1/2 -right-20 w-80 h-80 rounded-full blur-[90px] transition-all duration-1000 ${isDark ? 'bg-amber-500 opacity-15' : 'bg-orange-300 opacity-20'}`}></div>

        {/* GRUP 3: İç Parıltılar */}
        <div className={`absolute top-[20%] right-[30%] w-40 h-40 rounded-full blur-[60px] transition-all duration-1000 ${isDark ? 'bg-sky-400 opacity-10' : 'bg-sky-300 opacity-20'}`}></div>
        <div className={`absolute bottom-[20%] left-[30%] w-56 h-56 rounded-full blur-[80px] transition-all duration-1000 ${isDark ? 'bg-violet-400 opacity-10' : 'bg-indigo-300 opacity-20'}`}></div>
        <div className={`absolute top-[40%] left-[15%] w-32 h-32 rounded-full blur-[50px] transition-all duration-1000 ${isDark ? 'bg-lime-400 opacity-5' : 'bg-lime-300 opacity-15'}`}></div>

        {/* GRUP 4: Dev Merkez Derinlik */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] rounded-full blur-[160px] transition-all duration-1000 ${isDark ? 'bg-slate-800 opacity-5' : 'bg-slate-200 opacity-20'}`}></div>
      </div>

      {/* Tema Değiştirme Butonu */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 shadow-md rounded-full w-12 h-12 text-xl bg-background hover:bg-muted z-50 border-white/10"
      >
        {isDark ? '🌙' : '☀️'}
      </Button>

      {/* 3. KATMAN: Ana İçerik (Grid Düzeni) */}
      <div className="relative z-10 w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8">

        {/* Sol Sütun: Boş (Merkezlemeyi sağlar) */}
        <div className="hidden lg:block"></div>

        {/* Orta Sütun: Pomodoro Saat (Tam Merkez) */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <PomodoroTimer isDark={isDark} />
          </div>
        </div>

        {/* Sağ Sütun: Task Listesi (Sağda Süzülür) */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-sm">
            <TaskList isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-6 text-sm text-muted-foreground font-medium opacity-50">
        Pomodoro Focus
      </footer>
    </main>
  );
}

export default App;