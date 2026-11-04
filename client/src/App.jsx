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
import ClientExperience from "./pages/clientPages/Experience";
import Topics from "./pages/adminPages/Topics";
import Cert from "./pages/adminPages/Cert";

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
          <h2 className="text-2xl font-bold">Projects</h2>
        </section>

        <section id="experience" className="scroll-mt-24 p-8 min-h-[50vh]">
          <ClientExperience />
        </section>

        <section id="skills" className="scroll-mt-24">
          <SkillsSection />
        </section>

        <section id="contact" className="scroll-mt-24 p-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold">Contact</h2>
        </section>
      </main>
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
