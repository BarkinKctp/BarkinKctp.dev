"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import { logoutAction } from "@/actions/auth";
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
import { useRouter } from "next/navigation";

type Tab = "projects" | "experiences" | "skills" | "about";

export default function AdminDashboardClient({
  projects,
  experiences,
  skills,
  places,
  books,
  music,
}: {
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  places: Place[];
  books: Book[];
  music: Music[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const router = useRouter();

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "projects", label: "Projects", count: projects.length },
    { key: "experiences", label: "Experiences", count: experiences.length },
    { key: "skills", label: "Skills", count: skills.length },
    {
      key: "about",
      label: "About Me",
      count: places.length + books.length + music.length,
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10 max-w-[70rem] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          Admin Dashboard
        </h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition text-sm"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-black/10 dark:border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition ${
              activeTab === tab.key
                ? "bg-white dark:bg-slate-900 border border-b-0 border-black/20 dark:border-white/15 text-cyan-600"
                : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "projects" && (
        <ProjectsTab projects={projects} router={router} />
      )}
      {activeTab === "experiences" && (
        <ExperiencesTab experiences={experiences} router={router} />
      )}
      {activeTab === "skills" && <SkillsTab skills={skills} router={router} />}
      {activeTab === "about" && (
        <AboutMeTab
          places={places}
          books={books}
          music={music}
          router={router}
        />
      )}
    </div>
  );
}

/* ======================== PROJECTS TAB ======================== */

function ProjectsTab({
  projects,
  router,
}: {
  projects: Project[];
  router: ReturnType<typeof useRouter>;
}) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition text-sm font-medium"
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
            router.refresh();
          }}
        />
      )}

      <div className="space-y-4 mt-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-black/20 dark:border-white/10 rounded-lg p-4 flex gap-4"
          >
            {project.imageUrl && (
              <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
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
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition text-sm"
                >
                  Edit
                </button>
                <DeleteButton
                  onDelete={() => deleteProject(project.id)}
                  onSuccess={() => router.refresh()}
                />
              </div>
            </div>
          </div>
        ))}
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

  if (state?.success) onSuccess();

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
                  PNG, JPEG, WebP, GIF — max 4MB
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
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 transition text-sm font-medium"
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
              className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-md hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
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
}: {
  experiences: Experience[];
  router: ReturnType<typeof useRouter>;
}) {
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition text-sm font-medium"
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
            setEditingExp(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-4 mt-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="border border-black/20 dark:border-white/10 rounded-lg p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition text-sm"
                >
                  Edit
                </button>
                <DeleteButton
                  onDelete={() => deleteExperience(exp.id)}
                  onSuccess={() => router.refresh()}
                />
              </div>
            </div>
          </div>
        ))}
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

  if (state?.success) onSuccess();

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
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 transition text-sm font-medium"
          >
            {pending ? "Saving..." : isEditing ? "Update" : "Add Experience"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-md hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
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
}: {
  skills: Skill[];
  router: ReturnType<typeof useRouter>;
}) {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition text-sm font-medium"
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
            setEditingSkill(null);
            router.refresh();
          }}
        />
      )}

      <div className="flex flex-wrap gap-2 mt-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="group relative flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-full px-4 py-2"
          >
            <span className="text-sm text-gray-800 dark:text-slate-200">
              {skill.name}
            </span>
            <div className="hidden group-hover:flex items-center gap-1 ml-2">
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
                onSuccess={() => router.refresh()}
                small
              />
            </div>
          </div>
        ))}
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

  if (state?.success) onSuccess();

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
          className="h-10 px-4 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 transition text-sm font-medium"
        >
          {pending ? "..." : isEditing ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-4 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-md hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
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
}: {
  places: Place[];
  books: Book[];
  music: Music[];
  router: ReturnType<typeof useRouter>;
}) {
  const [subTab, setSubTab] = useState<"places" | "books" | "music">("places");

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8">
      <div className="flex gap-3 mb-6">
        {(["places", "books", "music"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 text-sm rounded-md transition ${subTab === t ? "bg-cyan-600 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600"}`}
          >
            {t === "places"
              ? `Places (${places.length})`
              : t === "books"
                ? `Books (${books.length})`
                : `Music (${music.length})`}
          </button>
        ))}
      </div>

      {subTab === "places" && <PlacesSection places={places} router={router} />}
      {subTab === "books" && <BooksSection books={books} router={router} />}
      {subTab === "music" && <MusicSection music={music} router={router} />}
    </div>
  );
}

/* --- Places --- */

function PlacesSection({
  places,
  router,
}: {
  places: Place[];
  router: ReturnType<typeof useRouter>;
}) {
  const [editing, setEditing] = useState<Place | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition text-sm"
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
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="border border-black/20 dark:border-white/10 rounded-lg p-3 flex items-center gap-4"
          >
            {place.image && (
              <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
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
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 transition"
              >
                Edit
              </button>
              <DeleteButton
                onDelete={() => deletePlace(place.id)}
                onSuccess={() => router.refresh()}
                small
              />
            </div>
          </div>
        ))}
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

  if (state?.success) onSuccess();

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
            className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition"
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
            className="px-4 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 transition text-sm"
          >
            {pending ? "..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-300 dark:bg-slate-700 rounded-md text-sm transition"
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
}: {
  books: Book[];
  router: ReturnType<typeof useRouter>;
}) {
  const [editing, setEditing] = useState<Book | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition text-sm"
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
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="border border-black/20 dark:border-white/10 rounded-lg p-3 flex items-center gap-4"
          >
            {book.image && (
              <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
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
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 transition"
              >
                Edit
              </button>
              <DeleteButton
                onDelete={() => deleteBook(book.id)}
                onSuccess={() => router.refresh()}
                small
              />
            </div>
          </div>
        ))}
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

  if (state?.success) onSuccess();

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
            className="px-4 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 transition text-sm"
          >
            {pending ? "..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-300 dark:bg-slate-700 rounded-md text-sm transition"
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
}: {
  music: Music[];
  router: ReturnType<typeof useRouter>;
}) {
  const [editing, setEditing] = useState<Music | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition text-sm"
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
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        {music.map((track) => (
          <div
            key={track.id}
            className="border border-black/20 dark:border-white/10 rounded-lg p-3 flex items-center gap-4"
          >
            {track.cover && (
              <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Image
                  src={track.cover}
                  alt={track.title}
                  fill
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
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 transition"
              >
                Edit
              </button>
              <DeleteButton
                onDelete={() => deleteMusic(track.id)}
                onSuccess={() => router.refresh()}
                small
              />
            </div>
          </div>
        ))}
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

  if (state?.success) onSuccess();

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
            className="px-4 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 transition text-sm"
          >
            {pending ? "..." : isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-300 dark:bg-slate-700 rounded-md text-sm transition"
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
          className={`${small ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1.5 text-xs"} bg-red-600 text-white rounded-md hover:bg-red-500 transition`}
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className={`${small ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1.5 text-xs"} bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-md transition`}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`${small ? "text-red-500 hover:text-red-400 text-xs font-medium" : "px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-500 transition text-sm"}`}
    >
      Delete
    </button>
  );
}
