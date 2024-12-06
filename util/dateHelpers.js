import { DateTime } from "luxon";

export const formatDate = (rawDate) => {
  const date = new Date(rawDate);

  const monthOptions = { month: "short" };
  const month = date.toLocaleString("en-UK", monthOptions, { timeZone: "UTC" });

  const day = date.getUTCDate();

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };
  const time = date.toLocaleString("en-UK", timeOptions);

  return `${day} ${month} at ${time}`;
};

// convert a date string to a luxon DateTime object in UTC
export const formatToUTCDateTime = (rawDate) => {
  return DateTime.fromISO(rawDate, { zone: "utc" }).toUTC();
};

// check for overlapping date ranges
// {false}.C1.|.C2.{true}
// inA 3:00...|..inA 3:00
// outA 5:00..|..outA 5:00
// inB 6:00...|..inB 4:56
// outB 8:00..|..outB 6:00
export const hasDateRangesOverlap = (
  checkInA,
  checkOutA,
  checkInB,
  checkOutB
) => checkInA < checkOutB && checkOutA > checkInB;

// John Doe's Room
// checkInA: 7 Dec at 14:54
// checkOutA: 20 Dec at 16:56

// John Doe's Room
// checkInB: 7 Dec at 14:57
// checkOutB: 8 Dec at 16:57
