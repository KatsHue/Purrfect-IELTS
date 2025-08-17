import ProfileForm from "@/components/speaking/SpeakingForm";
import { useAuth } from "@/hooks/useAuth";

export default function SpeakingView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";

  if (data) return <ProfileForm data={data} />;
}
