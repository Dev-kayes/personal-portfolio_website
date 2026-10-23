import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useFetchedSkills from "../../../hooks/useFetchedSkills";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiUploadCloud,
  FiCpu,
  FiAlertCircle,
} from "react-icons/fi";

const Skills = () => {
  const fetchedSkills = useFetchedSkills();
  const { skills } = useSelector((state) => state.user);

  const [previewImage, setPreviewImage] = useState(null);
  const [skillImage, setSkillImage] = useState(null);
  const [skillLevel, setSkillLevel] = useState("");
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setSkillImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName.trim() || !skillImage || skillLevel === "") {
      toast.error("Please fill in all fields and upload a skill icon.");
      return;
    }

    const formData = new FormData();
    formData.append("skillName", skillName.trim());
    formData.append("skillImage", skillImage);
    formData.append("skillLevel", skillLevel);

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/skill/add-skill`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Skill added successfully!");
        fetchedSkills();

        setSkillName("");
        setSkillLevel("");
        setSkillImage(null);
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
          setPreviewImage(null);
        }
        const fileInput = document.getElementById("skill-file-input");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while adding the skill.",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteSkills = async (skillId) => {
    setDeletingId(skillId);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/api/skill/delete-skill/${skillId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message || "Skill deleted successfully!");
        fetchedSkills(false);
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while deleting the skill.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchedSkills();
  }, [fetchedSkills]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Skills Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Showcase and manage your technical expertise.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300">
            <span>Total Skills:</span>
            <span className="text-white font-bold">{skills?.length || 0}</span>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Skill Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5"
          >
            <h2 className="text-base font-semibold text-white border-b border-slate-800/80 pb-3">
              Add New Skill
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Icon / Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Skill preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUploadCloud className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <input
                    id="skill-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Skill Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, TypeScript"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Proficiency Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-medium text-slate-400">
                    Proficiency Level
                  </label>
                  <span className="text-indigo-400 font-medium">
                    {skillLevel !== "" ? `${skillLevel}%` : "0%"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiPlus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Skills Grid */}
          <div className="lg:col-span-8">
            {skills && skills.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {skills.map((skill) => (
                  <motion.div
                    key={skill._id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={skill.skillImage}
                            alt={skill.skillName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-sm">
                            {skill.skillName}
                          </h3>
                          <span className="text-xs text-slate-400">
                            {skill.skillLevel}% Proficiency
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(skill._id)}
                        disabled={deletingId === skill._id}
                        aria-label={`Delete ${skill.skillName}`}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.skillLevel}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>

                    {/* Delete Modal */}
                    <AnimatePresence>
                      {deleteConfirmId === skill._id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-950/95 z-10 flex items-center justify-between px-4 py-2"
                        >
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <FiAlertCircle className="w-4 h-4 text-red-400" />
                            <span>Delete "{skill.skillName}"?</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteSkills(skill._id)}
                              disabled={deletingId === skill._id}
                              className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === skill._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center space-y-2">
                <FiCpu className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-medium text-slate-300">
                  No skills found
                </p>
                <p className="text-xs text-slate-500">
                  Add your first skill using the form on the left.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
