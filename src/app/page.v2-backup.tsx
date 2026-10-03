"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowUpRight,
  Boxes,
  ExternalLink,
  FolderGit2,
  GitBranch,
  Globe,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  archived: boolean;
  updated: string;
};

const featured = new Set([
  "Project-Athena",
  "JASS-DBF-Explorer",
  "JASS-File-Organizer-Pro",
  "JASS-ImageMorph-Studio",
  "Haryana-Partition-Manager",
  "JASS_Khewat_Share_Calculator",
  "JASS-Digital-Lab",
  "Haryana-Revenue-Toolkit",
]);

const categoryRules: Record<string, string[]> = {
  "AI & Knowledge": [
    "ai",
    "athena",
    "knowledge",
    "llm",
    "rag",
    "model",
    "chatbot",
    "hugging",
  ],
  "Land Records": [
    "land",
    "khewat",
    "jamabandi",
    "haryana",
    "revenue",
    "partition",
    "ownership",
  ],
  "Language & Literature": [
    "punjabi",
    "gurbani",
    "mizo",
    "urdu",
    "literature",
    "language",
    "shahmukhi",
    "gurmukhi",
  ],
  "Media & Imaging": [
    "image",
    "photo",
    "video",
    "media",
    "collage",
    "subtitle",
    "morph",
    "editor",
  ],
  "Legacy Systems": ["dbf", "foxpro", "legacy", "landsoft"],
};

function getCategory(project: Project) {
  const text =
    `${project.name} ${project.description} ${project.topics.join(" ")}`
      .toLowerCase();

  for (const [category, keywords] of Object.entries(categoryRules)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  if (project.language === "Python") return "Python & Tools";
  if (project.language === "TypeScript" || project.language === "JavaScript")
    return "Web Applications";

  return "Other Projects";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const values = new Set(projects.map(getCategory));
    return ["All", ...Array.from(values).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return projects
      .filter((project) => showArchived || !project.archived)
      .filter((project) => {
        const matchesCategory =
          category === "All" || getCategory(project) === category;

        const searchable =
          `${project.name} ${project.description} ${project.language} ${project.topics.join(" ")}`
            .toLowerCase();

        return matchesCategory && (!q || searchable.includes(q));
      })
      .sort((a, b) => {
        const af = featured.has(a.name) ? 1 : 0;
        const bf = featured.has(b.name) ? 1 : 0;
        return bf - af || +new Date(b.updated) - +new Date(a.updated);
      });
  }, [projects, query, category, showArchived]);

  const featuredCount = projects.filter((p) => featured.has(p.name)).length;
  const liveCount = projects.filter((p) => p.homepage).length;
  const archivedCount = projects.filter((p) => p.archived).length;

  return (
    <main className="min-h-screen">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              <Boxes size={21} />
            </div>
            <div>
              <div className="font-bold tracking-tight">JASS DIGITAL</div>
              <div className="text-xs text-zinc-500">
                Project Explorer
              </div>
            </div>
          </div>

          <a
            href="https://github.com/JassDigital"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/25 hover:text-white sm:flex"
          >
            <GitBranch size={16} />
            GitHub
            <ExternalLink size={15} />
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20">
          <div className="mb-5 flex items-center gap-2 text-sm text-zinc-400">
            <Globe size={16} />
            Independent software ecosystem
          </div>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Software, AI, Data &
            <span className="block text-zinc-400">
              practical digital tools.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Explore the JASS Digital ecosystem directly from GitHub.
            Projects are discovered automatically and organized into useful
            categories.
          </p>

          <div className="mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [projects.length || "—", "Repositories"],
              [featuredCount || "—", "Featured"],
              [liveCount || "—", "Live Links"],
              [archivedCount || "—", "Archived"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="mt-1 text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all JassDigital projects..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-5 text-white outline-none placeholder:text-zinc-600 focus:border-white/25"
          />
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                category === item
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`ml-auto flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              showArchived
                ? "bg-white text-black"
                : "border border-white/10 text-zinc-500"
            }`}
          >
            <Archive size={14} />
            Archived
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">
              GitHub ecosystem
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {category === "All" ? "All Projects" : category}
            </h2>
          </div>

          <div className="text-sm text-zinc-500">
            {filtered.length} shown
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-white/10 py-20 text-zinc-500">
            <Loader2 className="mr-3 animate-spin" size={20} />
            Loading JassDigital repositories...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => {
              const isFeatured = featured.has(project.name);

              return (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <FolderGit2 size={21} className="text-zinc-300" />
                    </div>

                    {isFeatured && (
                      <span className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                        <Sparkles size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wider text-zinc-600">
                      {getCategory(project)}
                    </div>

                    <h3 className="mt-2 break-words text-xl font-semibold text-white">
                      {project.name}
                    </h3>

                    <p className="mt-3 min-h-20 text-sm leading-6 text-zinc-400">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.language && (
                      <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">
                        {project.language}
                      </span>
                    )}

                    {project.topics.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-600">
                    Updated {formatDate(project.updated)}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                      GitHub
                      <ArrowUpRight size={15} />
                    </a>

                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/25 hover:text-white"
                      >
                        <Globe size={15} />
                        Live
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 JASS Digital</div>
          <div>GitHub-powered project catalogue</div>
        </div>
      </footer>
    </main>
  );
}

