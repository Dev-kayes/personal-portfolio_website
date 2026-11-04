import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useFetchedSkills from "../../../hooks/useFetchedSkills";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiPlus, FiUploadCloud, FiCpu } from "react-icons/fi";

const Skills = () => {
  const fetchedSkills = useFetchedSkills();
  const { skills } = useSelector((state) => state.user);

  const [previewImage, setPreviewImage] = useState(null);
  const [skillImage, setSkillImage] = useState(null);
  const [skillName, setSkillName] = useState("");
  const [skillSection, setSkillSection] = useState("FrontEnd");
  const [loading, setLoading] = useState(false);

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

    if (!skillName.trim() || !skillImage || !skillSection) {
      toast.error("Please fill in all fields and upload a skill icon.");
      return;
    }

    const formData = new FormData();
    formData.append("skillName", skillName.trim());
    formData.append("skillImage", skillImage);
    formData.append("skillSection", skillSection);

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
        setSkillSection("FrontEnd");
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

              {/* Skill Section Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Skill Section / Category
                </label>
                <select
                  value={skillSection}
                  onChange={(e) => setSkillSection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="FrontEnd">FrontEnd</option>
                  <option value="BackEnd">BackEnd</option>
                  <option value="Database">Database</option>
                  <option value="Tools & others">Tools & others</option>
                </select>
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
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain pr-2 lg:max-h-[calc(100svh-15rem)]">
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
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {skills.map((skill) => (
                    <motion.div
                      key={skill._id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-1.5">
                          <img
                            src={skill.skillImage}
                            alt={skill.skillName}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium text-white">
                            {skill.skillName}
                          </h3>
                          <span className="mt-0.5 inline-block rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                            {skill.skillSection}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
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
