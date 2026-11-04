import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/adminPages/Home";
import Login from "./pages/adminPages/Login";
import Register from "./pages/adminPages/Register";
import { Toaster } from "react-hot-toast";
import useFetchedUserData from "../hooks/userFetchedUserData";
import DashBoard from "./pages/adminPages/DashBoard";
import Profile from "./pages/adminPages/Profile";
import Projects from "./pages/adminPages/Projects";
import Experience from "./pages/adminPages/Experience";
import Skills from "./pages/adminPages/Skills";
// import Education from "./pages/adminPages/Education";
import Achievements from "./pages/adminPages/Achievements";
import Reviews from "./pages/adminPages/Reviews";

// Client Component Imports
import ClientBanner from "./pages/clientPages/ClientBanner";
import ClientNavbar from "./components/clientComponents/ClientNavbar";
import SkillsSection from "./pages/clientPages/SkillsSection";
// import ClientExperience from "./pages/clientPages/Experience";
import ClientProjects from "./pages/clientPages/ClientProjects";
import Topics from "./pages/adminPages/Topics";
import Cert from "./pages/adminPages/Cert";
import CertAndCourses from "./pages/clientPages/CertAndCourses";
import ClientServices from "./pages/clientPages/ClientServices";
import ClientFAQs from "./pages/clientPages/ClientFAQs";
import ClientTopicCovered from "./pages/clientPages/ClientTopicCovered";
import ClientTestimonials from "./pages/clientPages/ClientTestimonials";
import ClientFooter from "./components/clientComponents/ClientFooter";
import ClientContact from "./pages/clientPages/ClientContact";

// Function for Background Image rotation:
function GalaxyBackground() {
  return (
    <div className="galaxy-background" aria-hidden="true">
      <img src="/galaxy.png" alt="" />
    </div>
  );
}

// Local Wrapper Component for your public portfolio view
const ClientLayout = () => {
  return (
    <div className="text-slate-100 min-h-screen">
      {/* Sticky Navigation */}
      <ClientNavbar />

      {/* Main Page Content */}
      <main className="pt-20">
        <section id="home" className="scroll-mt-24">
          <ClientBanner />
        </section>

        {/* <section id="about" className="scroll-mt-24 p-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold">About Me</h2>
        </section> */}

        <section id="projects" className="scroll-mt-24 p-8 min-h-[50vh]">
          <ClientProjects limit={3} />
        </section>

        {/* <section id="experience" className="scroll-mt-24 p-8 min-h-[50vh]">
          <ClientExperience />
        </section> */}

        <section id="certifications" className="scroll-mt-30">
          <CertAndCourses />
        </section>
        <section id="skills" className="scroll-mt-30">
          <SkillsSection />
        </section>
        <section id="currently-learning" className="scroll-mt-30">
          <ClientTopicCovered />
        </section>
        <section id="services" className="scroll-mt-30">
          <ClientServices />
        </section>
        <section id="faqs" className="scroll-mt-30">
          <ClientFAQs />
        </section>
        <section id="testimonials" className="scroll-mt-30">
          <ClientTestimonials />
        </section>

        <section id="contact" className="scroll-mt-24">
          <ClientContact />
        </section>
      </main>
      <ClientFooter />
    </div>
  );
};

const App = () => {
  useFetchedUserData();

  return (
    <>
      <GalaxyBackground />
      <Toaster />
      <Routes>
        {/* Public Portfolio Page */}
        <Route path="/" element={<ClientLayout />} />
        <Route path="/projects" element={<ClientProjects />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<Home />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="skills" element={<Skills />} />
          {/* <Route path="education" element={<Education />} /> */}
          <Route path="cert" element={<Cert />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="topics" element={<Topics />} />
          {/* <Route path="currently-learning" element={<CurrentLearnings />} /> */}
          <Route path="reviews" element={<Reviews />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
