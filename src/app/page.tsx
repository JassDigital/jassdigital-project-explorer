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
  Star,
  GitFork,
  X,
  CalendarDays,
  Code2,
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

  if (
    project.language === "TypeScript" ||
    project.language === "JavaScript"
  ) {
    return "Web Applications";
  }

  return "Other Projects";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function hasUsableHomepage(project: Project) {
  if (!project.homepage) return false;

  try {
    const url = new URL(project.homepage);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState("updated");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const activeProjects = useMemo(
    () => projects.filter((project) => !project.archived),
    [projects]
  );

  const featuredProjects = useMemo(
    () =>
      activeProjects
        .filter((project) => featured.has(project.name))
        .sort(
          (a, b) =>
            Number(featured.has(b.name)) - Number(featured.has(a.name))
        ),
    [activeProjects]
  );

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
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }

        if (sortBy === "stars") {
          return b.stars - a.stars;
        }

        return +new Date(b.updated) - +new Date(a.updated);
      });
  }, [projects, query, category, showArchived, sortBy]);

  const featuredCount = projects.filter((p) => featured.has(p.name)).length;
  const liveCount = projects.filter(hasUsableHomepage).length;
  const archivedCount = projects.filter((p) => p.archived).length;

  return (
    <main className="min-h-screen">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#09090b]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg">
              <Boxes size={21} />
            </div>

            <div>
              <div className="font-bold tracking-tight text-white">
                JASS DIGITAL
              </div>
              <div className="text-xs text-zinc-500">
                Project Explorer
              </div>
            </div>
          </div>

          <a
            href="https://GitBranch.com/JassDigital"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.04] hover:text-white sm:flex"
          >
            <GitBranch size={16} />
            GitBranch
            <ExternalLink size={15} />
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20">
          <div className="mb-5 flex items-center gap-2 text-sm text-zinc-400">
            <Globe size={16} />
            Independent software ecosystem
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Software, AI, Data &
                <span className="block text-zinc-500">
                  practical digital tools.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                Explore the JASS Digital ecosystem directly from GitBranch.
                Projects are discovered automatically and organized into
                useful categories.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 lg:block">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-600">
                <Sparkles size={13} />
                Live catalogue
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                GitBranch-powered
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [projects.length || "—", "Repositories"],
              [featuredCount || "—", "Featured"],
              [liveCount || "—", "Live Links"],
              [archivedCount || "—", "Archived"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
              >
                <div className="text-2xl font-bold text-white">
                  {value}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {!loading && featuredProjects.length > 0 && !query && category === "All" && (
        <section className="mx-auto max-w-7xl px-6 pt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">
                JASS Digital highlights
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Featured Projects
              </h2>
            </div>

            <span className="text-sm text-zinc-600">
              {featuredProjects.length} projects
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredProjects.slice(0, 6).map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group text-left"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/[0.025] blur-3xl transition group-hover:bg-blue-500/[0.07]" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                        <Sparkles size={21} className="text-zinc-300" />
                      </div>

                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                        Featured
                      </span>
                    </div>

                    <div className="mt-7">
                      <div className="text-xs uppercase tracking-wider text-zinc-600">
                        {getCategory(project)}
                      </div>

                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        {project.name}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      {project.language && (
                        <span className="rounded-full bg-white/[0.05] px-3 py-1">
                          {project.language}
                        </span>
                      )}

                      <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1">
                        <Star size={12} />
                        {formatNumber(project.stars)}
                      </span>

                      <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1">
                        <GitFork size={12} />
                        {formatNumber(project.forks)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* EXPLORER CONTROLS */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, technologies, topics..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/25 focus:bg-white/[0.055]"
          />
        </div>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  category === item
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 outline-none"
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Name</option>
              <option value="stars">Stars</option>
            </select>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                showArchived
                  ? "bg-white text-black"
                  : "border border-white/10 text-zinc-500 hover:text-white"
              }`}
            >
              <Archive size={14} />
              Archived
            </button>
          </div>
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">
              GitBranch ecosystem
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
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 py-20 text-center">
            <Search className="mx-auto text-zinc-700" size={28} />
            <p className="mt-4 text-zinc-400">
              No projects match your search.
            </p>
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

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="mt-6 text-left"
                  >
                    <div className="text-xs uppercase tracking-wider text-zinc-600">
                      {getCategory(project)}
                    </div>

                    <h3 className="mt-2 break-words text-xl font-semibold text-white transition group-hover:text-zinc-200">
                      {project.name}
                    </h3>

                    <p className="mt-3 min-h-20 line-clamp-3 text-sm leading-6 text-zinc-400">
                      {project.description || "No description provided."}
                    </p>
                  </button>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.language && (
                      <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">
                        {project.language}
                      </span>
                    )}

                    <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">
                      <Star size={11} />
                      {formatNumber(project.stars)}
                    </span>

                    {project.forks > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">
                        <GitFork size={11} />
                        {formatNumber(project.forks)}
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

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-600">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {formatDate(project.updated)}
                    </span>

                    {project.archived && (
                      <span className="text-amber-500/70">
                        Archived
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                      GitBranch
                      <ArrowUpRight size={15} />
                    </a>

                    {hasUsableHomepage(project) && (
                      <a
                        href={project.homepage!}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
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

      {/* DETAIL MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111113] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Code2 size={24} className="text-zinc-300" />
            </div>

            <div className="mt-6 pr-10">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                {getCategory(selectedProject)}
              </div>

              <h2 className="mt-2 break-words text-3xl font-bold text-white">
                {selectedProject.name}
              </h2>

              <p className="mt-4 text-base leading-7 text-zinc-400">
                {selectedProject.description || "No description provided."}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <Star size={15} className="text-zinc-500" />
                <div className="mt-2 font-semibold text-white">
                  {formatNumber(selectedProject.stars)}
                </div>
                <div className="text-xs text-zinc-600">Stars</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <GitFork size={15} className="text-zinc-500" />
                <div className="mt-2 font-semibold text-white">
                  {formatNumber(selectedProject.forks)}
                </div>
                <div className="text-xs text-zinc-600">Forks</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <Code2 size={15} className="text-zinc-500" />
                <div className="mt-2 truncate font-semibold text-white">
                  {selectedProject.language || "—"}
                </div>
                <div className="text-xs text-zinc-600">Language</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <CalendarDays size={15} className="text-zinc-500" />
                <div className="mt-2 font-semibold text-white">
                  {formatDate(selectedProject.updated)}
                </div>
                <div className="text-xs text-zinc-600">Updated</div>
              </div>
            </div>

            {selectedProject.topics.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Topics
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <a
                href={selectedProject.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Open GitBranch
                <ArrowUpRight size={16} />
              </a>

              {hasUsableHomepage(selectedProject) && (
                <a
                  href={selectedProject.homepage!}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
                >
                  <Globe size={16} />
                  Open Live Project
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 JASS Digital</div>
          <div>GitBranch-powered project catalogue</div>
        </div>
      </footer>
    </main>
  );
}


