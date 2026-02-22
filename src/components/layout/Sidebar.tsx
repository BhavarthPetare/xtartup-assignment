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
    <aside className="w-64 border-r bg-white p-6">
      <Link href={'/'}>
        <h1 className="text-2xl font-bold tracking-tight mb-8">
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
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition 
                ${
                  active
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}