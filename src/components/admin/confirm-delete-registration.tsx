"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";

export function ConfirmDeleteRegistration({
  id,
  action,
  label = "Delete",
  message = "Delete this registration? This cannot be undone.",
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label?: string;
  message?: string;
}) {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(message)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  return (
    <form action={action} className="flex items-center justify-between gap-2">
      <input type="hidden" name="id" value={id} />
      <div className="text-sm">Delete registration</div>
      <Button type="submit" size="sm" variant="destructive" onClick={onClick}>
        {label}
      </Button>
    </form>
  );
}
