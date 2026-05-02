"use client";

import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

export default function ProjectsError({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-md">
        We couldn&apos;t load the projects right now. This might be a temporary
        issue - please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition font-medium"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="group flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-slate-800 text-white rounded-full hover:bg-gray-950 dark:hover:bg-slate-700 transition"
        >
          <BsArrowLeft className="opacity-70 group-hover:-translate-x-1 transition" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
