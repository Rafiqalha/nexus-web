import { WalkthroughScreen } from "@/components/console/administration";
import { ConsoleRoute } from "@/components/console/route";
export const metadata = { title: "Evidence walkthrough" };
export default function Walkthrough() {
  return (
    <ConsoleRoute>
      <WalkthroughScreen />
    </ConsoleRoute>
  );
}
