"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BookOpen, RotateCcw, Flame, BarChart3, Zap, 
  Target, Brain, Trophy, Timer, Notebook, Menu, X,
  CheckCircle2, Circle, Clock, Leaf, Trash2, Plus, Bell
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Import all components
import PYQTracker from "@/components/PYQTracker";
import SmartRevision from "@/components/SmartRevision";
import SubjectHeatmap from "@/components/SubjectHeatmap";
import SyllabusTracker from "@/components/SyllabusTracker";
import PYQAnalyzer from "@/components/PYQAnalyzer";
import StudyRecommendation from "@/components/StudyRecommendation";
import DailyChallenge from "@/components/DailyChallenge";
import RankPrediction from "@/components/RankPrediction";
import MistakeNotebook from "@/components/MistakeNotebook";

// --- Types for Dashboard Tab ---
type Priority = "urgent" | "focus" | "deep_work" | "easy";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  estimatedTime: number;
}

const PRIORITIES: Record<Priority, { label: string; icon: React.ReactNode; color: string }> = {
  urgent: { label: "Urgent", icon: <Flame size={14} />, color: "text-red-400 bg-red-400/10 border-red-400/20" },
  focus: { label: "Focus", icon: <Zap size={14} />, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  deep_work: { label: "Deep Work", icon: <Brain size={14} />, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  easy: { label: "Easy", icon: <Leaf size={14} />, color: "text-green-400 bg-green-400/10 border-green-400/20" },
};

// --- Navigation Items ---
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
  { id: "pyq", label: "PYQ Tracker", icon: <BookOpen size={20} /> },
  { id: "revision", label: "Smart Revision", icon: <RotateCcw size={20} /> },
  { id: "heatmap", label: "Subject Heatmap", icon: <Flame size={20} /> },
  { id: "syllabus", label: "Syllabus Progress", icon: <CheckCircle2 size={20} /> },
  { id: "analyzer", label: "PYQ Analyzer", icon: <BarChart3 size={20} /> },
  { id: "recommend", label: "AI Recommendations", icon: <Sparkles size={20} /> },
  { id: "challenge", label: "Daily Challenge", icon: <Zap size={20} /> },
  { id: "focus", label: "Focus Mode", icon: <Timer size={20} /> },
  { id: "rank", label: "Rank Prediction", icon: <Target size={20} /> },
  { id: "mistakes", label: "Mistake Notebook", icon: <Notebook size={20} /> },
];

// --- Focus Mode Component (inline) ---
function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessions(s => s + 1);
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  const focusScore = Math.min(100, sessions * 20 + (isActive ? Math.round(progress / 2) : 0));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-outfit">Focus <span className="text-gradient">Study Mode</span></h2>
      <p className="text-slate-400">Deep focus sessions with distraction blocking. Complete 25-minute sprints.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timer */}
        <div className="glass-panel !rounded-3xl p-10 text-center relative overflow-hidden">
          {isActive && <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 animate-pulse"></div>}
          <div className="relative z-10">
            {/* Circular Progress */}
            <div className="relative w-56 h-56 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle cx="100" cy="100" r="90" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={565} animate={{ strokeDashoffset: 565 - (565 * progress) / 100 }} transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold font-outfit tracking-tighter">{formatTime(timeLeft)}</p>
                <p className="text-sm text-slate-400 mt-1">{isActive ? "Stay focused..." : "Ready?"}</p>
              </div>
            </div>

            <button onClick={() => setIsActive(!isActive)}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isActive ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}>
              {isActive ? '⏸ Pause Session' : '▶ Start Focus Session'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="glass-panel !rounded-2xl p-6">
            <h4 className="font-bold mb-2">Sessions Today</h4>
            <p className="text-4xl font-bold font-outfit text-blue-400">{sessions}</p>
            <p className="text-sm text-slate-500">{sessions * 25} minutes of deep focus</p>
          </div>
          <div className="glass-panel !rounded-2xl p-6">
            <h4 className="font-bold mb-2">Focus Score</h4>
            <p className="text-4xl font-bold font-outfit text-gradient">{focusScore}/100</p>
            <div className="w-full h-3 bg-white/5 rounded-full mt-3 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" animate={{ width: `${focusScore}%` }} />
            </div>
          </div>
          <div className="glass-panel !rounded-2xl p-6">
            <h4 className="font-bold mb-3">🎵 Study Ambiance</h4>
            <div className="grid grid-cols-2 gap-2">
              {["Lo-fi Beats", "Rain Sounds", "Cafe Noise", "Silence"].map(s => (
                <button key={s} className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard Home Component (inline) ---
function DashboardHome({ xp, level }: { xp: number; level: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("focus");
  const [estimatedTime, setEstimatedTime] = useState(30);

  useEffect(() => {
    const saved = localStorage.getItem("nexus_dashboard_tasks");
    if (saved) { try { setTasks(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_dashboard_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setTasks([{ id: crypto.randomUUID(), text: inputText.trim(), completed: false, priority: selectedPriority, estimatedTime }, ...tasks]);
    setInputText("");
  };

  const toggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));
  const completedCount = tasks.filter(t => t.completed).length;
  const totalTime = tasks.filter(t => !t.completed).reduce((a, t) => a + t.estimatedTime, 0);

  const chartData = [
    { name: "Done", value: completedCount || 1, color: "#10b981" },
    { name: "Left", value: (tasks.length - completedCount) || 1, color: "rgba(255,255,255,0.1)" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-outfit">Welcome to <span className="text-gradient">NexusTasks Pro</span></h2>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel !rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold font-outfit text-blue-400">{tasks.length}</p>
          <p className="text-sm text-slate-400">Total Tasks</p>
        </div>
        <div className="glass-panel !rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold font-outfit text-green-400">{completedCount}</p>
          <p className="text-sm text-slate-400">Completed</p>
        </div>
        <div className="glass-panel !rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold font-outfit text-purple-400">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
          <p className="text-sm text-slate-400">Workload</p>
        </div>
        <div className="glass-panel !rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold font-outfit text-yellow-400">Lvl {level}</p>
          <p className="text-sm text-slate-400">{xp} XP</p>
        </div>
      </div>

      {/* Add Task */}
      <form onSubmit={addTask} className="glass-panel !rounded-2xl p-5">
        <div className="flex gap-3 mb-3">
          <input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Add a new task..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all placeholder:text-white/30" />
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={18} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Clock size={14} className="text-slate-400" />
          <input type="number" value={estimatedTime} onChange={e => setEstimatedTime(Number(e.target.value))}
            className="w-14 bg-transparent border-b border-white/20 outline-none text-center text-sm focus:border-blue-500" />
          <span className="text-xs text-slate-400 mr-3">mins</span>
          {(Object.keys(PRIORITIES) as Priority[]).map(p => (
            <button key={p} type="button" onClick={() => setSelectedPriority(p)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition-all ${selectedPriority === p ? PRIORITIES[p].color : 'border-transparent text-slate-500 hover:bg-white/5'}`}>
              {PRIORITIES[p].icon} {PRIORITIES[p].label}
            </button>
          ))}
        </div>
      </form>

      {/* Task List */}
      <AnimatePresence>
        {tasks.map(task => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`glass-panel !rounded-2xl p-4 flex items-center gap-4 hover:!bg-white/[0.08] transition-all ${task.completed ? 'opacity-50' : ''}`}>
            <button onClick={() => toggleTask(task.id)} className="shrink-0">
              {task.completed ? <CheckCircle2 className="text-green-400" /> : <Circle className="text-slate-400" />}
            </button>
            <span className={`flex-1 font-medium ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.text}</span>
            <span className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 border ${PRIORITIES[task.priority].color}`}>
              {PRIORITIES[task.priority].icon}
            </span>
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg">{task.estimatedTime}m</span>
            <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-400/10 transition-colors">
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- Main Page ---
export default function NexusTasksPro() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardHome xp={xp} level={level} />;
      case "pyq": return <PYQTracker />;
      case "revision": return <SmartRevision />;
      case "heatmap": return <SubjectHeatmap />;
      case "syllabus": return <SyllabusTracker />;
      case "analyzer": return <PYQAnalyzer />;
      case "recommend": return <StudyRecommendation />;
      case "challenge": return <DailyChallenge />;
      case "focus": return <FocusMode />;
      case "rank": return <RankPrediction />;
      case "mistakes": return <MistakeNotebook />;
      default: return <DashboardHome xp={xp} level={level} />;
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="h-screen sticky top-0 glass-panel !rounded-none border-r border-white/10 flex flex-col overflow-hidden z-40"
        style={{ minWidth: sidebarOpen ? 280 : 0 }}
      >
        <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-outfit">NexusTasks <span className="text-gradient">Pro</span></h1>
            <p className="text-xs text-slate-500">GATE Study Manager</p>
          </div>
        </div>

        {/* Gamification */}
        <div className="p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-400" />
            <span className="font-bold text-sm">Level {level}</span>
            <span className="text-xs text-slate-500 ml-auto">{xp} XP</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" animate={{ width: `${(xp % (level * 200)) / (level * 200) * 100}%` }} />
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-panel !rounded-none border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <div className="glass-panel !rounded-full !py-1.5 !px-3 flex items-center gap-2 text-xs">
              <Trophy size={14} className="text-yellow-400" /> Lvl {level} • {xp} XP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Level Up Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCelebration(false)}>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-b from-blue-900/80 to-purple-900/80 border border-white/20 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-lg text-center">
              <Trophy size={64} className="text-yellow-400 mb-6" />
              <h2 className="text-4xl font-outfit font-bold mb-4">Level Up!</h2>
              <p className="text-xl text-blue-200 mb-8 font-outfit">
                "You are getting closer to your dream of cracking GATE!"
                <br /><br />
                <span className="text-sm text-slate-400 italic">- Your Future Self 💪</span>
              </p>
              <button onClick={() => setShowCelebration(false)} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                Keep Grinding
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
