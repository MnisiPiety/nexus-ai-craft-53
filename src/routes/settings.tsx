import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Section } from "@/components/ai-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPTHS, LENGTHS, TONES } from "@/lib/ai-types";
import { useTheme } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LumenAI Workspace" },
      { name: "description", content: "Manage your profile, AI defaults, appearance and privacy." },
      { property: "og:title", content: "Settings — LumenAI Workspace" },
      { property: "og:description", content: "Manage your profile, AI defaults, appearance and privacy." },
    ],
  }),
  component: SettingsPage,
});

type Prefs = {
  name: string;
  email: string;
  tone: string;
  depth: string;
  length: string;
  style: string;
  notifications: boolean;
  autosave: boolean;
};

const DEFAULTS: Prefs = {
  name: "Piety Mendy Mnisi",
  email: "you@example.com",
  tone: "Professional",
  depth: "Balanced",
  length: "Medium",
  style: "Clear and direct",
  notifications: true,
  autosave: true,
};

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const raw = window.localStorage.getItem("aisuite:prefs");
    if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
  }, []);

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => setPrefs((p) => ({ ...p, [key]: value }));

  function save() {
    window.localStorage.setItem("aisuite:prefs", JSON.stringify(prefs));
    toast.success("Settings saved");
  }

  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Tune your workspace and AI defaults." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Account">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={prefs.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={prefs.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="AI preferences">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default email tone</Label>
              <Select value={prefs.tone} onValueChange={(v) => set("tone", v)}>
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
              <Label>Default research depth</Label>
              <Select value={prefs.depth} onValueChange={(v) => set("depth", v)}>
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
            <div className="space-y-2">
              <Label>Response length</Label>
              <Select value={prefs.length} onValueChange={(v) => set("length", v)}>
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
            <div className="space-y-2">
              <Label htmlFor="style">Writing style</Label>
              <Input id="style" value={prefs.style} onChange={(e) => set("style", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="Appearance">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>
        </Section>

        <Section title="Notifications & privacy">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">Product notifications</p>
                <p className="text-xs text-muted-foreground">Updates about your AI tasks.</p>
              </div>
              <Switch checked={prefs.notifications} onCheckedChange={(v) => set("notifications", v)} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">Autosave generations</p>
                <p className="text-xs text-muted-foreground">Keep a local copy of everything you generate.</p>
              </div>
              <Switch checked={prefs.autosave} onCheckedChange={(v) => set("autosave", v)} />
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                window.localStorage.removeItem("aisuite:items");
                window.location.reload();
              }}
            >
              Clear all saved AI content
            </Button>
          </div>
        </Section>
      </div>

      <Button className="mt-6 rounded-xl" onClick={save}>
        Save settings
      </Button>
    </AppShell>
  );
}
