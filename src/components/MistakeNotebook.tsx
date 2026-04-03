"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, RotateCcw, AlertCircle, Notebook } from "lucide-react";

interface Mistake {
  id: string;
  subject: string;
  question: string;
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  addedDate: string;
  revised: boolean;
}

export default function MistakeNotebook() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", question: "", wrongAnswer: "", correctAnswer: "", explanation: "" });

  useEffect(() => {
    const saved = localStorage.getItem("nexus_mistakes");
    if (saved) { try { setMistakes(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_mistakes", JSON.stringify(mistakes));
  }, [mistakes]);

  const addMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) return;
    setMistakes([{ id: crypto.randomUUID(), ...form, addedDate: new Date().toISOString().split("T")[0], revised: false }, ...mistakes]);
    setForm({ subject: "", question: "", wrongAnswer: "", correctAnswer: "", explanation: "" });
    setShowForm(false);
  };

  const toggleRevised = (id: string) => setMistakes(mistakes.map(m => m.id === id ? { ...m, revised: !m.revised } : m));
  const deleteMistake = (id: string) => setMistakes(mistakes.filter(m => m.id !== id));

  const unrevised = mistakes.filter(m => !m.revised);
  const revised = mistakes.filter(m => m.revised);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-outfit">Mistake <span className="text-gradient">Notebook</span></h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} /> Add Mistake
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={addMistake} className="glass-panel !rounded-2xl p-6 space-y-3 overflow-hidden">
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject (e.g. OS)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Question you got wrong..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30 resize-none h-20" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.wrongAnswer} onChange={e => setForm({ ...form, wrongAnswer: e.target.value })} placeholder="Your wrong answer" className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 outline-none focus:border-red-500 placeholder:text-white/30" />
            <input value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} placeholder="Correct answer" className="bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 outline-none focus:border-green-500 placeholder:text-white/30" />
          </div>
          <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} placeholder="Explanation / Why you were wrong..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30 resize-none h-20" />
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold w-full hover:opacity-90 transition-opacity">Save to Notebook</button>
        </motion.form>
      )}

      {mistakes.length === 0 && (
        <div className="glass-panel !rounded-3xl p-12 text-center">
          <Notebook size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">Clean Slate</h3>
          <p className="text-slate-500">You haven't added any mistakes yet. Whenever you answer a PYQ or test question incorrectly, add it here for revision.</p>
        </div>
      )}

      {unrevised.length > 0 && (
        <div>
          <h3 className="text-xl font-bold font-outfit mb-3 flex items-center gap-2"><AlertCircle size={20} className="text-red-400" /> Needs Revision ({unrevised.length})</h3>
          <div className="space-y-3">
            {unrevised.map((mistake, i) => (
              <motion.div key={mistake.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel !rounded-2xl p-5 border-l-4 border-l-red-500 hover:!bg-white/[0.08] transition-all">
                <div className="flex justify-between items-start mb-3"><span className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">{mistake.subject}</span><span className="text-xs text-slate-500">{mistake.addedDate}</span></div>
                <p className="font-bold text-lg mb-3">{mistake.question}</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-xs text-red-400 mb-1">Your Answer</p><p className="font-medium text-red-300">{mistake.wrongAnswer}</p></div>
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20"><p className="text-xs text-green-400 mb-1">Correct Answer</p><p className="font-medium text-green-300">{mistake.correctAnswer}</p></div>
                </div>
                {mistake.explanation && <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-3"><p className="text-xs text-blue-400 mb-1">💡 Explanation</p><p className="text-sm text-slate-300">{mistake.explanation}</p></div>}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => toggleRevised(mistake.id)} className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-colors flex items-center gap-1"><RotateCcw size={14} /> Mark Revised</button>
                  <button onClick={() => deleteMistake(mistake.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors"><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {revised.length > 0 && (
        <div className="opacity-60">
          <h3 className="text-lg font-bold font-outfit mb-3 text-green-400">✓ Revised ({revised.length})</h3>
          <div className="space-y-2">
            {revised.map(m => (
              <div key={m.id} className="glass-panel !rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><BookOpen size={16} className="text-green-400" /><span className="text-sm">{m.subject}: {m.question.slice(0, 60)}...</span></div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRevised(m.id)} className="text-xs text-slate-500 hover:text-yellow-400 transition-colors">Undo</button>
                  <button onClick={() => deleteMistake(m.id)} className="text-xs text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
