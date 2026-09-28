export const roles = [
  { title: "Frontend Developer", skills: ["HTML", "CSS", "JavaScript", "React", "Git"], interests: ["Web Development", "Frontend", "UI"], goals: ["Frontend Developer", "Front End Developer"], summary: "Build accessible, interactive websites and application interfaces." },
  { title: "Full Stack Developer", skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"], interests: ["Web Development", "Full Stack"], goals: ["Full Stack Developer", "Fullstack Developer"], summary: "Develop both the user interface and the services behind a web application." },
  { title: "Backend Developer", skills: ["JavaScript", "Node.js", "SQL", "REST APIs", "Git"], interests: ["Backend", "Web Development", "Databases"], goals: ["Backend Developer", "Back End Developer"], summary: "Build APIs, data storage, and application services." },
  { title: "Data Analyst", skills: ["SQL", "Python", "Excel", "Statistics", "Power BI"], interests: ["Data Analysis", "Data Analytics", "Data Science"], goals: ["Data Analyst"], summary: "Explore data and communicate findings through reports and dashboards." },
  { title: "Machine Learning Developer", skills: ["Python", "Statistics", "Linear Algebra", "Pandas", "Machine Learning"], interests: ["AI", "Artificial Intelligence", "Machine Learning", "Data Science"], goals: ["Machine Learning Engineer", "AI Engineer", "Machine Learning Developer"], summary: "Build and evaluate models that learn patterns from data." },
  { title: "Mobile App Developer", skills: ["Dart", "Flutter", "REST APIs", "Git"], interests: ["Mobile Development", "App Development", "Android"], goals: ["Mobile App Developer", "Flutter Developer", "Android Developer"], summary: "Create mobile applications and connect them to online services." },
];
const normalize = (value) => String(value ?? "").toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
const aliases = { js: "javascript", node: "node.js", nodejs: "node.js", reactjs: "react", "react.js": "react", mongo: "mongodb", "rest api": "rest apis", "powerbi": "power bi" };
export function listValues(value) {
  return (Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []).filter(item => typeof item === "string" && item.trim()).map(item => item.trim());
}
export function recommendCareers(user = {}) {
  const skills = new Set(listValues(user.skills).map(value => aliases[normalize(value)] || normalize(value)));
  const interests = new Set(listValues(user.careerInterests ?? user.interests).map(normalize));
  const goal = normalize(user.careerGoal);
  return roles.map(role => {
    const matched = role.skills.filter(skill => skills.has(normalize(skill)));
    const missing = role.skills.filter(skill => !skills.has(normalize(skill)));
    const interestMatches = role.interests.filter(interest => interests.has(normalize(interest)));
    const goalMatch = role.goals.some(title => (` ${goal} `).includes(` ${normalize(title)} `));
    return { ...role, matched, missing, interestMatches, goalMatch, score: matched.length / role.skills.length * 60 + (interestMatches.length ? 15 : 0) + (goalMatch ? 25 : 0) };
  }).filter(role => role.score > 0).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 3);
}

export function analyzeSkillGap(user, roleTitle) {
  const role = roles.find(item => item.title === roleTitle);
  if (!role) return null;
  const skills = new Set(listValues(user?.skills).map(value => aliases[normalize(value)] || normalize(value)));
  const matched = role.skills.filter(skill => skills.has(normalize(skill)));
  const missing = role.skills.filter(skill => !skills.has(normalize(skill)));
  return { role, matched, missing, coverage: Math.round(matched.length / role.skills.length * 100) };
}
