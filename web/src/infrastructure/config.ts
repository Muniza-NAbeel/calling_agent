import "server-only";

function requiredServerEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getServerConfig() {
  return {
    apiBaseUrl: requiredServerEnv("API_BASE_URL"),
  } as const;
}

