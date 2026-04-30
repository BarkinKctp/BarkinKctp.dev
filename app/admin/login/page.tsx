"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-slate-100">
            Admin Login
          </h1>

          <form action={formAction} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              required
              className="h-12 px-4 rounded-lg border border-black/60 dark:border-white/20 
              bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 
              focus:border-cyan-500 focus:outline-none transition-all"
            />

            {state?.error && (
              <p className="text-red-500 text-sm text-center">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="h-12 bg-gray-900 dark:bg-cyan-600 text-white rounded-lg 
              font-medium hover:bg-gray-800 dark:hover:bg-cyan-500 
              disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {pending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
