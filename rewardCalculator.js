const {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  compareAsc,
} = require("date-fns");

function actualBy365(
  index,
  durationInMonthsArg,
  startDateArg,
  rewardDateArg,
  rateChangeDateArg,
  paymentDayArg,
  rateArg,
  rateChangeArg,
  investmentArg,
  isRateChangeArg,
  instanceOfClass
) {
  let actualDays;

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

  // RATE TRANSITION MONTH
  // Checking if rateChange arrived (compareAsc returns 1 as True and -1 as False)
  if (
    !instanceOfClass.getIsChangeRateTransitionMonthCalculated() &&
    isRateChangeArg &&
    compareAsc(rewardDateArg, rateChangeDateArg) == 1
  ) {
    let firstRate, secondRate, firstRateCalc, secondRateCalc, result;

    if (paymentDayArg >= rateChangeDateArg.getUTCDate()) {
      firstRate =
        lastDaysInMonth.length -
        paymentDayArg +
        rateChangeDateArg.getUTCDate() -
        1;
      firstRateCalc = () => {
        return (firstRate / 365) * (rateArg / 100) * investmentArg;
      };

      secondRate = paymentDayArg - rateChangeDateArg.getUTCDate();
      secondRateCalc = () => {
        return (secondRate / 365) * (rateChangeArg / 100) * investmentArg;
      };

      result = firstRateCalc() + secondRateCalc();

      instanceOfClass.setIsChangeRateTransitionMonthCalculated(true);
      return result;
    } else if (paymentDayArg < rateChangeDateArg.getUTCDate()) {
      firstRate = rateChangeDateArg.getUTCDate() - paymentDayArg;

      firstRateCalc = () => {
        return (firstRate / 365) * (rateArg / 100) * investmentArg;
      };

      secondRate =
        lastDaysInMonth.length -
        rateChangeDateArg.getUTCDate() +
        paymentDayArg -
        1;
      secondRateCalc = () => {
        return (secondRate / 365) * (rateChangeArg / 100) * investmentArg;
      };

      result = firstRateCalc() + secondRateCalc();

      instanceOfClass.setIsChangeRateTransitionMonthCalculated(true);
      return result;
    }
  }

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

  return (
    (actualDays / 365) *
    ((instanceOfClass.getIsChangeRateTransitionMonthCalculated()
      ? rateChangeArg
      : rateArg) /
      100) *
    investmentArg
  );
}
module.exports = actualBy365;
