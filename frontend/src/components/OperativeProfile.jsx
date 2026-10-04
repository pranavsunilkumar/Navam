import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CircleCheck,
  Download,
  OctagonAlert,
  RotateCcw,
  Save,
  Shield,
  Target,
  TriangleAlert,
  User,
  Wallet,
} from 'lucide-react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DEFAULT_PROFILE, normalizeProfile } from '../profileStore';

// NOTE: headings below use <div role="heading"> on purpose. The default Vite rules in
// index.css style every <h1>/<h2> and would override our Tailwind classes.

const API_URL = 'http://localhost:8000/profile-analysis';

// Keep these in sync with RISK_RETURNS in backend/main.py.
const RISKS = [
  { id: 'conservative', name: 'Conservative', rate: 5, note: 'Steady growth, small swings.' },
  { id: 'balanced', name: 'Balanced', rate: 8, note: 'A mix of growth and stability.' },
  { id: 'aggressive', name: 'Aggressive', rate: 11, note: 'Highest growth, deepest dips.' },
];

const SCORE_PARTS = [
  { key: 'investing', label: 'Investing rate', max: 35 },
  { key: 'runway', label: 'Emergency runway', max: 25 },
  { key: 'goal', label: 'Goal pace', max: 30 },
  { key: 'budget', label: 'Budget balance', max: 10 },
];

const usd = (n) =>
  `$${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const compactUsd = (n) =>
  `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)}`;

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

function buildTheme(isDark) {
  return isDark
    ? {
        page: 'bg-black text-white',
        panel: 'bg-zinc-950/90 border-zinc-800',
        subtle: 'bg-zinc-900/40 border-zinc-800/80',
        muted: 'text-zinc-400',
        faint: 'text-zinc-500',
        accent: 'text-emerald-400',
        accentSolid: 'bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500',
        accentSoft: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300',
        fieldFocus: 'focus-within:border-emerald-500/60',
        ghostBtn: 'border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300 bg-zinc-900/60',
        optionIdle: 'border-zinc-800 hover:border-zinc-600',
        bar: 'bg-emerald-400',
        barTrack: 'bg-zinc-800',
        ringTrack: 'text-zinc-800',
        ringFill: 'text-emerald-400',
        actionBar: 'bg-black/85 border-zinc-800',
        focus: 'focus-visible:outline-emerald-400',
        slider: 'accent-emerald-400',
        pill: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
        danger: 'text-red-400',
        warn: 'text-amber-400',
      }
    : {
        page: 'bg-orange-50 text-stone-900',
        panel: 'bg-white/90 border-orange-200/80',
        subtle: 'bg-orange-500/5 border-orange-200/70',
        muted: 'text-stone-600',
        faint: 'text-stone-500',
        accent: 'text-orange-600',
        accentSolid: 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-stone-200 disabled:text-stone-400',
        accentSoft: 'bg-orange-500/10 border-orange-500/60 text-orange-700',
        fieldFocus: 'focus-within:border-orange-500',
        ghostBtn: 'border-stone-200 text-stone-600 hover:border-orange-400 hover:text-orange-600 bg-stone-100/70',
        optionIdle: 'border-orange-200/70 hover:border-orange-400',
        bar: 'bg-orange-500',
        barTrack: 'bg-orange-100',
        ringTrack: 'text-orange-100',
        ringFill: 'text-orange-500',
        actionBar: 'bg-orange-50/90 border-orange-200',
        focus: 'focus-visible:outline-orange-500',
        slider: 'accent-orange-500',
        pill: 'bg-orange-100 border-orange-300 text-orange-700',
        danger: 'text-red-600',
        warn: 'text-amber-600',
      };
}

function Panel({ t, icon, title, children }) {
  return (
    <section className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl ${t.panel}`}>
      <div className={`mb-5 flex items-center gap-2 font-mono text-sm font-bold ${t.accent}`}>
        {icon}
        <div role="heading" aria-level={2}>{title}</div>
      </div>
      {children}
    </section>
  );
}

function NumberField({ t, id, label, value, onChange, prefix, hint, hintTone }) {
  return (
    <div>
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors ${t.subtle} ${t.fieldFocus}`}>
        {prefix && <span className={`font-mono text-sm ${t.faint}`}>{prefix}</span>}
        <div className="flex min-w-0 flex-1 flex-col">
          <label htmlFor={id} className={`text-xs font-medium ${t.muted}`}>
            {label}
          </label>
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            className="w-full bg-transparent font-mono text-base font-semibold outline-none"
          />
        </div>
      </div>
      {hint && <p className={`mt-1.5 px-1 text-xs ${hintTone || t.faint}`}>{hint}</p>}
    </div>
  );
}

function ScoreRing({ t, score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

  return (
    <div
      className="relative h-36 w-36 shrink-0"
      role="img"
      aria-label={`Readiness score ${score} out of 100`}
    >
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className={t.ringTrack} />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${t.ringFill} transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-black leading-none">{score}</span>
        <span className={`mt-1 text-xs ${t.faint}`}>of 100</span>
      </div>
    </div>
  );
}

export default function OperativeProfile({ theme = 'dark', profile, onSave, onNavigate }) {
  const isDark = theme === 'dark';
  const t = buildTheme(isDark);

  const [draft, setDraft] = useState(profile);
  const [notice, setNotice] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [result, setResult] = useState({ key: null, data: null, error: false });

  const setField = (field) => (value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const clean = useMemo(() => normalizeProfile(draft), [draft]);
  const isDirty = JSON.stringify(clean) !== JSON.stringify(profile);

  // ---- Live analysis (debounced call to the FastAPI backend) -------------------
  const requestBody = useMemo(
    () =>
      JSON.stringify({
        monthly_income: clean.monthlyIncome,
        monthly_expenses: clean.monthlyExpenses,
        current_savings: clean.currentSavings,
        monthly_investment: clean.monthlyInvestment,
        risk_profile: clean.riskProfile,
        target_amount: clean.targetAmount,
        target_years: clean.targetYears,
      }),
    [clean],
  );

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Server responded ${response.status}`);
          return response.json();
        })
        .then((data) => setResult({ key: requestBody, data, error: false }))
        .catch((error) => {
          if (error.name === 'AbortError') return;
          console.error('Profile analysis failed:', error);
          setResult((prev) => ({ key: requestBody, data: prev.data, error: true }));
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [requestBody]);

  const analysis = result.data;
  const isRefreshing = result.key !== requestBody;
  const serverDown = result.error && !isRefreshing;

  // ---- Actions ----------------------------------------------------------------
  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  };

  const handleSave = () => {
    onSave(clean);
    flash('Profile saved');
  };

  const handleDiscard = () => {
    setDraft(profile);
    setConfirmReset(false);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setDraft(DEFAULT_PROFILE);
    setConfirmReset(false);
    flash('Defaults restored. Save to keep them.');
  };

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: clean,
      analysis: analysis
        ? {
            readinessScore: analysis.score,
            rank: analysis.rank,
            projectedValue: analysis.projected_value,
            goalCoveragePercent: analysis.goal_coverage,
            requiredMonthlyInvestment: analysis.required_monthly,
          }
        : null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const slug = clean.codename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    link.href = url;
    link.download = `operative-profile${slug ? `-${slug}` : ''}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ---- Derived values for display ---------------------------------------------
  const initials = getInitials(draft.codename);
  const surplus = clean.monthlyIncome - clean.monthlyExpenses;
  const overspend = clean.monthlyInvestment > Math.max(surplus, 0);
  const selectedRisk = RISKS.find((r) => r.id === clean.riskProfile);

  const directiveIcon = {
    critical: <OctagonAlert size={18} className={`mt-0.5 shrink-0 ${t.danger}`} />,
    warning: <TriangleAlert size={18} className={`mt-0.5 shrink-0 ${t.warn}`} />,
    ok: <CircleCheck size={18} className={`mt-0.5 shrink-0 ${t.accent}`} />,
  };

  const primaryAccent = isDark ? '#10b981' : '#ea580c';
  const gridStroke = isDark ? '#27272a' : '#fed7aa';
  const axisColor = isDark ? '#71717a' : '#9a3412';
  const targetColor = isDark ? '#fbbf24' : '#b45309';

  const btnBase = `inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.focus}`;

  return (
    <div className={`fixed inset-0 z-40 overflow-y-auto transition-colors duration-500 ${t.page}`}>
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 text-left sm:px-8">
        {/* Back to terminal */}
        <button
          type="button"
          onClick={onNavigate}
          className={`${btnBase} font-mono text-xs ${t.ghostBtn}`}
        >
          <ArrowLeft size={14} /> Terminal home
        </button>

        {/* Dossier header */}
        <section className={`mt-4 flex flex-col gap-6 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8 ${t.panel}`}>
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border font-mono text-xl font-black ${t.accentSoft}`}
              aria-hidden="true"
            >
              {initials || <User size={26} />}
            </div>
            <div className="min-w-0">
              <label htmlFor="codename" className={`text-xs font-medium ${t.muted}`}>
                Codename
              </label>
              <input
                id="codename"
                type="text"
                maxLength={24}
                value={draft.codename}
                onChange={(e) => setField('codename')(e.target.value)}
                placeholder="Unnamed operative"
                className={`block w-full border-b bg-transparent pb-1 text-2xl font-bold outline-none transition-colors sm:text-3xl ${
                  isDark
                    ? 'border-zinc-800 placeholder-zinc-700 focus:border-emerald-500'
                    : 'border-orange-200 placeholder-stone-300 focus:border-orange-500'
                }`}
              />
              <p className={`mt-2 flex items-center gap-2 text-sm ${t.muted}`}>
                <Shield size={14} className={t.accent} />
                {analysis ? (
                  <span>
                    <span className={`font-semibold ${t.accent}`}>{analysis.rank}</span>
                    {analysis.next_rank
                      ? `, ${analysis.points_to_next} points from ${analysis.next_rank}`
                      : ', the highest rank'}
                  </span>
                ) : (
                  <span>Calculating rank...</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 self-center">
            <ScoreRing t={t} score={analysis ? analysis.score : 0} />
            <span className={`text-xs ${t.faint}`}>Financial readiness</span>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ------------------------- LEFT: inputs ------------------------- */}
          <div className="flex flex-col gap-6">
            <Panel t={t} icon={<Wallet size={18} />} title="Income and spending">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField t={t} id="income" label="Monthly income" prefix="$" value={draft.monthlyIncome} onChange={setField('monthlyIncome')} />
                <NumberField t={t} id="expenses" label="Monthly expenses" prefix="$" value={draft.monthlyExpenses} onChange={setField('monthlyExpenses')} />
                <NumberField t={t} id="savings" label="Current savings" prefix="$" value={draft.currentSavings} onChange={setField('currentSavings')} />
                <NumberField
                  t={t}
                  id="investment"
                  label="Monthly investment"
                  prefix="$"
                  value={draft.monthlyInvestment}
                  onChange={setField('monthlyInvestment')}
                  hint={
                    overspend
                      ? `Over your ${usd(Math.max(surplus, 0))} monthly surplus.`
                      : `${usd(Math.max(surplus, 0))} monthly surplus available.`
                  }
                  hintTone={overspend ? t.danger : t.faint}
                />
              </div>
            </Panel>

            <Panel t={t} icon={<Shield size={18} />} title="Risk doctrine">
              <div role="radiogroup" aria-label="Risk doctrine" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {RISKS.map((risk) => {
                  const active = clean.riskProfile === risk.id;
                  return (
                    <button
                      key={risk.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setField('riskProfile')(risk.id)}
                      className={`rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.focus} ${
                        active ? t.accentSoft : t.optionIdle
                      }`}
                    >
                      <span className="block text-sm font-bold">{risk.name}</span>
                      <span className="mt-1 block font-mono text-lg font-black">{risk.rate}%<span className="text-xs font-medium opacity-70"> / yr</span></span>
                      <span className={`mt-1 block text-xs leading-snug ${active ? 'opacity-80' : t.faint}`}>{risk.note}</span>
                    </button>
                  );
                })}
              </div>
              <p className={`mt-3 text-xs ${t.faint}`}>
                Returns are long-run assumptions for planning, not promises.
              </p>
            </Panel>

            <Panel t={t} icon={<Target size={18} />} title="Mission target">
              <NumberField
                t={t}
                id="target"
                label="Target amount"
                prefix="$"
                value={draft.targetAmount}
                onChange={setField('targetAmount')}
              />
              <div className={`mt-4 flex items-center gap-4 rounded-xl border p-3.5 ${t.subtle}`}>
                <label htmlFor="years" className={`text-xs font-medium whitespace-nowrap ${t.muted}`}>
                  Time to target
                </label>
                <input
                  id="years"
                  type="range"
                  min="1"
                  max="40"
                  value={clean.targetYears}
                  onChange={(e) => setField('targetYears')(Number(e.target.value))}
                  className={`w-full cursor-pointer ${t.slider}`}
                />
                <span className={`rounded-md border px-3 py-1 font-mono text-sm font-bold whitespace-nowrap ${t.pill}`}>
                  {clean.targetYears} yrs
                </span>
              </div>
            </Panel>
          </div>

          {/* ----------------------- RIGHT: analysis ------------------------ */}
          <div className="flex flex-col gap-6">
            {serverDown && (
              <div className={`rounded-xl border p-4 text-sm ${isDark ? 'border-red-500/40 bg-red-950/30 text-red-300' : 'border-red-300 bg-red-50 text-red-700'}`} role="alert">
                <p className="font-semibold">Can't reach the analysis server.</p>
                <p className="mt-1">
                  Open a terminal in the <span className="font-mono font-semibold">backend</span> folder and run{' '}
                  <span className="font-mono font-semibold">uvicorn main:app --reload</span>. You can still edit and save your profile.
                </p>
              </div>
            )}

            {!analysis && !serverDown && (
              <div className={`rounded-2xl border p-8 text-center text-sm ${t.panel} ${t.muted}`}>Running analysis...</div>
            )}

            {analysis && (
              <div className={`flex flex-col gap-6 transition-opacity duration-200 ${isRefreshing || serverDown ? 'opacity-60' : 'opacity-100'}`}>
                {/* Hero readout */}
                <section className={`rounded-2xl border p-5 sm:p-6 ${t.panel}`}>
                  <p className={`text-sm ${t.muted}`}>
                    Projected value in {clean.targetYears} years at {analysis.rate}% a year
                  </p>
                  <p className={`mt-1 font-mono text-4xl font-black tracking-tight sm:text-5xl ${t.accent}`}>
                    {usd(analysis.projected_value)}
                  </p>
                  <p className={`mt-1 text-sm ${t.faint}`}>
                    About {usd(analysis.real_value)} in today's money after {analysis.inflation}% inflation.
                  </p>

                  <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <dt className={`text-xs ${t.faint}`}>Target reached</dt>
                      <dd className="mt-0.5 font-mono text-lg font-bold">{analysis.goal_coverage}%</dd>
                    </div>
                    <div>
                      <dt className={`text-xs ${t.faint}`}>Needed per month</dt>
                      <dd className="mt-0.5 font-mono text-lg font-bold">{usd(analysis.required_monthly)}</dd>
                    </div>
                    <div>
                      <dt className={`text-xs ${t.faint}`}>Growth earned</dt>
                      <dd className="mt-0.5 font-mono text-lg font-bold">{usd(analysis.growth_earned)}</dd>
                    </div>
                  </dl>
                </section>

                {/* Chart */}
                <section className={`rounded-2xl border p-5 sm:p-6 ${t.panel}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div role="heading" aria-level={2} className="text-sm font-bold">Path to your target</div>
                    <div className={`flex items-center gap-3 text-xs ${t.faint}`}>
                      <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-4" style={{ backgroundColor: primaryAccent }} /> Projected
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-4 border-t-2 border-dashed" style={{ borderColor: axisColor }} /> You put in
                      </span>
                    </div>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={analysis.projection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={primaryAccent} stopOpacity={isDark ? 0.35 : 0.25} />
                            <stop offset="95%" stopColor={primaryAccent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                        <XAxis dataKey="year" stroke={axisColor} fontSize={12} tickLine={false} tickFormatter={(y) => `Y${y}`} />
                        <YAxis stroke={axisColor} fontSize={12} tickLine={false} width={52} tickFormatter={compactUsd} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#18181b' : '#ffffff',
                            borderColor: isDark ? '#27272a' : '#fed7aa',
                            borderRadius: '8px',
                            color: isDark ? '#ffffff' : '#1c1917',
                          }}
                          labelFormatter={(year) => `Year ${year}`}
                          formatter={(value, name) => [usd(value), name === 'value' ? 'Projected' : 'You put in']}
                        />
                        <ReferenceLine
                          y={clean.targetAmount}
                          stroke={targetColor}
                          strokeDasharray="6 4"
                          ifOverflow="extendDomain"
                          label={{ value: 'Target', position: 'insideTopLeft', fill: targetColor, fontSize: 11 }}
                        />
                        <Area type="monotone" dataKey="value" fill="url(#profileGradient)" stroke="none" />
                        <Line type="monotone" dataKey="value" stroke={primaryAccent} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="contributed" stroke={axisColor} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Score breakdown */}
                <section className={`rounded-2xl border p-5 sm:p-6 ${t.panel}`}>
                  <div role="heading" aria-level={2} className="mb-4 text-sm font-bold">Where your score comes from</div>
                  <ul className="flex flex-col gap-3">
                    {SCORE_PARTS.map((part) => {
                      const earned = analysis.score_parts[part.key] ?? 0;
                      return (
                        <li key={part.key}>
                          <div className="mb-1 flex items-baseline justify-between text-xs">
                            <span className={t.muted}>{part.label}</span>
                            <span className="font-mono">{Math.round(earned)} / {part.max}</span>
                          </div>
                          <div className={`h-1.5 overflow-hidden rounded-full ${t.barTrack}`}>
                            <div
                              className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${t.bar}`}
                              style={{ width: `${(earned / part.max) * 100}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Directives */}
                <section className={`rounded-2xl border p-5 sm:p-6 ${t.panel}`}>
                  <div role="heading" aria-level={2} className="mb-4 text-sm font-bold">Next steps</div>
                  <ul className="flex flex-col gap-3">
                    {analysis.directives.map((directive, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm leading-relaxed">
                        {directiveIcon[directive.level]}
                        <span>{directive.text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>
        </div>

        <p className={`mt-6 pb-8 text-xs ${t.faint}`}>
          This is a planning tool, not financial advice. Your profile is stored only in this browser
          {selectedRisk ? `, using a ${selectedRisk.rate}% yearly return for the ${selectedRisk.name.toLowerCase()} doctrine.` : '.'}
        </p>
      </div>

      {/* Sticky action bar */}
      <div className={`sticky bottom-0 z-10 border-t backdrop-blur-md ${t.actionBar}`}>
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-left sm:px-8">
          <p className={`text-sm ${isDirty ? t.warn : t.muted}`} aria-live="polite">
            {notice || (isDirty ? 'You have unsaved changes.' : 'All changes saved.')}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {isDirty && (
              <button type="button" onClick={handleDiscard} className={`${btnBase} ${t.ghostBtn}`}>
                Discard changes
              </button>
            )}
            <button type="button" onClick={handleReset} onBlur={() => setConfirmReset(false)} className={`${btnBase} ${t.ghostBtn}`}>
              <RotateCcw size={14} /> {confirmReset ? 'Confirm reset' : 'Reset to defaults'}
            </button>
            <button type="button" onClick={handleExport} className={`${btnBase} ${t.ghostBtn}`}>
              <Download size={14} /> Export
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className={`${btnBase} border-transparent font-bold disabled:cursor-not-allowed ${t.accentSolid}`}
            >
              <Save size={14} /> Save profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
