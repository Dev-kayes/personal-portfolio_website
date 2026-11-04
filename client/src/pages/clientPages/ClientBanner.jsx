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

    fetchProfile();
    return () => controller.abort();
  }, []);

  return (
    <div className="grid min-h-[calc(100svh-5rem)] w-full grid-cols-1 items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-16 lg:py-20 xl:px-24 2xl:px-32">
      <div className="mx-auto w-full max-w-4xl space-y-7 text-center lg:mx-0 lg:text-left">
        <p className="text-base font-medium tracking-[0.12em] text-slate-300 sm:text-lg">
          Hi, I&apos;m {profile?.name || "Kayes Molla"}
        </p>
        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="text-blue-500">
            {profile?.title || "Software Developer"}
          </span>
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl lg:text-2xl">
          {profile?.intro ||
            "I build exceptional digital experiences by combining clean code, modern web technologies, and AI-powered solutions. Building smarter products for real-world problems."}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2 lg:justify-start">
          <a
            href="#projects"
            className="rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-slate-700 px-7 py-3.5 text-base font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900"
          >
            Contact me
          </a>
        </div>

        <div className="flex justify-center gap-4 pt-2 lg:justify-start">
          {socialLinks.map(({ key, label, Icon }) =>
            profile?.[key] ? (
              <a
                key={key}
                href={profile[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-white"
              >
                <Icon className="h-6 w-6" />
              </a>
            ) : null,
          )}
        </div>
      </div>

      <div className="mx-auto flex aspect-square w-full max-w-[22rem] items-center justify-center overflow-hidden rounded-full border-4 border-indigo-400/30 bg-slate-900 shadow-2xl shadow-indigo-950/40 sm:max-w-[28rem] lg:max-w-none lg:w-[min(100%,42rem)]">
        {profile?.profilePic ? (
          <img
            src={profile.profilePic}
            alt={`${profile.name || "Portfolio owner"} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="text-6xl font-bold text-indigo-300"
            aria-hidden="true"
          >
            {(profile?.name || "K").charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ClientBanner;
