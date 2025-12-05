import { Radar, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from "chart.js";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

export default function AnalyticsPanel({ scores, distribution, compatibility }){
const radarData = {
labels: ["Performance","Scalability","Learning","Demand"],
datasets: [{ label:"Scores", data:[scores.performance||0, scores.scalability||0, scores.learning||0, scores.demand||0], backgroundColor:"rgba(99,102,241,0.2)", borderColor:"#6366F1" }],
};
const barData = {
labels: Object.keys(distribution||{}),
datasets: [{ label:"Tools", data:Object.values(distribution||{}), backgroundColor:"#A78BFA" }],
};
const donutData = {
labels:["Compatibility"],
datasets:[{ data:[compatibility, 100-compatibility], backgroundColor:["#22C55E","#E5E7EB"] }],
};
return (
<div className="space-y-6">
<div className="rounded-2xl border bg-white p-4"><Radar data={radarData} /></div>
<div className="rounded-2xl border bg-white p-4"><Bar data={barData} /></div>
<div className="rounded-2xl border bg-white p-4"><Doughnut data={donutData} /></div>
</div>
);
}