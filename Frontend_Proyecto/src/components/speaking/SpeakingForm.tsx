import type { User } from "@/types/index";

type SpeakingFormProps = {
  data: User;
};

export default function SpeakingForm({ data }: SpeakingFormProps) {

  return (
    <>
      <div className="mx-auto max-w-3xl g">
        <h1 className="text-5xl font-black "><h1 className="text-5xl font-black ">Hola <span className="rounded-md text-xl p-3 bg-blue-900 text-white uppercase">{data.name}</span></h1></h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          *Texto explicativo de la sección*
        </p>

      </div>
    </>
  );
}
