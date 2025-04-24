/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds Total duration in seconds
 * @returns Formatted string like "1h 30min" or "45min"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}min` : ''}`;
  }
  
  return `${minutes}min`;
}
