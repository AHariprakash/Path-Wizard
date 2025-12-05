import { Link } from "react-router-dom";

const DOMAINS = [
  {
    slug: "web",
    title: "Full-Stack",
    icon: "🕸️",
    description: "Master everything from frontend to backend with modern stacks.",
  },
  {
    slug: "cloud",
    title: "Cloud",
    icon: "☁️",
    description: "Dive into deployment, compute, DevOps, and containers.",
  },
  {
    slug: "database",
    title: "Databases",
    icon: "🗄️",
    description: "Design scalable storage solutions and learn data modeling.",
  },
];

export default function Home() {
  return (
    <div className="transition-opacity duration-700 ease-out">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 py-20 text-white text-center shadow-lg mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Design Your Career Roadmap
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl mb-8 font-light">
          Pick a domain, select skills and steps, and track progress with polished interactive tools.
        </p>
        <Link
          to="/domains"
          className="inline-block bg-white/90 text-indigo-700 font-semibold px-8 py-3 rounded-xl text-lg shadow hover:bg-white hover:animate-pulse transition"
        >
          Explore Domains
        </Link>
      </div>

      {/* Domain Cards */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        {DOMAINS.map(({ slug, title, icon, description }) => (
          <Link
            to={`/domains/${slug}/stack`}
            tabIndex="0"
            key={slug}
            className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform transition hover:scale-105 hover:shadow-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            aria-label={`Explore ${title} domain`}
          >
            <div
              className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none"
              aria-hidden="true"
            >
              {icon}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500">{description}</p>
          </Link>
        ))}
      </div>

      {/* How it Works Section */}
      <section className="bg-white py-12 px-6 max-w-4xl mx-auto rounded-2xl shadow flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        <div className="flex-1 text-center">
          <div className="text-4xl mb-3 animate-bounce motion-reduce:animate-none">🛠️</div>
          <div className="font-semibold mb-1">Build Your Stack</div>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Choose domain skills step by step, with instant role insights.
          </p>
        </div>
        <div className="flex-1 text-center">
          <div className="text-4xl mb-3 animate-bounce motion-reduce:animate-none [animation-delay:.15s]">📈</div>
          <div className="font-semibold mb-1">Track Progress</div>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Get personalized scores, suggestions, and downloadable action plans.
          </p>
        </div>
        <div className="flex-1 text-center">
          <div className="text-4xl mb-3 animate-bounce motion-reduce:animate-none [animation-delay:.3s]">🚀</div>
          <div className="font-semibold mb-1">Achieve Goals</div>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Map out your path and move confidently towards your tech career.
          </p>
        </div>
      </section>
    </div>
  );
}
