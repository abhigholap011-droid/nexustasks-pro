"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Calendar, Bell, CheckCircle2, Plus } from "lucide-react";

interface RevisionItem {
  id: string;
  subject: string;
  topic: string;
  studiedDate: string;
  nextRevision: string;
  interval: number;
  completed: boolean;
}

const INTERVALS = [1, 3, 7, 15, 30];

export default function SmartRevision() {
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nexus_revisions");
    if (saved) { try { setRevisions(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_revisions", JSON.stringify(revisions));
  }, [revisions]);

  const markDone = (id: string) => {
    setRevisions(revisions.map(r => {
      if (r.id === id) {
        const currentIdx = INTERVALS.indexOf(r.interval);
        const nextIdx = Math.min(currentIdx + 1, INTERVALS.length - 1);
        const nextInterval = INTERVALS[nextIdx];
        const today = new Date();
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + nextInterval);
        return { ...r, completed: true, interval: nextInterval, nextRevision: nextDate.toISOString().split("T")[0] };
      }
      return r;
    }));
  };

  const addTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTopic.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    setRevisions([{ id: crypto.randomUUID(), subject: newSubject.trim(), topic: newTopic.trim(), studiedDate: today, nextRevision: tomorrow.toISOString().split("T")[0], interval: 1, completed: false }, ...revisions]);
    setNewSubject(""); setNewTopic("");
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const dueToday = revisions.filter(r => !r.completed && r.nextRevision <= todayStr);
  const upcoming = revisions.filter(r => !r.completed && r.nextRevision > todayStr);
  const completed = revisions.filter(r => r.completed);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-outfit">Smart <span className="text-gradient">Revision</span> Algorithm</h2>
      <p className="text-slate-400">Spaced repetition scheduler — Day 1 → Day 3 → Day 7 → Day 15 → Day 30</p>

      <form onSubmit={addTopic} className="glass-panel !rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject (e.g. OS)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors placeholder:text-white/30" />
        <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Topic (e.g. Deadlock)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors placeholder:text-white/30" />
        <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"><Plus size={18} /> Add Topic</button>
      </form>

      {revisions.length === 0 && (
        <div className="glass-panel !rounded-3xl p-12 text-center">
          <RotateCcw size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">No Revision Topics Yet</h3>
          <p className="text-slate-500">Add a topic you studied today. The app will auto-schedule revisions at Day 1, 3, 7, 15, and 30.</p>
        </div>
      )}

      {dueToday.length > 0 && (
        <div>
          <h3 className="text-xl font-bold font-outfit mb-3 flex items-center gap-2"><Bell size={20} className="text-red-400 animate-pulse" /> Due Today ({dueToday.length})</h3>
          <div className="space-y-3">
            {dueToday.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-panel !rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-red-500 hover:!bg-white/[0.08] transition-all">
                <div className="flex items-center gap-4">
                  <RotateCcw size={20} className="text-yellow-400" />
                  <div><p className="font-bold">{item.topic}</p><p className="text-sm text-slate-400">{item.subject} • Interval: Day {item.interval}</p></div>
                </div>
                <button onClick={() => markDone(item.id)} className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl font-bold hover:bg-green-500/20 transition-colors flex items-center gap-2"><CheckCircle2 size={16} /> Revised</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xl font-bold font-outfit mb-3 flex items-center gap-2"><Calendar size={20} className="text-blue-400" /> Upcoming ({upcoming.length})</h3>
          <div className="space-y-2">
            {upcoming.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="glass-panel !rounded-xl p-4 flex items-center justify-between hover:!bg-white/[0.06] transition-all">
                <div className="flex items-center gap-4"><Calendar size={18} className="text-slate-500" /><div><p className="font-medium">{item.topic}</p><p className="text-sm text-slate-500">{item.subject}</p></div></div>
                <div className="text-right"><p className="text-sm font-bold text-blue-400">{item.nextRevision}</p><p className="text-xs text-slate-500">Next: Day {item.interval}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="opacity-60">
          <h3 className="text-lg font-bold font-outfit mb-3 text-green-400">✓ Completed ({completed.length})</h3>
          <div className="space-y-2">
            {completed.slice(0, 5).map(item => (
              <div key={item.id} className="glass-panel !rounded-xl p-3 flex items-center gap-3 line-through text-slate-500"><CheckCircle2 size={16} className="text-green-500" /><span>{item.subject} – {item.topic}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
