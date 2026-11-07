import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaAward,
  FaCalendarAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaPlus,
  FaUniversity,
} from "react-icons/fa";
import useFetchedCert from "../../../hooks/useFetchedCert";

const initialFormData = {
  institution: "",
  title: "",
  topicsCovered: "",
  startDate: "",
  endDate: "",
  isCurrentlyStudying: false,
  link: "",
};

const Cert = () => {
  const fetchedCert = useFetchedCert();
  const { certs } = useSelector((state) => state.user);
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const imageInput = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchedCert();
  }, [fetchedCert]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      toast.error("Certificate image must be 5 MB or smaller.");
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
      toast.error("Please log in before adding a certificate.");
      return;
    }

    if (!image) {
      toast.error("Please upload a certificate image.");
      return;
    }

    if (
      !formData.isCurrentlyStudying &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      toast.error("End date cannot be before start date.");
      return;
    }

    const requestData = new FormData();
    requestData.append("institution", formData.institution.trim());
    requestData.append("title", formData.title.trim());
    requestData.append(
      "topicsCovered",
      formData.topicsCovered
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
        .join(","),
    );
    requestData.append("startDate", formData.startDate);
    if (!formData.isCurrentlyStudying && formData.endDate) {
      requestData.append("endDate", formData.endDate);
    }
    requestData.append(
      "isCurrentlyStudying",
      String(formData.isCurrentlyStudying),
    );
    requestData.append("link", formData.link.trim());
    requestData.append("image", image);

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/cert/add-cert`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.success) {
        toast.success(
          response.data.message || "Certificate added successfully.",
        );
        setFormData(initialFormData);
        setImage(null);
        setPreview("");
        if (imageInput.current) imageInput.current.value = "";
        await fetchedCert();
      } else {
        toast.error(
          response.data?.message || "Certificate could not be added.",
        );
      }
    } catch (error) {
      const responseMessage = error.response?.data?.message;
      toast.error(
        responseMessage ||
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

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-100 antialiased sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Certificate Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage and showcase your certificates and courses.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 sm:self-auto">
            <span>Total Certificates:</span>
            <span className="font-bold text-white">{certs?.length || 0}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg lg:col-span-5"
          >
            <h2 className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-base font-semibold text-white">
              <FaPlus className="text-sm text-indigo-400" />
              Add New Certificate
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="institution"
                  className="block text-xs font-medium text-slate-400"
                >
                  Institution
                </label>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="Course provider or institution"
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="title"
                  className="block text-xs font-medium text-slate-400"
                >
                  Certificate / Course Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter the certificate title"
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="topicsCovered"
                  className="block text-xs font-medium text-slate-400"
                >
                  Topics Covered
                </label>
                <textarea
                  id="topicsCovered"
                  name="topicsCovered"
                  value={formData.topicsCovered}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js"
                  rows={3}
                  required
                  className="w-full resize-y rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Separate topics with commas.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="certificateImage"
                  className="block text-xs font-medium text-slate-400"
                >
                  Certificate Image
                </label>
                <input
                  ref={imageInput}
                  id="certificateImage"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-300 file:mr-3 file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Certificate preview"
                    className="mt-2 max-h-48 w-full rounded-lg border border-slate-800 object-contain"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="startDate"
                    className="block text-xs font-medium text-slate-400"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                {!formData.isCurrentlyStudying && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="endDate"
                      className="block text-xs font-medium text-slate-400"
                    >
                      End Date
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      min={formData.startDate || undefined}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <label className="inline-flex cursor-pointer select-none items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  name="isCurrentlyStudying"
                  checked={formData.isCurrentlyStudying}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-300">
                  Currently studying this course
                </span>
              </label>

              <div className="space-y-1.5">
                <label
                  htmlFor="link"
                  className="block text-xs font-medium text-slate-400"
                >
                  Certificate Link
                </label>
                <input
                  id="link"
                  name="link"
                  type="url"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://example.com/certificate"
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <FaPlus className="text-xs" />
                    <span>Add Certificate</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-base font-semibold text-white">
              Certificate History ({certs?.length || 0})
            </h2>

            {!certs || certs.length === 0 ? (
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
                <FaGraduationCap className="mx-auto h-8 w-8 text-slate-600" />
                <p className="text-sm font-medium text-slate-300">
                  No certificates added yet
                </p>
                <p className="text-xs text-slate-500">
                  Add a certificate or course using the form.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {certs.map((item) => (
                    <motion.article
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm transition-all duration-200 hover:border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={`${item.title} certificate`}
                            className="h-20 w-28 shrink-0 rounded-lg border border-slate-800 bg-slate-950 object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-base font-bold leading-snug text-white">
                                {item.title}
                              </h3>
                              <p className="text-sm font-medium text-slate-300">
                                {item.institution}
                              </p>
                            </div>
                            {item.isCurrentlyStudying ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                In Progress
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                                <FaCheckCircle className="text-xs text-slate-400" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                        {item.topicsCovered?.length > 0 && (
                          <div className="flex items-start gap-2">
                            <FaAward className="mt-0.5 shrink-0 text-amber-400" />
                            <span>{item.topicsCovered.join(", ")}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="shrink-0 text-slate-500" />
                          <span>
                            {item.startDate
                              ? new Date(item.startDate).toLocaleDateString()
                              : "N/A"}{" "}
                            —{" "}
                            {item.isCurrentlyStudying
                              ? "Present"
                              : item.endDate
                                ? new Date(item.endDate).toLocaleDateString()
                                : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUniversity className="shrink-0 text-slate-500" />
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                          >
                            View certificate
                            <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        </div>
                      </div>
                    </motion.article>
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

export default Cert;
