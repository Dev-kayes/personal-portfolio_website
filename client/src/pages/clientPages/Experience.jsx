import { useEffect, useState } from "react";
import axios from "axios";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchExperiences = async () => {
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

        setExperiences(response.data.experiences);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch public experiences:", fetchError);
        setError("Unable to load experience right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchExperiences();
    return () => controller.abort();
  }, []);

  return (
    <section>
      {loading ? (
        <p role="status">Loading experience...</p>
      ) : error ? (
        <p role="status">{error}</p>
      ) : experiences.length === 0 ? (
        <p>No experience added yet.</p>
      ) : (
        experiences.map((experience) => (
          <article key={experience._id}>
            <h3>{experience.position}</h3>
            <p>{experience.company}</p>
            <p>{experience.description}</p>
            <p>
              {new Date(experience.startDate).toLocaleDateString()} –{" "}
              {new Date(experience.endDate).toLocaleDateString()}
            </p>
          </article>
        ))
      )}
    </section>
  );
};

export default Experience;
