import ProfileForm from "@/components/history/HistoryForm";
import { useAuth } from "@/hooks/useAuth";

export default function HistoryView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";

  if (data) return <ProfileForm data={data} />;
}
