"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Plus, Trash2 } from "lucide-react";

interface TopicFrequency { id: string; topic: string; count: number; subject: string; }

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

export default function PYQAnalyzer() {
  const [data, setData] = useState<TopicFrequency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topic: "", count: "", subject: "" });

  useEffect(() => {
    const saved = localStorage.getItem("nexus_pyq_analysis");
    if (saved) { try { setData(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_pyq_analysis", JSON.stringify(data));
  }, [data]);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim() || !form.count || !form.subject.trim()) return;
    setData([...data, { id: crypto.randomUUID(), topic: form.topic.trim(), count: Number(form.count), subject: form.subject.trim() }]);
    setForm({ topic: "", count: "", subject: "" });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => setData(data.filter(d => d.id !== id));

  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-outfit">PYQ Pattern <span className="text-gradient">Analyzer</span></h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90"><Plus size={18} /> Add Topic</button>
      </div>
      <p className="text-slate-400">Track which GATE topics appear most frequently to prioritize your study.</p>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addEntry} className="glass-panel !rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject (e.g. OS)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Topic (e.g. Scheduling)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <input value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} placeholder="# Questions" type="number" className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90">Add</button>
        </motion.form>
      )}

      {data.length === 0 && (
        <div className="glass-panel !rounded-3xl p-12 text-center">
          <TrendingUp size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">No Data Yet</h3>
          <p className="text-slate-500">Add topic frequencies from GATE PYQ analysis to visualize which topics are asked most.</p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="glass-panel !rounded-3xl p-6">
          <h3 className="font-outfit font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-400" /> Topic Frequency</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={false} width={100} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {sorted.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <>
          <h3 className="text-xl font-bold font-outfit">🎯 Top Priority Topics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.slice(0, 6).map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-panel !rounded-2xl p-5 hover:!bg-white/[0.08] transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: COLORS[i % COLORS.length], filter: 'blur(20px)' }}></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-outfit" style={{ color: COLORS[i % COLORS.length] }}>{item.count}</span>
                      <button onClick={() => deleteEntry(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mt-2">{item.topic}</h4>
                  <p className="text-xs text-slate-500 mt-1">questions asked</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
