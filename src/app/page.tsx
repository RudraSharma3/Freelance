import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/site/Hero";
import ProblemPicker from "@/components/site/ProblemPicker";
import ServicesRail from "@/components/site/ServicesRail";
import Statement from "@/components/site/Statement";
import Bento from "@/components/site/Bento";
import Work from "@/components/site/Work";
import StackSteps from "@/components/site/StackSteps";
import ProjectIntake from "@/components/forms/ProjectIntake";
import ContactPanel from "@/components/site/ContactPanel";

/**
 * hero + moving services band → pick your problem → services rail (slides
 * sideways while you scroll) → one sentence that fills in → bento of what's
 * under one roof → work (once there are client projects) → stacking process
 * cards → project form → contact panel → wordmark footer.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemPicker />
        <ServicesRail />
        <Statement />
        <Bento />
        <Work />
        <StackSteps />
        <ProjectIntake />
        <ContactPanel />
      </main>
      <Footer />
    </>
  );
}
