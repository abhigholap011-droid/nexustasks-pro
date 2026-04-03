"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, RotateCcw, AlertCircle, Plus, Trash2 } from "lucide-react";

interface PYQSubject {
  id: string;
  name: string;
  total: number;
  solved: number;
  needRevision: number;
}

export default function PYQTracker() {
  const [subjects, setSubjects] = useState<PYQSubject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", total: "" });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nexus_pyq_subjects");
    if (saved) { try { setSubjects(JSON.parse(saved)); } catch {} }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("nexus_pyq_subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.total) return;
    setSubjects([...subjects, { id: crypto.randomUUID(), name: form.name.trim(), total: Number(form.total), solved: 0, needRevision: 0 }]);
    setForm({ name: "", total: "" });
    setShowForm(false);
  };

  const markSolved = (id: string) => {
    setSubjects(subjects.map(s => s.id === id && s.solved < s.total ? { ...s, solved: s.solved + 1 } : s));
  };

  const markRevision = (id: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, needRevision: s.needRevision + 1 } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const totalSolved = subjects.reduce((a, s) => a + s.solved, 0);
  const totalPYQs = subjects.reduce((a, s) => a + s.total, 0);
  const totalRevision = subjects.reduce((a, s) => a + s.needRevision, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-outfit">PYQ Tracker <span className="text-gradient">System</span></h2>
        <div className="flex gap-3">
          {subjects.length > 0 && (
            <>
              <div className="glass-panel !rounded-full !py-2 !px-4 flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="font-bold">{totalSolved}</span>
                <span className="text-slate-400">Solved</span>
              </div>
              <div className="glass-panel !rounded-full !py-2 !px-4 flex items-center gap-2 text-sm">
                <RotateCcw size={16} className="text-yellow-400" />
                <span className="font-bold">{totalRevision}</span>
                <span className="text-slate-400">Revision</span>
              </div>
            </>
          )}
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </div>

      {/* Add Subject Form */}
      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addSubject}
          className="glass-panel !rounded-2xl p-5 flex flex-col sm:flex-row gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Subject name (e.g. DBMS)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <input value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} placeholder="Total PYQs (e.g. 120)" type="number"
            className="w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90">Save</button>
        </motion.form>
      )}

      {/* Overall Progress */}
      {subjects.length > 0 && (
        <div className="glass-panel !rounded-3xl p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 font-medium">Overall PYQ Progress</span>
            <span className="text-2xl font-bold font-outfit">{totalPYQs > 0 ? Math.round(totalSolved / totalPYQs * 100) : 0}%</span>
          </div>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${totalPYQs > 0 ? (totalSolved / totalPYQs) * 100 : 0}%` }} transition={{ duration: 1 }} />
          </div>
          <p className="text-sm text-slate-500 mt-2">{totalSolved} / {totalPYQs} questions solved across all subjects</p>
        </div>
      )}

      {/* Empty State */}
      {subjects.length === 0 && (
        <div className="glass-panel !rounded-3xl p-12 text-center">
          <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">No Subjects Added Yet</h3>
          <p className="text-slate-500">Click "Add Subject" to start tracking your GATE PYQ progress.</p>
        </div>
      )}

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, index) => {
          const remaining = subject.total - subject.solved;
          const pct = subject.total > 0 ? Math.round((subject.solved / subject.total) * 100) : 0;
          return (
            <motion.div key={subject.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              className="glass-panel !rounded-2xl p-5 hover:!bg-white/[0.08] transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <BookOpen size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{subject.name}</h4>
                    <p className="text-xs text-slate-500">{subject.total} total PYQs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold font-outfit ${pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{pct}%</span>
                  <button onClick={() => deleteSubject(subject.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 rounded transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div className={`h-full rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: index * 0.05 }} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-4">
                  <span className="text-green-400">✓ {subject.solved} solved</span>
                  <span className="text-slate-400">{remaining} remaining</span>
                  {subject.needRevision > 0 && <span className="text-yellow-400 flex items-center gap-1"><AlertCircle size={12} /> {subject.needRevision}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => markSolved(subject.id)} className="text-green-400 hover:bg-green-400/10 p-1.5 rounded-lg transition-colors" title="+1 Solved"><CheckCircle2 size={16} /></button>
                  <button onClick={() => markRevision(subject.id)} className="text-yellow-400 hover:bg-yellow-400/10 p-1.5 rounded-lg transition-colors" title="Need Revision"><RotateCcw size={16} /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
