"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "error" | "sent";

const fieldClass =
  "w-full rounded-2xl border border-soft bg-surface px-5 py-4 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent/60";

/**
 * Controlled contact form. There is no backend in this rebuild, so submit
 * validates and shows a confirmation rather than pretending to deliver mail.
 */
export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const update = (key: keyof typeof values) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const valid =
      values.name.trim() !== "" &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email) &&
      values.message.trim() !== "";

    setStatus(valid ? "sent" : "error");
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-card border border-soft bg-surface p-10 text-center"
      >
        <h3 className="text-display-3 font-display text-ink">
          Thanks — we&apos;ve got your message.
        </h3>
        <p className="mt-3 text-body-lg text-muted">
          This rebuild has no mail backend, so nothing was actually sent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-base font-bold text-ink">
          Name
        </label>
        <input
          id="name"
          name="name"
          className={fieldClass}
          value={values.name}
          onChange={(e) => update("name")(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-base font-bold text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={fieldClass}
          value={values.email}
          onChange={(e) => update("email")(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-base font-bold text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${fieldClass} resize-y`}
          value={values.message}
          onChange={(e) => update("message")(e.target.value)}
          placeholder="How can we help?"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-base text-accent">
          Please add your name, a valid email address and a message.
        </p>
      )}

      <Button type="submit" className="w-full sm:w-fit">
        Submit
      </Button>
    </form>
  );
}
