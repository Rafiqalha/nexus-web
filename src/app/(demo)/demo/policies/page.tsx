import { PoliciesScreen } from "@/components/console/resources";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Policies" };
export default function Policies() {
  return (
    <ConsoleRoute>
      <PoliciesScreen />
    </ConsoleRoute>
  );
}
