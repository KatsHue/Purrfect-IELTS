import { useForm } from "react-hook-form";
import { type UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message);
      reset();
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleLogin = (formData: UserLoginForm) => mutate(formData);

  return (
    <>
      {/* TÍTULO */}
      <h1 className="text-3xl sm:text-5xl font-black text-[#442e14]">
        Iniciar Sesión
      </h1>

      {/* SUBTEXTO */}
      <p className="text-lg sm:text-2xl text-[#7f533b] mt-4 sm:mt-5">
        Comienza a practicar inglés y mejora tu score en IELTS{" "}
        <span className="text-amber-500 font-bold block sm:inline">
          iniciando sesión en este formulario
        </span>
      </p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="
          space-y-6 sm:space-y-8
          p-6 sm:p-10
          bg-white
          rounded-md
          mt-8 sm:mt-10
          border border-[#f1d49a]/60
          max-w-md
          mx-auto
        "
        noValidate
      >
        <div className="flex flex-col gap-3 sm:gap-5">
          <label className="font-normal text-lg sm:text-2xl text-[#442e14]">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Email de registro"
            className="
              w-full p-3
              border border-[#f1d49a]
              rounded-md
              focus:outline-none
              focus:ring-2 focus:ring-[#f4bc3c]/50
            "
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-3 sm:gap-5">
          <label className="font-normal text-lg sm:text-2xl text-[#442e14]">
            Password
          </label>

          <input
            type="password"
            placeholder="Password de registro"
            className="
              w-full p-3
              border border-[#f1d49a]
              rounded-md
              focus:outline-none
              focus:ring-2 focus:ring-[#f4bc3c]/50
            "
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="
            bg-[#f4bc3c]
            hover:bg-[#e9b02f]
            w-full
            p-3
            text-[#442e14]
            font-black
            text-lg sm:text-xl
            cursor-pointer
            rounded-md
            transition
          "
        />
      </form>

      {/* LINKS */}
      <nav className="mt-8 sm:mt-10 flex flex-col space-y-3 sm:space-y-4">
        <Link
          to={"/auth/register"}
          className="text-center text-[#7f533b] font-normal hover:underline"
        >
          ¿No tienes cuenta? Crea una
        </Link>

        <Link
          to={"/auth/forgot-password"}
          className="text-center text-[#7f533b] font-normal hover:underline"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
}
