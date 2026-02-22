"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { companies } from "@/lib/mock-data";
import { getLists, saveLists } from "@/lib/storage";
import Link from "next/link";
import { CompanyList } from "@/types/list";

export default function ListDetailsPage() {
  const { id } = useParams();
  const [lists, setLists] = useState<CompanyList[]>([]);
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    const stored = getLists();
    setLists(stored);
    const l = stored.find((x) => x.id === id);
    setList(l);
  }, [id]);

  if (!list) return <div className="text-red-400">List not found.</div>;

  // companies inside this list
  const listCompanies = companies.filter((c) =>
    list.companyIds.includes(c.id)
  );

  const removeCompany = (companyId: string) => {
    const updated = lists.map((l: any) =>
      l.id === id
        ? { ...l, companyIds: l.companyIds.filter((cid: string) => cid !== companyId) }
        : l
    );

    saveLists(updated);
    setLists(updated);
    setList(updated.find((l: any) => l.id === id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">{list.name}</h2>

      <table className="w-full border border-slate-600 bg-slate-700/50 rounded-lg overflow-hidden">
        <thead className="bg-slate-700/80 border-b border-slate-600 text-left text-sm">
          <tr>
            <th className="p-3 text-white font-semibold">Name</th>
            <th className="p-3 text-white font-semibold">Sector</th>
            <th className="p-3 text-white font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listCompanies.length === 0 ? (
            <tr>
              <td className="p-3 text-slate-400" colSpan={3}>No companies in this list.</td>
            </tr>
          ) : (
            listCompanies.map((c) => (
              <tr key={c.id} className="border-t border-slate-600 hover:bg-slate-600/50 transition">
                <td className="p-3">
                  <Link href={`/companies/${c.id}`} className="text-cyan-400 hover:text-cyan-300 transition">{c.name}</Link>
                </td>
                <td className="p-3 text-slate-300">{c.sector}</td>
                <td className="p-3">
                  <button
                    onClick={() => removeCompany(c.id)}
                    className="px-3 py-1 text-sm bg-red-500/30 text-red-300 hover:bg-red-500/50 rounded-lg transition border border-red-500/50"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}