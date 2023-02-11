import moment from "moment";

export function getTimeFromMins(mins) {
  // do not include the first validation check if you want, for example,
  // getTimeFromMins(1530) to equal getTimeFromMins(90) (i.e. mins rollover)
  if (mins >= 24 * 60 || mins < 0) {
    throw new RangeError(
      "Valid input should be greater than or equal to 0 and less than 1440."
    );
  }
  var h = (mins / 60) | 0,
    m = mins % 60 | 0;
  // return moment.utc().hours(h).minutes(m);
  return moment.utc().hours(h).minutes(m).format("HH:mm");
}

export function getMinsFromMom(mom) {
  const toJam = mom.hours();
  const jamToMenit = moment.duration(toJam, "h").asMinutes();
  const tomenit = mom.minute();
  const totalMenit = jamToMenit + tomenit;

  return totalMenit;
}
