"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { DemoState, ThemePreference } from "@/lib/contracts/console";
import { DEFAULT_WORKSPACE } from "@/lib/demo/fixtures";
import { demoService } from "@/lib/demo/service";

interface DemoSession {
  scenario: DemoState;
  setScenario: (state: DemoState) => void;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  workspace: string;
  setWorkspace: (name: string) => void;
  explored: string[];
  toggleExplored: (step: string) => void;
  reset: () => void;
  resetVersion: number;
}
const Context = createContext<DemoSession | null>(null);
export function DemoProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: ThemePreference;
}) {
  const router = useRouter();
  const [scenario, setScenario] = useState<DemoState>("records");
  const [theme, updateTheme] = useState(initialTheme);
  const [workspace, setWorkspace] = useState(DEFAULT_WORKSPACE);
  const [explored, setExplored] = useState<string[]>([]);
  const [resetVersion, setResetVersion] = useState(0);
  function setTheme(value: ThemePreference) {
    updateTheme(value);
    document.cookie = `nexus-demo-theme=${value}; Path=/demo; Max-Age=31536000; SameSite=Lax`;
  }
  function reset() {
    setScenario("records");
    setWorkspace(DEFAULT_WORKSPACE);
    setExplored([]);
    setResetVersion((version) => version + 1);
    router.replace("/demo");
  }
  return (
    <Context.Provider
      value={{
        scenario,
        setScenario,
        theme,
        setTheme,
        workspace,
        setWorkspace,
        explored,
        toggleExplored: (step) =>
          setExplored((steps) =>
            steps.includes(step)
              ? steps.filter((value) => value !== step)
              : [...steps, step],
          ),
        reset,
        resetVersion,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value)
    throw new Error("Demo components require the isolated demo provider.");
  return value;
}
export function useDemoRead() {
  const { scenario } = useDemo();
  return useMemo(() => demoService.read(scenario), [scenario]);
}
