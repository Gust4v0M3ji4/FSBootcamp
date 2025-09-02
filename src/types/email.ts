import {
  SendEmailInputSchema,
  SimulateSendEmailInputSchema,
} from "@/types/email";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

const promptSendEmail = `
You are about to send an email with the following details:

Tone: {{tone}}
To: {{to}}
Subject: {{subject}}
Body: {{body}}
`;

const promptSimulateSendEmail = `
Simulate sending an email with the following details:

To: {{to}}
Subject: {{subject}}
Body: {{body}}
`;

export function registerEmailPrompts(server: McpServer) {
  // Tool real para enviar email
  server.registerPrompt(
    "send-email",
    {
      title: "Send email",
      description:
        "Send an email to a specified recipient with a subject and body content.",
      argsSchema: SendEmailInputSchema.shape,
    },
    ({
      tone,
      to,
      subject,
      body,
    }: {
      tone: string;
      to: string;
      subject: string;
      body: string;
    }) => {
      const prompt = promptSendEmail
        .replace("{{tone}}", tone)
        .replace("{{to}}", to)
        .replace("{{subject}}", subject)
        .replace("{{body}}", body);

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prompt,
            },
          },
        ],
      };
    }
  );

  // Tool para simular el envío de email
  server.registerPrompt(
    "simulate-send-email",
    {
      title: "Simulate send email",
      description: "Simulate sending an email to a specified recipient.",
      argsSchema: SimulateSendEmailInputSchema.shape,
    },
    ({ to, subject, body }: { to: string; subject: string; body: string }) => {
      const prompt = promptSimulateSendEmail
        .replace("{{to}}", to)
        .replace("{{subject}}", subject)
        .replace("{{body}}", body);

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prompt,
            },
          },
        ],
      };
    }
  );
}
