function analyzeResume(text, profileSkills = []) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const sections = [
    ['Education', /\b(education|academic background|qualifications)\b/i],
    ['Skills', /\b(skills|technologies|technical expertise)\b/i],
    ['Experience or projects', /\b(experience|employment|internships?|projects?)\b/i],
  ].map(([label, pattern]) => ({ label, found: pattern.test(text) }));
  const checks = [
    { label: 'Email address', found: /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text) },
    { label: 'Professional or portfolio link', found: /\b(linkedin\.com|github\.com|https?:\/\/|www\.)/i.test(text) },
    ...sections,
  ];
  const skills = [...new Set(profileSkills.map(skill => skill.trim()).filter(Boolean))];
  const matchedSkills = skills.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-z0-9])' + escaped + '(?=$|[^a-z0-9])', 'i').test(normalized);
  });
  const missingSkills = skills.filter(skill => !matchedSkills.includes(skill));
  const suggestions = checks.filter(check => !check.found).map(check => `Check that your resume includes a clearly readable ${check.label.toLowerCase()}.`);
  if (!/\b\d+(?:\.\d+)?\s*(%|users|customers|hours|projects|students|requests|seconds)\b/i.test(normalized)) suggestions.push('Where accurate, describe results with concrete numbers, such as users served or time saved.');
  if (missingSkills.length) suggestions.push('Consider describing projects that demonstrate your unmentioned profile skills. Include only skills you can support.');
  if (!suggestions.length) suggestions.push('The basic text checks passed. Review each project or experience entry for your contribution and its outcome.');
  return { wordCount: normalized.split(/\s+/).filter(Boolean).length, checks, matchedSkills, missingSkills, suggestions };
}
module.exports = { analyzeResume };
