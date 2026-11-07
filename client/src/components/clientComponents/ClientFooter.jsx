import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const socialLinks = [
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "linkedIn", label: "LinkedIn", Icon: FaLinkedin },
  { key: "twitter", label: "X", Icon: BsTwitterX },
  { key: "facebook", label: "Facebook", Icon: FaFacebook },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
];

const ClientFooter = () => {
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
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, []);

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 px-6 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
          <a
            href="#home"
            className="shrink-0 text-xl font-bold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
            aria-label="K. Molla, back to top"
          >
            K.<span className="text-blue-500">Molla</span>
          </a>
          <span aria-hidden="true" className="text-slate-600">
            |
          </span>
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-slate-400">
            <span>Build with</span>
            <span className="text-rose-400">Love</span>
            <span>using</span>
            <span className="font-medium text-slate-300">MERN stack</span>
          </p>
        </div>

        <nav
          aria-label="Social media links"
          className="flex items-center justify-center gap-2 md:ml-auto"
        >
          {socialLinks.map(({ key, label, Icon }) =>
            profile?.[key] ? (
              <a
                key={key}
                href={profile[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5 text-slate-400 transition-colors hover:border-indigo-500/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null,
          )}
        </nav>
      </div>
    </footer>
  );
};

export default ClientFooter;
