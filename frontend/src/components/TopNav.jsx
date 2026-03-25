import { useState } from 'react';
import { SearchIcon, ChevronDownIcon } from './Icons';

export default function TopNav() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="flex items-center px-4 py-2.5 gap-4 border-b border-white/10 flex-shrink-0" style={{ background: "#1a1f2e" }}>
      <div className="w-36">
        <span className="text-white text-xs font-semibold opacity-60 tracking-widest uppercase">CRM</span>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
          <input type="text" placeholder="Search HubSpot" value={searchValue} onChange={e => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-md text-sm text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-orange-400 transition-colors"
            style={{ background: "#252b3b" }} />
        </div>
      </div>
      <div className="w-36 flex justify-end">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-300 hover:bg-white/5 transition-colors border border-white/10">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#FF7A59" }}>A</div>
          <span className="text-xs font-medium">Avataar</span>
          <ChevronDownIcon />
        </button>
      </div>
    </header>
  );
}