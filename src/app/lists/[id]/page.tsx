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

  if (!list) return <div>List not found.</div>;

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
      <h2 className="text-2xl font-semibold">{list.name}</h2>

      <table className="w-full border bg-white rounded-lg">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Sector</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listCompanies.length === 0 ? (
            <tr>
              <td className="p-3" colSpan={3}>No companies in this list.</td>
            </tr>
          ) : (
            listCompanies.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/companies/${c.id}`}>{c.name}</Link>
                </td>
                <td className="p-3">{c.sector}</td>
                <td className="p-3">
                  <button
                    onClick={() => removeCompany(c.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg"
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