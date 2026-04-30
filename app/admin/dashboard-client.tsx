"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import { logoutAction } from "@/actions/auth";
import { addProject, updateProject, deleteProject, type Project } from "@/actions/projects";
import { uploadImage } from "@/actions/upload";
import { useRouter } from "next/navigation";

export default function AdminDashboardClient({
  projects,
}: {
  projects: Project[];
}) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

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

      {/* Projects Section */}
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

        {/* Add/Edit Form */}
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

        {/* Projects List */}
        <div className="space-y-4 mt-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-black/20 dark:border-white/10 rounded-lg p-4 flex gap-4"
            >
              {/* Thumbnail */}
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
                  <DeleteButton id={project.id} onSuccess={() => router.refresh()} />
                </div>
              </div>
            </div>
          ))}
        </div>
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

  // Live preview state
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tagsText, setTagsText] = useState(project?.tags.join(", ") ?? "");

  if (state?.success) {
    onSuccess();
  }

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.set("file", file);

    const result = await uploadImage(formData);
    if (result.error) {
      setUploadError(result.error);
    } else if (result.url) {
      setImageUrl(result.url);
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

  const previewTags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="border-2 border-cyan-500/30 rounded-lg p-5 bg-gray-50 dark:bg-slate-800/50 mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">
        {isEditing ? "Edit Project" : "Add New Project"}
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
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
            className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 
            bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm
            focus:border-cyan-500 focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="px-3 py-2 rounded-md border border-black/30 dark:border-white/20 
            bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm
            focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="url"
            name="link"
            placeholder="Project URL (https://...)"
            defaultValue={project?.link ?? ""}
            required
            className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 
            bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm
            focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated: React, TypeScript, Docker)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            required
            className="h-10 px-3 rounded-md border border-black/30 dark:border-white/20 
            bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm
            focus:border-cyan-500 focus:outline-none"
          />

          {/* Image Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all
              ${dragOver
                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                : "border-black/20 dark:border-white/20 hover:border-cyan-400"
              }
              ${uploading ? "opacity-60 pointer-events-none" : ""}
            `}
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
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-slate-300 truncate">Image uploaded</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Click or drag to replace</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {uploading ? "Uploading..." : "Click or drag & drop an image here"}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">
                  PNG, JPEG, WebP, GIF — max 4MB
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-red-500 text-sm">{uploadError}</p>
          )}
          {state?.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={pending || uploading || !imageUrl}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 
              disabled:opacity-50 transition text-sm font-medium"
            >
              {pending ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 
              rounded-md hover:bg-gray-400 dark:hover:bg-slate-600 transition text-sm"
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
                <Image src={imageUrl} fill alt="Preview" className="object-cover" />
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

function DeleteButton({ id, onSuccess }: { id: string; onSuccess: () => void }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    const result = await deleteProject(id);
    if (result.success) {
      onSuccess();
    }
  };

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-500 transition text-xs"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1.5 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-md transition text-xs"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-500 transition text-sm"
    >
      Delete
    </button>
  );
}
