"use client";
import { useState } from "react";

const saisons = ["2023-2024", "2022-2023", "2021-2022"];

const statsData = {
  "2023-2024": {
    matchs: 24, pts: 18.4, reb: 7.2, ast: 3.1, blk: 1.4, stl: 1.2, eval: 22.1,
    evolution: [15, 22, 18, 25, 12, 19, 23, 18, 22, 15, 25, 18],
    dernierMatchs: [
      { adversaire: "USFA Basket", date: "28 Sep", resultat: "V", score: "78-65", pts: 22, reb: 9, ast: 4, eval: 28 },
      { adversaire: "AS Douanes BF", date: "21 Sep", resultat: "D", score: "60-71", pts: 15, reb: 6, ast: 2, eval: 17 },
      { adversaire: "Étoile Filante", date: "14 Sep", resultat: "V", score: "82-77", pts: 25, reb: 10, ast: 5, eval: 32 },
      { adversaire: "Bobo Sport", date: "7 Sep", resultat: "V", score: "69-58", pts: 18, reb: 7, ast: 3, eval: 24 },
      { adversaire: "RC Koudougou", date: "31 Aoû", resultat: "V", score: "74-61", pts: 12, reb: 4, ast: 2, eval: 15 },
    ],
  },
  "2022-2023": {
    matchs: 22, pts: 15.2, reb: 5.8, ast: 2.7, blk: 0.9, stl: 0.8, eval: 17.4,
    evolution: [12, 16, 14, 20, 15, 13, 18, 14, 19, 11, 16, 14],
    dernierMatchs: [
      { adversaire: "USFA Basket", date: "Juin", resultat: "V", score: "80-70", pts: 19, reb: 8, ast: 3, eval: 24 },
      { adversaire: "AS Douanes BF", date: "Mai", resultat: "V", score: "65-60", pts: 14, reb: 5, ast: 2, eval: 17 },
      { adversaire: "Étoile Filante", date: "Avr", resultat: "D", score: "55-68", pts: 11, reb: 4, ast: 1, eval: 12 },
      { adversaire: "Bobo Sport", date: "Mar", resultat: "V", score: "72-58", pts: 20, reb: 7, ast: 4, eval: 26 },
    ],
  },
  "2021-2022": {
    matchs: 18, pts: 11.5, reb: 4.3, ast: 1.9, blk: 0.6, stl: 0.5, eval: 13.2,
    evolution: [9, 12, 10, 14, 11, 8, 13, 10, 14, 9, 12, 11],
    dernierMatchs: [
      { adversaire: "Étoile Filante", date: "Juin", resultat: "D", score: "58-72", pts: 13, reb: 5, ast: 2, eval: 15 },
      { adversaire: "USFA Basket", date: "Mai", resultat: "V", score: "68-55", pts: 16, reb: 6, ast: 2, eval: 20 },
      { adversaire: "AS Douanes BF", date: "Avr", resultat: "V", score: "60-52", pts: 10, reb: 3, ast: 1, eval: 11 },
    ],
  },
};

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function StatistiquesPage() {
  const [saison, setSaison] = useState("2023-2024");
  const d = statsData[saison as keyof typeof statsData];
  const maxPts = Math.max(...d.evolution);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-10 py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1">Statistiques</h1>
          <p className="text-sm text-foreground/50 font-medium">Performance individuelle saison par saison</p>
        </div>
        <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
          {saisons.map((s) => (
            <button
              key={s}
              onClick={() => setSaison(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                saison === s
                  ? "bg-white dark:bg-gray-800 text-foreground shadow-sm"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Key stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Matchs", value: d.matchs, unit: "" },
          { label: "Points / match", value: d.pts, unit: "" },
          { label: "Rebonds / match", value: d.reb, unit: "" },
          { label: "Évaluation", value: d.eval, unit: "" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">{s.label}</p>
            <p className="text-3xl font-black tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Chart — points evolution */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-base">Points par match</h2>
              <p className="text-xs text-foreground/40 font-medium mt-0.5">Évolution sur la saison {saison}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground/40 font-medium">Moyenne</p>
              <p className="text-lg font-black text-foreground">{d.pts}</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-28">
            {d.evolution.map((val, i) => {
              const heightPct = (val / maxPts) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-bold text-foreground/0 group-hover:text-foreground/60 transition-colors tabular-nums">
                    {val}
                  </span>
                  <div className="w-full relative rounded-t-md overflow-hidden" style={{ height: "88px" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-foreground/10 dark:bg-gray-700/50 rounded-t-sm transition-all duration-500"
                      style={{ height: "100%" }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-foreground dark:bg-white rounded-t-sm transition-all duration-700 group-hover:opacity-80"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-foreground/30 font-medium">{MONTHS[i]}</span>
                </div>
              );
            })}
          </div>

          {/* Average line label */}
          <div className="mt-4 pt-4 border-t border-card-border flex items-center gap-2">
            <div className="w-6 h-px bg-foreground/30 border-dashed border-t border-foreground/30" />
            <span className="text-[11px] text-foreground/40 font-medium">Moy. {d.pts} pts · Max {maxPts} pts</span>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="card p-6 flex flex-col justify-between">
          <h2 className="font-black text-base mb-5">Autres statistiques</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Passes décisives", value: d.ast, max: 10 },
              { label: "Rebonds", value: d.reb, max: 15 },
              { label: "Contres", value: d.blk, max: 5 },
              { label: "Interceptions", value: d.stl, max: 5 },
            ].map((r) => {
              const pct = Math.min(100, Math.round((r.value / r.max) * 100));
              return (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground/60">{r.label}</span>
                    <span className="text-xs font-black tabular-nums">{r.value}</span>
                  </div>
                  <div className="h-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-1 rounded-full bg-foreground transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Match history table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border">
          <h2 className="font-black text-base">Derniers matchs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border bg-gray-50 dark:bg-gray-900/30">
                <th className="text-left py-3 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Adversaire</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Date</th>
                <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Score</th>
                <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">PTS</th>
                <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">REB</th>
                <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">AST</th>
                <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">EVAL</th>
              </tr>
            </thead>
            <tbody>
              {d.dernierMatchs.map((m, i) => (
                <tr
                  key={i}
                  className="border-b border-card-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-sm">{m.adversaire}</td>
                  <td className="py-4 px-4 text-sm text-foreground/50">{m.date}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.resultat === "V" ? "bg-accent" : "bg-red-400"}`} />
                      {m.score}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-black">{m.pts}</td>
                  <td className="py-4 px-4 text-center text-sm text-foreground/60">{m.reb}</td>
                  <td className="py-4 px-4 text-center text-sm text-foreground/60">{m.ast}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-black">{m.eval}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
