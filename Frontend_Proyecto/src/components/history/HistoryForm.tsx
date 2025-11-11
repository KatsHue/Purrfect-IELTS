import type { User } from "@/types/index";

type HistoryFormProps = {
  data: User;
};

export default function HistoryForm({ data }: HistoryFormProps) {
  return (
    <>
      <div className="mx-auto max-w-3xl g">
        <h1 className="text-5xl font-black ">
          Hola{" "}
          <span className="font-bold text-xl uppercase bg-indigo-50 text-orange-500 border-2 border-orange-500 rounded-lg inline-block py-1 px-5">
            {data.name}
          </span>
        </h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          En el siguiente apartado podrás practicar tu escritura en inglés y
          posteriormente podrás recibir consejos basados en la gramática y
          coherencia de tu escrito.
        </p>
      </div>
    </>
  );
}
