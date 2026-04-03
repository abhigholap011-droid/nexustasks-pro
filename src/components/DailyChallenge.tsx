"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, XCircle, RotateCcw, Plus, Trash2 } from "lucide-react";

interface Question {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correct: number;
  type: "pyq" | "aptitude" | "conceptual";
}

export default function DailyChallenge() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", question: "", optA: "", optB: "", optC: "", optD: "", correct: "0", type: "pyq" as "pyq" | "aptitude" | "conceptual" });

  useEffect(() => {
    const saved = localStorage.getItem("nexus_challenge_questions");
    if (saved) { try { setQuestions(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_challenge_questions", JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.optA.trim()) return;
    setQuestions([...questions, {
      id: crypto.randomUUID(), subject: form.subject.trim(), question: form.question.trim(),
      options: [form.optA.trim(), form.optB.trim(), form.optC.trim(), form.optD.trim()].filter(Boolean),
      correct: Number(form.correct), type: form.type,
    }]);
    setForm({ subject: "", question: "", optA: "", optB: "", optC: "", optD: "", correct: "0", type: "pyq" });
    setShowForm(false);
  };

  const selectAnswer = (optIdx: number) => {
    if (!questions.length || answers[questions[currentQ].id] !== undefined) return;
    setAnswers({ ...answers, [questions[currentQ].id]: optIdx });
  };

  const nextQ = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else setShowResult(true);
  };

  const restart = () => { setCurrentQ(0); setAnswers({}); setShowResult(false); };

  const totalCorrect = Object.entries(answers).filter(([id, ans]) => {
    const q = questions.find(q => q.id === id);
    return q && q.correct === ans;
  }).length;

  // Empty State
  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-outfit">Daily <span className="text-gradient">Challenge</span></h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90"><Plus size={18} /> Add Question</button>
        </div>

        {showForm && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addQuestion} className="glass-panel !rounded-2xl p-5 space-y-3">
            <div className="flex gap-3">
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white">
                <option value="pyq">📚 PYQ</option><option value="aptitude">🧮 Aptitude</option><option value="conceptual">🧠 Conceptual</option>
              </select>
            </div>
            <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Question..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30 resize-none h-16" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.optA} onChange={e => setForm({ ...form, optA: e.target.value })} placeholder="Option A" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
              <input value={form.optB} onChange={e => setForm({ ...form, optB: e.target.value })} placeholder="Option B" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
              <input value={form.optC} onChange={e => setForm({ ...form, optC: e.target.value })} placeholder="Option C" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
              <input value={form.optD} onChange={e => setForm({ ...form, optD: e.target.value })} placeholder="Option D" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Correct Answer:</span>
              {["A", "B", "C", "D"].map((l, i) => (
                <button key={l} type="button" onClick={() => setForm({ ...form, correct: String(i) })}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${Number(form.correct) === i ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{l}</button>
              ))}
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold w-full hover:opacity-90">Save Question</button>
          </motion.form>
        )}

        <div className="glass-panel !rounded-3xl p-12 text-center">
          <Zap size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">No Questions Added</h3>
          <p className="text-slate-500">Add GATE PYQs, aptitude, and conceptual questions to create your daily challenge quiz.</p>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold font-outfit">Daily <span className="text-gradient">Challenge</span></h2>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel !rounded-3xl p-10 text-center">
          <h3 className="text-5xl font-bold font-outfit mb-4">{totalCorrect}/{questions.length}</h3>
          <p className="text-xl text-slate-400 mb-6">{totalCorrect >= questions.length * 0.7 ? "Excellent work! 🔥" : totalCorrect >= questions.length * 0.4 ? "Good effort! Keep going 💪" : "Needs improvement. Revise weak topics!"}</p>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-6">
            <motion.div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${(totalCorrect / questions.length) * 100}%` }} transition={{ duration: 1 }} />
          </div>
          <button onClick={restart} className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto hover:opacity-90"><RotateCcw size={18} /> Try Again</button>
        </motion.div>
      </div>
    );
  }

  // Quiz Screen
  const question = questions[currentQ];
  const answered = answers[question.id] !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-outfit">Daily <span className="text-gradient">Challenge</span></h2>
        <div className="flex gap-3">
          <span className="glass-panel !rounded-full !py-2 !px-4 text-sm font-bold"><Zap size={14} className="inline text-yellow-400 mr-1" />{currentQ + 1} / {questions.length}</span>
          <button onClick={() => setShowForm(!showForm)} className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm hover:bg-white/10"><Plus size={14} /></button>
        </div>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addQuestion} className="glass-panel !rounded-2xl p-5 space-y-3">
          <div className="flex gap-3">
            <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white">
              <option value="pyq">📚 PYQ</option><option value="aptitude">🧮 Aptitude</option><option value="conceptual">🧠 Conceptual</option>
            </select>
          </div>
          <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Question..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30 resize-none h-16" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.optA} onChange={e => setForm({ ...form, optA: e.target.value })} placeholder="Option A" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
            <input value={form.optB} onChange={e => setForm({ ...form, optB: e.target.value })} placeholder="Option B" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
            <input value={form.optC} onChange={e => setForm({ ...form, optC: e.target.value })} placeholder="Option C" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
            <input value={form.optD} onChange={e => setForm({ ...form, optD: e.target.value })} placeholder="Option D" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Correct:</span>
            {["A", "B", "C", "D"].map((l, i) => (
              <button key={l} type="button" onClick={() => setForm({ ...form, correct: String(i) })}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${Number(form.correct) === i ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400'}`}>{l}</button>
            ))}
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold w-full hover:opacity-90">Save</button>
        </motion.form>
      )}

      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel !rounded-3xl p-8">
          <div className="flex gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-lg border ${question.type === 'pyq' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : question.type === 'aptitude' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
              {question.type === 'pyq' ? '📚 PYQ' : question.type === 'aptitude' ? '🧮 Aptitude' : '🧠 Conceptual'}
            </span>
            <span className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">{question.subject}</span>
          </div>
          <h3 className="text-xl font-bold mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let style = "bg-white/5 border-white/10 hover:bg-white/10";
              if (answered) {
                if (idx === question.correct) style = "bg-green-500/10 border-green-500/30 text-green-400";
                else if (idx === answers[question.id]) style = "bg-red-500/10 border-red-500/30 text-red-400";
                else style = "bg-white/5 border-white/10 opacity-50";
              }
              return (
                <button key={idx} onClick={() => selectAnswer(idx)} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${style}`}>
                  <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-sm font-bold shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="font-medium">{opt}</span>
                  {answered && idx === question.correct && <CheckCircle2 size={18} className="ml-auto text-green-400" />}
                  {answered && idx === answers[question.id] && idx !== question.correct && <XCircle size={18} className="ml-auto text-red-400" />}
                </button>
              );
            })}
          </div>
          {answered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-end">
              <button onClick={nextQ} className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90">
                {currentQ < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
