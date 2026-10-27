import { SettingsScreen } from "@/components/console/administration";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Settings" };
export default function Settings() {
  return (
    <ConsoleRoute>
      <SettingsScreen />
    </ConsoleRoute>
  );
}
