# LumenAI — AI Productivity Suite

A modern, responsive, all-in-one AI productivity web application built with **TanStack Start**, **React**, **TypeScript**, and **Tailwind CSS**. LumenAI combines three powerful AI tools into a single, unified workspace: a smart email generator, a meeting notes summarizer, and an AI research assistant.

![LumenAI](https://nexus-ai-craft-53.lovable.app/opengraph-image.png)

## Live Demo

- **Production**: https://nexus-ai-craft-53.lovable.app
- **Preview**: https://id-preview--4aae99c4-9a90-4fc8-8ba1-7eb9c25c775f.lovable.app

## Features

### Smart Email Generator
- Generate professional emails from a few simple inputs (recipient, purpose, tone, length).
- Choose from multiple tones: Professional, Friendly, Formal, Concise, Persuasive, Apologetic, Follow-up, and Thank-you.
- Refine existing drafts with natural-language instructions.
- Copy or export the final email with one click.

### Meeting Notes Summarizer
- Paste raw meeting notes or transcripts and get a structured summary.
- Extracts key discussion points, decisions made, action items (with owner, deadline, and priority), follow-ups, and open questions.
- Supports refinement and re-summarization.
- Hand off a summary into a follow-up email in one click.

### AI Research Assistant
- Enter any topic and choose a research mode and depth.
- Modes include Quick Answer, Detailed Research, Academic Research, Business Research, Market Research, and Literature Review.
- Receives an overview, key findings, detailed analysis, statistics, cited sources, follow-up questions, and a final summary.
- Conversational follow-ups keep the context of prior turns.

### Workspace & Productivity
- **Dashboard** with recent activity and quick-start cards.
- **History** page with search, filtering, and one-click reuse.
- **Saved / Favorites** for pinning important outputs.
- **Tool-to-tool handoff** (e.g., turn a meeting summary into an email, or research findings into a meeting brief).
- Light and dark mode support.
- Local-browser persistence for history, favorites, and theme preference.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start/) — full-stack React with SSR/SSG and server functions.
- **Router**: TanStack Router (file-based routing).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS v4 with custom design tokens.
- **UI Components**: shadcn/ui-style components.
- **AI**: Lovable AI Gateway (`google/gemini-3-flash-preview`).
- **State / Persistence**: `localStorage` (no backend required for core functionality).
- **Build Tool**: Vite 7.

## Project Structure

```
src/
├── components/        # Shared UI components (AppShell, Logo, WorkList, ai-ui)
├── lib/               # AI service, server functions, types, and local store
├── routes/            # TanStack Start routes
│   ├── __root.tsx     # App shell, fonts, and toaster
│   ├── index.tsx      # Landing page
│   ├── dashboard.tsx  # Workspace overview
│   ├── email.tsx      # Email generator
│   ├── meetings.tsx   # Meeting summarizer
│   ├── research.tsx   # Research assistant
│   ├── history.tsx    # Activity history
│   ├── saved.tsx      # Starred items
│   └── settings.tsx   # Preferences
├── router.tsx         # TanStack Router setup
├── server.ts          # Server entry
├── start.ts           # Client entry
└── styles.css         # Global styles and design tokens
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```sh
# Clone the repository
git clone <this-repository-url>
cd <repository-name>

# Install dependencies
npm install
# or
bun install
```

### Development

```sh
npm run dev
# or
bun dev
```

The dev server starts at `http://localhost:8080`.

### Build

```sh
npm run build
# or
bun run build
```

## Configuration

The AI features use the Lovable AI Gateway. In local development, make sure the `LOVABLE_API_KEY` environment variable is available. In Lovable Cloud / Lovable hosting, this is handled automatically.

No database is required for the core app; history and favorites are stored in the browser’s `localStorage`.

## Deployment

This project is built for edge/serverless deployment. You can publish it directly from the Lovable editor, or deploy the built output to any host that supports the TanStack Start / Vite output.

## Syncing with GitHub

Lovable has built-in two-way GitHub sync:

1. Open the Lovable editor.
2. Click the **Plus (+)** menu in the chat input → **GitHub** → **Connect project**.
3. Authorize the Lovable GitHub App and select the account/organization.
4. Create a repository. Changes made in Lovable will push to GitHub automatically, and changes pushed to GitHub will sync back into Lovable.

For more details, see the [Lovable GitHub integration docs](https://docs.lovable.dev/integrations/github).

## Roadmap Ideas

- Cloud persistence for history and cross-device sync.
- User accounts and authentication.
- Custom email templates and brand voices.
- Export to PDF, DOCX, and Markdown.
- Team collaboration and shared workspaces.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Lovable](https://lovable.dev).
