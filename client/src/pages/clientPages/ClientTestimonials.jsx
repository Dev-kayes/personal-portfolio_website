import { useEffect, useState } from "react";
import axios from "axios";
import { LuMessageSquareQuote, LuQuote, LuStar } from "react-icons/lu";

const ClientTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/rev/get-all-rev`,
          { signal: controller.signal },
        );

        if (!response.data?.success || !Array.isArray(response.data.reviews)) {
          throw new Error("The testimonials response was invalid.");
        }

        setTestimonials(response.data.reviews);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError("Unable to load testimonials right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchTestimonials();
    return () => controller.abort();
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20 text-slate-100 sm:px-8 sm:py-24 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[110px]"
      />

      <div className="relative space-y-10">
        <header className="mx-auto max-w-2xl space-y-4 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            <LuMessageSquareQuote className="h-4 w-4" aria-hidden="true" />
            Kind words
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            What people say
          </h2>
          <p className="text-sm leading-7 text-slate-400 sm:text-base">
            Feedback from people I&apos;ve had the pleasure of working with.
          </p>
        </header>

        {loading ? (
          <p role="status" className="py-10 text-center text-slate-400">
            Loading testimonials...
          </p>
        ) : error ? (
          <p role="status" className="py-10 text-center text-slate-400">
            {error}
          </p>
        ) : testimonials.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-12 text-center">
            <LuMessageSquareQuote className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">
              Testimonials will be added soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial._id}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-6 shadow-xl shadow-black/10"
              >
                <div className="flex items-center justify-between">
                  <LuQuote
                    className="h-8 w-8 text-indigo-300/80"
                    aria-hidden="true"
                  />
                  <div
                    className="flex gap-1 text-amber-300"
                    aria-label="5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <LuStar
                        key={index}
                        className="h-4 w-4 fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="my-6 flex-1 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 sm:text-base">
                  “{testimonial.content}”
                </blockquote>

                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-indigo-300/20 bg-indigo-300/10 text-indigo-200"
                    >
                      <LuQuote className="h-5 w-5" />
                    </span>
                  )}
                  <p className="font-semibold text-white">{testimonial.name}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientTestimonials;
