import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { UpdateCurrentPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileAPI";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import {
  LockClosedIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

export default function ChangePasswordView() {
  const initialValues: UpdateCurrentPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const password = watch("password");
  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data);
    },
  });
  const handleChangePassword = (formData: UpdateCurrentPasswordForm) => {
    mutate(formData);
  };

  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  });

  return (
    <>
      <div
        data-aos="fade-right"
        data-aos-offset="200"
        data-aos-easing="ease-in-sine"
        className="mx-auto max-w-3xl px-4"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#f1d49a]/40 to-white p-6 rounded-2xl border-2 border-[#f1d49a] mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#442e14]">
                Cambiar Password
              </h1>
              <p className="text-lg text-[#7f533b] mt-1">
                Utiliza este formulario para cambiar tu password
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="bg-white border-2 border-[#f1d49a] shadow-xl p-8 rounded-2xl space-y-6"
          noValidate
        >
          {/* Current Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-bold text-[#442e14] flex items-center gap-2"
              htmlFor="current_password"
            >
              <KeyIcon className="h-5 w-5 text-[#f4bc3c]" />
              PASSWORD ACTUAL
            </label>
            <input
              id="current_password"
              type="password"
              placeholder="Ingresa tu password actual"
              className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-medium transition placeholder:text-[#7f533b]/50"
              {...register("current_password", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-bold text-[#442e14] flex items-center gap-2"
              htmlFor="password"
            >
              <LockClosedIcon className="h-5 w-5 text-[#f4bc3c]" />
              NUEVO PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-medium transition placeholder:text-[#7f533b]/50"
              {...register("password", {
                required: "El Nuevo Password es obligatorio",
                minLength: {
                  value: 8,
                  message: "El Password debe ser mínimo de 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="password_confirmation"
              className="text-sm font-bold text-[#442e14] flex items-center gap-2"
            >
              <ShieldCheckIcon className="h-5 w-5 text-[#f4bc3c]" />
              REPETIR PASSWORD
            </label>
            <input
              id="password_confirmation"
              type="password"
              placeholder="Confirma tu nuevo password"
              className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-medium transition placeholder:text-[#7f533b]/50"
              {...register("password_confirmation", {
                required: "Este campo es obligatorio",
                validate: (value) =>
                  value === password || "Los Passwords no son iguales",
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#f4bc3c] text-[#442e14] py-4 rounded-full font-black text-lg hover:bg-amber-500 hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2 mt-8"
          >
            <LockClosedIcon className="h-6 w-6" />
            Cambiar Password
          </button>
        </form>

        {/* Security Tips */}
        <div className="mt-6 bg-gradient-to-br from-[#f9f8f6] to-white border-2 border-[#f1d49a] p-6 rounded-2xl">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#442e14] mb-1">
                Consejos de seguridad
              </h3>
              <p className="text-sm text-[#7f533b]">
                Crea un password seguro siguiendo estas recomendaciones:
              </p>
            </div>
          </div>
          <ul className="space-y-2 ml-13">
            <li className="flex items-start gap-2 text-sm text-[#7f533b]">
              <span className="text-[#f4bc3c] mt-0.5">•</span>
              <span>Usa al menos 8 caracteres</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[#7f533b]">
              <span className="text-[#f4bc3c] mt-0.5">•</span>
              <span>Combina letras mayúsculas y minúsculas</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[#7f533b]">
              <span className="text-[#f4bc3c] mt-0.5">•</span>
              <span>Incluye números y símbolos especiales</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[#7f533b]">
              <span className="text-[#f4bc3c] mt-0.5">•</span>
              <span>No uses información personal obvia</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
