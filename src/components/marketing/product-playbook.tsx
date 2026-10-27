"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight, Layers3 } from "@/components/ui/icons";
import { Wordmark } from "./shared";

type Page = {
  id: string;
  title: string;
  content: ReactNode;
  href: string;
  action: string;
};
type Gesture = {
  id: number;
  x: number;
  y: number;
  started: number;
  dragging: boolean;
};

export function ProductPlaybook({ pages }: { pages: Page[] }) {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const consumed = useRef(false);
  const wrap = (index: number) => (index + pages.length) % pages.length;

  function resetDrag() {
    const surface = stage.current;
    if (!surface) return;
    surface.removeAttribute("data-dragging");
    surface.style.removeProperty("--playbook-drag");
    surface.style.removeProperty("--playbook-tilt");
  }

  function select(index: number) {
    resetDrag();
    setActive(wrap(index));
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    consumed.current = false;
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      (event.target as Element).closest(
        "a, button, input, select, textarea, summary",
      )
    )
      return;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      started: performance.now(),
      dragging: false,
    };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    if (!drag.dragging) {
      if (Math.abs(y) > 10 && Math.abs(y) > Math.abs(x)) {
        gesture.current = null;
        return;
      }
      if (Math.abs(x) < 8) return;
      drag.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.setAttribute("data-dragging", "true");
    }
    const distance = Math.max(
      -event.currentTarget.clientWidth * 0.65,
      Math.min(event.currentTarget.clientWidth * 0.65, x),
    );
    event.currentTarget.style.setProperty("--playbook-drag", `${distance}px`);
    event.currentTarget.style.setProperty(
      "--playbook-tilt",
      `${distance * 0.008}deg`,
    );
  }

  function pointerEnd(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const drag = gesture.current;
    gesture.current = null;
    if (!drag || drag.id !== event.pointerId) return;
    const distance = event.clientX - drag.x;
    const threshold = Math.max(
      40,
      Math.min(100, event.currentTarget.clientWidth * 0.12),
    );
    const flick =
      Math.abs(distance) > 18 &&
      Math.abs(distance) / Math.max(1, performance.now() - drag.started) > 0.5;
    consumed.current = !cancelled && drag.dragging;
    if (
      !cancelled &&
      drag.dragging &&
      (Math.abs(distance) > threshold || flick)
    ) {
      select(active + (distance < 0 ? 1 : -1));
    } else resetDrag();
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <section
      className="product-playbook"
      aria-label="Nexus playbook"
      aria-roledescription="carousel"
    >
      <div className="playbook-heading">
        <span>
          <Layers3 size={16} /> The Nexus playbook
        </span>
        <span className="playbook-hint">
          Drag to explore <ArrowRight size={14} />
        </span>
      </div>
      <div
        ref={stage}
        className="playbook-stage"
        tabIndex={0}
        role="group"
        aria-label="Playbook cards. Use the left and right arrow keys to change cards."
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            select(active + (event.key === "ArrowRight" ? 1 : -1));
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            select(event.key === "Home" ? 0 : pages.length - 1);
          }
        }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={(event) => pointerEnd(event)}
        onPointerCancel={(event) => pointerEnd(event, true)}
        onLostPointerCapture={(event) => {
          // Touch starts with implicit capture on the child. Its release bubbles
          // when capture transfers to this surface; only our own loss ends a drag.
          if (event.target === event.currentTarget) {
            gesture.current = null;
            resetDrag();
          }
        }}
        onClickCapture={(event) => {
          if (consumed.current) {
            event.preventDefault();
            event.stopPropagation();
            consumed.current = false;
          }
        }}
      >
        {pages.map((page, index) => {
          const slot = wrap(index - active);
          return (
            <article
              key={page.id}
              className="playbook-card"
              id={`playbook-${page.id}`}
              data-slot={slot}
              style={{ "--playbook-slot": slot } as CSSProperties}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${pages.length}: ${page.title}`}
              aria-hidden={slot !== 0}
              inert={slot !== 0}
            >
              <header className="playbook-card-bar">
                <Wordmark />
                <span className="playbook-card-title">{page.title}</span>
                <span className="mono playbook-page-number">
                  0{index + 1} <span>/ 0{pages.length}</span>
                </span>
              </header>
              <div className="playbook-card-content">{page.content}</div>
              <footer className="playbook-card-footer">
                <span>
                  <span className="status-dot" /> Staging illustration ·
                  Simulated data
                </span>
                <Link href={page.href}>
                  {page.action}
                  <ArrowRight size={14} />
                </Link>
              </footer>
            </article>
          );
        })}
      </div>
      <div className="playbook-navigation">
        <nav aria-label="Playbook chapters">
          {pages.map((page, index) => (
            <button
              key={page.id}
              type="button"
              aria-pressed={active === index}
              aria-controls={`playbook-${page.id}`}
              onClick={() => select(index)}
            >
              <span className="mono">0{index + 1}</span>
              <span>{page.title}</span>
            </button>
          ))}
        </nav>
        <div className="playbook-paging">
          <span
            className="mono"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="sr-only">{pages[active].title}. </span>0
            {active + 1} / 0{pages.length}
          </span>
          <button
            type="button"
            aria-label="Previous playbook card"
            onClick={() => select(active - 1)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next playbook card"
            onClick={() => select(active + 1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
