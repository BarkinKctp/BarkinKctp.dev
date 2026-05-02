export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen pt-0 -mt-35 sm:-mt-44">{children}</div>;
}
