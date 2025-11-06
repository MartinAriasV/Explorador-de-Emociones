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

  const uniqueDates = [
    ...new Set(entries.map(entry => normalizeDate(entry.date)))
  ].sort((a, b) => b - a);

  const oneDay = 24 * 60 * 60 * 1000;
  const today = normalizeDate(new Date());
  
  const mostRecentEntryDate = uniqueDates[0];
  const daysSinceLastEntry = (today - mostRecentEntryDate) / oneDay;

  if (daysSinceLastEntry > 1) {
    return 0; // Streak is broken if it's been more than 1 day
  }

  let streak = 0;
  let hasUsedSecondChance = false;
  
  if (uniqueDates.length > 0) {
      streak = 1; // Start with a streak of 1 for the most recent entry day.
  }

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentEntryDate = uniqueDates[i];
    const previousEntryDate = uniqueDates[i + 1];
    const diff = (currentEntryDate - previousEntryDate) / oneDay;

    if (diff === 1) {
      // Consecutive day
      streak++;
    } else if (diff === 2 && !hasUsedSecondChance) {
      // One day was missed, use the second chance
      streak++;
      hasUsedSecondChance = true;
    } else {
      // More than one day was missed, or second chance was already used. Streak is broken.
      break;
    }
  }

  return streak;
}
