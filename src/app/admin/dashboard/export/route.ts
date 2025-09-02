import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/dal/session";
import { listConnectedUsers, listRegistrations } from "@/core/dal/admin";

export const dynamic = "force-dynamic";

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "sessions";

  let rows: Array<Record<string, unknown>> = [];
  if (type === "registrations") {
    rows = await listRegistrations();
  } else {
    rows = await listConnectedUsers();
  }

  const csv = toCsv(rows);
  const filename = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;

  // Prepend BOM for better Excel compatibility with UTF-8
  const csvWithBom = "\ufeff" + csv;

  return new Response(csvWithBom, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
