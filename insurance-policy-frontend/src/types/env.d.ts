interface WindowEnvironment {
  VITE_API_BASE_URL: string;
}

declare global {
  interface Window {
    ENV?: WindowEnvironment;
  }
}

export {};
