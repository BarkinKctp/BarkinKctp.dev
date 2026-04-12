"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsGithub } from "react-icons/bs";

interface Repo {
  name: string;
  url: string;
  description: string | null;
  updatedAt: string;
  language: string | null;
}

interface LanguageStats {
  [key: string]: number;
}

export default function GitHubStats({ limit = 15 }: { limit?: number }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<LanguageStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const username = "BarkinKctp";
        const excludeRepos = ["barkinkctp", "barkinkocatepe.dev", "microsoft-certificate-notes"];
        const excludeLanguages = ["jupyter notebook", "css", "typescript", "html", "makefile", "c#"];
        
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!reposResponse.ok) throw new Error("Failed to fetch repositories");

        const reposData = await reposResponse.json();

        const formattedRepos = reposData
          .filter((repo: any) => !excludeRepos.includes(repo.name.toLowerCase()))
          .slice(0, 3)
          .map((repo: any) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            updatedAt: new Date(repo.updated_at).toLocaleDateString(),
            language: repo.language,
          }));

        setRepos(formattedRepos);

        const languageCount: LanguageStats = {};
        
        // Update This When I Add More Repos !!
        const filteredRepos = reposData
          .filter((repo: any) => !excludeRepos.includes(repo.name.toLowerCase()))
          .slice(0, 5);

        for (const repo of filteredRepos) {
          try {
            const langResponse = await fetch(repo.languages_url, {
              headers: { Accept: "application/vnd.github.v3+json" },
            });
            if (langResponse.ok) {
              const langs = await langResponse.json();
              Object.keys(langs).forEach((lang) => {
                const lowerLang = lang.toLowerCase();
                if (!excludeLanguages.includes(lowerLang)) {
                  languageCount[lang] = (languageCount[lang] || 0) + 1;
                }
              });
            }
          } catch (e) {
          }
        }

        const sortedLanguages = Object.entries(languageCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .reduce((obj, [lang, count]) => {
            obj[lang] = count;
            return obj;
          }, {} as LanguageStats);

        setLanguages(sortedLanguages);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading)
    return (
      <motion.div
        className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-6 sm:p-8 max-w-[75rem] w-full mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center text-gray-400 py-8">Loading GitHub stats...</div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-6 sm:p-8 max-w-[75rem] w-full mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center text-red-400 py-8">Failed To Load Github Data</div>
      </motion.div>
    );

  return (
    <motion.div
      className="space-y-6 mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-6 sm:p-8 max-w-[75rem] w-full">
        <div className="flex items-center gap-2 mb-5">
          <BsGithub className="text-lg" />
          <h3 className="text-lg font-semibold text-white">Recent Repositories</h3>
        </div>
        <div className="space-y-3">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 sm:p-4 rounded-lg bg-slate-800 dark:bg-slate-800/50 hover:bg-slate-700 dark:hover:bg-slate-700/50 transition-colors border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white hover:text-cyan-400 transition truncate">
                    {repo.name}
                  </h4>
                  {repo.description && (
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-400">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {repo.language}
                      </span>
                    )}
                    <span className="whitespace-nowrap">Updated: {repo.updatedAt}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>


      <div className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-6 sm:p-8 max-w-[75rem] w-full">
        <h3 className="text-lg font-semibold text-white mb-5">Most Used Languages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(languages).map(([lang, count], index) => (
            <motion.div
              key={lang}
              className="p-3 sm:p-4 rounded-lg bg-slate-800 dark:bg-slate-800/50 text-center border border-white/10 hover:border-white/20 transition"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="font-semibold text-cyan-400 text-sm">{lang}</div>
              <div className="text-xs text-gray-400 mt-1">{count} {count === 1 ? 'repo' : 'repos'}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
