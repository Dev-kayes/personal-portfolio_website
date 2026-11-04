import { useEffect, useState } from "react";
import axios from "axios";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const socialLinks = [
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "linkedIn", label: "LinkedIn", Icon: FaLinkedin },
  { key: "twitter", label: "X", Icon: BsTwitterX },
  { key: "facebook", label: "Facebook", Icon: FaFacebook },
];

const ClientBanner = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/user/public`,
          { signal: controller.signal },
        );

        if (response.data?.success && response.data.profile) {
          setProfile(response.data.profile);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch public profile:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/skill/public`,
          { signal: controller.signal },
        );

        if (response.data?.success && Array.isArray(response.data.skills)) {
          setSkills(response.data.skills);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch banner skills:", error);
      }
    };

    fetchProfile();
    fetchSkills();
    return () => controller.abort();
  }, []);

  return (
    <div className="w-full">
      <div className="grid min-h-[calc(100svh-5rem)] w-full grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-12 lg:py-12 xl:px-16">
        <div className="mx-auto w-full max-w-4xl space-y-5 text-center lg:mx-0 lg:text-left">
          <p className="text-sm font-medium tracking-[0.12em] text-slate-300 sm:text-base">
            Hi, I&apos;m {profile?.name || "Kayes Molla"}
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-blue-500">
              {profile?.title || "Software Developer"}
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
            {profile?.intro ||
              "I build exceptional digital experiences by combining clean code, modern web technologies, and AI-powered solutions. Building smarter products for real-world problems."}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-1 lg:justify-start">
            <a
              href="#projects"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900"
            >
              Contact me
            </a>
          </div>

          <div className="flex justify-center gap-3 pt-1 lg:justify-start">
            {socialLinks.map(({ key, label, Icon }) =>
              profile?.[key] ? (
                <a
                  key={key}
                  href={profile[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ) : null,
            )}
          </div>
        </div>

        <div className="mx-auto flex aspect-square w-full max-w-[16rem] items-center justify-center overflow-hidden rounded-full border-4 border-indigo-400/30 bg-slate-900 shadow-2xl shadow-indigo-950/40 sm:max-w-[20rem] lg:max-w-none lg:w-[min(100%,30rem)]">
          {profile?.profilePic ? (
            <img
              src={profile.profilePic}
              alt={`${profile.name || "Portfolio owner"} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="text-5xl font-bold text-indigo-300"
              aria-hidden="true"
            >
              {(profile?.name || "K").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <section
          aria-label="Technologies I work with"
          className="relative overflow-hidden border-y border-indigo-400/15 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 py-7 shadow-[0_18px_60px_-30px_rgba(99,102,241,0.5)] sm:py-9"
        >
          <div className="mb-5 text-center sm:mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300 sm:text-sm">
              My toolkit
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
              Technologies I work with
            </h2>
          </div>
          <div className="skill-marquee group w-full">
            <div className="skill-marquee-track flex w-max items-center">
              {[0, 1].map((group) => (
                <div
                  key={group}
                  aria-hidden={group === 1}
                  className="skill-marquee-group flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
                >
                  {skills.map((skill) => (
                    <div
                      key={`${group}-${skill._id}`}
                      className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 shadow-lg shadow-black/10 backdrop-blur-sm sm:px-6 sm:py-4"
                    >
                      <img
                        src={skill.skillImage}
                        alt=""
                        loading="lazy"
                        className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11"
                      />
                      <span className="whitespace-nowrap text-lg font-semibold text-white sm:text-xl">
                        {skill.skillName}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ClientBanner;
