import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, Search, ArrowRight, History, Clock, Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EmptyState } from "@/components/ai-ui";
import { Button } from "@/components/ui/button";
import { useItems } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LumenAI Workspace" },
      { name: "description", content: "Your AI workspace for emails, meeting summaries and research." },
      { property: "og:title", content: "Dashboard — LumenAI Workspace" },
      { property: "og:description", content: "Your AI workspace for emails, meeting summaries and research." },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email",
    copy: "Write professional emails in seconds.",
    cta: "Create Email",
  },
  {
    to: "/meetings" as const,
    icon: NotebookPen,
    title: "Meeting Summarizer",
    copy: "Turn lengthy meeting notes into clear action items.",
    cta: "Summarize Meeting",
  },
  {
    to: "/research" as const,
    icon: Search,
    title: "Research Assistant",
    copy: "Research topics and organize insights with AI.",
    cta: "Start Research",
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const TYPE_LABEL = { email: "Email", meeting: "Meeting", research: "Research" } as const;

function Dashboard() {
  const items = useItems();
  const recent = items.slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        title={`${greeting()}, Piety`}
        subtitle="What would you like to accomplish today?"
        action={
          <Button asChild className="rounded-xl">
            <Link to="/email">
              <Plus className="h-4 w-4" /> New AI Task
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, copy, cta }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="bg-gradient-hero grid h-11 w-11 place-items-center rounded-xl">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
          {recent.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              description="Your emails, meeting summaries and research will appear here once you create them."
              icon={<Clock className="h-6 w-6" />}
            />
          ) : (
            <ul className="space-y-3">
              {recent.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                      {TYPE_LABEL[item.type]}
                    </span>
                    <p className="mt-1.5 truncate font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(item.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0 rounded-lg">
                    <Link to="/history">Open</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
          <div className="flex flex-col gap-2.5">
            <Button asChild variant="outline" className="justify-start rounded-xl">
              <Link to="/email">
                <Mail className="h-4 w-4" /> New Email
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start rounded-xl">
              <Link to="/meetings">
                <NotebookPen className="h-4 w-4" /> Summarize Notes
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start rounded-xl">
              <Link to="/research">
                <Search className="h-4 w-4" /> Start Research
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start rounded-xl">
              <Link to="/history">
                <History className="h-4 w-4" /> View History
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
