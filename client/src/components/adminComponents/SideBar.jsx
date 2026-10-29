import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuLayoutDashboard,
  LuUser,
  LuFolderKanban,
  LuBriefcase,
  LuWrench,
  LuAward,
  LuGraduationCap,
  LuTrophy,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuMenu,
  LuX,
} from "react-icons/lu";

const navGroups = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LuLayoutDashboard,
        end: true,
      },
      {
        name: "Profile",
        path: "/admin/profile",
        icon: LuUser,
      },
    ],
  },
  {
    title: "Portfolio Management",
    items: [
      {
        name: "Projects",
        path: "/admin/projects",
        icon: LuFolderKanban,
      },
      {
        name: "Experiences",
        path: "/admin/experience",
        icon: LuBriefcase,
      },
      {
        name: "Skills",
        path: "/admin/skills",
        icon: LuWrench,
      },
      {
        name: "Educations",
        path: "/admin/education",
        icon: LuGraduationCap,
      },
      {
        name: "Achievements & certification",
        path: "/admin/achievements",
        icon: LuTrophy,
      },
    ],
  },
];

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { userData } = useSelector((state) => state.user);

  const userName = userData?.name || userData?.username || "Administrator";

  const userEmail = userData?.email || "";

  const userAvatar = userData?.avatar || userData?.profilePic;

  const userInitials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  const renderNavItems = (mobile = false) =>
    navGroups.map((group) => (
      <div key={group.title} className="space-y-2">
        {(!isCollapsed || mobile) && (
          <h3 className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {group.title}
          </h3>
        )}

        {group.items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              title={isCollapsed && !mobile ? item.name : undefined}
              aria-label={item.name}
              className={({ isActive }) =>
                `group relative flex items-center ${
                  isCollapsed && !mobile ? "justify-center px-2" : "gap-3 px-3"
                } rounded-xl py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                  )}

                  <Icon className="h-5 w-5 shrink-0" />

                  <AnimatePresence initial={false}>
                    {(!isCollapsed || mobile) && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="min-w-0 flex-1 truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isCollapsed && !mobile && (
                    <span className="pointer-events-none absolute left-full z-[70] ml-3 whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    ));

  const UserProfile = ({ mobile = false }) => (
    <div
      className={`flex items-center gap-3 overflow-hidden ${
        mobile ? "p-4" : "p-3"
      }`}
    >
      {userAvatar ? (
        <img
          src={userAvatar}
          alt={userName}
          className="h-10 w-10 shrink-0 rounded-full border border-zinc-700 object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
          {userInitials}
        </div>
      )}

      {(!isCollapsed || mobile) && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {userName}
          </p>
          <p className="truncate text-xs text-zinc-400">{userEmail}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition hover:bg-indigo-500 active:scale-95 lg:hidden"
      >
        <LuMenu size={22} />
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        aria-label="Mobile navigation"
        className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-zinc-800 bg-zinc-950 lg:hidden"
        style={{ visibility: mobileOpen ? "visible" : "hidden" }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
              Admin
            </div>
            {/* <span className="font-semibold text-white">Admin Panel</span> */}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <LuX size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {renderNavItems(true)}
        </nav>

        <div className="shrink-0 border-t border-zinc-800">
          <UserProfile mobile />
        </div>
      </motion.aside>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex"
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-zinc-800 ${
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!isCollapsed && (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                Admin
              </div>
              {/* <span className="truncate text-sm font-semibold text-white">
                Admin Panel
              </span> */}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            {isCollapsed ? (
              <LuPanelLeftOpen size={19} />
            ) : (
              <LuPanelLeftClose size={19} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-3 py-4">
          {renderNavItems()}
        </nav>

        <div className="shrink-0 border-t border-zinc-800">
          <UserProfile />
        </div>
      </motion.aside>
    </>
  );
};

export default SideBar;
