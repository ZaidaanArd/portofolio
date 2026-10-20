"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowUpRight, Send } from "lucide-react"
import { personal } from "@/data/personal"
import { ui } from "@/data/ui"

type FormStatus = "idle" | "sending" | "sent" | "fallback" | "error"

const fields = ui.contact.fields

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle")
  // TODO: set NEXT_PUBLIC_FORMSPREE_ID after creating the form in Formspree.
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (data.get("website")) return

    if (!formspreeId) {
      const name = String(data.get("name") ?? "")
      const email = String(data.get("email") ?? "")
      const message = String(data.get("message") ?? "")
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      )

      window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`
      setStatus("fallback")
      return
    }

    setStatus("sending")

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })

      if (!response.ok) throw new Error("Formspree request failed")

      form.reset()
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const feedback = {
    idle: "",
    sending: ui.contact.feedback.sending,
    sent: ui.contact.feedback.sent,
    fallback: ui.contact.feedback.fallback,
    error: `${ui.contact.feedback.error} ${personal.email}`,
  }[status]

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className="border border-on-solid/45 bg-solid/20 px-4 py-3 transition-colors focus-within:border-on-solid/70">
            <label htmlFor={field.id} className="label block text-on-solid/80">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              className="mt-1 w-full bg-transparent px-0 py-2 text-base text-on-solid outline-none placeholder:text-on-solid/35 focus-visible:ring-0"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border border-on-solid/45 bg-solid/20 px-4 py-3 transition-colors focus-within:border-on-solid/70">
        <label htmlFor="message" className="label block text-on-solid/80">
          {ui.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 w-full resize-y bg-transparent px-0 py-2 text-base leading-7 text-on-solid outline-none placeholder:text-on-solid/35 focus-visible:ring-0"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">{ui.contact.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-on-solid px-6 text-sm font-bold text-solid transition-colors hover:bg-accent-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-4 focus-visible:ring-offset-solid disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? ui.contact.sending : ui.contact.send}
          {formspreeId ? (
            <Send size={15} />
          ) : (
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </button>
        <p
          role="status"
          aria-live="polite"
          className="min-h-6 text-sm leading-6 text-on-solid/65"
        >
          {feedback}
        </p>
      </div>
    </form>
  )
}
