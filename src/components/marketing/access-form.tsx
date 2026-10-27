"use client";
import { useState, useRef, useSyncExternalStore, type FormEvent } from "react";
import { Download, Info } from "@/components/ui/icons";
const fields = [
  { name: "name", label: "Name", autoComplete: "name", max: 100 },
  { name: "email", label: "Work email", autoComplete: "email", max: 254 },
  {
    name: "organization",
    label: "Organization",
    autoComplete: "organization",
    max: 160,
  },
  { name: "role", label: "Role", autoComplete: "organization-title", max: 100 },
] as const;
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function AccessForm() {
  // Prevent native GET submission before hydration or when JavaScript is unavailable.
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientReady,
    serverReady,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  function downloadDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const data = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const value = String(data.get(field.name) ?? "").trim();
      if (!value)
        nextErrors[field.name] = `Enter your ${field.label.toLowerCase()}.`;
      else if (value.length > field.max)
        nextErrors[field.name] = `Use at most ${field.max} characters.`;
    }
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address.";
    if (!data.get("integration"))
      nextErrors.integration = "Choose an intended integration.";
    if (String(data.get("message") ?? "").length > 2000)
      nextErrors.message = "Use at most 2,000 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    const lines = [
      "Nexus access request — LOCAL DRAFT",
      "Not submitted. No access has been requested or granted.",
      "",
      ...[
        ...fields,
        { name: "integration", label: "Intended integration" },
        { name: "message", label: "Message" },
      ].map(
        ({ name, label }) => `${label}: ${String(data.get(name) ?? "").trim()}`,
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexus-access-request-draft.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      "Draft download started. This request has not been submitted. Your entries remain here until you leave or reload this page.",
    );
  }
  return (
    <div className="access-form-panel">
      <div className="form-notice" id="intake-status">
        <Info size={20} aria-hidden="true" />
        <div>
          <strong>Access intake is not open yet</strong>
          <p>
            You can prepare and download a local draft. No information is sent
            to Nexus, and downloading does not reserve access.
          </p>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={downloadDraft}
        noValidate
        aria-describedby="intake-status form-privacy"
      >
        <fieldset disabled={!hydrated} className="draft-fields">
          <div className="form-grid">
            {fields.map((field) => (
              <div className="field" key={field.name}>
                <label htmlFor={field.name}>
                  {field.label} <span aria-hidden="true">*</span>
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.name === "email" ? "email" : "text"}
                  autoComplete={field.autoComplete}
                  maxLength={field.max}
                  required
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                />
                <p className="field-error" id={`${field.name}-error`}>
                  {errors[field.name]}
                </p>
              </div>
            ))}
          </div>
          <div className="field">
            <label htmlFor="integration">
              Intended integration <span aria-hidden="true">*</span>
            </label>
            <select
              id="integration"
              name="integration"
              required
              defaultValue=""
              aria-invalid={!!errors.integration}
              aria-describedby={
                errors.integration ? "integration-error" : undefined
              }
            >
              <option value="" disabled>
                Select your use case
              </option>
              <option>Android staging evaluation</option>
              <option>Native Rust / C evaluation</option>
              <option>Fintech workflow exploration</option>
              <option>e-KYC workflow exploration</option>
              <option>Other / evaluating fit</option>
            </select>
            <p id="integration-error" className="field-error">
              {errors.integration}
            </p>
          </div>
          <div className="field">
            <label htmlFor="message">
              What are you building? <span className="muted">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              maxLength={2000}
              rows={4}
              aria-describedby="message-help message-error"
              aria-invalid={!!errors.message}
            />
            <p id="message-help" className="small muted">
              Up to 2,000 characters. Do not include credentials or sensitive
              evidence.
            </p>
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          </div>
          <p id="form-privacy" className="small muted">
            Required fields are marked *. Your draft stays in this tab until
            downloaded. Nothing is saved automatically.
          </p>
          <button type="submit" className="button button-primary">
            <Download size={16} aria-hidden="true" />
            Download local draft
          </button>
          <p role="status" className="form-status">
            {status}
          </p>
        </fieldset>
        <noscript>
          <p>
            JavaScript is required to prepare a local draft. Access submission
            remains unavailable.
          </p>
        </noscript>
      </form>
    </div>
  );
}
