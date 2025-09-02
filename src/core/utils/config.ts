import { getEnv } from "@/lib/env";

export const appConfig = {
  appBaseUrl: getEnv("APP_BASE_URL"),
  appEmail: getEnv("APP_EMAIL"),
  appName: "Linux & Open Source Lovers Community",
  supportEmail: getEnv("SUPPORT_EMAIL"),
  authorizedEmails: getEnv("AUTHORIZED_EMAILS")
    .split(" ")
    .map((e) => e.toLowerCase()),
};
