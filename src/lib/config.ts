interface Config {
  openai: {
    apiKey: string;
  };
}

const config: Config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  },
};

export function validateConfig() {
  const missingVars: string[] = [];

  if (!config.openai.apiKey) {
    missingVars.push("VITE_OPENAI_API_KEY");
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please add them to your .env file.",
    );
  }

  return config;
}

export default config;
