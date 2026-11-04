import { FiArrowUpRight, FiHelpCircle, FiPlus } from "react-icons/fi";

const faqs = [
  {
    question: "What kind of projects can you help with?",
    answer:
      "I can help with responsive websites, full-stack web applications, REST APIs, e-commerce experiences, and improvements or fixes to existing projects.",
  },
  {
    question: "Which technologies do you work with?",
    answer:
      "My work mainly includes React on the frontend, Node.js and Express on the backend, and MongoDB for data. I choose tools based on what best fits the project.",
  },
  {
    question: "Will my website work on mobile devices?",
    answer:
      "Yes. I build responsive layouts and check the experience across different screen sizes so your site is easy to use on phones, tablets, and desktops.",
  },
  {
    question: "Can you update or fix a website that already exists?",
    answer:
      "Yes. I can help track down bugs, improve existing features, refresh the interface, and make practical performance or usability improvements.",
  },
  {
    question: "How do we get started?",
    answer:
      "Send me a message with a short description of your idea, goals, and any timeline you have in mind. We can discuss the scope and next steps from there.",
  },
];

const ClientFAQs = () => {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20 text-slate-100 sm:px-8 sm:py-24 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]"
      />

      <div className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <header className="lg:sticky lg:top-32 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            <FiHelpCircle className="h-4 w-4" aria-hidden="true" />
            Good to know
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            A few quick answers about the work I do and what it&apos;s like to
            work together.
          </p>

          <a
            href="#contact"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          >
            Still have a question? Get in touch
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </header>

        <div className="space-y-3">
          {faqs.map(({ question, answer }, index) => (
            <details
              key={question}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/10 transition-colors open:border-cyan-300/25 open:bg-slate-900/90"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left marker:hidden [&::-webkit-details-marker]:hidden sm:px-6">
                <span className="text-base font-medium leading-6 text-slate-100 transition-colors group-open:text-cyan-200 sm:text-lg">
                  {question}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950/70 text-slate-400 transition duration-200 group-open:rotate-45 group-open:border-cyan-300/40 group-open:text-cyan-200">
                  <FiPlus className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="border-t border-slate-800/80 bg-slate-950/60 px-5 py-4 sm:px-6">
                <p className="max-w-2xl text-sm leading-7 text-slate-400">
                  {answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientFAQs;
