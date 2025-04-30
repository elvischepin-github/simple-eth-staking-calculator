const {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  compareAsc,
} = require("date-fns");

let isChangeRateMonthCalculated = false;

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
  isRateChangeArg
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

  // // TWO RATE CALCULATION
  // If change rate date happens before reward date
  const previousPaymentDate = new Date(
    rewardDateArg.getFullYear(),
    rewardDateArg.getMonth() - 1,
    paymentDayArg
  );

  console.log("rewardDateArg", rewardDateArg);
  console.log("previousPaymentDate", previousPaymentDate);

  if (
    isRateChangeArg &&
    !isChangeRateMonthCalculated &&
    compareAsc(rateChangeDateArg, previousPaymentDate) !== -1 &&
    compareAsc(rateChangeDateArg, rewardDateArg) === -1
  ) {
    {
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

      const daysWithPreviousRate =
        newDaysInMonth.length -
        paymentDayArg +
        Number(rateChangeDateArg.getUTCDate()) -
        1; // Excluding one day

      const previousRateCalc =
        (daysWithPreviousRate / 365) * (rateArg / 100) * investmentArg;

      const remainingDaysWithChangedRate =
        paymentDayArg - rateChangeDateArg.getUTCDate() + 1; // Including one day

      const changedRateCalc =
        (remainingDaysWithChangedRate / 365) *
        (rateChangeArg / 100) *
        investmentArg;

      isChangeRateMonthCalculated = true;
      return previousRateCalc + changedRateCalc;
    }
  }

  // If change rate date after reward date
  if (
    isRateChangeArg &&
    !isChangeRateMonthCalculated &&
    compareAsc(rateChangeDateArg, rewardDateArg) !== -1
  ) {
    const lastMonth = new Date(rewardDateArg);
    lastMonth.setMonth(lastMonth.getUTCMonth());

    const newDaysInMonth = eachDayOfInterval({
      start: startOfMonth(lastMonth),
      end: endOfMonth(lastMonth),
    }).map((day) => {
      const newDay = new Date(day);
      newDay.setHours(3, 0, 0, 0); // GMT+3
      return newDay;
    });

    // console.log(newDaysInMonth);
    const daysWithPreviousRate = newDaysInMonth.length - paymentDayArg - 1;

    const previousRateCalc =
      (daysWithPreviousRate / 365) * (rateArg / 100) * investmentArg;

    const remainingDaysWithChangedRate =
      newDaysInMonth.length -
      rateChangeDateArg.getUTCDate() +
      1 +
      paymentDayArg;

    const changedRateCalc =
      (remainingDaysWithChangedRate / 365) *
      (rateChangeArg / 100) *
      investmentArg;

    isChangeRateMonthCalculated = true;
    return previousRateCalc + changedRateCalc;
  }

  // Exiting if too many months
  if (index > durationInMonthsArg + 1) {
    return 0;
  }

  // First month
  if (index == 1) {
    if (startDateArg.getDate() >= paymentDayArg) {
      actualDays =
        daysInMonth.length - Number(startDateArg.getDate()) + paymentDayArg;
    } else {
      actualDays = paymentDayArg - Number(startDateArg.getDate());
    }
  }

  // In between months
  if (index > 1 && index < durationInMonthsArg + 1) {
    actualDays = paymentDayArg + (daysInMonth.length - paymentDayArg);
  }

  // Last month
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

  return (
    (actualDays / 365) *
    ((isChangeRateMonthCalculated ? rateChangeArg : rateArg) / 100) *
    investmentArg
  );
}
module.exports = actualBy365;
