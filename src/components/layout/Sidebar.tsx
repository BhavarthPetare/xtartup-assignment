"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {label: "Companies", href:"/companies"},
    {label: "Lists", href:"/lists"},
    {label: "Saved Searches", href:"/saved"},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-700 bg-linear-to-b from-slate-800 to-slate-900 p-6">
      <Link href={'/'}>
        <h1 className="text-2xl font-bold tracking-tight mb-8 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          VC Scout
        </h1>
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}