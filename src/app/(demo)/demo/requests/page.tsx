import { RequestsScreen } from "@/components/console/requests";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Requests" };
export default function Requests() {
  return (
    <ConsoleRoute>
      <RequestsScreen />
    </ConsoleRoute>
  );
}
