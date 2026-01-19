import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="min-h-screen bg-[#f1d49a] flex items-center justify-center px-4">
        <div
          className="
            w-full
            max-w-[450px]
            py-8 sm:py-10
          "
        >
          <Outlet />
        </div>
      </div>

      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
