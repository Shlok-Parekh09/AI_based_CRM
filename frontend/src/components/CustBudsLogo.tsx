import React, { useId } from "react";

export function CustBudsLogoIcon({ className = "w-9 h-9" }: { className?: string }) {
    const reactId = useId().replace(/:/g, "");
    const badgeGradientId = `custbuds-badge-${reactId}`;
    const linkGradientId = `custbuds-link-${reactId}`;

    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
            <defs>
                <linearGradient id={badgeGradientId} x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#0f172a" />
                    <stop offset="0.52" stopColor="#0284c7" />
                    <stop offset="1" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id={linkGradientId} x1="20" y1="38" x2="49" y2="38" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#0ea5e9" />
                    <stop offset="1" stopColor="#14b8a6" />
                </linearGradient>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="18" fill={`url(#${badgeGradientId})`} />
            <path
                d="M18 19C18 14.6 21.6 11 26 11H38C44.6 11 50 16.4 50 23V29C50 35.6 44.6 41 38 41H29L20 49V41H18C13.6 41 10 37.4 10 33V19C10 14.6 13.6 11 18 11Z"
                fill="white"
                fillOpacity="0.97"
            />
            <circle cx="25.5" cy="23.5" r="4.75" fill="#0ea5e9" />
            <circle cx="38.5" cy="23.5" r="4.75" fill="#14b8a6" />
            <path
                d="M20.5 38C21.9 33.8 25.2 31.5 29.2 31.5C32.7 31.5 35.4 32.8 37.2 35.6C39 32.8 41.7 31.5 45.1 31.5C49 31.5 52.2 33.8 53.5 38"
                stroke={`url(#${linkGradientId})`}
                strokeWidth="3.4"
                strokeLinecap="round"
            />
            <path
                d="M28.3 24.7C29.9 24.7 31.3 25.3 32.6 26.6C33.9 25.3 35.4 24.7 37 24.7"
                stroke="#0f172a"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.34"
            />
            <circle cx="46.5" cy="17" r="3.5" fill="#f97316" />
            <path d="M46.5 14.4V19.6M43.9 17H49.1" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export function CustBudsLogoLockup() {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <CustBudsLogoIcon />
            <div className="min-w-0">
                <div className="text-[15px] font-black leading-none tracking-[0.1em]">
                    <span className="text-white">Cust</span>
                    <span className="text-sky-300">Buds</span>
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
                    Customers as buddies
                </div>
            </div>
        </div>
    );
}
