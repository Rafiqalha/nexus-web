import { notFound } from "next/navigation";
import { enrollments } from "@/lib/demo/fixtures";
import { EnrollmentDetail } from "@/components/console/resources";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Enrollment inspection" };
export function generateStaticParams() {
  return enrollments.map((record) => ({ id: record.id }));
}
export default async function EnrollmentPage({
  params,
}: PageProps<"/demo/enrollments/[id]">) {
  const { id } = await params;
  if (!enrollments.some((record) => record.id === id)) notFound();
  return (
    <ConsoleRoute>
      <EnrollmentDetail id={id} />
    </ConsoleRoute>
  );
}
