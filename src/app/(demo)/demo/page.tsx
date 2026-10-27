import { OverviewScreen } from "@/components/console/overview";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Overview" };
export default function Demo() {
  return (
    <ConsoleRoute>
      <OverviewScreen />
    </ConsoleRoute>
  );
}
