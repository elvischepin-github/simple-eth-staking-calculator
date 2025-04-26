const { convertArrayToCSV } = require("convert-array-to-csv");
const { eachDayOfInterval, startOfMonth, endOfMonth } = require("date-fns");
const fileSystem = require("node:fs");
const StakingInfo = require("./classes.js");

const csvFile = [];
const cs = new StakingInfo(); // CS - Customer

const headers = [
  "Line #",
  "Reward Date",
  "Investment Amount",
  "Current Month Reward Amount",
  "Total Reward Amount To Date",
  "Staking Reward Rate",
];
csvFile.push(headers);

function calculateReward(actualDays, yearDays, rate, investment) {
  return (actualDays / yearDays) * (rate / 100) * investment;
}

(function funcManageData() {
  for (let i = 1; i <= cs.durationInMonths; i++) {
    const data = [
      {
        Line: i,

        Reward_Date: `${cs.startDate.getFullYear()}-${cs.startDate
          .getMonth()
          .toString()
          .padStart(2, "0")}-${cs.startDate
          .getDate()
          .toString()
          .padStart(2, "0")}`,

        Investment_Amount: cs.investment.toFixed(6),

        Current_Month_Reward_Amount: calculateReward(
          30,
          365,
          cs.rate,
          cs.investment
        ).toFixed(6),

        Total_Reward_Amount_To_Date: "?.??????",

        Staking_Reward_Rate: `${cs.getRate().toFixed(2)}%`,
      },
    ];
    data.forEach((item) => {
      csvFile.push(Object.values(item));
    });
    cs.setInvestment(
      cs.investment + calculateReward(30, 365, cs.rate, cs.investment)
    );
  }
})();

// /////////////////////////////////////////////////////////////////////////
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
// /////////////////////////////////////////////////////////////////////////

// const date = new Date("2025-04-01");
// date.setFullYear(2025);

// const daysInMonth = eachDayOfInterval({
//   start: startOfMonth(date),
//   end: endOfMonth(date),
// }).map((day) => {
//   const newDay = new Date(day);
//   newDay.setHours(3, 0, 0, 0); // GMT+3
//   return newDay;
// });
// console.log(daysInMonth);
// console.log(daysInMonth.length);
