export function CardSkeleton() {
return (
<div className="animate-pulse rounded-2xl border bg-white p-6">
<div className="h-4 w-40 bg-slate-200 rounded" />
<div className="mt-3 h-3 w-64 bg-slate-200 rounded" />
<div className="mt-2 h-3 w-56 bg-slate-200 rounded" />
</div>
);
}

export function ListSkeleton({ rows=3 }) {
return (
<div className="space-y-3">
{Array.from({length: rows}).map((_,i)=>(
<div key={i} className="animate-pulse h-10 bg-slate-200 rounded" />
))}
</div>
);
}