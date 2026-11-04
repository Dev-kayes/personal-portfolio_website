import { useEffect, useState } from "react";
import axios from "axios";
import { Code2 } from "lucide-react";

const skillSections = [
  { value: "FrontEnd", label: "Frontend" },
  { value: "BackEnd", label: "Backend" },
  { value: "Database", label: "Database" },
  { value: "Tools & others", label: "Tools & Others" },
];

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/skill/public`,
          { signal: controller.signal },
        );

        if (!response.data?.success || !Array.isArray(response.data.skills)) {
          throw new Error("The skills response was invalid.");
        }

        setSkills(response.data.skills);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch public skills:", fetchError);
        setError("Unable to load skills right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchSkills();

    return () => controller.abort();
  }, []);

  return (
    <section className="min-h-[65vh] px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-400 sm:text-sm">
            What I work with
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Skills &amp; Technologies
          </h2>
          <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
            Modern tools and technologies I use to build fast, secure, and
            scalable web applications.
          </p>
        </div>

        {loading ? (
          <p role="status" className="text-center text-slate-400">
            Loading skills...
          </p>
        ) : error ? (
          <p role="status" className="text-center text-slate-400">
            {error}
          </p>
        ) : skills.length === 0 ? (
          <p className="text-center text-slate-400">
            Skills will be added soon.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {skillSections.map(({ value, label }) => {
              const sectionSkills = skills.filter(
                (skill) => skill.skillSection === value,
              );

              if (sectionSkills.length === 0) return null;

              return (
                <section
                  key={value}
                  aria-labelledby={`skill-section-${value}`}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-xl shadow-black/10 backdrop-blur-sm sm:p-6"
                >
                  <h3
                    id={`skill-section-${value}`}
                    className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4 text-lg font-semibold text-white sm:text-xl"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10">
                      <Code2
                        aria-hidden="true"
                        className="h-5 w-5 text-indigo-300"
                      />
                    </span>
                    {label}
                  </h3>
                  <div className="space-y-3">
                    {sectionSkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 transition-colors hover:border-indigo-400/30 hover:bg-indigo-950/30 sm:px-5"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                          <img
                            src={skill.skillImage}
                            alt=""
                            loading="lazy"
                            className="h-8 w-8 object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1 break-words text-base font-medium text-slate-100 sm:text-lg">
                          {skill.skillName}
                        </span>
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
