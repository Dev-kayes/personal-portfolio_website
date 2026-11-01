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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/skill/public`,
        );
        if (response.data?.success) {
          setSkills(response.data.skills);
        } else {
          setError("Unable to load skills right now.");
        }
      } catch (fetchError) {
        console.error("Failed to fetch public skills:", fetchError);
        setError("Unable to load skills right now.");
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="px-8 py-16 min-h-[50vh]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            What I work with
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Skills &amp; Technologies
          </h2>
        </div>

        {error ? (
          <p role="status" className="text-center text-slate-400">
            {error}
          </p>
        ) : skills.length === 0 ? (
          <p className="text-center text-slate-400">
            Skills will be added soon.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {skillSections.map(({ value, label }) => {
              const sectionSkills = skills.filter(
                (skill) => skill.skillSection === value,
              );

              if (sectionSkills.length === 0) return null;

              return (
                <section
                  key={value}
                  aria-labelledby={`skill-section-${value}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
                >
                  <h3
                    id={`skill-section-${value}`}
                    className="mb-5 flex items-center gap-2 text-xl font-semibold text-white"
                  >
                    <Code2 aria-hidden="true" className="h-5 w-5 text-indigo-400" />
                    {label}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {sectionSkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                      >
                        <img
                          src={skill.skillImage}
                          alt=""
                          loading="lazy"
                          className="h-8 w-8 object-contain"
                        />
                        <span className="text-sm font-medium text-slate-200">
                          {skill.skillName}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
