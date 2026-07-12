import ESGScene from './components/ESGScene';
import NotificationGuide from './components/NotificationGuide';
import { useESG } from './context/useESG';

const rewardItems = [
  { name: 'Solar Desk Lamp', cost: 180, emoji: '🔆' },
  { name: 'Tree Planting Sponsorship', cost: 220, emoji: '🌳' },
  { name: 'Eco Coffee Flask', cost: 320, emoji: '☕' },
  { name: 'Wellness Day Pass', cost: 380, emoji: '🧘' },
  { name: 'Community Garden Kit', cost: 450, emoji: '🪴' },
  { name: 'Bike Commuter Voucher', cost: 520, emoji: '🚲' },
  { name: 'Green Tech Headset', cost: 620, emoji: '🎧' },
  { name: 'Sustainable Lunch Box', cost: 700, emoji: '🥗' },
  { name: 'Premium Plant Subscription', cost: 780, emoji: '🪴' },
  { name: 'Volunteer Day Credit', cost: 850, emoji: '🤝' },
];

function App() {
  const {
    settings,
    setSettings,
    departments,
    userXP,
    setUserXP,
    unlockedBadges,
    complianceIssues,
    overallScore,
    redeemReward,
    recentNotification,
    setRecentNotification,
  } = useESG();

  const scoreTone = overallScore >= 80 ? 'text-emerald-400' : overallScore >= 60 ? 'text-cyan-400' : 'text-amber-400';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      {recentNotification && (
        <NotificationGuide
          message={recentNotification.message}
          type={recentNotification.type}
          onDismiss={() => setRecentNotification(null)}
        />
      )}

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[28px] border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">EcoSphere • Enterprise ESG Command Center</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">A futuristic workspace for sustainability, compliance, and motivation.</h1>
              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                Live carbon intelligence, governance visibility, and premium employee engagement all in one cinematic control room.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">XP balance</p>
                <p className="text-2xl font-black text-amber-400">{userXP}</p>
              </div>
              <button
                onClick={() => setUserXP((prev) => prev + 60)}
                className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                + Complete Challenge (+60 XP)
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Weighted ESG intelligence</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-100">Dynamic organization score</h2>
                  <p className="mt-3 text-sm text-slate-400">
                    Environmental at 40%, social at 30%, and governance at 30% combine into a living health score for your enterprise.
                  </p>
                </div>
                <div className="flex items-center gap-5 rounded-3xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-slate-800"
                    style={{ background: `conic-gradient(#34d399 ${overallScore * 3.6}deg, rgba(15,23,42,0.95) 0deg)` }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/95">
                      <span className={`text-3xl font-black ${scoreTone}`}>{overallScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Live signal</p>
                    <p className={`text-xl font-black ${scoreTone}`}>{overallScore >= 80 ? 'Thriving' : overallScore >= 60 ? 'Stable' : 'Needs attention'}</p>
                    <p className="mt-2 text-xs text-slate-500">Auto-calculated from {departments.length} active departments</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {departments.map((dept) => (
                  <div key={dept.id} className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-200">{dept.name}</p>
                      <span className="text-sm font-bold text-emerald-400">{Math.round((dept.env + dept.soc + dept.gov) / 3)}</span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-slate-400">
                      <div className="flex justify-between"><span>Env</span><span className="text-emerald-400">{dept.env}%</span></div>
                      <div className="flex justify-between"><span>Soc</span><span className="text-cyan-400">{dept.soc}%</span></div>
                      <div className="flex justify-between"><span>Gov</span><span className="text-purple-400">{dept.gov}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">3D ecosystem monitor</p>
                  <h3 className="text-xl font-bold text-slate-100">Real-time environmental pulse</h3>
                </div>
                <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${overallScore >= 70 ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>
                  {settings.autoEmissionCalc ? 'Auto-emissions active' : 'Manual review'}
                </div>
              </div>
              <ESGScene score={overallScore} />
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Governance logs</p>
                  <h3 className="text-xl font-bold text-slate-100">Compliance watchlist</h3>
                </div>
                <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">
                  {complianceIssues.length} active issues
                </span>
              </div>
              <div className="space-y-3">
                {complianceIssues.map((issue) => (
                  <div key={issue.id} className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-200">{issue.desc}</p>
                        <p className="mt-1 text-xs text-slate-400">Owner: {issue.owner} • Due {issue.dueDate}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${issue.status === 'Overdue' ? 'border border-rose-400/30 bg-rose-400/10 text-rose-300' : 'border border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">System controls</p>
                <h3 className="text-xl font-bold text-slate-100">Operational rules</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Auto emission math', description: 'Derive carbon metrics from active pipelines', key: 'autoEmissionCalc' },
                  { label: 'Evidence validation', description: 'Require proof before compliance approval', key: 'evidenceRequired' },
                  { label: 'Badge auto-award', description: 'Unlock achievements the moment milestones are met', key: 'badgeAutoAward' },
                ].map((item) => (
                  <label key={item.key} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/70 p-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(event) => setSettings((prev) => ({ ...prev, [item.key]: event.target.checked }))}
                      className="mt-1 h-4 w-4 accent-emerald-400"
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-[28px] border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Gamified storefront</p>
              <h3 className="text-xl font-bold text-slate-100">Redeem XP for meaningful rewards</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.map((badge, index) => (
                <span key={`${badge}-${index}`} className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  🏅 {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {rewardItems.map((item) => {
              const canAfford = userXP >= item.cost;
              return (
                <button
                  key={item.name}
                  onClick={() => redeemReward(item.name, item.cost)}
                  disabled={!canAfford}
                  className={`rounded-2xl border p-4 text-left transition ${canAfford ? 'border-slate-700/70 bg-slate-950/70 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-800/80' : 'cursor-not-allowed border-slate-800 bg-slate-950/40 opacity-60'}`}
                >
                  <div className="mb-3 text-3xl">{item.emoji}</div>
                  <p className="font-semibold text-slate-200">{item.name}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.cost} XP</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;