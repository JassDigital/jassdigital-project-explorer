import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const repositories = [];

    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `https://api.github.com/users/JassDigital/repos?per_page=100&page=${page}&sort=updated`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const data = await response.json();

      repositories.push(...data);

      if (data.length < 100) break;
    }

    const projects = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "JASS Digital project.",
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language || "Other",
      topics: repo.topics || [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      archived: repo.archived,
      private: repo.private,
      updated: repo.updated_at,
      defaultBranch: repo.default_branch,
    }));

    return NextResponse.json({
      owner: "JassDigital",
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to load GitHub repositories",
      },
      { status: 500 }
    );
  }
}
