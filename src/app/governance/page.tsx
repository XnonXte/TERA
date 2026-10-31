import { Activity, Clock, CheckCircle2, History, Filter, ListOrdered, PanelRight, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { SpecNotice, SpecKpiCard, SpecPanel, SpecPill } from "@/components/ui/SpecScreen";

// Kerangka halaman asli; judul kartu dari PRD Page 06 (Struktur section). Belum dibangun.
export default function GovernancePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        badge="SPESIFIKASI"
        title="Governance & Audit Trail"
        description="Mencatat aktivitas dan keputusan."
      />

      <SpecNotice
        purpose="Mencatat aktivitas dan keputusan."
        extraNote="Log pada prototipe tidak tahan manipulasi. Jejak audit sungguhan membutuhkan backend dengan log append-only (spesifikasi produksi, belum dibangun)."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpecKpiCard label="Total peristiwa" icon={<Activity className="w-4 h-4 text-[#0b1c30]" />} />
        <SpecKpiCard label="Menunggu review" icon={<Clock className="w-4 h-4 text-[#d97706]" />} />
        <SpecKpiCard label="Perubahan disetujui" icon={<CheckCircle2 className="w-4 h-4 text-[#00675e]" />} />
        <SpecKpiCard label="Riwayat persetujuan" icon={<History className="w-4 h-4 text-[#b80035]" />} />
      </div>

      {/* Filter bar frame (no controls: not built yet) */}
      <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
          <Filter className="w-4 h-4 text-[#5c5e64]" />
          <span className="font-semibold">Filter:</span>
          <span className="text-[#5c5e64]">tanggal, peran pengguna, jenis peristiwa, ID rekaman</span>
        </div>
        <SpecPill />
      </div>

      {/* Activity log frame */}
      <SpecPanel
        title="Tabel log aktivitas"
        subtitle="ID peristiwa, waktu, pelaku, aksi, objek, status sebelum, status sesudah, alasan, bukti terkait"
        icon={<ListOrdered className="w-4 h-4 text-[#0b1c30]" />}
        bodyHeight="h-56"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SpecPanel title="Panel detail peristiwa" icon={<PanelRight className="w-4 h-4 text-[#0b1c30]" />} bodyHeight="h-32" />
        <SpecPanel title="Ringkasan peran dan izin" icon={<Users className="w-4 h-4 text-[#0b1c30]" />} bodyHeight="h-32" />
      </div>
    </div>
  );
}
