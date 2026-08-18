export function isFridayNightRedTeamActive(date: Date): boolean {
  const day = date.getDay();
  const hour = date.getHours();

  return (day === 5 && hour >= 17) || (day === 6 && hour < 5);
}
