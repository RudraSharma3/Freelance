import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Opening from "@/components/site/Opening";
import Brief from "@/components/site/Brief";
import Services from "@/components/site/Services";
import Proof from "@/components/site/Proof";
import Team from "@/components/site/Team";
import Work from "@/components/site/Work";
import Process from "@/components/site/Process";
import ProjectIntake from "@/components/forms/ProjectIntake";
import Finale from "@/components/site/Finale";

/**
 * The page reads top to bottom like a short story:
 * opening → what are you trying to solve → services → proof → team → work →
 * how we work → start a project → contact.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Opening />
        <Brief />
        <Services />
        <Proof />
        <Team />
        <Work />
        <Process />
        <ProjectIntake />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
