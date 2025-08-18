import Tabs from "@/components/writing/WritingTabs";
import { Outlet } from "react-router-dom";

export default function WritingLayout() {
    return (
        <>
            <Tabs />
            <Outlet />
        </>
    );
}
