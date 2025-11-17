export function setSession(key: string, value: any) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSession<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const val = sessionStorage.getItem(key)
    return val ? (JSON.parse(val) as T) : defaultValue
  }
  catch (_e) {
    return defaultValue
  }
}

export function removeSession(key: string) {
  sessionStorage.removeItem(key)
}
