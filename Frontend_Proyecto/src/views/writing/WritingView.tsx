import InformationCard from "@/components/InformationCard";
import { useAuth } from "@/hooks/useAuth";

export default function WritingView() {
    const { data, isLoading } = useAuth();
    
    if (isLoading) return "Cargando...";
    
    if (data) return <InformationCard data={data} information="En el siguiente apartado podrás practicar tu escritura en inglés y posteriormente podrás recibir consejos basados en la gramática y coherencia de tu escrito."/>;
}
