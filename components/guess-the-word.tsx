"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ENGLISH_ANSWERS,
  VALID_ENGLISH_GUESSES,
  getDailyWord,
} from "@/lib/guess-the-word-words";

type Language = "en" | "tr";
type LetterStatus = "correct" | "present" | "absent" | "empty" | "tbd";
type LeaderboardTab = "today" | "all";

interface HintData {
  type: "eliminate" | "yellow" | "green";
  letter: string;
  position?: number;
}

interface GameState {
  answer: string;
  guesses: string[];
  statuses: LetterStatus[][];
  gameOver: boolean;
  won: boolean;
  hintsUsed: number;
  revealedHints: HintData[];
  submitted: boolean;
  date: string;
}

interface LeaderboardEntry {
  name: string;
  guesses: number;
  hintsUsed: number;
  date?: string;
}

const MAX_HINTS = 3;

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const STORAGE_KEY = "guess-the-word-game-state";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Only restore if it's from today
    if (parsed.date !== getTodayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveGameState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function evaluateGuess(guess: string, answer: string): LetterStatus[] {
  const result: LetterStatus[] = Array(WORD_LENGTH).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!used[j] && guessArr[i] === answerArr[j]) {
        result[i] = "present";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

const KEYBOARD_ROWS_EN = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const KEYBOARD_ROWS_TR = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"],
];

function statusColor(status: LetterStatus): string {
  switch (status) {
    case "correct":
      return "bg-green-500 border-green-500 text-white";
    case "present":
      return "bg-yellow-500 border-yellow-500 text-white";
    case "absent":
      return "bg-gray-500 dark:bg-gray-600 border-gray-500 dark:border-gray-600 text-white";
    default:
      return "bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100";
  }
}

function keyStatusColor(status: LetterStatus | undefined): string {
  switch (status) {
    case "correct":
      return "bg-green-500 text-white border-green-500";
    case "present":
      return "bg-yellow-500 text-white border-yellow-500";
    case "absent":
      return "bg-gray-400 dark:bg-gray-700 text-white border-gray-400 dark:border-gray-700";
    default:
      return "bg-gray-200 dark:bg-gray-500 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500";
  }
}

export default function GuessTheWord() {
  const [language, setLanguage] = useState<Language>("en");
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<LetterStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState<HintData[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [boardTab, setBoardTab] = useState<LeaderboardTab>("today");
  const initialized = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage on mount (once)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const saved = loadGameState();
    if (saved) {
      setAnswer(saved.answer);
      setGuesses(saved.guesses);
      setStatuses(saved.statuses);
      setGameOver(saved.gameOver);
      setWon(saved.won);
      setHintsUsed(saved.hintsUsed ?? 0);
      // Migrate old string[] format to HintData[]
      const rawHints = saved.revealedHints ?? [];
      const migratedHints: HintData[] = rawHints.map((h: HintData | string) =>
        typeof h === "string" ? { type: "yellow" as const, letter: h } : h,
      );
      setRevealedHints(migratedHints);
      setSubmitted(saved.submitted ?? false);
    } else {
      setAnswer(getDailyWord());
    }
    setHydrated(true);
  }, []);

  // Persist state on every change (after hydration)
  useEffect(() => {
    if (!hydrated || !answer) return;
    saveGameState({
      answer,
      guesses,
      statuses,
      gameOver,
      won,
      hintsUsed,
      revealedHints,
      submitted,
      date: getTodayKey(),
    });
  }, [
    hydrated,
    answer,
    guesses,
    statuses,
    gameOver,
    won,
    hintsUsed,
    revealedHints,
    submitted,
  ]);

  const fetchLeaderboard = useCallback(
    async (scope: LeaderboardTab = "today") => {
      setLoadingBoard(true);
      try {
        const res = await fetch(
          `/api/guess-the-word/leaderboard?scope=${scope}`,
        );
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch {
        // silently fail
      } finally {
        setLoadingBoard(false);
      }
    },
    [],
  );

  const keyboardRows = language === "en" ? KEYBOARD_ROWS_EN : KEYBOARD_ROWS_TR;

  // Build keyboard status map
  const keyStatuses = new Map<string, LetterStatus>();
  guesses.forEach((guess, gi) => {
    guess.split("").forEach((letter, li) => {
      const s = statuses[gi]?.[li];
      if (!s) return;
      const current = keyStatuses.get(letter);
      if (s === "correct") keyStatuses.set(letter, "correct");
      else if (s === "present" && current !== "correct")
        keyStatuses.set(letter, "present");
      else if (s === "absent" && !current) keyStatuses.set(letter, "absent");
    });
  });

  // Mark hint-revealed letters on keyboard (hints override guess-derived statuses)
  revealedHints.forEach((hint) => {
    const current = keyStatuses.get(hint.letter);
    if (hint.type === "eliminate") {
      if (!current || current === "empty" || current === "tbd") {
        keyStatuses.set(hint.letter, "absent");
      }
    } else if (hint.type === "yellow") {
      if (current !== "correct") {
        keyStatuses.set(hint.letter, "present");
      }
    } else if (hint.type === "green") {
      keyStatuses.set(hint.letter, "correct");
    }
  });

  const showMessage = useCallback((msg: string, duration = 1500) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  }, []);

  const submitName = useCallback(async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed.length > 20 || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/guess-the-word/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          guesses: guesses.length,
          hintsUsed,
        }),
      });
      setSubmitted(true);
      setNameInput("");
      showMessage("Added to leaderboard!", 2000);
    } catch {
      showMessage("Failed to submit", 2000);
    } finally {
      setSubmitting(false);
    }
  }, [nameInput, submitting, guesses.length, hintsUsed, showMessage]);

  // Focus name input when it appears
  useEffect(() => {
    if (won && !submitted && nameInputRef.current) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [won, submitted]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver || language === "tr") return;

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          setShake(true);
          showMessage("Not enough letters");
          setTimeout(() => setShake(false), 500);
          return;
        }

        // Validate guess against dictionary
        if (!VALID_ENGLISH_GUESSES.has(currentGuess)) {
          setShake(true);
          showMessage("Not in word list");
          setTimeout(() => setShake(false), 500);
          return;
        }

        const evaluation = evaluateGuess(currentGuess, answer);
        const newGuesses = [...guesses, currentGuess];
        const newStatuses = [...statuses, evaluation];
        setGuesses(newGuesses);
        setStatuses(newStatuses);
        setCurrentGuess("");

        if (currentGuess === answer) {
          setWon(true);
          setGameOver(true);
          showMessage("Brilliant! 🎉", 3000);
        } else if (newGuesses.length >= MAX_GUESSES) {
          setGameOver(true);
          showMessage(answer, 5000);
        }
        return;
      }

      if (key === "⌫" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (currentGuess.length < WORD_LENGTH && key.length === 1) {
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    },
    [currentGuess, gameOver, guesses, statuses, answer, language, showMessage],
  );

  // Physical keyboard input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === "ENTER") handleKey("ENTER");
      else if (key === "BACKSPACE") handleKey("⌫");
      else if (/^[A-Z]$/.test(key)) handleKey(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // Build grid rows (for English mode)
  const greenHints = revealedHints.filter(
    (h): h is HintData & { position: number } =>
      h.type === "green" && h.position !== undefined,
  );
  const greenHintMap = new Map<number, string>();
  greenHints.forEach((h) => greenHintMap.set(h.position, h.letter));

  const rows = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      rows.push(
        <div key={i} className="flex gap-1.5 justify-center">
          {guesses[i].split("").map((letter, j) => (
            <motion.div
              key={j}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: [0, 90, 0] }}
              transition={{ delay: j * 0.15, duration: 0.4 }}
              className={`w-[3.2rem] h-[3.2rem] sm:w-[3.6rem] sm:h-[3.6rem] flex items-center justify-center 
                text-xl sm:text-2xl font-bold border-2 rounded-md ${statusColor(
                  statuses[i][j],
                )}`}
            >
              {letter}
            </motion.div>
          ))}
        </div>,
      );
    } else if (i === guesses.length) {
      rows.push(
        <motion.div
          key={i}
          className="flex gap-1.5 justify-center"
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {Array.from({ length: WORD_LENGTH }).map((_, j) => {
            const letter = currentGuess[j] || "";
            const hintLetter = !letter ? greenHintMap.get(j) : undefined;
            return (
              <motion.div
                key={j}
                animate={letter ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.1 }}
                className={`w-[3.2rem] h-[3.2rem] sm:w-[3.6rem] sm:h-[3.6rem] flex items-center justify-center 
                  text-xl sm:text-2xl font-bold border-2 rounded-md ${
                    letter
                      ? "border-gray-500 dark:border-gray-400 text-gray-900 dark:text-gray-100"
                      : hintLetter
                        ? "bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400"
                        : "border-gray-300 dark:border-gray-600"
                  }`}
              >
                {letter || hintLetter || ""}
              </motion.div>
            );
          })}
        </motion.div>,
      );
    } else {
      rows.push(
        <div key={i} className="flex gap-1.5 justify-center">
          {Array.from({ length: WORD_LENGTH }).map((_, j) => {
            const hintLetter = greenHintMap.get(j);
            return (
              <div
                key={j}
                className={`w-[3.2rem] h-[3.2rem] sm:w-[3.6rem] sm:h-[3.6rem] flex items-center justify-center 
                  text-xl sm:text-2xl font-bold border-2 rounded-md ${
                    hintLetter
                      ? "bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
              >
                {hintLetter || ""}
              </div>
            );
          })}
        </div>,
      );
    }
  }

  // Don't render until hydrated to prevent flash
  if (!hydrated) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold tracking-wider text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.05, color: "#06b6d4" }}
        >
          GUESS THE WORD
        </motion.h1>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={() => {
              setShowLeaderboard((prev) => !prev);
              if (!showLeaderboard) fetchLeaderboard(boardTab);
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="text-xl mr-1 transition"
            title="Leaderboard"
          >
            🏆
          </motion.button>
          <motion.button
            onClick={() => setLanguage("en")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-sm font-semibold rounded-l-md border transition ${
              language === "en"
                ? "bg-gray-900 dark:bg-cyan-600 text-white border-gray-900 dark:border-cyan-600"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            EN
          </motion.button>
          <motion.button
            onClick={() => setLanguage("tr")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-sm font-semibold rounded-r-md border transition ${
              language === "tr"
                ? "bg-gray-900 dark:bg-cyan-600 text-white border-gray-900 dark:border-cyan-600"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            TR
          </motion.button>
        </motion.div>
      </div>

      {/* Hint button */}
      {language === "en" && !gameOver && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => {
              if (hintsUsed >= MAX_HINTS || gameOver) return;

              const hintNumber = revealedHints.length + 1; // use actual array length, not counter

              // Gather letters already known
              const guessedCorrect = new Map<number, string>(); // position → letter
              const guessedPresent = new Set<string>();
              guesses.forEach((g, gi) => {
                g.split("").forEach((l, li) => {
                  if (statuses[gi]?.[li] === "correct")
                    guessedCorrect.set(li, l);
                  if (statuses[gi]?.[li] === "present") guessedPresent.add(l);
                });
              });

              const eliminatedLetters = new Set(
                revealedHints
                  .filter((h) => h.type === "eliminate")
                  .map((h) => h.letter),
              );
              const revealedYellow = new Set(
                revealedHints
                  .filter((h) => h.type === "yellow")
                  .map((h) => h.letter),
              );
              const revealedGreen = new Set(
                revealedHints
                  .filter((h) => h.type === "green")
                  .map((h) => h.letter),
              );

              if (hintNumber === 1) {
                // Eliminate a letter NOT in the answer
                const answerLetters = new Set(answer.split(""));
                const allUsed = new Set<string>();
                guesses.forEach((g) =>
                  g.split("").forEach((l) => allUsed.add(l)),
                );
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                const candidates = alphabet.filter(
                  (l) =>
                    !answerLetters.has(l) &&
                    !eliminatedLetters.has(l) &&
                    keyStatuses.get(l) !== "absent",
                );
                if (candidates.length === 0) {
                  showMessage("No letters to eliminate");
                  return;
                }
                const pick =
                  candidates[Math.floor(Math.random() * candidates.length)];
                setRevealedHints((prev) => [
                  ...prev,
                  { type: "eliminate", letter: pick },
                ]);
                setHintsUsed((prev) => prev + 1);
                showMessage(`"${pick}" is not in the word`, 2500);
              } else if (hintNumber === 2) {
                // Reveal a yellow letter (in the answer, not yet guessed correct)
                const known = new Set([
                  ...Array.from(guessedCorrect.values()),
                  ...revealedYellow,
                  ...revealedGreen,
                ]);
                const candidates = answer
                  .split("")
                  .filter((l) => !known.has(l));
                if (candidates.length === 0) {
                  showMessage("No more letters to reveal");
                  return;
                }
                const pick =
                  candidates[Math.floor(Math.random() * candidates.length)];
                setRevealedHints((prev) => [
                  ...prev,
                  { type: "yellow", letter: pick },
                ]);
                setHintsUsed((prev) => prev + 1);
                showMessage(`The word contains "${pick}"`, 2500);
              } else if (hintNumber === 3) {
                // Reveal a green letter with its position
                const unrevealedPositions: { letter: string; pos: number }[] =
                  [];
                answer.split("").forEach((l, i) => {
                  if (guessedCorrect.get(i) !== l) {
                    unrevealedPositions.push({ letter: l, pos: i });
                  }
                });
                if (unrevealedPositions.length === 0) {
                  showMessage(
                    `All positions are known! The word is "${answer}"`,
                    3000,
                  );
                  setHintsUsed((prev) => prev + 1);
                  return;
                }
                const pick =
                  unrevealedPositions[
                    Math.floor(Math.random() * unrevealedPositions.length)
                  ];
                setRevealedHints((prev) => [
                  ...prev,
                  {
                    type: "green",
                    letter: pick.letter,
                    position: pick.pos,
                  },
                ]);
                setHintsUsed((prev) => prev + 1);
                showMessage(
                  `"${pick.letter}" is at position ${pick.pos + 1}`,
                  3000,
                );
              }
            }}
            disabled={hintsUsed >= MAX_HINTS}
            whileHover={hintsUsed < MAX_HINTS ? { scale: 1.08 } : {}}
            whileTap={hintsUsed < MAX_HINTS ? { scale: 0.95 } : {}}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full border transition ${
              hintsUsed >= MAX_HINTS
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                : "bg-yellow-400 dark:bg-yellow-500 text-gray-900 border-yellow-500 dark:border-yellow-600 hover:bg-yellow-300 dark:hover:bg-yellow-400"
            }`}
          >
            {hintsUsed >= MAX_HINTS
              ? "💡 All hints used"
              : `💡 Hint ${hintsUsed + 1}/${MAX_HINTS} — ${
                  hintsUsed === 0
                    ? "Eliminate a letter"
                    : hintsUsed === 1
                      ? "Reveal a letter"
                      : "Reveal a position"
                }`}
          </motion.button>
        </motion.div>
      )}

      {/* Message toast */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md font-bold text-sm"
        >
          {message}
        </motion.div>
      )}

      {/* Turkish coming soon overlay */}
      {language === "tr" ? (
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blurred placeholder grid */}
          <div className="blur-sm pointer-events-none opacity-40">
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: MAX_GUESSES }).map((_, i) => (
                <div key={i} className="flex gap-1.5 justify-center">
                  {Array.from({ length: WORD_LENGTH }).map((_, j) => (
                    <div
                      key={j}
                      className="w-[3.2rem] h-[3.2rem] sm:w-[3.6rem] sm:h-[3.6rem] flex items-center justify-center 
                        text-xl sm:text-2xl font-bold border-2 rounded-md border-gray-300 dark:border-gray-600"
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 mt-4">
              {KEYBOARD_ROWS_TR.map((row, ri) => (
                <div key={ri} className="flex gap-1 justify-center">
                  {row.map((key) => (
                    <div
                      key={key}
                      className="w-8 h-10 rounded-md bg-gray-200 dark:bg-gray-500 border border-gray-300 dark:border-gray-500"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Coming soon overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
          >
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border-2 border-gray-200 dark:border-gray-600 text-center">
              <motion.div
                className="text-4xl mb-3"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🚧
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Work In Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The Turkish version is coming soon !
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <>
          {/* Grid */}
          <motion.div
            className="flex flex-col gap-1.5 cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            onClick={() => {
              if (!gameOver && mobileInputRef.current) {
                mobileInputRef.current.focus();
              }
            }}
          >
            {rows}
          </motion.div>

          {/* Hidden input for mobile native keyboard */}
          <input
            ref={mobileInputRef}
            type="text"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="sr-only"
            inputMode="text"
            value=""
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              if (val && /^[A-Z]$/.test(val)) {
                handleKey(val);
              }
              e.target.value = "";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleKey("ENTER");
              } else if (e.key === "Backspace") {
                e.preventDefault();
                handleKey("⌫");
              }
            }}
          />

          {/* Keyboard — hidden on mobile (use native keyboard via grid tap) */}
          <motion.div
            className="hidden sm:flex flex-col gap-1.5 mt-2 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {keyboardRows.map((row, ri) => (
              <div key={ri} className="flex gap-1 justify-center">
                {row.map((key) => {
                  const isWide = key === "ENTER" || key === "⌫";
                  return (
                    <motion.button
                      key={key}
                      onClick={() => handleKey(key)}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className={`${
                        isWide
                          ? "px-2 sm:px-4 text-xs"
                          : "w-[2rem] sm:w-[2.5rem] text-sm"
                      } h-[2.8rem] sm:h-[3.2rem] rounded-md font-bold border transition-colors
                      ${keyStatusColor(keyStatuses.get(key))}`}
                    >
                      {key}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </motion.div>

          {/* Game over stats */}
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-2 w-full"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {won
                  ? `Solved in ${guesses.length}/${MAX_GUESSES}`
                  : `The word was ${answer}`}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                Come back tomorrow for a new word!
              </p>

              {/* Name prompt (only on win, if not yet submitted/skipped) */}
              {won && !submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2 mt-1"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add your name to the leaderboard?
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      maxLength={20}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitName();
                        e.stopPropagation();
                      }}
                      placeholder="Your name"
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 w-36"
                    />
                    <motion.button
                      onClick={submitName}
                      disabled={submitting || !nameInput.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 text-sm font-semibold rounded-md bg-green-500 text-white
                        hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      {submitting ? "..." : "Submit"}
                    </motion.button>
                    <motion.button
                      onClick={() => setSubmitted(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 text-sm font-semibold rounded-md border border-gray-300 dark:border-gray-600
                        text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Skip
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* Leaderboard panel */}
      {showLeaderboard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full mt-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700
            rounded-lg p-4 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              🏆 Leaderboard
            </h3>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none transition"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-3 bg-gray-200 dark:bg-slate-700 rounded-md p-0.5">
            {(["today", "all"] as LeaderboardTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setBoardTab(tab);
                  fetchLeaderboard(tab);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${
                  boardTab === tab
                    ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab === "today" ? "Today" : "All Time"}
              </button>
            ))}
          </div>

          {loadingBoard ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-3">
              Loading...
            </p>
          ) : leaderboard.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-3">
              {boardTab === "today"
                ? "No entries yet today. Be the first!"
                : "No entries yet. Start playing!"}
            </p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md
                    hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-right font-bold text-gray-400 dark:text-gray-500 text-xs">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{entry.guesses}/6</span>
                    {entry.hintsUsed > 0 && (
                      <span className="text-yellow-500">
                        💡{entry.hintsUsed}
                      </span>
                    )}
                    {boardTab === "all" && entry.date && (
                      <span className="text-gray-400 dark:text-gray-500">
                        {entry.date}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
