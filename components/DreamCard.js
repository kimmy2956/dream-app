export default function DreamCard({ dream }) {
  return (
    <article
      className="relative overflow-hidden p-6 rounded-2xl border border-white/20 bg-white/10
                 shadow-md hover:shadow-xl hover:bg-white/20 backdrop-blur-md
                 transition-all duration-300 animate-fadeIn"
    >
      {/* เอฟเฟกต์เรืองแสงขอบ */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500" />

      {/* เนื้อหา */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-indigo-300 drop-shadow-md mb-2">
          {dream.title || dream.keyword}
        </h3>

        <p className="text-gray-100 leading-relaxed mb-3">
          {dream.prediction || dream.meaning || dream.description}
        </p>

        {dream.tags && (
          <small className="text-sm text-gray-400">
            🔖 <span className="italic">แท็ก:</span> {dream.tags}
          </small>
        )}
      </div>
    </article>
  );
}

// 💫 เพิ่ม animation fadeIn ถ้ายังไม่มีในโปรเจ็กต์
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
