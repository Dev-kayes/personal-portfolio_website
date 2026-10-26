import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import usefetchedEducation from "../../../hooks/useFetchedEducations";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGraduationCap,
  FaUniversity,
  FaBookOpen,
  FaCalendarAlt,
  FaAward,
  FaTrashAlt,
  FaSpinner,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";

const Education = () => {
  const fetchedEducation = usefetchedEducation();
  const { education } = useSelector((state) => state.user);
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const token = localStorage.getItem("token");
  const [loading, setLoading] = React.useState(false);

  const initialFormData = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrentlyStudying: false,
    grade: "",
  };

  const [formData, setFormData] = React.useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/education/add-edu`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response?.data?.success) {
        toast.success(response.data.message || "Education Added successfully");
        fetchedEducation();
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error(error, "Error in submitting");
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      const response = await axios.delete(
        `${serverURL}/api/education/delete-edu/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response?.data?.success) {
        toast.success(
          response.data.message || "Education Deleted successfully",
        );
        fetchedEducation();
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error(error, "Error in submitting");
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedEducation();
  }, [fetchedEducation]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Education Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage and showcase your academic achievements and qualifications.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300">
            <span>Total Qualifications:</span>
            <span className="text-white font-bold">
              {education?.length || 0}
            </span>
          </div>
        </motion.div>

        {/* Dashboard Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Education Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5"
          >
            <h2 className="text-base font-semibold text-white border-b border-slate-800/80 pb-3 flex items-center gap-2">
              <FaPlus className="text-indigo-400 text-sm" /> Add New
              Qualification
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Institution
                </label>
                <input
                  type="text"
                  placeholder="School / College / University"
                  name="institution"
                  onChange={handleChange}
                  value={formData.institution}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Degree */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Degree
                </label>
                <input
                  type="text"
                  placeholder="Bachelor of Science, High School, etc."
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Field Of Study */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Field of Study
                </label>
                <input
                  type="text"
                  placeholder="Computer Science, Economics, etc."
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* End Date (Conditionally Rendered as in existing logic) */}
              {!formData.isCurrentlyStudying && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Grade / GPA
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.8/4.0 or First Class"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Currently Studying Toggle */}
              <div className="pt-1">
                <label className="inline-flex items-center cursor-pointer select-none gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isCurrentlyStudying"
                      checked={formData.isCurrentlyStudying}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    Currently Studying Here
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-colors disabled:opacity-50 cursor-pointer pt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FaPlus className="text-xs" />
                    <span>Add Education</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Education List / Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-semibold text-white">
              Education History ({education?.length || 0})
            </h2>

            {!education || education.length === 0 ? (
              /* Empty State */
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center space-y-2">
                <FaGraduationCap className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-medium text-slate-300">
                  No education added yet
                </p>
                <p className="text-xs text-slate-500">
                  Add your academic background using the form on the left.
                </p>
              </div>
            ) : (
              /* Cards Grid */
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {education.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Header with Institution & Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                              <FaUniversity className="text-lg" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white leading-snug">
                                {item.institution}
                              </h3>
                              <p className="text-sm font-medium text-slate-300">
                                {item.degree}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {item.isCurrentlyStudying ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Currently Studying
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                              <FaCheckCircle className="text-xs text-slate-400" />
                              Completed
                            </span>
                          )}
                        </div>

                        {/* Details: Field of Study, Dates, Grade */}
                        <div className="space-y-2 pt-1 text-xs text-slate-400">
                          {item.fieldOfStudy && (
                            <div className="flex items-center gap-2">
                              <FaBookOpen className="text-slate-500 shrink-0" />
                              <span>{item.fieldOfStudy}</span>
                            </div>
                          )}

                          {(item.startDate || item.endDate) && (
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-slate-500 shrink-0" />
                              <span>
                                {item.startDate || "N/A"} —{" "}
                                {item.isCurrentlyStudying
                                  ? "Present"
                                  : item.endDate || "N/A"}
                              </span>
                            </div>
                          )}

                          {item.grade && (
                            <div className="flex items-center gap-2 font-semibold text-slate-300 pt-1">
                              <FaAward className="text-amber-400 text-sm shrink-0" />
                              <span>Grade: {item.grade}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex justify-end">
                        <button
                          onClick={() => handleDeleteEducation(item._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                          title="Delete education entry"
                        >
                          <FaTrashAlt className="text-xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
