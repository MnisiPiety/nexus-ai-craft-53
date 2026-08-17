import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Search, Sparkles, Save, Mail, NotebookPen, BarChart3, BookOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { BulletList, CopyButton, EmptyState, ExportButton, GeneratingState, Section } from "@/components/ai-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { researchFn } from "@/lib/ai.functions";
import { DEPTHS, RESEARCH_MODES, researchToText, type ResearchTurn } from "@/lib/ai-types";
import { newId, saveItem, setHandoff, takeHandoff } from "@/lib/store";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — LumenAI" },
      { name: "description", content: "Research any topic with structured findings, statistics and sources." },
      { property: "og:title", content: "AI Research Assistant — LumenAI" },
      { property: "og:description", content: "Research any topic with structured findings, statistics and sources." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<string>("Detailed Research");
  const [depth, setDepth] = useState<string>("Balanced");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("Structured report");
  const [thread, setThread] = useState<ResearchTurn[]>([]);
  const [followUp, setFollowUp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const research = useServerFn(researchFn);

  useEffect(() => {
    const handoff = takeHandoff("research");
    if (handoff) {
      setTopic(handoff.topic);
      toast.info("Topic imported from your meeting");
    }
  }, []);

  const latest = thread[thread.length - 1];

  async function run(question: string) {
    if (!question.trim()) {
      toast.error("Enter what you would like to research.");
      return;
    }
    setLoading(true);
    try {
      const res = await research({ data: { topic: question, mode, depth, audience, format, thread } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setThread((t) => [...t, { question, answerSummary: res.result.summary, result: res.result }]);
      setFollowUp("");
      toast.success("Research ready");
    } catch {
      toast.error("Could not reach the AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="AI Research Assistant" subtitle="Ask anything and keep the thread going with follow-ups." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="topic">What would you like to research?</Label>
            <Textarea
              id="topic"
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How is AI changing customer support in African SMEs?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Research mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_MODES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="audience">Target audience</Label>
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Executives, students…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Preferred format</Label>
              <Input id="format" value={format} onChange={(e) => setFormat(e.target.value)} />
            </div>
          </div>
          <Button className="w-full rounded-xl" disabled={loading} onClick={() => run(topic)}>
            <Sparkles className="h-4 w-4" /> {loading ? "Researching…" : "Start research"}
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <GeneratingState label="Gathering findings…" />}
          {!loading && !latest && (
            <EmptyState
              title="Research results appear here"
              description="Overview, key findings, analysis, statistics and sources — organised for you."
              icon={<Search className="h-6 w-6" />}
            />
          )}

          {latest && !loading && (
            <>
              {thread.length > 1 && (
                <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                  Thread: {thread.map((t) => t.question).join(" → ")}
                </div>
              )}

              <Section title="Overview" action={<CopyButton text={latest.result.overview} />}>
                <p>{latest.result.overview}</p>
              </Section>

              <Section title="Key findings">
                <BulletList items={latest.result.keyFindings} />
              </Section>

              {latest.result.statistics?.length > 0 && (
                <Section title="Key statistics" icon={<BarChart3 className="h-4 w-4 text-primary" />}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {latest.result.statistics.map((s, i) => (
                      <div key={i} className="rounded-xl border border-border bg-gradient-surface p-4">
                        <p className="text-2xl font-bold text-primary">{s.value}</p>
                        <p className="mt-1 text-sm font-medium">{s.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{s.context}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Detailed analysis">
                <div className="space-y-4">
                  {latest.result.analysis?.map((a, i) => (
                    <div key={i}>
                      <h4 className="font-semibold">{a.heading}</h4>
                      <p className="mt-1 text-sm text-foreground/85">{a.content}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {latest.result.sources?.length > 0 && (
                <Section title="Sources" icon={<BookOpen className="h-4 w-4 text-primary" />}>
                  <ul className="space-y-3">
                    {latest.result.sources.map((s, i) => (
                      <li key={i} className="rounded-xl border border-border p-3.5">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-medium text-primary hover:underline"
                        >
                          {s.title}
                        </a>
                        <p className="text-xs text-muted-foreground">{s.publisher}</p>
                        {s.excerpt && <p className="mt-1.5 text-sm text-foreground/80">“{s.excerpt}”</p>}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Questions worth exploring">
                <div className="flex flex-wrap gap-2">
                  {latest.result.followUpQuestions?.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => run(q)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
                    >
                      {q} <ArrowRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Summary" action={<CopyButton text={latest.result.summary} />}>
                <p>{latest.result.summary}</p>
              </Section>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <Label htmlFor="followup" className="text-xs uppercase">
                  Ask a follow-up
                </Label>
                <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <Input
                    id="followup"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && run(followUp)}
                    placeholder="Dig deeper into anything above…"
                  />
                  <Button className="rounded-xl" onClick={() => run(followUp)}>
                    Ask
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <CopyButton text={researchToText(latest.result, latest.question)} label="Copy report" />
                <ExportButton
                  text={researchToText(latest.result, latest.question)}
                  filename={`research-${latest.question.slice(0, 30)}.md`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setHandoff({
                      kind: "email",
                      input: {
                        purpose: `Share research findings on "${latest.question}"`,
                        keyPoints: researchToText(latest.result, latest.question),
                        tone: "Professional",
                      },
                    });
                    navigate({ to: "/email" });
                  }}
                >
                  <Mail className="h-4 w-4" /> Email from research
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setHandoff({
                      kind: "meeting",
                      title: `Briefing: ${latest.question}`,
                      notes: researchToText(latest.result, latest.question),
                    });
                    navigate({ to: "/meetings" });
                  }}
                >
                  <NotebookPen className="h-4 w-4" /> Meeting briefing
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    saveItem({
                      id: newId(),
                      type: "research",
                      title: latest.question,
                      topic: latest.question,
                      result: latest.result,
                    });
                    toast.success("Research saved");
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
