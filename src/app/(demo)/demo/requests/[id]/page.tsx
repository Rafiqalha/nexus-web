import { notFound } from "next/navigation";
import { requests } from "@/lib/demo/fixtures";
import { RequestDetail } from "@/components/console/requests";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Request inspection" };
export function generateStaticParams() {
  return requests.map((record) => ({ id: record.id }));
}
export default async function RequestPage({
  params,
}: PageProps<"/demo/requests/[id]">) {
  const { id } = await params;
  if (!requests.some((record) => record.id === id)) notFound();
  return (
    <ConsoleRoute>
      <RequestDetail id={id} />
    </ConsoleRoute>
  );
}
