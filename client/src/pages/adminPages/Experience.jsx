import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Experience = () => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

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
      </div>
    </div>
  );
};

export default Experience;
