import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  LuArrowUpRight,
  LuAward,
  LuBookOpen,
  LuBriefcaseBusiness,
  LuFolderKanban,
  LuSparkles,
  LuWrench,
} from "react-icons/lu";
import useFetchedCert from "../../../hooks/useFetchedCert";
import useFetchedProjects from "../../../hooks/useFetchedProjects";
import useFetchedSkills from "../../../hooks/useFetchedSkills";
import useFetchedTopic from "../../../hooks/useFetchedTopic";

const statCards = [
  {
    label: "Projects",
    key: "projects",
    description: "Portfolio projects",
    icon: LuFolderKanban,
    color: "text-indigo-300 bg-indigo-500/10 border-indigo-500/20",
    link: "/admin/projects",
  },
  {
    label: "Experience",
    key: "experiences",
    description: "Career entries",
    icon: LuBriefcaseBusiness,
    color: "text-sky-300 bg-sky-500/10 border-sky-500/20",
    link: "/admin/experience",
  },
  {
    label: "Skills",
    key: "skills",
    description: "Skills in your profile",
    icon: LuWrench,
    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    link: "/admin/skills",
  },
  {
    label: "Certificates",
    key: "certificates",
    description: "Courses and certificates",
    icon: LuAward,
    color: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    link: "/admin/cert",
  },
  {
    label: "Topics",
    key: "topics",
    description: "Learning topics",
    icon: LuBookOpen,
    color: "text-violet-300 bg-violet-500/10 border-violet-500/20",
    link: "/admin/topics",
  },
];

const DashBoard = () => {
  const { userData, projects, skills, certs, topics } = useSelector(
    (state) => state.user,
  );
  const fetchedProjects = useFetchedProjects();
  const fetchedSkills = useFetchedSkills();
  const fetchedCert = useFetchedCert();
  const fetchedTopic = useFetchedTopic();
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchedProjects();
    fetchedSkills();
    fetchedCert();
    fetchedTopic();
  }, [fetchedProjects, fetchedSkills, fetchedCert, fetchedTopic]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `${serverURL}/api/experience/get-admin-exp`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.data?.success) {
          setExperiences(response.data.experiences || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard experiences:", error);
        toast.error(
          error.response?.data?.message || "Could not load experience summary.",
        );
      }
    };

    fetchExperiences();
  }, [serverURL]);

  const counts = {
    projects: projects?.length || 0,
    experiences: experiences.length,
    skills: skills?.length || 0,
    certificates: certs?.length || 0,
    topics: topics?.length || 0,
  };
  const inProgressTopics = topics?.filter(
    (item) => item.status === "In Progress",
  ).length;
  const learningTopics = topics?.filter(
    (item) => item.status === "Learning",
  ).length;
  const plannedTopics = topics?.filter(
    (item) => item.status === "Planned",
  ).length;
  const recentProjects = [...(projects || [])].slice(0, 3);
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="min-h-screen space-y-8 bg-zinc-950 text-zinc-100">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/50 p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <LuSparkles className="h-3.5 w-3.5" />
              Portfolio overview
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {greeting}, {userData?.name || "there"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Here&apos;s a snapshot of your portfolio content. Keep your
              projects, skills, and learning journey up to date.
            </p>
          </div>
          <Link
            to="/admin/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-indigo-500/50 hover:text-white"
          >
            Edit profile
            <LuArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.header>

      <section
        aria-label="Portfolio statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Link
                to={card.link}
                className="group block h-full rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <LuArrowUpRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-300" />
                </div>
                <p className="mt-5 text-3xl font-bold tracking-tight text-white">
                  {counts[card.key]}
                </p>
                <h2 className="mt-1 text-sm font-semibold text-zinc-200">
                  {card.label}
                </h2>
                <p className="mt-1 text-xs text-zinc-500">{card.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Recent projects
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Your latest portfolio work
              </p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              Manage projects
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-10 text-center">
              <LuFolderKanban className="mx-auto h-7 w-7 text-zinc-600" />
              <p className="mt-3 text-sm font-medium text-zinc-300">
                No projects yet
              </p>
              <Link
                to="/admin/projects"
                className="mt-2 inline-block text-xs text-indigo-300 hover:text-indigo-200"
              >
                Add your first project
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentProjects.map((project) => (
                <article
                  key={project._id}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3"
                >
                  {project.projectImage ? (
                    <img
                      src={project.projectImage}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded-lg bg-zinc-800 object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500">
                      <LuFolderKanban className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-zinc-100">
                      {project.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <Link
                    to="/admin/projects"
                    aria-label={`Manage ${project.title}`}
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <LuArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Learning progress
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Topics by current status
            </p>
          </div>

          {topics?.length ? (
            <div className="mt-6 space-y-5">
              {[
                {
                  label: "Learning",
                  count: learningTopics,
                  color: "bg-sky-400",
                },
                {
                  label: "In Progress",
                  count: inProgressTopics,
                  color: "bg-amber-400",
                },
                {
                  label: "Planned",
                  count: plannedTopics,
                  color: "bg-violet-400",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-zinc-300">{item.label}</span>
                    <span className="text-zinc-500">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{
                        width: `${(item.count / topics.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <Link
                to="/admin/topics"
                className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-indigo-300 hover:text-indigo-200"
              >
                View all topics
                <LuArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-8 text-center">
              <LuBookOpen className="mx-auto h-6 w-6 text-zinc-600" />
              <p className="mt-3 text-xs text-zinc-400">
                Add topics to track your learning progress.
              </p>
              <Link
                to="/admin/topics"
                className="mt-3 inline-block text-xs font-medium text-indigo-300 hover:text-indigo-200"
              >
                Add a topic
              </Link>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Quick access
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Jump straight to a portfolio section
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.key}
                to={card.link}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 transition-colors hover:border-indigo-500/40 hover:bg-zinc-950"
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="truncate text-xs font-medium text-zinc-300">
                  {card.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DashBoard;
