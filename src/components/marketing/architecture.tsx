import {
  Smartphone,
  Cpu,
  FileKey2,
  Server,
  ArrowRight,
} from "@/components/ui/icons";
const steps = [
  {
    icon: Smartphone,
    title: "Your application",
    detail: "Starts a sensitive interaction",
    zone: "Application boundary",
  },
  {
    icon: Cpu,
    title: "Native SDK",
    detail: "Structures session measurements",
    zone: "Device-side processing",
  },
  {
    icon: FileKey2,
    title: "Signed evidence",
    detail: "Binds a statement to a device key",
    zone: "Evidence exchange",
  },
  {
    icon: Server,
    title: "Server verification",
    detail: "Checks context against policy",
    zone: "Server boundary",
  },
];
export function Architecture() {
  return (
    <figure className="architecture">
      <div className="architecture-top">
        <span className="eyebrow">The evidence path</span>
        <span className="mono small">Conceptual architecture</span>
      </div>
      <ol className="flow-grid">
        {steps.map(({ icon: Icon, title, detail, zone }, i) => (
          <li key={title}>
            <span className="flow-zone">{zone}</span>
            <div className="flow-node">
              <Icon size={24} aria-hidden="true" />
              <span className="mono small">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
            {i < 3 && (
              <ArrowRight className="flow-arrow" size={20} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <figcaption>
        <span className="flow-result">Output: a scoped policy decision</span>
        <span>
          A signature authenticates a key statement. Camera origin and liveness
          require separate evidence.
        </span>
      </figcaption>
    </figure>
  );
}
