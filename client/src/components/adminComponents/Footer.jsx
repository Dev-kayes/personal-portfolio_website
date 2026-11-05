import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { useSelector } from "react-redux";

const socialLinks = [
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "linkedIn", label: "LinkedIn", Icon: FaLinkedin },
  { key: "twitter", label: "X", Icon: BsTwitterX },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "facebook", label: "Facebook", Icon: FaFacebook },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
];

const Footer = () => {
  const userData = useSelector((state) => state.user.userData);

  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-950 px-6 py-4 text-center text-xs text-zinc-500 sm:flex-row">
      <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
      <nav
        aria-label="Social media links"
        className="flex items-center justify-center gap-2"
      >
        {socialLinks.map(({ key, label, Icon }) =>
          userData?.[key] ? (
            <a
              key={key}
              href={userData[key]}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:border-indigo-500/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null,
        )}
      </nav>
      <p>System Status: All systems operational</p>
    </footer>
  );
};

export default Footer;
