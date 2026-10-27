import { notFound } from "next/navigation";
import { policies } from "@/lib/demo/fixtures";
import { PolicyDetail } from "@/components/console/resources";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Policy inspection" };
export function generateStaticParams() {
  return policies.map((record) => ({ id: record.id }));
}
export default async function PolicyPage({
  params,
}: PageProps<"/demo/policies/[id]">) {
  const { id } = await params;
  if (!policies.some((record) => record.id === id)) notFound();
  return (
    <ConsoleRoute>
      <PolicyDetail id={id} />
    </ConsoleRoute>
  );
}
