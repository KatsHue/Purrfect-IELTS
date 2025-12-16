import type { User } from "@/types/index";
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

type HistoryFormProps = {
    data: User;
    information: string
};

export default function InformationCard({ data, information }: HistoryFormProps) {

    useEffect(() => {
        AOS.init({
            duration: 1500,
            once:true
        })
        })

    return (
        <>
        <div data-aos="fade-up"
                data-aos-duration="3000" className="mx-auto max-w-3xl g">
            <h1 className="text-5xl font-black text-center">
            Hola{" "}
            <span className="font-bold text-xl uppercase bg-transparent text-orange-500 border-2 border-orange-500 rounded-lg inline-block px-5">
                {data.name}
            </span>
            </h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                {information}
            </p>
        </div>
        </>
    );
}