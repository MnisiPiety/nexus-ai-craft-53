import { Copy, Check, Sparkles, Download } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {label}
    </Button>
  );
}

export function ExportButton({ text, filename }: { text: string; filename: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg"
      onClick={() => {
        const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Download className="h-4 w-4" /> Export
    </Button>
  );
}

export function Section({
  title,
  icon,
  children,
  className,
  action,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift sm:p-6",
        className,
      )}
    >
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase">
          {icon}
          <span className="truncate">{title}</span>
        </h3>
        {action}
      </div>
      <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export function BulletList({ items }: { items?: string[] }) {
  if (!items?.length) return <p className="text-muted-foreground">Nothing identified.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function GeneratingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <div className="bg-gradient-hero grid h-12 w-12 animate-pulse place-items-center rounded-2xl">
        <Sparkles className="h-6 w-6 text-primary-foreground" />
      </div>
      <p className="mt-4 text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
        {icon ?? <Sparkles className="h-6 w-6" />}
      </div>
      <p className="mt-4 text-base font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
