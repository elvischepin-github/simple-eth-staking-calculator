const { convertArrayToCSV } = require("convert-array-to-csv");
const fileSystem = require("node:fs");

const StakingInfo = require("./classes.js");
const actualBy365 = require("./functions.js");

const csvFile = [];
const csi = new StakingInfo(); // - Customer investment

const headers = [
  "Line #",
  "Reward Date",
  "Investment Amount",
  "Current Month Reward Amount",
  "Total Reward Amount To Date",
  "Staking Reward Rate",
];
csvFile.push(headers);

// // // MAIN CORE IIFE FUNCTION
(function funcManageData() {
  // // ITERATIONS
  for (let i = 1; i <= csi.durationInMonths + 1; i++) {
    // If first month
    if (i === 1) {
      csi.setMonthGainedReward(
        actualBy365(
          i,
          csi.durationInMonths,
          csi.startDate,
          csi.rewardDate,
          csi.rateChangeDate,
          csi.paymentDay,
          csi.rate,
          csi.rateChange,
          csi.investment,
          csi.isRateChange,
          csi
        )
      );
      csi.setTotalGainedReward(csi.monthGainedReward);
    }

    // Setting last months day, if start day is less or equal to than payment day
    if (
      i == csi.durationInMonths + 1 &&
      csi.getPaymentDay() >= csi.startDate.getUTCDate()
    ) {
      csi.rewardDate.setDate(csi.startDate.getUTCDate());
    }

    const data = [
      {
        Line: i,
        Reward_Date: `${csi.rewardDate.getUTCFullYear()}-${(
          csi.rewardDate.getUTCMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${csi.rewardDate
          .getUTCDate()
          .toString()
          .padStart(2, "0")}`,
        Investment_Amount: csi.investment.toFixed(6),
        Current_Month_Reward_Amount: csi.getMonthGainedReward().toFixed(6),
        Total_Reward_Amount_To_Date: csi.getTotalGainedReward().toFixed(6),
        Staking_Reward_Rate: `${
          csi.getIsChangeRateTransitionMonthCalculated()
            ? csi.rateChange.toFixed(2)
            : csi.getRate().toFixed(2)
        }%`,
      },
    ];
    data.forEach((item) => {
      csvFile.push(Object.values(item));
    });

    // INCREMENTS
    csi.rewardDate.setMonth(csi.rewardDate.getUTCMonth() + 1);

    csi.setInvestment(csi.investment + csi.monthGainedReward);

    // Calculating the next month
    csi.setMonthGainedReward(
      actualBy365(
        i + 1,
        csi.durationInMonths,
        csi.startDate,
        csi.rewardDate,
        csi.rateChangeDate,
        csi.paymentDay,
        csi.rate,
        csi.rateChange,
        csi.investment,
        csi.isRateChange,
        csi
      )
    );

    csi.setTotalGainedReward(
      csi.getMonthGainedReward() + csi.getTotalGainedReward()
    );
  }
})();

// EXPORTING
const csvFromArrayOfArrays = convertArrayToCSV(csvFile, {
  headers,
  separator: ";",
});

const finalExport = `sep=;\n${csvFromArrayOfArrays}`;

fileSystem.writeFile("output.csv", finalExport, { encoding: "utf8" }, (err) => {
  if (err) {
    console.log("❌ Error:", err);
  }
  console.log("CSV file saved successfully!");
});
