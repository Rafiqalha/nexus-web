import Image from "next/image";

// Preserve the supplied emblem; crop its canvas through the presentation frame.
export function BrandEmblem() {
  return (
    <span className="brand-emblem" aria-hidden="true">
      <Image
        src="/icon/Interlocking Nexus N emblem.png"
        alt=""
        width={80}
        height={80}
        sizes="80px"
        loading="eager"
        draggable={false}
      />
    </span>
  );
}
