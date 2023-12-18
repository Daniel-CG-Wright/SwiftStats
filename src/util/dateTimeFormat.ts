// Exports a function to output a date or a datetime in a readable format

/**
 * This function takes a datetime in the format YYYY-MM-DD HH:MM and returns
 * a string in the format "Month Day, Year at HH:MM"
 * @param datetime A datetime in the format YYYY-MM-DD HH:MM
 * @returns A string in the format "Month Day, Year at HH:MM"
 */
export function dateFormat(datetime: string): string {
  const date = new Date(datetime);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${month} ${day}, ${year} at ${time}`;
}

/**
 * This function takes a number of minutes > 1 and returns a string in the format
 * "X hours and Y minutes and Z seconds" or "X hours and Y minutes" or "X hours" or "Y minutes" or "Z seconds" or "W days and X hours and Y minutes and Z seconds"
 * etc
 * @param minutes A number of minutes > 1
 * @returns A string in the format "X hours and Y minutes and Z seconds" or "X hours and Y minutes" or "X hours" or "Y minutes" or "Z seconds" or "W days and X hours and Y minutes and Z seconds"
 */
export function timeFormat(minutes: number): string {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes - days * 1440) / 60);
  const mins = Math.floor(minutes - days * 1440 - hours * 60);
  const secs = Math.floor((minutes - days * 1440 - hours * 60 - mins) * 60);
  let time = "";
  if (days > 0) {
    time += `${days} day${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    if (time !== "") {
      time += ", ";
    }
    time += `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (mins > 0) {
    if (time !== "") {
      time += ", ";
    }
    time += `${mins} minute${mins > 1 ? "s" : ""}`;
  }
  if (secs > 0) {
    if (time !== "") {
      time += ", ";
    }
    time += `${secs.toFixed(0)} second${secs > 1 ? "s" : ""}`;
  }
  return time;
}