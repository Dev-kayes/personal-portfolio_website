import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud,
  FiPlus,
  FiFolderPlus,
  FiType,
  FiFileText,
  FiGithub,
  FiExternalLink,
  FiTrash2,
  FiFolder,
} from "react-icons/fi";
import usefetchedProjects from "../../../hooks/useFetchedProjects";
import { useSelector } from "react-redux";

const Projects = () => {
  const fetchedProject = usefetchedProjects();
  const [preview, setPreview] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const serverURL = import.meta.env.VITE_SERVER_URI;

  const { projects } = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setProjectImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Cleanup object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in before adding a project.");
      return;
    }

    if (!title.trim() || !desc.trim() || !projectImage) {
      toast.error("Please provide a title, description, and project image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", desc.trim());
    formData.append("gitHub", gitHub);
    formData.append("live", liveLink);
    formData.append("projectImage", projectImage);

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/projects/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data?.success) {
        toast.success(response.data.message || "Project added successfully!");
        // Reset form fields after successful submission
        setTitle("");
        setDesc("");
        setGitHub("");
        setLiveLink("");
        setProjectImage(null);
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview("");
        }
        const fileInput = document.getElementById("project-file-input");
        if (fileInput) fileInput.value = "";

        // Refresh project list
        fetchedProject();
      } else {
        toast.error(response.data?.message || "Project could not be added.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete a project
  const handleDelete = async (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setDeletingId(projectId);
    try {
      // Adjust the endpoint path if your backend uses a different delete route (e.g., `${serverURL}/api/projects/${projectId}`)
      const response = await axios.delete(
        `${serverURL}/api/projects/delete/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Project deleted successfully!");
        fetchedProject(); // Refresh the projects list
      } else {
        toast.error(response.data?.message || "Failed to delete project.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };
  // const handleProjectDel = () => {
  //   const projectDel = axios.delete(
  //     `${serverURL}/api/projects/delete-projects/:projectId`,
  //   );
  // };

  useEffect(() => {
    fetchedProject();
  }, [fetchedProject]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-slate-800 pb-6 flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <FiFolderPlus className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Manage Projects
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Showcase your work and manage your portfolio projects.
            </p>
          </div>
        </motion.div>

        {/* Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/85 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Image Upload & Live Preview */}
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Project Thumbnail <span className="text-indigo-400">*</span>
                </label>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/50 rounded-xl p-6 text-center transition-all group relative overflow-hidden min-h-[260px]">
                  {preview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={preview}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-slate-900/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 shadow">
                          Change Image
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3 py-6">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <FiUploadCloud className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-300">
                          Upload Project Image
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, or WEBP up to 10MB
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    id="project-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Recommended aspect ratio is 16:9 for optimal portfolio
                  display.
                </p>
              </div>

              {/* Right Column: Title, Description & Links */}
              <div className="lg:col-span-7 space-y-4">
                {/* Project Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Project Title <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiType className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g., E-Commerce SaaS Platform"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Project Description{" "}
                    <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                      <FiFileText className="w-4 h-4" />
                    </span>
                    <textarea
                      name="desc"
                      rows={4}
                      placeholder="Describe your project's core features, tech stack, and architecture..."
                      onChange={(e) => setDesc(e.target.value)}
                      value={desc}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* GitHub Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    GitHub Repository Link
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiGithub className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="https://github.com/username/repository"
                      value={gitHub}
                      onChange={(e) => setGitHub(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Live Demo Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Live Demo Link
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiExternalLink className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="https://yourproject-demo.com"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer Action */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiPlus className="w-5 h-5" />
                    <span>Publish Project</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Projects Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Your Uploaded Projects ({projects?.length || 0})
            </h2>
          </div>

          {!projects || projects.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto text-slate-500">
                <FiFolder className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-400">No projects added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {projects.map((project) => {
                  const projectId = project._id || project.id;
                  const isDeleting = deletingId === projectId;

                  return (
                    <motion.div
                      key={projectId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* Project Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                          {project.projectImage ? (
                            <img
                              src={project.projectImage}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-950">
                              <FiFolder className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="p-5 space-y-2">
                          <h3 className="text-lg font-bold text-white line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Links & Delete Button */}
                      <div className="px-5 pb-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {project.gitHub && (
                            <a
                              href={project.gitHub}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700/50"
                              title="GitHub Repository"
                            >
                              <FiGithub className="w-4 h-4" />
                            </a>
                          )}
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-colors border border-indigo-500/30"
                              title="Live Demo"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(projectId)}
                          disabled={isDeleting}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isDeleting ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 className="w-3.5 h-3.5" />
                          )}
                          {/* <span onClick={() => handleProjectDel}>Delete</span> */}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
