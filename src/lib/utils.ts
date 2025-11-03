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
function normalizeDate(date: Date | string | number): number {
  const d = new Date(date);
  // Set to UTC midnight
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Calculates the daily streak of diary entries.
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

  let streak = 0;
  let currentDate = today;

  // Check if there's an entry for today. If not, check for yesterday.
  const mostRecentEntryDate = uniqueDates[0];
  if (mostRecentEntryDate !== today) {
    // If the most recent entry was not today or yesterday, the streak is broken
    if (mostRecentEntryDate !== today - oneDay) {
      return 0;
    }
    // If the most recent entry was yesterday, start checking from yesterday
    currentDate = today - oneDay;
  }
  
  // Find the index of the current date we're checking against
  let dateIndex = uniqueDates.findIndex(d => d === currentDate);

  // If the date is not found, it means no entry for today/yesterday, so streak is 0
  if (dateIndex === -1) {
    return 0;
  }

  // Iterate backwards from the current date
  while (dateIndex < uniqueDates.length) {
    const expectedDate = currentDate - streak * oneDay;
    const actualDate = uniqueDates[dateIndex];
    
    if (actualDate === expectedDate) {
      streak++;
      dateIndex++;
    } else {
      // Break the loop if a day is missing
      break;
    }
  }

  return streak;
}
