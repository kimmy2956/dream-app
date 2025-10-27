// components/DreamCard.js
export default function DreamCard({ dream }) {
return (
<article className="p-4 border rounded">
<h3 className="font-semibold">{dream.title || dream.keyword}</h3>
<p className="mt-2">{dream.prediction}</p>
<small className="block mt-2 text-sm text-gray-600">แท็ก: {dream.tags}</small>
</article>
);
}
