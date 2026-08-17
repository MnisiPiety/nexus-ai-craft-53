import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { WorkList } from "@/components/WorkList";
import { useItems } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — LumenAI Workspace" },
      { name: "description", content: "Your favourite emails, meeting summaries and research reports." },
      { property: "og:title", content: "Saved — LumenAI Workspace" },
      { property: "og:description", content: "Your favourite emails, meeting summaries and research reports." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const items = useItems().filter((i) => i.favorite);
  return (
    <AppShell>
      <PageHeader title="Saved" subtitle="Everything you starred, ready to reuse." />
      <WorkList
        items={items}
        emptyTitle="Nothing starred yet"
        emptyCopy="Star an item in History to keep it here for quick access."
      />
    </AppShell>
  );
}
