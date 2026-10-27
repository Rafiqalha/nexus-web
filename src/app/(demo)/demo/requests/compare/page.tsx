import { RequestComparison } from "@/components/console/request-comparison";
import { ConsoleRoute } from "@/components/console/route";

export const metadata = { title: "Compare requests" };

export default function CompareRequests() {
  return (
    <ConsoleRoute>
      <RequestComparison />
    </ConsoleRoute>
  );
}
