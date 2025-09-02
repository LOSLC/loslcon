type Env =
  | "FEDAPAY_PUBLIC_KEY"
  | "FEDAPAY_PRIVATE_KEY"
  | "FEDA_PAY_ENVIRONMENT"
  | "DATABASE_URL"
  | "DEBUG"
  | "MAIL_SERVICE"
  | "APP_EMAIL"
  | "SMTP_PASSWORD"
  | "APP_BASE_URL"
  | "APP_SECRET"
  | "AUTHORIZED_EMAILS"
  | "SUPPORT_EMAIL";

export function getEnv(key: Env): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
}
