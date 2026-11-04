import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaAward, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "N/A";

const CertAndCourses = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/cert/public`,
          { signal: controller.signal },
        );

        if (
          !response.data?.success ||
          !Array.isArray(response.data.certificates)
        ) {
          throw new Error("The certificates response was invalid.");
        }

        setCertificates(response.data.certificates);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch public certificates:", fetchError);
        setError("Unable to load certificates right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchCertificates();
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-16 sm:px-8 lg:px-12">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          Learning &amp; growth
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Certifications &amp; Courses
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          A collection of my technical training, courses, and certifications.
        </p>
      </header>

      {loading ? (
        <p role="status" className="py-10 text-center text-slate-400">
          Loading certificates...
        </p>
      ) : error ? (
        <p role="status" className="py-10 text-center text-slate-400">
          {error}
        </p>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-12 text-center">
          <FaAward className="mx-auto h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">
            Certifications and courses will be added soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate, index) => (
            <motion.article
              key={certificate._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-colors hover:border-slate-700"
            >
              {certificate.image && (
                <a
                  href={certificate.image}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View image for ${certificate.title}`}
                  className="block overflow-hidden bg-slate-950"
                >
                  <img
                    src={certificate.image}
                    alt={`${certificate.title} certificate`}
                    loading="lazy"
                    className="h-52 w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </a>
              )}
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug text-white">
                      {certificate.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {certificate.institution}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      certificate.isCurrentlyStudying
                        ? "border-amber-800 bg-amber-950/70 text-amber-300"
                        : "border-emerald-800 bg-emerald-950/70 text-emerald-300"
                    }`}
                  >
                    {certificate.isCurrentlyStudying
                      ? "In Progress"
                      : "Completed"}
                  </span>
                </div>

                {certificate.topicsCovered?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {certificate.topicsCovered.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <FaCalendarAlt className="shrink-0 text-slate-500" />
                  <span>
                    {formatDate(certificate.startDate)} —{" "}
                    {certificate.isCurrentlyStudying
                      ? "Present"
                      : formatDate(certificate.endDate)}
                  </span>
                </div>

                <a
                  href={certificate.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  View certificate
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CertAndCourses;
