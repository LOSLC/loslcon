import * as React from "react";

export function AutoLinkText({ text }: { text: string }) {
  // Very small, safe-ish URL detector to auto-link http(s) URLs
  const parts = text.split(/(https?:\/\/[\w.-]+(?:\/[\w\-.~:?#@!$&'()*+,;=%]*)?)/gi);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//i.test(part)) {
          try {
            const url = new URL(part);
            return (
              <a key={i} href={url.toString()} target="_blank" rel="noreferrer" style={{ color: "#0284c7" }}>
                {part}
              </a>
            );
          } catch {
            return <React.Fragment key={i}>{part}</React.Fragment>;
          }
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export default function BroadcastMessage({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica Neue, Arial, Noto Sans, sans-serif', lineHeight: 1.6 }}>
      <p>Hi {name},</p>
      <p>
        <AutoLinkText text={message} />
      </p>
      <p style={{ marginTop: 24 }}>— LOSL-CON Team</p>
    </div>
  );
}
