"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function StudyRecommendation() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-outfit">Smart Study <span className="text-gradient">Recommendations</span></h2>
      <p className="text-slate-400">AI-powered suggestions will appear here as you add data to other modules.</p>

      <div className="glass-panel !rounded-3xl p-12 text-center">
        <Sparkles size={48} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold font-outfit mb-2">Getting Smarter...</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Start adding subjects to the <strong>Heatmap</strong>, topics to the <strong>Revision Scheduler</strong>, and PYQs to the <strong>PYQ Tracker</strong>. 
          AI will analyze your data and provide personalized study recommendations.
        </p>
        <div className="mt-8 space-y-3 text-left max-w-lg mx-auto">
          <div className="glass-panel !rounded-xl p-4 border-l-4 border-l-blue-500/30 opacity-50">
            <p className="text-sm text-slate-500 italic">💡 "Complete the Subject Heatmap to unlock weak-area recommendations."</p>
          </div>
          <div className="glass-panel !rounded-xl p-4 border-l-4 border-l-purple-500/30 opacity-50">
            <p className="text-sm text-slate-500 italic">🔁 "Add revision topics to get spaced-repetition reminders."</p>
          </div>
          <div className="glass-panel !rounded-xl p-4 border-l-4 border-l-green-500/30 opacity-50">
            <p className="text-sm text-slate-500 italic">📊 "Track PYQ patterns to prioritize high-frequency topics."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
