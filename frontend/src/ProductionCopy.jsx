import { useEffect } from "react";

export default function ProductionCopy() {
  useEffect(() => {
    document.title = "CareerUp AI — Career Intelligence, Resume Analysis & Roadmaps";

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }

    description.content =
      "CareerUp AI connects your resume, skills and goals into one intelligent career profile, helping you understand role readiness, skill gaps and personalized next steps.";
  }, []);

  return null;
}
