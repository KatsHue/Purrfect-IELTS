import ProfileForm from "@/components/writing/WritingForm";
import { useAuth } from "@/hooks/useAuth";

export default function WritingView() {
    const { data, isLoading } = useAuth();
    
    if (isLoading) return "Cargando...";
    
    if (data) return <ProfileForm data={data} />;
}
