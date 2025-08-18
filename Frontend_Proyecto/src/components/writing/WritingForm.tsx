import type { User } from "@/types/index";

type WritingFormProps = {
    data: User;
};

export default function WritingForm({data} : WritingFormProps) {

    return (
        <>
        <div className="mx-auto max-w-3xl g">
            <h1 className="text-5xl font-black ">Hola <span className="rounded-md text-xl p-3 bg-blue-900 text-white uppercase">{data.name}</span></h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
            En el siguiente apartado podrás practicar tu escritura en inglés y posteriormente podrás recibir consejos basados en la gramática y coherencia de tu escrito.
            </p>
        
        </div>
        </>
    );
}
