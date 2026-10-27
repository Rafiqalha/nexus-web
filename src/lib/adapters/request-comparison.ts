import type { EvidenceItem, RequestRecord } from "@/lib/contracts/console";

export function comparisonHref(left: string, right: string) {
  return `/demo/requests/compare?${new URLSearchParams({ left, right })}`;
}

// Compare the displayed fields, including missing values and unknown raw enums.
// Matching presentation details are not a security equivalence claim.
function evidenceValues(item: EvidenceItem) {
  return [
    item.label,
    item.evaluation,
    item.origin,
    item.representedOrigin,
    item.scope,
    item.reasonCode,
    item.reasonText,
    item.observedAt,
    item.expiresAt,
    item.metric?.label,
    item.metric?.value,
    item.metric?.unit,
  ];
}

export function compareEvidence(left: RequestRecord, right: RequestRecord) {
  const leftItems = new Map(left.evidence.map((item) => [item.checkId, item]));
  const rightItems = new Map(
    right.evidence.map((item) => [item.checkId, item]),
  );
  const ids = new Set([...leftItems.keys(), ...rightItems.keys()]);
  return [...ids].map((checkId) => {
    const a = leftItems.get(checkId);
    const b = rightItems.get(checkId);
    return {
      checkId,
      label: a?.label ?? b!.label,
      left: a,
      right: b,
      different:
        !a ||
        !b ||
        evidenceValues(a).some(
          (value, index) => value !== evidenceValues(b)[index],
        ),
    };
  });
}
