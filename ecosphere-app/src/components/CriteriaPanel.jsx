import React, { useEffect, useState } from 'react';
import { useESG } from '../context/useESG';

const STORAGE_KEY = 'ecosphere-criteria';

const DEFAULT_CRITERIA = [
  { id: 1, title: 'Coding Standards', weight: 8, desc: 'Maintain consistent code quality and linting.' },
  { id: 2, title: 'Logic', weight: 8, desc: 'Correctness and robustness of core algorithms.' },
  { id: 3, title: 'Modularity', weight: 7, desc: 'Separation of concerns and reusability.' },
  { id: 4, title: 'Database Design', weight: 7, desc: 'Schema quality, normalization and indexes.' },
  { id: 5, title: 'Frontend Design', weight: 7, desc: 'UI clarity, accessibility and responsiveness.' },
  { id: 6, title: 'Performance', weight: 6, desc: 'Runtime and loading performance.' },
  { id: 7, title: 'Scalability', weight: 6, desc: 'Ability to scale with load and data.' },
  { id: 8, title: 'Security', weight: 9, desc: 'Protection against common vulnerabilities.' },
  { id: 9, title: 'Usability', weight: 8, desc: 'Ease of use and discoverability.' },
];

export default function CriteriaPanel() {
  const { setRecentNotification } = useESG();
  const [criteria, setCriteria] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_CRITERIA;
    } catch (e) {
      return DEFAULT_CRITERIA;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(criteria));
    } catch (e) {
      // ignore
    }
  }, [criteria]);

  const updateWeight = (id, value) => setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight: Number(value) } : c)));
  const updateDesc = (id, value) => setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, desc: value } : c)));

  const resetDefaults = () => {
    setCriteria(DEFAULT_CRITERIA);
    setRecentNotification({ type: 'approval', message: 'Judging criteria reset to defaults.' });
  };

  const save = () => {
    setRecentNotification({ type: 'approval', message: 'Judging criteria saved.' });
  };

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Judging Criteria</p>
          <p className="mt-1 text-xs text-slate-500">Adjust weights and descriptions for evaluation.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefaults} className="rounded-2xl px-3 py-1 text-xs bg-slate-800/70 hover:bg-slate-700">Reset</button>
          <button onClick={save} className="rounded-2xl px-3 py-1 text-xs bg-emerald-500 text-slate-900 hover:bg-emerald-400">Save</button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {criteria.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-800/60 bg-slate-900/50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-100">{c.title}</p>
                <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-300">Weight {c.weight}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input type="range" min="1" max="10" value={c.weight} onChange={(e) => updateWeight(c.id, e.target.value)} className="w-full" />
              <input value={c.desc} onChange={(e) => updateDesc(c.id, e.target.value)} className="ml-2 w-48 rounded-md bg-slate-800/60 px-2 py-1 text-xs text-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
