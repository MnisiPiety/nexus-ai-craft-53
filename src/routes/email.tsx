import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Mail, Sparkles, Save, RefreshCw, Minimize2, Maximize2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CopyButton, EmptyState, GeneratingState, Section } from "@/components/ai-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmailFn } from "@/lib/ai.functions";
import { LENGTHS, TONES, emailToText, type EmailInput, type EmailResult } from "@/lib/ai-types";
import { newId, saveItem, takeHandoff } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — LumenAI" },
      { name: "description", content: "Draft professional emails in seconds with tone and length control." },
      { property: "og:title", content: "Smart Email Generator — LumenAI" },
      { property: "og:description", content: "Draft professional emails in seconds with tone and length control." },
    ],
  }),
  component: EmailPage,
});

const TEMPLATES = [
  { name: "Job application", purpose: "Apply for an advertised role", tone: "Professional" },
  { name: "Follow-up", purpose: "Follow up on a previous message", tone: "Follow-up" },
  { name: "Meeting request", purpose: "Request a meeting", tone: "Professional" },
  { name: "Customer support", purpose: "Respond to a customer issue", tone: "Apologetic" },
  { name: "Business proposal", purpose: "Pitch a business proposal", tone: "Persuasive" },
  { name: "Thank-you", purpose: "Thank someone", tone: "Thank-you" },
  { name: "Leave request", purpose: "Request time off", tone: "Formal" },
  { name: "Appointment request", purpose: "Book an appointment", tone: "Concise" },
  { name: "Sales outreach", purpose: "Introduce a product to a prospect", tone: "Persuasive" },
];

const EMPTY: EmailInput = {
  recipient: "",
  purpose: "",
  keyPoints: "",
  tone: "Professional",
  length: "Medium",
  instructions: "",
};

function EmailPage() {
  const [form, setForm] = useState<EmailInput>(EMPTY);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const generate = useServerFn(generateEmailFn);

  useEffect(() => {
    const handoff = takeHandoff("email");
    if (handoff) {
      setForm((f) => ({ ...f, ...handoff.input }));
      toast.info("Context imported from your other workspace");
    }
  }, []);

  const set = <K extends keyof EmailInput>(key: K, value: EmailInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function run(refine?: string) {
    if (!form.purpose.trim()) {
      toast.error("Tell the AI what the email is about first.");
      return;
    }
    setLoading(true);
    try {
      const res = await generate({ data: { ...form, refine, previous: result ?? undefined } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResult(res.result);
      toast.success(refine ? "Email updated" : "Email generated");
    } catch {
      toast.error("Could not reach the AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="Smart Email Generator" subtitle="Describe the email — the AI writes it for you." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient / context</Label>
            <Input
              id="recipient"
              placeholder="e.g. Hiring manager at Acme"
              value={form.recipient}
              onChange={(e) => set("recipient", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of email</Label>
            <Input
              id="purpose"
              placeholder="e.g. Follow up after the interview"
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyPoints">Key points</Label>
            <Textarea
              id="keyPoints"
              rows={4}
              placeholder="One point per line"
              value={form.keyPoints}
              onChange={(e) => set("keyPoints", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={form.tone} onValueChange={(v) => set("tone", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={form.length} onValueChange={(v) => set("length", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Optional instructions</Label>
            <Textarea
              id="instructions"
              rows={2}
              placeholder="e.g. Mention I'm available from Monday"
              value={form.instructions}
              onChange={(e) => set("instructions", e.target.value)}
            />
          </div>
          <Button className="w-full rounded-xl" disabled={loading} onClick={() => run()}>
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Templates</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setForm((f) => ({ ...f, purpose: t.purpose, tone: t.tone }))}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <GeneratingState label="Writing your email…" />
          ) : !result ? (
            <EmptyState
              title="Your email will appear here"
              description="Fill in the purpose and a few key points, then hit Generate."
              icon={<Mail className="h-6 w-6" />}
            />
          ) : (
            <>
              <Section
                title="Subject line"
                action={<CopyButton text={result.subject} label="Copy" />}
              >
                <Input value={result.subject} onChange={(e) => setResult({ ...result, subject: e.target.value })} />
              </Section>

              <Section title="Email" action={<CopyButton text={emailToText(result)} label="Copy all" />}>
                <div className="space-y-3">
                  <Input
                    value={result.greeting}
                    onChange={(e) => setResult({ ...result, greeting: e.target.value })}
                  />
                  <Textarea
                    rows={12}
                    value={result.body}
                    onChange={(e) => setResult({ ...result, body: e.target.value })}
                  />
                  <Textarea
                    rows={3}
                    value={result.closing}
                    onChange={(e) => setResult({ ...result, closing: e.target.value })}
                  />
                </div>
              </Section>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => run()}>
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => run("Make it shorter.")}>
                  <Minimize2 className="h-4 w-4" /> Shorter
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => run("Make it longer and more detailed.")}>
                  <Maximize2 className="h-4 w-4" /> Longer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => run("Improve clarity, flow and impact.")}
                >
                  <Wand2 className="h-4 w-4" /> Improve
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    saveItem({
                      id: newId(),
                      type: "email",
                      title: result.subject || form.purpose || "Untitled email",
                      input: form,
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
