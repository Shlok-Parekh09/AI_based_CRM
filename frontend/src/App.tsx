import { useState, useRef, useEffect } from "react";

// 1. Added the TableRow type to fix the TypeScript indexing conflicts globally
type TableRow = {
    id: number;
    [key: string]: any;
};

/* ───────── Icons ───────── */
const ContactsIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);
const CompaniesIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
            clipRule="evenodd"
        />
    </svg>
);
const SearchIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
        />
    </svg>
);
const ChevronDownIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);
const XIcon = ({ size = "w-4 h-4" }: { size?: string }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={size}>
        <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);
const ExternalLinkIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3 h-3 inline ml-0.5 opacity-70"
    >
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);

const GmailIcon = () => (
    <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            fill="#F2F2F2"
        />
        <path d="M2 6l10 7 10-7" stroke="#EA4335" strokeWidth="0" fill="none" />
        <path
            d="M2 6.5L12 13l10-6.5V18a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z"
            fill="#4285F4"
            opacity="0"
        />
        <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="2"
            fill="white"
            stroke="#E0E0E0"
            strokeWidth="0.5"
        />
        <path
            d="M2 6l10 7.5L22 6"
            fill="none"
            stroke="#EA4335"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path d="M2 6v12h20V6L12 13.5 2 6z" fill="none" />
        <text
            x="5"
            y="17"
            fontSize="7"
            fontWeight="bold"
            fill="#4285F4"
            fontFamily="Arial,sans-serif"
        >
            G
        </text>
        <path d="M2 6l10 7.5L22 6" fill="#EA4335" opacity="0.15" />
    </svg>
);

const HubSpotLogoIcon = () => (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FF7A59" />
        <path
            d="M20 10.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5H10.5c-1.1 0-2 .9-2 2s.9 2 2 2H16v2c0 1.1.9 2 2 2s2-.9 2-2V10.5z"
            fill="white"
        />
        <circle cx="22" cy="10" r="2.5" fill="white" />
    </svg>
);

/* ───────── Editable Cell ───────── */
function EditableCell({ value, onChange, className = "", link = false }: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    link?: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [local, setLocal] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocal(value);
    }, [value]);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    const commit = () => {
        setEditing(false);
        onChange(local);
    };

    if (editing) {
        return (
            <input
                ref={inputRef}
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") {
                        setLocal(value);
                        setEditing(false);
                    }
                }}
                className="border border-blue-400 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-24"
            />
        );
    }
    return (
        <span
            onDoubleClick={() => {
                setLocal(value);
                setEditing(true);
            }}
            title="Double-click to edit"
            className={`cursor-text rounded px-0.5 py-0.5 hover:bg-blue-50 transition-colors inline-block ${link ? "text-teal-600 hover:underline" : ""
                } ${className}`}
        >
            {value && value !== "--" ? (
                <>
                    {value}
                    {link && <ExternalLinkIcon />}
                </>
            ) : (
                <span className="text-gray-300 select-none">--</span>
            )}
        </span>
    );
}

/* ───────── Create Company Modal ───────── */
function CreateCompanyModal({ onClose, onSave }: { onClose: () => void; onSave: (form: any) => void; }) {
    const [form, setForm] = useState({
        domain: "",
        name: "",
        owner: "",
        companySize: "",
        type: "",
        city: "",
        state: "",
    });

    const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
        >
            <div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Create Company
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
                    >
                        <XIcon size="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                            Company domain name
                        </label>
                        <input
                            autoFocus
                            value={form.domain}
                            onChange={set("domain")}
                            className="w-full border-2 border-blue-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                            Company name
                        </label>
                        <input
                            value={form.name}
                            onChange={set("name")}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white transition-colors"
                        />
                    </div>

                    {!form.domain && !form.name && (
                        <p className="text-xs text-gray-400 text-center py-1 bg-gray-50 rounded-lg px-4">
                            Start by entering a domain name, an account name, or both.
                        </p>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                            Company owner
                        </label>
                        <input
                            value={form.owner}
                            onChange={set("owner")}
                            placeholder="Enter owner name"
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                            Company Size
                        </label>
                        <div className="relative">
                            <select
                                value={form.companySize}
                                onChange={set("companySize")}
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 appearance-none focus:outline-none focus:border-blue-400 bg-white"
                            >
                                <option value=""></option>
                                <option>1-10 employees</option>
                                <option>11-50 employees</option>
                                <option>51-200 employees</option>
                                <option>201-500 employees</option>
                                <option>501-1000 employees</option>
                                <option>1001-5000 employees</option>
                                <option>5000+ employees</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                            Type
                        </label>
                        <div className="relative">
                            <select
                                value={form.type}
                                onChange={set("type")}
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 appearance-none focus:outline-none focus:border-blue-400 bg-white"
                            >
                                <option value=""></option>
                                <option>Prospect</option>
                                <option>Partner</option>
                                <option>Customer</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            City
                        </label>
                        <input
                            value={form.city}
                            onChange={set("city")}
                            className="w-full border-b border-gray-300 px-0 py-1.5 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            State/Region
                        </label>
                        <div className="relative border-b border-gray-300">
                            <select
                                value={form.state}
                                onChange={set("state")}
                                className="w-full py-1.5 text-sm text-gray-400 appearance-none focus:outline-none bg-transparent"
                            >
                                <option value=""></option>
                                <option>Maharashtra</option>
                                <option>California</option>
                                <option>New York</option>
                                <option>Texas</option>
                            </select>
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={() => {
                            if (form.name || form.domain) {
                                onSave(form);
                                onClose();
                            } else alert("Please enter a company name or domain.");
                        }}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors hover:opacity-90"
                        style={{ background: "#1a1f2e" }}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => {
                            if (form.name || form.domain) {
                                onSave(form);
                                setForm({
                                    domain: "",
                                    name: "",
                                    owner: "",
                                    companySize: "",
                                    type: "",
                                    city: "",
                                    state: "",
                                });
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white transition-colors"
                    >
                        Create and add another
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-800 border-2 border-gray-800 rounded-md hover:bg-gray-100 transition-colors ml-auto"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ───────── CSV/Excel Import Modal ───────── */
function ImportModal({ columns, onClose, onImport }: {
    columns: string[];
    onClose: () => void;
    onImport: (rows: Record<string, string>[]) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState<{ headers: string[]; rows: string[][] } | null>(null);

    const parseCSV = (text: string) => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return null;
        const headers = lines[0].split(",").map(s => s.trim().replace(/^"|"$/g, ""));
        const rows = lines.slice(1).map(l => l.split(",").map(s => s.trim().replace(/^"|"$/g, "")));
        return { headers, rows };
    };

    const handleFile = async (file: File) => {
        setError(""); setPreview(null);
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "csv") {
            const text = await file.text();
            const parsed = parseCSV(text);
            if (!parsed) { setError("CSV must have a header row and at least one data row."); return; }
            setPreview(parsed);
        } else if (ext === "xlsx" || ext === "xls") {
            setError("Excel support: please export your file as CSV first, then import.");
        } else {
            setError("Only .csv or .xlsx/.xls files are supported.");
        }
    };

    const mapAndImport = () => {
        if (!preview) return;
        const { headers, rows } = preview;
        const colMap: Record<string, number> = {};
        columns.forEach(col => {
            const colLower = col.toLowerCase().replace(/[^a-z0-9]/g, "");
            const idx = headers.findIndex(h => {
                const hLower = h.toLowerCase().replace(/[^a-z0-9]/g, "");
                return hLower === colLower || hLower.includes(colLower) || colLower.includes(hLower);
            });
            if (idx >= 0) colMap[col] = idx;
        });
        const mapped: Record<string, string>[] = rows.map(row => {
            const rec: Record<string, string> = {};
            columns.forEach(col => {
                const idx = colMap[col];
                rec[col] = idx !== undefined ? (row[idx] || "--") : "--";
            });
            return rec;
        });
        onImport(mapped);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-900">Import from CSV</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100"><XIcon size="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <p className="text-xs text-gray-500">Upload a <strong>CSV</strong> file. The first row must be a header row matching the table columns (e.g. <em>{columns.slice(0, 3).join(", ")}</em>…). Data rows below will be auto-sorted into the correct columns.</p>
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mx-auto mb-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-sm text-gray-500">Click or drag & drop a <strong>CSV</strong> or <strong>Excel</strong> file here</p>
                        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    </div>
                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    {preview && (
                        <div className="space-y-2">
                            <p className="text-xs text-green-600 font-semibold">✓ Detected {preview.rows.length} data row(s) with columns: {preview.headers.join(", ")}</p>
                            <div className="overflow-x-auto border border-gray-200 rounded">
                                <table className="text-xs w-full min-w-max">
                                    <thead><tr className="bg-gray-50 border-b">{preview.headers.map(h => <th key={h} className="px-2 py-1.5 text-left text-gray-500 font-medium whitespace-nowrap">{h}</th>)}</tr></thead>
                                    <tbody>{preview.rows.slice(0, 4).map((r, i) => <tr key={i} className="border-b border-gray-100">{r.map((c, j) => <td key={j} className="px-2 py-1 text-gray-700 whitespace-nowrap">{c}</td>)}</tr>)}</tbody>
                                </table>
                            </div>
                            {preview.rows.length > 4 && <p className="text-xs text-gray-400">…and {preview.rows.length - 4} more rows</p>}
                        </div>
                    )}
                </div>
                <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button onClick={mapAndImport} disabled={!preview} className="px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors hover:opacity-90 disabled:opacity-40" style={{ background: "#1a1f2e" }}>Import</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white">Cancel</button>
                </div>
            </div>
        </div>
    );
}

/* ───────── Create Contact Modal ───────── */
function CreateContactModal({ onClose, onSave }: { onClose: () => void; onSave: (form: any) => void; }) {
    const [form, setForm] = useState({ email: "", firstName: "", lastName: "", owner: "Shlok Parekh", jobTitle: "", phone: "" });
    const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));
    const showHint = !form.email && !form.firstName && !form.lastName;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Create Contact</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100"><XIcon size="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">Email</label>
                        <input autoFocus value={form.email} onChange={set("email")} className="w-full border-2 border-blue-400 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">First name</label>
                        <input value={form.firstName} onChange={set("firstName")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">Last name</label>
                        <input value={form.lastName} onChange={set("lastName")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Contact owner</label>
                        <input value={form.owner} onChange={set("owner")} placeholder="Enter owner name"
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400 transition-colors" />
                    </div>
                    {showHint && (
                        <p className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-lg px-4">Start by entering the Contact's name, email, or both.</p>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Job title</label>
                        <input value={form.jobTitle} onChange={set("jobTitle")} className="w-full border-b border-gray-300 px-0 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Phone number</label>
                        <input value={form.phone} onChange={set("phone")} type="tel" className="w-full border-b border-gray-300 px-0 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-transparent" />
                    </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button onClick={() => { if (form.email || form.firstName || form.lastName) { onSave(form); onClose(); } else alert("Please enter a name or email."); }}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-md hover:opacity-90" style={{ background: "#1a1f2e" }}>Create</button>
                    <button onClick={() => { if (form.email || form.firstName || form.lastName) { onSave(form); setForm({ email: "", firstName: "", lastName: "", owner: "Shlok Parekh", jobTitle: "", phone: "" }); } }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white">Create and add another</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-800 border-2 border-gray-800 rounded-md hover:bg-gray-100 ml-auto">Cancel</button>
                </div>
            </div>
        </div>
    );
}

/* ───────── Contacts View ───────── */
const CONTACTS_KEY = "custbuds_contacts";
const CONTACTS_COLS_KEY = "custbuds_contacts_cols";

function ContactsView() {
    const [activeTab, setActiveTab] = useState("all");
    const [tableSearch, setTableSearch] = useState("");
    const [showImport, setShowImport] = useState(false);
    const [showCreateContact, setShowCreateContact] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const addBtnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [columns, setColumns] = useState<string[]>(() => {
        try { const s = sessionStorage.getItem(CONTACTS_COLS_KEY); return s ? JSON.parse(s) : ["Name", "Email", "Phone Number", "Contact owner"]; }
        catch { return ["Name", "Email", "Phone Number", "Contact owner"]; }
    });

    const [contacts, setContacts] = useState<TableRow[]>(() => {
        try {
            const s = sessionStorage.getItem(CONTACTS_KEY);
            return s ? JSON.parse(s) : [
                { id: 1, Name: "Brian Halligan (Sampl...)", Email: "bh@custbuds.com", "Phone Number": "--", "Contact owner": "No owner" },
                { id: 2, Name: "Maria Johnson (Samp...)", Email: "maria@custbuds.com", "Phone Number": "--", "Contact owner": "No owner" },
            ];
        } catch { return []; }
    });

    const update = (id: number, field: string, val: string) =>
        setContacts(cs => cs.map(c => c.id === id ? { ...c, [field]: val } : c));

    const deleteRow = (id: number) => setContacts(cs => cs.filter(c => c.id !== id));

    const deleteCol = (col: string) => {
        setColumns(cols => cols.filter(c => c !== col));
        setContacts(cs => cs.map(c => { const n = { ...c }; delete n[col]; return n; }));
    };

    // 3. Removed TS assertion here
    const handleImport = (rows: Record<string, string>[]) => {
        const newRows = rows.map((r, i) => ({ id: Date.now() + i, ...r }));
        setContacts(cs => [...cs, ...newRows]);
    };

    const handleSaveContact = (form: any) => {
        const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ") || form.email || "New Contact";
        setContacts(cs => [...cs, {
            id: Date.now(),
            "Name": fullName,
            "Email": form.email || "--",
            "Phone Number": form.phone || "--",
            "Contact owner": form.owner || "No owner",
        }]);
    };

    // Persist contacts & columns to sessionStorage on every change
    useEffect(() => { try { sessionStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts)); } catch {} }, [contacts]);
    useEffect(() => { try { sessionStorage.setItem(CONTACTS_COLS_KEY, JSON.stringify(columns)); } catch {} }, [columns]);

    const filtered = contacts.filter(c =>
        !tableSearch ||
        (c["Name"] || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
        (c["Email"] || "").toLowerCase().includes(tableSearch.toLowerCase())
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                addBtnRef.current && !addBtnRef.current.contains(e.target as Node)
            ) setShowAddMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            {showImport && <ImportModal columns={columns} onClose={() => setShowImport(false)} onImport={handleImport} />}
            {showCreateContact && <CreateContactModal onClose={() => setShowCreateContact(false)} onSave={handleSaveContact} />}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-0">
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-gray-600">Contacts <ChevronDownIcon /></button>
                    <div className="relative">
                        <button
                            ref={addBtnRef}
                            onClick={() => setShowAddMenu(v => !v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-90 select-none"
                            style={{ background: "#1a1f2e" }}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Add contacts <ChevronDownIcon />
                        </button>
                        {showAddMenu && (
                            <div ref={menuRef} className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-30 py-1 overflow-hidden">
                                <button onClick={() => { setShowAddMenu(false); setShowCreateContact(true); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Create new
                                </button>
                                <button onClick={() => { setShowAddMenu(false); setShowImport(true); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Import
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center border-b border-gray-200 px-4 mt-2 gap-0.5">
                    {[
                        { id: "all", label: "All contacts", badge: filtered.length },
                        { id: "my", label: "My contacts" },
                        { id: "unassigned", label: "Unassigned contacts" },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                            {tab.label}
                            {tab.badge !== undefined && (
                                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-semibold"
                                    style={{ background: activeTab === tab.id ? "#1a1f2e" : "#f3f4f6", color: activeTab === tab.id ? "white" : "#6b7280" }}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-wrap">
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                        <input type="text" placeholder="Search..." value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-orange-400 w-36" />
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Table view <ChevronDownIcon /></button>
                    <div className="flex items-center gap-1.5 ml-auto">
                        {["Edit columns", "Filters", "Sort", "Export", "Save"].map(l => (
                            <button key={l} className="px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">{l}</button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="w-10 px-4 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-orange-500" /></th>
                                {columns.map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                        <div className="flex items-center gap-1 group">
                                            {h}
                                            <button onClick={() => deleteCol(h)} title="Remove column"
                                                className="opacity-0 group-hover:opacity-100 ml-1 text-gray-400 hover:text-red-500 transition-opacity">
                                                <XIcon size="w-3 h-3" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                <th className="w-10 px-2 py-2.5"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id} className="border-b border-gray-100 hover:bg-orange-50/20 transition-colors group">
                                    <td className="px-4 py-3"><input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-orange-500" /></td>
                                    {columns.map((col, ci) => (
                                        <td key={col} className="px-4 py-3">
                                            {ci === 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-200"><HubSpotLogoIcon /></div>
                                                    <EditableCell value={c[col] || "--"} onChange={v => update(c.id, col, v)} link className="text-sm font-medium" />
                                                </div>
                                            ) : (
                                                <EditableCell value={c[col] || "--"} onChange={v => update(c.id, col, v)} className="text-sm text-gray-400" />
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-2 py-3">
                                        <button onClick={() => deleteRow(c.id)} title="Delete row"
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 rounded hover:bg-red-50">
                                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-sm text-gray-400">No contacts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <button className="px-2.5 py-1 text-xs font-medium text-gray-400" disabled>‹ Prev</button>
                        <button className="px-2.5 py-1 text-xs font-medium text-white rounded-md" style={{ background: "#FF7A59" }}>1</button>
                        <button className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">Next ›</button>
                    </div>
                    <button className="px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">25 per page <ChevronDownIcon /></button>
                </div>
            </div>
        </>
    );
}

/* ───────── Companies View ───────── */
function CompaniesView() {
    const [activeTab, setActiveTab] = useState("all");
    const [tableSearch, setTableSearch] = useState("");
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImport, setShowImport] = useState(false);

    const addBtnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [columns, setColumns] = useState<string[]>(() => {
        try { const s = sessionStorage.getItem("custbuds_company_cols"); return s ? JSON.parse(s) : ["Company name", "Company owner", "Create Date (GMT +5:30)", "Phone Number", "City", "Company Size", "Annual Revenue"]; }
        catch { return ["Company name", "Company owner", "Create Date (GMT +5:30)", "Phone Number", "City", "Company Size", "Annual Revenue"]; }
    });

    const [companies, setCompanies] = useState<TableRow[]>(() => {
        try {
            const s = sessionStorage.getItem("custbuds_companies");
            return s ? JSON.parse(s) : [{
                id: 1, "Company name": "", "Company owner": "No owner",
                "Create Date (GMT +5:30)": "Yesterday at 6:27 PM...",
                "Phone Number": "--", "City": "--", "Company Size": "--", "Annual Revenue": "--",
            }];
        } catch { return []; }
    });

    const update = (id: number, field: string, val: string) =>
        setCompanies(cs => cs.map(c => c.id === id ? { ...c, [field]: val } : c));

    const deleteRow = (id: number) => setCompanies(cs => cs.filter(c => c.id !== id));

    const deleteCol = (col: string) => {
        setColumns(cols => cols.filter(c => c !== col));
        setCompanies(cs => cs.map(c => { const n = { ...c }; delete n[col]; return n; }));
    };

    const handleSaveNew = (form: any) => {
        setCompanies(cs => [
            ...cs,
            {
                id: Date.now(),
                "Company name": form.name || form.domain || "New Company",
                "Company owner": form.owner || "No owner",
                "Create Date (GMT +5:30)": "Just now",
                "Phone Number": "--",
                "City": form.city || "--",
                "Company Size": form.companySize || "--",
                "Annual Revenue": "--",
            },
        ]);
    };

    // 5. Removed TS assertion here
    const handleImport = (rows: Record<string, string>[]) => {
        const newRows = rows.map((r, i) => ({ id: Date.now() + i, ...r }));
        setCompanies(cs => [...cs, ...newRows]);
    };

    // Persist companies & columns to sessionStorage on every change
    useEffect(() => { try { sessionStorage.setItem("custbuds_companies", JSON.stringify(companies)); } catch {} }, [companies]);
    useEffect(() => { try { sessionStorage.setItem("custbuds_company_cols", JSON.stringify(columns)); } catch {} }, [columns]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                addBtnRef.current && !addBtnRef.current.contains(e.target as Node)
            ) setShowAddMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = companies.filter(c =>
        !tableSearch || (c["Company name"] || "").toLowerCase().includes(tableSearch.toLowerCase())
    );

    return (
        <>
            {showCreateModal && <CreateCompanyModal onClose={() => setShowCreateModal(false)} onSave={handleSaveNew} />}
            {showImport && <ImportModal columns={columns} onClose={() => setShowImport(false)} onImport={handleImport} />}

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-0">
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-gray-600">
                        Companies <ChevronDownIcon />
                    </button>
                    <div className="relative">
                        <button
                            ref={addBtnRef}
                            onClick={() => setShowAddMenu((v) => !v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-90 select-none"
                            style={{ background: "#1a1f2e" }}
                        >
                            Add companies <ChevronDownIcon />
                        </button>
                        {showAddMenu && (
                            <div ref={menuRef} className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-30 py-1 overflow-hidden">
                                <button onClick={() => { setShowAddMenu(false); setShowCreateModal(true); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Create new
                                </button>
                                <button onClick={() => { setShowAddMenu(false); setShowImport(true); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Import
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center border-b border-gray-200 px-4 mt-2">
                    {[
                        { id: "all", label: "All companies", badge: filtered.length },
                        { id: "my", label: "My companies" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-1 py-2.5 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === tab.id
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                            {tab.badge !== undefined && (
                                <span
                                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-semibold"
                                    style={{
                                        background: activeTab === tab.id ? "#FFF0EC" : "#f3f4f6",
                                        color: activeTab === tab.id ? "#FF7A59" : "#6b7280",
                                    }}
                                >
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-orange-400 w-40"
                        />
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                        Table view <ChevronDownIcon />
                    </button>
                    <div className="flex items-center gap-1.5 ml-auto">
                        {["Edit columns", "Filters", "Sort", "Export", "Save"].map((l) => (
                            <button
                                key={l}
                                className="px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto border-t border-gray-100">
                    <table className="w-full min-w-max text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="w-10 px-4 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-orange-500" /></th>
                                {columns.map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                        <div className="flex items-center gap-1 group">
                                            {h}
                                            <button onClick={() => deleteCol(h)} title="Remove column"
                                                className="opacity-0 group-hover:opacity-100 ml-1 text-gray-400 hover:text-red-500 transition-opacity">
                                                <XIcon size="w-3 h-3" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                <th className="w-10 px-2 py-2.5"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(company => (
                                <tr key={company.id} className="border-b border-gray-100 hover:bg-orange-50/20 transition-colors group">
                                    <td className="px-4 py-3"><input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-orange-500" /></td>
                                    {columns.map((col, ci) => (
                                        <td key={col} className="px-4 py-3">
                                            {ci === 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: "#FF7A59" }}>
                                                        {(company[col] || "?")[0].toUpperCase()}
                                                    </div>
                                                    <EditableCell value={company[col] || "--"} onChange={v => update(company.id, col, v)} className="text-sm font-medium text-gray-900" />
                                                </div>
                                            ) : (
                                                <EditableCell value={company[col] || "--"} onChange={v => update(company.id, col, v)} className="text-sm text-gray-400" />
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-2 py-3">
                                        <button onClick={() => deleteRow(company.id)} title="Delete row"
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 rounded hover:bg-red-50">
                                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={columns.length + 2} className="px-4 py-4 text-center text-xs text-gray-400">
                                    Showing {filtered.length} {filtered.length === 1 ? "company" : "companies"} ·{" "}
                                    <span onClick={() => setShowImport(true)} className="text-orange-500 cursor-pointer hover:underline">Import more</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <button
                            className="px-2.5 py-1 text-xs font-medium text-gray-400"
                            disabled
                        >
                            ‹ Prev
                        </button>
                        <button
                            className="px-2.5 py-1 text-xs font-medium text-white rounded-md"
                            style={{ background: "#FF7A59" }}
                        >
                            1
                        </button>
                        <button className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">
                            Next ›
                        </button>
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                        25 per page <ChevronDownIcon />
                    </button>
                </div>
            </div>
        </>
    );
}

/* ───────── Root Dashboard ───────── */
export default function CRMDashboard() {
    const [bannerVisible, setBannerVisible] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [activeNav, setActiveNav] = useState("companies");

    const navItems = [
        { id: "contacts", label: "Contacts", icon: <ContactsIcon /> },
        { id: "companies", label: "Companies", icon: <CompaniesIcon /> },
    ];

    return (
        <div
            className="flex h-screen bg-gray-100 overflow-hidden"
            style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
        >
            <aside
                className="w-52 flex-shrink-0 flex flex-col"
                style={{ background: "#1a1f2e" }}
            >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <HubSpotLogoIcon />
                    <span className="text-white font-semibold text-sm tracking-wide">
                        CustBuds
                    </span>
                </div>
                <nav className="flex-1 py-4 space-y-0.5 px-2">
                    {navItems.map((item) => {
                        const isActive = activeNav === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 text-left ${isActive
                                    ? ""
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                                    }`}
                                style={
                                    isActive ? { background: "#FF7A59", color: "white" } : {}
                                }
                            >
                                <span className={isActive ? "text-white" : "text-gray-400"}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="flex items-center px-4 py-2.5 gap-4 border-b border-white/10 flex-shrink-0"
                    style={{ background: "#1a1f2e" }}
                >
                    <div className="w-36">
                        <span className="text-white text-xs font-semibold opacity-60 tracking-widest uppercase">
                            CRM
                        </span>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Search CustBuds"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 rounded-md text-sm text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-orange-400 transition-colors"
                                style={{ background: "#252b3b" }}
                            />
                        </div>
                    </div>
                    <div className="w-36 flex justify-end">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-300 hover:bg-white/5 transition-colors border border-white/10">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: "#FF7A59" }}
                            >
                                A
                            </div>
                            <span className="text-xs font-medium">Avataar</span>
                            <ChevronDownIcon />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-6 space-y-4 max-w-screen-xl mx-auto">
                        {bannerVisible && (
                            <div className="relative bg-white rounded-lg border border-gray-200 px-5 py-4 shadow-sm">
                                <button
                                    onClick={() => setBannerVisible(false)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                                >
                                    <XIcon />
                                </button>
                                <p className="text-sm font-bold text-gray-900 mb-1 pr-6">
                                    Connect your email to sync all your contacts and conversations
                                    in one place
                                </p>
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                    CustBuds uses this connection to organize communication history
                                    and enrich profiles with accurate job titles, locations, and
                                    more.
                                </p>
                                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <GmailIcon />
                                    Connect Gmail
                                </button>
                            </div>
                        )}

                        {activeNav === "contacts" ? <ContactsView /> : <CompaniesView />}
                    </div>
                </main>
            </div>
        </div>
    );
}