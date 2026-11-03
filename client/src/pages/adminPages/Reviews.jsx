import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuMessageSquareQuote,
  LuPlus,
  LuQuote,
  LuStar,
  LuTrash2,
} from "react-icons/lu";

const initialFormData = { name: "", content: "", image: "" };

const Reviews = () => {
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const fetchReviews = useCallback(async () => {
    const response = await axios.get(`${serverURL}/api/rev/get-all-rev`);
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to load reviews.");
    }
    return response.data.reviews || [];
  }, [serverURL]);

  useEffect(() => {
    let active = true;
    fetchReviews()
      .then((loadedReviews) => {
        if (active) setReviews(loadedReviews);
      })
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
        toast.error(error.response?.data?.message || error.message);
      });

    return () => {
      active = false;
    };
  }, [fetchReviews]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${serverURL}/api/rev/add-rev`,
        {
          name: formData.name.trim(),
          content: formData.content.trim(),
          image: formData.image.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Review added successfully.");
        setFormData(initialFormData);
        try {
          setReviews(await fetchReviews());
        } catch (error) {
          console.error("Failed to refresh reviews:", error);
          toast.error(
            error.response?.data?.message ||
              "Review was added, but the list could not be refreshed.",
          );
        }
      } else {
        toast.error(response.data?.message || "Unable to add review.");
      }
    } catch (error) {
      console.error("Failed to add review:", error);
      toast.error(error.response?.data?.message || "Unable to add review.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    setDeletingReviewId(reviewId);
    try {
      const response = await axios.delete(
        `${serverURL}/api/rev/del-rev/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Review deleted successfully.");
        setReviews((current) =>
          current.filter((review) => review._id !== reviewId),
        );
      } else {
        toast.error(response.data?.message || "Unable to delete review.");
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error(error.response?.data?.message || "Unable to delete review.");
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-100 antialiased sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Reviews Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Add and manage testimonials for your portfolio.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 sm:self-auto">
            <span>Total Reviews:</span>
            <span className="font-bold text-white">{reviews.length}</span>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg lg:col-span-5"
          >
            <h2 className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-base font-semibold text-white">
              <LuPlus className="text-sm text-indigo-400" />
              Add New Review
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="review-name"
                  className="block text-xs font-medium text-slate-400"
                >
                  Reviewer Name
                </label>
                <input
                  id="review-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Alex Morgan"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="review-content"
                  className="block text-xs font-medium text-slate-400"
                >
                  Review
                </label>
                <textarea
                  id="review-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the testimonial..."
                  required
                  maxLength={2000}
                  rows={5}
                  className="w-full resize-y rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="review-image"
                  className="block text-xs font-medium text-slate-400"
                >
                  Profile Image URL <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  id="review-image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuPlus />
                {loading ? "Adding review..." : "Add Review"}
              </button>
            </form>
          </motion.section>

          <section className="space-y-4 lg:col-span-7">
            <h2 className="text-base font-semibold text-white">
              Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
                <LuMessageSquareQuote className="mx-auto h-8 w-8 text-slate-600" />
                <p className="text-sm font-medium text-slate-300">
                  No reviews added yet
                </p>
                <p className="text-xs text-slate-500">
                  Add a testimonial using the form.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {reviews.map((review) => (
                    <motion.article
                      key={review._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {review.image ? (
                            <img
                              src={review.image}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-full border border-slate-800 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-indigo-400">
                              <LuQuote />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-white">
                              {review.name}
                            </h3>
                            <div
                              className="mt-1 flex gap-0.5 text-amber-400"
                              aria-label="5 stars"
                            >
                              {Array.from({ length: 5 }, (_, index) => (
                                <LuStar key={index} className="h-3.5 w-3.5" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(review._id)}
                          disabled={deletingReviewId === review._id}
                          aria-label={`Delete review by ${review.name}`}
                          className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-950/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">
                        {review.content}
                      </p>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
