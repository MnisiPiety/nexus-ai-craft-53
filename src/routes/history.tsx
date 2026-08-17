import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { WorkList } from "@/components/WorkList";
import { useItems } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — LumenAI Workspace" },
      { name: "description", content: "Every email, meeting summary and research project you have created." },
      { property: "og:title", content: "History — LumenAI Workspace" },
      { property: "og:description", content: "Every email, meeting summary and research project you have created." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const items = useItems();
  return (
    <AppShell>
      <PageHeader title="History" subtitle="All of your AI activity in one place." />
      <WorkList
        items={items}
        emptyTitle="No history yet"
        emptyCopy="Generate an email, summarize a meeting or run research and it will show up here."
      />
    </AppShell>
  );
}
