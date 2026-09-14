import { useState, useEffect } from 'react';
import { Play, FastForward } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line,
  Area,
  ComposedChart
} from 'recharts';

export default function CinematicMasterclass({ onNavigate, theme = 'dark' }) {
  const [timeWarp, setTimeWarp] = useState(5);
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [interestData, setInterestData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [frequency, setFrequency] = useState(1);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (principal === '' || rate === '') return;

    fetch(`http://localhost:8000/compound-interest?years=${timeWarp}&principal=${principal}&rate=${rate}&frequency=${frequency}`)
      .then((response) => response.json())
      .then((data) => setInterestData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [timeWarp, principal, rate, frequency]);

  const scenes = [
    {
      title: "Episode I: The Silent Drain",
      narrative: "You leave your capital idle. You think it is safe. But every second, a phantom force known as 'Inflation' drains 6% of its purchasing power annually.",
      actionText: "Initiate Countermeasures"
    },
    {
      title: "The Weapon: The Compound Protocol",
      narrative: "Centuries ago, mathematicians discovered a glitch in the financial matrix. They called it Compound Interest. It doesn't just grow your energy; it forces your energy to create its own energy.",
      actionText: "Access Simulator"
    }
  ];

  const currentScene = scenes[sceneIndex];

  const handleNext = () => {
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex((prev) => prev + 1);
    } else {
      setIsPlaying(true);
    }
  };

  // 🎬 Prologue Screen
  if (!isPlaying) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center z-50 p-8 text-center transition-colors duration-500 ${
        isDark ? 'bg-[#050505] text-white' : 'bg-stone-100 text-stone-900'
      }`}>
        <h2 className={`font-mono uppercase tracking-[0.3em] mb-6 text-sm font-bold ${
          isDark ? 'text-emerald-400' : 'text-orange-600'
        }`}>
          {currentScene.title}
        </h2>
        <p className={`text-2xl font-light max-w-2xl mb-12 leading-relaxed ${
          isDark ? 'text-gray-300' : 'text-stone-700'
        }`}>
          {currentScene.narrative}
        </p>
        <button 
          onClick={handleNext}
          className={`px-8 py-4 font-mono uppercase rounded-full transition-all tracking-wider text-xs font-bold border shadow-lg ${
            isDark 
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-400' 
              : 'bg-orange-500 text-white hover:bg-orange-600 border-orange-600 shadow-orange-500/20'
          }`}
        >
          {currentScene.actionText}
        </button>
      </div>
    );
  }

  // Accent definitions for quick reference
  const primaryAccent = isDark ? '#10b981' : '#ea580c';
  const gridStroke = isDark ? '#27272a' : '#fed7aa';
  const axisColor = isDark ? '#71717a' : '#9a3412';

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center justify-center p-6 md:p-12 transition-colors duration-500 ${
      isDark ? 'bg-black text-white' : 'bg-orange-50/50 text-stone-900'
    }`}>
      
      {/* 📦 Main Simulator Card */}
      <div className={`w-full max-w-4xl border-y-4 py-10 px-6 sm:px-10 relative shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? 'bg-zinc-950/90 border-emerald-500/30 shadow-black/80' 
          : 'bg-white/80 border-orange-500/40 shadow-orange-950/5'
      }`}>
        
        {/* 🏷️ Top Left Badge */}
        <div className={`absolute top-5 left-6 flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase ${
          isDark ? 'text-emerald-400' : 'text-orange-600'
        }`}>
          <Play size={16} className={isDark ? 'fill-emerald-400' : 'fill-orange-600'} /> 
          <span>The Compound Protocol</span>
        </div>

        {/* 🧭 Top Right Navigation */}
        <button
          onClick={onNavigate}
          className={`absolute top-5 right-6 z-20 text-xs font-mono px-3 py-1.5 rounded-md transition-all flex items-center gap-2 border backdrop-blur-sm ${
            isDark 
              ? 'text-zinc-400 hover:text-emerald-400 border-zinc-800 hover:border-emerald-500/40 bg-zinc-900/60' 
              : 'text-stone-500 hover:text-orange-600 border-stone-200 hover:border-orange-400 bg-stone-100/60'
          }`}
        >
          TERMINAL_HOME <span>✕</span>
        </button>

        {/* 📜 Header Text */}
        <div className="text-center mb-8 mt-8 px-4">
          <h2 className={`text-3xl sm:text-4xl font-black mb-3 tracking-tight ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}>
            Time is the Catalyst.
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-stone-600'
          }`}>
            Initial capital deployed at ${Number(principal || 0).toLocaleString()}. By warping temporal coordinates, calculate the compounding trajectory across decades.
          </p>
        </div>

        {/* 🪟 3-Column Glassmorphic Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          
          {/* Initial Funding */}
          <div className={`flex flex-col p-3 rounded-xl border backdrop-blur-md transition-all ${
            isDark 
              ? 'bg-zinc-900/40 border-zinc-800/80 focus-within:border-emerald-500/50' 
              : 'bg-orange-500/5 border-orange-200/60 focus-within:border-orange-500'
          }`}>
            <label className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-1 ${
              isDark ? 'text-zinc-400' : 'text-orange-800'
            }`}>
              Funding ($)
            </label>
            <input 
              type="number" 
              value={principal} 
              onChange={(e) => setPrincipal(e.target.value === '' ? '' : Number(e.target.value))}
              className={`bg-transparent outline-none font-mono text-base font-semibold ${
                isDark ? 'text-white placeholder-zinc-600' : 'text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Yield Rate */}
          <div className={`flex flex-col p-3 rounded-xl border backdrop-blur-md transition-all ${
            isDark 
              ? 'bg-zinc-900/40 border-zinc-800/80 focus-within:border-emerald-500/50' 
              : 'bg-orange-500/5 border-orange-200/60 focus-within:border-orange-500'
          }`}>
            <label className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-1 ${
              isDark ? 'text-zinc-400' : 'text-orange-800'
            }`}>
              Rate (%)
            </label>
            <input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
              className={`bg-transparent outline-none font-mono text-base font-semibold ${
                isDark ? 'text-white placeholder-zinc-600' : 'text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Compounding Frequency */}
          <div className={`flex flex-col p-3 rounded-xl border backdrop-blur-md transition-all ${
            isDark 
              ? 'bg-zinc-900/40 border-zinc-800/80 focus-within:border-emerald-500/50' 
              : 'bg-orange-500/5 border-orange-200/60 focus-within:border-orange-500'
          }`}>
            <label className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-1 ${
              isDark ? 'text-zinc-400' : 'text-orange-800'
            }`}>
              Frequency
            </label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value === '' ? '' : Number(e.target.value))}
              className={`bg-transparent outline-none font-mono text-sm font-semibold cursor-pointer ${
                isDark 
                  ? 'text-white [&>option]:bg-zinc-900 [&>option]:text-white' 
                  : 'text-stone-900 [&>option]:bg-white [&>option]:text-stone-900'
              }`}
            >
              <option value="1">Annually</option>
              <option value="2">Semi-Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>

        </div>

        {/* 🎚️ Temporal Slider */}
        <div className={`max-w-xl mx-auto mb-8 p-4 rounded-xl border backdrop-blur-md flex items-center gap-4 transition-all ${
          isDark 
            ? 'bg-zinc-900/40 border-zinc-800' 
            : 'bg-white/60 border-orange-200/70 shadow-sm'
        }`}>
          <FastForward className={isDark ? 'text-emerald-400' : 'text-orange-500'} size={22} />
          <input 
            type="range" 
            min="1" 
            max="40" 
            value={timeWarp} 
            onChange={(e) => setTimeWarp(Number(e.target.value))}
            className={`w-full cursor-pointer ${isDark ? 'accent-emerald-400' : 'accent-orange-500'}`}
          />
          <span className={`font-mono font-bold text-sm tracking-widest whitespace-nowrap px-3 py-1 rounded-md border ${
            isDark 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
              : 'bg-orange-100 border-orange-300 text-orange-700'
          }`}>
            {timeWarp} YRS
          </span>
        </div>

        {/* 📈 Projected Wealth Readout & Graph */}
        <div className="w-full px-2">
          
          <div className="text-center mb-6">
            <span className={`font-mono text-xs uppercase tracking-widest block mb-1 ${
              isDark ? 'text-zinc-500' : 'text-stone-400'
            }`}>
              Projected Protocol Return
            </span>
            <h3 className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
              isDark ? 'text-emerald-400' : 'text-orange-600'
            }`}>
              ${interestData.at(-1)?.value ? Number(interestData.at(-1)?.value).toLocaleString() : '0'}
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={interestData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryAccent} stopOpacity={isDark ? 0.35 : 0.25} />
                    <stop offset="95%" stopColor={primaryAccent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="year" stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff', 
                    borderColor: isDark ? '#27272a' : '#fed7aa',
                    borderRadius: '8px',
                    color: isDark ? '#ffffff' : '#1c1917',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Capital"]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  fill="url(#chartGradient)" 
                  stroke="none" 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={primaryAccent} 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: primaryAccent }} 
                  activeDot={{ r: 6 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
}