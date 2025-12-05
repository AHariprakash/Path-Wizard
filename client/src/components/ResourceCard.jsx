export default function ResourceCard({ title, tag="Resource", description="Explore curated content." }) {
return (
<div className="rounded-2xl border bg-white p-5 shadow-sm">
<div className="text-xs text-indigo-700 bg-indigo-50 rounded-full inline-block px-2 py-0.5">{tag}</div>
<h3 className="mt-2 font-semibold">{title}</h3>
<p className="text-slate-600 text-sm">{description}</p>
</div>
);
}