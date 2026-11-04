import {
  FiArrowUpRight,
  FiCode,
  FiGlobe,
  FiLayers,
  FiShoppingBag,
  FiTool,
} from "react-icons/fi";

const services = [
  {
    number: "01",
    title: "Responsive Websites",
    description:
      "Fast, polished websites that look and work great on every screen, from mobile to desktop.",
    icon: FiGlobe,
    tags: ["Responsive UI", "Performance", "Accessibility"],
    accent: "from-cyan-400/20 to-blue-500/5",
  },
  {
    number: "02",
    title: "Full-Stack Development",
    description:
      "Complete web applications, built end to end with thoughtful interfaces and reliable functionality.",
    icon: FiCode,
    tags: ["React", "Node.js", "MongoDB"],
    accent: "from-indigo-400/20 to-violet-500/5",
  },
  {
    number: "03",
    title: "API Development",
    description:
      "Well-structured REST APIs that connect your product, handle data, and support future growth.",
    icon: FiLayers,
    tags: ["REST APIs", "Integrations", "Scalable"],
    accent: "from-fuchsia-400/20 to-indigo-500/5",
  },
  {
    number: "04",
    title: "E-commerce Solutions",
    description:
      "Easy-to-use online stores with product catalogs and a smooth, dependable customer experience.",
    icon: FiShoppingBag,
    tags: ["Online stores", "Payments", "Custom builds"],
    accent: "from-emerald-400/20 to-teal-500/5",
  },
  {
    number: "05",
    title: "Maintenance & Fixes",
    description:
      "Practical bug fixes, improvements, and ongoing care to keep your website working smoothly.",
    icon: FiTool,
    tags: ["Bug fixing", "Updates", "Optimization"],
    accent: "from-amber-400/20 to-orange-500/5",
  },
];

const ClientServices = () => {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20 text-slate-100 sm:px-8 sm:py-24 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[100px]"
      />

      <div className="relative">
        <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
            What I can do for you
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Services built around{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              your goals
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            From a first idea to a finished product, I create modern web
            solutions that help people and businesses grow online.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(
            ({ number, title, description, icon: Icon, tags, accent }) => (
              <article
                key={number}
                className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-slate-900/80 sm:p-7"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-400/10 text-indigo-200 transition-colors group-hover:border-indigo-300/30 group-hover:bg-indigo-400/15">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-slate-600">
                    {number}
                  </span>
                </div>

                <div className="relative mt-6">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </div>

                <ul className="relative mt-auto flex flex-wrap gap-2 pt-6">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-400"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Have a project in mind?
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Let&apos;s talk about what you&apos;re looking to build.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            Get in touch
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClientServices;
