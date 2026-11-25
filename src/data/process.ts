import type { DisciplineId } from "./disciplines";

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  roles: DisciplineId[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Tell us the problem",
    description: "No forms to decode. Describe what's broken, slow or missing in your own words, in the form below or on a call.",
    roles: ["pm"],
  },
  {
    index: "02",
    title: "We work out what it needs",
    description: "Sometimes the real fix isn't the one you asked for. If so, we'll say so before you spend anything.",
    roles: ["pm"],
  },
  {
    index: "03",
    title: "You approve a plan",
    description: "Scope, approach and timeline in writing, before anything gets built.",
    roles: ["pm"],
  },
  {
    index: "04",
    title: "Design",
    description: "For anything with screens, you click through the design before it's built. Changes are cheap at this stage.",
    roles: ["design"],
  },
  {
    index: "05",
    title: "Build",
    description: "We build in small pieces and show you progress as we go. No black box.",
    roles: ["dev", "data"],
  },
  {
    index: "06",
    title: "Test",
    description: "It gets tested on real phones and browsers. Bugs get fixed and re-tested before launch.",
    roles: ["qa"],
  },
  {
    index: "07",
    title: "Launch and hand over",
    description: "It goes live, you get the code and a short guide, and you know who to message if something comes up.",
    roles: ["pm", "dev"],
  },
];
