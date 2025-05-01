const { convertArrayToCSV } = require("convert-array-to-csv");
const fileSystem = require("node:fs");
const actualBy365 = require("./rewardCalculator.js");

function funcManageData(csi) {
  const csvFile = [];
  const headers = [
    "Line #",
    "Reward Date",
    "Investment Amount",
    "Current Month Reward Amount",
    "Total Reward Amount To Date",
    "Staking Reward Rate",
  ];
  csvFile.push(headers);

  // ITERATIONS
  for (let i = 1; i <= csi.getDurationInMonths(); i++) {
    // Debugging loggers
    // console.log("investment:", csi.getInvestment());
    // console.log("monthGainedReward:", csi.getMonthGainedReward());
    // console.log("rateChangeDate:", csi.rateChangeDate);
    // console.log("totalGainedReward:", csi.getTotalGainedReward());
    // console.log("rateChange:", csi.getRateChange());
    // console.log("rate:", csi.getRate());

    // If first month
    if (i === 1) {
      csi.setMonthGainedReward(
        actualBy365(
          i,
          csi.getDurationInMonths(),
          csi.startDate,
          csi.rewardDate,
          csi.rateChangeDate,
          csi.getPaymentDay(),
          csi.getRate(),
          csi.getRateChange(),
          csi.getInvestment(),
          csi.getIsRateChange(),
          csi
        )
      );
      csi.setTotalGainedReward(csi.getMonthGainedReward());
    }

    // Setting last months day, if start day is less or equal to than payment day
    if (
      i == csi.durationInMonths + 1 &&
      csi.getPaymentDay() >= csi.startDate.getUTCDate()
    ) {
      csi.rewardDate.setDate(csi.startDate.getUTCDate());
    }

    const row = [
      i,
      `${csi.rewardDate.getUTCFullYear()}-${(csi.rewardDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${csi.rewardDate
        .getUTCDate()
        .toString()
        .padStart(2, "0")}`,
      csi.getInvestment().toFixed(6),
      csi.getMonthGainedReward().toFixed(6),
      csi.getTotalGainedReward().toFixed(6),
      `${
        csi.getIsRateChange() &&
        csi.rateChangeDate &&
        csi.rewardDate >= csi.rateChangeDate
          ? csi.getRateChange().toFixed(2)
          : csi.getRate().toFixed(2)
      }%`,
    ];

    csvFile.push(row);

    // INCREMENTS
    if (i <= csi.getDurationInMonths()) {
      csi.rewardDate.setMonth(csi.rewardDate.getUTCMonth() + 1);
    }

    if (csi.getIsReinvesting()) {
      csi.setInvestment(csi.getInvestment() + csi.getMonthGainedReward());
    }

    // Calculating the next month
    csi.setMonthGainedReward(
      actualBy365(
        i + 1,
        csi.getDurationInMonths(),
        csi.startDate,
        csi.rewardDate,
        csi.rateChangeDate,
        csi.getPaymentDay(),
        csi.getRate(),
        csi.getRateChange(),
        csi.getInvestment(),
        csi.getIsRateChange(),
        csi
      )
    );

    csi.setTotalGainedReward(
      csi.getMonthGainedReward() + csi.getTotalGainedReward()
    );
  }

  // EXPORTING
  const csvFromArrayOfArrays = convertArrayToCSV(csvFile, {
    separator: ";",
  });

  const finalExport = `sep=;\n${csvFromArrayOfArrays}`;

  fileSystem.writeFile(
    "output.csv",
    finalExport,
    { encoding: "utf8" },
    (err) => {
      if (err) {
        console.log("❌ Error:", err);
      }
      console.log("✅ CSV file saved successfully!");
    }
  );
}
module.exports = funcManageData;
