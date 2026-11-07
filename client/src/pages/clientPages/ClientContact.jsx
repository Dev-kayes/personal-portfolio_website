import { useState } from "react";
import axios from "axios";
import { FiArrowUpRight, FiLoader, FiMail, FiSend } from "react-icons/fi";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const contactEmail = "devkayesmolla@gmail.com";

const ClientContact = () => {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [fallbackMailto, setFallbackMailto] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setFeedback({ type: "", message: "" });
    setFallbackMailto("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/contact/send-message`,
        form,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to send your message.",
        );
      }

      setForm(initialForm);
      setFeedback({
        type: "success",
        message: response.data.message || "Your message has been sent.",
      });
    } catch (error) {
      const canUseEmailFallback =
        !error.response || error.response.status >= 500;
      const emailSubject = encodeURIComponent(
        form.subject.trim() || "Portfolio contact",
      );
      const emailBody = encodeURIComponent(
        [
          `Name: ${form.name.trim()}`,
          `Email: ${form.email.trim()}`,
          "",
          form.message.trim(),
        ].join("\n"),
      );
      if (canUseEmailFallback) {
        setFallbackMailto(
          `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`,
        );
      }
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Unable to send your message right now.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20 text-slate-100 sm:px-8 sm:py-24 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-[110px]"
      />

      <div className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <header className="lg:sticky lg:top-32 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            <FiMail className="h-4 w-4" aria-hidden="true" />
            Get in touch
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Let&apos;s build something{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              together
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            Have a project in mind or just want to say hello? Send me a message
            and I&apos;ll get back to you.
          </p>

          <a
            href={`mailto:${contactEmail}`}
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
          >
            devkayesmolla@gmail.com
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="text-sm font-medium text-slate-300"
              >
                Your name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                placeholder="Enter Your Name"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                maxLength={254}
                placeholder="Email@gmail.com"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-subject"
              className="text-sm font-medium text-slate-300"
            >
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              maxLength={150}
              placeholder="What would you like to discuss?"
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-slate-300"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              maxLength={5000}
              rows={6}
              placeholder="Tell me a little about your project..."
              required
              className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
            />
            <p className="text-right text-xs text-slate-500">
              {form.message.length}/5000
            </p>
          </div>

          {feedback.message && (
            <div>
              <p
                role="status"
                className={`text-sm ${
                  feedback.type === "success"
                    ? "text-emerald-300"
                    : "text-rose-300"
                }`}
              >
                {feedback.message}
              </p>
              {fallbackMailto && (
                <a
                  href={fallbackMailto}
                  className="mt-2 inline-flex text-sm font-medium text-indigo-300 underline underline-offset-4 hover:text-white"
                >
                  Open your email app with this message
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {sending ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <FiSend className="h-4 w-4" aria-hidden="true" />
                Send message
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ClientContact;
