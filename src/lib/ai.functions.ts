import { createServerFn } from "@tanstack/react-start";
import { chatJson, AiError } from "./ai.server";
import type { EmailInput, EmailResult, MeetingResult, ResearchResult, ResearchTurn } from "./ai-types";

function toMessage(error: unknown) {
  if (error instanceof AiError) return error.message;
  return "Something went wrong while generating. Please try again.";
}

export const generateEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: EmailInput & { refine?: string | undefined; previous?: EmailResult | undefined }) => input)
  .handler(async ({ data }) => {
    try {
      const result = await chatJson<EmailResult>([
        {
          role: "system",
          content:
            "You are an expert business writing assistant. Always reply with JSON: " +
            '{"subject": string, "greeting": string, "body": string, "closing": string}. ' +
            "The body must contain only the main paragraphs (no greeting or sign-off), with blank lines between paragraphs.",
        },
        {
          role: "user",
          content: [
            `Recipient / context: ${data.recipient || "unspecified"}`,
            `Purpose: ${data.purpose}`,
            `Key points: ${data.keyPoints || "none provided"}`,
            `Tone: ${data.tone}`,
            `Length: ${data.length}`,
            `Extra instructions: ${data.instructions || "none"}`,
            data.previous
              ? `Existing draft to revise:\nSubject: ${data.previous.subject}\n${data.previous.greeting}\n${data.previous.body}\n${data.previous.closing}`
              : "",
            data.refine ? `Revision request: ${data.refine}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ]);
      return { ok: true as const, result };
    } catch (error) {
      return { ok: false as const, error: toMessage(error) };
    }
  });

export const summarizeMeetingFn = createServerFn({ method: "POST" })
  .inputValidator((input: { notes: string; title?: string; refine?: string }) => input)
  .handler(async ({ data }) => {
    try {
      const result = await chatJson<MeetingResult>([
        {
          role: "system",
          content:
            "You analyse meeting notes and transcripts. Always reply with JSON: " +
            '{"title": string, "summary": string, "executiveSummary": string, "keyPoints": string[], ' +
            '"decisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string, "priority": "High"|"Medium"|"Low"}], ' +
            '"followUps": string[], "questions": string[]}. ' +
            'Use "Unassigned" or "Not specified" when information is missing. Never invent people who are not mentioned.',
        },
        {
          role: "user",
          content: [
            data.title ? `Meeting title: ${data.title}` : "",
            data.refine ? `Adjustment: ${data.refine}` : "",
            "Notes:",
            data.notes,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ]);
      return { ok: true as const, result };
    } catch (error) {
      return { ok: false as const, error: toMessage(error) };
    }
  });

export const researchFn = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      topic: string;
      mode: string;
      depth: string;
      audience?: string;
      format?: string;
      thread?: ResearchTurn[];
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      const history = (data.thread ?? [])
        .map((turn) => `Q: ${turn.question}\nA: ${turn.answerSummary}`)
        .join("\n\n");
      const result = await chatJson<ResearchResult>([
        {
          role: "system",
          content:
            "You are a rigorous research assistant. Always reply with JSON: " +
            '{"overview": string, "keyFindings": string[], "analysis": [{"heading": string, "content": string}], ' +
            '"statistics": [{"label": string, "value": string, "context": string}], ' +
            '"sources": [{"title": string, "publisher": string, "url": string, "excerpt": string}], ' +
            '"followUpQuestions": string[], "summary": string}. ' +
            "Only include sources you are confident exist; mark uncertain figures in their context field.",
        },
        {
          role: "user",
          content: [
            history ? `Conversation so far:\n${history}` : "",
            `Research request: ${data.topic}`,
            `Mode: ${data.mode}`,
            `Depth: ${data.depth}`,
            `Audience: ${data.audience || "general professional"}`,
            `Preferred format: ${data.format || "structured report"}`,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ]);
      return { ok: true as const, result };
    } catch (error) {
      return { ok: false as const, error: toMessage(error) };
    }
  });
