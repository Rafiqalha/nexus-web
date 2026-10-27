import { EnrollmentsScreen } from "@/components/console/resources";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Enrollments" };
export default function Enrollments() {
  return (
    <ConsoleRoute>
      <EnrollmentsScreen />
    </ConsoleRoute>
  );
}
