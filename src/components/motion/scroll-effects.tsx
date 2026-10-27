"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const revealTargets = [
  ".hero-copy > h1",
  ".hero-summary",
  ".hero-visual",
  ".page-intro",
  ".section-heading",
  ".problem-section > div",
  ".flow-grid > li",
  ".capabilities > article",
  ".developer-inner > div",
  ".cta-inner > div",
  ".feature-rows > article",
  ".resource-card",
  ".integration-steps > li",
  ".security-grid > article",
  ".info-columns > article",
  ".security-principle",
  ".company-story > div",
  ".principles > article",
  ".split-section > div",
  ".source-section > div",
  ".access-copy",
  ".access-form-panel",
  ".demo-intro",
];

export function ScrollEffects() {
  const pathname = usePathname();
  const seenElements = useRef(new WeakSet<Element>());
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const tokens = getComputedStyle(root);
    const revealDuration = parseFloat(
      tokens.getPropertyValue("--motion-arrive"),
    );
    const revealStagger = parseFloat(
      tokens.getPropertyValue("--motion-stagger"),
    );
    const revealEasing = tokens.getPropertyValue("--ease-out").trim();
    const signalDuration = parseFloat(
      tokens.getPropertyValue("--motion-signal"),
    );
    const animations = new Set<Animation>();
    const elements = [
      ...document.querySelectorAll<HTMLElement>(
        revealTargets.map((selector) => `main ${selector}`).join(","),
      ),
    ];
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const nativeProgress = CSS.supports("animation-timeline: scroll()");

    function track(animation: Animation) {
      animations.add(animation);
      animation.finished.then(
        () => animations.delete(animation),
        () => animations.delete(animation),
      );
    }

    function setupReveals() {
      observer?.disconnect();
      for (const animation of animations) animation.cancel();
      animations.clear();
      if (media.matches || !("IntersectionObserver" in window)) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (media.matches) return;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const element = entry.target as HTMLElement;
            observer?.unobserve(element);
            // This sibling can commit before streamed page content hydrates.
            // Keep bookkeeping outside React-owned DOM attributes.
            seenElements.current.add(element);
            if (element.contains(document.activeElement)) continue;
            const siblings = element.parentElement?.children;
            const index = siblings ? [...siblings].indexOf(element) : 0;
            const animation = element.animate(
              [{ translate: "0 24px" }, { translate: "0 0" }],
              {
                duration: revealDuration,
                delay: Math.min(index, 3) * revealStagger,
                easing: revealEasing,
                fill: "backwards",
              },
            );
            track(animation);
            for (const path of element.querySelectorAll(".signal-path")) {
              track(
                path.animate(
                  [
                    { strokeDasharray: "420", strokeDashoffset: "420" },
                    { strokeDasharray: "420", strokeDashoffset: "0" },
                  ],
                  { duration: signalDuration, easing: revealEasing },
                ),
              );
            }
          }
        },
        { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
      );

      for (const element of elements) {
        if (!seenElements.current.has(element)) observer.observe(element);
      }
    }

    function updateScroll() {
      frame = 0;
      setScrolled(window.scrollY > 16);
      if (!nativeProgress) {
        const range = root.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty(
          "--reading-progress",
          String(
            range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0,
          ),
        );
      }
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(updateScroll);
    }

    function onAnchor(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self") ||
        link.classList.contains("skip-link")
      )
        return;
      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      let id: string;
      try {
        id = decodeURIComponent(url.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      if (location.hash !== url.hash) window.history.pushState(null, "", url);
      target.scrollIntoView({
        behavior: media.matches ? "instant" : "smooth",
        block: "start",
      });
      target.focus({ preventScroll: true });
    }

    function onFocus(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      // Focused controls must stay still, including during a reveal's stagger delay.
      for (const animation of animations) {
        const effect = animation.effect;
        if (
          effect instanceof KeyframeEffect &&
          effect.target instanceof Element &&
          effect.target.contains(event.target)
        )
          animation.cancel();
      }
    }

    setupReveals();
    onScroll();
    media.addEventListener("change", setupReveals);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("click", onAnchor, true);
    document.addEventListener("focusin", onFocus);
    return () => {
      observer?.disconnect();
      for (const animation of animations) animation.cancel();
      cancelAnimationFrame(frame);
      media.removeEventListener("change", setupReveals);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onAnchor, true);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return (
    <div
      ref={progressRef}
      className="reading-progress"
      data-scrolled={scrolled}
      aria-hidden="true"
    >
      <span />
    </div>
  );
}
