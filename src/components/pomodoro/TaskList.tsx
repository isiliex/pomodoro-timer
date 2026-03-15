import React, { useState } from 'react';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const TaskList: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [input, setInput] = useState('');

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
        setInput('');
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className={`w-80 h-[500px] rounded-[2.5rem] border transition-all duration-700 flex flex-col p-6 shadow-2xl
      ${isDark
                ? 'bg-slate-900/30 border-white/10 backdrop-blur-2xl'
                : 'bg-white/40 border-black/5 backdrop-blur-xl'}`}>

            <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-6 opacity-100 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Focus Tasks
            </h3>

            {/* Input Alanı */}
            <form onSubmit={addTask} className="mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="New task..."
                    className={`w-full bg-transparent border-b py-2 focus:outline-none transition-colors
            ${isDark ? 'border-white/10 focus:border-blue-500 text-white' : 'border-black/10 focus:border-orange-500 text-slate-800'}`}
                />
            </form>

            {/* Görev Listesi */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all
              ${task.completed ? 'opacity-40' : 'opacity-100'}
              ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all
              ${task.completed
                                ? 'bg-emerald-500 border-emerald-500'
                                : isDark ? 'border-white/20' : 'border-black/20'}`}>
                            {task.completed && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        <span className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                            {task.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;