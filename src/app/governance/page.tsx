import SpecScreen from "@/components/ui/SpecScreen";

export default function GovernancePage() {
  return (
    <SpecScreen
      title="Governance & Audit Trail"
      purpose="Mencatat aktivitas dan keputusan."
      extraNote="Log pada prototipe tidak tahan manipulasi. Jejak audit sungguhan membutuhkan backend dengan log append-only (spesifikasi produksi, belum dibangun)."
    />
  );
}
