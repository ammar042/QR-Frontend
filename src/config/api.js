const configuredApiUrl = import.meta.env.VITE_API_URL || "https://qr-backend-inky.vercel.app/";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");
