import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink, FiFolder } from "react-icons/fi";

const ClientProjects = ({ limit }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const isFullPage = limit == null;

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/projects/public`,
          { signal: controller.signal },
        );

        if (!response.data?.success || !Array.isArray(response.data.projects)) {
          throw new Error("The projects response was invalid.");
        }

        setProjects(response.data.projects);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(
          fetchError.response?.data?.message ||
            (fetchError.response
              ? "The projects server could not load projects."
              : "Could not connect to the projects server. Check your connection and try again."),
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, [retryCount]);

  const visibleProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section
      className={
        isFullPage
          ? "mx-auto min-h-screen max-w-7xl px-6 py-28 text-slate-100 sm:px-8"
          : "mx-auto max-w-7xl space-y-8 px-2 py-8 text-slate-100 sm:px-0"
      }
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {isFullPage && (
            <Link
              to="/#projects"
              className="mb-4 inline-flex text-sm text-indigo-300 transition-colors hover:text-indigo-200"
            >
              &larr; Back to home
            </Link>
          )}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Selected work
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {isFullPage ? "All Projects" : "Projects"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            A selection of projects I&apos;ve built and worked on.
          </p>
        </div>
      </header>

      {loading ? (
        <p role="status" className="py-12 text-center text-slate-400">
          Loading projects...
        </p>
      ) : error ? (
        <div className="py-12 text-center">
          <p role="status" className="text-slate-400">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 transition-colors hover:border-indigo-400 hover:bg-indigo-500/20"
          >
            Try again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center">
          <FiFolder className="mx-auto h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">
            Projects will be added soon.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <article
                key={project._id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-colors hover:border-slate-700"
              >
                {project.projectImage ? (
                  <img
                    src={project.projectImage}
                    alt={`${project.title} project`}
                    loading="lazy"
                    className="h-52 w-full bg-slate-950 object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-slate-950 text-slate-600">
                    <FiFolder className="h-10 w-10" />
                  </div>
                )}
                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {project.title}
                    </h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                      {project.description}
                    </p>
                  </div>
                  {(project.gitHub || project.live) && (
                    <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-4">
                      {project.gitHub && (
                        <a
                          href={project.gitHub}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-white"
                        >
                          <FaGithub className="h-4 w-4" />
                          Source
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
                        >
                          <FiExternalLink className="h-4 w-4" />
                          Live demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {!isFullPage && projects.length > limit && (
            <div className="flex justify-center pt-2">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-200 transition-colors hover:border-indigo-400 hover:bg-indigo-500/20"
              >
                View more projects
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ClientProjects;
