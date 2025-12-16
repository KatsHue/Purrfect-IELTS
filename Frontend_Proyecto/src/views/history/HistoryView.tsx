import InformationCard from "@/components/InformationCard";
import { useAuth } from "@/hooks/useAuth";

export default function HistoryView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";

  if (data) return <InformationCard data={data} information="En este apartado podrás observar tu actividad dentro de la plataforma."/>;
}
