import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { marked } from "marked";

type BroadcastMessageProps = {
  name: string;
  message: string;
};

const colors = {
  background: "oklch(0.9776 0.0144 224.4907)",
  foreground: "oklch(0.2795 0.0368 260.031)",
  card: "oklch(0.9549 0.0326 218.3841)",
  border: "oklch(0.9217 0.026 259.0453)",
  primary: "oklch(0.3851 0.0585 259.9056)",
  primaryForeground: "oklch(0.9776 0.0144 224.4907)",
  mutedForeground: "oklch(0.2749 0.0353 258.9107)",
};

const base = {
  fontFamily:
    "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica Neue, Arial, Noto Sans, sans-serif",
};

// Configure marked with simpler custom styles
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Custom styles for better email compatibility
const customStyles = `
  <style>
    h1, h2, h3, h4, h5, h6 { 
      font-weight: 600; 
      color: ${colors.foreground}; 
      line-height: 1.3; 
      margin: 20px 0 12px 0;
    }
    h1 { font-size: 20px; margin-top: 24px; }
    h2 { font-size: 18px; }
    h3 { font-size: 16px; }
    p { 
      font-size: 16px; 
      line-height: 1.6; 
      margin: 0 0 16px 0; 
      color: ${colors.foreground};
    }
    strong { 
      font-weight: 600; 
      color: ${colors.foreground};
    }
    em { 
      font-style: italic;
    }
    code { 
      background-color: ${colors.card}; 
      padding: 2px 6px; 
      border-radius: 4px; 
      font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; 
      font-size: 14px; 
      border: 1px solid ${colors.border};
    }
    pre { 
      background-color: ${colors.card}; 
      padding: 12px 16px; 
      border-radius: 8px; 
      font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; 
      font-size: 14px; 
      border: 1px solid ${colors.border}; 
      overflow-x: auto; 
      margin: 16px 0;
    }
    a { 
      color: ${colors.primary}; 
      text-decoration: underline; 
      font-weight: 500;
    }
    ul, ol { 
      margin: 16px 0; 
      padding-left: 24px;
    }
    ul { 
      list-style-type: disc;
    }
    ol { 
      list-style-type: decimal;
    }
    li { 
      font-size: 16px; 
      line-height: 1.6; 
      margin: 4px 0; 
      color: ${colors.foreground};
    }
    blockquote { 
      border-left: 4px solid ${colors.primary}; 
      margin: 16px 0; 
      padding: 12px 16px; 
      background-color: ${colors.card}; 
      border-radius: 8px; 
      font-style: italic;
    }
    hr { 
      border: none; 
      border-top: 1px solid ${colors.border}; 
      margin: 24px 0;
    }
  </style>
`;

function MarkdownMessage({ content }: { content: string }) {
  // Process the markdown and return as HTML
  const htmlContent = marked(content) as string;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: customStyles + htmlContent,
      }}
      style={{
        color: colors.foreground,
      }}
    />
  );
}

export default function BroadcastMessage({
  name,
  message,
}: BroadcastMessageProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: colors.background,
          margin: 0,
          padding: 0,
          ...base,
        }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: 24 }}>
          <Section
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 32,
              color: colors.foreground,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <MarkdownMessage content={message} />
            </div>

            <Hr style={{ borderColor: colors.border, margin: "24px 0 20px" }} />
          </Section>

          <Text
            style={{
              textAlign: "center",
              color: colors.mutedForeground,
              fontSize: 12,
              marginTop: 20,
            }}
          >
            © {new Date().getFullYear()} LOSL-CON • Powered by LOSL-C
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
