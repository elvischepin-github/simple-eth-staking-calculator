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

  if (index == 1) {
    if (startDateArg.getDate() > paymentDayArg) {
      const daysInMonth = eachDayOfInterval({
        start: startOfMonth(rewardDateArg),
        end: endOfMonth(rewardDateArg),
      }).map((day) => {
        const newDay = new Date(day);
        newDay.setHours(3, 0, 0, 0); // GMT+3
        return newDay;
      });
      actualDays =
        daysInMonth.length - Number(startDateArg.getDate()) + paymentDayArg;
    } else {
      actualDays = paymentDayArg - Number(startDateArg.getDate());
    }
  }

  if (index > 1 && index < durationInMonthsArg + 1) {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(rewardDateArg),
      end: endOfMonth(rewardDateArg),
    }).map((day) => {
      const newDay = new Date(day);
      newDay.setHours(3, 0, 0, 0); // GMT+3
      return newDay;
    });

    actualDays = paymentDayArg + (daysInMonth.length - paymentDayArg);
  }

  if (index == durationInMonthsArg + 1) {
    actualDays = Number(startDateArg.getDate());
  }

  return (actualDays / 365) * (rateArg / 100) * investmentArg;
}
module.exports = actualBy365;
