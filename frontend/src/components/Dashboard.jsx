
export default function Dashboard({ onNavigate }) {
  const features = [
    { id: 'calculator', title: 'The Compound Protocol', description: 'Enter the wealth simulator.' },
    { id: 'ocr', title: 'Financial OCR', description: 'Scan and extract document data.' },
    { id: 'profile', title: 'Operative Profile', description: 'Access your system settings.' }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-mono text-emerald-400 tracking-widest mb-12 uppercase">
        Main Terminal
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {features.map((feature) => (
          <div 
            key={feature.id}
            className="border border-gray-800 bg-gray-950 hover:border-emerald-500 hover:bg-gray-900 transition-all p-8 rounded-xl cursor-pointer flex flex-col items-center text-center group"
            onClick={() => onNavigate(feature.id)}
          >
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              {feature.title}
            </h2>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
