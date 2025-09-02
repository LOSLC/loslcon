"use client";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { saveRegistrationSettings } from "@/app/actions/loslcon/loslcon";

export function RegistrationSettingsForm({
  defaultOpen,
  defaultCloseDate,
}: {
  defaultOpen: boolean;
  defaultCloseDate?: string | null;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [date, setDate] = useState<Date | undefined>(
    defaultCloseDate ? new Date(defaultCloseDate) : undefined,
  );
  type SaveState = null | { message?: string; error?: string; validationErrors?: Record<string, readonly string[]> };
  const [state, formAction, pending] = useActionState<SaveState, FormData>(saveRegistrationSettings, null);

  return (
    <form action={formAction} className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-3">Registration settings</h2>
    {state && state.error && (
        <div role="alert" className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
      {state.error}
        </div>
      )}
    {state && state.message && (
        <div role="status" className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
      {state.message}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Checkbox
          id="registrationsOpen"
          checked={open}
          onCheckedChange={(v) => setOpen(v === true)}
        />
        <Label htmlFor="registrationsOpen">Registrations open</Label>
        {open ? (
          <input type="hidden" name="registrationsOpen" value="on" />
        ) : null}
      </div>
      <div className="mt-4">
        <Label className="mb-2 block" htmlFor="registrationsCloseDate">
          Close date (optional)
        </Label>
        <div className="rounded-md border p-2 inline-block">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setDate(d)}
          />
        </div>
        {/* Hidden input for server action */}
        <input type="hidden" name="registrationsCloseDate" value={date ? date.toISOString() : ""} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" variant="outline" disabled={Boolean(pending)}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
