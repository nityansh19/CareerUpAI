import { useEffect } from "react";

const COPY_REPLACEMENTS = new Map([
  [
    "CareerUp AI understands your skills, resume and goals, then turns them into clear career direction—not another dashboard full of noise.",
    "CareerUp AI brings your resume, skills, goals and career planning into one intelligent workspace. Discover suitable roles, identify skill gaps and turn them into a practical plan for growth."
  ],
  ["Less clutter.", "Everything connected."],
  ["More useful intelligence.", "One career intelligence workspace."],
  [
    "Instead of placing every feature on the homepage, the new CareerUp experience gives each capability its own space. The landing page explains the value; the product does the work.",
    "Analyze your resume, understand where your skills can take you and build a focused roadmap toward the roles you want. CareerUp keeps every insight connected to one evolving career profile."
  ],
  [
    "Turn a static CV into a structured career profile that AI can actually reason about.",
    "Analyze your resume to uncover strengths, missing skills and opportunities to improve your profile for the roles you want."
  ],
  [
    "Understand your strongest directions, skill gaps and realistic next moves.",
    "Explore roles that match your background and understand the skills, experience and projects that can move you closer to them."
  ],
  [
    "Convert analysis into a focused path with clear skills, projects and milestones.",
    "Turn career insights into a personalized roadmap with clear skills to learn, projects to build and milestones to reach."
  ],
  ["Intelligence overview", "Career snapshot"],
  ["Live model", "Personalized"],
  [
    "CareerUp builds a living career profile from your education, skills, projects, experience and goals. That profile becomes the context behind every recommendation.",
    "CareerUp combines your education, skills, projects, experience, resume and goals into one career profile. Every recommendation is shaped around that context so your guidance stays relevant to you."
  ],
  ["Simple by design", "How CareerUp works"],
  [
    "Tell CareerUp what you know, what you've built and where you want to go.",
    "Add your resume, skills, education, projects and career goals to create your personal career profile."
  ],
  [
    "Your resume, skills and goals become one structured intelligence profile.",
    "CareerUp connects your background and goals to identify strengths, gaps and career paths that fit your profile."
  ],
  [
    "Get focused recommendations, roadmaps and next actions instead of generic advice.",
    "Follow personalized recommendations, skill priorities and roadmaps that give you clear next steps for progressing toward your target role."
  ],
  [
    "Start with what you already have. CareerUp AI will help you understand what comes next.",
    "Create your profile, understand your opportunities and build a clearer path toward the career you want."
  ],
  ["Career intelligence for what comes next.", "Your intelligent workspace for career growth."]
]);

export default function ProductionCopy() {
  useEffect(() => {
    document.title = "CareerUp AI — AI Career Intelligence & Personalized Roadmaps";

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content =
      "CareerUp AI helps you analyze your resume, discover suitable career paths, identify skill gaps and build personalized roadmaps for professional growth.";

    const applyCopy = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let node = walker.nextNode();
      while (node) {
        textNodes.push(node);
        node = walker.nextNode();
      }

      textNodes.forEach((textNode) => {
        const original = textNode.nodeValue?.trim();
        if (!original || !COPY_REPLACEMENTS.has(original)) return;
        textNode.nodeValue = textNode.nodeValue.replace(original, COPY_REPLACEMENTS.get(original));
      });

      const desktopNav = document.querySelector("header nav");
      if (desktopNav) {
        const anchors = [...desktopNav.querySelectorAll("a")];
        const routes = new Map([
          ["Product", "/product"],
          ["Intelligence", "/career-intelligence"],
          ["How it works", "/roadmaps"],
        ]);

        anchors.forEach((anchor) => {
          const label = anchor.textContent?.trim();
          if (routes.has(label)) anchor.setAttribute("href", routes.get(label));
        });

        if (!desktopNav.querySelector('[data-careerup-page="pricing"]')) {
          const login = anchors.find((anchor) => anchor.textContent?.trim() === "Login");
          const pricing = document.createElement("a");
          pricing.href = "/pricing";
          pricing.textContent = "Pricing";
          pricing.dataset.careerupPage = "pricing";
          pricing.className = "text-sm text-white/45 transition hover:text-white";
          desktopNav.insertBefore(pricing, login || null);

          const about = document.createElement("a");
          about.href = "/about";
          about.textContent = "About";
          about.dataset.careerupPage = "about";
          about.className = "text-sm text-white/45 transition hover:text-white";
          desktopNav.insertBefore(about, login || null);
        }
      }
    };

    applyCopy();
    const frame = requestAnimationFrame(applyCopy);
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
