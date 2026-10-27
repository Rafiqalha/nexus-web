import {
  Check,
  CircleHelp,
  FileKey2,
  Fingerprint,
  Layers3,
} from "@/components/ui/icons";

export function SessionIllustration() {
  return (
    <div
      className="capability-illustration session-illustration"
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 160" fill="none">
        <path
          className="signal-path signal-muted"
          d="M0 42H66C104 42 102 80 140 80H320M0 120H66C104 120 102 80 140 80"
        />
        <path className="signal-path" d="M0 80H320" />
        <circle cx="58" cy="42" r="4" />
        <circle cx="58" cy="120" r="4" />
        <circle cx="258" cy="80" r="4" />
      </svg>
      <span className="session-node">
        <Layers3 size={28} />
      </span>
      <span className="illustration-label mono">Session context</span>
    </div>
  );
}

export function EvidenceIllustration() {
  return (
    <div
      className="capability-illustration evidence-illustration"
      aria-hidden="true"
    >
      <div className="evidence-sheet sheet-back" />
      <div className="evidence-sheet sheet-middle" />
      <div className="evidence-sheet sheet-front">
        <Fingerprint size={24} />
        <span>
          Device-key statement
          <small className="mono">Bound to its context</small>
        </span>
        <FileKey2 size={17} />
      </div>
    </div>
  );
}

export function PolicyIllustration() {
  return (
    <div
      className="capability-illustration policy-illustration"
      aria-hidden="true"
    >
      <div>
        <Check size={14} />
        <span>Key signature</span>
        <span>Passed</span>
      </div>
      <div>
        <CircleHelp size={14} />
        <span>Camera provenance</span>
        <span>Unverified</span>
      </div>
      <div>
        <CircleHelp size={14} />
        <span>Liveness</span>
        <span>Not evaluated</span>
      </div>
      <small>Illustrative checks · Simulated data</small>
    </div>
  );
}
