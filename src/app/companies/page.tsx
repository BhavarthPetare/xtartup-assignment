import { Suspense } from "react";
import { CompaniesList } from "./companies-list";

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading companies...</div>}>
      <CompaniesList />
    </Suspense>
  );
}