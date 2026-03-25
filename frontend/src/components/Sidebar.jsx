import { SparklesIcon, HubSpotLogoIcon } from './Icons';

export default function Sidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { id: "ai-agent", label: "Sales Copilot", icon: <SparklesIcon /> },
  ];

  return (
    <aside className="w-52 flex-shrink-0 flex flex-col" style={{ background: "#1a1f2e" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <HubSpotLogoIcon />
        <span className="text-white font-semibold text-sm tracking-wide">HubSpot</span>
      </div>
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {navItems.map(item => {
          const isActive = activeNav === item.id;
          return (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 text-left ${isActive ? "" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}
              style={isActive ? { background: "#FF7A59", color: "white" } : {}}>
              <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}