// NOTE: titles use <div role="heading"> because the default Vite rules in index.css
// restyle every <h1>/<h2> and would override the Tailwind classes below.

export default function Dashboard({ onNavigate, theme = 'dark', profile }) {
  const isDark = theme === 'dark';
  const codename = profile?.codename?.trim();

  const features = [
    { id: 'calculator', title: 'The Compound Protocol', description: 'Enter the wealth simulator.' },
    { id: 'ocr', title: 'Financial OCR', description: 'Scan and extract document data.' },
    {
      id: 'profile',
      title: 'Operative Profile',
      description: codename ? `Dossier on file for ${codename}.` : 'Set up your dossier and readiness score.',
    },
  ];

  return (
    <div
      className={`min-h-screen p-10 flex flex-col items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-black text-white' : 'bg-orange-50 text-stone-900'
      }`}
    >
      <div
        role="heading"
        aria-level={1}
        className={`text-4xl font-mono tracking-widest mb-3 uppercase ${
          isDark ? 'text-emerald-400' : 'text-orange-600'
        }`}
      >
        Main Terminal
      </div>

      <p className={`mb-12 text-sm ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
        {codename ? `Welcome back, ${codename}.` : 'Choose a module to begin.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {features.map((feature) => (
          <button
            type="button"
            key={feature.id}
            className={`border p-8 rounded-xl cursor-pointer flex flex-col items-center text-center group transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isDark
                ? 'border-gray-800 bg-gray-950 hover:border-emerald-500 hover:bg-gray-900 focus-visible:outline-emerald-400'
                : 'border-orange-200 bg-white hover:border-orange-500 hover:bg-orange-50 focus-visible:outline-orange-500'
            }`}
            onClick={() => onNavigate(feature.id)}
          >
            <span
              className={`text-xl font-bold mb-3 transition-colors ${
                isDark ? 'text-white group-hover:text-emerald-400' : 'text-stone-900 group-hover:text-orange-600'
              }`}
            >
              {feature.title}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>{feature.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
