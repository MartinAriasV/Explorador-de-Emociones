import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DiaryEntry } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a date by setting its time to midnight UTC.
 * This is crucial for comparing dates without timezone interference.
 * @param date The date to normalize (can be a Date object, string, or number).
 * @returns A number representing the milliseconds since the UTC epoch for that day's midnight.
 */
export function normalizeDate(date: Date | string | number): number {
  const d = new Date(date);
  // Set to UTC midnight
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Calculates the daily streak of diary entries, allowing for a one-day grace period (second chance).
 * @param entries An array of diary entries.
 * @returns The number of consecutive days the user has made an entry.
 */
export function calculateDailyStreak(entries: DiaryEntry[]): number {
  if (!entries || entries.length === 0) {
    return 0;
  }

  // Get unique, normalized dates from entries and sort them in descending order
  const uniqueDates = [
    ...new Set(entries.map(entry => normalizeDate(entry.date)))
  ].sort((a, b) => b - a);

  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  // Normalize today's date
  const today = normalizeDate(new Date());
  
  let mostRecentEntryDate = uniqueDates[0];

  // Determine the starting point for streak calculation
  let startDate: number;
  const daysSinceLastEntry = (today - mostRecentEntryDate) / oneDay;

  if (daysSinceLastEntry <= 1) {
    // If last entry was today or yesterday, the streak is active. Start counting from the last entry date.
    startDate = mostRecentEntryDate;
  } else {
    // If it's been more than 1 day, the streak is broken.
    return 0;
  }

  let streak = 0;
  let consecutiveDays = 0;
  let lastDate = startDate + oneDay; // Start checking from the day after the loop's "previous" day

  for (const date of uniqueDates) {
    const diff = lastDate - date;
    if (diff === oneDay) {
      // This is a consecutive day
      consecutiveDays++;
    } else if (diff === 2 * oneDay) {
      // This is a "second chance" day (one day was missed)
      // We allow it once.
      consecutiveDays++;
      // We "use up" the second chance by pretending the missed day was filled.
      lastDate = date + oneDay; 
    } else if (diff > 2 * oneDay) {
      // More than one day was missed, the streak is broken.
      break;
    }
    // If diff is 0, it's multiple entries on the same day, so we just continue
    
    lastDate = date;
    streak = consecutiveDays;
  }
  
  // The first entry always counts as 1 day of streak.
  if (streak === 0 && uniqueDates.length > 0) {
      if(daysSinceLastEntry <= 1) return 1;
  }

  return streak;
}
