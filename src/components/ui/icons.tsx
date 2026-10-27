import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// Original Nexus glyphs: a 24px grid, open geometry, and a quiet second tone.
function glyph(name: string, drawing: ReactNode) {
  function Icon({ size = 24, className = "", ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props["aria-label"] ? undefined : true}
        className={`nexus-icon ${className}`.trim()}
        data-icon={name}
        {...props}
      >
        {drawing}
      </svg>
    );
  }
  Icon.displayName = `Nexus${name}`;
  return Icon;
}

export const Activity = glyph(
  "session",
  <>
    <path className="icon-tone" d="M3 5h18v14H3z" />
    <path d="M3 8h4l3 8 4-12 3 8h4M3 19h18" />
    <circle cx="3" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="21" cy="12" r="1" fill="currentColor" stroke="none" />
  </>,
);
export const Fingerprint = glyph(
  "evidence",
  <>
    <path className="icon-tone" d="m12 2 9 5v10l-9 5-9-5V7z" />
    <path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10" />
    <path className="icon-detail" d="m7.5 4.5 9 5v5l-4.5 2.5" />
  </>,
);
export const ListChecks = glyph(
  "policy",
  <>
    <path className="icon-tone" d="M3 4h18v16H3z" />
    <path d="M11 5h10M11 12h10M11 19h10M3 5l1.5 1.5L7 3M3 12l1.5 1.5L7 10" />
    <circle cx="5" cy="19" r="2" />
  </>,
);
export const Code2 = glyph(
  "integration",
  <>
    <path className="icon-tone" d="M8 3h8v18H8z" />
    <path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 3l-4 18" />
  </>,
);
export const Braces = Code2;
export const ArrowRight = glyph(
  "arrow-right",
  <path d="M3 12h17m-6-6 6 6-6 6" />,
);
export const ArrowUpRight = glyph(
  "arrow-up-right",
  <path d="M5 19 19 5M7 5h12v12" />,
);
export const ArrowDown = glyph(
  "arrow-down",
  <path d="M12 3v17m-6-6 6 6 6-6" />,
);
export const ArrowLeft = glyph("arrow-left", <path d="M21 12H4m6-6-6 6 6 6" />);
export const ChevronDown = glyph("chevron", <path d="m5 9 7 7 7-7" />);
export const Landmark = glyph(
  "organization",
  <>
    <path className="icon-tone" d="m3 8 9-5 9 5v3H3zM5 12h14v9H5z" />
    <path d="m3 8 9-5 9 5M3 11h18M5 15v6m7-6v6m7-6v6M3 21h18" />
  </>,
);
export const ScanFace = glyph(
  "capture",
  <>
    <path className="icon-tone" d="M7 7h10v10H7z" />
    <path d="M3 8V3h5m8 0h5v5m0 8v5h-5m-8 0H3v-5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 10v4m-2-2h4" />
  </>,
);
export const AppWindow = glyph(
  "application",
  <>
    <rect className="icon-tone" x="3" y="4" width="18" height="16" rx="3" />
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 13h4m-4 3h8" />
  </>,
);
export const Smartphone = glyph(
  "device",
  <>
    <rect className="icon-tone" x="6" y="2" width="12" height="20" rx="3" />
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <path d="M10 5h4m-3 14h2M3 9v6m18-6v6" />
  </>,
);
export const Cpu = glyph(
  "native-core",
  <>
    <path className="icon-tone" d="m12 4 8 8-8 8-8-8z" />
    <path d="m12 4 8 8-8 8-8-8zM12 1v3m0 16v3M1 12h3m16 0h3M4 4l2.5 2.5m11 11L20 20M20 4l-2.5 2.5m-11 11L4 20" />
    <path d="m12 9 3 3-3 3-3-3z" />
  </>,
);
export const FileKey2 = glyph(
  "key-statement",
  <>
    <path className="icon-tone" d="M5 3h10l4 4v14H5z" />
    <path d="M14 3H5v18h14V8l-5-5v5h5" />
    <circle cx="10" cy="13" r="2" />
    <path d="m11.5 14.5 3 3m-1.5-1.5 1.5-1.5" />
  </>,
);
export const Server = glyph(
  "verification",
  <>
    <path className="icon-tone" d="M3 4h18v6H3zM3 14h18v6H3z" />
    <path d="M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01M12 7h5m-5 10h5M12 10v4" />
  </>,
);
export const Layers3 = glyph(
  "layers",
  <>
    <path className="icon-tone" d="m12 3 10 5-10 5L2 8z" />
    <path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5" />
  </>,
);
export const LockKeyhole = glyph(
  "trust-boundary",
  <>
    <path className="icon-tone" d="m12 2 9 4v7c0 5-9 9-9 9S3 18 3 13V6z" />
    <path d="m12 2 9 4v7c0 5-9 9-9 9S3 18 3 13V6z" />
    <circle cx="12" cy="11" r="2" />
    <path d="M12 13v4" />
  </>,
);
export const PanelLeft = glyph(
  "workspace",
  <>
    <rect className="icon-tone" x="3" y="4" width="6" height="16" rx="2" />
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16M5.5 8h1M5.5 12h1" />
  </>,
);
export const FileCheck2 = glyph(
  "request",
  <>
    <path className="icon-tone" d="M5 3h10l4 4v14H5z" />
    <path d="M14 3H5v18h14V8l-5-5v5h5M8 14l3 3 5-6" />
  </>,
);
export const Check = glyph(
  "check",
  <>
    <path className="icon-tone" d="m2 12 6 7L22 4 9 15z" />
    <path d="m4 12 5 5L20 6" />
  </>,
);
export const Clock3 = glyph(
  "lease",
  <>
    <circle className="icon-tone" cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 1 1-9 9M12 6v6l4 2M3 4v4h4" />
  </>,
);
export const CircleHelp = glyph(
  "unknown",
  <>
    <path className="icon-tone" d="m12 2 10 10-10 10L2 12z" />
    <path d="m12 2 10 10-10 10L2 12zM9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16h.01" />
  </>,
);
export const X = glyph(
  "rejected",
  <>
    <path className="icon-tone" d="m12 2 10 10-10 10L2 12z" />
    <path d="m7 7 10 10M17 7 7 17" />
  </>,
);
export const RotateCcw = glyph(
  "reset",
  <path d="M4 4v5h5M4 9a8 8 0 1 1 1 9" />,
);
export const Download = glyph(
  "download",
  <>
    <path className="icon-tone" d="M3 15h18v6H3z" />
    <path d="M12 3v12m-4-4 4 4 4-4M3 16v5h18v-5" />
  </>,
);
export const Info = glyph(
  "information",
  <>
    <circle className="icon-tone" cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7h.01" />
  </>,
);
export const BookOpen = glyph(
  "documentation",
  <>
    <path className="icon-tone" d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3z" />
    <path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15M6 8h3m-3 4h3m6-4h3m-3 4h3" />
  </>,
);
export const Menu = glyph(
  "menu",
  <>
    <path className="menu-line-first" d="M4 8h16" />
    <path className="menu-line-last" d="M4 16h12" />
    <circle
      className="menu-dot"
      cx="20"
      cy="16"
      r="1"
      fill="currentColor"
      stroke="none"
    />
  </>,
);
