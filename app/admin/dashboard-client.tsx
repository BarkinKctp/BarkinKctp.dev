"use client";

import {
  useActionState,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import Image from "next/image";
import { logoutAction, destroySessionAction } from "@/actions/auth";
import {
  addProject,
  updateProject,
  deleteProject,
  type Project,
} from "@/actions/projects";
import {
  addExperience,
  updateExperience,
  deleteExperience,
  type Experience,
} from "@/actions/experiences";
import {
  addSkill,
  updateSkill,
  deleteSkill,
  type Skill,
} from "@/actions/skills";
import {
  addPlace,
  updatePlace,
  deletePlace,
  addBook,
  updateBook,
  deleteBook,
  addMusic,
  updateMusic,
  deleteMusic,
  type Place,
  type Book,
  type Music,
} from "@/actions/about";
import { uploadImage } from "@/actions/upload";
import { uploadResume } from "@/actions/resume";
import type { ResumeStats } from "@/lib/resume";
import { reorderItems } from "@/actions/reorder";
import type { VisitStats } from "@/actions/visits";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";

type Tab = "projects" | "experiences" | "skills" | "about" | "resume" | "games";

export default function AdminDashboardClient({
  projects,
  experiences,
  skills,
  places,
  books,
  music,
  visitStats,
  resumeStats,
}: {
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  places: Place[];
  books: Book[];
  music: Music[];
  visitStats: VisitStats;
  resumeStats: ResumeStats;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const router = useRouter();

  // Auto-logout after 5 minutes of idle
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const IDLE_MS = 5 * 60 * 1000;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await destroySessionAction();
        router.push("/admin/login?expired=1");
      }, IDLE_MS);
    };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [router]);

  const handleReorder = useCallback(
    async (collection: string, orderedIds: string[]) => {
      const result = await reorderItems(collection, orderedIds);
      if (result.success) {
        toast.success("Order updated");
      } else {
        toast.error(result.error ?? "Failed to reorder");
      }
      router.refresh();
    },
    [router],
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "projects", label: "Projects", count: projects.length },
    { key: "experiences", label: "Experiences", count: experiences.length },
    { key: "skills", label: "Skills", count: skills.length },
    {
      key: "about",
      label: "About Me",
      count: places.length + books.length + music.length,
    },
    { key: "resume", label: "Resume", count: resumeStats.uniqueDownloaders },
    { key: "games", label: "Games", count: 0 },
  ];

  return (
    <motion.div
      className="min-h-screen px-4 py-10 max-w-[70rem] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Toaster position="top-right" />
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 hover:text-black dark:hover:text-white transition-colors cursor-default">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <form action={logoutAction}>
            <motion.button
              type="submit"
              className="group px-8 py-2.5 bg-red-600 text-white rounded-full flex items-center gap-2
              hover:bg-red-500 transition text-sm border border-red-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BsArrowLeft className="opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Logout
              </span>
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Visit Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <div className="bg-white dark:bg-slate-900 border border-black/20 dark:border-white/15 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Total Visits
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {visitStats.totalVisits.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-black/20 dark:border-white/15 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Unique Visitors
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {visitStats.uniqueVisitors.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-black/20 dark:border-white/15 rounded-lg p-4 col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Last Visit
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            {visitStats.lastVisited
              ? new Date(visitStats.lastVisited).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-6 border-b border-black/10 dark:border-white/10 overflow-x-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            aria-label={`${tab.label} tab, ${tab.count} items`}
            aria-selected={activeTab === tab.key}
            role="tab"
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-white dark:bg-slate-900 border border-b-0 border-black/20 dark:border-white/15 text-cyan-600"
                : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            router={router}
            onReorder={handleReorder}
          />
        )}
        {activeTab === "experiences" && (
          <ExperiencesTab
            experiences={experiences}
            router={router}
            onReorder={handleReorder}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab
            skills={skills}
            router={router}
            onReorder={handleReorder}
          />
        )}
        {activeTab === "about" && (
          <AboutMeTab
            places={places}
            books={books}
            music={music}
            router={router}
            onReorder={handleReorder}
          />
        )}
        {activeTab === "resume" && (
          <ResumeTab resumeStats={resumeStats} router={router} />
        )}
        {activeTab === "games" && <GamesTab />}
      </motion.div>
    </motion.div>
  );
}

/* ======================== SHARED TYPES & HELPERS ======================== */

type ReorderHandler = (
  collection: string,
  orderedIds: string[],
) => Promise<void>;

function useDndSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: {
    handleProps: Record<string, unknown>;
  }) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: "relative" as const,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children({ handleProps: { ...attributes, ...listeners } })}
    </div>
  );
}

function DragHandle(props: Record<string, unknown>) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      {...props}
      className="cursor-grab active:cursor-grabbing touch-none text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 shrink-0"
    >
      <MdDragIndicator size={20} />
    </button>
  );
}

/* ======================== PROJECTS TAB ======================== */

function ProjectsTab({
  projects,
  router,
  onReorder,
}: {
  projects: Project[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const sensors = useDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(projects, oldIndex, newIndex);
    onReorder(
      "projects",
      newOrder.map((p) => p.id),
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProject(null);
          }}
          className="px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 hover:scale-105 active:scale-110 transition text-sm font-medium"
        >
          + Add Project
        </button>
      </div>

      {(showAddForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingProject(null);
            toast.success(editingProject ? "Project updated" : "Project added");
            router.refresh();
          }}
        />
      )}

      <div className="space-y-4 mt-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {projects.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No projects yet. Click &ldquo;+ Add Project&rdquo; to get
                started.
              </p>
            )}
            {projects.map((project) => (
              <SortableItem key={project.id} id={project.id}>
                {({ handleProps }) => (
                  <div className="border border-black/20 dark:border-white/10 rounded-lg p-4 flex gap-4">
                    <DragHandle {...handleProps} />
                    {project.imageUrl && (
                      <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setShowAddForm(false);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:scale-105 transition text-sm"
                        >
                          Edit
                        </button>
                        <DeleteButton
                          onDelete={() => deleteProject(project.id)}
                          onSuccess={() => {
                            toast.success("Project deleted");
                            router.refresh();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onCancel,
  onSuccess,
}: {
  project: Project | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!project;
  const action = isEditing ? updateProject : addProject;
  const [state, formAction, pending] = useActionState(action, null);

  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tagsText, setTagsText] = useState(project?.tags.join(", ") ?? "");

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    if (result.error) setUploadError(result.error);
    else if (result.url) setImageUrl(result.url);
    setUploading(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const previewTags = tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-5 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">
        {isEditing ? "Edit Project" : "Add New Project"}
      </h3>
      <div className="flex flex-col lg:flex-row gap-6">
        <form action={formAction} className="flex flex-col gap-3 flex-1">
          {isEditing && <input type="hidden" name="id" value={project.id} />}
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <input
            type="text"
            name="title"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="px-3 py-2 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="url"
            name="link"
            placeholder="Project URL (https://...)"
            defaultValue={project?.link ?? ""}
            required
            className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            required
            className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
          />

          {/* Image Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all ${dragOver ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" : "border-black/20 dark:border-white/20 hover:border-cyan-400"} ${uploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={onFileChange}
              className="hidden"
            />
            {imageUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-12 rounded overflow-hidden shrink-0">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-slate-300 truncate">
                    Image uploaded
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    Click or drag to replace
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {uploading
                    ? "Uploading..."
                    : "Click or drag & drop an image here"}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">
                  PNG, JPEG, WebP, GIF � max 4MB
                </p>
              </div>
            )}
          </div>

          {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          {state?.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={pending || uploading || !imageUrl}
              className="px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 transition text-sm font-medium"
            >
              {pending
                ? "Saving..."
                : isEditing
                  ? "Update Project"
                  : "Add Project"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-full hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="lg:w-80 shrink-0">
          <p className="text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
            Live Preview
          </p>
          <div className="bg-slate-900 border-2 border-white/35 overflow-hidden rounded-lg flex flex-col">
            <div className="relative w-full h-36 bg-gray-800">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  fill
                  alt="Preview"
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-white">
                {title || "Project Title"}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-300 line-clamp-2">
                {description || "Project description will appear here..."}
              </p>
              {previewTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {previewTags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-slate-700 px-2 py-1 text-[0.65rem] uppercase tracking-wider text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== EXPERIENCES TAB ======================== */

function ExperiencesTab({
  experiences,
  router,
  onReorder,
}: {
  experiences: Experience[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const sensors = useDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = experiences.findIndex((e) => e.id === active.id);
    const newIndex = experiences.findIndex((e) => e.id === over.id);
    const newOrder = arrayMove(experiences, oldIndex, newIndex);
    onReorder(
      "experiences",
      newOrder.map((e) => e.id),
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Experiences ({experiences.length})
        </h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingExp(null);
          }}
          className="px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 hover:scale-105 active:scale-110 transition text-sm font-medium"
        >
          + Add Experience
        </button>
      </div>

      {(showAddForm || editingExp) && (
        <ExperienceForm
          experience={editingExp}
          onCancel={() => {
            setShowAddForm(false);
            setEditingExp(null);
          }}
          onSuccess={() => {
            setShowAddForm(false);
            toast.success(
              editingExp ? "Experience updated" : "Experience added",
            );
            setEditingExp(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-4 mt-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experiences.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {experiences.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No experiences yet. Click &ldquo;+ Add Experience&rdquo; to get
                started.
              </p>
            )}
            {experiences.map((exp) => (
              <SortableItem key={exp.id} id={exp.id}>
                {({ handleProps }) => (
                  <div className="border border-black/20 dark:border-white/10 rounded-lg p-4 flex gap-3">
                    <DragHandle {...handleProps} />
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                          {exp.location} &middot; {exp.duration}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {exp.description}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingExp(exp);
                            setShowAddForm(false);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:scale-105 transition text-sm"
                        >
                          Edit
                        </button>
                        <DeleteButton
                          onDelete={() => deleteExperience(exp.id)}
                          onSuccess={() => {
                            toast.success("Experience deleted");
                            router.refresh();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function ExperienceForm({
  experience,
  onCancel,
  onSuccess,
}: {
  experience: Experience | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!experience;
  const action = isEditing ? updateExperience : addExperience;
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-5 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">
        {isEditing ? "Edit Experience" : "Add New Experience"}
      </h3>
      <form action={formAction} className="flex flex-col gap-3 max-w-xl">
        {isEditing && <input type="hidden" name="id" value={experience.id} />}
        <input
          type="text"
          name="title"
          placeholder="Job title"
          defaultValue={experience?.title ?? ""}
          required
          className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          defaultValue={experience?.company ?? ""}
          required
          className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Istanbul, Turkey)"
          defaultValue={experience?.location ?? ""}
          required
          className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. Jan 2024 - Present)"
          defaultValue={experience?.duration ?? ""}
          required
          className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <textarea
          name="description"
          placeholder="Description of your role"
          defaultValue={experience?.description ?? ""}
          required
          rows={3}
          className="px-3 py-2 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 transition text-sm font-medium"
          >
            {pending ? "Saving..." : isEditing ? "Update" : "Add Experience"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-full hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ======================== SKILLS TAB ======================== */

function SkillsTab({
  skills,
  router,
  onReorder,
}: {
  skills: Skill[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const sensors = useDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = skills.findIndex((s) => s.id === active.id);
    const newIndex = skills.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(skills, oldIndex, newIndex);
    onReorder(
      "skills",
      newOrder.map((s) => s.id),
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Skills ({skills.length})
        </h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingSkill(null);
          }}
          className="px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 hover:scale-105 active:scale-110 transition text-sm font-medium"
        >
          + Add Skill
        </button>
      </div>

      {(showAddForm || editingSkill) && (
        <SkillForm
          skill={editingSkill}
          onCancel={() => {
            setShowAddForm(false);
            setEditingSkill(null);
          }}
          onSuccess={() => {
            setShowAddForm(false);
            toast.success(editingSkill ? "Skill updated" : "Skill added");
            setEditingSkill(null);
            router.refresh();
          }}
        />
      )}

      <div className="flex flex-wrap gap-2 mt-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={skills.map((s) => s.id)}>
            {skills.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8 w-full">
                No skills yet. Click &ldquo;+ Add Skill&rdquo; to get started.
              </p>
            )}
            {skills.map((skill) => (
              <SortableItem key={skill.id} id={skill.id}>
                {({ handleProps }) => (
                  <div className="group relative flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-cyan-500/40">
                    <button
                      type="button"
                      aria-label={`Drag to reorder ${skill.name}`}
                      {...handleProps}
                      className="cursor-grab active:cursor-grabbing touch-none text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                    >
                      <MdDragIndicator size={16} />
                    </button>
                    <span className="text-sm text-gray-800 dark:text-slate-200">
                      {skill.name}
                    </span>
                    <div className="hidden group-hover:flex group-focus-within:flex items-center gap-1 ml-2">
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setShowAddForm(false);
                        }}
                        className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <DeleteButton
                        onDelete={() => deleteSkill(skill.id)}
                        onSuccess={() => {
                          toast.success("Skill deleted");
                          router.refresh();
                        }}
                        small
                      />
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SkillForm({
  skill,
  onCancel,
  onSuccess,
}: {
  skill: Skill | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!skill;
  const action = isEditing ? updateSkill : addSkill;
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-5 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">
        {isEditing ? "Edit Skill" : "Add New Skill"}
      </h3>
      <form action={formAction} className="flex items-end gap-3">
        {isEditing && <input type="hidden" name="id" value={skill.id} />}
        <input
          type="text"
          name="name"
          placeholder="Skill name (e.g. Docker)"
          defaultValue={skill?.name ?? ""}
          required
          className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none w-60"
        />

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="h-10 px-4 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 transition text-sm font-medium"
        >
          {pending ? "..." : isEditing ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-4 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-full hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

/* ======================== ABOUT ME TAB ======================== */

function AboutMeTab({
  places,
  books,
  music,
  router,
  onReorder,
}: {
  places: Place[];
  books: Book[];
  music: Music[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [subTab, setSubTab] = useState<"places" | "books" | "music">("places");

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <div className="flex gap-3 mb-6">
        {(["places", "books", "music"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            aria-label={`${t === "places" ? "Places" : t === "books" ? "Books" : "Music"} sub-tab`}
            aria-selected={subTab === t}
            role="tab"
            className={`px-3 py-1.5 text-sm rounded-full transition hover:scale-105 ${subTab === t ? "bg-cyan-600 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600"}`}
          >
            {t === "places"
              ? `Places (${places.length})`
              : t === "books"
                ? `Books (${books.length})`
                : `Music (${music.length})`}
          </button>
        ))}
      </div>

      {subTab === "places" && (
        <PlacesSection places={places} router={router} onReorder={onReorder} />
      )}
      {subTab === "books" && (
        <BooksSection books={books} router={router} onReorder={onReorder} />
      )}
      {subTab === "music" && (
        <MusicSection music={music} router={router} onReorder={onReorder} />
      )}
    </div>
  );
}

/* --- Places --- */

function PlacesSection({
  places,
  router,
  onReorder,
}: {
  places: Place[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [editing, setEditing] = useState<Place | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const sensors = useDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = places.findIndex((p) => p.id === active.id);
    const newIndex = places.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(places, oldIndex, newIndex);
    onReorder(
      "places",
      newOrder.map((p) => p.id),
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
          Places Visited
        </h3>
        <button
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
          }}
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 hover:scale-105 active:scale-110 transition text-sm"
        >
          + Add
        </button>
      </div>

      {(showAdd || editing) && (
        <PlaceForm
          place={editing}
          onCancel={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSuccess={() => {
            setShowAdd(false);
            toast.success(editing ? "Place updated" : "Place added");
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={places.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {places.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No places yet. Click &ldquo;+ Add&rdquo; to get started.
              </p>
            )}
            {places.map((place) => (
              <SortableItem key={place.id} id={place.id}>
                {({ handleProps }) => (
                  <div className="border border-black/20 dark:border-white/10 rounded-lg p-3 flex items-center gap-4">
                    <DragHandle {...handleProps} />
                    {place.image && (
                      <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <Image
                          src={place.image}
                          alt={place.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                        {place.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {place.description}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditing(place);
                          setShowAdd(false);
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-500 hover:scale-105 transition"
                      >
                        Edit
                      </button>
                      <DeleteButton
                        onDelete={() => deletePlace(place.id)}
                        onSuccess={() => {
                          toast.success("Place deleted");
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

function PlaceForm({
  place,
  onCancel,
  onSuccess,
}: {
  place: Place | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!place;
  const action = isEditing ? updatePlace : addPlace;
  const [state, formAction, pending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState(place?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    if (result.url) setImageUrl(result.url);
    setUploading(false);
  };

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <form action={formAction} className="flex flex-col gap-3 max-w-lg">
        {isEditing && <input type="hidden" name="id" value={place.id} />}
        <input type="hidden" name="image" value={imageUrl} />
        <input
          type="text"
          name="name"
          placeholder="Place name"
          defaultValue={place?.name ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          name="description"
          placeholder="Short description"
          defaultValue={place?.description ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition"
          >
            {uploading
              ? "Uploading..."
              : imageUrl
                ? "Replace Image"
                : "Upload Image"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
            className="hidden"
          />
          {imageUrl && (
            <span className="text-xs text-green-600">Image set</span>
          )}
        </div>
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending || !imageUrl}
            className="px-4 py-1.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 transition text-sm"
          >
            {pending ? "..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-300 dark:bg-slate-700 rounded-full text-sm transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* --- Books --- */

function BooksSection({
  books,
  router,
  onReorder,
}: {
  books: Book[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [editing, setEditing] = useState<Book | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const sensors = useDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = books.findIndex((b) => b.id === active.id);
    const newIndex = books.findIndex((b) => b.id === over.id);
    const newOrder = arrayMove(books, oldIndex, newIndex);
    onReorder(
      "books",
      newOrder.map((b) => b.id),
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
          Books
        </h3>
        <button
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
          }}
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 hover:scale-105 active:scale-110 transition text-sm"
        >
          + Add
        </button>
      </div>

      {(showAdd || editing) && (
        <BookForm
          book={editing}
          onCancel={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSuccess={() => {
            setShowAdd(false);
            toast.success(editing ? "Book updated" : "Book added");
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={books.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {books.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No books yet. Click &ldquo;+ Add&rdquo; to get started.
              </p>
            )}
            {books.map((book) => (
              <SortableItem key={book.id} id={book.id}>
                {({ handleProps }) => (
                  <div className="border border-black/20 dark:border-white/10 rounded-lg p-3 flex items-center gap-4">
                    <DragHandle {...handleProps} />
                    {book.image && (
                      <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {book.author}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditing(book);
                          setShowAdd(false);
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-500 hover:scale-105 transition"
                      >
                        Edit
                      </button>
                      <DeleteButton
                        onDelete={() => deleteBook(book.id)}
                        onSuccess={() => {
                          toast.success("Book deleted");
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

function BookForm({
  book,
  onCancel,
  onSuccess,
}: {
  book: Book | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!book;
  const action = isEditing ? updateBook : addBook;
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <form action={formAction} className="flex flex-col gap-3 max-w-lg">
        {isEditing && <input type="hidden" name="id" value={book.id} />}
        <input
          type="text"
          name="title"
          placeholder="Book title"
          defaultValue={book?.title ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          defaultValue={book?.author ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="url"
          name="image"
          placeholder="Cover image URL"
          defaultValue={book?.image ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-1.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 transition text-sm"
          >
            {pending ? "..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-300 dark:bg-slate-700 rounded-full text-sm transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* --- Music --- */

function MusicSection({
  music,
  router,
  onReorder,
}: {
  music: Music[];
  router: ReturnType<typeof useRouter>;
  onReorder: ReorderHandler;
}) {
  const [editing, setEditing] = useState<Music | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const sensors = useDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = music.findIndex((m) => m.id === active.id);
    const newIndex = music.findIndex((m) => m.id === over.id);
    const newOrder = arrayMove(music, oldIndex, newIndex);
    onReorder(
      "music",
      newOrder.map((m) => m.id),
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
          Music
        </h3>
        <button
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
          }}
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 hover:scale-105 active:scale-110 transition text-sm"
        >
          + Add
        </button>
      </div>

      {(showAdd || editing) && (
        <MusicForm
          track={editing}
          onCancel={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSuccess={() => {
            setShowAdd(false);
            toast.success(editing ? "Track updated" : "Track added");
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={music.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {music.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No tracks yet. Click &ldquo;+ Add&rdquo; to get started.
              </p>
            )}
            {music.map((track) => (
              <SortableItem key={track.id} id={track.id}>
                {({ handleProps }) => (
                  <div className="border border-black/20 dark:border-white/10 rounded-lg p-3 flex items-center gap-4">
                    <DragHandle {...handleProps} />
                    {track.cover && (
                      <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <Image
                          src={track.cover}
                          alt={track.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                        {track.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {track.artist}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditing(track);
                          setShowAdd(false);
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-500 hover:scale-105 transition"
                      >
                        Edit
                      </button>
                      <DeleteButton
                        onDelete={() => deleteMusic(track.id)}
                        onSuccess={() => {
                          toast.success("Track deleted");
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

function MusicForm({
  track,
  onCancel,
  onSuccess,
}: {
  track: Music | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!track;
  const action = isEditing ? updateMusic : addMusic;
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <form action={formAction} className="flex flex-col gap-3 max-w-lg">
        {isEditing && <input type="hidden" name="id" value={track.id} />}
        <input
          type="text"
          name="title"
          placeholder="Song title"
          defaultValue={track?.title ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          defaultValue={track?.artist ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="url"
          name="cover"
          placeholder="Cover image URL (Spotify CDN)"
          defaultValue={track?.cover ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="url"
          name="spotifyUrl"
          placeholder="Spotify embed URL"
          defaultValue={track?.spotifyUrl ?? ""}
          required
          className="h-9 px-3 rounded-md border border-black/30 dark:border-white/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
        />
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-1.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 transition text-sm"
          >
            {pending ? "..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-300 dark:bg-slate-700 rounded-full text-sm transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ======================== SHARED ======================== */

function DeleteButton({
  onDelete,
  onSuccess,
  small,
}: {
  onDelete: () => Promise<{ error?: string; success?: boolean }>;
  onSuccess: () => void;
  small?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    const result = await onDelete();
    if (result.success) onSuccess();
  };

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button
          onClick={handleDelete}
          className={`${small ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1.5 text-xs"} bg-red-600 text-white rounded-full hover:bg-red-500 transition`}
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className={`${small ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1.5 text-xs"} bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-full transition`}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`${small ? "text-red-500 hover:text-red-400 text-xs font-medium" : "px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-105 transition text-sm"}`}
    >
      Delete
    </button>
  );
}

/* ======================== RESUME TAB ======================== */

function ResumeTab({
  resumeStats,
  router,
}: {
  resumeStats: ResumeStats;
  router: ReturnType<typeof useRouter>;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadResume(formData);
    if (result.error) {
      setUploadError(result.error);
    } else if (result.url) {
      toast.success("Resume updated successfully");
      router.refresh();
    }
    setUploading(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
        Resume
      </h2>

      {/* Current Resume & Upload */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
            Current Resume
          </p>
          {resumeStats.resumeUrl ? (
            <a
              href={resumeStats.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 dark:text-green-300 underline break-all"
            >
              View current resume
            </a>
          ) : (
            <p className="text-sm text-green-700 dark:text-green-300">
              No resume uploaded yet
            </p>
          )}
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-1">
            Unique Downloaders
          </p>
          <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
            {resumeStats.uniqueDownloaders}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
            Total Downloads
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {resumeStats.totalDownloads}
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Upload New Resume
        </p>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${dragOver ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" : "border-black/20 dark:border-white/20 hover:border-cyan-400"} ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {uploading
              ? "Uploading..."
              : "Click or drag & drop a PDF here to update your resume"}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">
            PDF only - max 10MB
          </p>
        </div>
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
      </div>

      {/* Download History */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
        Recent Downloads
      </h3>
      {resumeStats.recentDownloads.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          No downloads yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Visitor</th>
                <th className="py-2 pr-3">Downloads</th>
                <th className="py-2 pr-3">User Agent</th>
                <th className="py-2 pr-3">Last Download</th>
              </tr>
            </thead>
            <tbody>
              {resumeStats.recentDownloads.map((download, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="py-2.5 pr-3 text-gray-400 dark:text-gray-500 font-medium">
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {download.ipHash}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-600 dark:text-gray-400">
                    {download.downloads}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-600 dark:text-gray-400 max-w-[20rem] truncate">
                    {download.userAgent}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(download.lastDownloadedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ======================== GAMES TAB ======================== */

interface GuessTheWordEntry {
  id: string;
  name: string;
  guesses: number;
  hintsUsed: number;
  date: string;
  createdAt: string;
}

interface GuessTheWordAdminData {
  todayWord: string;
  wordIndex: number;
  totalAnswers: number;
  today: string;
  stats: { todayCount: number; totalCount: number };
  todayEntries: GuessTheWordEntry[];
  allEntries: GuessTheWordEntry[];
}

function GamesTab() {
  const [data, setData] = useState<GuessTheWordAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState<"today" | "all">("today");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guess-the-word/admin");
      if (res.ok) {
        setData(await res.json());
      } else {
        toast.error("Failed to load game data");
      }
    } catch {
      toast.error("Failed to load game data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/guess-the-word/admin?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Entry deleted");
        fetchData();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const handleClear = async (scope: "today" | "all") => {
    const res = await fetch(`/api/guess-the-word/admin?clearAll=${scope}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success(
        scope === "today" ? "Today's entries cleared" : "All entries cleared",
      );
      fetchData();
    } else {
      toast.error("Failed to clear");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8 text-center text-red-500">
        Failed to load data.{" "}
        <button onClick={fetchData} className="underline">
          Retry
        </button>
      </div>
    );
  }

  const entries = viewTab === "today" ? data.todayEntries : data.allEntries;

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
        Guess The Word
      </h2>

      {/* Today's Word Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
            Today&apos;s Word
          </p>
          <p className="text-2xl font-bold tracking-widest text-green-700 dark:text-green-300">
            {data.todayWord}
          </p>
          <p className="text-xs text-green-500 dark:text-green-500 mt-1">
            Word #{data.wordIndex + 1} of {data.totalAnswers}
          </p>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-1">
            Today&apos;s Players
          </p>
          <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
            {data.stats.todayCount}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
            All-Time Entries
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {data.stats.totalCount}
          </p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-gray-200 dark:bg-slate-700 rounded-md p-0.5">
          {(["today", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setViewTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded transition ${
                viewTab === tab
                  ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab === "today" ? "Today" : "All Time"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {confirmClear ? (
            <div className="flex gap-1">
              <button
                onClick={() => {
                  handleClear(viewTab);
                  setConfirmClear(false);
                }}
                className="px-2 py-1.5 text-xs bg-red-600 text-white rounded-full hover:bg-red-500 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-2 py-1.5 text-xs bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-full transition"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-105 transition text-sm"
            >
              Clear {viewTab === "today" ? "Today" : "All"}
            </button>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          No entries{viewTab === "today" ? " today" : ""} yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Guesses</th>
                <th className="py-2 pr-3">Hints</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="py-2.5 pr-3 text-gray-400 dark:text-gray-500 font-medium">
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-3 font-medium text-gray-900 dark:text-gray-100">
                    {entry.name}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-600 dark:text-gray-400">
                    {entry.guesses}/6
                  </td>
                  <td className="py-2.5 pr-3">
                    {entry.hintsUsed > 0 ? (
                      <span className="text-yellow-500">
                        💡 {entry.hintsUsed}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        0
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500 dark:text-gray-400">
                    {entry.date}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="text-red-500 hover:text-red-400 text-xs font-medium disabled:opacity-50"
                    >
                      {deleting === entry.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
