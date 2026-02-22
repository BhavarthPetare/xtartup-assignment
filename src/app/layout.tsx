import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "VC Intellegence Interface",
  description: "Precision AI scouting interface for VCs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Sidebar/>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}