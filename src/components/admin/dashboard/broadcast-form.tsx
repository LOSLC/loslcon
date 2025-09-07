import { broadcastMessage } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function BroadcastForm() {
  return (
    <section className="mt-6 rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-3">Broadcast message</h2>
      <form
        action={async (fd: FormData) => {
          "use server";
          await broadcastMessage(fd);
          redirect("/admin/dashboard");
        }}
        className="grid gap-3 md:grid-cols-4"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="scope">Scope</Label>
          <select id="scope" name="scope" className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="unconfirmed">Unconfirmed</option>
          </select>
        </div>
        <div className="md:col-span-3 grid gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" placeholder="Subject" required />
        </div>
        <div className="md:col-span-4 grid gap-1.5">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            required
            rows={8}
            className="rounded-md border bg-background px-3 py-2 text-sm font-mono"
            placeholder="Write your message using **Markdown** formatting...\n\n# Main Heading\n## Subheading\n\n**Bold text** and *italic text* for emphasis.\n`Code snippets` for technical terms.\n[Links](https://example.com) will be clickable.\n\n- Bullet point lists\n- Work great for organizing info\n\n1. Numbered lists\n2. Are also supported\n\n> Blockquotes for important notes\n\n---\n\nLine breaks and paragraphs are preserved automatically!"
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              🎨 <strong>Full Markdown support:</strong> Headings, **bold**, *italic*, `code`, [links](url), lists, blockquotes
            </div>
            <div>📝 <strong>Beautiful formatting:</strong> Your message will be styled professionally in the email</div>
            <div>👋 <strong>Personalized:</strong> Each email greets the recipient by name</div>
          </div>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <Button type="submit">Send broadcast</Button>
        </div>
      </form>
    </section>
  );
}
