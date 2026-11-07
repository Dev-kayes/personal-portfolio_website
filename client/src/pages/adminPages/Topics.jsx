import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { FaHashtag, FaPlus } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import useFetchedTopic from "../../../hooks/useFetchedTopic";

const initialFormData = {
  topic: "",
  description: "",
  status: "Planned",
};

const statusStyles = {
  Learning: "border-sky-800 bg-sky-950/70 text-sky-300",
  "In Progress": "border-amber-800 bg-amber-950/70 text-amber-300",
  Planned: "border-violet-800 bg-violet-950/70 text-violet-300",
};

const Topics = () => {
  const fetchedTopic = useFetchedTopic();
  const { topics } = useSelector((state) => state.user);
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const imageInput = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState("");

  useEffect(() => {
    fetchedTopic();
  }, [fetchedTopic]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files?.[0];
    if (!selectedImage) return;

    const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!acceptedImageTypes.includes(selectedImage.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Topic image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in before adding a topic.");
      return;
    }

    if (!image) {
      toast.error("Please upload a topic image.");
      return;
    }

    const requestData = new FormData();
    requestData.append("topic", formData.topic.trim());
    requestData.append("description", formData.description.trim());
    requestData.append("status", formData.status);
    requestData.append("image", image);

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/topic/add-topic`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Topic added successfully.");
        setFormData(initialFormData);
        setImage(null);
        setPreview("");
        if (imageInput.current) imageInput.current.value = "";
        await fetchedTopic();
      } else {
        toast.error(response.data?.message || "Topic could not be added.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : null) ||
          error.message ||
          "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in before deleting a topic.");
      return;
    }

    setDeletingTopicId(topicId);
    try {
      const response = await axios.delete(
        `${serverURL}/api/topic/delete-topic/${topicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data?.success) {
        toast.error(response.data?.message || "Topic could not be deleted.");
        return;
      }

      toast.success(response.data.message || "Topic deleted successfully.");
      await fetchedTopic();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Topic could not be deleted.",
      );
    } finally {
      setDeletingTopicId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-100 antialiased sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Topic Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Add and manage the topics you want to showcase.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 sm:self-auto">
            <span>Total Topics:</span>
            <span className="font-bold text-white">{topics?.length || 0}</span>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg sm:p-6"
        >
          <h2 className="mb-4 flex items-center gap-2 border-b border-slate-800/80 pb-3 text-base font-semibold text-white">
            <FaPlus className="text-sm text-indigo-400" />
            Add New Topic
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="topic"
                  className="block text-xs font-medium text-slate-400"
                >
                  Topic Name
                </label>
                <input
                  id="topic"
                  name="topic"
                  type="text"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Development"
                  maxLength={100}
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="status"
                  className="block text-xs font-medium text-slate-400"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Learning">Learning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-xs font-medium text-slate-400"
              >
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe what this topic is about..."
                maxLength={300}
                rows={3}
                required
                className="w-full resize-y rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-right text-[11px] text-slate-500">
                {formData.description.length}/300
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="topicImage"
                className="block text-xs font-medium text-slate-400"
              >
                Topic Image
              </label>
              <input
                ref={imageInput}
                id="topicImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-300 file:mr-3 file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
              />
              <p className="text-[11px] text-slate-500">
                JPG, PNG, or WEBP up to 5 MB.
              </p>
              {preview && (
                <img
                  src={preview}
                  alt="Topic preview"
                  className="mt-2 max-h-52 w-full rounded-lg border border-slate-800 object-cover"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.topic.trim() ||
                !formData.description.trim() ||
                !image
              }
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <FaPlus className="text-xs" />
                  Add Topic
                </>
              )}
            </button>
          </form>
        </motion.section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-white">
            Your Topics ({topics?.length || 0})
          </h2>

          {!topics || topics.length === 0 ? (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <FaHashtag className="mx-auto h-8 w-8 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">
                No topics added yet
              </p>
              <p className="text-xs text-slate-500">
                Add your first topic using the form above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {topics.map((item, index) => (
                  <motion.article
                    key={item._id || `${item.topic}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 transition-colors hover:border-slate-700"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={`${item.topic} topic`}
                        className="h-40 w-full bg-slate-950 object-cover"
                      />
                    )}
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                            <FaHashtag />
                          </span>
                          <h3 className="break-words text-sm font-semibold text-slate-100">
                            {item.topic}
                          </h3>
                        </div>
                        {item.status && (
                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                              statusStyles[item.status] ||
                              "border-slate-700 bg-slate-800 text-slate-300"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-400">
                          {item.description}
                        </p>
                      )}
                      <div className="flex justify-end border-t border-slate-800 pt-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteTopic(item._id)}
                          disabled={deletingTopicId === item._id}
                          aria-label={`Delete ${item.topic}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-900/70 px-3 py-2 text-xs font-medium text-red-300 transition-colors hover:border-red-700 hover:bg-red-950/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingTopicId === item._id ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
                          ) : (
                            <FiTrash2 aria-hidden="true" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Topics;
