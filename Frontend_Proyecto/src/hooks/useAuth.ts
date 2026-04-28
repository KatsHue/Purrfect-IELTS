import { getUser } from "@/api/AuthAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState} from "react";

export const useAuth = () => {
    const {data, isError, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    })

    const [minLoading, setMinLoading] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setMinLoading(false);
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const loading = isLoading || minLoading || !data;

    return { data, isError, isLoading : loading };
}