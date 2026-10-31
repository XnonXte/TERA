import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import FindingDetailDrawer from "@/components/drawers/FindingDetailDrawer";

export const metadata: Metadata = {
  title: "TERA | Trusted ESG Reporting & Action - Telkomsel",
  description:
    "Auditable Decarbonization & Scope 1/2 Greenhouse Gas Emissions Governance Platform for Telkomsel.",
  icons: {
    icon: "/tera-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8f9ff] text-[#0b1c30] flex h-screen overflow-hidden antialiased select-auto">
        {/* Obsidian Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>

        {/* Global Finding Detail Slide-over Drawer */}
        <FindingDetailDrawer />
      </body>
    </html>
  );
}
