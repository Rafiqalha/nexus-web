import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Braces,
  ChevronDown,
  FileCheck2,
  Fingerprint,
  Layers3,
  LockKeyhole,
  PanelLeft,
} from "@/components/ui/icons";
import { Walkthrough } from "@/components/evidence/walkthrough";
import { Wordmark } from "./shared";

export function ProductPreview() {
  return (
    <div className="hero-visual">
      <div className="product-window">
        <aside className="preview-sidebar" aria-label="Illustration resources">
          <div className="preview-workspace">
            <Wordmark />
            <ChevronDown size={14} aria-hidden="true" />
          </div>
          <span className="preview-workspace-label">Developer workspace</span>
          <div className="preview-sidebar-links">
            <Link href="/demo" className="preview-sidebar-selected">
              <FileCheck2 size={16} aria-hidden="true" />
              Request inspection
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <Link href="/product#architecture">
              <Layers3 size={16} aria-hidden="true" /> Evidence flow
            </Link>
            <Link href="/developers">
              <Braces size={16} aria-hidden="true" /> Integration guide
            </Link>
            <Link href="/security">
              <LockKeyhole size={16} aria-hidden="true" /> Trust boundaries
            </Link>
          </div>
          <div className="preview-sidebar-context">
            <span className="preview-workspace-label">Evidence layers</span>
            <span>
              <Activity size={14} aria-hidden="true" /> Session context
            </span>
            <span>
              <Fingerprint size={14} aria-hidden="true" /> Key statement
            </span>
            <span>
              <FileCheck2 size={14} aria-hidden="true" /> Policy evaluation
            </span>
          </div>
          <div className="preview-sidebar-bottom">
            <span className="status-dot" /> Staging illustration
          </div>
        </aside>
        <div className="preview-main">
          <div className="preview-toolbar">
            <span>
              <PanelLeft size={15} aria-hidden="true" /> Workspace{" "}
              <span className="breadcrumb-divider">/</span>{" "}
              <strong>Request inspection</strong>
            </span>
            <Link href="/demo">
              Open demo <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <div className="preview-inspection">
            <Walkthrough />
            <aside
              className="preview-properties"
              aria-label="Illustration scope"
            >
              <span className="preview-properties-heading">
                Inspection context
              </span>
              <dl>
                <div>
                  <dt>Environment</dt>
                  <dd>
                    <span className="status-dot" /> Staging
                  </dd>
                </div>
                <div>
                  <dt>Policy revision</dt>
                  <dd className="mono">demo-policy-v1</dd>
                </div>
                <div>
                  <dt>Evidence scope</dt>
                  <dd>Enrolled key statement</dd>
                </div>
                <div>
                  <dt>Data source</dt>
                  <dd>Illustrative demo</dd>
                </div>
              </dl>
              <div className="preview-scope-note">
                <Fingerprint size={20} aria-hidden="true" />
                <p>
                  Know what was checked.
                  <br />
                  See what remains unknown.
                </p>
              </div>
              <Link href="/security">
                Read the trust boundaries{" "}
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </div>
      <div className="visual-caption">
        <span>
          Illustrative demo <span aria-hidden="true">·</span> Synthetic
          evidence, explicit boundaries.
        </span>
        <Link href="/demo">
          Explore the walkthrough <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
