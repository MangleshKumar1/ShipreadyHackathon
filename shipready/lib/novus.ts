export const novus = {
  track: (event: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.log('[Novus]', event, properties)
    }
  },
}
