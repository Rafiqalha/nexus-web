import { AuditScreen } from "@/components/console/administration";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Audit log" };
export default function Audit() {
  return (
    <ConsoleRoute>
      <AuditScreen />
    </ConsoleRoute>
  );
}
