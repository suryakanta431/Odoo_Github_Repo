import { useMemo, useState } from 'react';
import ESGScene from './components/ESGScene';
import NotificationGuide from './components/NotificationGuide';
import CriteriaPanel from './components/CriteriaPanel';
import { useESG } from './context/useESG';
import { formatDateForExport, validateEvidenceFile } from './context/esgLogic';

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
    unlockedBadges,
    complianceIssues,
    overallScore,
    redeemReward,
    recentNotification,
    setRecentNotification,
    redeemedRewards,
    challengeStatus,
    submissionModalOpen,
    pendingSubmission,
    submitChallenge,
    attachEvidenceAndSubmit,
    closeSubmissionModal,
    updateIssueStatus,
    addComplianceIssue,
    refreshLiveMetrics,
    lastSyncedAt,
  } = useESG();

  const [dragActive, setDragActive] = useState(false);
  const [newIssueForm, setNewIssueForm] = useState({ desc: '', owner: '', dueDate: '', priority: 'High' });
  const [issueFormError, setIssueFormError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const scoreTone = overallScore >= 80 ? 'text-emerald-400' : overallScore >= 60 ? 'text-cyan-400' : 'text-amber-400';
  const dataCoverage = Math.min(98, 80 + departments.length * 6 + (settings.autoEmissionCalc ? 4 : 0));
  const automationLevel = settings.autoEmissionCalc && settings.evidenceRequired ? 92 : settings.autoEmissionCalc ? 84 : 71;
  const participationMomentum = Math.min(99, 72 + Math.round(userXP / 120));
  const lastSyncLabel = useMemo(() => {
    if (!lastSyncedAt) return 'Never synced';
    return new Date(lastSyncedAt).toLocaleString();
  }, [lastSyncedAt]);

  const complianceSummary = useMemo(() => {
    const open = complianceIssues.filter((issue) => issue.status === 'Open').length;
    const overdue = complianceIssues.filter((issue) => issue.status === 'Overdue').length;
    const resolved = complianceIssues.filter((issue) => issue.status === 'Resolved').length;
    return { open, overdue, resolved };
  }, [complianceIssues]);

  const formatDisplayDate = (value) => {
    if (!value) return 'No date set';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const platformPillars = [
    {
      title: 'Unify data',
      icon: '🧩',
      body: 'Link operations, compliance, and employee participation into a single live ESG control tower.',
      metric: `${dataCoverage}% coverage`,
      accent: 'from-emerald-500/20 to-emerald-400/5',
    },
    {
      title: 'Automate tracking',
      icon: '⚙️',
      body: 'Convert operational records into carbon insights and governance reporting with automated workflows.',
      metric: `${automationLevel}% automated`,
      accent: 'from-cyan-500/20 to-cyan-400/5',
    },
    {
      title: 'Drive engagement',
      icon: '🎯',
      body: 'Use challenges, XP, badges, and rewards to turn ESG participation into daily habit.',
      metric: `${participationMomentum}% participation`,
      accent: 'from-amber-500/20 to-amber-400/5',
    },
    {
      title: 'Report with confidence',
      icon: '📈',
      body: 'Deliver clear sustainability snapshots for leadership, auditors, and field teams.',
      metric: 'Board-ready insights',
      accent: 'from-fuchsia-500/20 to-fuchsia-400/5',
    },
  ];

  const handleChallengeSubmit = () => {
    const result = submitChallenge();
    if (result === 'evidence-required') {
      setUploadError('');
      setSelectedFileName('');
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    const validation = validateEvidenceFile(file);
    if (!validation.isValid) {
      setUploadError(validation.reason);
      setSelectedFileName('');
      return;
    }

    setUploadError('');
    setSelectedFileName(file.name);
    attachEvidenceAndSubmit(file.name);
  };

  const handleAddComplianceIssue = (event) => {
    event.preventDefault();

    if (!newIssueForm.desc.trim() || !newIssueForm.owner.trim() || !newIssueForm.dueDate) {
      setIssueFormError('Please add a title, owner, and due date before saving.');
      return;
    }

    addComplianceIssue({
      desc: newIssueForm.desc.trim(),
      owner: newIssueForm.owner.trim(),
      dueDate: newIssueForm.dueDate,
      priority: newIssueForm.priority,
    });

    setNewIssueForm({ desc: '', owner: '', dueDate: '', priority: 'High' });
    setIssueFormError('');
  };

  const handleExportSnapshot = () => {
    // Export a human-friendly CSV snapshot that includes top-level metrics and judging criteria if present
    const criteriaRaw = window.localStorage.getItem('ecosphere-criteria');
    const criteria = criteriaRaw ? JSON.parse(criteriaRaw) : [];

    const rows = [];
    rows.push(['Snapshot generated', new Date().toISOString()]);
    rows.push(['Overall score', overallScore]);
    rows.push(['User XP', userXP]);
    rows.push(['Data coverage', dataCoverage]);
    rows.push(['Automation', automationLevel]);
    rows.push([]);
    rows.push(['Departments']);
    rows.push(['Name', 'Env', 'Soc', 'Gov']);
    departments.forEach((d) => rows.push([d.name, d.env, d.soc, d.gov]));
    rows.push([]);
    rows.push(['Compliance issues']);
    rows.push(['Desc', 'Owner', 'Due', 'Status']);
    complianceIssues.forEach((i) => rows.push([i.desc, i.owner, formatDateForExport(i.dueDate), i.status]));
    rows.push([]);
    if (criteria.length) {
      rows.push(['Judging criteria']);
      rows.push(['Title', 'Weight', 'Description']);
      criteria.forEach((c) => rows.push([c.title, c.weight, c.desc]));
    }

    const csv = `\uFEFF${rows.map((r) => r.map((cell) => `"${String(cell ?? '')}"`).join(',')).join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecosphere-snapshot-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setRecentNotification({ type: 'approval', message: 'Snapshot exported as CSV and ready for sharing.' });
  };

  const closeModal = () => {
    setUploadError('');
    setSelectedFileName('');
    closeSubmissionModal();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,162,127,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(129,173,138,0.18),_transparent_30%),linear-gradient(135deg,_#f8f2e8_0%,_#f5ece0_46%,_#efe4d4_100%)] px-4 py-6 text-[#2f2a24] sm:px-6 lg:px-8">
      {recentNotification && (
        <NotificationGuide
          message={recentNotification.message}
          type={recentNotification.type}
          onDismiss={() => setRecentNotification(null)}
        />
      )}

      {submissionModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-[32px] border border-slate-700/70 bg-slate-900/85 p-8 shadow-2xl shadow-black/50">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Evidence required</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-100">Attach proof before approval</h3>
            <p className="mt-3 text-sm text-slate-400">
              The manager review flow is active. Upload a PDF, image, or Word document to continue the approval sequence.
            </p>

            <label
              className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-700/70 bg-slate-950/70'}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                handleFile(event.dataTransfer.files?.[0]);
              }}
            >
              <input
                type="file"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
              <div className="text-4xl">📦</div>
              <p className="mt-4 text-sm font-semibold text-slate-200">Drag and drop evidence here</p>
              <p className="mt-2 text-xs text-slate-500">or click to choose a file up to 5 MB</p>
              {selectedFileName && <p className="mt-3 text-sm text-emerald-400">Attached: {selectedFileName}</p>}
              {uploadError && <p className="mt-3 text-sm text-rose-400">{uploadError}</p>}
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-2xl border border-slate-700/70 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFile({ name: 'simulated-evidence.pdf', size: 240000, type: 'application/pdf' })}
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Use Sample Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-8 shadow-[0_22px_60px_rgba(87,67,35,0.10)] backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#6d7b62]">EcoSphere • Enterprise ESG Command Center</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2f2a24] leading-tight">A modern workspace for sustainability, compliance, and motivation</h1>
              <p className="mt-2 text-sm text-[#6b5a42] sm:text-base">
                Live ESG insights, governance clarity, and team engagement — designed for people, not machines.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-[#d9c8a6] bg-[#f7efe2] px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#846f57]">XP balance</p>
                <p className="text-2xl font-black text-[#9b6a2f]">{userXP}</p>
              </div>
              <div className="rounded-2xl border border-[#b9cfb3] bg-[#eef5e8] px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6d7b62]">Data coverage</p>
                <p className="text-xl font-black text-[#4e6b47]">{dataCoverage}%</p>
              </div>
              <div className="rounded-2xl border border-[#b8d7d3] bg-[#edf7f4] px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#5f726f]">Automation</p>
                <p className="text-xl font-black text-[#3c6d67]">{automationLevel}%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-[#f6ebdc] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Live sync state</p>
              <p className="text-sm text-slate-400">Last update: {lastSyncLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={refreshLiveMetrics}
                className="rounded-2xl border border-[#b8d7d3] bg-[#edf7f4] px-4 py-2 text-sm font-semibold text-[#3c6d67] transition hover:bg-[#e2f1ed]"
              >
                Refresh metrics
              </button>
              <button
                onClick={handleExportSnapshot}
                className="rounded-2xl border border-[#b9cfb3] bg-[#eef5e8] px-4 py-2 text-sm font-semibold text-[#4e6b47] transition hover:bg-[#e4f0df]"
              >
                Export snapshot
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-6 shadow-[0_18px_45px_rgba(87,67,35,0.08)] backdrop-blur-2xl">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Platform purpose</p>
              <h2 className="text-2xl font-bold text-slate-100">Built to connect sustainability action with business outcomes</h2>
            </div>
            <p className="text-sm text-slate-400">EcoSphere turns ESG strategy into daily operational rhythm.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {platformPillars.map((pillar) => (
              <div key={pillar.title} className={`rounded-3xl border border-slate-800/70 bg-gradient-to-br ${pillar.accent} p-4`}>
                <div className="text-3xl">{pillar.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-100">{pillar.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{pillar.body}</p>
                <p className="mt-4 text-sm font-semibold text-emerald-300">{pillar.metric}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-8 shadow-[0_18px_45px_rgba(87,67,35,0.08)] backdrop-blur-2xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Weighted ESG intelligence</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-100">Dynamic organization score</h2>
                  <p className="mt-3 text-sm text-slate-400">
                    Environmental at 40%, social at 30%, and governance at 30% combine into a living health score for your enterprise.
                  </p>
                </div>
                <div className="flex items-center gap-5 rounded-3xl border border-stone-200 bg-[#f7efe2] p-4">
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
                  <div key={dept.id} className="rounded-2xl border border-stone-200 bg-[#f7efe2] p-4">
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

            <section className="rounded-[28px] border border-stone-200/90 bg-[#fffaf4] p-8 shadow-[0_14px_35px_rgba(87,67,35,0.07)] backdrop-blur-xl">
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
            <section className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-8 shadow-[0_18px_45px_rgba(87,67,35,0.08)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Governance logs</p>
                  <h3 className="text-xl font-bold text-slate-100">Compliance watchlist</h3>
                </div>
                <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">
                  {complianceIssues.length} active issues
                </span>
              </div>
              <div className="mb-4 grid gap-3 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-fuchsia-500/10 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Open</p>
                  <p className="mt-1 text-xl font-black text-cyan-300">{complianceSummary.open}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Overdue</p>
                  <p className="mt-1 text-xl font-black text-rose-300">{complianceSummary.overdue}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Resolved</p>
                  <p className="mt-1 text-xl font-black text-emerald-300">{complianceSummary.resolved}</p>
                </div>
              </div>
              <form onSubmit={handleAddComplianceIssue} className="mb-4 space-y-3 rounded-2xl border border-stone-200 bg-[#fdf8f0] p-4">
                <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                  <label className="text-sm text-slate-300">
                    <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Issue title</span>
                    <input
                      value={newIssueForm.desc}
                      onChange={(event) => setNewIssueForm((prev) => ({ ...prev, desc: event.target.value }))}
                      className="w-full rounded-xl border border-stone-300 bg-[#fffdf9] px-3 py-2 text-sm text-[#2f2a24] outline-none ring-0"
                      placeholder="Renewal review"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Owner</span>
                    <input
                      value={newIssueForm.owner}
                      onChange={(event) => setNewIssueForm((prev) => ({ ...prev, owner: event.target.value }))}
                      className="w-full rounded-xl border border-stone-300 bg-[#fffdf9] px-3 py-2 text-sm text-[#2f2a24] outline-none ring-0"
                      placeholder="Ava Chen"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Due date</span>
                    <input
                      type="date"
                      value={newIssueForm.dueDate}
                      onChange={(event) => setNewIssueForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                      className="w-full rounded-xl border border-stone-300 bg-[#fffdf9] px-3 py-2 text-sm text-[#2f2a24] outline-none ring-0"
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <label className="text-sm text-slate-300">
                    <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Priority</span>
                    <select
                      value={newIssueForm.priority}
                      onChange={(event) => setNewIssueForm((prev) => ({ ...prev, priority: event.target.value }))}
                      className="rounded-xl border border-stone-300 bg-[#fffdf9] px-3 py-2 text-sm text-[#2f2a24] outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </label>
                  <button type="submit" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                    Add governance item
                  </button>
                </div>
                {issueFormError && <p className="text-sm text-rose-300">{issueFormError}</p>}
              </form>
              <div className="space-y-3">
                {complianceIssues.map((issue) => {
                    const isOverdue = issue.status === 'Overdue';
                    const isResolved = issue.status === 'Resolved';
                    const badgeClasses = isOverdue
                      ? 'border border-rose-200 bg-rose-50 text-rose-700'
                      : isResolved
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border border-amber-200 bg-amber-50 text-amber-700';

                    return (
                      <div key={issue.id} className="rounded-2xl border border-stone-200 bg-[#f7efe2] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#2f2a24]">{issue.desc}</p>
                            <p className="mt-1 text-xs text-[#6b5a42]">Owner: {issue.owner} • Due {formatDisplayDate(issue.dueDate)}</p>
                            {issue.priority && <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[#6d7b62]">Priority: {issue.priority}</p>}
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badgeClasses}`}>
                            {issue.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'Open')}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${issue.status === 'Open' ? 'bg-[#fff2d6] text-[#7a5a1f] border border-[#f1d9a8]' : 'bg-white border border-stone-200 text-[#6b5a42] hover:bg-[#fff7ec]'}`}
                          >
                            Open
                          </button>
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'Overdue')}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${issue.status === 'Overdue' ? 'bg-[#ffd6d6] text-[#8a2b2b] border border-[#f3c2c2]' : 'bg-white border border-stone-200 text-[#6b5a42] hover:bg-[#fff2f2]'}`}
                          >
                            Overdue
                          </button>
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'Resolved')}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${issue.status === 'Resolved' ? 'bg-[#e8f7ee] text-[#2d6a3c] border border-[#cfead6]' : 'bg-white border border-stone-200 text-[#6b5a42] hover:bg-[#f3fff6]'}`}
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            <section className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-8 shadow-[0_18px_45px_rgba(87,67,35,0.08)] backdrop-blur-2xl">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5b7d5a]">Challenge workflow</p>
                <h3 className="text-xl font-bold text-slate-100">Submit work for manager review</h3>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-[#f7efe2] p-4">
                <p className="text-sm text-slate-400">
                  {challengeStatus === 'reviewing'
                    ? 'Your submission is under manager review and the interface is locked until approval completes.'
                    : settings.evidenceRequired
                      ? 'Evidence is required before the approval sequence can begin.'
                      : 'Your challenge is ready to submit for approval.'}
                </p>
                <button
                  onClick={handleChallengeSubmit}
                  disabled={challengeStatus === 'reviewing' || pendingSubmission}
                  className={`mt-4 w-full rounded-2xl px-4 py-3 font-semibold transition ${challengeStatus === 'reviewing' || pendingSubmission ? 'cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}
                >
                  {challengeStatus === 'reviewing' ? 'Under Review' : settings.evidenceRequired ? 'Submit With Evidence' : 'Submit Challenge'}
                </button>
                <div className="mt-3 text-xs text-slate-500">
                  {challengeStatus === 'complete' ? 'Approval complete. XP awarded.' : 'Approval completes in ~2.5 seconds.'}
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-8 shadow-[0_18px_45px_rgba(87,67,35,0.08)] backdrop-blur-2xl">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5b7d5a]">System controls</p>
                <h3 className="text-xl font-bold text-slate-100">Operational rules</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Auto emission math', description: 'Derive carbon metrics from active pipelines', key: 'autoEmissionCalc' },
                  { label: 'Evidence validation', description: 'Require proof before compliance approval', key: 'evidenceRequired' },
                  { label: 'Badge auto-award', description: 'Unlock achievements the moment milestones are met', key: 'badgeAutoAward' },
                ].map((item) => (
                  <label key={item.key} className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-[#f7efe2] p-3">
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

        <section className="rounded-[32px] border border-stone-200/90 bg-[#fcfaf7]/95 p-8 shadow-[0_18px_45px_rgba(87,67,35,0.08)] backdrop-blur-2xl">
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
              const isRedeemed = redeemedRewards.includes(item.name);
              const canAfford = userXP >= item.cost;
              const stateLabel = isRedeemed ? 'Redeemed' : canAfford ? 'Available' : 'Locked';
              const stateClasses = isRedeemed
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                : canAfford
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-700/70 bg-slate-950/40 text-slate-500';

              return (
                <button
                  key={item.name}
                  onClick={() => redeemReward(item.name, item.cost)}
                  disabled={!canAfford || isRedeemed}
                  className={`rounded-2xl border p-4 text-left transition ${isRedeemed || canAfford ? 'hover:-translate-y-1' : 'cursor-not-allowed'} ${stateClasses}`}
                >
                  <div className="mb-3 text-3xl">{item.emoji}</div>
                  <p className="font-semibold text-slate-200">{item.name}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.cost} XP</p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em]">{stateLabel}</p>
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