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

// MAIN CORE FUNCTION
(function funcManageData() {
  // Setting first monthGainedReward
  csi.setMonthGainedReward(
    actualBy365(
      1,
      csi.durationInMonths,
      csi.startDate,
      csi.rewardDate,
      csi.paymentDay,
      csi.rate,
      csi.investment
    )
  );
  csi.setTotalGainedReward(csi.monthGainedReward);

  for (let i = 1; i <= csi.durationInMonths + 1; i++) {
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

        Total_Reward_Amount_To_Date: csi.totalGainedReward.toFixed(6),

        Staking_Reward_Rate: `${csi.getRate().toFixed(2)}%`,
      },
    ];
    data.forEach((item) => {
      csvFile.push(Object.values(item));
    });

    // ITERATIONAL UPDATES
    csi.rewardDate.setMonth(csi.rewardDate.getUTCMonth() + 1);
    csi.setInvestment(csi.investment + csi.monthGainedReward);
    csi.setMonthGainedReward(
      actualBy365(
        i,
        csi.durationInMonths,
        csi.startDate,
        csi.rewardDate,
        csi.paymentDay,
        csi.rate,
        csi.investment
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

fileSystem.writeFile("output.csv", csvFromArrayOfArrays, (err) => {
  if (err) {
    console.log("❌ Error:", err);
  }
  console.log("CSV file saved successfully!");
});
