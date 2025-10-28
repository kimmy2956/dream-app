import { useState } from 'react';

export default function Home() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e && e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/dreams?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 drop-shadow-md">
        🔮 เว็บทำนายฝัน
      </h1>
      <p className="text-lg text-gray-300 mb-6 text-center max-w-lg">
        พิมพ์คำที่เกี่ยวกับความฝันของคุณ เช่น <span className="text-indigo-300">“งู”</span> หรือ <span className="text-indigo-300">“ฟันหลุด”</span>  
        แล้วมาดูกันว่าฝันของคุณหมายถึงอะไร
      </p>

      {/* Search bar */}
      <form
        onSubmit={search}
        className="w-full max-w-xl flex gap-3 bg-white/10 p-3 rounded-2xl shadow-lg backdrop-blur-sm"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="พิมพ์คำที่ฝัน..."
          className="flex-1 p-3 rounded-xl bg-transparent border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 text-white"
        />
        <button
          className={`px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-md hover:scale-105 transition-transform duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? '🔍 กำลังค้นหา...' : 'ค้นหา'}
        </button>
      </form>

      {/* Results */}
      <div className="mt-10 w-full max-w-2xl grid gap-5">
        {!loading && results.length === 0 && q && (
          <p className="text-center text-gray-400">ไม่พบคำทำนายสำหรับคำว่า “{q}”</p>
        )}

        {results.map((r, i) => (
          <div
            key={i}
            className="p-5 bg-white/10 rounded-2xl border border-white/20 shadow-md hover:bg-white/20 transition-all duration-300 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold text-indigo-300 mb-2">{r.title || 'คำทำนาย'}</h2>
            <p className="text-gray-200 leading-relaxed">{r.meaning || r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 💫 เพิ่ม animation fade-in นิดหน่อย (ถ้าใช้ Tailwind 3.2+)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.4s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

