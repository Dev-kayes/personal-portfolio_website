import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ChevronDown,
  Menu,
  X,
  FileText,
  LogIn,
  Home,
  Briefcase,
  Mail,
  Award,
  Code2,
  Wrench,
  HelpCircle,
  GraduationCap,
  MessageSquareQuote,
} from "lucide-react";

const RESUME_URL = "https://myprofessionalresume.netlify.app/";
const LOGIN_ROUTE = "/admin/login";

const ClientNavbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasExperience, setHasExperience] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchExperienceAvailability = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/experience/public`,
          { signal: controller.signal },
        );

        if (
          !response.data?.success ||
          !Array.isArray(response.data.experiences)
        ) {
          throw new Error("The experience response was invalid.");
        }

        setHasExperience(response.data.experiences.length > 0);
      } catch (error) {
        if (controller.signal.aborted) return;
        setHasExperience(false);
      }
    };

    fetchExperienceAvailability();
    return () => controller.abort();
  }, []);

  const mainNavItems = [
    { name: "Home", href: "#home", id: "home", icon: Home },
    { name: "Projects", href: "#projects", id: "projects", icon: Briefcase },
    { name: "Contact", href: "#contact", id: "contact", icon: Mail },
  ];

  const moreNavItems = [
    {
      name: "Experience",
      href: "#experience",
      id: "experience",
      icon: Briefcase,
    },
    {
      name: "Certifications & Courses",
      href: "#certifications",
      id: "certifications",
      icon: Award,
    },
    { name: "Skills", href: "#skills", id: "skills", icon: Code2 },
    { name: "Services", href: "#services", id: "services", icon: Wrench },
    { name: "FAQs", href: "#faqs", id: "faqs", icon: HelpCircle },
    {
      name: "Currently Learning",
      href: "#currently-learning",
      id: "currently-learning",
      icon: GraduationCap,
    },
    {
      name: "Testimonials",
      href: "#testimonials",
      id: "testimonials",
      icon: MessageSquareQuote,
    },
  ];

  const allSectionIds = [
    ...mainNavItems.map((item) => item.id),
    ...moreNavItems.map((item) => item.id),
  ];
  const visibleMoreNavItems = moreNavItems.filter(
    (item) => item.id !== "experience" || hasExperience,
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is in top half of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    allSectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isMoreActive = visibleMoreNavItems.some(
    (item) => item.id === activeSection,
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? " backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3"
          : "backdrop-blur-sm border-b border-slate-800/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={() => handleNavClick("home")}
              className="text-2xl font-bold tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-1 py-0.5"
            >
              K.<span className="text-blue-500">Molla</span>
            </a>
          </div>

          <nav
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
            aria-label="Main Navigation"
          >
            <NavLink
              item={mainNavItems[0]}
              isActive={activeSection === mainNavItems[0].id}
              onClick={() => handleNavClick(mainNavItems[0].id)}
            />

            <NavLink
              item={mainNavItems[1]}
              isActive={activeSection === mainNavItems[1].id}
              onClick={() => handleNavClick(mainNavItems[1].id)}
            />

            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className={`group relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isMoreActive
                    ? "bg-blue-950/60 text-blue-400 font-semibold"
                    : "text-slate-300 hover:text-blue-400"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen
                      ? "rotate-180 text-blue-400"
                      : "text-slate-400"
                  }`}
                />

                <span
                  className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-500 transform origin-left transition-transform duration-300 ease-out ${
                    isMoreActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              <div
                className={`absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/50 py-2 transition-all duration-200 origin-top-left z-50 ${
                  isDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                {visibleMoreNavItems.map((subItem) => {
                  const Icon = subItem.icon;
                  const isSubActive = activeSection === subItem.id;

                  return (
                    <a
                      key={subItem.id}
                      href={subItem.href}
                      onClick={() => handleNavClick(subItem.id)}
                      className={`group relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                        isSubActive
                          ? "bg-blue-950/50 text-blue-400 font-medium"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-blue-400"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isSubActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"}`}
                      />
                      <span>{subItem.name}</span>

                      <span
                        className={`absolute bottom-1 left-4 right-4 h-0.5 bg-blue-500 transform origin-left transition-transform duration-200 ${
                          isSubActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            <NavLink
              item={mainNavItems[2]}
              isActive={activeSection === mainNavItems[2].id}
              onClick={() => handleNavClick(mainNavItems[2].id)}
            />
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-blue-950/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Resume</span>
            </a>

            <a
              href={LOGIN_ROUTE}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </a>
          </div>

          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-[85vh] opacity-100 border-b border-slate-800"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2 bg-slate-950/95 backdrop-blur-xl">
          {mainNavItems.slice(0, 2).map((item) => (
            <MobileNavLink
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}

          <div className="pt-1 pb-1">
            <button
              type="button"
              onClick={() => setIsMobileMoreOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isMoreActive
                  ? "bg-blue-950/60 text-blue-400"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileMoreOpen
                      ? "rotate-180 text-blue-400"
                      : "text-slate-400"
                  }`}
                />
                More Options
              </span>
            </button>

            <div
              className={`pl-6 space-y-1 mt-1 transition-all duration-200 ${
                isMobileMoreOpen ? "block" : "hidden"
              }`}
            >
              {visibleMoreNavItems.map((subItem) => (
                <MobileNavLink
                  key={subItem.id}
                  item={subItem}
                  isActive={activeSection === subItem.id}
                  onClick={() => handleNavClick(subItem.id)}
                />
              ))}
            </div>
          </div>

          <MobileNavLink
            item={mainNavItems[2]}
            isActive={activeSection === mainNavItems[2].id}
            onClick={() => handleNavClick(mainNavItems[2].id)}
          />

          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Resume</span>
            </a>
            <a
              href={LOGIN_ROUTE}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ item, isActive, onClick }) => {
  return (
    <a
      href={item.href}
      onClick={onClick}
      className={`group relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        isActive
          ? "bg-blue-950/60 text-blue-400 font-semibold"
          : "text-slate-300 hover:text-blue-400"
      }`}
    >
      <span>{item.name}</span>

      <span
        className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-500 transform origin-left transition-transform duration-300 ease-out ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </a>
  );
};

const MobileNavLink = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
        isActive
          ? "bg-blue-950/60 text-blue-400 border-l-2 border-blue-500"
          : "text-slate-300 hover:bg-slate-900 hover:text-white"
      }`}
    >
      {Icon && (
        <Icon
          className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`}
        />
      )}
      <span>{item.name}</span>
    </a>
  );
};

export default ClientNavbar;
