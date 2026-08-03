export interface ApiErrorShape {
  message?: string
  title?: string
  errors?: Record<string, string[]>
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  ) {
    const response = (error as { response?: { data?: ApiErrorShape } }).response
    const data = response?.data
    if (data?.message) return data.message
    if (data?.title) return data.title
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0]
      if (firstKey) return data.errors[firstKey][0]
    }
  }
  return fallback
}
