"use client";

import { useActionState, useState, Suspense } from "react";
import { loginAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-xl p-10 shadow-xl">
          {/* Lock icon */}
          <motion.div
            className="flex justify-center mb-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center border border-black/15 dark:border-white/10 cursor-default"
              whileHover={{
                scale: 1.1,
                boxShadow:
                  "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HiLockClosed className="text-3xl text-gray-700 dark:text-slate-200" />
            </motion.div>
          </motion.div>

          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-slate-100 hover:text-black dark:hover:text-white transition-colors cursor-default">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6 hover:text-gray-800 dark:hover:text-slate-200 transition-colors cursor-default">
            Enter the password to continue
          </p>

          {expired && (
            <motion.div
              className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
                Session expired due to inactivity. Please log in again.
              </p>
            </motion.div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter admin password"
                required
                autoFocus
                className="w-full h-12 px-4 pr-12 rounded-lg border border-black/60 dark:border-white/20 
                bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {state?.error && (
              <motion.p
                className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-lg p-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {state.error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={pending}
              className="h-13 bg-white dark:bg-slate-100 text-gray-900 rounded-full 
              font-medium text-base shadow-md border-2 border-black/40
              hover:shadow-lg hover:bg-gray-50 dark:hover:bg-white
              disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {pending ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/"
              className="group bg-gray-900 dark:bg-slate-800 text-white px-6 py-2.5 flex items-center gap-2 
              rounded-full border border-black/60 dark:border-white/15
              hover:scale-105 focus:scale-105 active:scale-110 transition text-sm"
            >
              <BsArrowLeft className="opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Back to Home
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
