import { Link, Navigate, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import { useEffect, useState } from "react";

export const AppLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, isError, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return "cargando...";

  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (data)
    return (
      <>
        <header
          className={`
    sticky top-0 z-50 w-full
    border-b
    transition-all duration-300 ease-out
    ${
      isScrolled
        ? "bg-[#f1d49a] border-[#f1d49a] shadow-md py-2"
        : "bg-[#fff8ec] py-4 border-b border-orange-400/40"
    }
  `}
        >
          <div
            className={`max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center px-6`}
          >
            <div className="w-16 my-3">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            <h2 className="text-2xl text-amber-500 font-semibold">
              Purrfect IELTS
            </h2>

            <NavMenu name={data.name} />
          </div>
        </header>

        <section className="min-h-screen max-w-screen mx-auto mt-0 p-5 overflow-hidden">
          <Outlet />
        </section>

        <footer className="py-5">
          <p className="text-center">
            Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>

        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />

        <ChatbotWidget />
      </>
    );
};
