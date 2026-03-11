"use client";

import { useFormStatus } from "react-dom";
import { FaPaperPlane } from "react-icons/fa";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-2 bg-gray-900 dark:bg-cyan-800 text-white px-15 py-4 text-base flex items-center
        justify-center gap-2 rounded-full outline-none shadow-md
        focus:scale-105 hover:scale-105 hover:bg-gray-950 dark:hover:bg-cyan-700 hover:shadow-lg
        active:scale-110 transition disabled:scale-100 disabled:bg-opacity-65
        disabled:cursor-not-allowed self-center"
    >
      {pending ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          Submit{" "}
          <FaPaperPlane className="text-xs opacity-70 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
        </>
      )}
    </button>
  );
}
