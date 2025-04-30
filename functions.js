const { eachDayOfInterval, startOfMonth, endOfMonth } = require("date-fns");

function actualBy365(
  index,
  durationInMonthsArg,
  startDateArg,
  rewardDateArg,
  paymentDayArg,
  rateArg,
  investmentArg
) {
  let actualDays;

  // Dynamic shared current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(rewardDateArg),
    end: endOfMonth(rewardDateArg),
  }).map((day) => {
    // Mapping to set whole month days to correct hours because by default first day is from previous month UTC+0
    const newDay = new Date(day);
    newDay.setHours(3, 0, 0, 0); // GMT+3
    return newDay;
  });

  // Dynamic shared last month
  const lastMonth = new Date(rewardDateArg);
  lastMonth.setMonth(lastMonth.getUTCMonth() - 1);

  const lastDaysInMonth = eachDayOfInterval({
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth),
  }).map((day) => {
    const newDay = new Date(day);
    newDay.setHours(3, 0, 0, 0); // GMT+3
    return newDay;
  });

  // EXIT
  if (index > durationInMonthsArg + 1) {
    return 0;
  }

  // FIRST MONTH
  if (index === 1) {
    if (startDateArg.getUTCDate() <= paymentDayArg) {
      // Reward date is in the same month

      actualDays = paymentDayArg - startDateArg.getUTCDate() - 1;
    } else {
      // Reward date is moved to another month

      actualDays =
        lastDaysInMonth.length - startDateArg.getUTCDate() + paymentDayArg;
    }
  }

  // IN BETWEEN MONTHS
  if (index > 1 && index < durationInMonthsArg + 1) {
    actualDays = lastDaysInMonth.length - 1;
  }

  // LAST MONTH
  if (index == durationInMonthsArg + 1) {
    let lastDay = startDateArg.getUTCDate();
    // Not overlapping to other period
    if (paymentDayArg <= startDateArg.getUTCDate()) {
      lastDay = paymentDayArg;
    }

    actualDays = lastDaysInMonth.length - paymentDayArg + lastDay - 1; // Not including the last day
  }

  return (actualDays / 365) * (rateArg / 100) * investmentArg;
}
module.exports = actualBy365;
