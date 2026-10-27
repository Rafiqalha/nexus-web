import type {
  ConsoleSnapshot,
  DemoState,
  PageResult,
  ReadResult,
  RequestQuery,
  RequestRecord,
} from "@/lib/contracts/console";
import { normalizeDecision } from "@/lib/adapters/evidence";
import { snapshot } from "./fixtures";

export interface DemoAdapter {
  readonly mode: "demo";
  read(state: DemoState): ReadResult<ConsoleSnapshot>;
  listRequests(
    records: readonly RequestRecord[],
    query: RequestQuery,
  ): PageResult<RequestRecord>;
}
export function requestQuery(
  params: Pick<URLSearchParams, "get">,
): RequestQuery {
  const rawPage = params.get("page") ?? "1";
  const sort = params.get("sort");
  const decision = params.get("decision") ?? "all";
  return {
    q: (params.get("q") ?? "").trim().slice(0, 80),
    decision: [
      "accepted",
      "expired",
      "rejected",
      "unavailable",
      "error",
      "unknown",
    ].includes(decision)
      ? decision
      : "all",
    sort: sort === "oldest" || sort === "latency" ? sort : "newest",
    page: /^\d{1,6}$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1,
  };
}
export const demoService: DemoAdapter = {
  mode: "demo",
  read(state) {
    if (
      state === "loading" ||
      state === "error" ||
      state === "denied" ||
      state === "expired-session"
    ) {
      return {
        status: state,
        diagnosticId: `demo_${state.replaceAll("-", "_")}_001`,
      };
    }
    return {
      status: "ready",
      data: {
        ...snapshot,
        stale: state === "stale",
        ...(state === "empty"
          ? { requests: [], enrollments: [], policies: [], audit: [] }
          : {}),
      },
    };
  },
  listRequests(records, query) {
    const q = query.q.toLowerCase();
    const filtered = records
      .filter(
        (record) =>
          (query.decision === "all" ||
            normalizeDecision(record.decision) === query.decision) &&
          (!q ||
            [record.id, record.reasonCode, record.policyId ?? ""].some(
              (value) => value.toLowerCase().includes(q),
            )),
      )
      .sort((a, b) => {
        if (query.sort === "latency") {
          if (a.latencyMs === null && b.latencyMs !== null) return 1;
          if (b.latencyMs === null && a.latencyMs !== null) return -1;
          if (a.latencyMs !== b.latencyMs)
            return (b.latencyMs ?? 0) - (a.latencyMs ?? 0);
        }
        const order =
          a.receivedAt.localeCompare(b.receivedAt) || a.id.localeCompare(b.id);
        return query.sort === "oldest" ? order : -order;
      });
    const pageSize = 6;
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(query.page, pages);
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pages,
      pageSize,
    };
  },
};
