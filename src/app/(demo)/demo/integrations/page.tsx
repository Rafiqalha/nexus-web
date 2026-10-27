import { IntegrationsScreen } from "@/components/console/administration";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Integrations" };
export default function Integrations() {
  return (
    <ConsoleRoute>
      <IntegrationsScreen />
    </ConsoleRoute>
  );
}
