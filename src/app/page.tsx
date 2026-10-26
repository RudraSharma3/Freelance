import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProblemSelector from "@/components/sections/ProblemSelector";
import Services from "@/components/sections/Services";
import Proof from "@/components/sections/Proof";
import CaseStudies from "@/components/sections/CaseStudies";
import TechnicalCapability from "@/components/sections/TechnicalCapability";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import ProjectIntake from "@/components/forms/ProjectIntake";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="grain">
        <Hero />
        <ProblemSelector />
        <Services />
        <Proof />
        <CaseStudies />
        <TechnicalCapability />
        <Process />
        <About />
        <ProjectIntake />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
