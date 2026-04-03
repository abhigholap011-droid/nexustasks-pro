"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Target } from "lucide-react";

export default function RankPrediction() {
  const [marks, setMarks] = useState(52);
  const [accuracy, setAccuracy] = useState(65);
  const [speed, setSpeed] = useState(70);

  // Simple prediction formula (illustrative)
  const score = marks;
  let predictedRankLow: number, predictedRankHigh: number;
  const factor = (100 - accuracy) * 50 + (100 - speed) * 30;

  if (score >= 70) { predictedRankLow = 100; predictedRankHigh = 500; }
  else if (score >= 60) { predictedRankLow = 500; predictedRankHigh = 2000; }
  else if (score >= 50) { predictedRankLow = 2000; predictedRankHigh = 5000; }
  else if (score >= 40) { predictedRankLow = 5000; predictedRankHigh = 10000; }
  else if (score >= 30) { predictedRankLow = 10000; predictedRankHigh = 20000; }
  else { predictedRankLow = 20000; predictedRankHigh = 50000; }

  // Adjust by accuracy/speed
  const adjustmentFactor = ((accuracy + speed) / 200);
  predictedRankLow = Math.round(predictedRankLow / adjustmentFactor);
  predictedRankHigh = Math.round(predictedRankHigh / adjustmentFactor);

  const getQualification = () => {
    if (score >= 25) return { status: "Likely to Qualify", color: "text-green-400" };
    return { status: "Below Cutoff", color: "text-red-400" };
  };

  const qual = getQualification();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-outfit">Rank <span className="text-gradient">Prediction</span></h2>
      <p className="text-slate-400">Estimate your GATE rank based on mock test performance.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Marks Input */}
        <div className="glass-panel !rounded-3xl p-6 text-center">
          <Target size={28} className="text-blue-400 mx-auto mb-3" />
          <h4 className="font-bold mb-4">Score (out of 100)</h4>
          <input type="range" min={0} max={100} value={marks} onChange={e => setMarks(Number(e.target.value))}
            className="w-full accent-blue-500 mb-2" />
          <p className="text-4xl font-bold font-outfit text-blue-400">{marks}</p>
        </div>

        {/* Accuracy Input */}
        <div className="glass-panel !rounded-3xl p-6 text-center">
          <Award size={28} className="text-purple-400 mx-auto mb-3" />
          <h4 className="font-bold mb-4">Accuracy %</h4>
          <input type="range" min={0} max={100} value={accuracy} onChange={e => setAccuracy(Number(e.target.value))}
            className="w-full accent-purple-500 mb-2" />
          <p className="text-4xl font-bold font-outfit text-purple-400">{accuracy}%</p>
        </div>

        {/* Speed Input */}
        <div className="glass-panel !rounded-3xl p-6 text-center">
          <TrendingUp size={28} className="text-green-400 mx-auto mb-3" />
          <h4 className="font-bold mb-4">Speed %</h4>
          <input type="range" min={0} max={100} value={speed} onChange={e => setSpeed(Number(e.target.value))}
            className="w-full accent-green-500 mb-2" />
          <p className="text-4xl font-bold font-outfit text-green-400">{speed}%</p>
        </div>
      </div>

      {/* Prediction Result */}
      <motion.div 
        key={`${marks}-${accuracy}-${speed}`}
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel !rounded-3xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        <div className="relative z-10">
          <h3 className="text-lg text-slate-400 mb-2">Predicted GATE Rank</h3>
          <p className="text-6xl font-bold font-outfit text-gradient mb-4">
            {predictedRankLow.toLocaleString()} - {predictedRankHigh.toLocaleString()}
          </p>
          <p className={`text-xl font-bold ${qual.color}`}>{qual.status}</p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-blue-400 font-bold text-lg">{marks}/100</p>
              <p>Score</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-purple-400 font-bold text-lg">{accuracy}%</p>
              <p>Accuracy</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-green-400 font-bold text-lg">{speed}%</p>
              <p>Speed</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
