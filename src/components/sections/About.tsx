import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE } from "@/data/config";

export default function About() {
  return (
    <section id="about" className="border-t border-border-soft bg-bg-elevated/30">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[220px_1fr] lg:items-start">
        <div className="mx-auto w-40 overflow-hidden rounded-2xl border border-border lg:mx-0 lg:w-full">
          <Image
            src="/images/rudra-avatar.jpg"
            alt={SITE.name}
            width={400}
            height={400}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <SectionHeading eyebrow="About" title="Hi, I&apos;m Rudra." />
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            I&apos;m a Computer Science (AIML) student and data engineer who likes taking a messy,
            underspecified problem and figuring out what actually needs to be built. Most of my
            work sits somewhere between AI, data pipelines and backend engineering — but the
            skill that carries over to resumes and portfolios is the same one: understand the
            problem before you touch the solution.
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            If I can&apos;t build something properly, I&apos;ll tell you — instead of building it badly.
          </p>
        </div>
      </div>
    </section>
  );
}
