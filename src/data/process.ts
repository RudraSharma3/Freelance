export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Tell me the problem",
    description:
      "No forms to decode. Describe what's broken, slow or missing — in your own words.",
  },
  {
    index: "02",
    title: "I figure out what actually needs to be done",
    description:
      "Sometimes the real fix isn't the one you asked for. I'll tell you what the problem actually requires.",
  },
  {
    index: "03",
    title: "I propose the solution",
    description: "Scope, approach and timeline — before anything gets built.",
  },
  {
    index: "04",
    title: "We build",
    description: "I work, you get visibility into progress. No black box.",
  },
  {
    index: "05",
    title: "You get something usable",
    description: "Not a prototype that dies after the demo. Something you can actually run.",
  },
];
