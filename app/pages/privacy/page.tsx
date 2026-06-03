import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last updated: June 3, 2026
      </p>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          What I Collect
        </h2>
        <p>
          This is my personal portfolio. I track basic, anonymous stats just to
          see how many people visit and who downloads my resume — nothing more.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Anonymous visitor counts</strong> — your IP is hashed
            (one-way, irreversible) so I can count unique visitors without
            knowing who you are.
          </li>
          <li>
            <strong>Resume download counts</strong> — I can see that
            &quot;Unique Visitor 1&quot; downloaded my CV, but I have no idea
            who that actually is.
          </li>
          <li>
            <strong>Pages visited</strong> — just to see which sections get
            traffic.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          What I Don&apos;t Collect
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>No cookies.</li>
          <li>No third-party analytics or trackers.</li>
          <li>
            No personal information — no names, emails, or browser fingerprints.
          </li>
          <li>No data is sold or shared with anyone.</li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Why
        </h2>
        <p>
          I am only checking if anyone&apos;s checking out my portfolio and
          downloading my resume. That&apos;s it. The data is stored securely and
          only I can see it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Contact
        </h2>
        <p>
          If you have any questions about this policy, feel free to reach out at{" "}
          <a
            href="mailto:barkinkocatepe12@gmail.com"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            barkinkocatepe12@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
