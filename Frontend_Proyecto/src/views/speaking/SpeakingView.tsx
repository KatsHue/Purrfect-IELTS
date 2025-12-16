import InformationCard from "@/components/InformationCard";
import { useAuth } from "@/hooks/useAuth";

export default function SpeakingView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";

  if (data) return <InformationCard data={data} information="*Texto explicativo de la sección*"/>;
}
