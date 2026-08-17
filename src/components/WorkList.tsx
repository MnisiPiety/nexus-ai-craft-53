import { useState } from "react";
import { Star, Trash2, Copy, Pencil, FileText } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "./ai-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteItem,
  newId,
  renameItem,
  saveItem,
  toggleFavorite,
  type ItemType,
  type WorkItem,
} from "@/lib/store";
import { emailToText, meetingToText, researchToText } from "@/lib/ai-types";
import { cn } from "@/lib/utils";

const FILTERS: { key: ItemType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "email", label: "Emails" },
  { key: "meeting", label: "Meetings" },
  { key: "research", label: "Research" },
];

export function itemToText(item: WorkItem) {
  if (item.type === "email") return emailToText(item.result);
  if (item.type === "meeting") return meetingToText(item.result);
  return researchToText(item.result, item.topic);
}

export function WorkList({ items, emptyTitle, emptyCopy }: { items: WorkItem[]; emptyTitle: string; emptyCopy: string }) {
  const [filter, setFilter] = useState<ItemType | "all">("all");
  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<WorkItem | null>(null);
  const [pendingName, setPendingName] = useState("");
  const [deleting, setDeleting] = useState<WorkItem | null>(null);

  const visible = items.filter(
    (i) => (filter === "all" || i.type === filter) && i.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                filter === f.key
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyCopy} icon={<FileText className="h-6 w-6" />} />
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                    {item.type}
                  </span>
                  <p className="mt-1.5 truncate font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(item.createdAt).toLocaleDateString()} · updated{" "}
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(item.id)} aria-label="Favorite">
                  <Star className={cn("h-4 w-4", item.favorite && "fill-warning text-warning")} />
                </Button>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-primary">Open</summary>
                <pre className="mt-2 max-h-72 overflow-auto rounded-xl bg-muted/50 p-3 text-xs whitespace-pre-wrap">
                  {itemToText(item)}
                </pre>
              </details>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={async () => {
                    await navigator.clipboard.writeText(itemToText(item));
                    toast.success("Copied");
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setRenaming(item);
                    setPendingName(item.title);
                  }}
                >
                  <Pencil className="h-4 w-4" /> Rename
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    saveItem({ ...item, id: newId(), title: `${item.title} (copy)` });
                    toast.success("Duplicated");
                  }}
                >
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setDeleting(item)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename item</DialogTitle>
            <DialogDescription>Give this saved work a clearer name.</DialogDescription>
          </DialogHeader>
          <Input value={pendingName} onChange={(e) => setPendingName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (renaming) renameItem(renaming.id, pendingName.trim() || renaming.title);
                setRenaming(null);
                toast.success("Renamed");
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) deleteItem(deleting.id);
                setDeleting(null);
                toast.success("Deleted");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
