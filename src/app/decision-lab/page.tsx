import { Sliders, TrendingDown, Wallet, Receipt, Clock, BarChart3, LayoutGrid, Table2, ListChecks, Scale } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { SpecKpiCard, SpecPanel } from "@/components/ui/SpecScreen";

// Kerangka halaman asli; judul kartu dari PRD Page 05 (Struktur section dan KPI per opsi). Belum dibangun.
export default function DecisionLabPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        badge="SPESIFIKASI"
        title="Decision Lab"
        description="Membandingkan alternatif dekarbonisasi berdasarkan emisi, biaya, dan kelayakan."
      />


      {/* Decision context (posisi panel parameter asli) */}
      <SpecPanel
        title="Konteks keputusan"
        subtitle="Periode analisis, baseline emisi, target atau batasan"
        icon={<Sliders className="w-4 h-4 text-[#b80035]" />}
        bodyHeight="h-28"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpecKpiCard label="Estimasi pengurangan emisi" icon={<TrendingDown className="w-4 h-4 text-[#00675e]" />} />
        <SpecKpiCard label="Biaya implementasi" icon={<Wallet className="w-4 h-4 text-[#0b1c30]" />} />
        <SpecKpiCard label="Biaya operasional tahunan" icon={<Receipt className="w-4 h-4 text-[#b80035]" />} />
        <SpecKpiCard label="Estimasi waktu implementasi" icon={<Clock className="w-4 h-4 text-[#d97706]" />} />
      </div>

      {/* Cost-effectiveness chart frame */}
      <SpecPanel
        title="Grafik efektivitas biaya"
        subtitle="Biaya per tCO2e yang berpotensi dihindari"
        icon={<BarChart3 className="w-4 h-4 text-[#b80035]" />}
        bodyHeight="h-64"
      />

      {/* Scenario card grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30]">Kartu skenario</h3>
          <span className="text-[12px] text-[#5c5e64]">Opsi intervensi yang dibandingkan</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SpecPanel muted title="Tabel perbandingan" icon={<Table2 className="w-4 h-4 text-[#0b1c30]" />} bodyHeight="h-32" />
          <SpecPanel muted title="Panel asumsi" icon={<ListChecks className="w-4 h-4 text-[#0b1c30]" />} bodyHeight="h-32" />
          <SpecPanel muted title="Panel rekomendasi" icon={<Scale className="w-4 h-4 text-[#0b1c30]" />} bodyHeight="h-32" />
          <SpecPanel muted title="Simpan skenario" icon={<LayoutGrid className="w-4 h-4 text-[#0b1c30]" />} bodyHeight="h-32" />
        </div>
      </div>
    </div>
  );
}
