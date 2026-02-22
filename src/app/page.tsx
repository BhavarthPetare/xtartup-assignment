import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Companies", value: "15+", icon: "🏢" },
    { label: "Industries", value: "8+", icon: "🏭" },
    { label: "Funding Stages", value: "5+", icon: "💰" },
    { label: "Global Reach", value: "6+ Countries", icon: "🌍" },
  ];

  const features = [
    {
      icon: "🔍",
      title: "Smart Search & Filter",
      description: "Find companies by sector, stage, location with advanced filters",
    },
    {
      icon: "📝",
      title: "Add Notes & Insights",
      description: "Keep track of your thoughts and observations about each company",
    },
    {
      icon: "✨",
      title: "AI-Powered Enrichment",
      description: "Get instant AI-generated summaries and insights from company websites",
    },
    {
      icon: "📋",
      title: "Organize into Lists",
      description: "Create custom lists to organize companies for different campaigns",
    },
    {
      icon: "💾",
      title: "Save Searches",
      description: "Save your search queries and reload them anytime",
    },
    {
      icon: "🚀",
      title: "Track Growth",
      description: "Monitor companies' growth and funding milestones",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Discover & Track
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Startups</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Explore 15+ innovative companies across diverse sectors. Enrich your database with AI-powered insights, 
            organize companies into custom lists, and track growth in one powerful platform.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/companies">
              <button className="px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                Browse Companies →
              </button>
            </Link>
            <Link href="/lists">
              <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition-all duration-300">
                View Lists
              </button>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Powerful Features</h2>
          <p className="text-slate-300 text-center mb-16 text-lg">Everything you need to research and track startups</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to explore?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Start discovering innovative companies and building your network today.
          </p>
          <Link href="/companies">
            <button className="px-10 py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
              Get Started Now →
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>© 2026 Startup Discovery. Discover amazing companies worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
