import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getResponseIA } from "@/api/AIAPI";
import { useEffect, useState } from "react";
import { formatResponse } from "@/utils/format";

export type IAForm = {
  text: string;
};

export default function SendIAView() {
  const initialValues: IAForm = {
    text: "",
  };

  const [ia, setIA] = useState({
    text: "",
    response: false,
    loading: false,
  });

  const [sections, setSections] = useState<string[][]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: getResponseIA,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      setIA({
        ...ia,
        text: data!,
        response: true,
        loading: false,
      });
    },
  });

  useEffect(() => {
    if (ia.text) {
      const formatted = formatResponse(ia.text);
      setSections(formatted);
    }
  }, [ia.text]);

  const handleChangePassword = (formData: IAForm) => {
    setIA({ ...ia, loading: true });
    mutate(formData);
  };

  function renderContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    if (lines.every((l) => /^(\d+\.\s|\-\s|\*\s)/.test(l.trim()))) {
      const isOrdered = lines.every((l) => /^\d+\./.test(l.trim()));
      return isOrdered ? (
        <ol className="list-decimal list-inside space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^(\-|\*)\s/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p className="whitespace-pre-line">{content}</p>;
  }

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black ">Writing</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Ingresa tu texto para comenzar a practicar.
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg mb-5"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >
              Texto:
            </label>
            <input
              id="text"
              type="text"
              placeholder="Escribe algo..."
              className="w-full p-3 border border-gray-200"
              {...register("text", {
                required: "El texto es obligatorio",
              })}
            />
            {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}
          </div>

          <input
            type="submit"
            value="Consultar con IA"
            className={`bg-sky-600 w-full p-3 text-white uppercase font-bold hover:bg-sky-700 cursor-pointer transition-colors rounded-md ${
              ia.loading ? " opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={ia.loading}
          />
        </form>

        {/* Mostrar spinner mientras carga */}
        {ia.loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">
              Processing your essay...
            </p>
          </div>
        )}

        {/* Mostrar respuesta cuando esté lista */}
        {!ia.loading && ia.text && (
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow">
                <h1 className="font-bold text-lg mb-2 text-yellow-600">
                  {section[0]}
                </h1>
                {renderContent(section.slice(1).join("\n"))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
