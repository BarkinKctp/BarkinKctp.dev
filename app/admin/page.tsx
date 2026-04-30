import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/projects";
import AdminDashboardClient from "./dashboard-client";

export default async function AdminPage() {
  const authenticated = await verifySession();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const projects = await getProjects();

  return <AdminDashboardClient projects={projects} />;
}
