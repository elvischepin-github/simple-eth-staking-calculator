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

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(rewardDateArg),
    end: endOfMonth(rewardDateArg),
  }).map((day) => {
    // Mapping to set whole month days to correct hours
    const newDay = new Date(day);
    newDay.setHours(3, 0, 0, 0); // GMT+3
    return newDay;
  });

  if (index > durationInMonthsArg + 1) {
    return 0;
  }

  if (index == 1) {
    if (startDateArg.getDate() >= paymentDayArg) {
      actualDays =
        daysInMonth.length - Number(startDateArg.getDate()) + paymentDayArg;
    } else {
      actualDays = paymentDayArg - Number(startDateArg.getDate());
    }
  }

  if (index > 1 && index < durationInMonthsArg + 1) {
    actualDays = paymentDayArg + (daysInMonth.length - paymentDayArg);
  }

  if (index == durationInMonthsArg + 1) {
    // Need to move one month backwards and get days
    const lastMonth = new Date(rewardDateArg);
    lastMonth.setMonth(lastMonth.getUTCMonth() - 1);

    const newDaysInMonth = eachDayOfInterval({
      start: startOfMonth(lastMonth),
      end: endOfMonth(lastMonth),
    }).map((day) => {
      const newDay = new Date(day);
      newDay.setHours(3, 0, 0, 0); // GMT+3
      return newDay;
    });

    actualDays =
      newDaysInMonth.length - paymentDayArg + Number(startDateArg.getDate());
  }

  return (actualDays / 365) * (rateArg / 100) * investmentArg;
}
module.exports = actualBy365;
