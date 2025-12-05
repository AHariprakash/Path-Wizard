export default function ProgressBar({ value=0, total=1 }){
const pct = Math.min(100, Math.round((value/Math.max(1,total))*100));
return (
<div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
<div className="h-full bg-indigo-600" style={{ width: pct + "%" }} />
</div>
);
}