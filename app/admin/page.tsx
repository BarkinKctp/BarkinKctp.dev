import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/projects";
import { getExperiences } from "@/actions/experiences";
import { getSkills } from "@/actions/skills";
import { getPlaces, getBooks, getMusic } from "@/actions/about";
import AdminDashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await verifySession();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const [projects, experiences, skills, places, books, music] =
    await Promise.all([
      getProjects(),
      getExperiences(),
      getSkills(),
      getPlaces(),
      getBooks(),
      getMusic(),
    ]);

  return (
    <AdminDashboardClient
      projects={projects}
      experiences={experiences}
      skills={skills}
      places={places}
      books={books}
      music={music}
    />
  );
}
