"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, Plus, Trash2 } from "lucide-react";

interface SyllabusTopic { id: string; name: string; completed: boolean; }
interface SyllabusSubject { id: string; name: string; topics: SyllabusTopic[]; }

export default function SyllabusTracker() {
  const [syllabus, setSyllabus] = useState<SyllabusSubject[]>([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nexus_syllabus");
    if (saved) { try { setSyllabus(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_syllabus", JSON.stringify(syllabus));
  }, [syllabus]);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setSyllabus([...syllabus, { id: crypto.randomUUID(), name: newSubject.trim(), topics: [] }]);
    setNewSubject(""); setShowSubjectForm(false);
  };

  const addTopicToSubject = (subjectId: string) => {
    if (!newTopic.trim()) return;
    setSyllabus(syllabus.map(s => s.id === subjectId ? { ...s, topics: [...s.topics, { id: crypto.randomUUID(), name: newTopic.trim(), completed: false }] } : s));
    setNewTopic(""); setAddingTopicTo(null);
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    setSyllabus(syllabus.map(s => s.id === subjectId ? { ...s, topics: s.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t) } : s));
  };

  const deleteSubject = (id: string) => setSyllabus(syllabus.filter(s => s.id !== id));

  const totalTopics = syllabus.reduce((a, s) => a + s.topics.length, 0);
  const completedTopics = syllabus.reduce((a, s) => a + s.topics.filter(t => t.completed).length, 0);
  const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-outfit">GATE Syllabus <span className="text-gradient">Progress</span></h2>
        <button onClick={() => setShowSubjectForm(!showSubjectForm)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90"><Plus size={18} /> Add Subject</button>
      </div>

      {showSubjectForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addSubject} className="glass-panel !rounded-2xl p-4 flex gap-3">
          <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject name (e.g. Operating System)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 placeholder:text-white/30" />
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90">Add</button>
        </motion.form>
      )}

      {syllabus.length > 0 && (
        <div className="glass-panel !rounded-3xl p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400">Overall Syllabus Completion</span>
            <span className="text-3xl font-bold font-outfit text-gradient">{overallPct}%</span>
          </div>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 1 }} />
          </div>
          <p className="text-sm text-slate-500 mt-2">{completedTopics} / {totalTopics} topics completed</p>
        </div>
      )}

      {syllabus.length === 0 && (
        <div className="glass-panel !rounded-3xl p-12 text-center">
          <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-outfit mb-2">No Syllabus Added</h3>
          <p className="text-slate-500">Add your GATE CSE subjects and their topics to track your preparation progress.</p>
        </div>
      )}

      <div className="space-y-4">
        {syllabus.map((subject, si) => {
          const done = subject.topics.filter(t => t.completed).length;
          const pct = subject.topics.length > 0 ? Math.round((done / subject.topics.length) * 100) : 0;
          return (
            <motion.div key={subject.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.04 }}
              className="glass-panel !rounded-2xl p-5 group">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-blue-400" />
                  <h4 className="font-bold text-lg">{subject.name}</h4>
                  <span className="text-xs text-slate-500">({subject.topics.length} topics)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold font-outfit ${pct === 100 ? 'text-green-400' : 'text-slate-300'}`}>{pct}%</span>
                  <button onClick={() => deleteSubject(subject.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 rounded transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              {subject.topics.length > 0 && (
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : 'bg-blue-500'}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {subject.topics.map(topic => (
                  <button key={topic.id} onClick={() => toggleTopic(subject.id, topic.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all text-sm ${topic.completed ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {topic.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    <span className={topic.completed ? 'line-through' : ''}>{topic.name}</span>
                  </button>
                ))}
              </div>
              {addingTopicTo === subject.id ? (
                <div className="flex gap-2">
                  <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Topic name..." autoFocus onKeyDown={e => e.key === "Enter" && addTopicToSubject(subject.id)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500 placeholder:text-white/30 text-sm" />
                  <button onClick={() => addTopicToSubject(subject.id)} className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-500/30">Add</button>
                  <button onClick={() => { setAddingTopicTo(null); setNewTopic(""); }} className="text-slate-500 px-3 py-2 rounded-xl text-sm hover:bg-white/5">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setAddingTopicTo(subject.id)} className="text-sm text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors"><Plus size={14} /> Add topic</button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
