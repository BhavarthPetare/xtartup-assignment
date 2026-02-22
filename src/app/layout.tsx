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
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <Sidebar/>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}