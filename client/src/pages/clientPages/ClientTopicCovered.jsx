import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiBookOpen, FiFolder } from "react-icons/fi";

const statusStyles = {
  Learning: "border-sky-800 bg-sky-950/70 text-sky-300",
  "In Progress": "border-amber-800 bg-amber-950/70 text-amber-300",
  Planned: "border-violet-800 bg-violet-950/70 text-violet-300",
};

const ClientTopicCovered = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/topic/public`,
          { signal: controller.signal },
        );

        if (!response.data?.success || !Array.isArray(response.data.topics)) {
          throw new Error("The topics response was invalid.");
        }

        setTopics(response.data.topics);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch topics:", fetchError);
        const apiMessage = fetchError.response?.data?.message;
        setError(
          apiMessage ||
            (fetchError.response?.status === 404
              ? "The topics API is not available. Please deploy the latest backend changes."
              : "Unable to load topics right now."),
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchTopics();
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-16 sm:px-8 lg:px-12">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          Learning roadmap
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Topics I&apos;m Exploring
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          A snapshot of the technologies, concepts, and skills I&apos;m actively
          learning and improving.
        </p>
      </header>

      {loading ? (
        <p role="status" className="py-10 text-center text-slate-400">
          Loading topics...
        </p>
      ) : error ? (
        <p role="status" className="py-10 text-center text-slate-400">
          {error}
        </p>
      ) : topics.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-12 text-center">
          <FiFolder className="mx-auto h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">
            Topics will be added soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic, index) => (
            <motion.article
              key={topic._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
            >
              {topic.image ? (
                <img
                  src={topic.image}
                  alt={`${topic.topic} topic illustration`}
                  loading="lazy"
                  className="h-52 w-full bg-slate-950 object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-slate-950 text-slate-600">
                  <FiBookOpen className="h-10 w-10" />
                </div>
              )}

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    {topic.topic}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[topic.status] || "border-slate-700 bg-slate-800 text-slate-300"}`}
                  >
                    {topic.status}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                  {topic.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClientTopicCovered;
