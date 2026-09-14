import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, PieChart, Camera, List, FileText, Gamepad2, 
  Moon, Sun, Menu, X, Send, Bot, ChevronDown, 
  UploadCloud, CheckCircle2, TrendingUp, AlertTriangle, 
  HeartPulse, Shield, Zap, ArrowRight, Activity, Crosshair,
  Film, Play, SkipForward, FastForward, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Jan', income: 65000, expenses: 42000 },
  { name: 'Feb', income: 65000, expenses: 45000 },
  { name: 'Mar', income: 85000, expenses: 39000 },
  { name: 'Apr', income: 85000, expenses: 52000 },
  { name: 'May', income: 85000, expenses: 41000 },
  { name: 'Jun', income: 85000, expenses: 48000 },
  { name: 'Jul', income: 85000, expenses: 42300 },
];

const recentTransactions = [
  { id: 1, merchant: 'Zomato', amount: -450, date: 'Today, 2:30 PM', category: 'Food', icon: <PieChart size={16} /> },
  { id: 2, merchant: 'BESCOM Bill', amount: -1240, date: 'Yesterday', category: 'Utility', icon: <Zap size={16} /> },
  { id: 3, merchant: 'Salary Credit', amount: 85000, date: 'Sep 1', category: 'Income', icon: <Wallet size={16} />, positive: true },
];

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl z-[100] font-medium text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
      <CheckCircle2 size={16} /> {message}
    </div>
  );
};

const LandingPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-brand-500 selection:text-white">
    <header className="px-8 py-6 flex justify-between items-center border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold">
          <Wallet size={24} />
        </div>
        <span className="text-2xl font-bold tracking-wide">FinAI</span>
      </div>
      <div className="flex gap-4">
        <button onClick={() => onNavigate('login')} className="px-5 py-2 text-sm font-medium hover:text-emerald-400 transition-colors">Log In</button>
        <button onClick={() => onNavigate('signup')} className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors">Get Started</button>
      </div>
    </header>

    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#050505] to-[#050505]">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-8 border border-emerald-500/20">
        <Sparkles size={14} /> Meet your new AI Financial Architect
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        Master Your Capital.<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Automate Your Wealth.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 font-light">
        FinAI combines local OCR for privacy-first receipt scanning, dynamic RAG advisory using top financial literature, and RPG gamification to build your wealth engine.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        <button onClick={() => onNavigate('signup')} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
          Initialize Core <ArrowRight size={18} />
        </button>
        <button onClick={() => onNavigate('finquest')} className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <Gamepad2 size={18} /> Try FinQuest RPG
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left backdrop-blur-sm hover:bg-white/10 transition-colors">
          <Camera className="text-emerald-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Smart OCR Scanner</h3>
          <p className="text-sm text-slate-400">Upload UPI screenshots. Our AI extracts merchant, date, and amount instantly.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left backdrop-blur-sm hover:bg-white/10 transition-colors">
          <Gamepad2 className="text-purple-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">FinQuest Masterclass</h3>
          <p className="text-sm text-slate-400">Turn budgeting into an RPG. Level up your financial stats and fight the Inflation Beast.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left backdrop-blur-sm hover:bg-white/10 transition-colors">
          <Bot className="text-cyan-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Contextual RAG Advisor</h3>
          <p className="text-sm text-slate-400">Chat with an AI trained on your exact spending habits and global finance books.</p>
        </div>
      </div>
    </main>
  </div>
);

const Sparkles = ({ size }) => <Activity size={size} />; // Placeholder for Sparkles

const AuthPage = ({ mode, onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication
    onLogin({ name: 'Alex Developer', email, tier: 'Pro' });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 text-slate-400 hover:text-white">
        <ArrowRight size={24} className="rotate-180" />
      </button>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full max-w-md backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-bold">
            <Wallet size={28} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {mode === 'login' ? 'Access System' : 'Initialize Core'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          {mode === 'login' ? 'Enter your credentials to continue.' : 'Create an account to begin your wealth journey.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Secure Comms (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all mt-4">
            {mode === 'login' ? 'Decrypt & Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? (
            <>No core detected? <button onClick={() => onNavigate('signup')} className="text-emerald-400 hover:underline">Initialize here.</button></>
          ) : (
            <>Core exists? <button onClick={() => onNavigate('login')} className="text-emerald-400 hover:underline">Access here.</button></>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Welcome & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">System Status: Optimal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Financial overview for <span className="text-slate-700 dark:text-slate-200 font-medium">September 2026</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('ocr')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
            <Camera size={16} /> Scan Receipt
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-emerald-500">
              <Wallet size={20} />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp size={12} className="mr-1" /> +2.4%
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Liquidity</div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹ 1,24,500</h3>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-red-500">
              <AlertTriangle size={20} />
            </div>
            <span className="flex items-center text-xs font-medium text-red-500 bg-red-100 dark:bg-red-500/10 px-2 py-1 rounded-full">
               High Burn
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Monthly Burn Rate</div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹ 42,300 <span className="text-sm font-normal text-slate-400">/ 50k Limit</span></h3>
          <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full w-[84%]"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-blue-500">
              <HeartPulse size={20} />
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Core Health Score</div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">78<span className="text-lg text-slate-400 font-normal">/100</span></h3>
            <span className="text-sm text-amber-500 font-medium mb-1">Stable</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section using Recharts */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Energy Flow (Cashflow)</h2>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Scans</h2>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View All</button>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-transparent dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${tx.positive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                    {tx.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{tx.merchant}</div>
                    <div className="text-xs text-slate-500">{tx.date} • {tx.category}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${tx.positive ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                  {tx.positive ? '+' : ''}₹ {Math.abs(tx.amount)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
            <div className="flex gap-3">
              <Bot className="text-indigo-500 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-bold block text-indigo-700 dark:text-indigo-300">AI Insight</span>
                Dining energy burn is 15% higher this week. Recalibration recommended.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OCRScanner = ({ setToast }) => {
  const [scanState, setScanState] = useState('idle'); // idle, scanning, complete
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleUpload = () => {
    setScanState('scanning');
    setProgress(0);
    
    // Simulate OCR processing steps
    setTimeout(() => setProgress(30), 800);
    setTimeout(() => setProgress(60), 1600);
    setTimeout(() => setProgress(90), 2400);
    
    setTimeout(() => {
      setScanState('complete');
      setResults({
        merchant: "Starbucks Coffee",
        amount: "450.00",
        date: new Date().toISOString().split('T')[0],
        category: "Food"
      });
    }, 3200);
  };

  const handleSave = () => {
    setToast("Transaction successfully committed to core database.");
    setScanState('idle');
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Smart Receipt Scanner</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Upload UPI screenshots or bills. Local PaddleOCR model extracts data automatically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div 
          onClick={scanState === 'idle' ? handleUpload : undefined}
          className={`bg-white dark:bg-[#121212] border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[300px] relative overflow-hidden group
            ${scanState === 'idle' ? 'border-slate-300 dark:border-white/10 hover:border-emerald-500 cursor-pointer' : 'border-emerald-500 dark:border-emerald-500'}`}
        >
          {scanState === 'idle' && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mx-auto group-hover:text-emerald-500 group-hover:scale-110 transition-all shadow-sm">
                <UploadCloud size={32} />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">Click or drag image here</div>
                <div className="text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</div>
              </div>
              <button className="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-sm font-medium text-slate-700 dark:text-white transition-colors">
                Browse Files
              </button>
            </div>
          )}

          {scanState === 'scanning' && (
            <div className="absolute inset-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-[pulse_1s_ease-in-out_infinite] z-20 top-0"></div>
              <FileText size={64} className="text-slate-300 dark:text-slate-700 mb-6 opacity-50 animate-pulse" />
              <div className="text-emerald-500 font-bold mb-3 flex items-center gap-2">
                <Shield size={16} className="animate-spin" /> Extracting via OCR...
              </div>
              <div className="w-48 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
          
          {scanState === 'complete' && (
            <div className="text-emerald-500 flex flex-col items-center">
               <CheckCircle2 size={64} className="mb-4" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Scan Complete</h3>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className={`bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col transition-all duration-500 ${scanState === 'complete' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Extraction Successful</h3>
              <p className="text-xs text-slate-500">Confidence Score: <span className="text-emerald-500">96%</span></p>
            </div>
          </div>

          <form className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Merchant / Vendor</label>
              <input type="text" readOnly value={results?.merchant || ''} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount (₹)</label>
                <input type="text" readOnly value={results?.amount || ''} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                <input type="text" readOnly value={results?.date || ''} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Category</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none appearance-none">
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transportation</option>
                  <option value="Utility">Utilities</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
            <button onClick={handleSave} disabled={scanState !== 'complete'} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
              Commit Record
            </button>
            <button onClick={() => {setScanState('idle'); setResults(null);}} disabled={scanState !== 'complete'} className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-medium rounded-xl transition-colors disabled:opacity-50">
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinQuest = ({ onNavigate, setToast }) => {
  const [step, setStep] = useState(0); // 0: Intro, 1: Income, 2: Burn Rate, 3: Goal, 4: End
  const [income, setIncome] = useState('');
  const [burn, setBurn] = useState(30000);

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center animate-in fade-in zoom-in duration-500 max-w-xl mx-auto">
            <Gamepad2 size={48} className="text-emerald-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Wealth RPG Engine</h2>
            <p className="text-lg text-slate-400 font-light mb-10 leading-relaxed">
              Initiate, you have entered the Capital Grid. Here, money is energy. To defeat the Inflation Beast, we must first calibrate your power core. Are you ready?
            </p>
            <button onClick={() => setStep(1)} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Begin Calibration
            </button>
          </div>
        );
      case 1:
        return (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-auto backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="text-xs text-emerald-400 font-mono mb-4 uppercase flex justify-between items-center">
              <span>Sequence 01</span>
              <span className="animate-pulse">Awaiting Input...</span>
            </div>
            <h3 className="text-2xl text-white font-bold mb-4">What is your monthly energy influx?</h3>
            <p className="text-sm text-slate-400 mb-8 font-light">Your net income after mandatory tax drains.</p>
            
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number" 
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g., 85000" 
                  className="w-full bg-black/50 border border-white/20 rounded-xl py-4 pl-10 pr-4 text-xl text-white font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
              <button 
                disabled={!income}
                onClick={() => setStep(2)} 
                className="w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                Initialize Core
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-auto backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="text-xs text-purple-400 font-mono mb-4 uppercase flex justify-between items-center">
              <span>Sequence 02</span>
              <span>Calibrating...</span>
            </div>
            <h3 className="text-2xl text-white font-bold mb-4">What is your base metabolic burn?</h3>
            <p className="text-sm text-slate-400 mb-8 font-light">Fixed expenses: rent, EMI, utilities, and survival sustenance.</p>
            
            <div className="space-y-8">
              <input 
                type="range" 
                min="0" 
                max={income || 100000} 
                step="1000" 
                value={burn}
                onChange={(e) => setBurn(e.target.value)}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="text-center text-4xl font-mono text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                ₹ {burn}
              </div>
              <button 
                onClick={() => setStep(3)} 
                className="w-full bg-purple-600 text-white font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-purple-500 transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              >
                Analyze Liabilities
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-auto backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="text-xs text-cyan-400 font-mono mb-4 uppercase flex justify-between items-center">
              <span>Sequence 03</span>
              <span>Target Locked</span>
            </div>
            <h3 className="text-2xl text-white font-bold mb-4">Choose your weapon.</h3>
            <p className="text-sm text-slate-400 mb-8 font-light">The Inflation Beast eats 6% of idle cash. How will you deploy your remaining ₹{income - burn} energy?</p>
            
            <div className="space-y-4">
              <button onClick={() => setStep(4)} className="w-full p-4 border border-white/10 rounded-xl hover:border-cyan-400 hover:bg-cyan-500/10 text-left transition-all group flex items-center justify-between">
                <div>
                  <div className="text-white font-bold group-hover:text-cyan-400">Equity Blade (Aggressive)</div>
                  <div className="text-xs text-slate-400">High Risk, High Reward</div>
                </div>
                <Crosshair className="text-slate-600 group-hover:text-cyan-400" />
              </button>
              <button onClick={() => setStep(4)} className="w-full p-4 border border-white/10 rounded-xl hover:border-amber-400 hover:bg-amber-500/10 text-left transition-all group flex items-center justify-between">
                <div>
                  <div className="text-white font-bold group-hover:text-amber-400">Hybrid Armor (Balanced)</div>
                  <div className="text-xs text-slate-400">Medium Risk, Stable Growth</div>
                </div>
                <Shield className="text-slate-600 group-hover:text-amber-400" />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center animate-in fade-in zoom-in duration-500 max-w-xl mx-auto">
            <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Core Calibrated.</h2>
            <p className="text-lg text-slate-400 font-light mb-10 leading-relaxed">
              Your data has been injected into the RAG Matrix. The AI will now generate your personalized wealth roadmap based on elite financial literature.
            </p>
            <button onClick={() => {
              setToast("Profile successfully calibrated.");
              onNavigate('dashboard');
            }} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all">
              Return to Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full -m-4 md:-m-8 h-[calc(100vh-2rem)] bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Cinematic ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full px-4">
        {renderContent()}
      </div>
    </div>
  );
};

const MasterclassCinema = ({ onNavigate }) => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSlider, setTimeSlider] = useState(1);

  // Cinematic Data Sequence
  const scenes = [
    {
      title: "Episode I: The Silent Drain",
      narrative: "You leave your capital idle. You think it is safe. But every second, a phantom force known as 'Inflation' drains 6% of its purchasing power annually.",
      visual: (
        <div className="relative flex items-center justify-center h-64">
          <div className="absolute w-48 h-48 bg-red-600/20 rounded-full blur-[50px] animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div className="text-red-500 font-mono text-6xl tracking-tighter opacity-80">-6%</div>
        </div>
      ),
      actionText: "Initiate Countermeasures"
    },
    {
      title: "The Weapon: The Compound Protocol",
      narrative: "Centuries ago, mathematicians discovered a glitch in the financial matrix. They called it Compound Interest. It doesn't just grow your energy; it forces your energy to create its own energy.",
      visual: (
        <div className="relative flex items-center justify-center h-64">
          <div className="absolute w-48 h-48 bg-emerald-500/20 rounded-full blur-[40px]"></div>
          <div className="w-16 h-16 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.8)] animate-bounce" style={{animationDuration: '2s'}}></div>
        </div>
      ),
      actionText: "Access Simulator"
    },
    {
      title: "Interactive Sequence: Time Dilation",
      narrative: "See the Protocol in action. Base capital: ₹100,000 at 12% annual return. Use the timeline slider to fast-forward through time and observe the exponential curve.",
      visual: (
        <div className="w-full max-w-2xl mx-auto space-y-8 mt-8">
          <div className="flex justify-between items-end border-b border-white/20 pb-4">
            <div>
              <div className="text-slate-400 text-sm font-mono uppercase">Time Elapsed</div>
              <div className="text-3xl font-bold text-white">{timeSlider} Years</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm font-mono uppercase">Core Value</div>
              <div className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                ₹ {Math.round(100000 * Math.pow(1.12, timeSlider)).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>Year 1</span>
              <span>Year 30</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={timeSlider}
              onChange={(e) => setTimeSlider(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
            {/* Visualizing Principal vs Compound - simplified proportional representation */}
            <div className="bg-blue-500 h-full" style={{ width: `${Math.max(10, 100 / Math.pow(1.12, timeSlider))}%`}}></div>
            <div className="bg-emerald-500 h-full flex-1"></div>
          </div>
          <div className="flex gap-4 text-xs font-mono justify-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Original Capital</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Generated Energy</div>
          </div>
        </div>
      ),
      actionText: "Complete Training"
    }
  ];

  const currentScene = scenes[sceneIndex];

  const handleNext = () => {
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex(prev => prev + 1);
    } else {
      onNavigate('dashboard');
    }
  };

  if (!isPlaying) {
    return (
      <div className="absolute inset-0 bg-[#050505] flex items-center justify-center z-50 overflow-hidden">
        {/* Cinematic letterbox bars */}
        <div className="absolute top-0 inset-x-0 h-24 bg-black z-20"></div>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-black z-20"></div>
        
        <div className="text-center z-30 max-w-2xl px-6 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold mb-6 border border-amber-500/20 uppercase tracking-widest">
            <Film size={14} /> FinAI Cinema
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">The Compound Protocol</h1>
          <p className="text-lg text-slate-400 font-light mb-10">
            An interactive masterclass on bending time and wealth. Recommended viewing environment: Dark room, full focus.
          </p>
          <button 
            onClick={() => setIsPlaying(true)}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <Play size={18} className="fill-black" /> Begin Playback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#020202] flex flex-col z-50 overflow-hidden text-white font-sans">
      {/* Cinematic letterbox top */}
      <div className="h-16 md:h-24 bg-black w-full flex-shrink-0 flex items-center justify-between px-8 border-b border-white/5 z-20">
        <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">FinQuest Masterclass</div>
        <div className="flex gap-2">
          {scenes.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= sceneIndex ? 'w-8 bg-emerald-500' : 'w-4 bg-white/10'}`}></div>
          ))}
        </div>
        <button onClick={() => onNavigate('dashboard')} className="text-slate-500 hover:text-white font-mono text-xs flex items-center gap-2 transition-colors">
          Exit Simulator <X size={14} />
        </button>
      </div>

      {/* Movie Canvas */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div key={sceneIndex} className="max-w-4xl w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <h2 className="text-sm md:text-base text-emerald-400 font-mono uppercase tracking-[0.3em] mb-6">
            {currentScene.title}
          </h2>
          
          <div className="min-h-[250px] mb-12">
            {currentScene.visual}
          </div>

          <p className="text-xl md:text-3xl font-light text-slate-300 leading-relaxed max-w-3xl mx-auto text-balance">
            {currentScene.narrative}
          </p>
        </div>
      </div>

      {/* Cinematic letterbox bottom */}
      <div className="h-24 md:h-32 bg-black w-full flex-shrink-0 flex items-center justify-center border-t border-white/5 z-20">
         <button 
            onClick={handleNext}
            className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-sm tracking-widest uppercase rounded-full transition-all flex items-center gap-3 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {currentScene.actionText} <ChevronDown size={16} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
          </button>
      </div>
    </div>
  );
};

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi Alex! I am analyzing your recent spending. Ask me anything about your budget, tax regimes, or financial concepts!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Mock LLM Response
    setTimeout(() => {
      setIsTyping(false);
      let reply = "I'm analyzing your context... Based on 'The Psychology of Money', wealth is what you don't see. Is there a specific transaction you need help with?";
      if (userMsg.toLowerCase().includes('tax')) {
        reply = "Based on a ₹85,000/mo influx, if you claim HRA and ₹1.5L under 80C, the **Old Tax Regime** saves you approx ₹12,400/yr compared to the New Regime.";
      } else if (userMsg.toLowerCase().includes('score')) {
        reply = "Your Core Health score is **78/100**. To push it over 80, reduce dining expenses and route ₹5,000 into your emergency reserve.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white relative">
            <Bot size={16} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-[#121212] rounded-full"></div>
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">FinAI Advisor</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">RAG Engine Online</div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-black/10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white mt-1">
                <Bot size={12} />
              </div>
            )}
            <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm'
            }`}>
              {/* Simple bold parser for mock response */}
              {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-6 h-6 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white mt-1">
                <Bot size={12} />
              </div>
              <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-1 w-16">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about expenses, tax..." 
            className="w-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <button type="submit" className="absolute right-1.5 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors">
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

const AppShell = ({ children, currentView, onNavigate, theme, toggleTheme, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <PieChart size={20} /> },
    { id: 'ocr', label: 'Receipt Scanner', icon: <Camera size={20} />, badge: 'New' },
    { id: 'transactions', label: 'Transactions', icon: <List size={20} /> },
    { id: 'tax', label: 'Tax Planner', icon: <FileText size={20} /> },
    { id: 'finquest', label: 'FinQuest RPG', icon: <Gamepad2 size={20} /> },
    { id: 'cinema', label: 'Cinema Masterclass', icon: <Film size={20} /> },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar (Desktop) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-white/5 flex flex-col transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-black font-bold">
              <Wallet size={18} />
            </div>
            <span className="font-bold tracking-wide dark:text-white">FinAI</span>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              <div className="w-6 text-center mr-2 flex justify-center">{item.icon}</div>
              {item.label}
              {item.badge && <span className="ml-auto bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-4">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Theme
            </span>
          </button>
          <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={onLogout}>
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.tier} Tier</div>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] z-20">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-black font-bold">
                    <Wallet size={16} />
                </div>
                <span className="font-bold dark:text-white">FinAI</span>
            </div>
            <button className="text-slate-600 dark:text-slate-300 p-2" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
          {children}
        </main>

        {/* Floating Chat Button & Window */}
        <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50"
        >
          {chatOpen ? <X size={24} /> : <Bot size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
};

const PlaceholderView = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in">
    {icon}
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">{title}</h2>
    <p className="mt-2">This module is currently under construction.</p>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Handle document class for global Tailwind dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  // View Router
  if (!user && (currentView === 'landing' || currentView === 'login' || currentView === 'signup')) {
    if (currentView === 'landing') return <LandingPage onNavigate={setCurrentView} />;
    return <AuthPage mode={currentView} onNavigate={setCurrentView} onLogin={handleLogin} />;
  }

  // Force login if accessing app routes without auth
  if (!user && currentView !== 'finquest') {
     setCurrentView('landing');
     return null;
  }

  // Special full-screen case for FinQuest if accessed from landing (demo mode)
  if (!user && currentView === 'finquest') {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <button onClick={() => setCurrentView('landing')} className="absolute top-6 left-6 z-50 text-slate-400 hover:text-white">
          <ArrowRight size={24} className="rotate-180" />
        </button>
        <FinQuest onNavigate={() => setCurrentView('signup')} setToast={setToastMessage} />
      </div>
    );
  }

  const renderAppContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      case 'ocr': return <OCRScanner setToast={setToastMessage} />;
      case 'finquest': return <FinQuest onNavigate={setCurrentView} setToast={setToastMessage} />;
      case 'cinema': return <MasterclassCinema onNavigate={setCurrentView} />;
      case 'transactions': return <PlaceholderView title="Transaction History" icon={<List size={48} />} />;
      case 'tax': return <PlaceholderView title="Indian Tax Planner" icon={<FileText size={48} />} />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <AppShell 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        theme={theme} 
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      >
        {renderAppContent()}
      </AppShell>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </>
  );
}