// pages/index.js
import { useState } from 'react';
import DreamCard from '../components/DreamCard';


export default function Home() {
const [q, setQ] = useState('');
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);


async function search(e) {
e && e.preventDefault();
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
<div className="min-h-screen p-6 max-w-3xl mx-auto">
<h1 className="text-3xl font-bold mb-4">เว็บทำนายฝัน</h1>
<form onSubmit={search} className="flex gap-2 mb-4">
<input
value={q}
onChange={e => setQ(e.target.value)}
placeholder="พิมพ์คำที่เกี่ยวกับฝัน (เช่น งู, รถ, น้ำ)..."
className="flex-1 p-2 border rounded"
/>
<button className="px-4 py-2 border rounded" disabled={loading}>ค้นหา</button>
</form>


{loading && <p>กำลังค้นหา...</p>}


<div className="grid gap-3">
{results.length === 0 && !loading && <p>ไม่มีผลลัพธ์</p>}
{results.map((r, i) => (
<DreamCard key={i} dream={r} />
))}
</div>
</div>
);
}
