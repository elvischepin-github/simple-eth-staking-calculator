const { convertArrayToCSV } = require("convert-array-to-csv");
const fileSystem = require("node:fs");

const csvFile = [];

class StakingInfo {
  #initialInvestment;
  #yearlyStakingRewardRate;
  #startDate;
  #durationInMonths;
  #rewardPaymentDay;
  #gainedMonthlyReward;
  #isReinvesting;

  constructor() {
    this.initialInvestment = parseFloat(25).toFixed(6);

    this.yearlyStakingRewardRate = parseFloat(10).toFixed(2);

    this.startDate = new Date();
    this.startDate.setFullYear(2025);
    this.startDate.setMonth(4);
    this.startDate.setDate(2);
    this.startDate.setHours(3, 0, 0, 0); // GMT+3

    this.durationInMonths = 24;

    this.rewardPaymentDay = 23;

    this.gainedMonthlyReward = 0;

    this.isReinvesting = true;
  }

  getInitialInvestment() {
    return this.initialInvestment;
  }
  getYearlyStakingRewardRate() {
    return this.yearlyStakingRewardRate;
  }
  getDurationInMonths() {
    return this.durationInMonths;
  }
  getRewardPaymentDay() {
    return this.rewardPaymentDay;
  }
  getGainedMonthlyReward() {
    return this.gainedMonthlyReward;
  }
  getIsReinvesting() {
    return this.isReinvesting;
  }
}

const customerInvestment = new StakingInfo();

const testData = [
  {
    Line: 1,
    Reward_Date: `${customerInvestment.startDate.getFullYear()}-${customerInvestment.startDate
      .getMonth()
      .toString()
      .padStart(2, "0")}-${customerInvestment.startDate
      .getDate()
      .toString()
      .padStart(2, "0")}`,
    Investment_Amount: `${customerInvestment.getInitialInvestment()}`,
    Current_Month_Reward_Amount: "?.??????",
    Total_Reward_Amount_To_Date: "?.??????",
    Staking_Reward_Rate: customerInvestment.getYearlyStakingRewardRate() + "%",
  },
];
const headers = Object.keys(testData[0]);

csvFile.push(headers);

testData.forEach((item) => {
  csvFile.push(Object.values(item));
});

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
