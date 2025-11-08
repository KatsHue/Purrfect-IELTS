import {
  MicrophoneIcon,
  BookOpenIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { name: "Speaking", href: "/speaking", icon: UserIcon },
  {
    name: "Task 1",
    href: "/speaking/task-1",
    icon: BookOpenIcon,
  },
  {
    name: "Task 2 & 3",
    href: "/speaking/task-2",
    icon: MicrophoneIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = tabs.filter((tab) => tab.href === location.pathname)[0]
    .href;

  return (
    <div className="mb-10">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-700"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            navigate(e.target.value)
          }
          value={currentTab}
        >
          {tabs.map((tab) => {
            return (
              <option value={tab.href} key={tab.name}>
                {tab.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                className={classNames(
                  location.pathname === tab.href
                    ? "border-yellow-600 text-yellow-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                )}
              >
                <tab.icon
                  className={classNames(
                    location.pathname === tab.href
                      ? "text-yellow-600"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
