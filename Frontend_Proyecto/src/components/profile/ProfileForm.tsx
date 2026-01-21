import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { User, UserProfileForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/ProfileAPI";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

type ProfileFormProps = {
  data: User;
};

export default function ProfileForm({ data }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({ defaultValues: data });

  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const handleEditProfile = (formData: UserProfileForm) => {
    mutate(formData);
  };

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
              <UserCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#442e14]">Mi Perfil</h1>
              <p className="text-lg text-[#7f533b] mt-1">
                Aquí puedes actualizar tu información
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className="bg-white border-2 border-[#f1d49a] shadow-xl p-8 rounded-2xl space-y-6"
          noValidate
        >
          {/* Name Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-bold text-[#442e14] flex items-center gap-2"
              htmlFor="name"
            >
              <UserCircleIcon className="h-5 w-5 text-[#f4bc3c]" />
              NOMBRE
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="Tu Nombre"
                className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-medium transition placeholder:text-[#7f533b]/50"
                {...register("name", {
                  required: "Nombre de usuario es obligatorio",
                })}
              />
            </div>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-bold text-[#442e14] flex items-center gap-2"
              htmlFor="email"
            >
              <EnvelopeIcon className="h-5 w-5 text-[#f4bc3c]" />
              E-MAIL
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Tu Email"
                className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-medium transition placeholder:text-[#7f533b]/50"
                {...register("email", {
                  required: "El e-mail es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "E-mail no válido",
                  },
                })}
              />
            </div>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#f4bc3c] text-[#442e14] py-4 rounded-full font-black text-lg hover:bg-amber-500 hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2 mt-8"
          >
            <CheckCircleIcon className="h-6 w-6" />
            Guardar Cambios
          </button>
        </form>
      </div>
    </>
  );
}
