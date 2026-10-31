import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import FindingDetailDrawer from "@/components/drawers/FindingDetailDrawer";

export const metadata: Metadata = {
  title: "TERA · Prototipe Terbatas",
  description:
    "Prototipe terbatas TERA dengan data demo dari laporan keberlanjutan. Persetujuan disimulasikan; bukan integrasi produksi.",
  openGraph: {
    title: "TERA · Prototipe Terbatas",
    description:
      "Prototipe terbatas TERA dengan data demo dari laporan keberlanjutan. Persetujuan disimulasikan; bukan integrasi produksi.",
  },
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
    <html lang="id">
      <body className="bg-[#f8f9ff] text-[#0b1c30] flex h-screen overflow-hidden antialiased select-auto">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <div className="bg-[#fffbeb] border-b border-[#fde68a] px-6 py-2 text-[12px] text-[#78350f] shrink-0">
            Data demo dari laporan keberlanjutan (SR 2023-2025). Angka disalin dari halaman cetak;
            setiap angka menunjukkan sumbernya.
          </div>
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">{children}</div>
          </main>
        </div>

        <FindingDetailDrawer />
      </body>
    </html>
  );
}
