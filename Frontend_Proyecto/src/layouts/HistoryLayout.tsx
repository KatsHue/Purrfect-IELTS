import Tabs from "@/components/history/HistoryTabs";
import { Outlet } from "react-router-dom";

export default function HistoryLayout() {
  return (
    <>
      <Tabs />
      <Outlet />
    </>
  );
}
