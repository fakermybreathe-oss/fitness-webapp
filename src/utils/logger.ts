// Simple logger utility for client-side logging
const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(`[Error] ${message}`, error || '');
    }
    // In production, you would send to a logging service like Sentry
  },
  warn: (message: string) => {
    if (import.meta.env.DEV) {
      console.warn(`[Warning] ${message}`);
    }
  },
  info: (message: string) => {
    if (import.meta.env.DEV) {
      console.info(`[Info] ${message}`);
    }
  },
};

export default logger;
