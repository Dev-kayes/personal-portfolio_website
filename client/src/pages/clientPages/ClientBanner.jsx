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
    <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-16 sm:px-8 lg:flex-row lg:justify-between lg:py-24">
      <div className="max-w-2xl space-y-5 text-center lg:text-left">
        <p className="text-sm font-medium tracking-wide text-slate-300">
          Hi, I&apos;m {profile?.name || "Kayes Molla"}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <span className="text-blue-500">
            {profile?.title || "Software Developer"}
          </span>
        </h1>
        <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
          {profile?.intro ||
            "I build exceptional digital experiences by combining clean code, modern web technologies, and AI-powered solutions. Building smarter products for real-world problems."}
        </p>

        <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
          <a
            href="#projects"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900"
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
                className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5 text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            ) : null,
          )}
        </div>
      </div>

      <div className="flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-400/30 bg-slate-900 shadow-2xl shadow-indigo-950/40 sm:h-72 sm:w-72">
        {profile?.profilePic ? (
          <img
            src={profile.profilePic}
            alt={`${profile.name || "Portfolio owner"} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-6xl font-bold text-indigo-300" aria-hidden="true">
            {(profile?.name || "K").charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ClientBanner;
