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
          className={` sticky top-0 w-full transition-all z-50 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-lg shadow-lg shadow-pink-200/50 py-4"
              : "bg-gradient-to-r from-pink-50 via-amber-50 to-yellow-50 py-5 border-b-2 border-amber-200/50"
          }`}
        >
          <div
            className={`max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center`}
          >
            <div className="w-16 m-3">
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
