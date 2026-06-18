export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  !import.meta.env.VITE_API_URL

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
