import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { useProjects } from './hooks/useProjects.js';

export default function App() {
  const { profile, projects, loading, error } = useProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} loading={loading} />
        <About />
        <Projects projects={projects} loading={loading} error={error} />
        <Skills projects={projects} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
