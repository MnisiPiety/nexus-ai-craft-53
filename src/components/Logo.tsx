import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="bg-gradient-hero grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 3.2 13.9 8l4.9 1.9-4.9 1.9L12 16.6l-1.9-4.8L5.2 9.9 10.1 8 12 3.2Z"
            fill="currentColor"
            className="text-primary-foreground"
          />
          <circle cx="18.4" cy="17.6" r="2.1" fill="currentColor" className="text-primary-foreground/80" />
          <circle cx="6.1" cy="17.1" r="1.4" fill="currentColor" className="text-primary-foreground/60" />
        </svg>
      </span>
      {showWord && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Lumen<span className="text-primary">AI</span>
        </span>
      )}
    </span>
  );
}
