"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";

interface SubjectStrength {
  id: string;
  name: string;
  score: number;
}

function getColor(score: number) {
  if (score >= 70) return { bg: "bg-green-500", text: "text-green-400", emoji: "🟢", label: "Strong" };
  if (score >= 45) return { bg: "bg-yellow-500", text: "text-yellow-400", emoji: "🟡", label: "Medium" };
  return { bg: "bg-red-500", text: "text-red-400", emoji: "🔴", label: "Weak" };
}

export default function SubjectHeatmap() {
  const [subjects, setSubjects] = useState<SubjectStrength[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", score: "" });

  useEffect(() => {
    const saved = localStorage.getItem("nexus_heatmap");
    if (saved) { try { setSubjects(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_heatmap", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.score) return;
    setSubjects([...subjects, { id: crypto.randomUUID(), name: form.name.trim(), score: Math.min(100, Math.max(0, Number(form.score))) }]);
    setForm({ name: "", score: "" });
    setShowForm(false);
  };

  const updateScore = (id: string, newScore: number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, score: Math.min(100, Math.max(0, newScore)) } : s));
  };

  const sorted = [...subjects].sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-outfit">Subject Difficulty <span className="text-gradient">Heatmap</span></h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90"><Plus size={18} /> Add Subject</button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addSubject} className="glass-panel !rounded-2xl p-5 flex flex-col sm:flex-row gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Subject (e.g. OS)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <input value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} placeholder="Score 0-100" type="number" min={0} max={100} className="w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90">Save</button>
        </motion.form>
      )}

      {subjects.length > 0 && (
        <div className="flex gap-6 text-sm">
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-500"></span> Strong (70%+)</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-500"></span> Medium (45-69%)</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-500"></span> Weak (&lt;45%)</span>
        </div>
      )}

      {subjects.length === 0 && (
        <div className="glass-panel !rounded-3xl p-12 text-center">
          <Flame size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">No Subjects Added</h3>
          <p className="text-slate-500">Add your GATE subjects with your current confidence score (0-100) to see a visual heatmap.</p>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {subjects.map((subject, i) => {
            const color = getColor(subject.score);
            return (
              <motion.div key={subject.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="glass-panel !rounded-2xl p-4 text-center hover:!scale-105 transition-transform relative overflow-hidden">
                <div className={`absolute inset-0 ${color.bg} opacity-[0.08]`}></div>
                <div className="relative z-10">
                  <p className="text-2xl mb-1">{color.emoji}</p>
                  <p className="font-bold text-sm">{subject.name}</p>
                  <p className={`text-2xl font-outfit font-bold mt-1 ${color.text}`}>{subject.score}%</p>
                  <p className="text-xs text-slate-500 mt-1">{color.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {sorted.length > 0 && (
        <div className="glass-panel !rounded-3xl p-6">
          <h3 className="font-outfit font-bold text-xl mb-4">Priority Focus Order (Weakest First)</h3>
          <div className="space-y-3">
            {sorted.map((subject, i) => {
              const color = getColor(subject.score);
              return (
                <motion.div key={subject.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4">
                  <span className="text-slate-500 font-mono text-sm w-6">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{subject.name}</span>
                      <div className="flex items-center gap-2">
                        <input type="range" min={0} max={100} value={subject.score} onChange={e => updateScore(subject.id, Number(e.target.value))} className="w-20 accent-blue-500" />
                        <span className={`font-bold ${color.text} w-10 text-right`}>{subject.score}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${color.bg}`} initial={{ width: 0 }} animate={{ width: `${subject.score}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
