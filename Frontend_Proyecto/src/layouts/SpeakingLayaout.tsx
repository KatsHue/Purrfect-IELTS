import Tabs from "@/components/speaking/SpeakingTabs";
import { Outlet } from "react-router-dom";

export default function SpeakingLayout() {
  return (
    <>
      <Tabs />
      <Outlet />
    </>
  );
}
