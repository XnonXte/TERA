import { CalendarRange, TrendingUp, PieChart, HelpCircle, BarChart3, BookOpen, FileSearch } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { SpecNotice, SpecKpiCard, SpecPanel } from "@/components/ui/SpecScreen";

// Kerangka halaman asli; judul kartu dari PRD Page 04 "Struktur section". Belum dibangun.
export default function CarbonAnalysisPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        badge="SPESIFIKASI"
        title="Carbon Driver Analysis"
        description="Memisahkan faktor penyebab perubahan emisi berdasarkan data yang tersedia."
      />

      <SpecNotice purpose="Memisahkan faktor penyebab perubahan emisi berdasarkan data yang tersedia." />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpecKpiCard label="Filter tahun dan periode" icon={<CalendarRange className="w-4 h-4 text-[#0b1c30]" />} />
        <SpecKpiCard label="Emissions trend" icon={<TrendingUp className="w-4 h-4 text-[#b80035]" />} />
        <SpecKpiCard label="Scope 1 versus Scope 2 breakdown" icon={<PieChart className="w-4 h-4 text-[#00675e]" />} />
        <SpecKpiCard label="Data confidence and unresolved drivers" icon={<HelpCircle className="w-4 h-4 text-[#d97706]" />} />
      </div>

      {/* Decomposition chart frame */}
      <SpecPanel
        title="Carbon driver decomposition"
        subtitle="Kontribusi setiap driver terhadap perubahan"
        icon={<BarChart3 className="w-4 h-4 text-[#b80035]" />}
        bodyHeight="h-64"
      />

      {/* Driver list & inspector frames */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SpecPanel
          className="lg:col-span-1"
          title="Methodology and emission-factor registry"
          icon={<BookOpen className="w-4 h-4 text-[#0b1c30]" />}
          bodyHeight="h-72"
        />
        <SpecPanel
          className="lg:col-span-2"
          title="Sources and calculation details"
          subtitle="Nilai, unit, rumus, sumber, dan status per driver"
          icon={<FileSearch className="w-4 h-4 text-[#0b1c30]" />}
          bodyHeight="h-72"
        />
      </div>
    </div>
  );
}
