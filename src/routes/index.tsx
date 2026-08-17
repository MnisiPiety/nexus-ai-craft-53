import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, Search, Layers, ShieldCheck, ArrowRight, Sparkles, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumenAI — One AI Workspace, Three Powerful Tools" },
      {
        name: "description",
        content:
          "Write smarter emails, turn meetings into action, and research anything — all from one intelligent AI workspace.",
      },
      { property: "og:title", content: "LumenAI — One AI Workspace, Three Powerful Tools" },
      {
        property: "og:description",
        content: "Write smarter emails, turn meetings into action, and research anything from one workspace.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Mail, title: "Smart Email Generation", copy: "Purpose, tone and key points in — a polished email out." },
  { icon: NotebookPen, title: "Meeting Intelligence", copy: "Decisions, owners, deadlines and open questions, extracted." },
  { icon: Search, title: "AI Research", copy: "Structured findings, statistics and sources with follow-up threads." },
  { icon: Layers, title: "Unified Workspace", copy: "Move a meeting into an email or a topic into research in one click." },
  { icon: ShieldCheck, title: "Secure & Private", copy: "Your work stays yours — export or clear it whenever you want." },
];

const PLANS = [
  {
    name: "Free",
    price: "R0",
    perks: ["Limited AI generations", "Basic email generation", "Basic meeting summaries", "Limited research"],
  },
  {
    name: "Pro",
    price: "R249",
    featured: true,
    perks: ["Higher AI limits", "Advanced research modes", "Unlimited saved history", "Advanced email tools", "Exports"],
  },
  {
    name: "Business",
    price: "R699",
    perks: ["Team collaboration", "Shared workspaces", "Admin controls", "Usage analytics", "Priority AI processing"],
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6">
          <Logo />
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" className="hidden rounded-xl sm:inline-flex">
              <a href="#features">Features</a>
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="bg-gradient-hero absolute inset-x-0 top-0 h-[380px] opacity-[0.09]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI productivity, without the tab-switching
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.08] font-bold sm:text-6xl">
            One AI Workspace. Three Powerful Tools.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Write smarter emails, turn meetings into action, and research anything — all from one intelligent
            workspace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/dashboard">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <a href="#features">Explore Features</a>
            </Button>
          </div>

          <div className="mx-auto mt-14 max-w-4xl rounded-3xl border border-border bg-card p-3 shadow-lift">
            <div className="rounded-2xl bg-gradient-surface p-5 text-left sm:p-8">
              <p className="text-sm text-muted-foreground">Good morning, Piety</p>
              <p className="text-lg font-semibold">What would you like to accomplish today?</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Mail, t: "Smart Email" },
                  { icon: NotebookPen, t: "Meeting Summarizer" },
                  { icon: Search, t: "Research Assistant" },
                ].map(({ icon: Icon, t }) => (
                  <div key={t} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                    <span className="bg-gradient-hero grid h-9 w-9 place-items-center rounded-lg">
                      <Icon className="h-4.5 w-4.5 text-primary-foreground" />
                    </span>
                    <p className="mt-3 text-sm font-medium">{t}</p>
                    <div className="mt-3 h-1.5 w-2/3 rounded-full bg-muted" />
                    <div className="mt-2 h-1.5 w-1/2 rounded-full bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Everything in one place</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Three tools that share the same design, history and account — so your work flows between them.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Simple pricing</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Start free. Upgrade when your team needs more AI power.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-soft ${
                plan.featured ? "border-primary bg-card shadow-lift" : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <span className="mb-3 inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant={plan.featured ? "default" : "outline"} className="mt-6 w-full rounded-xl">
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} LumenAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
