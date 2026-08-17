export const TONES = [
  "Professional",
  "Friendly",
  "Formal",
  "Concise",
  "Persuasive",
  "Apologetic",
  "Follow-up",
  "Thank-you",
] as const;

export const LENGTHS = ["Short", "Medium", "Long"] as const;

export const RESEARCH_MODES = [
  "Quick Answer",
  "Detailed Research",
  "Academic Research",
  "Business Research",
  "Market Research",
  "Literature Review",
] as const;

export const DEPTHS = ["Overview", "Balanced", "Deep dive"] as const;

export type EmailInput = {
  recipient: string;
  purpose: string;
  keyPoints: string;
  tone: string;
  length: string;
  instructions: string;
};

export type EmailResult = {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
};

export type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
  priority: "High" | "Medium" | "Low" | string;
};

export type MeetingResult = {
  title: string;
  summary: string;
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
  questions: string[];
};

export type ResearchResult = {
  overview: string;
  keyFindings: string[];
  analysis: { heading: string; content: string }[];
  statistics: { label: string; value: string; context: string }[];
  sources: { title: string; publisher: string; url: string; excerpt: string }[];
  followUpQuestions: string[];
  summary: string;
};

export type ResearchTurn = {
  question: string;
  answerSummary: string;
  result: ResearchResult;
};

export function emailToText(email: EmailResult) {
  return `Subject: ${email.subject}\n\n${email.greeting}\n\n${email.body}\n\n${email.closing}`;
}

export function meetingToText(m: MeetingResult) {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n") || "- None";
  return [
    `# ${m.title}`,
    `\n## Executive summary\n${m.executiveSummary}`,
    `\n## Summary\n${m.summary}`,
    `\n## Key discussion points\n${list(m.keyPoints)}`,
    `\n## Decisions made\n${list(m.decisions)}`,
    `\n## Action items\n${
      m.actionItems.map((a) => `- ${a.task} — ${a.owner} (due ${a.deadline}, ${a.priority})`).join("\n") || "- None"
    }`,
    `\n## Follow-up items\n${list(m.followUps)}`,
    `\n## Open questions\n${list(m.questions)}`,
  ].join("\n");
}

export function researchToText(r: ResearchResult, topic: string) {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n") || "- None";
  return [
    `# Research: ${topic}`,
    `\n## Overview\n${r.overview}`,
    `\n## Key findings\n${list(r.keyFindings)}`,
    `\n## Detailed analysis\n${r.analysis.map((a) => `### ${a.heading}\n${a.content}`).join("\n\n")}`,
    `\n## Key statistics\n${r.statistics.map((s) => `- ${s.label}: ${s.value} — ${s.context}`).join("\n") || "- None"}`,
    `\n## Sources\n${r.sources.map((s) => `- ${s.title} (${s.publisher}) ${s.url}`).join("\n") || "- None"}`,
    `\n## Further questions\n${list(r.followUpQuestions)}`,
    `\n## Summary\n${r.summary}`,
  ].join("\n");
}
