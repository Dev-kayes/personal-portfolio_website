import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiBriefcase, FiCalendar, FiTrash2 } from "react-icons/fi";

const Experience = () => {
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const [deletingId, setDeletingId] = useState(null);
  const [refreshExperiences, setRefreshExperiences] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view your experiences.");
      return;
    }

    let isActive = true;

    axios
      .get(`${serverURL}/api/experience/get-admin-exp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!isActive) return;

        if (
          response.data?.success &&
          Array.isArray(response.data.experiences)
        ) {
          setExperiences(response.data.experiences);
        } else {
          toast.error(
            response.data?.message || "Unable to load your experiences.",
          );
        }
      })
      .catch((error) => {
        if (!isActive) return;

        console.error("Failed to fetch experiences:", error);
        toast.error(
          error.response?.data?.message ||
            "Something went wrong while loading your experiences.",
        );
      })
      .finally(() => {
        if (isActive) setExperiencesLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [refreshExperiences, serverURL]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !company.trim() ||
      !position.trim() ||
      !description.trim() ||
      !startDate ||
      !endDate
    ) {
      toast.error("Please complete all required fields before continuing.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in before adding your experience.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/experience/add-exp`,
        {
          company: company.trim(),
          position: position.trim(),
          description: description.trim(),
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        toast.success(
          response.data.message || "Experience added successfully.",
        );
        setCompany("");
        setPosition("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setExperiencesLoading(true);
        setRefreshExperiences((currentRefresh) => currentRefresh + 1);
      } else {
        toast.error(
          response.data?.message || "Unable to add your experience.",
        );
      }
    } catch (error) {
      console.error("Failed to add experience:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while adding your experience.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (experienceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in before deleting your experience.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    setDeletingId(experienceId);
    try {
      const response = await axios.delete(
        `${serverURL}/api/experience/del-exp/${experienceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        toast.success(
          response.data.message || "Experience deleted successfully.",
        );
        setExperiences((currentExperiences) =>
          currentExperiences.filter(
            (experience) => experience._id !== experienceId,
          ),
        );
      } else {
        toast.error(
          response.data?.message || "Unable to delete this experience.",
        );
      }
    } catch (error) {
      console.error("Failed to delete experience:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while deleting your experience.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const inputClassName =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Add Experience
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Add your role and employment dates to your portfolio.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-300">
              Company
              <input
                className={inputClassName}
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Company name"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-300">
              Position
              <input
                className={inputClassName}
                type="text"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                placeholder="Your role"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-300">
              Start date
              <input
                className={inputClassName}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-300">
              End date
              <input
                className={inputClassName}
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-slate-300">
            Description
            <textarea
              className={`${inputClassName} resize-y`}
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your responsibilities and achievements"
            />
          </label>

          <div className="flex justify-end border-t border-slate-800 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Saving..." : "Save Experience"}
            </button>
          </div>
        </form>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Your Experience
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                View and manage the experience shown in your portfolio.
              </p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
              {experiences.length}{" "}
              {experiences.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {experiencesLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
              Loading experiences...
            </div>
          ) : experiences.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
              <FiBriefcase className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 font-medium text-slate-300">
                No experience added yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add your first role using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <article
                  key={experience._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {experience.position}
                      </h3>
                      <p className="mt-1 text-indigo-300">
                        {experience.company}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(experience._id)}
                      disabled={deletingId === experience._id}
                      aria-label={`Delete experience at ${experience.company}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 aria-hidden="true" />
                      <span>
                        {deletingId === experience._id
                          ? "Deleting..."
                          : "Delete"}
                      </span>
                    </button>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                    <FiCalendar aria-hidden="true" />
                    <span>
                      {formatDate(experience.startDate)} -{" "}
                      {formatDate(experience.endDate)}
                    </span>
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {experience.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Experience;
