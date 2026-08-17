import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  NotebookPen,
  Sparkles,
  Save,
  RefreshCw,
  Minimize2,
  Maximize2,
  Upload,
  Mail,
  Search,
  ListChecks,
  Gavel,
  HelpCircle,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { BulletList, CopyButton, EmptyState, ExportButton, GeneratingState, Section } from "@/components/ai-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeetingFn } from "@/lib/ai.functions";
import { meetingToText, type MeetingResult } from "@/lib/ai-types";
import { newId, saveItem, setHandoff, takeHandoff } from "@/lib/store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — LumenAI" },
      { name: "description", content: "Turn meeting notes and transcripts into decisions, action items and follow-ups." },
      { property: "og:title", content: "Meeting Notes Summarizer — LumenAI" },
      {
        property: "og:description",
        content: "Turn meeting notes and transcripts into decisions, action items and follow-ups.",
      },
    ],
  }),
  component: MeetingsPage,
});

const PRIORITY_CLASS: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/15 text-warning-foreground",
  Low: "bg-success/15 text-success-foreground",
};

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const summarize = useServerFn(summarizeMeetingFn);

  useEffect(() => {
    const handoff = takeHandoff("meeting");
    if (handoff) {
      setNotes(handoff.notes);
      if (handoff.title) setTitle(handoff.title);
      toast.info("Research context imported");
    }
  }, []);

  async function run(refine?: string) {
    if (notes.trim().length < 30) {
      toast.error("Paste a bit more of your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const res = await summarize({ data: { notes, title, ...(refine ? { refine } : {}) } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResult(res.result);
      toast.success("Meeting analysed");
    } catch {
      toast.error("Could not reach the AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Paste notes or a transcript — get decisions, owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="mtitle">Meeting title (optional)</Label>
            <Input id="mtitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly product sync" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes or transcript</Label>
            <Textarea
              id="notes"
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes, transcript or bullet points here…"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,text/plain"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setNotes(await file.text());
              if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
              toast.success("File loaded");
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload text file
            </Button>
            <Button className="flex-1 rounded-xl" disabled={loading} onClick={() => run()}>
              <Sparkles className="h-4 w-4" /> {loading ? "Analysing…" : "Summarize meeting"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <GeneratingState label="Reading your meeting…" />
          ) : !result ? (
            <EmptyState
              title="Your meeting breakdown appears here"
              description="Summary, decisions, action items, follow-ups and open questions — all structured."
              icon={<NotebookPen className="h-6 w-6" />}
            />
          ) : (
            <>
              <Section
                title="Executive summary"
                icon={<Flag className="h-4 w-4 text-primary" />}
                action={<CopyButton text={result.executiveSummary} />}
              >
                <Textarea
                  rows={3}
                  value={result.executiveSummary}
                  onChange={(e) => setResult({ ...result, executiveSummary: e.target.value })}
                />
              </Section>

              <Section title="Meeting summary" action={<CopyButton text={result.summary} />}>
                <Textarea
                  rows={5}
                  value={result.summary}
                  onChange={(e) => setResult({ ...result, summary: e.target.value })}
                />
              </Section>

              <div className="grid gap-4 sm:grid-cols-2">
                <Section title="Key discussion points">
                  <BulletList items={result.keyPoints} />
                </Section>
                <Section title="Decisions made" icon={<Gavel className="h-4 w-4 text-primary" />}>
                  <BulletList items={result.decisions} />
                </Section>
              </div>

              <Section title="Action items" icon={<ListChecks className="h-4 w-4 text-primary" />}>
                {result.actionItems?.length ? (
                  <ul className="space-y-3">
                    {result.actionItems.map((a, i) => (
                      <li key={i} className="rounded-xl border border-border p-3.5">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <p className="min-w-0 font-medium">{a.task}</p>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              PRIORITY_CLASS[a.priority] ?? "bg-muted text-muted-foreground"
                            }`}
                          >
                            {a.priority}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {a.owner} · due {a.deadline}
                        </p>
                        <button
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          onClick={() => {
                            setHandoff({ kind: "research", topic: a.task });
                            navigate({ to: "/research" });
                          }}
                        >
                          <Search className="h-3.5 w-3.5" /> Research this topic
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No action items identified.</p>
                )}
              </Section>

              <div className="grid gap-4 sm:grid-cols-2">
                <Section title="Follow-up items">
                  <BulletList items={result.followUps} />
                </Section>
                <Section title="Open questions" icon={<HelpCircle className="h-4 w-4 text-primary" />}>
                  <BulletList items={result.questions} />
                </Section>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => run()}>
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => run("Make it shorter.")}>
                  <Minimize2 className="h-4 w-4" /> Shorter
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => run("Make it more detailed.")}>
                  <Maximize2 className="h-4 w-4" /> More detail
                </Button>
                <CopyButton text={meetingToText(result)} label="Copy all" />
                <ExportButton text={meetingToText(result)} filename={`${result.title || "meeting"}.md`} />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setHandoff({
                      kind: "email",
                      input: {
                        purpose: `Follow-up email after the meeting "${result.title}"`,
                        keyPoints: meetingToText(result),
                        tone: "Follow-up",
                      },
                    });
                    navigate({ to: "/email" });
                  }}
                >
                  <Mail className="h-4 w-4" /> Follow-up email
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    saveItem({
                      id: newId(),
                      type: "meeting",
                      title: result.title || title || "Untitled meeting",
                      notes,
                      result,
                    });
                    toast.success("Saved to your workspace");
                  }}
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
